from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.farmer import router as farmer_router
from app.routes.disease import router as disease_router
from app.routes.admin import router as admin_router
from app.routes.weather import router as weather_router


app = FastAPI(
    title="KrishiRakshak AI",
    description="AI-powered crop disease and pest early-warning platform",
    version="1.1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(farmer_router)
app.include_router(disease_router)
app.include_router(admin_router)
app.include_router(weather_router)


@app.get("/")
def root():
    return {
        "message": "KrishiRakshak AI Backend is running",
        "status": "Active",
        "version": "1.1.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
