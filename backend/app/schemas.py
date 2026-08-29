from typing import Optional, List
from pydantic import BaseModel, Field


class CropEntry(BaseModel):
    name: str
    acreage: Optional[float] = 0


class Farmer(BaseModel):
    name: str
    phone: str
    language: str
    location: str
    crop: str
    # New fields for place-based weather
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
