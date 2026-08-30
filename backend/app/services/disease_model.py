import re
import json
from pathlib import Path
import numpy as np
import tensorflow as tf

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models" / "plant_disease"
MODEL_PATH = MODEL_DIR / "best_crop_disease_model.keras"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"

print(f"[disease_model] Loading model from {MODEL_PATH}")
model = tf.keras.models.load_model(str(MODEL_PATH))

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
    CLASS_NAMES = json.load(f)

print(f"[disease_model] Model loaded - {len(CLASS_NAMES)} classes")
IMAGE_SIZE = (224, 224)

def _parse_class_name(raw):
    if "___" in raw:
        plant_raw, disease_raw = raw.split("___", 1)
    else:
        return "Unknown", raw, raw
    plant = re.sub(r"_(\(.*?\))", "", plant_raw)
    plant = re.sub(r",_.*", "", plant)
    plant = plant.strip("_").replace("_", " ")
    disease = disease_raw.rstrip("_").replace("_", " ").replace("-", " ").strip()
    return plant, disease, raw

def predict_disease_image(image_path):
    img = tf.keras.utils.load_img(str(image_path), target_size=IMAGE_SIZE, color_mode="rgb")
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    predictions = model.predict(img_array, verbose=0)
    top_index = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][top_index])
    raw_class = CLASS_NAMES[top_index]
    plant, disease, model_label = _parse_class_name(raw_class)
    return plant, disease, confidence, model_label
