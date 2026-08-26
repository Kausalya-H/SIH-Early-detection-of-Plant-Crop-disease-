from fastapi import APIRouter
from app.database import farmers_collection
from app.schemas import Farmer

router = APIRouter(
    prefix="/farmers",
    tags=["Farmers"]
)


@router.post("/")
def create_farmer(farmer: Farmer):
    result = farmers_collection.insert_one(farmer.model_dump())

    return {
        "message": "Farmer registered successfully",
        "farmer_id": str(result.inserted_id)
    }


@router.get("/")
def get_farmers():
    farmers = list(farmers_collection.find())

    for farmer in farmers:
        farmer["_id"] = str(farmer["_id"])

    return farmers