from pathlib import Path

import sounddevice as sd
from scipy.io.wavfile import write


PROJECT_ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIRECTORY = PROJECT_ROOT / "audio_samples"
DEFAULT_AUDIO_PATH = AUDIO_DIRECTORY / "voice_input.wav"

SAMPLE_RATE = 16000
CHANNELS = 1


def record_audio(
    output_path: Path = DEFAULT_AUDIO_PATH,
    duration: int = 8,
) -> Path:
    """
    Record audio from the computer microphone and save it as a WAV file.

    Args:
        output_path:
            Location where the recorded WAV file will be saved.
        duration:
            Recording duration in seconds.

    Returns:
        Path of the saved audio file.
    """
    AUDIO_DIRECTORY.mkdir(parents=True, exist_ok=True)

    print("\nRecording started...")
    print(f"Speak clearly for {duration} seconds.")

    recording = sd.rec(
        int(duration * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        dtype="int16",
    )

    sd.wait()

    write(
        str(output_path),
        SAMPLE_RATE,
        recording,
    )

    print("Recording completed.")
    print(f"Audio saved at: {output_path}")

    return output_path


if __name__ == "__main__":
    try:
        seconds_text = input(
            "Enter recording duration in seconds [default 8]: "
        ).strip()

        duration = int(seconds_text) if seconds_text else 8

        if duration <= 0:
            raise ValueError("Duration must be greater than zero.")

        record_audio(duration=duration)

    except ValueError as error:
        print(f"Invalid duration: {error}")

    except Exception as error:
        print(f"Unable to record audio: {error}")
        print(
            "Check whether your microphone is connected and "
            "microphone permission is enabled."
        )