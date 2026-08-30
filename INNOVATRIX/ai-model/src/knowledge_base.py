import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Optional

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_KNOWLEDGE_BASE_PATH = PROJECT_ROOT / "knowledge-base" / "crop_disease_kb.json"
SUPPORTED_LANGUAGES = {"en","hi","te","mr"}

def normalize_search_text(value: str) -> str:
    if value is None:
        return ""
    normalized = str(value).strip().casefold()
    normalized = normalized.replace("___"," ").replace("__"," ").replace("_"," ").replace("-"," ")
    return re.sub(r"\s+"," ",normalized).strip()

def _pick(value, lang):
    if isinstance(value, dict):
        if lang in value:
            return deepcopy(value[lang])
        if "en" in value:
            return deepcopy(value["en"])
    return deepcopy(value)

class CropKnowledgeBase:
    def __init__(self, knowledge_base_path: str | Path = DEFAULT_KNOWLEDGE_BASE_PATH) -> None:
        self.knowledge_base_path = Path(knowledge_base_path).resolve()
        self.data = self._load()
        self.metadata = self.data["metadata"]
        self.diseases = self.data["diseases"]
        self._label_index = self._build_label_index()
        self._id_index = self._build_id_index()

    def _load(self) -> dict:
        if not self.knowledge_base_path.exists():
            raise FileNotFoundError(f"Knowledge-base file was not found: {self.knowledge_base_path}")
        with self.knowledge_base_path.open("r",encoding="utf-8") as f:
            data=json.load(f)
        if not isinstance(data,dict) or "metadata" not in data or "diseases" not in data:
            raise ValueError("Knowledge base must contain metadata and diseases.")
        if not isinstance(data["diseases"],list):
            raise ValueError("'diseases' must be a JSON list.")
        return data

    def _build_label_index(self):
        idx={}
        for e in self.diseases:
            for label in e.get("model_labels",[]):
                n=normalize_search_text(label)
                if n and n not in idx:
                    idx[n]=e
        return idx

    def _build_id_index(self):
        idx={}
        for e in self.diseases:
            if not e.get("id"):
                raise ValueError("A knowledge-base entry is missing its id.")
            if e["id"] in idx:
                raise ValueError(f"Duplicate disease id: {e['id']}")
            idx[e["id"]]=e
        return idx

    def get_metadata(self): return deepcopy(self.metadata)
    def get_all_entries(self): return deepcopy(self.diseases)

    def get_entry_by_id(self, entry_id: str) -> Optional[dict]:
        e=self._id_index.get(entry_id)
        return deepcopy(e) if e else None

    def get_entry_by_model_label(self, model_label: str) -> Optional[dict]:
        e=self._label_index.get(normalize_search_text(model_label))
        return deepcopy(e) if e else None

    def localize_entry(self, entry: dict, language_code: str="en") -> dict:
        lang=(language_code or "en").strip().lower()
        if lang not in SUPPORTED_LANGUAGES:
            lang="en"

        chemical=entry["management"].get("chemical_control",{})
        management={
            "immediate_actions": _pick(entry["management"].get("immediate_actions",[]),lang),
            "prevention": _pick(entry["management"].get("prevention",[]),lang),
            "chemical_control":{
                "verification_status": chemical.get("verification_status"),
                "active_ingredients": _pick(chemical.get("active_ingredients",[]),lang),
                "dosage": _pick(chemical.get("dosage"),lang),
                "reason": _pick(chemical.get("reason"),lang),
            }
        }

        fert=entry.get("fertilizer_guidance",{})
        fertilizer={
            "recommendation_type": _pick(fert.get("recommendation_type"),lang),
            "dosage": _pick(fert.get("dosage"),lang),
            "guidance": _pick(fert.get("guidance",[]),lang),
        }

        return {
            "id":entry["id"],
            "model_labels":deepcopy(entry["model_labels"]),
            "language_code":lang,
            "crop_code":entry["crop"]["code"],
            "crop_name":_pick(entry["crop"]["name"],lang),
            "disease_code":entry["disease"]["code"],
            "disease_name":_pick(entry["disease"]["name"],lang),
            "category":entry["disease"]["category"],
            "causal_agent":_pick(entry["disease"].get("causal_agent"),lang),
            "symptoms":_pick(entry.get("symptoms",[]),lang),
            "favourable_conditions":_pick(entry.get("favourable_conditions",[]),lang),
            "management":management,
            "fertilizer_guidance":fertilizer,
            "safety":_pick(entry.get("safety",[]),lang),
            "verification":deepcopy(entry.get("verification",{})),
        }

    def get_localized_by_model_label(self, model_label: str, language_code: str="en") -> Optional[dict]:
        e=self.get_entry_by_model_label(model_label)
        return self.localize_entry(e,language_code) if e else None

    def get_localized_by_id(self, entry_id: str, language_code: str="en") -> Optional[dict]:
        e=self.get_entry_by_id(entry_id)
        return self.localize_entry(e,language_code) if e else None

    def summary(self):
        return {
            "knowledge_base":self.metadata.get("name"),
            "version":self.metadata.get("version"),
            "entries":len(self.diseases),
            "indexed_labels":len(self._label_index),
            "path":str(self.knowledge_base_path),
        }

def print_localized_entry(result: dict) -> None:
    print("\nKNOWLEDGE-BASE RESULT")
    print("="*70)
    print(f"Crop       : {result['crop_name']}")
    print(f"Disease    : {result['disease_name']}")
    print(f"Language   : {result['language_code']}")
    print(f"Cause      : {result['causal_agent']}")
    print("\nSymptoms:")
    for x in result["symptoms"]: print(f"- {x}")
    print("\nImmediate actions:")
    for x in result["management"]["immediate_actions"]: print(f"- {x}")
    print("\nPesticide / chemical guidance:")
    for x in result["management"]["chemical_control"]["active_ingredients"]: print(f"- {x}")
    print("\nPrevention:")
    for x in result["management"]["prevention"]: print(f"- {x}")
    print("\nSafety:")
    for x in result["safety"]: print(f"- {x}")
    print("="*70)

if __name__=="__main__":
    kb=CropKnowledgeBase()
    print("\nKNOWLEDGE BASE LOADED")
    print(kb.summary())
    label=input("\nEnter model class label: ").strip()
    lang=input("Enter language [en/hi/te/mr]: ").strip().lower() or "en"
    result=kb.get_localized_by_model_label(label,lang)
    if result:
        print_localized_entry(result)
    else:
        print("No knowledge-base entry exists for that model class label.")
