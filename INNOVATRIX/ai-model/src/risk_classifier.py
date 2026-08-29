from typing import Any


VALID_SPREAD_SPEEDS = {
    "none",
    "slow",
    "moderate",
    "rapid",
}

VALID_WEATHER_RISKS = {
    "low",
    "medium",
    "high",
}

VALID_PLANT_STAGES = {
    "seedling",
    "vegetative",
    "flowering",
    "fruiting",
    "harvest",
}

HEALTHY_CATEGORIES = {
    "healthy",
}

HIGH_IMPACT_CATEGORIES = {
    "viral",
    "bacterial",
    "pest",
}


def normalize_confidence(
    confidence: float,
) -> float:
    """
    Convert confidence to a value between 0 and 1.

    Both 0.85 and 85 are accepted.
    """
    value = float(confidence)

    if value > 1:
        value = value / 100

    return max(0.0, min(value, 1.0))


def normalize_percentage(
    percentage: float,
) -> float:
    """
    Restrict a percentage to the range 0 to 100.
    """
    value = float(percentage)

    return max(0.0, min(value, 100.0))


def validate_choice(
    value: str,
    valid_values: set[str],
    field_name: str,
) -> str:
    """
    Validate a text-based risk input.
    """
    normalized_value = value.strip().lower()

    if normalized_value not in valid_values:
        allowed = ", ".join(sorted(valid_values))

        raise ValueError(
            f"Invalid {field_name}: {value}. "
            f"Allowed values: {allowed}"
        )

    return normalized_value


def affected_area_score(
    affected_area_percent: float,
) -> tuple[int, str]:
    """
    Calculate risk points from the affected area.
    """
    percentage = normalize_percentage(
        affected_area_percent
    )

    if percentage == 0:
        return 0, "No affected area reported."

    if percentage <= 10:
        return 1, "Up to 10% of the crop is affected."

    if percentage <= 30:
        return 2, "Between 10% and 30% is affected."

    if percentage <= 60:
        return 3, "Between 30% and 60% is affected."

    return 4, "More than 60% is affected."


def spread_score(
    spread_speed: str,
) -> tuple[int, str]:
    """
    Calculate points from the reported spread speed.
    """
    scores = {
        "none": 0,
        "slow": 1,
        "moderate": 2,
        "rapid": 4,
    }

    messages = {
        "none": "No spread has been reported.",
        "slow": "Symptoms are spreading slowly.",
        "moderate": "Symptoms are spreading moderately.",
        "rapid": "Symptoms are spreading rapidly.",
    }

    return (
        scores[spread_speed],
        messages[spread_speed],
    )


def weather_score(
    weather_risk: str,
) -> tuple[int, str]:
    """
    Calculate points from weather conditions.
    """
    scores = {
        "low": 0,
        "medium": 1,
        "high": 2,
    }

    messages = {
        "low": "Weather conditions have low disease risk.",
        "medium": (
            "Weather may support disease development."
        ),
        "high": (
            "Weather strongly supports disease development."
        ),
    }

    return (
        scores[weather_risk],
        messages[weather_risk],
    )


def plant_stage_score(
    plant_stage: str,
) -> tuple[int, str]:
    """
    Calculate points from crop growth stage.
    """
    scores = {
        "seedling": 2,
        "vegetative": 1,
        "flowering": 2,
        "fruiting": 2,
        "harvest": 1,
    }

    messages = {
        "seedling": (
            "Seedlings can be highly vulnerable to damage."
        ),
        "vegetative": (
            "The crop is in the vegetative stage."
        ),
        "flowering": (
            "Disease during flowering may reduce yield."
        ),
        "fruiting": (
            "Disease during fruiting may affect yield "
            "and produce quality."
        ),
        "harvest": (
            "The crop is close to harvest."
        ),
    }

    return (
        scores[plant_stage],
        messages[plant_stage],
    )


def disease_category_score(
    disease_category: str,
) -> tuple[int, str]:
    """
    Calculate points using the disease category.
    """
    category = (
        disease_category
        .strip()
        .lower()
    )

    if category in HEALTHY_CATEGORIES:
        return 0, "The model predicted a healthy class."

    if category in HIGH_IMPACT_CATEGORIES:
        return (
            2,
            f"The disease category is {category}.",
        )

    if category in {
        "fungal",
        "oomycete",
        "insect",
    }:
        return (
            1,
            f"The disease category is {category}.",
        )

    return (
        1,
        "The disease category is unverified or unspecified.",
    )


def score_to_level(
    score: int,
) -> str:
    """
    Convert the total risk score into a risk level.
    """
    if score <= 2:
        return "LOW"

    if score <= 5:
        return "MEDIUM"

    if score <= 8:
        return "HIGH"

    return "CRITICAL"


def build_action(
    risk_level: str,
) -> str:
    """
    Return a safe action for each risk level.
    """
    actions = {
        "LOW": (
            "Monitor the plant, capture additional images "
            "and continue preventive crop care."
        ),
        "MEDIUM": (
            "Inspect nearby plants, isolate affected material "
            "where appropriate and monitor the crop daily."
        ),
        "HIGH": (
            "Inspect the complete field promptly and contact "
            "a local agricultural officer or plant-health expert."
        ),
        "CRITICAL": (
            "Seek urgent expert assessment. Rapid spread or "
            "extensive damage may threaten a major part of "
            "the crop."
        ),
        "UNKNOWN": (
            "Capture clearer images and obtain expert assessment "
            "before taking chemical-control decisions."
        ),
    }

    return actions[risk_level]


def classify_risk(
    disease_category: str,
    confidence: float,
    affected_area_percent: float,
    spread_speed: str,
    weather_risk: str,
    plant_stage: str,
    multiple_plants_affected: bool,
) -> dict[str, Any]:
    """
    Classify crop-disease risk using prediction and field data.
    """
    normalized_confidence = normalize_confidence(
        confidence
    )

    normalized_category = (
        disease_category
        .strip()
        .lower()
    )

    spread_speed = validate_choice(
        spread_speed,
        VALID_SPREAD_SPEEDS,
        "spread speed",
    )

    weather_risk = validate_choice(
        weather_risk,
        VALID_WEATHER_RISKS,
        "weather risk",
    )

    plant_stage = validate_choice(
        plant_stage,
        VALID_PLANT_STAGES,
        "plant stage",
    )

    affected_area_percent = normalize_percentage(
        affected_area_percent
    )

    # A healthy prediction with strong confidence receives low risk.
    if (
        normalized_category == "healthy"
        and normalized_confidence >= 0.80
        and affected_area_percent == 0
    ):
        return {
            "risk_level": "LOW",
            "risk_score": 0,
            "confidence": normalized_confidence,
            "affected_area_percent": affected_area_percent,
            "reasons": [
                "The model predicted a healthy class.",
                "No affected area was reported.",
            ],
            "recommended_action": build_action("LOW"),
            "requires_expert_review": False,
        }

    # Low-confidence predictions cannot produce reliable risk results.
    if normalized_confidence < 0.60:
        return {
            "risk_level": "UNKNOWN",
            "risk_score": None,
            "confidence": normalized_confidence,
            "affected_area_percent": affected_area_percent,
            "reasons": [
                "Prediction confidence is below 60%.",
                (
                    "The disease identity should be confirmed "
                    "before assigning a risk level."
                ),
            ],
            "recommended_action": build_action("UNKNOWN"),
            "requires_expert_review": True,
        }

    score = 0
    reasons = []

    area_points, area_reason = affected_area_score(
        affected_area_percent
    )
    score += area_points
    reasons.append(area_reason)

    spread_points, spread_reason = spread_score(
        spread_speed
    )
    score += spread_points
    reasons.append(spread_reason)

    weather_points, weather_reason = weather_score(
        weather_risk
    )
    score += weather_points
    reasons.append(weather_reason)

    stage_points, stage_reason = plant_stage_score(
        plant_stage
    )
    score += stage_points
    reasons.append(stage_reason)

    category_points, category_reason = (
        disease_category_score(
            normalized_category
        )
    )
    score += category_points
    reasons.append(category_reason)

    if multiple_plants_affected:
        score += 2
        reasons.append(
            "Symptoms were reported on multiple plants."
        )
    else:
        reasons.append(
            "Symptoms were reported on only one plant."
        )

    risk_level = score_to_level(score)

    return {
        "risk_level": risk_level,
        "risk_score": score,
        "confidence": normalized_confidence,
        "affected_area_percent": affected_area_percent,
        "reasons": reasons,
        "recommended_action": build_action(
            risk_level
        ),
        "requires_expert_review": (
            risk_level in {"HIGH", "CRITICAL"}
        ),
    }