import json
from pathlib import Path


# Find crop_knowledge.json
BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_FILE = BASE_DIR / "data" / "crop_knowledge.json"


def load_crop_knowledge():
    with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def normalize_text(text: str):
    return " ".join(
        text.replace("_", " ")
        .replace("-", " ")
        .lower()
        .split()
    )


def get_disease_information(crop: str, disease: str):
    knowledge = load_crop_knowledge()

    # Find crop
    crop_data = None

    for crop_name, data in knowledge.items():
        if normalize_text(crop_name) == normalize_text(crop):
            crop_data = data
            break

    if not crop_data:
        return None

    # Find disease
    disease_data = None

    for disease_name, data in crop_data.items():
        if normalize_text(disease_name) == normalize_text(disease):
            disease_data = data
            break

    return disease_data