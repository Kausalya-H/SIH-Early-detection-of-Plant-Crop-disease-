"""
recommender.py

Recommendation engine for the crop-disease detection system.

INPUT:
    Model prediction label such as:
        Tomato___Early_blight
        Potato___Late_blight
        Apple___Apple_scab

OUTPUT:
    {
        "crop": ...,
        "disease": ...,
        "status": ...,
        "risk_level": ...,
        "cause": ...,
        "treatment": [...],
        "pesticide": [...],
        "prevention": [...],
        "farmer_message": ...
    }

This module does NOT perform image classification.
It receives the predicted class from the DL model and converts
it into farmer-friendly disease-management information.
"""


# ============================================================
# 1. STANDARD PLANTVILLAGE CLASS LABELS
# ============================================================

SUPPORTED_CLASSES = {
    # Apple
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",

    # Blueberry
    "Blueberry___healthy",

    # Cherry
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",

    # Corn / Maize
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",

    # Grape
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",

    # Orange
    "Orange___Haunglongbing_(Citrus_greening)",

    # Peach
    "Peach___Bacterial_spot",
    "Peach___healthy",

    # Bell Pepper
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",

    # Potato
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",

    # Raspberry
    "Raspberry___healthy",

    # Soybean
    "Soybean___healthy",

    # Squash
    "Squash___Powdery_mildew",

    # Strawberry
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",

    # Tomato
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
}


# ============================================================
# 2. CROP NAME CLEANING
# ============================================================

CROP_NAME_MAP = {
    "Apple": "Apple",
    "Blueberry": "Blueberry",
    "Cherry_(including_sour)": "Cherry",
    "Corn_(maize)": "Corn / Maize",
    "Grape": "Grape",
    "Orange": "Orange",
    "Peach": "Peach",
    "Pepper,_bell": "Bell Pepper",
    "Potato": "Potato",
    "Raspberry": "Raspberry",
    "Soybean": "Soybean",
    "Squash": "Squash",
    "Strawberry": "Strawberry",
    "Tomato": "Tomato",
}


# ============================================================
# 3. DISEASE NAME NORMALIZATION
# ============================================================

DISEASE_NAME_MAP = {
    "Apple_scab": "Apple Scab",
    "Black_rot": "Black Rot",
    "Cedar_apple_rust": "Cedar Apple Rust",

    "Powdery_mildew": "Powdery Mildew",

    "Cercospora_leaf_spot Gray_leaf_spot":
        "Cercospora / Gray Leaf Spot",

    "Common_rust_": "Common Rust",

    "Northern_Leaf_Blight":
        "Northern Leaf Blight",

    "Esca_(Black_Measles)":
        "Esca / Black Measles",

    "Leaf_blight_(Isariopsis_Leaf_Spot)":
        "Isariopsis Leaf Spot",

    "Haunglongbing_(Citrus_greening)":
        "Huanglongbing / Citrus Greening",

    "Bacterial_spot":
        "Bacterial Spot",

    "Early_blight":
        "Early Blight",

    "Late_blight":
        "Late Blight",

    "Leaf_Mold":
        "Leaf Mold",

    "Septoria_leaf_spot":
        "Septoria Leaf Spot",

    "Spider_mites Two-spotted_spider_mite":
        "Two-Spotted Spider Mite",

    "Target_Spot":
        "Target Spot",

    "Tomato_Yellow_Leaf_Curl_Virus":
        "Tomato Yellow Leaf Curl Virus",

    "Tomato_mosaic_virus":
        "Tomato Mosaic Virus",

    "Leaf_scorch":
        "Leaf Scorch",

    "healthy":
        "Healthy",
}


# ============================================================
# 4. DISEASE KNOWLEDGE BASE
# ============================================================

DISEASE_PROFILES = {

    # --------------------------------------------------------
    # HEALTHY
    # --------------------------------------------------------

    "healthy": {
        "status": "healthy",
        "risk_level": "Low",

        "cause":
            "No obvious disease symptoms were detected by the model.",

        "treatment": [
            "No disease-specific treatment is required.",
            "Continue normal crop maintenance.",
            "Maintain suitable irrigation and nutrition.",
            "Inspect plants regularly for new symptoms."
        ],

        "pesticide": [
            "No pesticide is recommended solely on the basis of this prediction."
        ],

        "prevention": [
            "Maintain field sanitation.",
            "Use clean planting material.",
            "Provide balanced irrigation and nutrition.",
            "Inspect plants regularly.",
            "Avoid unnecessary pesticide application."
        ],
    },


    # --------------------------------------------------------
    # APPLE SCAB
    # --------------------------------------------------------

    "Apple_scab": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Apple scab is a fungal disease commonly associated "
            "with Venturia inaequalis.",

        "treatment": [
            "Remove heavily infected leaves where practical.",
            "Collect fallen infected leaves.",
            "Improve air circulation around the canopy.",
            "Reduce prolonged leaf wetness."
        ],

        "pesticide": [
            "Where locally registered, an appropriate fungicide "
            "for apple scab may be considered.",
            "Select products according to local agricultural "
            "recommendations and the product label."
        ],

        "prevention": [
            "Remove infected fallen leaves.",
            "Prune trees to improve airflow.",
            "Avoid unnecessary prolonged leaf wetness.",
            "Use resistant varieties where available."
        ],
    },


    # --------------------------------------------------------
    # BLACK ROT
    # --------------------------------------------------------

    "Black_rot": {
        "status": "diseased",
        "risk_level": "High",

        "cause":
            "Black rot is generally caused by fungal pathogens "
            "that infect leaves, fruits, shoots, or other tissues.",

        "treatment": [
            "Remove infected plant material.",
            "Dispose of diseased fruits and mummified fruit.",
            "Prune infected branches where appropriate.",
            "Improve sanitation around affected plants."
        ],

        "pesticide": [
            "A locally registered fungicide may be useful where "
            "black rot pressure is significant.",
            "Follow crop-specific extension recommendations."
        ],

        "prevention": [
            "Remove infected debris.",
            "Prune dead or diseased wood.",
            "Improve air circulation.",
            "Monitor plants during humid conditions."
        ],
    },


    # --------------------------------------------------------
    # CEDAR APPLE RUST
    # --------------------------------------------------------

    "Cedar_apple_rust": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Cedar apple rust is a fungal disease involving "
            "apple and certain juniper or cedar hosts.",

        "treatment": [
            "Remove heavily infected leaves if practical.",
            "Monitor nearby alternate host plants.",
            "Improve orchard sanitation."
        ],

        "pesticide": [
            "Registered fungicides labelled for cedar apple rust "
            "may be considered according to local recommendations."
        ],

        "prevention": [
            "Use resistant apple varieties where possible.",
            "Manage nearby alternate hosts when practical.",
            "Monitor during wet spring weather."
        ],
    },


    # --------------------------------------------------------
    # POWDERY MILDEW
    # --------------------------------------------------------

    "Powdery_mildew": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Powdery mildew is caused by fungal pathogens that "
            "produce characteristic powder-like growth on plant surfaces.",

        "treatment": [
            "Remove severely infected leaves.",
            "Improve ventilation and plant spacing.",
            "Avoid excessive nitrogen fertilization.",
            "Monitor new growth carefully."
        ],

        "pesticide": [
            "Where locally registered, suitable fungicides or "
            "approved sulfur-based products may be considered.",
            "Always follow the crop-specific product label."
        ],

        "prevention": [
            "Maintain adequate plant spacing.",
            "Improve air circulation.",
            "Avoid excessive nitrogen application.",
            "Use resistant varieties when available."
        ],
    },


    # --------------------------------------------------------
    # CERCOSPORA / GRAY LEAF SPOT
    # --------------------------------------------------------

    "Cercospora_leaf_spot Gray_leaf_spot": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Gray leaf spot is primarily associated with "
            "Cercospora species in maize.",

        "treatment": [
            "Remove or manage heavily infected crop residues.",
            "Improve field airflow.",
            "Monitor disease progression.",
            "Maintain balanced crop nutrition."
        ],

        "pesticide": [
            "A fungicide registered for gray leaf spot may be "
            "considered when disease pressure justifies treatment."
        ],

        "prevention": [
            "Practice crop rotation.",
            "Use resistant hybrids where available.",
            "Manage infected crop residues.",
            "Avoid continuous maize cropping where possible."
        ],
    },


    # --------------------------------------------------------
    # COMMON RUST
    # --------------------------------------------------------

    "Common_rust_": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Common rust of maize is caused by the fungal pathogen "
            "Puccinia sorghi.",

        "treatment": [
            "Monitor the extent of infection.",
            "Maintain good crop nutrition.",
            "Remove severely affected material where practical."
        ],

        "pesticide": [
            "Registered foliar fungicides may be considered when "
            "rust pressure becomes economically significant."
        ],

        "prevention": [
            "Use resistant maize hybrids.",
            "Plant at the locally recommended time.",
            "Monitor crops regularly."
        ],
    },


    # --------------------------------------------------------
    # NORTHERN LEAF BLIGHT
    # --------------------------------------------------------

    "Northern_Leaf_Blight": {
        "status": "diseased",
        "risk_level": "High",

        "cause":
            "Northern corn leaf blight is a fungal disease commonly "
            "associated with Exserohilum turcicum.",

        "treatment": [
            "Monitor infected plants closely.",
            "Remove heavily infected residues after harvest.",
            "Improve field sanitation."
        ],

        "pesticide": [
            "Where disease pressure is significant, a registered "
            "fungicide may be considered according to local guidance."
        ],

        "prevention": [
            "Use resistant hybrids.",
            "Practice crop rotation.",
            "Manage infected residues.",
            "Avoid continuous maize production where possible."
        ],
    },


    # --------------------------------------------------------
    # GRAPE ESCA
    # --------------------------------------------------------

    "Esca_(Black_Measles)": {
        "status": "diseased",
        "risk_level": "High",

        "cause":
            "Esca is a complex grapevine trunk disease involving "
            "wood-infecting fungal pathogens.",

        "treatment": [
            "Prune and remove severely infected wood.",
            "Disinfect pruning tools between affected vines.",
            "Remove vines that are severely declining."
        ],

        "pesticide": [
            "Chemical control of established trunk infections is "
            "often limited; use locally recommended management practices."
        ],

        "prevention": [
            "Protect pruning wounds.",
            "Use clean planting material.",
            "Disinfect pruning equipment.",
            "Avoid unnecessary vine injuries."
        ],
    },


    # --------------------------------------------------------
    # ISARIOPSIS LEAF SPOT
    # --------------------------------------------------------

    "Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "This grape leaf spot is associated with fungal infection.",

        "treatment": [
            "Remove badly affected leaves where practical.",
            "Improve canopy ventilation.",
            "Remove infected debris."
        ],

        "pesticide": [
            "A locally registered grape fungicide may be considered "
            "when disease severity warrants treatment."
        ],

        "prevention": [
            "Improve canopy airflow.",
            "Avoid prolonged leaf wetness.",
            "Maintain vineyard sanitation."
        ],
    },


    # --------------------------------------------------------
    # CITRUS GREENING
    # --------------------------------------------------------

    "Haunglongbing_(Citrus_greening)": {
        "status": "diseased",
        "risk_level": "Very High",

        "cause":
            "Citrus greening or Huanglongbing is associated with "
            "phloem-limited bacteria and is spread mainly by citrus psyllids.",

        "treatment": [
            "Confirm suspected infection with local agricultural experts.",
            "Remove severely infected trees when advised.",
            "Manage insect vectors.",
            "Use certified disease-free planting material."
        ],

        "pesticide": [
            "Vector management may involve locally approved insect-control "
            "measures for citrus psyllids.",
            "Follow official regional citrus-management recommendations."
        ],

        "prevention": [
            "Use certified healthy nursery plants.",
            "Monitor psyllid populations.",
            "Remove confirmed infected trees when required.",
            "Follow local quarantine and extension guidance."
        ],
    },


    # --------------------------------------------------------
    # BACTERIAL SPOT
    # --------------------------------------------------------

    "Bacterial_spot": {
        "status": "diseased",
        "risk_level": "High",

        "cause":
            "Bacterial spot is caused by bacterial pathogens commonly "
            "belonging to Xanthomonas-related groups.",

        "treatment": [
            "Remove badly infected leaves and plant material.",
            "Avoid handling plants when foliage is wet.",
            "Reduce overhead irrigation.",
            "Improve airflow between plants."
        ],

        "pesticide": [
            "Where locally approved, copper-based bactericidal products "
            "may be considered as part of an integrated programme.",
            "Follow crop-specific labels and local agricultural guidance."
        ],

        "prevention": [
            "Use disease-free seeds or seedlings.",
            "Avoid overhead irrigation.",
            "Disinfect tools.",
            "Rotate crops where appropriate.",
            "Remove infected crop residues."
        ],
    },


    # --------------------------------------------------------
    # EARLY BLIGHT
    # --------------------------------------------------------

    "Early_blight": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Early blight is commonly associated with Alternaria "
            "species, especially Alternaria solani.",

        "treatment": [
            "Remove severely infected lower leaves.",
            "Keep infected foliage away from healthy plants.",
            "Improve airflow around plants.",
            "Avoid watering foliage unnecessarily.",
            "Maintain balanced plant nutrition."
        ],

        "pesticide": [
            "Where locally registered, a fungicide labelled for early "
            "blight may be considered.",
            "Common management programmes may use protectant or "
            "Alternaria-targeted fungicides depending on local approval.",
            "Always follow the agricultural authority and product label."
        ],

        "prevention": [
            "Practice crop rotation.",
            "Remove infected crop debris.",
            "Use disease-free planting material.",
            "Avoid prolonged leaf wetness.",
            "Use resistant varieties where available."
        ],
    },


    # --------------------------------------------------------
    # LATE BLIGHT
    # --------------------------------------------------------

    "Late_blight": {
        "status": "diseased",
        "risk_level": "Very High",

        "cause":
            "Late blight is caused by Phytophthora infestans and "
            "can spread rapidly under cool and wet conditions.",

        "treatment": [
            "Remove severely infected foliage immediately.",
            "Separate or destroy badly infected plants where appropriate.",
            "Reduce leaf wetness.",
            "Monitor neighbouring plants closely."
        ],

        "pesticide": [
            "A locally registered late-blight fungicide may be required "
            "when disease is confirmed.",
            "Use only products approved for the crop and region.",
            "Follow label instructions and agricultural extension advice."
        ],

        "prevention": [
            "Use certified disease-free planting material.",
            "Avoid overhead irrigation where possible.",
            "Destroy infected crop residues.",
            "Maintain adequate plant spacing.",
            "Monitor closely during cool, humid weather."
        ],
    },


    # --------------------------------------------------------
    # LEAF MOLD
    # --------------------------------------------------------

    "Leaf_Mold": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Tomato leaf mold is a fungal disease commonly associated "
            "with Passalora fulva.",

        "treatment": [
            "Remove affected leaves.",
            "Increase ventilation.",
            "Reduce greenhouse or canopy humidity.",
            "Avoid wetting foliage."
        ],

        "pesticide": [
            "A registered fungicide for tomato leaf mold may be considered "
            "when environmental management alone is insufficient."
        ],

        "prevention": [
            "Provide good ventilation.",
            "Maintain plant spacing.",
            "Reduce prolonged humidity.",
            "Use resistant tomato varieties where available."
        ],
    },


    # --------------------------------------------------------
    # SEPTORIA LEAF SPOT
    # --------------------------------------------------------

    "Septoria_leaf_spot": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Septoria leaf spot of tomato is commonly associated "
            "with Septoria lycopersici.",

        "treatment": [
            "Remove infected lower leaves.",
            "Remove infected plant debris.",
            "Avoid splashing water onto foliage.",
            "Improve plant spacing."
        ],

        "pesticide": [
            "A locally registered fungicide for Septoria leaf spot "
            "may be considered when necessary."
        ],

        "prevention": [
            "Practice crop rotation.",
            "Avoid overhead irrigation.",
            "Use clean stakes and tools.",
            "Remove infected crop debris."
        ],
    },


    # --------------------------------------------------------
    # SPIDER MITES
    # --------------------------------------------------------

    "Spider_mites Two-spotted_spider_mite": {
        "status": "pest",
        "risk_level": "Medium",

        "cause":
            "Damage is associated with two-spotted spider mites, "
            "which feed on plant cells and may cause stippling, "
            "yellowing and webbing.",

        "treatment": [
            "Inspect the underside of leaves.",
            "Remove severely infested leaves.",
            "Reduce plant stress.",
            "Encourage beneficial predators where practical."
        ],

        "pesticide": [
            "Where control is necessary, use a locally approved miticide "
            "or other registered mite-management product.",
            "Avoid unnecessary broad-spectrum pesticide use because it may "
            "reduce natural mite predators."
        ],

        "prevention": [
            "Inspect plants regularly.",
            "Maintain suitable irrigation.",
            "Control weeds that may harbour mites.",
            "Avoid excessive plant stress."
        ],
    },


    # --------------------------------------------------------
    # TARGET SPOT
    # --------------------------------------------------------

    "Target_Spot": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Target spot of tomato is commonly associated with "
            "Corynespora cassiicola.",

        "treatment": [
            "Remove infected leaves.",
            "Improve plant spacing.",
            "Reduce prolonged leaf wetness.",
            "Remove diseased crop debris."
        ],

        "pesticide": [
            "Where locally registered, fungicides labelled for target spot "
            "may be considered as part of an integrated programme."
        ],

        "prevention": [
            "Rotate crops.",
            "Maintain field sanitation.",
            "Avoid excessive canopy humidity.",
            "Monitor plants frequently."
        ],
    },


    # --------------------------------------------------------
    # TOMATO YELLOW LEAF CURL VIRUS
    # --------------------------------------------------------

    "Tomato_Yellow_Leaf_Curl_Virus": {
        "status": "viral",
        "risk_level": "Very High",

        "cause":
            "Tomato Yellow Leaf Curl Virus is a viral disease commonly "
            "spread by whiteflies.",

        "treatment": [
            "There is no direct curative pesticide for the virus.",
            "Remove severely infected plants when appropriate.",
            "Manage whitefly populations.",
            "Control weeds that may act as virus reservoirs."
        ],

        "pesticide": [
            "Pesticides do not cure the virus.",
            "Where necessary, locally approved whitefly-management "
            "products may be used according to label directions."
        ],

        "prevention": [
            "Use resistant tomato varieties.",
            "Use virus-free seedlings.",
            "Control whitefly populations.",
            "Remove infected plants.",
            "Maintain weed control."
        ],
    },


    # --------------------------------------------------------
    # TOMATO MOSAIC VIRUS
    # --------------------------------------------------------

    "Tomato_mosaic_virus": {
        "status": "viral",
        "risk_level": "High",

        "cause":
            "Tomato mosaic virus is a viral disease that can spread "
            "through infected plant material, contaminated tools "
            "and mechanical contact.",

        "treatment": [
            "There is no pesticide that cures an infected plant.",
            "Remove seriously infected plants.",
            "Disinfect tools and hands after handling affected plants.",
            "Avoid moving contaminated plant material."
        ],

        "pesticide": [
            "No pesticide cures Tomato Mosaic Virus."
        ],

        "prevention": [
            "Use resistant varieties.",
            "Use clean seed and planting material.",
            "Disinfect equipment.",
            "Remove infected plants.",
            "Avoid handling healthy plants immediately after infected ones."
        ],
    },


    # --------------------------------------------------------
    # STRAWBERRY LEAF SCORCH
    # --------------------------------------------------------

    "Leaf_scorch": {
        "status": "diseased",
        "risk_level": "Medium",

        "cause":
            "Strawberry leaf scorch is generally associated with "
            "fungal infection.",

        "treatment": [
            "Remove badly infected leaves.",
            "Remove infected plant debris.",
            "Improve airflow.",
            "Avoid prolonged leaf wetness."
        ],

        "pesticide": [
            "A fungicide registered for strawberry leaf diseases may "
            "be considered according to local recommendations."
        ],

        "prevention": [
            "Use healthy planting material.",
            "Maintain field sanitation.",
            "Provide adequate plant spacing.",
            "Avoid unnecessary overhead irrigation."
        ],
    },
}


# ============================================================
# 5. LABEL NORMALIZATION
# ============================================================

def normalize_label(label):
    """
    Clean common formatting problems from model class labels.
    """

    if label is None:
        return ""

    label = str(label).strip()

    # Some models/JSON files may contain slashes instead
    label = label.replace("\\", "/")

    # If a path accidentally reaches this function,
    # use only the final directory/file-like component
    if "/" in label:
        label = label.split("/")[-1]

    return label


# ============================================================
# 6. SPLIT CROP AND DISEASE
# ============================================================

def split_prediction_label(predicted_class):
    """
    Example:
        Tomato___Early_blight

    Returns:
        ("Tomato", "Early_blight")
    """

    predicted_class = normalize_label(predicted_class)

    if "___" not in predicted_class:
        return predicted_class, ""

    crop, disease = predicted_class.split("___", 1)

    return crop, disease


# ============================================================
# 7. HUMAN READABLE NAME
# ============================================================

def clean_text(value):
    value = str(value)

    value = value.replace("___", " - ")
    value = value.replace("_", " ")
    value = value.replace(",", " ")
    value = " ".join(value.split())

    return value.strip()


def get_crop_name(raw_crop):
    return CROP_NAME_MAP.get(
        raw_crop,
        clean_text(raw_crop)
    )


def get_disease_name(raw_disease):
    return DISEASE_NAME_MAP.get(
        raw_disease,
        clean_text(raw_disease)
    )


# ============================================================
# 8. GENERIC FALLBACK
# ============================================================

def generic_recommendation(crop, disease):

    return {
        "status": "unknown",
        "risk_level": "Unknown",

        "cause":
            "A detailed disease profile for this predicted class "
            "has not yet been added to the recommendation database.",

        "treatment": [
            "Inspect the plant carefully for visible symptoms.",
            "Separate severely affected material where appropriate.",
            "Maintain good field sanitation.",
            "Consult a local agricultural expert for confirmation."
        ],

        "pesticide": [
            "No specific pesticide recommendation is available "
            "for this class.",
            "Do not apply a pesticide solely from an uncertain "
            "AI prediction."
        ],

        "prevention": [
            "Use healthy planting material.",
            "Maintain field sanitation.",
            "Monitor crops regularly.",
            "Use good irrigation and nutrition practices."
        ],
    }


# ============================================================
# 9. INVALID MODEL CLASS DETECTION
# ============================================================

def is_invalid_prediction_label(label):
    """
    Detect labels that should never be produced as crop classes.

    This specifically helps catch the earlier situation where
    a directory name such as 'balanced dataset' was accidentally
    learned as a class.
    """

    invalid_labels = {
        "balanced dataset",
        "balanced_dataset",
        "dataset",
        "train",
        "training",
        "validation",
        "val",
        "test",
        "testing",
        "raw",
    }

    cleaned = (
        str(label)
        .strip()
        .lower()
        .replace("-", "_")
    )

    return cleaned in invalid_labels


# ============================================================
# 10. MAIN RECOMMENDATION FUNCTION
# ============================================================

def get_recommendation(predicted_class, confidence=None):
    """
    Main function called from predict.py.

    Parameters
    ----------
    predicted_class : str
        Exact prediction from the model.

        Example:
            Tomato___Early_blight

    confidence : float, optional
        Supports either:
            0.9343
        or:
            93.43

    Returns
    -------
    dict
        Complete crop recommendation.
    """

    predicted_class = normalize_label(predicted_class)

    # --------------------------------------------------------
    # Invalid class/folder detection
    # --------------------------------------------------------

    if is_invalid_prediction_label(predicted_class):

        return {
            "predicted_class": predicted_class,
            "crop": "Unknown",
            "disease": "Invalid model class",
            "status": "model_error",
            "confidence": format_confidence(confidence),
            "risk_level": "Unknown",

            "cause":
                "The model predicted a dataset/folder name instead "
                "of a crop-disease class. Check the dataset directory "
                "structure and class-index mapping.",

            "treatment": [
                "Do not provide crop treatment from this prediction."
            ],

            "pesticide": [
                "No pesticide recommendation should be generated "
                "from an invalid model class."
            ],

            "prevention": [
                "Correct the model class mapping.",
                "Ensure only crop-disease folders are used as classes."
            ],

            "farmer_message":
                "Unable to generate a reliable recommendation because "
                "the model returned an invalid class label."
        }

    raw_crop, raw_disease = split_prediction_label(predicted_class)

    crop = get_crop_name(raw_crop)
    disease = get_disease_name(raw_disease)

    # --------------------------------------------------------
    # Find profile
    # --------------------------------------------------------

    if raw_disease in DISEASE_PROFILES:
        profile = DISEASE_PROFILES[raw_disease]
    else:
        profile = generic_recommendation(
            crop,
            disease
        )

    # Copy so original dictionary is not modified
    profile = profile.copy()

    treatment = list(profile.get("treatment", []))
    pesticide = list(profile.get("pesticide", []))
    prevention = list(profile.get("prevention", []))

    # --------------------------------------------------------
    # Build complete response
    # --------------------------------------------------------

    result = {
        "predicted_class": predicted_class,

        "crop":
            crop,

        "disease":
            disease,

        "status":
            profile.get(
                "status",
                "unknown"
            ),

        "confidence":
            format_confidence(confidence),

        "risk_level":
            profile.get(
                "risk_level",
                "Unknown"
            ),

        "cause":
            profile.get(
                "cause",
                "Information unavailable."
            ),

        "treatment":
            treatment,

        "pesticide":
            pesticide,

        "prevention":
            prevention,
    }

    result["farmer_message"] = create_farmer_message(result)

    return result


# ============================================================
# 11. CONFIDENCE HANDLING
# ============================================================

def format_confidence(confidence):
    """
    Accept:
        0.9343
    or:
        93.43

    Return:
        93.43
    """

    if confidence is None:
        return None

    try:
        confidence = float(confidence)
    except (TypeError, ValueError):
        return None

    if confidence <= 1.0:
        confidence *= 100

    confidence = max(
        0.0,
        min(confidence, 100.0)
    )

    return round(confidence, 2)


# ============================================================
# 12. FARMER-FRIENDLY NLP MESSAGE
# ============================================================

def create_farmer_message(result):
    """
    Generate natural-language recommendation text.
    """

    crop = result["crop"]
    disease = result["disease"]
    risk = result["risk_level"]
    confidence = result["confidence"]

    if result["status"] == "healthy":

        if confidence is not None:
            return (
                f"The uploaded {crop} leaf appears healthy with "
                f"{confidence:.2f}% model confidence. "
                f"No disease-specific pesticide is recommended. "
                f"Continue regular crop monitoring, suitable irrigation, "
                f"balanced nutrition and good field sanitation."
            )

        return (
            f"The uploaded {crop} leaf appears healthy. "
            f"No disease-specific pesticide is recommended. "
            f"Continue regular monitoring and good crop management."
        )

    confidence_text = ""

    if confidence is not None:
        confidence_text = (
            f"The model confidence is {confidence:.2f}%. "
        )

    treatment_text = ""

    if result["treatment"]:
        treatment_text = " ".join(
            result["treatment"][:2]
        )

    pesticide_text = ""

    if result["pesticide"]:
        pesticide_text = " ".join(
            result["pesticide"][:2]
        )

    return (
        f"The detected crop is {crop}. "
        f"The predicted condition is {disease}. "
        f"{confidence_text}"
        f"The estimated risk level is {risk}. "
        f"{result['cause']} "
        f"Recommended management: {treatment_text} "
        f"Pesticide guidance: {pesticide_text}"
    )


# ============================================================
# 13. TERMINAL FORMATTER
# ============================================================

def print_recommendation(result):

    print("\n" + "=" * 70)
    print("AI CROP DISEASE RECOMMENDATION")
    print("=" * 70)

    print(
        f"\nCrop             : "
        f"{result.get('crop')}"
    )

    print(
        f"Disease          : "
        f"{result.get('disease')}"
    )

    confidence = result.get("confidence")

    if confidence is not None:
        print(
            f"Confidence       : "
            f"{confidence:.2f}%"
        )

    print(
        f"Risk Level       : "
        f"{result.get('risk_level')}"
    )

    print("\nCAUSE")
    print("-" * 70)
    print(
        result.get(
            "cause",
            "Information unavailable."
        )
    )

    print("\nTREATMENT / MANAGEMENT")
    print("-" * 70)

    for index, item in enumerate(
        result.get("treatment", []),
        start=1
    ):
        print(
            f"{index}. {item}"
        )

    print("\nPESTICIDE / FUNGICIDE GUIDANCE")
    print("-" * 70)

    for index, item in enumerate(
        result.get("pesticide", []),
        start=1
    ):
        print(
            f"{index}. {item}"
        )

    print("\nPREVENTION")
    print("-" * 70)

    for index, item in enumerate(
        result.get("prevention", []),
        start=1
    ):
        print(
            f"{index}. {item}"
        )

    print("\nNLP RESPONSE")
    print("-" * 70)

    print(
        result.get(
            "farmer_message",
            ""
        )
    )

    print("\n" + "=" * 70)


# ============================================================
# 14. API-SAFE FUNCTION
# ============================================================

def recommend(predicted_class, confidence=None):
    """
    Short API-friendly alias.

    Example:

        result = recommend(
            "Tomato___Early_blight",
            0.9343
        )

    This dictionary can be returned directly from FastAPI/Flask.
    """

    return get_recommendation(
        predicted_class,
        confidence
    )


# ============================================================
# 15. SUPPORTED CLASS INFORMATION
# ============================================================

def get_supported_classes():

    return sorted(
        SUPPORTED_CLASSES
    )


def is_supported_class(predicted_class):

    predicted_class = normalize_label(
        predicted_class
    )

    return predicted_class in SUPPORTED_CLASSES


# ============================================================
# 16. SIMPLE TEST
# ============================================================

if __name__ == "__main__":

    # Change this label to test different diseases.

    predicted_class = "Tomato___Early_blight"

    # Example TensorFlow probability:
    confidence = 0.9343

    recommendation = get_recommendation(
        predicted_class,
        confidence
    )

    print_recommendation(
        recommendation
    )