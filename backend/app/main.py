from fastapi import FastAPI
from app.routes.farmer import router as farmer_router
from app.routes.disease import router as disease_router

app = FastAPI(
    title="KrishiRakshak AI",
    description="AI-powered crop disease and pest early-warning platform",
    version="1.0.0"
)

app.include_router(farmer_router)
app.include_router(disease_router)


@app.get("/")
def root():
    return {
        "message": "KrishiRakshak AI Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }