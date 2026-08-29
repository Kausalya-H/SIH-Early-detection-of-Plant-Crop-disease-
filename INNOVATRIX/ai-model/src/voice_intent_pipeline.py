import json
from pathlib import Path

from intent_detection import detect_intent
from voice_input import transcribe_audio


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_AUDIO_PATH = (
    PROJECT_ROOT
    / "audio_samples"
    / "voice_input.wav"
)


def process_voice_intent(
    audio_path: str | Path = DEFAULT_AUDIO_PATH,
    language_code: str | None = None,
) -> dict:
    """
    Convert farmer speech into text and detect the farmer's intent.

    Args:
        audio_path:
            Path of the farmer's recorded audio file.
        language_code:
            Optional language code: en, hi, te or mr.
            Use None for automatic language detection.

    Returns:
        Dictionary containing transcription and intent results.
    """
    transcription = transcribe_audio(
        audio_path=audio_path,
        language=language_code,
    )

    if not transcription["success"]:
        return {
            "success": False,
            "error": "No speech could be recognized.",
            "transcription": transcription,
            "intent_result": None,
        }

    intent_result = detect_intent(
        text=transcription["text"],
        language_code=transcription["language_code"],
    )

    return {
        "success": intent_result["success"],
        "transcription": transcription,
        "intent_result": intent_result,
    }


def print_pipeline_result(result: dict) -> None:
    print("\nVOICE AND NLP PIPELINE RESULT")
    print("=" * 65)

    if not result["success"]:
        print("Pipeline status : Failed")
        print(
            f"Reason          : "
            f"{result.get('error', 'Intent was not identified')}"
        )

    transcription = result.get("transcription")

    if transcription:
        print(f"Recognized text : {transcription['text']}")
        print(
            f"Language        : "
            f"{transcription['language_name']}"
        )

    intent_result = result.get("intent_result")

    if intent_result:
        print(
            f"Detected intent : "
            f"{intent_result['intent']}"
        )
        print(
            f"Confidence      : "
            f"{intent_result['confidence']:.2%}"
        )
        print(
            f"Meaning         : "
            f"{intent_result['intent_description']}"
        )

    print("=" * 65)


if __name__ == "__main__":
    try:
        print("\nSupported language codes:")
        print("en = English")
        print("hi = Hindi")
        print("te = Telugu")
        print("mr = Marathi")

        entered_path = input(
            "\nEnter audio path "
            "[press Enter for audio_samples/voice_input.wav]: "
        ).strip()

        selected_audio = (
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

        pipeline_result = process_voice_intent(
            audio_path=selected_audio,
            language_code=language,
        )

        print_pipeline_result(pipeline_result)

        print("\nCOMPLETE JSON OUTPUT")

        print(
            json.dumps(
                pipeline_result,
                ensure_ascii=False,
                indent=4,
            )
        )

    except Exception as error:
        print(f"\nVoice-intent pipeline failed: {error}")