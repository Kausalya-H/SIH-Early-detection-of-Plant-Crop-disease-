from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    language: str = "en"
    address: Optional[str] = None



class FarmInfo(BaseModel):
    farmName: str
    location: str
    latitude: float = 0.0
    longitude: float = 0.0
    area: Optional[float] = 0
    areaUnit: str = "acres"

class CropInfo(BaseModel):
    cropName: str
    variety: Optional[str] = None
    acreage: Optional[float] = 0
    sowingDate: Optional[str] = None
    season: Optional[str] = None

class UserFullRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    language: str = "en"
    address: Optional[str] = None
    farm: Optional[FarmInfo] = None
    crops: Optional[List[CropInfo]] = []

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    language: str = "en"
    address: Optional[str] = None
    createdAt: str

class FarmCreate(BaseModel):
    farmName: str
    location: str
    latitude: float
    longitude: float
    area: Optional[float] = 0
    areaUnit: str = "acres"
    soilType: Optional[str] = None
    irrigation: Optional[str] = None

class FarmResponse(BaseModel):
    id: str
    userId: str
    farmName: str
    location: str
    latitude: float
    longitude: float
    area: Optional[float] = 0
    areaUnit: str = "acres"
    soilType: Optional[str] = None
    irrigation: Optional[str] = None
    createdAt: str

class CropCreate(BaseModel):
    cropName: str
    variety: Optional[str] = None
    acreage: Optional[float] = 0
    sowingDate: Optional[str] = None
    season: Optional[str] = None

class CropResponse(BaseModel):
    id: str
    farmId: str
    userId: str
    cropName: str
    variety: Optional[str] = None
    acreage: Optional[float] = 0
    sowingDate: Optional[str] = None
    season: Optional[str] = None
    createdAt: str

class DiseaseReport(BaseModel):
    userId: str
    farmId: Optional[str] = None
    cropId: Optional[str] = None
    cropName: str
    disease: str
    confidence: float
    diseaseCategory: Optional[str] = None
    causalAgent: Optional[str] = None
    severity: Optional[str] = None
    weather: Optional[dict] = None
    riskScore: Optional[float] = None
    overallSeverity: Optional[str] = None
    treatment: Optional[str] = None
    activeIngredient: Optional[str] = None
    safetyNote: Optional[str] = None
    status: str = "pending"

class CropEntry(BaseModel):
    name: str
    acreage: Optional[float] = 0

class Farmer(BaseModel):
    name: str
    phone: str
    language: str
    location: str
    crop: str
    placeName: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    crops: Optional[List[CropEntry]] = []

class FarmerSetup(BaseModel):
    placeName: str

class FarmerCropAdd(BaseModel):
    name: str
    acreage: Optional[float] = 0

class AdminSettingsUpdate(BaseModel):
    humidityThreshold: Optional[float] = Field(None, ge=0, le=100)
    clusterRadius: Optional[float] = Field(None, ge=0.1, le=100)
    aiConfidence: Optional[float] = Field(None, ge=0, le=100)
    humidity: Optional[float] = Field(None, ge=0, le=100)
    radius: Optional[float] = Field(None, ge=0.1, le=100)
    confidence: Optional[float] = Field(None, ge=0, le=100)
