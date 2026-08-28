from typing import Optional
from pydantic import BaseModel, Field


class Farmer(BaseModel):
    name: str
    phone: str
    language: str
    location: str
    crop: str


class AdminSettingsUpdate(BaseModel):
    humidityThreshold: Optional[float] = Field(None, ge=0, le=100)
    clusterRadius: Optional[float] = Field(None, ge=0.1, le=100)
    aiConfidence: Optional[float] = Field(None, ge=0, le=100)
    # Also support alternate keys if sent
    humidity: Optional[float] = Field(None, ge=0, le=100)
    radius: Optional[float] = Field(None, ge=0.1, le=100)
    confidence: Optional[float] = Field(None, ge=0, le=100)