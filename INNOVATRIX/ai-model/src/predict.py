from pathlib import Path
import tensorflow as tf
import json
from prediction_service import (
    create_prediction_response,
    create_complete_prediction_response,
)

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf


# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
print("Project root:", PROJECT_ROOT)

MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "best_crop_disease_model.keras"
)

CLASS_NAMES_PATH = (
    PROJECT_ROOT
    / "models"
    / "class_names.json"
)


# ============================================================
# 2. TEST IMAGE PATH
# ============================================================

# Replace this path with the exact path of the leaf image
# that you want to test.

IMAGE_PATH = Path(
    r"C:\Users\shiva\OneDrive\Pictures\Screenshots\Screenshot 2026-08-29 161428.png"
)
IMAGE_SIZE = (224, 224)


# ============================================================
# 3. VERIFY REQUIRED FILES
# ============================================================

print("=" * 60)
print("CROP DISEASE PREDICTION")
print("=" * 60)

print("\nModel path:", MODEL_PATH)
print("Model exists:", MODEL_PATH.exists())

print("\nClass names path:", CLASS_NAMES_PATH)
print("Class names file exists:", CLASS_NAMES_PATH.exists())

print("\nTest image path:", IMAGE_PATH)
print("Test image exists:", IMAGE_PATH.exists())

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        "\nThe trained model was not found.\n"
        f"Expected location: {MODEL_PATH}\n"
        "Complete model training before running prediction."
    )

if not CLASS_NAMES_PATH.exists():
    raise FileNotFoundError(
        "\nThe class_names.json file was not found.\n"
        f"Expected location: {CLASS_NAMES_PATH}"
    )

if not IMAGE_PATH.exists():
    raise FileNotFoundError(
        "\nThe test image was not found.\n"
        f"Checked location: {IMAGE_PATH}\n"
        "Replace IMAGE_PATH with the exact image location."
    )


# ============================================================
# 4. LOAD MODEL
# ============================================================

print("\nLoading trained model...")

model = tf.keras.models.load_model(
    str(MODEL_PATH)
)

print("Model loaded successfully.")


# ============================================================
# 5. LOAD CLASS NAMES
# ============================================================

with open(
    CLASS_NAMES_PATH,
    "r",
    encoding="utf-8"
) as class_names_file:
    class_names = json.load(class_names_file)

print("Number of disease classes:", len(class_names))


# ============================================================
# 6. LOAD AND PREPARE TEST IMAGE
# ============================================================

test_image = tf.keras.utils.load_img(
    IMAGE_PATH,
    target_size=IMAGE_SIZE,
    color_mode="rgb"
)

image_array = tf.keras.utils.img_to_array(
    test_image
)

# Add a batch dimension:
# (128, 128, 3) becomes (1, 128, 128, 3).

input_batch = np.expand_dims(
    image_array,
    axis=0
)


# ============================================================
# 7. MAKE PREDICTION
# ============================================================

print("\nAnalyzing the image...")

predictions = model.predict(
    input_batch,
    verbose=0
)[0]

predicted_index = int(
    np.argmax(predictions)
)

predicted_class = class_names[predicted_index]
confidence = float(predictions[predicted_index]) * 100
complete_result = (
    create_complete_prediction_response(
        predicted_class=predicted_class,
        confidence=confidence,
        language="en",

        # Temporary test values:
        affected_area_percent=20,
        spread_speed="moderate",
        weather_risk="medium",
        plant_stage="vegetative",
        multiple_plants_affected=True,
    )
)
complete_result = create_complete_prediction_response(
    predicted_class=predicted_class,
    confidence=confidence,
    language="en",

    # Temporary Phase 21 field inputs
    affected_area_percent=20,
    spread_speed="moderate",
    weather_risk="medium",
    plant_stage="vegetative",
    multiple_plants_affected=True,
)

if not complete_result["success"]:
    print("\nPrediction failed")
    print(
        f"Reason: "
        f"{complete_result['message']}"
    )

    raise SystemExit(1)
recommendation = complete_result["prediction"]
risk = complete_result["risk"]

print("\nFINAL PREDICTION")
print("=" * 60)

print(
    f"Crop: "
    f"{recommendation['crop']['name']}"
)

print(
    f"Disease: "
    f"{recommendation['disease']['name']}"
)

print(
    f"Confidence: "
    f"{recommendation['confidence_percentage']}%"
)

print(
    f"Verification: "
    f"{recommendation['verification']['status']}"
)

print("\nImmediate actions:")

for action in recommendation[
    "management"
]["immediate_actions"]:
    print(f"- {action}")



# ============================================================
# 8. DISPLAY MAIN RESULT
# ============================================================

readable_disease_name = predicted_class.replace(
    "___",
    " - "
).replace(
    "_",
    " "
)

print("\n" + "=" * 60)
print("PREDICTION RESULT")
print("=" * 60)

print("Predicted class:", predicted_class)
print("Readable result:", readable_disease_name)
print(f"Confidence: {confidence:.2f}%")
# Display Phase 21 risk classification
print("\nRISK CLASSIFICATION")
print("=" * 60)

print(
    f"Risk level: "
    f"{risk['risk_level']}"
)

print(
    f"Risk score: "
    f"{risk['risk_score']}"
)

print(
    f"Affected area: "
    f"{risk['affected_area_percent']}%"
)

print(
    f"Expert review required: "
    f"{risk['requires_expert_review']}"
)

print("\nRisk reasons:")

for reason in risk["reasons"]:
    print(f"- {reason}")

print("\nRecommended action:")
print(risk["recommended_action"])

print("=" * 60)


# ============================================================
# 9. DISPLAY TOP THREE PREDICTIONS
# ============================================================

top_three_indices = np.argsort(
    predictions
)[-3:][::-1]

print("\nTop three predictions:")

for rank, class_index in enumerate(
    top_three_indices,
    start=1
):
    class_name = class_names[int(class_index)]

    readable_name = class_name.replace(
        "___",
        " - "
    ).replace(
        "_",
        " "
    )

    class_confidence = (
        float(predictions[class_index]) * 100
    )

    print(
        f"{rank}. {readable_name}: "
        f"{class_confidence:.2f}%"
    )


# ============================================================
# 10. CONFIDENCE WARNING
# ============================================================

if confidence < 50:
    print(
        "\nWarning: The model has low confidence."
    )
    print(
        "Try using a clearer leaf image with good lighting."
    )


# ============================================================
# 11. DISPLAY TEST IMAGE
# ============================================================

plt.figure(figsize=(7, 7))
plt.imshow(test_image)
plt.axis("off")

plt.title(
    f"Prediction: {readable_disease_name}\n"
    f"Confidence: {confidence:.2f}%"
)

plt.tight_layout()
plt.show()