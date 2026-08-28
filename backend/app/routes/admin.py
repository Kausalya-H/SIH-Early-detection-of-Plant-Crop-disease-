from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Request
from app.services.admin_store import admin_store
from app.schemas import AdminSettingsUpdate

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ============================================================
# 1. USERS
# ============================================================

@router.get("/users")
def get_users():
    """
    Returns all registered system users and agricultural officers.
    """
    return admin_store.get_users()


@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: str,
    status: str = Query(..., description="Target status: ACTIVE | INACTIVE | SUSPENDED"),
    request: Request = None
):
    """
    Updates user account status (ACTIVE, INACTIVE, SUSPENDED) and persists change.
    """
    status_upper = status.upper().strip()
    if status_upper not in ["ACTIVE", "INACTIVE", "SUSPENDED"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status. Allowed values: ACTIVE, INACTIVE, SUSPENDED"
        )

    client_ip = request.client.host if request and request.client else "127.0.0.1"

    updated_user = admin_store.update_user_status(
        user_id=user_id,
        new_status=status_upper,
        ip_address=client_ip
    )

    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail=f"User with ID '{user_id}' not found"
        )

    return {
        "message": "User status updated successfully",
        "user_id": user_id,
        "status": status_upper,
        "user": updated_user
    }


# ============================================================
# 2. SETTINGS
# ============================================================

@router.get("/settings")
def get_settings():
    """
    Retrieves global epidemic risk thresholds and AI parameters.
    """
    return admin_store.get_settings()


@router.put("/settings")
def update_settings(payload: AdminSettingsUpdate, request: Request = None):
    """
    Updates global system configuration and logs an audit trail event.
    """
    client_ip = request.client.host if request and request.client else "127.0.0.1"

    # Support either humidityThreshold or humidity
    humidity = payload.humidityThreshold if payload.humidityThreshold is not None else payload.humidity
    radius = payload.clusterRadius if payload.clusterRadius is not None else payload.radius
    confidence = payload.aiConfidence if payload.aiConfidence is not None else payload.confidence

    updated_settings = admin_store.update_settings(
        humidity_threshold=humidity,
        cluster_radius=radius,
        ai_confidence=confidence,
        ip_address=client_ip
    )

    return {
        "message": "Configuration updated successfully",
        "settings": updated_settings
    }


@router.post("/settings/reset")
def reset_settings(request: Request = None):
    """
    Resets global epidemic risk thresholds to factory defaults.
    """
    client_ip = request.client.host if request and request.client else "127.0.0.1"

    default_settings = admin_store.reset_settings(ip_address=client_ip)

    return {
        "message": "Configuration reset to defaults successfully",
        "settings": default_settings
    }


# ============================================================
# 3. NOTIFICATION GATEWAYS
# ============================================================

@router.get("/gateways")
def get_gateways():
    """
    Returns the status of national notification and satellite gateways.
    """
    return admin_store.get_gateways()


@router.post("/gateways/{gateway_id}/ping")
def ping_gateway(gateway_id: str, request: Request = None):
    """
    Dispatches a health ping test to the specified gateway.
    """
    client_ip = request.client.host if request and request.client else "127.0.0.1"

    target_gw = admin_store.ping_gateway(
        gateway_id=gateway_id,
        ip_address=client_ip
    )

    if not target_gw:
        raise HTTPException(
            status_code=404,
            detail=f"Notification gateway '{gateway_id}' not found"
        )

    return {
        "message": f"Gateway ping successful for {target_gw['title']}",
        "gateway_id": gateway_id,
        "status": target_gw.get("status", "Connected"),
        "latencyMs": 42
    }


# ============================================================
# 4. AI MONITORING
# ============================================================

@router.get("/ai-models")
def get_ai_models():
    """
    Returns real-time neural network telemetry and benchmark metrics for AI models.
    """
    return admin_store.get_ai_models()


# ============================================================
# 5. AUDIT LOGS
# ============================================================

@router.get("/audit-logs")
def get_audit_logs():
    """
    Retrieves system compliance, security, and administrative audit trail.
    """
    return admin_store.get_audit_logs()