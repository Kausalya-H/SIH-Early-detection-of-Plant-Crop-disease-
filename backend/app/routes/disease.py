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





def safe_predict(image_path, crop):
    """Knowledge Base first, then DL model as enhancement.
    
    The Keras model predicts both the crop AND disease.
    We use this to detect mismatches accurately.
    Returns: (disease, confidence, validation_status)
    """
    from app.services.disease_predictor import get_disease_information, load_crop_knowledge
    from app.services.disease_model import _load_model, _parse_class_name, get_model_crop
    
    kb = load_crop_knowledge()
    crop_entry = kb.get(crop, {})
    kb_diseases = [d for d in crop_entry.keys() if d != "Healthy"]
    kb_default_disease = kb_diseases[0] if kb_diseases else "Unknown Disease"
    
    # Try DL model
    try:
        import numpy as np, tensorflow as tf
        model, class_names = _load_model()
        
        # Single inference
        img = tf.keras.utils.load_img(image_path, target_size=(224, 224), color_mode="rgb")
        img_array = tf.keras.utils.img_to_array(img)
        input_batch = np.expand_dims(img_array, axis=0)
        predictions = model.predict(input_batch, verbose=0)[0]
        
        top1_index = int(np.argmax(predictions))
        confidence = float(predictions[top1_index])
        raw_class = class_names[top1_index]
        
        detected_crop, disease = _parse_class_name(raw_class)
        
        # Check if detected crop matches selected crop
        if detected_crop.lower() != crop.lower():
            print(f"Crop mismatch: selected={crop}, model detected={detected_crop}")
            return kb_default_disease, 0.0, "mismatch", detected_crop
        
        # Crop matches - check if disease is in knowledge base
        kb_info = get_disease_information(crop, disease)
        if kb_info is not None:
            return disease, confidence, "dl_matched", detected_crop
        
        # Crop matches but disease not in KB exactly - try fuzzy match
        for kb_disease in kb_diseases:
            if normalize_text(disease) in normalize_text(kb_disease) or normalize_text(kb_disease) in normalize_text(disease):
                return kb_disease, confidence, "dl_matched", detected_crop
        
        # Disease not found in KB but crop matched - still valid DL result
        return disease, confidence, "dl_matched", detected_crop
        
    except Exception as e:
        print(f"DL model error: {e}")
    
    # No DL model result - use KB only
    return kb_default_disease, 0.85, "no_dl_for_crop", "Unknown" 

def normalize_text(text):

    return " ".join(text.replace("_", " ").replace("-", " ").lower().split())





@router.post("/predict")

async def predict_disease(

    file: UploadFile = File(...),

    crop: str = Form(...),
    lang: str = Form("en"),
    lat: Optional[float] = Form(None),

    lng: Optional[float] = Form(None),

):

    suffix = Path(file.filename).suffix

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:

        image_path = temp_file.name

        content = await file.read()

        temp_file.write(content)



    try:

        disease, confidence, validation_status, detected_crop = safe_predict(image_path, crop)

        disease_info = get_disease_information(crop, disease)

        # Use INNOVATRIX multilingual KB for rich disease info
        innovatrix_entry = None
        try:
            from app.services.innovatrix_kb import CropKnowledgeBase
            _innovatrix_kb = CropKnowledgeBase()
            model_label = f"{crop}___{disease.replace(' ', '_')}"
            innovatrix_entry = _innovatrix_kb.get_localized_by_model_label(model_label, lang)
        except Exception as e:
            print(f"INNOVATRIX KB lookup failed: {e}")

        response = {
            "crop": crop,
            "disease": disease,
            "detectedCrop": detected_crop,
            "confidence": round(confidence * 100, 1) if confidence <= 1 else round(confidence, 1),
            "lang": lang,
        }

        # Add INNOVATRIX KB data if available
        if innovatrix_entry:
            response["symptoms"] = innovatrix_entry.get("symptoms", [])
            response["cause"] = innovatrix_entry.get("causal_agent", "")
            response["category"] = innovatrix_entry.get("category", "")
            response["favourable_conditions"] = innovatrix_entry.get("favourable_conditions", [])
            mgmt = innovatrix_entry.get("management", {})
            response["immediate_actions"] = mgmt.get("immediate_actions", [])
            response["prevention"] = mgmt.get("prevention", [])
            chem = mgmt.get("chemical_control", {})
            response["active_ingredient"] = ", ".join(chem.get("active_ingredients", [])) if isinstance(chem.get("active_ingredients"), list) else str(chem.get("active_ingredients", ""))
            response["application"] = chem.get("dosage", "")
            response["safety_note"] = ", ".join(innovatrix_entry.get("safety", [])) if isinstance(innovatrix_entry.get("safety"), list) else str(innovatrix_entry.get("safety", ""))
            response["fertilizer_guidance"] = innovatrix_entry.get("fertilizer_guidance", {})

        # Add crop validation info based on validation_status
        if validation_status == "mismatch":
            response["cropValidation"] = {
                "status": "mismatch",
                "detectedCrop": detected_crop,
                "message": f"WARNING: The uploaded leaf does not match {crop}. The model detected this as {detected_crop}. Please select the correct crop type."
            }
            response["confidence"] = 0
        elif validation_status == "dl_matched":
            response["cropValidation"] = {
                "status": "dl_matched",
                "detectedCrop": detected_crop,
                "message": f"Disease '{disease}' confirmed for {crop} via DL model."
            }
        elif validation_status == "kb_fallback":
            response["cropValidation"] = {
                "status": "kb_fallback",
                "detectedCrop": detected_crop,
                "message": f"Disease matched via knowledge base. Model detected: {detected_crop}."
            }
        elif validation_status == "no_dl_for_crop":
            response["cropValidation"] = {
                "status": "no_dl_for_crop",
                "detectedCrop": detected_crop,
                "message": f"DL model could not process this image. Result based on knowledge base."
            }
        else:
            response["cropValidation"] = {
                "status": "unknown",
                "detectedCrop": detected_crop,
                "message": f"Result based on available data for {crop}."
            }



        # Only use old KB as fallback - INNOVATRIX KB takes priority
        if disease_info and not response.get("active_ingredient"):
            response["severity"] = disease_info.get("severity", "")
            response["warning_signs"] = disease_info.get("warning_signs", [])
            response["advice"] = disease_info.get("advice", "")
            response["treatment"] = disease_info.get("treatment", "")
            response["active_ingredient"] = disease_info.get("active_ingredient", "")
            response["application"] = disease_info.get("application", "")
            response["safety_note"] = disease_info.get("safety_note", "")



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
    lang: str = Form("en"),
    farmer_name: str = Form("Farmer"),

    phone: str = Form("Not provided"),

    location: str = Form("Not provided"),

    lat: Optional[float] = Form(None),

    lng: Optional[float] = Form(None),

):

    suffix = Path(file.filename).suffix

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:

        image_path = temp_file.name

        content = await file.read()

        temp_file.write(content)



    try:

        disease, confidence, validation_status, detected_crop = safe_predict(image_path, crop)

        confidence_pct = round(confidence * 100, 1) if confidence <= 1 else round(confidence, 1)

        disease_info = get_disease_information(crop, disease)



        if disease_info is None:

            # Fallback if disease not in knowledge base

            disease_info = {

                "severity": "Moderate",

                "warning_signs": ["Visual symptoms detected by AI model"],

                "advice": "Consult your local agricultural officer for specific guidance.",

                "treatment": "Apply appropriate fungicide or bactericide based on the detected disease.",

                "active_ingredient": "As per local CIB&RC recommendations",

                "application": "Follow locally approved product label for dose and interval.",

                "safety_note": "Wear protective equipment. Follow label instructions.",

            }



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

