from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.services.weather_service import (
    get_weather_for_location,
    resolve_location,
    DEFAULT_LOCATIONS,
)
from app.services.risk_engine import compute_disease_risk, compute_zone_risks

router = APIRouter(tags=["Weather & Risk"])


@router.get("/weather")
async def get_weather(
    lat: Optional[float] = Query(None, description="Latitude (-90 to 90)"),
    lng: Optional[float] = Query(None, description="Longitude (-180 to 180)"),
    location: Optional[str] = Query(None, description="Place name (e.g. Nashik, Tokyo, London, Paris)"),
):
    """
    Get current weather and disease risk for ANY location on Earth.

    Accepts either:
    - Place name: GET /weather?location=Nashik
    - Coordinates: GET /weather?lat=51.51&lng=-0.13
    - Default: GET /weather (returns Baramati)
    """
    if lat is not None and lng is not None:
        if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
            raise HTTPException(status_code=400, detail="Invalid coordinates. lat: -90 to 90, lng: -180 to 180")

    # Resolve location (place name OR coordinates)
    resolved = await resolve_location(name=location, lat=lat, lng=lng)

    try:
        weather = await get_weather_for_location(
            resolved["lat"], resolved["lng"], resolved["name"]
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch weather: {str(e)}")

    risk = compute_disease_risk(
        temperature=weather["temperatureC"],
        humidity=weather["humidityPercent"],
        wind_speed_kmh=weather["windSpeedKmh"],
    )

    return {
        "coordinates": {"lat": resolved["lat"], "lng": resolved["lng"]},
        **weather,
        **risk,
    }


@router.get("/weather/locations")
async def list_weather_locations():
    """List predefined monitored agricultural locations."""
    return {
        "locations": [
            {"id": key, "name": loc["name"], "lat": loc["lat"], "lng": loc["lng"]}
            for key, loc in DEFAULT_LOCATIONS.items()
        ]
    }


@router.get("/risk/zones")
async def get_risk_zones():
    """Get real-time disease risk for all predefined monitored zones."""
    try:
        zones = await compute_zone_risks()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to compute zone risks: {str(e)}")

    return {
        "zones": zones,
        "totalZones": len(zones),
        "criticalCount": sum(1 for z in zones if z.get("diseaseRiskIndex") == "CRITICAL"),
        "highCount": sum(1 for z in zones if z.get("diseaseRiskIndex") == "HIGH"),
        "moderateCount": sum(1 for z in zones if z.get("diseaseRiskIndex") == "MODERATE"),
        "lowCount": sum(1 for z in zones if z.get("diseaseRiskIndex") == "LOW"),
    }
