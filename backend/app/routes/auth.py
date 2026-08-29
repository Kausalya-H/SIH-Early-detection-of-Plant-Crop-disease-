from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class LoginRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    portal: Optional[str] = None


# Demo Users Database (In-Memory / SIH Demo)
DEMO_USERS = {
    "ADMIN": {
        "id": "usr-admin-001",
        "name": "Dr. Anita Sengupta",
        "email": "admin@krishirakshak.gov.in",
        "phone": "+91 98100 22345",
        "role": "ADMIN",
        "designation": "Principal Agricultural Data Scientist",
        "department": "Central AI & Surveillance Directorate",
        "jurisdiction": {
            "state": "Delhi (HQ)"
        },
        "isActive": True,
        "allowed_identifiers": [
            "admin@krishirakshak.gov.in",
            "anita.sengupta@krishirakshak.gov.in",
            "vikram.joshi@krishirakshak.gov.in",
            "+91 98100 22345",
            "9810022345",
            "+91 99201 55670",
            "9920155670",
            "admin"
        ],
        "password": "Admin@123"
    },
    "OFFICER": {
        "id": "usr-officer-002",
        "name": "Dr. Ramesh K. Patil",
        "email": "officer@krishirakshak.gov.in",
        "phone": "+91 98231 44521",
        "role": "OFFICER",
        "designation": "District Agriculture Officer (DAO)",
        "department": "Department of Agriculture, Maharashtra",
        "jurisdiction": {
            "state": "Maharashtra",
            "district": "Nashik",
            "taluk": "Niphad"
        },
        "isActive": True,
        "allowed_identifiers": [
            "officer@krishirakshak.gov.in",
            "ramesh.patil@agri.mh.gov.in",
            "gurpreet.singh@agri.pb.gov.in",
            "+91 98231 44521",
            "9823144521",
            "+91 94172 88390",
            "9417288390",
            "officer"
        ],
        "password": "Officer@123"
    },
    "FARMER": {
        "id": "usr-farmer-003",
        "name": "Rameshwar Rao",
        "email": "farmer@krishirakshak.gov.in",
        "phone": "+91 98765 43210",
        "role": "FARMER",
        "designation": "Progressive Kisan Member",
        "department": "Nashik Agro-Cluster Cooperative",
        "jurisdiction": {
            "state": "Maharashtra",
            "district": "Nashik",
            "taluk": "Pimpalgaon"
        },
        "isActive": True,
        "allowed_identifiers": [
            "farmer@krishirakshak.gov.in",
            "kisan@krishirakshak.gov.in",
            "+91 98765 43210",
            "9876543210",
            "farmer",
            "kisan"
        ],
        "password": "Farmer@123"
    }
}


def normalize_identifier(identifier: str) -> str:
    return identifier.strip().lower().replace(" ", "").replace("-", "")


@router.post("/login")
def login(payload: LoginRequest):
    """
    Demo Authentication Endpoint for KrishiRakshak AI (SIH Prototype).
    Validates against demo credentials for FARMER, OFFICER, and ADMIN roles.
    Does not require MongoDB to be running.
    """
    raw_identifier = payload.email or payload.phone or payload.username or ""
    if not raw_identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email, phone number, or username is required."
        )

    if not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required."
        )

    norm_input = normalize_identifier(raw_identifier)

    # Match user
    matched_user = None
    for role_key, user_data in DEMO_USERS.items():
        # Check identifiers
        for ident in user_data["allowed_identifiers"]:
            if normalize_identifier(ident) == norm_input:
                matched_user = user_data
                break
        if matched_user:
            break

    if not matched_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not found. Please use the provided demo credentials."
        )

    # Validate password
    if payload.password.strip() != matched_user["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password. Please check your credentials or use the one-click demo logins."
        )

    # Create safe user response (exclude password and identifiers)
    user_profile = {
        "id": matched_user["id"],
        "name": matched_user["name"],
        "email": matched_user["email"],
        "phone": matched_user["phone"],
        "role": matched_user["role"],
        "designation": matched_user["designation"],
        "department": matched_user["department"],
        "jurisdiction": matched_user["jurisdiction"],
        "isActive": matched_user["isActive"],
    }

    return {
        "success": True,
        "message": f"Successfully authenticated as {matched_user['name']} ({matched_user['role']})",
        "token": f"kr-demo-token-{matched_user['role'].lower()}-2026",
        "tokenType": "Bearer",
        "role": matched_user["role"],
        "activePortal": matched_user["role"],
        "user": user_profile
    }


@router.get("/demo-credentials")
def get_demo_credentials():
    """
    Returns available demo accounts for the SIH prototype login page.
    """
    return [
        {
            "role": "ADMIN",
            "title": "Central Admin & Governance",
            "email": "admin@krishirakshak.gov.in",
            "phone": "+91 98100 22345",
            "password": "Admin@123",
            "name": "Dr. Anita Sengupta"
        },
        {
            "role": "OFFICER",
            "title": "Agriculture Officer Surveillance",
            "email": "officer@krishirakshak.gov.in",
            "phone": "+91 98231 44521",
            "password": "Officer@123",
            "name": "Dr. Ramesh K. Patil"
        },
        {
            "role": "FARMER",
            "title": "Kisan / Farmer Portal",
            "email": "farmer@krishirakshak.gov.in",
            "phone": "+91 98765 43210",
            "password": "Farmer@123",
            "name": "Rameshwar Rao"
        }
    ]


@router.get("/me")
def get_current_user():
    return {
        "authenticated": True,
        "mode": "SIH-Prototype-Demo-Session"
    }
