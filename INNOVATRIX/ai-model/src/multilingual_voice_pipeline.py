import json
from pathlib import Path
from typing import Optional

from intent_detection import detect_intent
from multilingual_response import generate_response
from voice_input import transcribe_audio


PROJECT_ROOT = Path(__file__).resolve().parent.parent

DEFAULT_AUDIO_PATH = (
    PROJECT_ROOT
    / "audio_samples"
    / "voice_input.wav"
)


def process_multilingual_voice(
    audio_path: str | Path,
    language_code: Optional[str] = None,
    crop_name: Optional[str] = None,
    disease_name: Optional[str] = None,
) -> dict:
    """
    Run speech recognition, intent detection and response generation.
    """
    transcription = transcribe_audio(
        audio_path=audio_path,
        language=language_code,
    )

    if not transcription["success"]:
        return {
            "success": False,
            "error": "No speech was recognized.",
            "transcription": transcription,
            "intent_result": None,
            "response_result": None,
        }

    detected_language = transcription["language_code"]

    # Use English if Whisper detects an unsupported language.
    if detected_language not in {"en", "hi", "te", "mr"}:
        detected_language = language_code or "en"

    intent_result = detect_intent(
        text=transcription["text"],
        language_code=detected_language,
    )

    response_result = generate_response(
        intent=intent_result["intent"],
        language_code=detected_language,
        crop_name=crop_name,
        disease_name=disease_name,
    )

    return {
        "success": True,
        "transcription": transcription,
        "intent_result": intent_result,
        "response_result": response_result,
    }


def print_result(result: dict) -> None:
    print("\nMULTILINGUAL VOICE ASSISTANT")
    print("=" * 70)

    if not result["success"]:
        print(f"Failed: {result['error']}")
        return

    print(
        f"Recognized text   : "
        f"{result['transcription']['text']}"
    )

    print(
        f"Detected language : "
        f"{result['transcription']['language_name']}"
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
        f"\nResponse:\n"
        f"{result['response_result']['response']}"
    )

    print("=" * 70)


if __name__ == "__main__":
    try:
        print("\nSupported language codes:")
        print("en = English")
        print("hi = Hindi")
        print("te = Telugu")
        print("mr = Marathi")

        entered_path = input(
            "\nEnter audio path "
            "[press Enter for the recorded audio]: "
        ).strip()

        audio_file = (
            Path(entered_path)
            if entered_path
            else DEFAULT_AUDIO_PATH
        )

        language = input(
            "Enter language code "
            "[press Enter for automatic detection]: "
        ).strip().lower()

        if not language:
            language = None

        crop = input(
            "Enter crop name [optional]: "
        ).strip()

        disease = input(
            "Enter predicted disease [optional]: "
        ).strip()

        final_result = process_multilingual_voice(
            audio_path=audio_file,
            language_code=language,
            crop_name=crop or None,
            disease_name=disease or None,
        )

        print_result(final_result)

        print("\nCOMPLETE JSON OUTPUT")

        print(
            json.dumps(
                final_result,
                ensure_ascii=False,
                indent=4,
            )
        )

    except Exception as error:
        print(f"\nMultilingual voice pipeline failed: {error}")