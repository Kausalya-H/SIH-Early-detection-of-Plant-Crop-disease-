from recommendation_engine import RecommendationEngine
from risk_classifier import classify_risk

recommendation_engine = RecommendationEngine()


def create_prediction_response(
    predicted_class: str,
    confidence: float,
    language: str = "en",
    soil_data: dict | None = None,
) -> dict:
    """
    Combine the model prediction with the recommendation engine.
    """
    return recommendation_engine.generate(
        model_label=predicted_class,
        confidence=confidence,
        language=language,
        soil_data=soil_data,
    )


if __name__ == "__main__":
    test_result = create_prediction_response(
        predicted_class="Tomato___Late_blight",
        confidence=0.92,
        language="en",
    )

    print(test_result)
def create_complete_prediction_response(
    predicted_class: str,
    confidence: float,
    language: str = "en",
    affected_area_percent: float = 0,
    spread_speed: str = "none",
    weather_risk: str = "low",
    plant_stage: str = "vegetative",
    multiple_plants_affected: bool = False,
    soil_data: dict | None = None,
) -> dict:
    """
    Combine prediction, recommendation and risk results.
    """
    recommendation = create_prediction_response(
        predicted_class=predicted_class,
        confidence=confidence,
        language=language,
        soil_data=soil_data,
    )

    if not recommendation["success"]:
        return {
            "success": False,
            "prediction": recommendation,
            "risk": None,
        }

    disease_category = (
        recommendation
        .get("disease", {})
        .get("category", "unverified")
    )

    risk = classify_risk(
        disease_category=disease_category,
        confidence=confidence,
        affected_area_percent=(
            affected_area_percent
        ),
        spread_speed=spread_speed,
        weather_risk=weather_risk,
        plant_stage=plant_stage,
        multiple_plants_affected=(
            multiple_plants_affected
        ),
    )

    return {
        "success": True,
        "prediction": recommendation,
        "risk": risk,
    }