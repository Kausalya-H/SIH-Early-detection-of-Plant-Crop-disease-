from ultralytics import YOLO
from pathlib import Path


# Path to trained tomato disease model
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "disease_model" / "tomato_disease.pt"


# Load model once when backend starts
model = YOLO(str(MODEL_PATH))


def predict_disease_image(image_path: str):
    results = model.predict(
        source=image_path,
        imgsz=224,
        verbose=False
    )

    result = results[0]

    top1_index = result.probs.top1
    confidence = result.probs.top1conf.item()
    class_name = result.names[top1_index]

    disease = (
        class_name
        .replace("Tomato___", "")
        .replace("_", " ")
    )

    return disease, confidence