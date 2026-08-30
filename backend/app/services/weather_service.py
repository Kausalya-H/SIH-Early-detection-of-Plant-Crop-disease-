import httpx
from typing import Optional
from datetime import datetime, timezone


DEFAULT_LOCATIONS = {
    "Baramati": {"lat": 18.15, "lng": 74.63, "name": "Baramati, Pune, Maharashtra"},
    "Nashik": {"lat": 19.99, "lng": 73.78, "name": "Nashik, Maharashtra"},
    "Ludhiana": {"lat": 30.90, "lng": 75.86, "name": "Ludhiana, Punjab"},
    "Thanjavur": {"lat": 10.79, "lng": 79.13, "name": "Thanjavur, Tamil Nadu"},
    "Warangal": {"lat": 17.98, "lng": 79.59, "name": "Warangal, Telangana"},
    "Agra": {"lat": 27.18, "lng": 78.02, "name": "Agra, Uttar Pradesh"},
}


async def forward_geocode(place_name: str) -> Optional[dict]:
    """Convert a place name to lat/lng using Open-Meteo Geocoding API (free)."""
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {"name": place_name, "count": 1, "language": "en"}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            results = data.get("results", [])
            if results:
                r = results[0]
                parts = []
                for key in ["name", "admin2", "admin1", "country"]:
                    if key in r:
                        parts.append(r[key])
                return {
                    "lat": r["latitude"],
                    "lng": r["longitude"],
                    "name": ", ".join(parts),
                }
    except Exception:
        pass
    return None


async def fetch_weather_by_coords(lat: float, lng: float) -> dict:
    """Fetch current weather from Open-Meteo (free, no API key). Works globally."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lng,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum",
        "timezone": "auto",
        "forecast_days": 3,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()


async def reverse_geocode(lat: float, lng: float) -> str:
    """Convert lat/lng to a human-readable place name using Nominatim (free)."""
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {"lat": lat, "lon": lng, "format": "json", "zoom": 10}
    headers = {"User-Agent": "KrishiRakshakAI/1.0"}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            address = data.get("address", {})
            parts = []
            for key in ["village", "town", "city", "county", "state", "country"]:
                if key in address:
                    parts.append(address[key])
            if parts:
                return ", ".join(parts[:4])
            return data.get("display_name", f"{lat:.4f}, {lng:.4f}")
    except Exception:
        return f"{lat:.4f}, {lng:.4f}"


def _weather_code_to_description(code: int) -> str:
    descriptions = {
        0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
        45: "Foggy", 48: "Rime Fog",
        51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
        61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
        71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
        80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
        95: "Thunderstorm", 96: "Thunderstorm with Hail", 99: "Thunderstorm with Heavy Hail",
    }
    return descriptions.get(code, "Unknown")


def build_weather_response(data: dict, location_name: Optional[str] = None) -> dict:
    current = data.get("current", {})
    daily = data.get("daily", {})

    temp_c = current.get("temperature_2m", 0)
    humidity = current.get("relative_humidity_2m", 0)
    wind_speed = current.get("wind_speed_10m", 0)
    weather_code = current.get("weather_code", 0)
    condition = _weather_code_to_description(weather_code)

    precip_probs = daily.get("precipitation_probability_max", [])
    precip_sums = daily.get("precipitation_sum", [])
    max_temp = max(daily.get("temperature_2m_max", [0])) if daily.get("temperature_2m_max") else 0
    min_temp = min(daily.get("temperature_2m_min", [0])) if daily.get("temperature_2m_min") else 0
    max_precip_prob = max(precip_probs) if precip_probs else 0
    total_precip = sum(p for p in precip_sums if p is not None)

    forecast_parts = []
    if max_precip_prob > 60:
        forecast_parts.append(f"Rain likely (up to {max_precip_prob}% chance)")
    if total_precip > 10:
        forecast_parts.append(f"{total_precip:.0f}mm expected over 3 days")
    if humidity > 80:
        forecast_parts.append(f"High humidity ({humidity}%)")
    if not forecast_parts:
        forecast_parts.append(f"Temperature {min_temp:.0f}-{max_temp}C with {condition.lower()} conditions")

    return {
        "location": location_name or "Unknown Location",
        "temperatureC": temp_c,
        "condition": condition,
        "humidityPercent": humidity,
        "windSpeedKmh": wind_speed,
        "rainfallChancePercent": max_precip_prob,
        "forecastSummary": ". ".join(forecast_parts) + ".",
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }


async def get_weather_for_location(
    lat: float, lng: float, location_name: Optional[str] = None
) -> dict:
    if not location_name:
        location_name = await reverse_geocode(lat, lng)
    data = await fetch_weather_by_coords(lat, lng)
    return build_weather_response(data, location_name)


async def resolve_location(
    name: Optional[str] = None, lat: Optional[float] = None, lng: Optional[float] = None
) -> dict:
    """
    Resolve a location from either:
    - place name (forward geocode via Open-Meteo)
    - lat/lng coordinates (reverse geocode via Nominatim)
    Returns dict with lat, lng, name.
    """
    if lat is not None and lng is not None:
        if not location_name_set(name):
            name = await reverse_geocode(lat, lng)
        return {"lat": lat, "lng": lng, "name": name or f"{lat:.4f}, {lng:.4f}"}

    if name:
        # Try predefined locations first
        for key, loc in DEFAULT_LOCATIONS.items():
            if key.lower() == name.lower() or name.lower() in loc["name"].lower():
                return {"lat": loc["lat"], "lng": loc["lng"], "name": loc["name"]}

        # Forward geocode any place name on Earth
        result = await forward_geocode(name)
        if result:
            return result

    # Default to Baramati
    default = DEFAULT_LOCATIONS["Baramati"]
    return {"lat": default["lat"], "lng": default["lng"], "name": default["name"]}


def location_name_set(name) -> bool:
    return name is not None and str(name).strip() != ""
