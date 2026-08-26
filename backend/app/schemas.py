from pydantic import BaseModel

class Farmer(BaseModel):
    name: str
    phone: str
    language: str
    location: str
    crop: str