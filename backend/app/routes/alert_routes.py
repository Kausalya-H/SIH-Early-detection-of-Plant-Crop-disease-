from fastapi import APIRouter, Depends
from app.database import farms_collection, reports_collection
from app.routes.auth import get_current_user

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/")
def get_alerts(user_id: str = Depends(get_current_user)):
    alerts = []

    # Generate alerts from disease reports
    disease_reports = list(reports_collection.find({"userId": user_id}).sort("createdAt", -1).limit(10))
    for report in disease_reports:
        severity = report.get("overallSeverity", "Low")
        if severity in ["High", "Critical"]:
            alerts.append({
                "id": f"disease-{report['_id']}",
                "title": f"Disease Detected: {report.get('disease', 'Unknown')}",
                "category": "DISEASE_OUTBREAK",
                "severity": "HIGH" if severity == "High" else "CRITICAL",
                "affectedCrops": [report.get("cropName", "")],
                "district": "",
                "issueDate": report.get("createdAt", ""),
                "validUntil": "",
                "message": f"{report.get('disease', 'Disease')} detected in {report.get('cropName', 'crop')} with {report.get('confidence', 0)}% confidence.",
                "actionRequired": report.get("treatment", "Apply recommended treatment"),
                "isRead": False,
                "issuedBy": "AI Diagnostic System",
                "source": "KrishiRakshak AI",
            })

    # Check farm locations for weather-based alerts
    farms = list(farms_collection.find({"userId": user_id}))
    for farm in farms:
        farm_name = farm.get("farmName", "Farm")
        location = farm.get("location", "")
        temp = farm.get("_weather_temp")
        humidity = farm.get("_weather_humidity")

        if humidity and humidity > 80:
            alerts.append({
                "id": f"weather-humidity-{farm['_id']}",
                "title": f"High Humidity Alert - {farm_name}",
                "category": "WEATHER_WARNING",
                "severity": "HIGH",
                "affectedCrops": [],
                "district": location,
                "issueDate": "",
                "validUntil": "",
                "message": f"Humidity is high in {farm_name}. Risk of fungal diseases like blight and mildew.",
                "actionRequired": "Monitor crops closely. Apply preventive fungicide if needed.",
                "isRead": False,
                "issuedBy": "Weather Station",
                "source": "Open-Meteo",
            })

    if not alerts:
        alerts.append({
            "id": "no-alerts",
            "title": "All Clear",
            "category": "OFFICER_ADVISORY",
            "severity": "INFO",
            "affectedCrops": [],
            "district": "",
            "issueDate": "",
            "validUntil": "",
            "message": "No active alerts for your farms. All conditions are within normal range.",
            "actionRequired": "Continue regular monitoring.",
            "isRead": True,
            "issuedBy": "System",
            "source": "KrishiRakshak",
        })

    return alerts
