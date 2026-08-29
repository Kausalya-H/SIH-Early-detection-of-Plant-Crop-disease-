import json
from typing import Optional

from intent_detection import detect_intent
from multilingual_response import generate_response


def process_text_query(
    text: str,
    language_code: Optional[str],
    crop_name: Optional[str] = None,
    disease_name: Optional[str] = None,
) -> dict:
    """
    Detect the farmer's intent and generate a response.

    Args:
        text:
            Farmer's typed or transcribed question.
        language_code:
            en, hi, te or mr.
        crop_name:
            Optional crop name.
        disease_name:
            Optional disease-prediction result.

    Returns:
        Complete NLP and response result.
    """
    intent_result = detect_intent(
        text=text,
        language_code=language_code,
    )

    response_result = generate_response(
        intent=intent_result["intent"],
        language_code=language_code,
        crop_name=crop_name,
        disease_name=disease_name,
    )

    return {
        "success": intent_result["success"],
        "input": {
            "text": text,
            "language_code": language_code,
            "crop_name": crop_name,
            "disease_name": disease_name,
        },
        "intent_result": intent_result,
        "response_result": response_result,
    }


def print_pipeline_result(result: dict) -> None:
    """
    Display the final result.
    """
    print("\nTEXT ASSISTANT RESULT")
    print("=" * 70)

    print(
        f"Question          : "
        f"{result['input']['text']}"
    )

    print(
        f"Detected intent   : "
        f"{result['intent_result']['intent']}"
    )

    print(
        f"Intent confidence : "
        f"{result['intent_result']['confidence']:.2%}"
    )

    print(
        f"Response language : "
        f"{result['response_result']['response_language_name']}"
    )

    print(
        f"\nResponse:\n"
        f"{result['response_result']['response']}"
    )

    print("=" * 70)


if __name__ == "__main__":
    try:
        print("\nSupported languages:")
        print("en = English")
        print("hi = Hindi")
        print("te = Telugu")
        print("mr = Marathi")

        question = input(
            "\nEnter the farmer's question: "
        ).strip()

        language = input(
            "Enter language code [en/hi/te/mr]: "
        ).strip().lower()

        crop = input(
            "Enter crop name [optional]: "
        ).strip()

        disease = input(
            "Enter predicted disease [optional]: "
        ).strip()

        result = process_text_query(
            text=question,
            language_code=language,
            crop_name=crop or None,
            disease_name=disease or None,
        )

        print_pipeline_result(result)

        print("\nCOMPLETE JSON OUTPUT")

        print(
            json.dumps(
                result,
                ensure_ascii=False,
                indent=4,
            )
        )

    except Exception as error:
        print(f"\nPipeline failed: {error}")