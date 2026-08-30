from fastapi import APIRouter, HTTPException
from app.database import farmers_collection
from app.schemas import Farmer, FarmerSetup, FarmerCropAdd

router = APIRouter(prefix="/farmers", tags=["Farmers"])


@router.post("/")
def create_farmer(farmer: Farmer):
    try:
        data = farmer.model_dump()
        if not data.get("crops"):
            data["crops"] = []
        result = farmers_collection.insert_one(data)
        return {
            "message": "Farmer registered successfully",
            "farmer_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {str(e)}")


@router.get("/")
def get_farmers():
    try:
        farmers = list(farmers_collection.find())
        for f in farmers:
            f["_id"] = str(f["_id"])
        return farmers
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {str(e)}")


@router.get("/{farmer_id}")
def get_farmer(farmer_id: str):
    from bson import ObjectId
    try:
        farmer = farmers_collection.find_one({"_id": ObjectId(farmer_id)})
    except Exception:
        farmer = farmers_collection.find_one({"_id": farmer_id})
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    farmer["_id"] = str(farmer["_id"])
    return farmer


@router.post("/{farmer_id}/setup")
async def setup_farmer_location(farmer_id: str, body: FarmerSetup):
    """
    Save place name for a farmer. Auto-resolves to lat/lng + fetches weather.
    """
    from bson import ObjectId
    from app.services.weather_service import resolve_location

    # Find farmer
    try:
        query = {"_id": ObjectId(farmer_id)}
    except Exception:
        query = {"_id": farmer_id}

    farmer = farmers_collection.find_one(query)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    # Resolve place name to coordinates
    resolved = await resolve_location(name=body.placeName)

    # Update farmer record
    update_data = {
        "placeName": body.placeName,
        "lat": resolved["lat"],
        "lng": resolved["lng"],
        "location": resolved["name"],
    }
    farmers_collection.update_one(query, {"$set": update_data})

    return {
        "message": f"Location set to {resolved['name']}",
        "placeName": body.placeName,
        "resolvedName": resolved["name"],
        "coordinates": {"lat": resolved["lat"], "lng": resolved["lng"]},
    }


@router.post("/{farmer_id}/crops")
def add_crop(farmer_id: str, body: FarmerCropAdd):
    """Add a crop to farmer's profile."""
    from bson import ObjectId

    try:
        query = {"_id": ObjectId(farmer_id)}
    except Exception:
        query = {"_id": farmer_id}

    farmer = farmers_collection.find_one(query)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    crops = farmer.get("crops", [])
    crops.append({"name": body.name, "acreage": body.acreage})
    farmers_collection.update_one(query, {"$set": {"crops": crops}})

    return {"message": f"Crop {body.name} added", "crops": crops}


@router.delete("/{farmer_id}/crops/{crop_name}")
def remove_crop(farmer_id: str, crop_name: str):
    """Remove a crop from farmer's profile."""
    from bson import ObjectId

    try:
        query = {"_id": ObjectId(farmer_id)}
    except Exception:
        query = {"_id": farmer_id}

    farmer = farmers_collection.find_one(query)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    crops = farmer.get("crops", [])
    crops = [c for c in crops if c["name"].lower() != crop_name.lower()]
    farmers_collection.update_one(query, {"$set": {"crops": crops}})

    return {"message": f"Crop {crop_name} removed", "crops": crops}


@router.get("/{farmer_id}/profile")
async def get_farmer_profile(farmer_id: str):
    """
    Get full farmer profile including:
    - Saved location + real-time weather
    - List of crops
    """
    from bson import ObjectId
    from app.services.weather_service import get_weather_for_location
    from app.services.risk_engine import compute_disease_risk

    try:
        query = {"_id": ObjectId(farmer_id)}
    except Exception:
        query = {"_id": farmer_id}

    farmer = farmers_collection.find_one(query)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    farmer["_id"] = str(farmer["_id"])
    result = {
        "farmer": farmer,
        "weather": None,
        "weatherRisk": None,
    }

    # Fetch live weather if location is set
    if farmer.get("lat") and farmer.get("lng"):
        try:
            weather = await get_weather_for_location(
                farmer["lat"], farmer["lng"], farmer.get("location")
            )
            risk = compute_disease_risk(
                temperature=weather["temperatureC"],
                humidity=weather["humidityPercent"],
                wind_speed_kmh=weather["windSpeedKmh"],
            )
            result["weather"] = weather
            result["weatherRisk"] = risk
        except Exception:
            pass

    return result
