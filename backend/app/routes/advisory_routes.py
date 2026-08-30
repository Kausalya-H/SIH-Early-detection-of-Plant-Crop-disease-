import json
import os
from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/advisory", tags=["Advisory"])

KB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "crop_disease_kb.json")

@router.get("/diseases")
def get_disease_library(crop: Optional[str] = Query(None), query: Optional[str] = Query(None)):
    try:
        with open(KB_PATH, "r", encoding="utf-8") as f:
            kb = json.load(f)
    except Exception:
        return []

    diseases = []
    for disease_name, info in kb.items():
        crop_name = disease_name.split("___")[0].replace("_", " ") if "___" in disease_name else info.get("crop", "")
        d_name = disease_name.split("___")[1].replace("_", " ") if "___" in disease_name else disease_name

        if crop and crop.lower() != "all" and crop.lower() != crop_name.lower():
            continue
        if query and query.lower() not in d_name.lower() and query.lower() not in crop_name.lower():
            continue

        diseases.append({
            "id": disease_name,
            "crop": crop_name,
            "diseaseName": d_name,
            "commonSymptoms": info.get("warning_signs", []),
            "prevention": info.get("prevention", ""),
            "treatment": info.get("treatment", ""),
            "causalAgent": info.get("causal_agent", ""),
            "category": info.get("disease_category", ""),
        })

    return diseases

@router.get("/advisories")
def get_advisories(category: Optional[str] = Query(None)):
    try:
        with open(KB_PATH, "r", encoding="utf-8") as f:
            kb = json.load(f)
    except Exception:
        return []

    advisories = []
    for disease_name, info in kb.items():
        crop_name = disease_name.split("___")[0].replace("_", " ") if "___" in disease_name else ""
        advisories.append({
            "id": disease_name,
            "title": f"{crop_name} - {info.get('disease_category', 'Health')} Advisory",
            "category": "CROP_HEALTH",
            "severity": "MODERATE",
            "crop": crop_name,
            "message": info.get("advice", ""),
            "issuedBy": "KrishiRakshak AI",
            "issueDate": "",
            "validUntil": "",
        })

    if category and category != "ALL":
        advisories = [a for a in advisories if a["category"] == category]

    return advisories[:20]
