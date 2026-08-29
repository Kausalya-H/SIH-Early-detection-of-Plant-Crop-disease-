from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pathlib import Path
from typing import Optional
import tempfile
import os

from app.services.disease_predictor import get_disease_information
from app.services.pdf_report import generate_crop_report

router = APIRouter(
    prefix="/disease",
    tags=["Disease Detection"]
)


@router.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    crop: str = Form(...),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
):
    from app.services.disease_model import predict_disease_image

    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        image_path = temp_file.name
        content = await file.read()
        temp_file.write(content)

    try:
        disease, confidence = predict_disease_image(image_path)
        disease_info = get_disease_information(crop, disease)

        response = {
            "crop": crop,
            "disease": disease,
            "confidence": round(confidence * 100, 1) if confidence <= 1 else round(confidence, 1),
        }

        if disease_info:
            response.update({
                "severity": disease_info["severity"],
                "warning_signs": disease_info["warning_signs"],
                "advice": disease_info["advice"],
                "treatment": disease_info["treatment"],
                "active_ingredient": disease_info["active_ingredient"],
                "application": disease_info["application"],
                "safety_note": disease_info["safety_note"],
            })

        if lat is not None and lng is not None:
            try:
                from app.services.weather_service import get_weather_for_location
                from app.services.risk_engine import compute_disease_risk

                weather = await get_weather_for_location(lat, lng)
                risk = compute_disease_risk(
                    temperature=weather["temperatureC"],
                    humidity=weather["humidityPercent"],
                    wind_speed_kmh=weather["windSpeedKmh"],
                )

                ai_score = confidence * 100 if confidence <= 1 else confidence
                wx_score = risk["diseaseRiskScore"]
                overall_score = (ai_score * 0.6) + (wx_score * 0.4)

                if overall_score >= 80:
                    overall_severity = "HIGH"
                elif overall_score >= 55:
                    overall_severity = "MODERATE"
                else:
                    overall_severity = "LOW"

                response["weatherRisk"] = {
                    "location": weather["location"],
                    "coordinates": {"lat": lat, "lng": lng},
                    "temperatureC": weather["temperatureC"],
                    "condition": weather["condition"],
                    "humidityPercent": weather["humidityPercent"],
                    "windSpeedKmh": weather["windSpeedKmh"],
                    "rainfallChancePercent": weather["rainfallChancePercent"],
                    "forecastSummary": weather["forecastSummary"],
                    "diseaseRiskIndex": risk["diseaseRiskIndex"],
                    "diseaseRiskScore": risk["diseaseRiskScore"],
                    "diseaseRiskReason": risk["diseaseRiskReason"],
                    "pathogenRisk": risk.get("pathogenRisk", {}),
                    "sporeDispersalRangeKm": risk.get("sporeDispersalRangeKm", 0),
                }
                response["overallSeverity"] = overall_severity
                response["overallRiskScore"] = round(overall_score, 1)
                response["message"] = (
                    "AI disease prediction complete. Real-time weather for "
                    + weather["location"] + " shows "
                    + risk["diseaseRiskIndex"] + " disease risk (score "
                    + str(risk["diseaseRiskScore"]) + "). Overall: "
                    + overall_severity + "."
                )
            except Exception as e:
                response["weatherRisk"] = {"error": str(e)}
                response["message"] = "AI prediction done, weather fetch failed: " + str(e)
        else:
            response["message"] = "AI prediction done. Provide lat/lng for weather risk."

        return response

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)


@router.post("/report")
async def generate_report(
    file: UploadFile = File(...),
    crop: str = Form(...),
    farmer_name: str = Form("Farmer"),
    phone: str = Form("Not provided"),
    location: str = Form("Not provided"),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
):
    from app.services.disease_model import predict_disease_image

    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        image_path = temp_file.name
        content = await file.read()
        temp_file.write(content)

    try:
        disease, confidence = predict_disease_image(image_path)
        confidence_pct = round(confidence * 100, 1) if confidence <= 1 else round(confidence, 1)
        disease_info = get_disease_information(crop, disease)

        if disease_info is None:
            return {"crop": crop, "disease": disease, "confidence": confidence_pct,
                    "message": "Disease detected, report info unavailable."}

        weather_section = None
        if lat is not None and lng is not None:
            try:
                from app.services.weather_service import get_weather_for_location
                from app.services.risk_engine import compute_disease_risk
                weather = await get_weather_for_location(lat, lng)
                risk = compute_disease_risk(
                    temperature=weather["temperatureC"],
                    humidity=weather["humidityPercent"],
                    wind_speed_kmh=weather["windSpeedKmh"],
                )
                weather_section = {**weather, **risk}
            except Exception:
                pass

        pdf_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        pdf_path = pdf_file.name
        pdf_file.close()

        generate_crop_report(
            output_path=pdf_path,
            farmer_name=farmer_name,
            phone=phone,
            location=weather_section.get("location", location) if weather_section else location,
            crop=crop,
            disease=disease,
            confidence=confidence_pct,
            severity=disease_info["severity"],
            warning_signs=disease_info["warning_signs"],
            advice=disease_info["advice"],
            treatment=disease_info["treatment"],
            active_ingredient=disease_info["active_ingredient"],
            application=disease_info["application"],
            safety_note=disease_info["safety_note"],
            weather_risk=weather_section,
        )

        return FileResponse(pdf_path, media_type="application/pdf",
                           filename=crop + "_crop_health_report.pdf")

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)
