from fastapi import APIRouter, UploadFile, File, Form, Header
from fastapi.responses import FileResponse
from pathlib import Path
from typing import Optional
import tempfile, os
from datetime import datetime
from app.services.disease_predictor import get_disease_information
from app.services.pdf_report import generate_crop_report

router = APIRouter(prefix="/disease", tags=["Disease Detection"])

async def _resolve_location(farm_id=None, lat=None, lng=None):
    if farm_id:
        try:
            from app.database import farms_collection
            from bson import ObjectId
            farm = farms_collection.find_one({"_id": ObjectId(farm_id)})
            if farm:
                return farm.get("latitude"), farm.get("longitude"), farm.get("location",""), farm_id
        except Exception:
            pass
    return lat, lng, None, farm_id

@router.post("/predict")
async def predict_disease(file: UploadFile = File(...), crop: Optional[str] = Form(None), farm_id: Optional[str] = Form(None), lat: Optional[float] = Form(None), lng: Optional[float] = Form(None), authorization: Optional[str] = Header(None)):
    from app.services.disease_model import predict_disease_image
    resolved_lat, resolved_lng, farm_location, fid = await _resolve_location(farm_id, lat, lng)
    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        image_path = temp_file.name
        content = await file.read()
        temp_file.write(content)
    try:
        plant, disease, confidence, model_label = predict_disease_image(image_path)
        lookup_crop = plant if plant != "Unknown" else (crop or "Tomato")
        disease_info = get_disease_information(lookup_crop, disease, model_label=model_label)
        response = {"crop": plant, "disease": disease, "confidence": round(confidence * 100, 1) if confidence <= 1 else round(confidence, 1), "model_label": model_label}
        if disease_info:
            response.update({"severity": disease_info.get("severity", "Medium"), "warning_signs": disease_info.get("warning_signs", []), "advice": disease_info.get("advice", ""), "treatment": disease_info.get("treatment", ""), "active_ingredient": disease_info.get("active_ingredient", ""), "application": disease_info.get("application", ""), "safety_note": disease_info.get("safety_note", "")})
            for k in ("category", "causal_agent", "fertilizer_guidance"):
                if k in disease_info: response[k] = disease_info[k]
        weather_data = None
        if resolved_lat is not None and resolved_lng is not None:
            try:
                from app.services.weather_service import get_weather_for_location
                from app.services.risk_engine import compute_disease_risk
                weather = await get_weather_for_location(resolved_lat, resolved_lng)
                risk = compute_disease_risk(temperature=weather["temperatureC"], humidity=weather["humidityPercent"], wind_speed_kmh=weather["windSpeedKmh"])
                weather_data = weather
                ai_score = confidence * 100 if confidence <= 1 else confidence
                wx_score = risk["diseaseRiskScore"]
                overall_score = (ai_score * 0.6) + (wx_score * 0.4)
                overall_severity = "HIGH" if overall_score >= 80 else ("MODERATE" if overall_score >= 55 else "LOW")
                response["weatherRisk"] = {"location": weather["location"], "coordinates": {"lat": resolved_lat, "lng": resolved_lng}, "temperatureC": weather["temperatureC"], "condition": weather["condition"], "humidityPercent": weather["humidityPercent"], "windSpeedKmh": weather["windSpeedKmh"], "rainfallChancePercent": weather["rainfallChancePercent"], "forecastSummary": weather["forecastSummary"], "diseaseRiskIndex": risk["diseaseRiskIndex"], "diseaseRiskScore": risk["diseaseRiskScore"], "diseaseRiskReason": risk["diseaseRiskReason"], "pathogenRisk": risk.get("pathogenRisk", {}), "sporeDispersalRangeKm": risk.get("sporeDispersalRangeKm", 0)}
                response["overallSeverity"] = overall_severity
                response["overallRiskScore"] = round(overall_score, 1)
                response["message"] = "AI detected " + plant + " -- " + disease + ". Weather for " + weather["location"] + ": " + risk["diseaseRiskIndex"] + " disease risk. Overall: " + overall_severity + "."
            except Exception as e:
                response["weatherRisk"] = {"error": str(e)}
                response["message"] = "AI prediction done, weather fetch failed."
        else:
            response["message"] = "AI detected " + plant + " -- " + disease + ". No location set."
        user_id = None
        if authorization and authorization.startswith("Bearer "):
            try:
                from app.routes.auth import decode_token
                token = authorization.split(" ")[1]
                payload = decode_token(token)
                user_id = payload["user_id"]
            except Exception:
                pass
        if user_id:
            try:
                from app.database import reports_collection
                report = {"userId": user_id, "farmId": fid, "cropName": plant, "disease": disease, "confidence": response["confidence"], "diseaseCategory": response.get("category"), "causalAgent": response.get("causal_agent"), "severity": response.get("severity"), "weather": weather_data, "riskScore": response.get("overallRiskScore"), "overallSeverity": response.get("overallSeverity"), "treatment": response.get("treatment"), "activeIngredient": response.get("active_ingredient"), "safetyNote": response.get("safety_note"), "status": "pending", "createdAt": datetime.utcnow().isoformat()}
                result = reports_collection.insert_one(report)
                response["report_id"] = str(result.inserted_id)
            except Exception:
                pass
        return response
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)
@router.post("/report")
async def generate_report(file: UploadFile = File(...), crop: Optional[str] = Form(None), farm_id: Optional[str] = Form(None), farmer_name: str = Form("Farmer"), phone: str = Form("Not provided"), location: str = Form("Not provided"), lat: Optional[float] = Form(None), lng: Optional[float] = Form(None)):
    from app.services.disease_model import predict_disease_image
    resolved_lat, resolved_lng, farm_location, fid = await _resolve_location(farm_id, lat, lng)
    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        image_path = temp_file.name
        content = await file.read()
        temp_file.write(content)
    try:
        plant, disease, confidence, model_label = predict_disease_image(image_path)
        confidence_pct = round(confidence * 100, 1) if confidence <= 1 else round(confidence, 1)
        lookup_crop = plant if plant != "Unknown" else (crop or "Tomato")
        disease_info = get_disease_information(lookup_crop, disease, model_label=model_label)
        if disease_info is None:
            return {"crop": plant, "disease": disease, "confidence": confidence_pct, "message": "Disease detected, report info unavailable."}
        weather_section = None
        if resolved_lat is not None and resolved_lng is not None:
            try:
                from app.services.weather_service import get_weather_for_location
                from app.services.risk_engine import compute_disease_risk
                weather = await get_weather_for_location(resolved_lat, resolved_lng)
                risk = compute_disease_risk(temperature=weather["temperatureC"], humidity=weather["humidityPercent"], wind_speed_kmh=weather["windSpeedKmh"])
                weather_section = {**weather, **risk}
            except Exception:
                pass
        pdf_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        pdf_path = pdf_file.name
        pdf_file.close()
        generate_crop_report(output_path=pdf_path, farmer_name=farmer_name, phone=phone, location=weather_section.get("location", farm_location or location) if weather_section else (farm_location or location), crop=plant, disease=disease, confidence=confidence_pct, severity=disease_info.get("severity", "Medium"), warning_signs=disease_info.get("warning_signs", []), advice=disease_info.get("advice", ""), treatment=disease_info.get("treatment", ""), active_ingredient=disease_info.get("active_ingredient", ""), application=disease_info.get("application", ""), safety_note=disease_info.get("safety_note", ""), weather_risk=weather_section)
        return FileResponse(pdf_path, media_type="application/pdf", filename=plant + "_crop_health_report.pdf")
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)
