from risk_classifier import classify_risk


def read_boolean(
    message: str,
) -> bool:
    value = input(message).strip().lower()

    if value in {"yes", "y", "true", "1"}:
        return True

    if value in {"no", "n", "false", "0"}:
        return False

    raise ValueError(
        "Enter yes or no."
    )


if __name__ == "__main__":
    try:
        print("\nCROP-DISEASE RISK CLASSIFICATION")
        print("=" * 60)

        disease_category = input(
            "Disease category "
            "[healthy/fungal/bacterial/viral/pest]: "
        ).strip()

        confidence = float(
            input(
                "Prediction confidence "
                "[example 0.85 or 85]: "
            )
        )

        affected_area = float(
            input(
                "Affected area percentage [0-100]: "
            )
        )

        spread_speed = input(
            "Spread speed "
            "[none/slow/moderate/rapid]: "
        ).strip()

        weather_risk = input(
            "Weather risk [low/medium/high]: "
        ).strip()

        plant_stage = input(
            "Plant stage "
            "[seedling/vegetative/flowering/"
            "fruiting/harvest]: "
        ).strip()

        multiple_plants = read_boolean(
            "Are multiple plants affected? [yes/no]: "
        )

        result = classify_risk(
            disease_category=disease_category,
            confidence=confidence,
            affected_area_percent=affected_area,
            spread_speed=spread_speed,
            weather_risk=weather_risk,
            plant_stage=plant_stage,
            multiple_plants_affected=multiple_plants,
        )

        print("\nRISK RESULT")
        print("=" * 60)
        print(
            f"Risk level        : "
            f"{result['risk_level']}"
        )
        print(
            f"Risk score        : "
            f"{result['risk_score']}"
        )
        print(
            f"Affected area     : "
            f"{result['affected_area_percent']}%"
        )
        print(
            f"Expert review     : "
            f"{result['requires_expert_review']}"
        )

        print("\nReasons:")

        for reason in result["reasons"]:
            print(f"- {reason}")

        print(
            "\nRecommended action:\n"
            f"{result['recommended_action']}"
        )

        print("=" * 60)

    except ValueError as error:
        print(f"\nInvalid input: {error}")

    except Exception as error:
        print(
            f"\nRisk classification failed: {error}"
        )