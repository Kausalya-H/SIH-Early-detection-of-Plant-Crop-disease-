import json
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional

from knowledge_base import (
    CropKnowledgeBase,
    DEFAULT_KNOWLEDGE_BASE_PATH,
    normalize_search_text,
)


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


def find_class_file() -> Optional[Path]:
    """
    Find the JSON file containing trained model classes.
    """
    for path in POSSIBLE_CLASS_FILES:
        if path.exists():
            return path

    return None


def load_class_names(
    class_file: Path,
) -> list[str]:
    """
    Read class names from supported JSON formats.
    """
    with class_file.open(
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

    # Format:
    # ["Apple___Apple_scab", "Tomato___healthy"]
    if isinstance(data, list):
        return [
            str(value).strip()
            for value in data
            if str(value).strip()
        ]

    if isinstance(data, dict):
        # Format:
        # {"Apple___Apple_scab": 0, "Tomato___healthy": 1}
        if all(
            isinstance(value, int)
            for value in data.values()
        ):
            ordered_items = sorted(
                data.items(),
                key=lambda item: item[1],
            )

            return [
                str(class_name).strip()
                for class_name, index in ordered_items
            ]

        # Format:
        # {"0": "Apple___Apple_scab"}
        if all(
            str(key).isdigit()
            for key in data
        ):
            ordered_items = sorted(
                data.items(),
                key=lambda item: int(item[0]),
            )

            return [
                str(class_name).strip()
                for index, class_name in ordered_items
            ]

    raise ValueError(
        "Unsupported class_names.json format."
    )


def split_model_label(
    model_label: str,
) -> tuple[str, str]:
    """
    Split a PlantVillage model class into crop and disease.

    Example:
        Tomato___Late_blight
        -> Tomato
        -> Late_blight
    """
    if "___" in model_label:
        crop_part, disease_part = model_label.split(
            "___",
            maxsplit=1,
        )

    else:
        normalized = model_label.replace(
            "__",
            "_",
        )

        parts = normalized.split(
            "_",
            maxsplit=1,
        )

        crop_part = parts[0]

        disease_part = (
            parts[1]
            if len(parts) > 1
            else "unknown"
        )

    return crop_part.strip(), disease_part.strip()


def humanize_name(
    value: str,
) -> str:
    """
    Convert an ML class component into readable text.

    Example:
        Late_blight -> Late blight
    """
    cleaned = value.replace("_", " ")
    cleaned = re.sub(r"\s+", " ", cleaned)
    cleaned = cleaned.strip()

    if not cleaned:
        return "Unknown"

    return cleaned[0].upper() + cleaned[1:]


def create_code(
    value: str,
) -> str:
    """
    Create a safe lowercase identifier.
    """
    code = value.casefold()
    code = code.replace("___", "_")
    code = re.sub(
        r"[^a-z0-9]+",
        "_",
        code,
    )
    code = re.sub(
        r"_+",
        "_",
        code,
    )

    return code.strip("_") or "unknown"


def infer_category(
    disease_name: str,
) -> str:
    """
    Infer only a broad provisional category.

    The result must still be reviewed by an agricultural expert.
    """
    normalized = disease_name.casefold()

    if "healthy" in normalized:
        return "healthy"

    if "bacterial" in normalized:
        return "bacterial"

    if "virus" in normalized:
        return "viral"

    if "mosaic" in normalized:
        return "viral"

    if "yellow leaf curl" in normalized:
        return "viral"

    if "mite" in normalized:
        return "pest"

    if "spider" in normalized:
        return "pest"

    if "mold" in normalized:
        return "fungal"

    if "mildew" in normalized:
        return "fungal"

    if "rust" in normalized:
        return "fungal"

    if "scab" in normalized:
        return "fungal"

    if "blight" in normalized:
        return "unverified_disease"

    if "spot" in normalized:
        return "unverified_disease"

    if "rot" in normalized:
        return "unverified_disease"

    return "unverified_disease"


def create_placeholder_entry(
    model_label: str,
) -> dict:
    """
    Create a safe placeholder record for one missing model class.
    """
    crop_part, disease_part = split_model_label(
        model_label
    )

    crop_name = humanize_name(crop_part)
    disease_name = humanize_name(disease_part)

    crop_code = create_code(crop_part)
    disease_code = create_code(disease_part)

    entry_id = (
        f"{crop_code}_{disease_code}"
    )

    category = infer_category(
        disease_name
    )

    is_healthy = category == "healthy"

    if is_healthy:
        english_symptom = (
            "The image model did not detect a supported "
            "disease-specific visual pattern."
        )

        immediate_actions = [
            "Continue regular crop monitoring.",
            "Use additional clear images if visible symptoms remain.",
            "Seek expert inspection when symptoms continue or worsen."
        ]

        chemical_status = (
            "NOT_RECOMMENDED_FOR_HEALTHY_CLASS"
        )

        chemical_reason = (
            "Pesticide must not be recommended solely for "
            "a healthy model prediction."
        )

    else:
        english_symptom = (
            f"Specific symptoms for {disease_name} require "
            "agricultural expert verification before publication."
        )

        immediate_actions = [
            "Inspect the complete plant and surrounding plants.",
            "Capture multiple clear images of affected areas.",
            "Avoid applying an unverifiedverified pesticide or fertilizer.",
            "Consult a local agricultural expert when damage is severe."
        ]

        chemical_status = (
            "REQUIRES_CURRENT_CIBRC_AND_LABEL_VERIFICATION"
        )

        chemical_reason = (
            "Crop, target, formulation, registration, dosage "
            "and waiting period have not yet been verified."
        )

    return {
        "id": entry_id,

        "model_labels": [
            model_label
        ],

        "crop": {
            "code": crop_code,
            "name": {
                "en": crop_name,
                "hi": crop_name,
                "te": crop_name,
                "mr": crop_name
            }
        },

        "disease": {
            "code": disease_code,
            "name": {
                "en": disease_name,
                "hi": disease_name,
                "te": disease_name,
                "mr": disease_name
            },
            "category": category,
            "causal_agent": None
        },

        "symptoms": {
            "en": [
                english_symptom
            ],
            "hi": [
                english_symptom
            ],
            "te": [
                english_symptom
            ],
            "mr": [
                english_symptom
            ]
        },

        "favourable_conditions": [
            "Requires expert verification."
        ],

        "management": {
            "immediate_actions": immediate_actions,

            "prevention": [
                "Use healthy planting material.",
                "Maintain field sanitation.",
                "Use appropriate plant spacing.",
                "Inspect the crop regularly.",
                "Follow locally validated integrated pest-management guidance."
            ],

            "biological_or_low_risk_options": [
                "Requires crop-specific and disease-specific expert verification."
            ],

            "chemical_control": {
                "verification_status": chemical_status,
                "active_ingredients": [],
                "dosage": None,
                "reason": chemical_reason
            }
        },

        "fertilizer_guidance": {
            "recommendation_type": "soil_test_required",
            "dosage": None,

            "guidance": [
                "Do not calculate fertilizer dosage from the image prediction alone.",
                "Use a Soil Health Card or laboratory soil-test result.",
                "Follow crop-stage and location-specific fertilizer guidance."
            ],

            "required_inputs": [
                "soil_n",
                "soil_p",
                "soil_k",
                "soil_ph",
                "soil_ec",
                "organic_carbon",
                "crop_stage",
                "location"
            ]
        },

        "safety": [
            "This is an automatically generated placeholder entry.",
            "Disease information requires agricultural expert review.",
            "Do not provide pesticide dosage from this unverified record.",
            "Use only registered and correctly labelled agricultural products."
        ],

        "verification": {
            "status": "REVIEW_REQUIRED",
            "reviewed_by": None,
            "review_date": None,
            "next_review_date": None
        }
    }


def make_backup(
    knowledge_base_path: Path,
) -> Path:
    """
    Create a timestamped backup before editing the knowledge base.
    """
    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    backup_path = knowledge_base_path.with_name(
        f"{knowledge_base_path.stem}"
        f"_backup_{timestamp}"
        f"{knowledge_base_path.suffix}"
    )

    shutil.copy2(
        knowledge_base_path,
        backup_path,
    )

    return backup_path


def generate_missing_entries() -> dict:
    """
    Add safe placeholder entries for every uncovered model class.
    """
    class_file = find_class_file()

    if class_file is None:
        raise FileNotFoundError(
            "class_names.json was not found."
        )

    class_names = load_class_names(
        class_file
    )

    knowledge_base = CropKnowledgeBase()

    missing_classes = []

    for class_name in class_names:
        existing_entry = (
            knowledge_base
            .get_entry_by_model_label(
                class_name
            )
        )

        if existing_entry is None:
            missing_classes.append(
                class_name
            )

    if not missing_classes:
        return {
            "class_file": str(class_file),
            "total_classes": len(class_names),
            "missing_before": 0,
            "added": 0,
            "backup_path": None,
            "output_path": str(
                DEFAULT_KNOWLEDGE_BASE_PATH
            ),
        }

    backup_path = make_backup(
        DEFAULT_KNOWLEDGE_BASE_PATH
    )

    with DEFAULT_KNOWLEDGE_BASE_PATH.open(
        "r",
        encoding="utf-8",
    ) as file:
        kb_data = json.load(file)

    existing_ids = {
        entry["id"]
        for entry in kb_data["diseases"]
    }

    added_entries = []

    for class_name in missing_classes:
        entry = create_placeholder_entry(
            class_name
        )

        original_id = entry["id"]
        unique_id = original_id
        counter = 2

        while unique_id in existing_ids:
            unique_id = (
                f"{original_id}_{counter}"
            )
            counter += 1

        entry["id"] = unique_id
        existing_ids.add(unique_id)

        kb_data["diseases"].append(
            entry
        )

        added_entries.append(
            entry
        )

    with DEFAULT_KNOWLEDGE_BASE_PATH.open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            kb_data,
            file,
            ensure_ascii=False,
            indent=2,
        )

    return {
        "class_file": str(class_file),
        "total_classes": len(class_names),
        "missing_before": len(
            missing_classes
        ),
        "added": len(
            added_entries
        ),
        "added_classes": [
            entry["model_labels"][0]
            for entry in added_entries
        ],
        "backup_path": str(
            backup_path
        ),
        "output_path": str(
            DEFAULT_KNOWLEDGE_BASE_PATH
        ),
    }


if __name__ == "__main__":
    try:
        print(
            "\nGENERATE MISSING KNOWLEDGE-BASE ENTRIES"
        )
        print("=" * 75)

        print(
            "This will add REVIEW_REQUIRED placeholder "
            "entries for missing model classes."
        )

        confirmation = input(
            "\nEnter YES to continue: "
        ).strip()

        if confirmation != "YES":
            print(
                "\nOperation cancelled. "
                "No files were changed."
            )

        else:
            result = generate_missing_entries()

            print("\nGENERATION RESULT")
            print("=" * 75)

            print(
                f"Class file     : "
                f"{result['class_file']}"
            )

            print(
                f"Model classes  : "
                f"{result['total_classes']}"
            )

            print(
                f"Missing before : "
                f"{result['missing_before']}"
            )

            print(
                f"Entries added  : "
                f"{result['added']}"
            )

            print(
                f"Backup         : "
                f"{result['backup_path']}"
            )

            print(
                f"Updated KB     : "
                f"{result['output_path']}"
            )

            if result.get("added_classes"):
                print("\nAdded classes:")

                for class_name in result[
                    "added_classes"
                ]:
                    print(f"- {class_name}")

            print("=" * 75)

    except Exception as error:
        print(
            f"\nEntry generation failed: {error}"
        )