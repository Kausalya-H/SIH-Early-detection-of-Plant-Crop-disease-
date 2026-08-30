import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_FILE = BASE_DIR / "data" / "crop_knowledge.json"
INNOVATRIX_KB_FILE = BASE_DIR / "data" / "crop_disease_kb.json"

_innovatrix_index = None

def _build_innovatrix_index():
    global _innovatrix_index
    if _innovatrix_index is not None:
        return
    _innovatrix_index = {}
    try:
        with open(INNOVATRIX_KB_FILE, "r", encoding="utf-8") as f:
            kb = json.load(f)
        for entry in kb.get("diseases", []):
            for label in entry.get("model_labels", []):
                _innovatrix_index[label] = entry
    except Exception:
        _innovatrix_index = {}

def normalize_text(text):
    return " ".join(text.replace("_", " ").replace("-", " ").lower().split())

def load_crop_knowledge():
    with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
        return json.load(file)

def _format_innovatrix_entry(entry):
    mg = entry.get("management", {})
    return {
        "severity": "Medium",
        "warning_signs": entry.get("symptoms", {}).get("en", []),
        "advice": " ".join(mg.get("immediate_actions", {}).get("en", [])),
        "treatment": " ".join(mg.get("chemical_control", {}).get("active_ingredients", {}).get("en", [])),
        "active_ingredient": mg.get("chemical_control", {}).get("dosage", {}).get("en", "Follow local product label."),
        "application": mg.get("chemical_control", {}).get("reason", {}).get("en", "Follow local product label."),
        "safety_note": " ".join(entry.get("safety", {}).get("en", [])),
        "category": entry.get("disease", {}).get("category", "unverified"),
        "causal_agent": entry.get("disease", {}).get("causal_agent", {}).get("en", "Unknown"),
        "fertilizer_guidance": entry.get("fertilizer_guidance", {}).get("dosage", {}).get("en", "Follow soil-test recommendations."),
    }

def get_disease_information(crop, disease, model_label=None):
    _build_innovatrix_index()

    # 1. Direct model_label lookup (fastest, most reliable)
    if model_label and model_label in _innovatrix_index:
        return _format_innovatrix_entry(_innovatrix_index[model_label])

    # 2. Fuzzy match against all model_labels
    for label, entry in _innovatrix_index.items():
        parts = label.split("___", 1)
        if len(parts) == 2:
            kb_crop = parts[0]
            kb_crop = re.sub(r'_\(.*?\)', '', kb_crop)
            kb_crop = re.sub(r',_.*', '', kb_crop)
            kb_crop = kb_crop.strip('_').replace('_', ' ')
            kb_disease = parts[1].rstrip('_').replace('_', ' ').replace('-', ' ').strip()
            if normalize_text(kb_crop) == normalize_text(crop) and normalize_text(kb_disease) == normalize_text(disease):
                return _format_innovatrix_entry(entry)

    # 3. Fallback to simple crop_knowledge.json
    knowledge = load_crop_knowledge()
    crop_data = None
    for crop_name, data in knowledge.items():
        if normalize_text(crop_name) == normalize_text(crop):
            crop_data = data
            break
    if not crop_data:
        return None
    disease_data = None
    for disease_name, data in crop_data.items():
        if normalize_text(disease_name) == normalize_text(disease):
            disease_data = data
            break
    return disease_data
