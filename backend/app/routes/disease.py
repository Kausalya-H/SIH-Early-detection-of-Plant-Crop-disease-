from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pathlib import Path
import tempfile
import os

from app.services.disease_predictor import get_disease_information
from app.services.pdf_report import generate_crop_report

router = APIRouter(
    prefix="/disease",
    tags=["Disease Detection"]
)


# ============================================================
# DISEASE PREDICTION
# ============================================================

@router.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    crop: str = Form(...)
):
    # Import model prediction function
    from app.services.disease_model import predict_disease_image

    # Save uploaded image temporarily
    suffix = Path(file.filename).suffix

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        image_path = temp_file.name
        content = await file.read()
        temp_file.write(content)

    try:
        # AI prediction
        disease, confidence = predict_disease_image(image_path)

        # Get information from local knowledge base
        disease_info = get_disease_information(
            crop,
            disease
        )

        if disease_info is None:
            return {
                "crop": crop,
                "disease": disease,
                "confidence": confidence,
                "message": (
                    "AI disease prediction successful, "
                    "but additional information is not available."
                )
            }

        return {
            "crop": crop,
            "disease": disease,
            "confidence": confidence,
            "severity": disease_info["severity"],
            "warning_signs": disease_info["warning_signs"],
            "advice": disease_info["advice"],
            "treatment": disease_info["treatment"],
            "active_ingredient": disease_info["active_ingredient"],
            "application": disease_info["application"],
            "safety_note": disease_info["safety_note"],
            "message": (
                "AI disease prediction and treatment "
                "information retrieved successfully"
            )
        }

    finally:
        # Remove temporary image
        if os.path.exists(image_path):
            os.remove(image_path)


# ============================================================
# PDF CROP HEALTH REPORT
# ============================================================

@router.post("/report")
async def generate_report(
    file: UploadFile = File(...),
    crop: str = Form(...),
    farmer_name: str = Form("Farmer"),
    phone: str = Form("Not provided"),
    location: str = Form("Not provided")
):
    # Import model prediction function
    from app.services.disease_model import predict_disease_image

    # Save uploaded image temporarily
    suffix = Path(file.filename).suffix

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        image_path = temp_file.name
        content = await file.read()
        temp_file.write(content)

    try:
        # ----------------------------------------------------
        # 1. AI disease prediction
        # ----------------------------------------------------

        disease, confidence = predict_disease_image(
            image_path
        )

        # ----------------------------------------------------
        # 2. Get disease information from local JSON
        # ----------------------------------------------------

        disease_info = get_disease_information(
            crop,
            disease
        )

        if disease_info is None:
            return {
                "crop": crop,
                "disease": disease,
                "confidence": confidence,
                "message": (
                    "Disease detected, but report information "
                    "is unavailable."
                )
            }

        # ----------------------------------------------------
        # 3. Create temporary PDF
        # ----------------------------------------------------

        pdf_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        pdf_path = pdf_file.name
        pdf_file.close()

        # ----------------------------------------------------
        # 4. Generate PDF
        # ----------------------------------------------------

        generate_crop_report(
            output_path=pdf_path,
            farmer_name=farmer_name,
            phone=phone,
            location=location,
            crop=crop,
            disease=disease,
            confidence=confidence,
            severity=disease_info["severity"],
            warning_signs=disease_info["warning_signs"],
            advice=disease_info["advice"],
            treatment=disease_info["treatment"],
            active_ingredient=disease_info["active_ingredient"],
            application=disease_info["application"],
            safety_note=disease_info["safety_note"]
        )

        # ----------------------------------------------------
        # 5. Return PDF
        # ----------------------------------------------------

        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{crop}_crop_health_report.pdf"
        )

    finally:
        # Remove temporary uploaded image
        if os.path.exists(image_path):
            os.remove(image_path)