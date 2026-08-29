from pathlib import Path
import json

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import tensorflow as tf

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)


# ============================================================
# 1. PATHS AND SETTINGS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET_PATH = Path(
    r"C:\Users\shiva\OneDrive\Documents\ml\plantvillage dataset\color\balanced_dataset"
)

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

CONFUSION_MATRIX_PATH = (
    PROJECT_ROOT
    / "models"
    / "confusion_matrix.png"
)

CLASSIFICATION_REPORT_PATH = (
    PROJECT_ROOT
    / "models"
    / "classification_report.txt"
)

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
VALIDATION_SPLIT = 0.20
SEED = 42


# ============================================================
# 2. CHECK REQUIRED FILES
# ============================================================

print("=" * 65)
print("CROP DISEASE MODEL EVALUATION")
print("=" * 65)

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset was not found:\n{DATASET_PATH}"
    )

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model was not found:\n{MODEL_PATH}"
    )

if not CLASS_NAMES_PATH.exists():
    raise FileNotFoundError(
        f"Class names file was not found:\n{CLASS_NAMES_PATH}"
    )


# ============================================================
# 3. LOAD CLASS NAMES
# ============================================================

with open(
    CLASS_NAMES_PATH,
    "r",
    encoding="utf-8"
) as file:
    class_names = json.load(file)

number_of_classes = len(class_names)

print("\nNumber of classes:", number_of_classes)


# ============================================================
# 4. LOAD THE SAME VALIDATION DATASET
# ============================================================

print("\nLoading validation dataset...")

validation_dataset = (
    tf.keras.utils.image_dataset_from_directory(
        directory=DATASET_PATH,
        labels="inferred",
        label_mode="int",
        class_names=class_names,
        validation_split=VALIDATION_SPLIT,
        subset="validation",
        seed=SEED,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False
    )
)

validation_dataset = validation_dataset.prefetch(
    tf.data.AUTOTUNE
)


# ============================================================
# 5. LOAD BEST TRAINED MODEL
# ============================================================

print("\nLoading best trained model...")

model = tf.keras.models.load_model(
    str(MODEL_PATH)
)

print("Model loaded successfully.")


# ============================================================
# 6. CALCULATE VALIDATION LOSS
# ============================================================

print("\nCalculating validation loss and accuracy...")

validation_loss, keras_accuracy = model.evaluate(
    validation_dataset,
    verbose=1
)


# ============================================================
# 7. COLLECT ACTUAL LABELS
# ============================================================

print("\nCollecting actual labels...")

actual_labels = np.concatenate(
    [
        batch_labels.numpy()
        for _, batch_labels in validation_dataset
    ]
)


# ============================================================
# 8. GENERATE PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

prediction_probabilities = model.predict(
    validation_dataset,
    verbose=1
)

predicted_labels = np.argmax(
    prediction_probabilities,
    axis=1
)


# ============================================================
# 9. CALCULATE METRICS
# ============================================================

accuracy = accuracy_score(
    actual_labels,
    predicted_labels
)

macro_precision = precision_score(
    actual_labels,
    predicted_labels,
    average="macro",
    zero_division=0
)

macro_recall = recall_score(
    actual_labels,
    predicted_labels,
    average="macro",
    zero_division=0
)

macro_f1 = f1_score(
    actual_labels,
    predicted_labels,
    average="macro",
    zero_division=0
)

weighted_precision = precision_score(
    actual_labels,
    predicted_labels,
    average="weighted",
    zero_division=0
)

weighted_recall = recall_score(
    actual_labels,
    predicted_labels,
    average="weighted",
    zero_division=0
)

weighted_f1 = f1_score(
    actual_labels,
    predicted_labels,
    average="weighted",
    zero_division=0
)


# ============================================================
# 10. DISPLAY OVERALL RESULTS
# ============================================================

print("\n" + "=" * 65)
print("VALIDATION RESULTS")
print("=" * 65)

print(f"Validation loss:       {validation_loss:.4f}")
print(f"Accuracy:              {accuracy * 100:.2f}%")
print(f"Macro precision:       {macro_precision * 100:.2f}%")
print(f"Macro recall:          {macro_recall * 100:.2f}%")
print(f"Macro F1-score:        {macro_f1 * 100:.2f}%")
print(f"Weighted precision:    {weighted_precision * 100:.2f}%")
print(f"Weighted recall:       {weighted_recall * 100:.2f}%")
print(f"Weighted F1-score:     {weighted_f1 * 100:.2f}%")

print(
    f"Keras accuracy check:  "
    f"{keras_accuracy * 100:.2f}%"
)


# ============================================================
# 11. CLASSIFICATION REPORT
# ============================================================

report = classification_report(
    actual_labels,
    predicted_labels,
    labels=list(range(number_of_classes)),
    target_names=class_names,
    digits=4,
    zero_division=0
)

print("\n" + "=" * 65)
print("CLASS-WISE CLASSIFICATION REPORT")
print("=" * 65)

print(report)

with open(
    CLASSIFICATION_REPORT_PATH,
    "w",
    encoding="utf-8"
) as report_file:
    report_file.write("CROP DISEASE MODEL EVALUATION\n")
    report_file.write("=" * 65 + "\n\n")

    report_file.write(
        f"Validation loss: {validation_loss:.4f}\n"
    )
    report_file.write(
        f"Accuracy: {accuracy * 100:.2f}%\n"
    )
    report_file.write(
        f"Macro precision: "
        f"{macro_precision * 100:.2f}%\n"
    )
    report_file.write(
        f"Macro recall: "
        f"{macro_recall * 100:.2f}%\n"
    )
    report_file.write(
        f"Macro F1-score: "
        f"{macro_f1 * 100:.2f}%\n"
    )
    report_file.write(
        f"Weighted precision: "
        f"{weighted_precision * 100:.2f}%\n"
    )
    report_file.write(
        f"Weighted recall: "
        f"{weighted_recall * 100:.2f}%\n"
    )
    report_file.write(
        f"Weighted F1-score: "
        f"{weighted_f1 * 100:.2f}%\n\n"
    )

    report_file.write(report)

print("\nClassification report saved at:")
print(CLASSIFICATION_REPORT_PATH)


# ============================================================
# 12. CONFUSION MATRIX
# ============================================================

matrix = confusion_matrix(
    actual_labels,
    predicted_labels,
    labels=list(range(number_of_classes))
)

plt.figure(figsize=(24, 20))

sns.heatmap(
    matrix,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=class_names,
    yticklabels=class_names,
    annot_kws={"size": 6}
)

plt.title(
    "Crop Disease Classification Confusion Matrix",
    fontsize=18
)

plt.xlabel(
    "Predicted Class",
    fontsize=14
)

plt.ylabel(
    "Actual Class",
    fontsize=14
)

plt.xticks(
    rotation=90,
    fontsize=7
)

plt.yticks(
    rotation=0,
    fontsize=7
)

plt.tight_layout()

plt.savefig(
    CONFUSION_MATRIX_PATH,
    dpi=300,
    bbox_inches="tight"
)

print("\nConfusion matrix saved at:")
print(CONFUSION_MATRIX_PATH)

plt.show()

print("\nEvaluation completed successfully.")



















