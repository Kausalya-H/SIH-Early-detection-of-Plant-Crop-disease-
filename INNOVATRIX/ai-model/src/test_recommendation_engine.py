import json

from recommendation_engine import RecommendationEngine


def print_list(
    heading: str,
    values,
) -> None:
    """
    Print a list in a readable format.
    """
    print(f"\n{heading}")

    if not values:
        print("- Not available")
        return

    if not isinstance(values, list):
        values = [values]

    for value in values:
        print(f"- {value}")


if __name__ == "__main__":
    try:
        engine = RecommendationEngine()

        print("\nRECOMMENDATION ENGINE TEST")
        print("=" * 70)

        model_label = input(
            "Enter exact model label: "
        ).strip()

        confidence_text = input(
            "Enter confidence (example 0.92 or 92): "
        ).strip()

        language = input(
            "Language [en/hi/te/mr]: "
        ).strip().lower()

        if not language:
            language = "en"

        confidence = float(
            confidence_text
        )

        result = engine.generate(
            model_label=model_label,
            confidence=confidence,
            language=language,
        )

        if not result["success"]:
            print("\nRecommendation failed")
            print(f"Reason: {result['message']}")
            print(f"Action: {result['action']}")

        else:
            print("\nRECOMMENDATION RESULT")
            print("=" * 70)

            print(
                f"Crop              : "
                f"{result['crop']['name']}"
            )

            print(
                f"Disease           : "
                f"{result['disease']['name']}"
            )

            print(
                f"Category          : "
                f"{result['disease']['category']}"
            )

            print(
                f"Confidence        : "
                f"{result['confidence_percentage']}%"
            )

            print(
                f"Confidence level  : "
                f"{result['confidence_level']}"
            )

            print(
                f"Verification      : "
                f"{result['verification']['status']}"
            )

            print(
                f"\nConfidence advice: "
                f"{result['confidence_message']}"
            )

            print_list(
                "Symptoms:",
                result["symptoms"],
            )

            print_list(
                "Immediate actions:",
                result["management"][
                    "immediate_actions"
                ],
            )

            print_list(
                "Prevention:",
                result["management"][
                    "prevention"
                ],
            )

            print_list(
                "Biological or low-risk options:",
                result["management"][
                    "biological_or_low_risk_options"
                ],
            )

            chemical = result[
                "chemical_control"
            ]

            print("\nChemical control:")
            print(
                f"- Allowed: "
                f"{chemical['allowed']}"
            )
            print(
                f"- Verification: "
                f"{chemical['verification_status']}"
            )
            print(
                f"- Active ingredients: "
                f"{chemical['active_ingredients']}"
            )
            print(
                f"- Dosage: "
                f"{chemical['dosage']}"
            )
            print(
                f"- Reason: "
                f"{chemical['reason']}"
            )

            fertilizer = result[
                "fertilizer_guidance"
            ]

            print("\nFertilizer guidance:")
            print(
                f"- Dosage allowed: "
                f"{fertilizer['dosage_allowed']}"
            )
            print(
                f"- Dosage: "
                f"{fertilizer['dosage']}"
            )
            print(
                f"- Reason: "
                f"{fertilizer['reason']}"
            )

            print_list(
                "Missing fertilizer inputs:",
                fertilizer["missing_inputs"],
            )

            print_list(
                "Safety information:",
                result["safety"],
            )

            print("\nComplete JSON result:")
            print(
                json.dumps(
                    result,
                    ensure_ascii=False,
                    indent=2,
                )
            )

            print("=" * 70)

    except ValueError:
        print(
            "\nInvalid confidence. Enter a number "
            "such as 0.92 or 92."
        )

    except Exception as error:
        print(
            f"\nRecommendation test failed: {error}"
        )