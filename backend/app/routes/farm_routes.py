from fastapi import APIRouter, HTTPException, Depends
from app.database import farms_collection, crops_collection
from app.schemas import FarmCreate, CropCreate
from app.routes.auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/farms", tags=["Farms"])

@router.post("/")
def create_farm(body: FarmCreate, user_id: str = Depends(get_current_user)):
    farm_data = {
        "userId": user_id,
        "farmName": body.farmName,
        "location": body.location,
        "latitude": body.latitude,
        "longitude": body.longitude,
        "area": body.area,
        "areaUnit": body.areaUnit,
        "soilType": body.soilType,
        "irrigation": body.irrigation,
        "createdAt": datetime.utcnow().isoformat(),
    }
    result = farms_collection.insert_one(farm_data)
    return {"message": "Farm created", "farm_id": str(result.inserted_id)}

@router.get("/")
def get_my_farms(user_id: str = Depends(get_current_user)):
    farms = list(farms_collection.find({"userId": user_id}))
    for f in farms:
        f["_id"] = str(f["_id"])
        # Attach crops to each farm
        farm_crops = list(crops_collection.find({"farmId": f["_id"]}))
        for c in farm_crops:
            c["_id"] = str(c["_id"])
        f["crops"] = farm_crops
    return farms

@router.get("/{farm_id}")
def get_farm(farm_id: str, user_id: str = Depends(get_current_user)):
    try:
        farm = farms_collection.find_one({"_id": ObjectId(farm_id), "userId": user_id})
    except Exception:
        raise HTTPException(status_code=404, detail="Farm not found")
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    farm["_id"] = str(farm["_id"])
    farm_crops = list(crops_collection.find({"farmId": farm["_id"]}))
    for c in farm_crops:
        c["_id"] = str(c["_id"])
    farm["crops"] = farm_crops
    return farm

@router.delete("/{farm_id}")
def delete_farm(farm_id: str, user_id: str = Depends(get_current_user)):
    try:
        result = farms_collection.delete_one({"_id": ObjectId(farm_id), "userId": user_id})
    except Exception:
        raise HTTPException(status_code=404, detail="Farm not found")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Farm not found")
    crops_collection.delete_many({"farmId": farm_id})
    return {"message": "Farm deleted"}

# ── Crop endpoints (nested under farms) ──────────────────

@router.post("/{farm_id}/crops")
def add_crop(farm_id: str, body: CropCreate, user_id: str = Depends(get_current_user)):
    try:
        farm = farms_collection.find_one({"_id": ObjectId(farm_id), "userId": user_id})
    except Exception:
        raise HTTPException(status_code=404, detail="Farm not found")
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    crop_data = {
        "farmId": farm_id,
        "userId": user_id,
        "cropName": body.cropName,
        "variety": body.variety,
        "acreage": body.acreage,
        "sowingDate": body.sowingDate,
        "season": body.season,
        "createdAt": datetime.utcnow().isoformat(),
    }
    result = crops_collection.insert_one(crop_data)
    return {"message": f"Crop {body.cropName} added", "crop_id": str(result.inserted_id)}

@router.delete("/{farm_id}/crops/{crop_id}")
def remove_crop(farm_id: str, crop_id: str, user_id: str = Depends(get_current_user)):
    try:
        result = crops_collection.delete_one({"_id": ObjectId(crop_id), "farmId": farm_id, "userId": user_id})
    except Exception:
        raise HTTPException(status_code=404, detail="Crop not found")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Crop not found")
    return {"message": "Crop removed"}
