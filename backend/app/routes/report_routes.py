from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from pydantic import BaseModel
from bson import ObjectId

from app.database import disease_reports_collection
from app.routes.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Disease Reports"])


class ReportBody(BaseModel):
    farmId: str = ""
    cropName: str = ""
    disease: str = ""
    confidence: float = 0
    severity: str = ""
    weatherRisk: str = ""
    overallSeverity: str = ""
    overallRiskScore: float = 0
    advice: str = ""
    treatment: str = ""


def get_user_id(user):
    return user.get("sub") or user.get("user_id") or user.get("email", "")


@router.post("/")
def save_report(body: ReportBody, user=Depends(get_current_user)):
    uid = get_user_id(user)
    report = {
        "userId": uid,
        "farmId": body.farmId,
        "cropName": body.cropName,
        "disease": body.disease,
        "confidence": body.confidence,
        "severity": body.severity,
        "weatherRisk": body.weatherRisk,
        "overallSeverity": body.overallSeverity,
        "overallRiskScore": body.overallRiskScore,
        "advice": body.advice,
        "treatment": body.treatment,
        "status": "pending",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    result = disease_reports_collection.insert_one(report)
    report["id"] = str(result.inserted_id)
    report.pop("_id", None)
    return report


@router.get("/")
def get_my_reports(user=Depends(get_current_user)):
    uid = get_user_id(user)
    reports = list(disease_reports_collection.find({"userId": uid}).sort("createdAt", -1))
    for r in reports:
        r["id"] = str(r["_id"])
        r.pop("_id", None)
    return reports


@router.get("/stats/summary")
def get_stats(user=Depends(get_current_user)):
    uid = get_user_id(user)
    reports = list(disease_reports_collection.find({"userId": uid}))
    total = len(reports)
    diseases = {}
    severity_counts = {"LOW": 0, "MODERATE": 0, "HIGH": 0, "CRITICAL": 0}
    for r in reports:
        d = r.get("disease", "Unknown")
        diseases[d] = diseases.get(d, 0) + 1
        sev = r.get("overallSeverity", r.get("severity", "LOW"))
        severity_counts[sev] = severity_counts.get(sev, 0) + 1
    return {
        "totalScans": total,
        "diseases": diseases,
        "severityBreakdown": severity_counts,
        "topDiseases": sorted(diseases.items(), key=lambda x: x[1], reverse=True)[:5],
    }


@router.get("/{report_id}")
def get_report(report_id: str, user=Depends(get_current_user)):
    uid = get_user_id(user)
    try:
        report = disease_reports_collection.find_one({"_id": ObjectId(report_id), "userId": uid})
    except Exception:
        report = disease_reports_collection.find_one({"_id": report_id, "userId": uid})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report["id"] = str(report["_id"])
    report.pop("_id", None)
    return report


@router.patch("/{report_id}/status")
def update_report_status(report_id: str, status: str, user=Depends(get_current_user)):
    uid = get_user_id(user)
    try:
        result = disease_reports_collection.update_one(
            {"_id": ObjectId(report_id), "userId": uid},
            {"$set": {"status": status}},
        )
    except Exception:
        result = disease_reports_collection.update_one(
            {"_id": report_id, "userId": uid},
            {"$set": {"status": status}},
        )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Status updated", "status": status}
