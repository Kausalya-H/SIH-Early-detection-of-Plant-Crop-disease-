import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from app.database import users_collection, farms_collection, crops_collection
from app.schemas import UserRegister, UserLogin, UserResponse, UserFullRegister
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

JWT_SECRET = os.getenv("JWT_SECRET", "krishirakshak-secret-key-change-in-production")
JWT_EXPIRY_HOURS = 72

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

def create_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    return payload["user_id"]

@router.post("/register")
def register(body: UserRegister):
    existing = users_collection.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_data = {
        "name": body.name,
        "email": body.email,
        "password": hash_password(body.password),
        "phone": body.phone,
        "language": body.language,
        "address": body.address,
        "createdAt": datetime.utcnow().isoformat(),
    }
    result = users_collection.insert_one(user_data)
    token = create_token(str(result.inserted_id))
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": body.name,
            "email": body.email,
            "phone": body.phone,
            "language": body.language,
        }
    }



@router.post("/register-full")
def register_full(body: UserFullRegister):
    existing = users_collection.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_data = {
        "name": body.name,
        "email": body.email,
        "password": hash_password(body.password),
        "phone": body.phone,
        "language": body.language,
        "address": body.address,
        "createdAt": datetime.utcnow().isoformat(),
    }
    result = users_collection.insert_one(user_data)
    user_id = str(result.inserted_id)
    token = create_token(user_id)

    farm_id = None
    if body.farm:
        farm_data = {
            "userId": user_id,
            "farmName": body.farm.farmName,
            "location": body.farm.location,
            "latitude": body.farm.latitude,
            "longitude": body.farm.longitude,
            "area": body.farm.area,
            "areaUnit": body.farm.areaUnit,
            "createdAt": datetime.utcnow().isoformat(),
        }
        farm_result = farms_collection.insert_one(farm_data)
        farm_id = str(farm_result.inserted_id)

        for crop in (body.crops or []):
            crop_data = {
                "farmId": farm_id,
                "userId": user_id,
                "cropName": crop.cropName,
                "variety": crop.variety,
                "acreage": crop.acreage,
                "sowingDate": crop.sowingDate,
                "season": crop.season,
                "createdAt": datetime.utcnow().isoformat(),
            }
            crops_collection.insert_one(crop_data)

    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": body.name,
            "email": body.email,
            "phone": body.phone,
            "language": body.language,
        },
        "farmId": farm_id,
    }

@router.post("/login")
def login(body: UserLogin):
    user = users_collection.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(str(user["_id"]))
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "phone": user.get("phone"),
            "language": user.get("language", "en"),
        }
    }

@router.get("/me")
def get_me(user_id: str = Depends(get_current_user)):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "phone": user.get("phone"),
        "language": user.get("language", "en"),
        "address": user.get("address"),
        "createdAt": user.get("createdAt", ""),
    }
