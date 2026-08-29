from pathlib import Path
import json

import tensorflow as tf


# ============================================================
# 1. PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET_PATH = Path(
    r"C:\Users\shiva\OneDrive\Documents\ml\plantvillage dataset\color"
)

MODEL_DIR = PROJECT_ROOT / "models"

MODEL_PATH = (
    MODEL_DIR
    / "best_crop_disease_model.keras"
)

CLASS_NAMES_PATH = (
    MODEL_DIR
    / "class_names.json"
)


# ============================================================
# 2. SETTINGS
# ============================================================

IMAGE_SIZE = (224, 224)

BATCH_SIZE = 32

VALIDATION_SPLIT = 0.20

SEED = 42

INITIAL_EPOCHS = 10

FINE_TUNE_EPOCHS = 15


# ============================================================
# 3. CHECK DATASET
# ============================================================

print("=" * 70)
print("CROP DISEASE MODEL TRAINING")
print("=" * 70)

print("\nDataset path:")
print(DATASET_PATH)

print("\nDataset exists:")
print(DATASET_PATH.exists())

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found:\n{DATASET_PATH}"
    )

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 4. GET VALID CLASS FOLDERS
# ============================================================

all_folders = sorted(
    [
        folder.name
        for folder in DATASET_PATH.iterdir()
        if folder.is_dir()
    ]
)

print("\nFolders found in dataset:")

for index, folder in enumerate(all_folders):
    print(index, folder)


# ============================================================
# 5. REMOVE INVALID CLASS
# ============================================================

INVALID_FOLDERS = {
    "balanced_dataset"
}

class_names = [
    folder
    for folder in all_folders
    if folder not in INVALID_FOLDERS
]

print("\n" + "=" * 70)
print("VALID DISEASE CLASSES")
print("=" * 70)

for index, class_name in enumerate(class_names):
    print(
        f"{index}: {class_name}"
    )

print(
    "\nNumber of valid classes:",
    len(class_names)
)


# ============================================================
# 6. SAFETY CHECK
# ============================================================

if "balanced_dataset" in class_names:
    raise ValueError(
        "'balanced_dataset' must not be treated as a disease class."
    )

if len(class_names) != 38:
    print(
        "\nWARNING:"
    )
    print(
        f"Expected 38 PlantVillage classes, "
        f"but found {len(class_names)}."
    )
    print(
        "Check your dataset folders before continuing."
    )


# ============================================================
# 7. SAVE CLASS NAMES
# ============================================================

with open(
    CLASS_NAMES_PATH,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        class_names,
        file,
        indent=4
    )

print(
    "\nClass names saved at:"
)

print(
    CLASS_NAMES_PATH
)


# ============================================================
# 8. LOAD TRAINING DATASET
# ============================================================

print("\nLoading training dataset...")

train_dataset = (
    tf.keras.utils.image_dataset_from_directory(
        directory=DATASET_PATH,
        labels="inferred",
        label_mode="int",
        class_names=class_names,
        validation_split=VALIDATION_SPLIT,
        subset="training",
        seed=SEED,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=True
    )
)


# ============================================================
# 9. LOAD VALIDATION DATASET
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


# ============================================================
# 10. OPTIMIZE DATA PIPELINE
# ============================================================

AUTOTUNE = tf.data.AUTOTUNE

train_dataset = train_dataset.prefetch(
    buffer_size=AUTOTUNE
)

validation_dataset = validation_dataset.prefetch(
    buffer_size=AUTOTUNE
)


# ============================================================
# 11. DATA AUGMENTATION
# ============================================================

data_augmentation = tf.keras.Sequential(
    [
        tf.keras.layers.RandomFlip(
            "horizontal"
        ),

        tf.keras.layers.RandomRotation(
            0.10
        ),

        tf.keras.layers.RandomZoom(
            0.10
        ),

        tf.keras.layers.RandomContrast(
            0.10
        )
    ],
    name="data_augmentation"
)


# ============================================================
# 12. LOAD EFFICIENTNETB0
# ============================================================

print("\nLoading EfficientNetB0...")

base_model = (
    tf.keras.applications.EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_shape=(
            IMAGE_SIZE[0],
            IMAGE_SIZE[1],
            3
        )
    )
)

base_model.trainable = False


# ============================================================
# 13. BUILD MODEL
# ============================================================

inputs = tf.keras.Input(
    shape=(
        IMAGE_SIZE[0],
        IMAGE_SIZE[1],
        3
    )
)

x = data_augmentation(
    inputs
)

x = base_model(
    x,
    training=False
)

x = tf.keras.layers.GlobalAveragePooling2D()(
    x
)

x = tf.keras.layers.Dropout(
    0.30
)(
    x
)

outputs = tf.keras.layers.Dense(
    len(class_names),
    activation="softmax"
)(
    x
)

model = tf.keras.Model(
    inputs,
    outputs
)


# ============================================================
# 14. COMPILE STAGE 1
# ============================================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=[
        "accuracy"
    ]
)

print("\nModel summary:")

model.summary()


# ============================================================
# 15. CALLBACKS
# ============================================================

callbacks = [

    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(MODEL_PATH),
        monitor="val_loss",
        save_best_only=True,
        verbose=1
    ),

    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=4,
        restore_best_weights=True,
        verbose=1
    ),

    tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.2,
        patience=2,
        min_lr=1e-7,
        verbose=1
    )
]


# ============================================================
# 16. STAGE 1 TRAINING
# ============================================================

print("\n" + "=" * 70)
print("STAGE 1: TRAINING CLASSIFIER")
print("=" * 70)

history_stage_1 = model.fit(
    train_dataset,
    validation_data=validation_dataset,
    epochs=INITIAL_EPOCHS,
    callbacks=callbacks
)


# ============================================================
# 17. FINE-TUNING
# ============================================================

print("\n" + "=" * 70)
print("STAGE 2: FINE-TUNING")
print("=" * 70)

base_model.trainable = True


# Freeze most EfficientNet layers.
# Train only the last 30 layers.

for layer in base_model.layers[:-30]:
    layer.trainable = False


# ============================================================
# 18. COMPILE STAGE 2
# ============================================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.00001
    ),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=[
        "accuracy"
    ]
)


# ============================================================
# 19. FINE-TUNE MODEL
# ============================================================

history_stage_2 = model.fit(
    train_dataset,
    validation_data=validation_dataset,
    epochs=FINE_TUNE_EPOCHS,
    callbacks=callbacks
)


# ============================================================
# 20. LOAD BEST MODEL
# ============================================================

print("\nLoading best saved model...")

best_model = tf.keras.models.load_model(
    str(MODEL_PATH)
)


# ============================================================
# 21. FINAL VALIDATION CHECK
# ============================================================

print("\nFinal validation evaluation...")

validation_loss, validation_accuracy = (
    best_model.evaluate(
        validation_dataset,
        verbose=1
    )
)

print("\n" + "=" * 70)

print("TRAINING COMPLETED")

print("=" * 70)

print(
    f"Validation loss: "
    f"{validation_loss:.4f}"
)

print(
    f"Validation accuracy: "
    f"{validation_accuracy * 100:.2f}%"
)

print(
    "\nBest model saved at:"
)

print(
    MODEL_PATH
)

print(
    "\nClass names saved at:"
)

print(
    CLASS_NAMES_PATH
)