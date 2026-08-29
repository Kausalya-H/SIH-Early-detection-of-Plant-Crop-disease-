"""
Disease risk scoring engine.

Uses weather parameters (temperature, humidity, wind, rainfall) to compute
a disease risk index for each agricultural region. This drives the risk map,
alert system, and advisory generation.

Risk factors based on published phytopathological research:
- High humidity (>80%) + moderate temp (20-30°C) → high fungal risk
- Leaf wetness duration from rainfall → bacterial/oomycete risk
- Wind speed → spore dispersal range
"""

from typing import List, Dict, Optional
from datetime import datetime, timezone
from .weather_service import DEFAULT_LOCATIONS, get_weather_for_location


# Disease risk thresholds (phytopathological research-based)
FUNGAL_RISK_RULES = [
    {"min_humidity": 90, "max_humidity": 100, "min_temp": 15, "max_temp": 30, "risk": "CRITICAL", "score": 95},
    {"min_humidity": 85, "max_humidity": 100, "min_temp": 20, "max_temp": 28, "risk": "HIGH", "score": 82},
    {"min_humidity": 80, "max_humidity": 85, "min_temp": 20, "max_temp": 30, "risk": "HIGH", "score": 75},
    {"min_humidity": 70, "max_humidity": 80, "min_temp": 18, "max_temp": 32, "risk": "MODERATE", "score": 55},
    {"min_humidity": 60, "max_humidity": 70, "min_temp": 15, "max_temp": 35, "risk": "LOW", "score": 30},
]

BACTERIAL_RISK_RULES = [
    {"min_humidity": 85, "max_humidity": 100, "min_temp": 25, "max_temp": 35, "risk": "HIGH", "score": 80},
    {"min_humidity": 75, "max_humidity": 85, "min_temp": 22, "max_temp": 35, "risk": "MODERATE", "score": 60},
    {"min_humidity": 60, "max_humidity": 75, "min_temp": 20, "max_temp": 38, "risk": "LOW", "score": 35},
]

OOMYCETE_RISK_RULES = [
    {"min_humidity": 90, "max_humidity": 100, "min_temp": 12, "max_temp": 25, "risk": "CRITICAL", "score": 90},
    {"min_humidity": 85, "max_humidity": 90, "min_temp": 15, "max_temp": 22, "risk": "HIGH", "score": 78},
    {"min_humidity": 75, "max_humidity": 85, "min_temp": 15, "max_temp": 25, "risk": "MODERATE", "score": 55},
]


def _evaluate_rules(
    humidity: float, temp: float, rules: List[Dict]
) -> Optional[Dict]:
    """Check weather conditions against a set of disease-risk rules."""
    for rule in rules:
        if (rule["min_humidity"] <= humidity <= rule["max_humidity"] and
                rule["min_temp"] <= temp <= rule["max_temp"]):
            return {"level": rule["risk"], "score": rule["score"]}
    return {"level": "LOW", "score": 15}


def compute_disease_risk(
    temperature: float,
    humidity: float,
    wind_speed_kmh: float = 0,
    precipitation_mm: float = 0,
) -> Dict:
    """
    Compute overall disease risk from weather parameters.
    Returns risk level, numeric score, and specific risk factors.
    """
    # Evaluate each disease category
    fungal = _evaluate_rules(humidity, temperature, FUNGAL_RISK_RULES)
    bacterial = _evaluate_rules(humidity, temperature, BACTERIAL_RISK_RULES)
    oomycete = _evaluate_rules(humidity, temperature, OOMYCETE_RISK_RULES)

    # Compute overall score as weighted average
    overall_score = max(fungal["score"], bacterial["score"], oomycete["score"])

    # Wind bonus: higher wind = wider spore dispersal
    if wind_speed_kmh > 20:
        overall_score = min(100, overall_score + 10)
    elif wind_speed_kmh > 12:
        overall_score = min(100, overall_score + 5)

    # Precipitation bonus: leaf wetness favors pathogens
    if precipitation_mm > 10:
        overall_score = min(100, overall_score + 8)
    elif precipitation_mm > 5:
        overall_score = min(100, overall_score + 4)

    # Map score to level
    if overall_score >= 85:
        overall_level = "CRITICAL"
    elif overall_score >= 70:
        overall_level = "HIGH"
    elif overall_score >= 45:
        overall_level = "MODERATE"
    else:
        overall_level = "LOW"

    # Build risk reasons
    reasons = []
    if fungal["score"] >= 70:
        reasons.append("High humidity favours fungal leaf spots and blights")
    if bacterial["score"] >= 60:
        reasons.append("Warm moist conditions increase bacterial infection risk")
    if oomycete["score"] >= 70:
        reasons.append("Cool wet conditions elevate Late Blight (oomycete) risk")
    if humidity > 85:
        reasons.append(f"Relative humidity {humidity:.0f}% exceeds 85% threshold")
    if 20 <= temperature <= 28 and humidity > 80:
        reasons.append(f"Temperature {temperature:.0f}°C with {humidity:.0f}% RH creates peak sporulation window")
    if wind_speed_kmh > 15:
        reasons.append(f"Wind {wind_speed_kmh:.0f} km/h enables wider spore dispersal")
    if not reasons:
        reasons.append("Current conditions are within safe thresholds")

    return {
        "diseaseRiskIndex": overall_level,
        "diseaseRiskScore": round(overall_score, 1),
        "diseaseRiskReason": "; ".join(reasons),
        "pathogenRisk": {
            "fungal": {"level": fungal["level"], "score": fungal["score"]},
            "bacterial": {"level": bacterial["level"], "score": bacterial["score"]},
            "oomycete": {"level": oomycete["level"], "score": oomycete["score"]},
        },
        "sporeDispersalRangeKm": _estimate_dispersal(wind_speed_kmh),
    }


def _estimate_dispersal(wind_speed_kmh: float) -> float:
    """Rough estimate of spore dispersal range based on wind speed."""
    if wind_speed_kmh > 25:
        return 20.0
    elif wind_speed_kmh > 15:
        return 12.0
    elif wind_speed_kmh > 8:
        return 6.0
    else:
        return 2.0


async def compute_zone_risks() -> List[Dict]:
    """
    Compute risk for all monitored agricultural zones.
    Returns a list of zone risk objects for the officer risk-map.
    """
    zones = []
    for zone_id, loc in DEFAULT_LOCATIONS.items():
        try:
            weather = await get_weather_for_location(
                lat=loc["lat"],
                lng=loc["lng"],
                location_name=loc["name"],
            )
            risk = compute_disease_risk(
                temperature=weather["temperatureC"],
                humidity=weather["humidityPercent"],
                wind_speed_kmh=weather["windSpeedKmh"],
                precipitation_mm=0,  # Will be enhanced with forecast data
            )

            zones.append({
                "id": f"rz-{zone_id.lower()}",
                "name": loc["name"],
                "coordinates": {"lat": loc["lat"], "lng": loc["lng"]},
                "weather": weather,
                **risk,
                "updatedAt": datetime.now(timezone.utc).isoformat(),
            })
        except Exception as e:
            zones.append({
                "id": f"rz-{zone_id.lower()}",
                "name": loc["name"],
                "coordinates": {"lat": loc["lat"], "lng": loc["lng"]},
                "error": str(e),
                "diseaseRiskIndex": "UNKNOWN",
                "diseaseRiskScore": 0,
                "updatedAt": datetime.now(timezone.utc).isoformat(),
            })

    return zones
