from pathlib import Path
from typing import Optional

from faster_whisper import WhisperModel


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_AUDIO_PATH = PROJECT_ROOT / "audio_samples" / "voice_input.wav"

# "small" gives better multilingual accuracy than "tiny" or "base".
# Change it to "base" if your computer is slow or has limited RAM.
WHISPER_MODEL_SIZE = "base"

# Keep the model loaded so repeated predictions are faster.
_whisper_model: Optional[WhisperModel] = None


LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "te": "Telugu",
    "mr": "Marathi",
    "ta": "Tamil",
    "kn": "Kannada",
}


def get_whisper_model() -> WhisperModel:
    """
    Load the Whisper speech-recognition model only once.
    """
    global _whisper_model

    if _whisper_model is None:
        print(f"Loading Whisper '{WHISPER_MODEL_SIZE}' model...")

        _whisper_model = WhisperModel(
            WHISPER_MODEL_SIZE,
            device="cpu",
            compute_type="int8",
        )

        print("Whisper model loaded successfully.")

    return _whisper_model


def transcribe_audio(
    audio_path: str | Path,
    language: Optional[str] = None,
) -> dict:
    """
    Convert an audio file into text.

    Args:
        audio_path:
            Path of the input audio file.
        language:
            Optional ISO language code such as:
            en = English
            hi = Hindi
            te = Telugu
            mr = Marathi

            When language is None, Whisper detects it automatically.

    Returns:
        Dictionary containing recognized text, language and confidence.
    """
    audio_path = Path(audio_path).resolve()

    if not audio_path.exists():
        raise FileNotFoundError(
            f"Audio file does not exist: {audio_path}"
        )

    supported_languages = {"en", "hi", "te", "mr"}

    if language is not None and language not in supported_languages:
        raise ValueError(
            "Unsupported language. Use en, hi, te, mr or None."
        )

    model = get_whisper_model()

    segments, information = model.transcribe(
        str(audio_path),
        language=language,
        beam_size=5,
        vad_filter=True,
        condition_on_previous_text=False,
    )

    recognized_parts = []

    for segment in segments:
        cleaned_text = segment.text.strip()

        if cleaned_text:
            recognized_parts.append(cleaned_text)

    recognized_text = " ".join(recognized_parts).strip()
    detected_code = information.language
    detected_name = LANGUAGE_NAMES.get(
        detected_code,
        detected_code,
    )

    return {
        "success": bool(recognized_text),
        "text": recognized_text,
        "language_code": detected_code,
        "language_name": detected_name,
        "language_probability": round(
            float(information.language_probability),
            4,
        ),
        "audio_path": str(audio_path),
    }


def print_transcription(result: dict) -> None:
    """
    Display transcription results in a readable format.
    """
    print("\nVOICE RECOGNITION RESULT")
    print("-" * 50)
    print(f"Success             : {result['success']}")
    print(f"Recognized text     : {result['text']}")
    print(f"Detected language   : {result['language_name']}")
    print(f"Language code       : {result['language_code']}")
    print(
        "Language confidence : "
        f"{result['language_probability']:.2%}"
    )
    print(f"Audio file          : {result['audio_path']}")
    print("-" * 50)


if __name__ == "__main__":
    try:
        print("\nSupported language codes:")
        print("en = English")
        print("hi = Hindi")
        print("te = Telugu")
        print("mr = Marathi")

        entered_path = input(
            "\nEnter audio path "
            "[press Enter to use audio_samples/voice_input.wav]: "
        ).strip()

        selected_audio = (
            Path(entered_path)
            if entered_path
            else DEFAULT_AUDIO_PATH
        )

        selected_language = input(
            "Enter language code "
            "[press Enter for automatic detection]: "
        ).strip().lower()

        if not selected_language:
            selected_language = None

        transcription = transcribe_audio(
            audio_path=selected_audio,
            language=selected_language,
        )

        print_transcription(transcription)

    except FileNotFoundError as error:
        print(f"\nFile error: {error}")
        print("Run record_audio.py before running voice_input.py.")

    except ValueError as error:
        print(f"\nInput error: {error}")

    except Exception as error:
        print(f"\nVoice recognition failed: {error}")

