from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.farmer import router as farmer_router
from app.routes.disease import router as disease_router
from app.routes.admin import router as admin_router
from app.routes.weather import router as weather_router
from app.routes.alert_routes import router as alert_router
from app.routes.advisory_routes import router as advisory_router
from app.routes.auth import router as auth_router
from app.routes.farm_routes import router as farm_router
from app.routes.report_routes import router as report_router

app = FastAPI(
    title="KrishiRakshak AI",
    description="AI-powered crop disease and pest early-warning platform",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(farm_router)
app.include_router(report_router)
app.include_router(farmer_router)
app.include_router(disease_router)
app.include_router(admin_router)
app.include_router(weather_router)
app.include_router(alert_router)
app.include_router(advisory_router)

@app.get("/")
def root():
    return {"message": "KrishiRakshak AI Backend is running", "status": "Active", "version": "2.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
