"""
Crop Disease Prediction Service
Uses the trained Keras model for 13-crop, 38-class plant disease classification.
Model: best_crop_disease_model.keras (PlantVillage dataset)
"""
import json
from pathlib import Path
import numpy as np

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models" / "disease_model"
KERAS_MODEL_PATH = MODEL_DIR / "plant_disease_model.keras"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"

# Lazy-load globals
_model = None
_class_names = None


def _load_model():
    global _model, _class_names
    if _model is None:
        import tensorflow as tf
        print(f"[disease_model] Loading Keras model from {KERAS_MODEL_PATH}")
        _model = tf.keras.models.load_model(str(KERAS_MODEL_PATH))
        print(f"[disease_model] Model loaded successfully ({len(_model.layers)} layers)")

    if _class_names is None:
        with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
            _class_names = json.load(f)
        print(f"[disease_model] Loaded {len(_class_names)} class names")

    return _model, _class_names


def _parse_class_name(raw_class: str):
    """Parse PlantVillage class name into (crop, disease).

    Examples:
        'Tomato___Early_blight' -> ('Tomato', 'Early Blight')
        'Corn_(maize)___Common_rust_' -> ('Corn', 'Common Rust')
        'Pepper,_bell___Bacterial_spot' -> ('Pepper', 'Bacterial Spot')
        'Cherry_(including_sour)___Powdery_mildew' -> ('Cherry', 'Powdery Mildew')
        'Apple___healthy' -> ('Apple', 'Healthy')
    """
    if "___" in raw_class:
        crop_part, disease_part = raw_class.split("___", 1)
    else:
        crop_part = raw_class
        disease_part = "Unknown"

    # Clean crop name
    crop = crop_part
    crop = crop.replace("_(maize)", "").replace("_(including_sour)", "")
    crop = crop.replace(",_bell", "").replace("_", " ").strip()
    # Capitalize properly
    crop = crop.title()
    # Fix common title-case issues
    crop = crop.replace("Corn (Maize)", "Corn").replace("Cherry (Including Sour)", "Cherry")
    crop = crop.replace("Pepper, Bell", "Pepper").replace("Soybean", "Soybean")

    # Clean disease name
    disease = disease_part
    disease = disease.replace("_", " ").strip()
    if disease.lower() == "healthy":
        disease = "Healthy"
    else:
        disease = disease.title()

    return crop, disease


def predict_disease_image(image_path: str):
    """Predict disease from a leaf image.

    Returns:
        (disease, confidence) where disease is the readable disease name
    """
    import tensorflow as tf

    model, class_names = _load_model()

    # Load and preprocess image
    img = tf.keras.utils.load_img(image_path, target_size=(224, 224), color_mode="rgb")
    img_array = tf.keras.utils.img_to_array(img)
    input_batch = np.expand_dims(img_array, axis=0)

    # Predict
    predictions = model.predict(input_batch, verbose=0)[0]
    top1_index = int(np.argmax(predictions))
    confidence = float(predictions[top1_index])
    raw_class = class_names[top1_index]

    # Parse into readable disease name
    crop, disease = _parse_class_name(raw_class)

    print(f"[disease_model] Predicted: {crop} / {disease} ({confidence:.1%})")

    return disease, confidence


def get_model_crop(raw_class: str) -> str:
    """Extract crop name from a PlantVillage class name string."""
    crop, _ = _parse_class_name(raw_class)
    return crop


def get_supported_classes():
    """Return list of all (crop, disease) tuples the model supports."""
    _, class_names = _load_model()
    return [_parse_class_name(c) for c in class_names]
