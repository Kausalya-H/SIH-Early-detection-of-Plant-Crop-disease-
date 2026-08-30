from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.database import reports_collection, farms_collection
from app.routes.auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/reports", tags=["Disease Reports"])

@router.post("/")
def save_report(
    userId: str,
    cropName: str,
    disease: str,
    confidence: float,
    farmId: Optional[str] = None,
    cropId: Optional[str] = None,
    diseaseCategory: Optional[str] = None,
    causalAgent: Optional[str] = None,
    severity: Optional[str] = None,
    weather: Optional[dict] = None,
    riskScore: Optional[float] = None,
    overallSeverity: Optional[str] = None,
    treatment: Optional[str] = None,
    activeIngredient: Optional[str] = None,
    safetyNote: Optional[str] = None,
    user_id: str = Depends(get_current_user),
):
    report = {
        "userId": user_id,
        "farmId": farmId,
        "cropId": cropId,
        "cropName": cropName,
        "disease": disease,
        "confidence": confidence,
        "diseaseCategory": diseaseCategory,
        "causalAgent": causalAgent,
        "severity": severity,
        "weather": weather,
        "riskScore": riskScore,
        "overallSeverity": overallSeverity,
        "treatment": treatment,
        "activeIngredient": activeIngredient,
        "safetyNote": safetyNote,
        "status": "pending",
        "createdAt": datetime.utcnow().isoformat(),
    }
    result = reports_collection.insert_one(report)
    return {"message": "Report saved", "report_id": str(result.inserted_id)}

@router.get("/")
def get_my_reports(
    user_id: str = Depends(get_current_user),
    farmId: Optional[str] = Query(None),
    cropName: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
):
    query = {"userId": user_id}
    if farmId:
        query["farmId"] = farmId
    if cropName:
        query["cropName"] = cropName
    if status:
        query["status"] = status
    reports = list(reports_collection.find(query).sort("createdAt", -1).limit(limit))
    for r in reports:
        r["_id"] = str(r["_id"])
    return reports

@router.get("/{report_id}")
def get_report(report_id: str, user_id: str = Depends(get_current_user)):
    try:
        report = reports_collection.find_one({"_id": ObjectId(report_id), "userId": user_id})
    except Exception:
        raise HTTPException(status_code=404, detail="Report not found")
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report["_id"] = str(report["_id"])
    return report

@router.patch("/{report_id}/status")
def update_report_status(
    report_id: str,
    status: str = Query(...),
    user_id: str = Depends(get_current_user),
):
    if status not in ["pending", "confirmed", "flagged"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    try:
        result = reports_collection.update_one(
            {"_id": ObjectId(report_id)},
            {"": {"status": status, "updatedAt": datetime.utcnow().isoformat()}}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Report not found")
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": f"Report status updated to {status}"}

@router.get("/stats/summary")
def get_stats(user_id: str = Depends(get_current_user)):
    total = reports_collection.count_documents({"userId": user_id})
    pending = reports_collection.count_documents({"userId": user_id, "status": "pending"})
    confirmed = reports_collection.count_documents({"userId": user_id, "status": "confirmed"})
    flagged = reports_collection.count_documents({"userId": user_id, "status": "flagged"})
    return {"total": total, "pending": pending, "confirmed": confirmed, "flagged": flagged}
