from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from pydantic import BaseModel
from bson import ObjectId

from app.database import farms_collection, crops_collection
from app.routes.auth import get_current_user

router = APIRouter(prefix="/farms", tags=["Farms"])


class FarmCreateBody(BaseModel):
    farmName: str
    area: float = 1.0
    location: str = ""
    lat: Optional[float] = None
    lng: Optional[float] = None


class CropCreateBody(BaseModel):
    cropName: str
    variety: str = ""
    sowingDate: str = ""


def serialize_farm(farm):
    farm["id"] = str(farm["_id"])
    farm.pop("_id", None)
    farm_id = farm["id"]
    farm["crops"] = []
    crops = list(crops_collection.find({"farmId": farm_id}))
    for c in crops:
        c["id"] = str(c["_id"])
        c.pop("_id", None)
        farm["crops"].append(c)
    return farm


def get_user_id(user):
    return user.get("sub") or user.get("user_id") or user.get("email", "")


@router.get("/")
def get_my_farms(user=Depends(get_current_user)):
    uid = get_user_id(user)
    farms = list(farms_collection.find({"userId": uid}))
    return [serialize_farm(f) for f in farms]


@router.post("/")
def create_farm(body: FarmCreateBody, user=Depends(get_current_user)):
    uid = get_user_id(user)
    farm_doc = {
        "userId": uid,
        "farmName": body.farmName,
        "area": body.area,
        "location": body.location,
        "lat": body.lat,
        "lng": body.lng,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    result = farms_collection.insert_one(farm_doc)
    farm_doc["id"] = str(result.inserted_id)
    farm_doc.pop("_id", None)
    farm_doc["crops"] = []
    return farm_doc


@router.get("/{farm_id}")
def get_farm(farm_id: str, user=Depends(get_current_user)):
    uid = get_user_id(user)
    try:
        farm = farms_collection.find_one({"_id": ObjectId(farm_id), "userId": uid})
    except Exception:
        farm = farms_collection.find_one({"_id": farm_id, "userId": uid})
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return serialize_farm(farm)


@router.delete("/{farm_id}")
def delete_farm(farm_id: str, user=Depends(get_current_user)):
    uid = get_user_id(user)
    try:
        result = farms_collection.delete_one({"_id": ObjectId(farm_id), "userId": uid})
    except Exception:
        result = farms_collection.delete_one({"_id": farm_id, "userId": uid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Farm not found")
    crops_collection.delete_many({"farmId": farm_id})
    return {"message": "Farm deleted"}


@router.post("/{farm_id}/crops")
def add_crop(farm_id: str, body: CropCreateBody, user=Depends(get_current_user)):
    uid = get_user_id(user)
    try:
        farm = farms_collection.find_one({"_id": ObjectId(farm_id), "userId": uid})
    except Exception:
        farm = farms_collection.find_one({"_id": farm_id, "userId": uid})
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    crop_doc = {
        "farmId": farm_id,
        "userId": uid,
        "cropName": body.cropName,
        "variety": body.variety,
        "sowingDate": body.sowingDate,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    result = crops_collection.insert_one(crop_doc)
    crop_doc["id"] = str(result.inserted_id)
    crop_doc.pop("_id", None)
    return crop_doc


@router.delete("/{farm_id}/crops/{crop_id}")
def remove_crop(farm_id: str, crop_id: str, user=Depends(get_current_user)):
    uid = get_user_id(user)
    try:
        result = crops_collection.delete_one({
            "_id": ObjectId(crop_id),
            "farmId": farm_id,
            "userId": uid,
        })
    except Exception:
        result = crops_collection.delete_one({
            "_id": crop_id,
            "farmId": farm_id,
            "userId": uid,
        })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Crop not found")
    return {"message": "Crop removed"}
