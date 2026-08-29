from datetime import date
from pathlib import Path

from knowledge_base import (
    CropKnowledgeBase,
    DEFAULT_KNOWLEDGE_BASE_PATH,
    normalize_search_text,
)


REQUIRED_TOP_LEVEL_FIELDS = {
    "id",
    "model_labels",
    "crop",
    "disease",
    "symptoms",
    "favourable_conditions",
    "management",
    "fertilizer_guidance",
    "safety",
    "verification",
}

REQUIRED_LANGUAGES = {
    "en",
    "hi",
    "te",
    "mr",
}

ALLOWED_VERIFICATION_STATUSES = {
    "REVIEW_REQUIRED",
    "VERIFIED",
    "EXPIRED",
    "REJECTED",
}

REQUIRED_FERTILIZER_INPUTS = {
    "soil_n",
    "soil_p",
    "soil_k",
    "soil_ph",
    "crop_stage",
    "location",
}


def validate_multilingual_field(
    field: dict,
    field_name: str,
    entry_id: str,
) -> list[str]:
    """
    Confirm that a multilingual field contains all languages.
    """
    errors = []

    if not isinstance(field, dict):
        return [
            f"{entry_id}: {field_name} must be an object."
        ]

    missing_languages = (
        REQUIRED_LANGUAGES
        - set(field.keys())
    )

    if missing_languages:
        errors.append(
            f"{entry_id}: {field_name} is missing "
            f"{sorted(missing_languages)}"
        )

    for language in REQUIRED_LANGUAGES:
        value = field.get(language)

        if value is None:
            continue

        if isinstance(value, str):
            if not value.strip():
                errors.append(
                    f"{entry_id}: {field_name}.{language} "
                    "cannot be empty."
                )

        elif isinstance(value, list):
            if not value:
                errors.append(
                    f"{entry_id}: {field_name}.{language} "
                    "cannot be an empty list."
                )

        else:
            errors.append(
                f"{entry_id}: {field_name}.{language} "
                "must be a string or list."
            )

    return errors


def validate_entry(
    entry: dict,
    entry_number: int,
) -> list[str]:
    """
    Validate one knowledge-base disease entry.
    """
    errors = []

    default_id = f"entry_{entry_number}"
    entry_id = entry.get("id", default_id)

    missing_fields = (
        REQUIRED_TOP_LEVEL_FIELDS
        - set(entry.keys())
    )

    if missing_fields:
        errors.append(
            f"{entry_id}: missing fields "
            f"{sorted(missing_fields)}"
        )

        return errors

    if not str(entry_id).strip():
        errors.append(
            f"Entry {entry_number}: id cannot be empty."
        )

    model_labels = entry.get(
        "model_labels",
        [],
    )

    if not isinstance(model_labels, list):
        errors.append(
            f"{entry_id}: model_labels must be a list."
        )

    elif not model_labels:
        errors.append(
            f"{entry_id}: model_labels cannot be empty."
        )

    else:
        for label in model_labels:
            if not str(label).strip():
                errors.append(
                    f"{entry_id}: model label cannot be empty."
                )

    crop = entry.get("crop", {})
    disease = entry.get("disease", {})

    if "code" not in crop:
        errors.append(
            f"{entry_id}: crop code is missing."
        )

    if "code" not in disease:
        errors.append(
            f"{entry_id}: disease code is missing."
        )

    if "category" not in disease:
        errors.append(
            f"{entry_id}: disease category is missing."
        )

    errors.extend(
        validate_multilingual_field(
            field=crop.get("name", {}),
            field_name="crop.name",
            entry_id=entry_id,
        )
    )

    errors.extend(
        validate_multilingual_field(
            field=disease.get("name", {}),
            field_name="disease.name",
            entry_id=entry_id,
        )
    )

    errors.extend(
        validate_multilingual_field(
            field=entry.get("symptoms", {}),
            field_name="symptoms",
            entry_id=entry_id,
        )
    )

    management = entry.get(
        "management",
        {},
    )

    chemical = management.get(
        "chemical_control",
        {},
    )

    required_chemical_fields = {
        "verification_status",
        "active_ingredients",
        "dosage",
        "reason",
    }

    missing_chemical_fields = (
        required_chemical_fields
        - set(chemical.keys())
    )

    if missing_chemical_fields:
        errors.append(
            f"{entry_id}: chemical_control is missing "
            f"{sorted(missing_chemical_fields)}"
        )

    active_ingredients = chemical.get(
        "active_ingredients",
        [],
    )

    if not isinstance(
        active_ingredients,
        list,
    ):
        errors.append(
            f"{entry_id}: active_ingredients "
            "must be a list."
        )

    fertilizer = entry.get(
        "fertilizer_guidance",
        {},
    )

    if "recommendation_type" not in fertilizer:
        errors.append(
            f"{entry_id}: fertilizer recommendation_type "
            "is missing."
        )

    if "dosage" not in fertilizer:
        errors.append(
            f"{entry_id}: fertilizer dosage field "
            "is missing."
        )

    available_inputs = set(
        fertilizer.get(
            "required_inputs",
            [],
        )
    )

    missing_inputs = (
        REQUIRED_FERTILIZER_INPUTS
        - available_inputs
    )

    if missing_inputs:
        errors.append(
            f"{entry_id}: fertilizer guidance is "
            f"missing inputs {sorted(missing_inputs)}"
        )

    verification = entry.get(
        "verification",
        {},
    )

    status = verification.get("status")

    if status not in ALLOWED_VERIFICATION_STATUSES:
        errors.append(
            f"{entry_id}: invalid verification status "
            f"'{status}'."
        )

    # Unverified chemical recommendations must not expose
    # active ingredients or dosages.
    if status != "VERIFIED":
        if chemical.get("dosage") is not None:
            errors.append(
                f"{entry_id}: an unverified entry must "
                "not contain a pesticide dosage."
            )

        if chemical.get("active_ingredients"):
            errors.append(
                f"{entry_id}: an unverified entry must "
                "not release pesticide active ingredients."
            )

    # A healthy prediction must never recommend pesticide.
    disease_category = disease.get("category")

    if disease_category == "healthy":
        if chemical.get("dosage") is not None:
            errors.append(
                f"{entry_id}: a healthy entry must "
                "not contain pesticide dosage."
            )

        if chemical.get("active_ingredients"):
            errors.append(
                f"{entry_id}: a healthy entry must "
                "not recommend pesticide."
            )

    return errors


def validate_knowledge_base(
    knowledge_base_path: str | Path
    = DEFAULT_KNOWLEDGE_BASE_PATH,
) -> dict:
    """
    Validate the complete knowledge base.
    """
    knowledge_base = CropKnowledgeBase(
        knowledge_base_path
    )

    errors = []
    warnings = []

    seen_ids = set()

    # normalized label -> entry ID
    seen_labels = {}

    for number, entry in enumerate(
        knowledge_base.diseases,
        start=1,
    ):
        errors.extend(
            validate_entry(
                entry=entry,
                entry_number=number,
            )
        )

        entry_id = entry.get(
            "id",
            f"entry_{number}",
        )

        if entry_id in seen_ids:
            errors.append(
                f"Duplicate entry id: {entry_id}"
            )

        seen_ids.add(entry_id)

        for label in entry.get(
            "model_labels",
            [],
        ):
            normalized_label = normalize_search_text(
                label
            )

            if not normalized_label:
                continue

            existing_entry_id = seen_labels.get(
                normalized_label
            )

            # Aliases with the same normalized label are
            # allowed inside the same entry.
            if (
                existing_entry_id is not None
                and existing_entry_id != entry_id
            ):
                errors.append(
                    "Conflicting normalized model label "
                    f"'{normalized_label}' belongs to both "
                    f"'{existing_entry_id}' and "
                    f"'{entry_id}'."
                )

            else:
                seen_labels[normalized_label] = entry_id

        verification = entry.get(
            "verification",
            {},
        )

        status = verification.get("status")

        if status == "REVIEW_REQUIRED":
            warnings.append(
                f"{entry_id}: agricultural expert "
                "review is required."
            )

        if status == "EXPIRED":
            warnings.append(
                f"{entry_id}: agricultural verification "
                "has expired."
            )

        next_review_date = verification.get(
            "next_review_date"
        )

        if next_review_date:
            try:
                parsed_date = date.fromisoformat(
                    next_review_date
                )

                if parsed_date < date.today():
                    warnings.append(
                        f"{entry_id}: next review date "
                        f"{next_review_date} has passed."
                    )

            except ValueError:
                errors.append(
                    f"{entry_id}: invalid next_review_date "
                    f"'{next_review_date}'. Use YYYY-MM-DD."
                )

    return {
        "valid": len(errors) == 0,
        "entries_checked": len(
            knowledge_base.diseases
        ),
        "unique_labels": len(
            seen_labels
        ),
        "errors": errors,
        "warnings": warnings,
    }


if __name__ == "__main__":
    try:
        result = validate_knowledge_base()

        print("\nKNOWLEDGE-BASE VALIDATION")
        print("=" * 70)

        print(
            f"Valid           : {result['valid']}"
        )

        print(
            f"Entries checked : "
            f"{result['entries_checked']}"
        )

        print(
            f"Unique labels   : "
            f"{result['unique_labels']}"
        )

        print(
            f"Errors          : "
            f"{len(result['errors'])}"
        )

        print(
            f"Warnings        : "
            f"{len(result['warnings'])}"
        )

        if result["errors"]:
            print("\nERRORS")

            for error in result["errors"]:
                print(f"- {error}")

        if result["warnings"]:
            print("\nWARNINGS")

            for warning in result["warnings"]:
                print(f"- {warning}")

        print("=" * 70)

    except Exception as error:
        print(
            f"\nValidation failed: {error}"
        )