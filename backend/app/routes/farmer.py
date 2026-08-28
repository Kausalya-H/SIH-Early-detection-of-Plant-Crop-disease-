from fastapi import APIRouter, HTTPException
from app.database import farmers_collection
from app.schemas import Farmer

router = APIRouter(
    prefix="/farmers",
    tags=["Farmers"]
)


@router.post("/")
def create_farmer(farmer: Farmer):
    try:
        result = farmers_collection.insert_one(farmer.model_dump())
        return {
            "message": "Farmer registered successfully",
            "farmer_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Database service unavailable: {str(e)}"
        )


@router.get("/")
def get_farmers():
    try:
        farmers = list(farmers_collection.find())
        for farmer in farmers:
            farmer["_id"] = str(farmer["_id"])
        return farmers
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Database service unavailable: {str(e)}"
        )