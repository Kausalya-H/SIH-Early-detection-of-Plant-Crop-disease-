import json
from pathlib import Path


# Your PlantVillage dataset location
DATASET_PATH = Path(
    r"C:\Users\shiva\OneDrive\Documents\ml\plantvillage dataset\color"
)

# Current file:
# INNOVATRIX/ai-model/src/create_class_names.py
AI_MODEL_ROOT = Path(__file__).resolve().parent.parent

OUTPUT_PATH = (
    AI_MODEL_ROOT
    / "saved_models"
    / "class_names.json"
)


def find_class_folders(
    dataset_path: Path,
) -> tuple[Path, list[str]]:
    """
    Find the folder containing the disease-class directories.

    It checks the main dataset path and common child folders.
    """
    possible_paths = [
        dataset_path,
        dataset_path / "color",
        dataset_path / "segmented",
        dataset_path / "grayscale",
        dataset_path / "train",
    ]

    for possible_path in possible_paths:
        if not possible_path.exists():
            continue

        class_names = sorted(
            [
                folder.name
                for folder in possible_path.iterdir()
                if folder.is_dir()
                and not folder.name.startswith(".")
            ],
            key=str.casefold,
        )

        if len(class_names) >= 2:
            return possible_path, class_names

    raise FileNotFoundError(
        "Disease class folders were not found inside: "
        f"{dataset_path}"
    )


def save_class_names(
    class_names: list[str],
    output_path: Path,
) -> None:
    """
    Save class names in JSON format.
    """
    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with output_path.open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            class_names,
            file,
            ensure_ascii=False,
            indent=4,
        )


if __name__ == "__main__":
    try:
        print("\nCREATING MODEL CLASS-NAME FILE")
        print("=" * 70)
        print(f"Dataset path: {DATASET_PATH}")

        selected_dataset_path, class_names = (
            find_class_folders(DATASET_PATH)
        )

        print(
            f"Class-folder location: "
            f"{selected_dataset_path}"
        )

        print(
            f"Number of classes found: "
            f"{len(class_names)}"
        )

        print("\nClasses in model-index order:")

        for index, class_name in enumerate(
            class_names
        ):
            print(
                f"{index:02d} -> {class_name}"
            )

        save_class_names(
            class_names=class_names,
            output_path=OUTPUT_PATH,
        )

        print("\n" + "=" * 70)
        print(
            "class_names.json created successfully."
        )
        print(f"Saved at: {OUTPUT_PATH}")
        print("=" * 70)

    except Exception as error:
        print(
            f"\nUnable to create class names: {error}"
        )