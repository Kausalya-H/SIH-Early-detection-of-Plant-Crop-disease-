from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.services.nlp_service import process_nlp_query, get_sample_queries, get_all_advisories

router = APIRouter(
    prefix="/nlp",
    tags=["NLP Agricultural Assistant"]
)


class NLPQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Farmer natural language crop question or symptom description")
    crop: Optional[str] = Field(None, description="Optional crop name filter (Tomato, Chilli, Groundnut, Rice, etc.)")
    language: Optional[str] = Field("en", description="Preferred response language code (e.g. en, hi, mr)")


class NLPQueryResponse(BaseModel):
    query: str
    crop: str
    matched_disease: str
    confidence: float
    intent: str
    severity: str
    summary: str
    warning_signs: List[str]
    advice: str
    treatment: str
    active_ingredient: str
    application: str
    organic_remedies: List[str]
    preventive_tips: List[str]
    safety_note: str
    language: str
    message: str


@router.post("/query", response_model=NLPQueryResponse)
@router.post("/ask", response_model=NLPQueryResponse)
def ask_nlp_assistant(payload: NLPQueryRequest):
    """
    Processes natural language agricultural questions regarding crop diseases, symptoms,
    chemical treatments, active ingredients, organic remedies, and safety advisories.
    """
    if not payload.query or len(payload.query.strip()) < 2:
        raise HTTPException(
            status_code=400,
            detail="Query text must contain at least 2 characters"
        )

    result = process_nlp_query(
        query_text=payload.query.strip(),
        crop=payload.crop,
        language=payload.language
    )

    if "error" in result:
        raise HTTPException(
            status_code=400,
            detail=result["error"]
        )

    return result


@router.get("/sample-queries")
def list_sample_queries():
    """
    Returns curated sample queries for quick demonstration and user prompt guidance.
    """
    return {
        "samples": get_sample_queries()
    }


@router.get("/advisories")
def list_advisories(category: Optional[str] = None):
    """
    Returns regional seasonal agricultural advisories.
    """
    return {
        "advisories": get_all_advisories(category)
    }


@router.get("/health")
def nlp_health_check():
    """
    NLP service connectivity and model status health-check.
    """
    return {
        "status": "healthy",
        "service": "Agricultural NLP Assistant & Pathology Diagnostic Engine",
        "supported_crops": ["Tomato", "Chilli", "Groundnut", "Rice", "Cotton", "Soybean"]
    }
