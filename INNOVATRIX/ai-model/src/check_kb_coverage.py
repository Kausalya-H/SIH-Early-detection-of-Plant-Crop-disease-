import json
from pathlib import Path

from knowledge_base import CropKnowledgeBase


PROJECT_ROOT = Path(__file__).resolve().parents[2]

POSSIBLE_CLASS_FILES = [
    (
        PROJECT_ROOT
        / "ai-model"
        / "saved_models"
        / "class_names.json"
    ),
    (
        PROJECT_ROOT
        / "ai-model"
        / "saved_models"
        / "class_indices.json"
    ),
    (
        PROJECT_ROOT
        / "ai-model"
        / "models"
        / "class_names.json"
    ),
    (
        PROJECT_ROOT
        / "ai-model"
        / "models"
        / "class_indices.json"
    ),
]


def find_class_file() -> Path | None:
    """
    Find the first available model class-name file.
    """
    for path in POSSIBLE_CLASS_FILES:
        if path.exists():
            return path

    return None


def load_class_names(
    path: Path,
) -> list[str]:
    """
    Load ordered model class names from supported JSON formats.
    """
    with path.open(
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

    # Format:
    # [
    #   "Tomato___Early_blight",
    #   "Tomato___Late_blight"
    # ]
    if isinstance(data, list):
        return [
            str(value)
            for value in data
        ]

    if isinstance(data, dict):
        # Format:
        # {
        #   "Tomato___Early_blight": 0,
        #   "Tomato___Late_blight": 1
        # }
        if all(
            isinstance(value, int)
            for value in data.values()
        ):
            sorted_items = sorted(
                data.items(),
                key=lambda item: item[1],
            )

            return [
                str(name)
                for name, index in sorted_items
            ]

        # Format:
        # {
        #   "0": "Tomato___Early_blight",
        #   "1": "Tomato___Late_blight"
        # }
        if all(
            str(key).isdigit()
            for key in data.keys()
        ):
            sorted_items = sorted(
                data.items(),
                key=lambda item: int(item[0]),
            )

            return [
                str(value)
                for key, value in sorted_items
            ]

    raise ValueError(
        "Unsupported class-name JSON format."
    )


def check_coverage(
    class_names: list[str],
) -> dict:
    """
    Compare trained model classes with knowledge-base entries.
    """
    knowledge_base = CropKnowledgeBase()

    covered = []
    missing = []

    for class_name in class_names:
        entry = (
            knowledge_base
            .get_entry_by_model_label(
                class_name
            )
        )

        if entry is None:
            missing.append(class_name)

        else:
            covered.append({
                "class_name": class_name,
                "entry_id": entry["id"],
            })

    total = len(class_names)

    coverage_percentage = (
        round(
            len(covered) / total * 100,
            2,
        )
        if total
        else 0.0
    )

    return {
        "total_classes": total,
        "covered_count": len(covered),
        "missing_count": len(missing),
        "coverage_percentage": coverage_percentage,
        "covered": covered,
        "missing": missing,
    }


if __name__ == "__main__":
    try:
        class_file = find_class_file()

        if class_file is None:
            print(
                "\nNo class-name JSON file was found."
            )

            print(
                "Expected one of these locations:"
            )

            for possible_path in POSSIBLE_CLASS_FILES:
                print(f"- {possible_path}")

            print(
                "\nCreate class_names.json using the "
                "exact ordered class list from training."
            )

        else:
            print(
                f"\nClass-name file: {class_file}"
            )

            class_names = load_class_names(
                class_file
            )

            result = check_coverage(
                class_names
            )

            print("\nKNOWLEDGE-BASE COVERAGE")
            print("=" * 70)

            print(
                f"Model classes       : "
                f"{result['total_classes']}"
            )

            print(
                f"Covered classes     : "
                f"{result['covered_count']}"
            )

            print(
                f"Missing classes     : "
                f"{result['missing_count']}"
            )

            print(
                f"Coverage percentage : "
                f"{result['coverage_percentage']}%"
            )

            if result["covered"]:
                print("\nCovered classes:")

                for covered in result["covered"]:
                    print(
                        f"- {covered['class_name']} "
                        f"-> {covered['entry_id']}"
                    )

            if result["missing"]:
                print(
                    "\nMissing knowledge-base entries:"
                )

                for class_name in result["missing"]:
                    print(f"- {class_name}")

            else:
                print(
                    "\nEvery trained model class has a "
                    "knowledge-base entry."
                )

            print("=" * 70)

    except Exception as error:
        print(
            f"\nCoverage check failed: {error}"
        )