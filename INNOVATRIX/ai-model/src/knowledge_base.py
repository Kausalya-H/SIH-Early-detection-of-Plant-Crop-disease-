import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Optional


# knowledge_base.py is located at:
# INNOVATRIX/ai-model/src/knowledge_base.py
#
# parents[0] = src
# parents[1] = ai-model
# parents[2] = INNOVATRIX
PROJECT_ROOT = Path(__file__).resolve().parents[2]

DEFAULT_KNOWLEDGE_BASE_PATH = (
    PROJECT_ROOT
    / "knowledge-base"
    / "crop_disease_kb.json"
)

SUPPORTED_LANGUAGES = {
    "en",
    "hi",
    "te",
    "mr",
}


def normalize_search_text(value: str) -> str:
    """
    Normalize model labels and search terms.

    Examples:
        Tomato___Late_blight -> tomato late blight
        Tomato_Late_blight   -> tomato late blight
        Tomato Late blight   -> tomato late blight
    """
    if value is None:
        return ""

    normalized = str(value).strip().casefold()

    normalized = normalized.replace("___", " ")
    normalized = normalized.replace("__", " ")
    normalized = normalized.replace("_", " ")
    normalized = normalized.replace("-", " ")

    normalized = re.sub(
        r"\s+",
        " ",
        normalized,
    )

    return normalized.strip()


class CropKnowledgeBase:
    """
    Load, validate and search the crop disease knowledge base.
    """

    def __init__(
        self,
        knowledge_base_path: str | Path
        = DEFAULT_KNOWLEDGE_BASE_PATH,
    ) -> None:
        self.knowledge_base_path = Path(
            knowledge_base_path
        ).resolve()

        self.data = self._load()

        self.metadata = self.data["metadata"]
        self.diseases = self.data["diseases"]

        self._label_index = self._build_label_index()
        self._id_index = self._build_id_index()

    def _load(self) -> dict:
        """
        Read and perform basic validation of the JSON file.
        """
        if not self.knowledge_base_path.exists():
            raise FileNotFoundError(
                "Knowledge-base file was not found: "
                f"{self.knowledge_base_path}"
            )

        with self.knowledge_base_path.open(
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        if not isinstance(data, dict):
            raise ValueError(
                "Knowledge-base root must be a JSON object."
            )

        if "metadata" not in data:
            raise ValueError(
                "Knowledge base is missing 'metadata'."
            )

        if "diseases" not in data:
            raise ValueError(
                "Knowledge base is missing 'diseases'."
            )

        if not isinstance(data["diseases"], list):
            raise ValueError(
                "'diseases' must be a JSON list."
            )

        return data

    def _build_label_index(self) -> dict:
        """
        Build a lookup index for normalized model labels.

        Variations of the same class label are allowed when they
        belong to the same knowledge-base entry.

        Example:
            Tomato___Late_blight
            Tomato_Late_blight
            Tomato Late blight

        All three normalize to:
            tomato late blight

        This is valid if they belong to the same disease entry.
        """
        label_index = {}

        for entry in self.diseases:
            entry_id = entry.get("id")

            for label in entry.get(
                "model_labels",
                [],
            ):
                normalized_label = normalize_search_text(
                    label
                )

                if not normalized_label:
                    continue

                existing_entry = label_index.get(
                    normalized_label
                )

                if existing_entry is not None:
                    existing_entry_id = existing_entry.get(
                        "id"
                    )

                    # Repeated normalized aliases are allowed
                    # inside the same disease entry.
                    if existing_entry_id == entry_id:
                        continue

                    # It is a real conflict if the same normalized
                    # label belongs to two different entries.
                    raise ValueError(
                        "Conflicting normalized model label "
                        f"'{normalized_label}' belongs to both "
                        f"'{existing_entry_id}' and "
                        f"'{entry_id}'."
                    )

                label_index[normalized_label] = entry

        return label_index

    def _build_id_index(self) -> dict:
        """
        Create a lookup index using disease IDs.
        """
        id_index = {}

        for entry in self.diseases:
            entry_id = entry.get("id")

            if not entry_id:
                raise ValueError(
                    "A knowledge-base entry is missing its id."
                )

            if entry_id in id_index:
                raise ValueError(
                    f"Duplicate disease id: {entry_id}"
                )

            id_index[entry_id] = entry

        return id_index

    def get_metadata(self) -> dict:
        """
        Return knowledge-base metadata.
        """
        return deepcopy(self.metadata)

    def get_all_entries(self) -> list:
        """
        Return every knowledge-base entry.
        """
        return deepcopy(self.diseases)

    def get_entry_by_id(
        self,
        entry_id: str,
    ) -> Optional[dict]:
        """
        Find an entry using its unique ID.
        """
        entry = self._id_index.get(entry_id)

        if entry is None:
            return None

        return deepcopy(entry)

    def get_entry_by_model_label(
        self,
        model_label: str,
    ) -> Optional[dict]:
        """
        Find an entry using the class label returned by the ML model.
        """
        normalized_label = normalize_search_text(
            model_label
        )

        entry = self._label_index.get(
            normalized_label
        )

        if entry is None:
            return None

        return deepcopy(entry)

    def search(
        self,
        crop: Optional[str] = None,
        disease: Optional[str] = None,
    ) -> list:
        """
        Search entries using crop and/or disease names.

        Search values can be provided in any supported language.
        """
        normalized_crop = (
            normalize_search_text(crop)
            if crop
            else None
        )

        normalized_disease = (
            normalize_search_text(disease)
            if disease
            else None
        )

        matches = []

        for entry in self.diseases:
            crop_values = [
                entry["crop"]["code"],
                *entry["crop"]["name"].values(),
            ]

            disease_values = [
                entry["disease"]["code"],
                *entry["disease"]["name"].values(),
            ]

            normalized_crop_values = {
                normalize_search_text(value)
                for value in crop_values
            }

            normalized_disease_values = {
                normalize_search_text(value)
                for value in disease_values
            }

            crop_matches = (
                normalized_crop is None
                or normalized_crop
                in normalized_crop_values
            )

            disease_matches = (
                normalized_disease is None
                or normalized_disease
                in normalized_disease_values
            )

            if crop_matches and disease_matches:
                matches.append(
                    deepcopy(entry)
                )

        return matches

    def localize_entry(
        self,
        entry: dict,
        language_code: str = "en",
    ) -> dict:
        """
        Convert a complete entry into a selected-language result.
        """
        language_code = (
            language_code or "en"
        ).strip().lower()

        if language_code not in SUPPORTED_LANGUAGES:
            language_code = "en"

        crop_names = entry["crop"]["name"]
        disease_names = entry["disease"]["name"]
        symptoms = entry["symptoms"]

        localized = {
            "id": entry["id"],
            "model_labels": entry["model_labels"],
            "language_code": language_code,

            "crop_code": entry["crop"]["code"],
            "crop_name": crop_names.get(
                language_code,
                crop_names["en"],
            ),

            "disease_code": entry[
                "disease"
            ]["code"],

            "disease_name": disease_names.get(
                language_code,
                disease_names["en"],
            ),

            "category": entry[
                "disease"
            ]["category"],

            "causal_agent": entry[
                "disease"
            ].get("causal_agent"),

            "symptoms": symptoms.get(
                language_code,
                symptoms["en"],
            ),

            "favourable_conditions": entry.get(
                "favourable_conditions",
                [],
            ),

            "management": deepcopy(
                entry["management"]
            ),

            "fertilizer_guidance": deepcopy(
                entry["fertilizer_guidance"]
            ),

            "safety": deepcopy(
                entry.get("safety", [])
            ),

            "verification": deepcopy(
                entry["verification"]
            ),
        }

        return localized

    def get_localized_by_model_label(
        self,
        model_label: str,
        language_code: str = "en",
    ) -> Optional[dict]:
        """
        Search by model label and return localized information.
        """
        entry = self.get_entry_by_model_label(
            model_label
        )

        if entry is None:
            return None

        return self.localize_entry(
            entry=entry,
            language_code=language_code,
        )

    def get_localized_by_id(
        self,
        entry_id: str,
        language_code: str = "en",
    ) -> Optional[dict]:
        """
        Search by ID and return localized information.
        """
        entry = self.get_entry_by_id(
            entry_id
        )

        if entry is None:
            return None

        return self.localize_entry(
            entry=entry,
            language_code=language_code,
        )

    def summary(self) -> dict:
        """
        Return a summary of the knowledge base.
        """
        crops = {
            entry["crop"]["code"]
            for entry in self.diseases
        }

        categories = {}

        for entry in self.diseases:
            category = entry[
                "disease"
            ]["category"]

            categories[category] = (
                categories.get(category, 0) + 1
            )

        return {
            "knowledge_base": self.metadata.get(
                "name"
            ),
            "version": self.metadata.get(
                "version"
            ),
            "entries": len(self.diseases),
            "crops": sorted(crops),
            "categories": categories,
            "indexed_labels": len(
                self._label_index
            ),
            "path": str(
                self.knowledge_base_path
            ),
        }


def print_localized_entry(
    result: dict,
) -> None:
    """
    Print a localized knowledge-base entry.
    """
    print("\nKNOWLEDGE-BASE RESULT")
    print("=" * 70)

    print(f"Entry ID     : {result['id']}")
    print(f"Crop         : {result['crop_name']}")
    print(f"Disease      : {result['disease_name']}")
    print(f"Category     : {result['category']}")
    print(f"Cause        : {result['causal_agent']}")
    print(
        f"Language     : "
        f"{result['language_code']}"
    )
    print(
        f"Verification : "
        f"{result['verification']['status']}"
    )

    print("\nSymptoms:")

    for symptom in result["symptoms"]:
        print(f"- {symptom}")

    print("\nFavourable conditions:")

    conditions = result[
        "favourable_conditions"
    ]

    if conditions:
        for condition in conditions:
            print(f"- {condition}")
    else:
        print("- None listed")

    print("\nImmediate management:")

    immediate_actions = result[
        "management"
    ].get(
        "immediate_actions",
        [],
    )

    if immediate_actions:
        for action in immediate_actions:
            print(f"- {action}")
    else:
        print("- None listed")

    print("\nPrevention:")

    prevention_actions = result[
        "management"
    ].get(
        "prevention",
        [],
    )

    if prevention_actions:
        for action in prevention_actions:
            print(f"- {action}")
    else:
        print("- None listed")

    chemical = result[
        "management"
    ].get(
        "chemical_control",
        {},
    )

    print("\nChemical-information status:")
    print(
        "- Verification: "
        f"{chemical.get('verification_status')}"
    )
    print(
        "- Active ingredients: "
        f"{chemical.get('active_ingredients', [])}"
    )
    print(
        "- Dosage: "
        f"{chemical.get('dosage')}"
    )
    print(
        "- Reason: "
        f"{chemical.get('reason')}"
    )

    fertilizer = result[
        "fertilizer_guidance"
    ]

    print("\nFertilizer guidance:")
    print(
        "- Recommendation type: "
        f"{fertilizer.get('recommendation_type')}"
    )
    print(
        "- Dosage: "
        f"{fertilizer.get('dosage')}"
    )

    for guidance in fertilizer.get(
        "guidance",
        [],
    ):
        print(f"- {guidance}")

    print("\nSafety:")

    for warning in result["safety"]:
        print(f"- {warning}")

    print("=" * 70)


if __name__ == "__main__":
    try:
        knowledge_base = CropKnowledgeBase()

        print("\nKNOWLEDGE BASE LOADED")
        print("=" * 70)

        summary = knowledge_base.summary()

        for key, value in summary.items():
            print(f"{key}: {value}")

        print("=" * 70)

        model_label = input(
            "\nEnter a model class label "
            "[example: Tomato___Late_blight]: "
        ).strip()

        language = input(
            "Enter language [en/hi/te/mr]: "
        ).strip().lower()

        if not language:
            language = "en"

        result = (
            knowledge_base
            .get_localized_by_model_label(
                model_label=model_label,
                language_code=language,
            )
        )

        if result is None:
            print(
                "\nNo knowledge-base entry exists "
                "for that model class label."
            )

            print(
                "Check the exact model label or add "
                "the missing entry to crop_disease_kb.json."
            )

        else:
            print_localized_entry(result)

    except FileNotFoundError as error:
        print(
            f"\nKnowledge-base file error: {error}"
        )

    except json.JSONDecodeError as error:
        print(
            "\nKnowledge-base JSON error: "
            f"line {error.lineno}, "
            f"column {error.colno}: "
            f"{error.msg}"
        )

    except Exception as error:
        print(
            f"\nKnowledge-base error: {error}"
        )