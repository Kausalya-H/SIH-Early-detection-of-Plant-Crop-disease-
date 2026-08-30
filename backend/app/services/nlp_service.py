import json
import re
from pathlib import Path
from typing import Dict, Any, List, Optional

# Load crop_knowledge.json
BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_FILE = BASE_DIR / "data" / "crop_knowledge.json"


def load_knowledge_base() -> Dict[str, Any]:
    if KNOWLEDGE_FILE.exists():
        with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


# Comprehensive extended knowledge base for NLP query handling
EXTENDED_KNOWLEDGE = {
    "Tomato": {
        "Early Blight": {
            "keywords": ["early blight", "alternaria", "concentric", "target spots", "dark spots on older leaves", "yellowing lower leaves", "brown spots", "tamatar ke patte par dhabbe"],
            "severity": "Medium",
            "confidence": 0.96,
            "warning_signs": [
                "Small dark brown spots appear on older lower leaves",
                "Spots develop concentric rings forming a target-board pattern",
                "Leaves gradually turn yellow, chlorotic, and fall prematurely"
            ],
            "advice": "Remove severely affected leaves immediately. Avoid keeping foliage wet for long periods and prune lower branches.",
            "treatment": "Remove infected plant material and improve air circulation. Use a locally approved fungicide at the first sign of lesions.",
            "active_ingredient": "Chlorothalonil 75% WP or Mancozeb 75% WP",
            "application": "Apply Chlorothalonil @ 2 g/L or Mancozeb @ 2.5 g/L at 7-10 day intervals. Adhere strictly to the pre-harvest interval.",
            "organic_remedies": [
                "Foliar spray of Trichoderma viride @ 5 g/L",
                "Neem oil spray (1500 ppm) @ 3-5 ml/L",
                "Soil enrichment with Trichoderma-enriched compost"
            ],
            "preventive_tips": [
                "Maintain adequate plant spacing (60 x 45 cm) for proper air circulation",
                "Use drip irrigation instead of overhead sprinklers",
                "Practice 2-3 year crop rotation with non-solanaceous crops"
            ],
            "safety_note": "Use only products approved for tomato and early blight by CIB&RC. Always wear gloves, masks, and eye protection during spray."
        },
        "Late Blight": {
            "keywords": ["late blight", "phytophthora", "water soaked", "white mold", "dark patches", "rapid blight", "tamatar ka jhulsa"],
            "severity": "High",
            "confidence": 0.95,
            "warning_signs": [
                "Dark, water-soaked irregular patches appear on leaves and stems",
                "White fungal downy growth visible on undersides of leaves during high humidity",
                "Fruit develops dark, firm, greasy-looking rot patches"
            ],
            "advice": "Late blight spreads rapidly in cool, wet weather. Prompt containment and quarantine are essential.",
            "treatment": "Remove and safely destroy severely infected plants. Apply systematic anti-oomycete fungicides immediately upon detection.",
            "active_ingredient": "Metalaxyl 8% + Mancozeb 64% WP or Cymoxanil 8% + Mancozeb 64% WP",
            "application": "Foliar spray @ 2.5 g/L water. Repeat after 7 days if weather remains rainy or foggy.",
            "organic_remedies": [
                "Prophylactic spray of Copper Hydroxide or Bordeaux mixture (1%)",
                "Bacillus subtilis biological foliar spray @ 5 ml/L"
            ],
            "preventive_tips": [
                "Use certified disease-free transplants and certified resistant hybrids",
                "Avoid planting near potato fields",
                "Ensure proper drainage in the field to eliminate standing water"
            ],
            "safety_note": "Do not harvest fruit within 7 days of Metalaxyl-Mancozeb application. Wear personal protective equipment."
        }
    },
    "Chilli": {
        "Bacterial Leaf Spot": {
            "keywords": ["bacterial spot", "xanthomonas", "water soaked spots", "irregular spots", "mirchi ke dhabbe", "chilli leaf spot"],
            "severity": "Medium",
            "confidence": 0.94,
            "warning_signs": [
                "Small water-soaked lesions appear on leaves, turning dark brown to black",
                "Spots have irregular or angular margins with a yellowish chlorotic halo",
                "Severe infections cause defoliation, blossom drop, and blistered fruit"
            ],
            "advice": "Bacterial spot spreads through splashing rain and overhead irrigation. Keep foliage dry and disinfect pruning shears.",
            "treatment": "Spray copper bactericides combined with antibiotic formulations to prevent bacterial multiplication.",
            "active_ingredient": "Copper Oxychloride 50% WP + Streptocycline (90:10)",
            "application": "Spray Copper Oxychloride @ 2.5 g/L + Streptocycline @ 0.1 g/L (1 g in 10 L water) at 10-day intervals.",
            "organic_remedies": [
                "Foliar spray with Pseudomonas fluorescens @ 5 g/L",
                "Seed treatment with hot water (50°C for 25 minutes) prior to sowing"
            ],
            "preventive_tips": [
                "Avoid working in chilli fields when the foliage is wet",
                "Use pathogen-tested seeds and disease-resistant cultivars",
                "Rotate with maize, sorghum, or pulses"
            ],
            "safety_note": "Follow prescribed dosage for Streptocycline strictly. Keep containers away from drinking water sources."
        }
    },
    "Groundnut": {
        "Early Leaf Spot": {
            "keywords": ["groundnut spot", "cercospora", "tikka disease", "brown lesions", "yellow halo", "mungfali tikka"],
            "severity": "Medium",
            "confidence": 0.95,
            "warning_signs": [
                "Sub-circular dark brown or black spots appear on upper leaf surface",
                "Spots surrounded by a prominent bright yellow chlorotic halo",
                "Premature defoliation occurs starting from lower leaves"
            ],
            "advice": "Monitor lower leaves 3-4 weeks after sowing. Initiate management when spots first appear on bottom canopy.",
            "treatment": "Apply protective contact or systemic fungicides recommended for groundnut Tikka disease.",
            "active_ingredient": "Mancozeb 75% WP or Carbendazim 12% + Mancozeb 63% WP",
            "application": "Spray @ 2 g/L water starting at 35-40 days after sowing. Repeat after 15 days if humid conditions persist.",
            "organic_remedies": [
                "Trichoderma harzianum seed treatment @ 10 g/kg seed",
                "5% Neem Seed Kernel Extract (NSKE) foliar spray"
            ],
            "preventive_tips": [
                "Collect and burn crop residues after harvest to eliminate overwintering spores",
                "Maintain optimal plant density and weed-free field borders",
                "Practice crop rotation with cereal crops"
            ],
            "safety_note": "Avoid grazing cattle in fields within 14 days of fungicide application."
        }
    },
    "Rice": {
        "Rice Blast": {
            "keywords": ["rice blast", "magnaporthe", "pyricularia", "spindle", "eye shaped", "chawal ka jhulsa", "paddy blast"],
            "severity": "High",
            "confidence": 0.95,
            "warning_signs": [
                "Spindle-shaped or diamond-shaped lesions with grayish centers and brown borders",
                "Lesions coalesce causing entire leaf blades to dry and look burnt",
                "Neck rot / collar rot causing breaking of panicles (neck blast)"
            ],
            "advice": "Rice blast is highly destructive in overcast, high-nitrogen, and high-humidity environments. Avoid excessive urea application.",
            "treatment": "Apply specific systemic blast fungicides at the tillering and panicle emergence stages.",
            "active_ingredient": "Tricyclazole 75% WP or Isoprothiolane 40% EC",
            "application": "Spray Tricyclazole @ 0.6 g/L (120 g/acre) or Isoprothiolane @ 1.5 ml/L water at early symptom detection.",
            "organic_remedies": [
                "Pseudomonas fluorescens seed treatment @ 10 g/kg and foliar spray @ 5 g/L",
                "Application of silica-rich fertilizers to reinforce epidermal cell walls"
            ],
            "preventive_tips": [
                "Split nitrogen fertilizer doses and avoid late top-dressing of urea",
                "Maintain a thin layer of standing water during peak blast-risk periods",
                "Use blast-resistant paddy varieties certified by ICAR / State Agri Universities"
            ],
            "safety_note": "Strictly observe 21-day pre-harvest interval for Tricyclazole. Wear safety goggles and mask."
        }
    }
}


# Regional Seasonal Advisories
SEASONAL_ADVISORIES = [
    {
        "id": "adv_001",
        "category": "DISEASE_PREVENTION",
        "title": "Monsoon Management for Solanaceous Crops (Tomato & Chilli)",
        "crop": "Tomato, Chilli",
        "season": "Kharif / Monsoon",
        "shortSummary": "Essential practices to prevent damping-off, early blight, and bacterial spots during persistent rainy spells.",
        "keyPractices": [
            "Ensure raised beds of 15-20cm height to avoid waterlogging around stem collars",
            "Prune bottom 20cm foliage once plants reach 45 days to eliminate soil contact",
            "Sterilize pruning tools with 70% alcohol or bleach solution between plants",
            "Avoid handling or harvesting plants when leaves are wet with dew or rain"
        ],
        "preventiveTips": [
            "Spray Trichoderma viride @ 5g/L on soil bed every 20 days",
            "Use silver-black reflective plastic mulch to prevent weed growth and fungal splash",
            "Install pheromone traps for fruit borer monitoring (4-5 traps/acre)"
        ],
        "warningNote": "Do not apply systemic chemical sprays during active rain. Always wait for leaf surfaces to dry.",
        "publishedDate": "2026-08-20"
    },
    {
        "id": "adv_002",
        "category": "PEST_MANAGEMENT",
        "title": "Integrated Pest Management (IPM) for Sucking Pests in Chilli",
        "crop": "Chilli",
        "season": "All Seasons",
        "shortSummary": "Eco-friendly methods to manage thrips, aphids, and mites without causing chemical resistance.",
        "keyPractices": [
            "Install yellow sticky traps for whiteflies/aphids and blue sticky traps for thrips (15 traps/acre)",
            "Grow 2 border rows of maize or sorghum around chilli plots as natural insect barriers",
            "Conserve natural predators like ladybird beetles and chrysoperla",
            "Apply organic bio-pesticides (Verticillium lecanii @ 5g/L) during humid evenings"
        ],
        "preventiveTips": [
            "Avoid excessive synthetic pyrethroid sprays which trigger mite resurgence",
            "Spray 5% Neem Seed Kernel Extract (NSKE) at early nursery and transplanting stages"
        ],
        "warningNote": "Rotate chemical modes of action to prevent insecticide resistance.",
        "publishedDate": "2026-08-15"
    },
    {
        "id": "adv_003",
        "category": "CROP_HEALTH",
        "title": "Balanced Fertigation & Nutrient Deficiencies in Tomato",
        "crop": "Tomato",
        "season": "Vegetative to Fruiting",
        "shortSummary": "Correcting Calcium, Magnesium, and Potassium deficiencies to prevent Blossom End Rot and leaf chlorosis.",
        "keyPractices": [
            "Maintain consistent soil moisture through drip irrigation; fluctuating moisture causes Blossom End Rot",
            "Apply water-soluble Calcium Nitrate @ 2.5 kg/acre/week during active fruit setting",
            "Foliar spray of micronutrient mixture (Grade-2) @ 2g/L at 30 and 45 days after transplanting",
            "Check soil pH; optimum availability of nutrients occurs between pH 6.2 and 6.8"
        ],
        "preventiveTips": [
            "Incorporate well-decomposed FYM (Farm Yard Manure) @ 8-10 tonnes/acre before planting",
            "Do not apply excessive ammonium-nitrogen during fruit sizing"
        ],
        "warningNote": "Do not mix calcium fertilizers directly with phosphorus or sulfate fertilizers in the same stock tank.",
        "publishedDate": "2026-08-10"
    },
    {
        "id": "adv_004",
        "category": "IRRIGATION",
        "title": "Groundnut Irrigation Scheduling during Pod Development",
        "crop": "Groundnut",
        "season": "Pegging & Pod Filling",
        "shortSummary": "Moisture stress management at critical peg penetration and pod filling growth phases.",
        "keyPractices": [
            "Ensure adequate soil moisture at pegging stage (30-50 DAS) for smooth soil penetration",
            "Avoid moisture stress during pod development (50-80 DAS) to maximize kernel weight",
            "Cease irrigation 7-10 days before harvest to facilitate smooth lifting of pods"
        ],
        "preventiveTips": [
            "Apply gypsum @ 200 kg/acre at flowering stage for enhanced pod filling and calcium uptake",
            "Keep field free of broadleaf weeds during the first 45 days"
        ],
        "warningNote": "Excessive waterlogging at maturity leads to pod rotting in soil.",
        "publishedDate": "2026-08-05"
    }
]


def process_nlp_query(query_text: str, crop: Optional[str] = None, language: Optional[str] = "en") -> Dict[str, Any]:
    """
    Processes natural language agricultural query using domain semantic matching
    over the structured pathology knowledge base and crop data.
    """
    clean_query = query_text.lower().strip()
    
    if not clean_query:
        return {
            "error": "Query cannot be empty",
            "status": "INVALID_INPUT"
        }
    
    # 1. Detect target crop if not specified
    detected_crop = crop if (crop and crop != "ALL") else None
    if not detected_crop:
        if any(w in clean_query for w in ["tomato", "tamatar", "solanum"]):
            detected_crop = "Tomato"
        elif any(w in clean_query for w in ["chilli", "chili", "mirchi", "capsicum", "pepper"]):
            detected_crop = "Chilli"
        elif any(w in clean_query for w in ["groundnut", "peanut", "mungfali", "arachis"]):
            detected_crop = "Groundnut"
        elif any(w in clean_query for w in ["rice", "paddy", "chawal", "dhan", "oryza"]):
            detected_crop = "Rice"
        else:
            detected_crop = "Tomato"  # Default reference crop

    # 2. Score disease match
    best_match = None
    best_score = 0
    matched_disease_name = "Early Blight"

    crop_diseases = EXTENDED_KNOWLEDGE.get(detected_crop, EXTENDED_KNOWLEDGE["Tomato"])

    for disease_name, data in crop_diseases.items():
        score = 0
        # Check keyword matches
        for kw in data.get("keywords", []):
            if kw in clean_query:
                score += 3
        # Check symptom terms in query
        for symptom in data.get("warning_signs", []):
            words = [w.lower() for w in re.findall(r'\b\w+\b', symptom) if len(w) > 4]
            for w in words:
                if w in clean_query:
                    score += 1

        if score > best_score:
            best_score = score
            best_match = data
            matched_disease_name = disease_name

    # Fallback to primary disease if no explicit keywords found
    if not best_match:
        matched_disease_name = list(crop_diseases.keys())[0]
        best_match = crop_diseases[matched_disease_name]
        confidence = 0.88
    else:
        confidence = min(0.98, 0.88 + (best_score * 0.02))

    # 3. Determine intent
    intent = "DISEASE_DIAGNOSIS_AND_TREATMENT"
    if any(w in clean_query for w in ["prevent", "avoid", "precaution", "safe", "bachav"]):
        intent = "PREVENTATIVE_CARE"
    elif any(w in clean_query for w in ["spray", "chemical", "medicine", "dawa", "fungicide", "pesticide"]):
        intent = "CHEMICAL_TREATMENT"
    elif any(w in clean_query for w in ["organic", "natural", "jaivik", "neem", "bio"]):
        intent = "ORGANIC_REMEDY"

    # 4. Generate structured NLP advisory response
    summary = (
        f"Based on your query description regarding {detected_crop}, the crop is most likely exhibiting symptoms "
        f"of {matched_disease_name}. Recommended interventions and protective measures are detailed below."
    )

    return {
        "query": query_text,
        "crop": detected_crop,
        "matched_disease": matched_disease_name,
        "confidence": round(confidence * 100, 1),
        "intent": intent,
        "severity": best_match.get("severity", "Medium"),
        "summary": summary,
        "warning_signs": best_match.get("warning_signs", []),
        "advice": best_match.get("advice", ""),
        "treatment": best_match.get("treatment", ""),
        "active_ingredient": best_match.get("active_ingredient", ""),
        "application": best_match.get("application", ""),
        "organic_remedies": best_match.get("organic_remedies", []),
        "preventive_tips": best_match.get("preventive_tips", []),
        "safety_note": best_match.get("safety_note", ""),
        "language": language or "en",
        "message": "Agricultural NLP diagnosis generated successfully"
    }


def get_sample_queries() -> List[Dict[str, str]]:
    return [
        {
            "id": "q1",
            "crop": "Tomato",
            "query": "My tomato leaves have brown concentric ring spots and lower leaves are turning yellow. How do I treat it?",
            "topic": "Early Blight Diagnosis & Spray"
        },
        {
            "id": "q2",
            "crop": "Chilli",
            "query": "Small dark water-soaked spots are spreading on my chilli leaves after rain. What chemical or bio spray should I use?",
            "topic": "Bacterial Spot Containment"
        },
        {
            "id": "q3",
            "crop": "Groundnut",
            "query": "Groundnut lower leaves have circular black spots surrounded by a yellow halo. Is this Tikka disease?",
            "topic": "Tikka Leaf Spot Identification"
        },
        {
            "id": "q4",
            "crop": "Rice",
            "query": "Spindle-shaped diamond lesions with grey centers are appearing on paddy leaves. How to stop blast spread?",
            "topic": "Rice Blast Fungicide Protocol"
        },
        {
            "id": "q5",
            "crop": "Tomato",
            "query": "What are organic and biological remedies for preventing fungal blight on tomato plants?",
            "topic": "Organic Biocontrol Measures"
        }
    ]


def get_all_advisories(category: Optional[str] = None) -> List[Dict[str, Any]]:
    if category and category != "ALL":
        return [a for a in SEASONAL_ADVISORIES if a.get("category") == category]
    return SEASONAL_ADVISORIES
