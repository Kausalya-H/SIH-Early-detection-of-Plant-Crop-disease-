import os
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import bcrypt
import jwt

from app.database import users_collection, farms_collection, crops_collection


class RegisterBody(BaseModel):
    name: str
    email: str
    password: str
    phone: str = ""
    language: str = "en"


class LoginBody(BaseModel):
    email: str
    password: str


from typing import List

class RegisterFullBody(BaseModel):
    name: str
    email: str
    password: str
    phone: str = ""
    language: str = "en"
    placeName: str = ""
    lat: float = None
    lng: float = None
    farmName: str = ""
    farmArea: float = 1.0
    cropNames: List[str] = []


router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

JWT_SECRET = os.getenv("JWT_SECRET", "krishirakshak-secret-2026")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 72


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str, email: str, role: str = "farmer") -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return decode_token(credentials.credentials)


@router.post("/register")
def register_user(body: RegisterBody):
    existing = users_collection.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": body.name,
        "email": body.email,
        "password": hash_password(body.password),
        "phone": body.phone,
        "language": body.language,
        "role": "farmer",
        "placeName": "",
        "lat": None,
        "lng": None,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    result = users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    token = create_token(user_id, body.email, "farmer")
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": body.name,
            "email": body.email,
            "phone": body.phone,
            "role": "farmer",
        },
    }


@router.post("/login")
def login_user(body: LoginBody):
    user = users_collection.find_one({"email": body.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    token = create_token(user_id, body.email, user.get("role", "farmer"))
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
            "phone": user.get("phone", ""),
            "role": user.get("role", "farmer"),
        },
    }


@router.get("/me")
def get_me(user=Depends(get_current_user)):
    from bson import ObjectId
    try:
        db_user = users_collection.find_one({"_id": ObjectId(user["sub"])})
    except Exception:
        db_user = users_collection.find_one({"_id": user["sub"]})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user["_id"] = str(db_user["_id"])
    db_user.pop("password", None)
    return db_user


@router.post("/register-full")
def register_full(body: RegisterFullBody):
    existing = users_collection.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": body.name,
        "email": body.email,
        "password": hash_password(body.password),
        "phone": body.phone,
        "language": body.language,
        "role": "farmer",
        "placeName": body.placeName,
        "lat": body.lat,
        "lng": body.lng,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    result = users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    if body.farmName:
        # Resolve location if lat/lng not provided but placeName is
        farm_lat = body.lat
        farm_lng = body.lng
        resolved_name = body.placeName
        if (farm_lat is None or farm_lng is None) and body.placeName:
            from app.services.weather_service import resolve_location
            import asyncio
            try:
                resolved = asyncio.get_event_loop().run_until_complete(
                    resolve_location(name=body.placeName)
                )
                farm_lat = resolved.get("lat")
                farm_lng = resolved.get("lng")
                resolved_name = resolved.get("name", body.placeName)
            except Exception:
                pass

        farm_doc = {
            "userId": user_id,
            "farmName": body.farmName,
            "area": body.farmArea,
            "location": resolved_name,
            "lat": farm_lat,
            "lng": farm_lng,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }
        farm_result = farms_collection.insert_one(farm_doc)
        farm_id = str(farm_result.inserted_id)

        # Support multiple crops
        crops_to_add = body.cropNames if body.cropNames else []
        for crop_name in crops_to_add:
            if crop_name:
                crop_doc = {
                    "farmId": farm_id,
                    "userId": user_id,
                    "cropName": crop_name,
                    "variety": "",
                    "sowingDate": "",
                    "createdAt": datetime.now(timezone.utc).isoformat(),
                }
                crops_collection.insert_one(crop_doc)

    token = create_token(user_id, body.email, "farmer")
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": body.name,
            "email": body.email,
            "phone": body.phone,
            "role": "farmer",
        },
    }
