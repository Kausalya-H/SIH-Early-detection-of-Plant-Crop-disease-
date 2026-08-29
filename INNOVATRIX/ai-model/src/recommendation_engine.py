from typing import Any

from knowledge_base import CropKnowledgeBase


DEFAULT_LANGUAGE = "en"

SUPPORTED_LANGUAGES = {
    "en",
    "hi",
    "te",
    "mr",
}

HIGH_CONFIDENCE_THRESHOLD = 0.80
MEDIUM_CONFIDENCE_THRESHOLD = 0.60


def normalize_confidence(
    confidence: float,
) -> float:
    """
    Convert confidence into the 0-to-1 range.

    The function accepts both:
        0.93
        93.0
    """
    confidence = float(confidence)

    if confidence > 1:
        confidence = confidence / 100

    return max(
        0.0,
        min(confidence, 1.0),
    )


def get_localized_value(
    field: Any,
    language: str,
    fallback_language: str = DEFAULT_LANGUAGE,
) -> Any:
    """
    Return the requested translation.

    English is used when the requested language is unavailable.
    """
    if not isinstance(field, dict):
        return field

    value = field.get(language)

    if value not in (None, "", []):
        return value

    return field.get(
        fallback_language,
        field,
    )


def get_confidence_level(
    confidence: float,
) -> str:
    """
    Convert model confidence into a readable level.
    """
    if confidence >= HIGH_CONFIDENCE_THRESHOLD:
        return "HIGH"

    if confidence >= MEDIUM_CONFIDENCE_THRESHOLD:
        return "MEDIUM"

    return "LOW"


def build_confidence_message(
    confidence_level: str,
) -> str:
    """
    Produce guidance based on prediction confidence.
    """
    if confidence_level == "HIGH":
        return (
            "The model found a strong visual match. "
            "Confirm the result using symptoms, crop history "
            "and field conditions."
        )

    if confidence_level == "MEDIUM":
        return (
            "The prediction is uncertain. Capture additional "
            "clear images and compare visible symptoms before "
            "taking management action."
        )

    return (
        "The prediction confidence is low. Do not use this "
        "result for pesticide or fertilizer decisions. Capture "
        "better images or consult an agricultural expert."
    )


def safe_chemical_recommendation(
    entry: dict,
    confidence_level: str,
) -> dict:
    """
    Release chemical information only when all safety
    conditions are satisfied.
    """
    verification = entry.get(
        "verification",
        {},
    )

    entry_status = verification.get(
        "status",
        "REVIEW_REQUIRED",
    )

    disease = entry.get(
        "disease",
        {},
    )

    disease_category = disease.get(
        "category",
        "unverified_disease",
    )

    management = entry.get(
        "management",
        {},
    )

    chemical = management.get(
        "chemical_control",
        {},
    )

    chemical_status = chemical.get(
        "verification_status",
        "REQUIRES_CURRENT_CIBRC_AND_LABEL_VERIFICATION",
    )

    blocked_result = {
        "allowed": False,
        "verification_status": chemical_status,
        "active_ingredients": [],
        "dosage": None,
        "reason": "",
    }

    if disease_category == "healthy":
        blocked_result["reason"] = (
            "Pesticide is not recommended for a healthy-class "
            "prediction."
        )

        return blocked_result

    if confidence_level != "HIGH":
        blocked_result["reason"] = (
            "Chemical recommendations are blocked because "
            "prediction confidence is not high."
        )

        return blocked_result

    if entry_status != "VERIFIED":
        blocked_result["reason"] = (
            "Chemical recommendations are blocked because "
            "this knowledge-base entry requires expert review."
        )

        return blocked_result

    if chemical_status != "VERIFIED":
        blocked_result["reason"] = (
            "Chemical recommendations are blocked because "
            "current registration and product-label details "
            "have not been verified."
        )

        return blocked_result

    active_ingredients = chemical.get(
        "active_ingredients",
        [],
    )

    dosage = chemical.get("dosage")

    if not active_ingredients or dosage is None:
        blocked_result["reason"] = (
            "Verified chemical details are not available."
        )

        return blocked_result

    return {
        "allowed": True,
        "verification_status": chemical_status,
        "active_ingredients": active_ingredients,
        "dosage": dosage,
        "reason": chemical.get(
            "reason",
            "Use only according to the registered product label.",
        ),
    }


def safe_fertilizer_guidance(
    entry: dict,
    soil_data: dict | None = None,
) -> dict:
    """
    Prevent image-only fertilizer dosage recommendations.
    """
    fertilizer = entry.get(
        "fertilizer_guidance",
        {},
    )

    required_inputs = fertilizer.get(
        "required_inputs",
        [],
    )

    if soil_data is None:
        soil_data = {}

    missing_inputs = [
        input_name
        for input_name in required_inputs
        if soil_data.get(input_name) in (None, "")
    ]

    if missing_inputs:
        return {
            "dosage_allowed": False,
            "recommendation_type": fertilizer.get(
                "recommendation_type",
                "soil_test_required",
            ),
            "dosage": None,
            "guidance": fertilizer.get(
                "guidance",
                [],
            ),
            "missing_inputs": missing_inputs,
            "reason": (
                "Fertilizer dosage cannot be calculated from "
                "a leaf image alone. Soil-test, crop-stage and "
                "location information is required."
            ),
        }

    # Phase 17 does not calculate agronomic fertilizer dosage.
    # A verified location-specific module can be connected later.
    return {
        "dosage_allowed": False,
        "recommendation_type": fertilizer.get(
            "recommendation_type",
            "expert_calculation_required",
        ),
        "dosage": None,
        "guidance": fertilizer.get(
            "guidance",
            [],
        ),
        "missing_inputs": [],
        "reason": (
            "Inputs are available, but dosage must be calculated "
            "using a verified local agricultural recommendation."
        ),
    }


class RecommendationEngine:
    """
    Convert model predictions into safe crop recommendations.
    """

    def __init__(
        self,
        knowledge_base_path=None,
    ):
        if knowledge_base_path is None:
            self.knowledge_base = CropKnowledgeBase()

        else:
            self.knowledge_base = CropKnowledgeBase(
                knowledge_base_path
            )

    def generate(
        self,
        model_label: str,
        confidence: float,
        language: str = DEFAULT_LANGUAGE,
        soil_data: dict | None = None,
    ) -> dict:
        """
        Generate one safe recommendation result.
        """
        if language not in SUPPORTED_LANGUAGES:
            language = DEFAULT_LANGUAGE

        normalized_confidence = normalize_confidence(
            confidence
        )

        confidence_level = get_confidence_level(
            normalized_confidence
        )

        entry = (
            self.knowledge_base
            .get_entry_by_model_label(
                model_label
            )
        )

        if entry is None:
            return {
                "success": False,
                "model_label": model_label,
                "confidence": round(
                    normalized_confidence,
                    4,
                ),
                "confidence_percentage": round(
                    normalized_confidence * 100,
                    2,
                ),
                "confidence_level": confidence_level,
                "message": (
                    "No knowledge-base entry was found for "
                    "this model class."
                ),
                "action": (
                    "Add the exact model label to "
                    "crop_disease_kb.json."
                ),
            }

        crop = entry.get(
            "crop",
            {},
        )

        disease = entry.get(
            "disease",
            {},
        )

        management = entry.get(
            "management",
            {},
        )

        verification = entry.get(
            "verification",
            {},
        )

        symptoms = get_localized_value(
            entry.get(
                "symptoms",
                {},
            ),
            language,
        )

        result = {
            "success": True,
            "entry_id": entry.get("id"),
            "model_label": model_label,

            "confidence": round(
                normalized_confidence,
                4,
            ),

            "confidence_percentage": round(
                normalized_confidence * 100,
                2,
            ),

            "confidence_level": confidence_level,

            "confidence_message": (
                build_confidence_message(
                    confidence_level
                )
            ),

            "crop": {
                "code": crop.get("code"),

                "name": get_localized_value(
                    crop.get(
                        "name",
                        {},
                    ),
                    language,
                ),
            },

            "disease": {
                "code": disease.get("code"),

                "name": get_localized_value(
                    disease.get(
                        "name",
                        {},
                    ),
                    language,
                ),

                "category": disease.get(
                    "category",
                ),

                "causal_agent": disease.get(
                    "causal_agent",
                ),
            },

            "symptoms": symptoms,

            "favourable_conditions": entry.get(
                "favourable_conditions",
                [],
            ),

            "management": {
                "immediate_actions": management.get(
                    "immediate_actions",
                    [],
                ),

                "prevention": management.get(
                    "prevention",
                    [],
                ),

                "biological_or_low_risk_options": (
                    management.get(
                        "biological_or_low_risk_options",
                        [],
                    )
                ),
            },

            "chemical_control": (
                safe_chemical_recommendation(
                    entry=entry,
                    confidence_level=confidence_level,
                )
            ),

            "fertilizer_guidance": (
                safe_fertilizer_guidance(
                    entry=entry,
                    soil_data=soil_data,
                )
            ),

            "safety": entry.get(
                "safety",
                [],
            ),

            "verification": {
                "status": verification.get(
                    "status",
                    "REVIEW_REQUIRED",
                ),

                "reviewed_by": verification.get(
                    "reviewed_by",
                ),

                "review_date": verification.get(
                    "review_date",
                ),

                "next_review_date": verification.get(
                    "next_review_date",
                ),
            },
        }

        return result