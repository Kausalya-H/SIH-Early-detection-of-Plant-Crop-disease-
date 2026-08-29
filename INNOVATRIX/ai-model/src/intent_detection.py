import json
import re
import unicodedata
from typing import Optional


SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "te": "Telugu",
    "mr": "Marathi",
}


INTENT_DESCRIPTIONS = {
    "disease_detection": "Identify a crop or plant disease",
    "pesticide_recommendation": "Request for pesticide information",
    "fertilizer_recommendation": "Request for fertilizer information",
    "treatment_recommendation": "Request for disease treatment",
    "symptom_information": "Request for disease symptoms",
    "prevention_advice": "Request for disease prevention advice",
    "weather_risk": "Request for weather-related crop risk",
    "general_crop_advice": "General crop-care question",
    "greeting": "Greeting or conversation starter",
    "unknown": "Intent could not be identified",
}


# Each phrase is associated with an intent and a matching weight.
# Larger weights are given to phrases that clearly identify the intent.
INTENT_KEYWORDS = {
    "disease_detection": {
        "en": {
            "what disease": 5,
            "which disease": 5,
            "identify disease": 5,
            "detect disease": 5,
            "disease name": 4,
            "identify this": 3,
            "infected": 2,
            "infection": 2,
            "disease": 2,
            "leaf image": 2,
            "plant image": 2,
        },
        "hi": {
            "कौन सी बीमारी": 5,
            "कौनसी बीमारी": 5,
            "बीमारी पहचान": 5,
            "रोग पहचान": 5,
            "रोग का नाम": 4,
            "यह बीमारी": 4,
            "संक्रमण": 2,
            "बीमारी": 2,
            "रोग": 2,
        },
        "te": {
            "ఏ వ్యాధి": 5,
            "ఏ రోగం": 5,
            "వ్యాధిని గుర్తించండి": 5,
            "రోగాన్ని గుర్తించండి": 5,
            "వ్యాధి పేరు": 4,
            "ఈ వ్యాధి": 4,
            "తెగులు": 3,
            "వ్యాధి": 2,
            "రోగం": 2,
        },
        "mr": {
            "कोणता रोग": 5,
            "कोणती बीमारी": 5,
            "रोग ओळखा": 5,
            "रोगाचे नाव": 4,
            "हा रोग": 4,
            "संसर्ग": 2,
            "आजार": 2,
            "रोग": 2,
        },
    },

    "pesticide_recommendation": {
        "en": {
            "which pesticide": 6,
            "recommend pesticide": 6,
            "best pesticide": 5,
            "which insecticide": 6,
            "which fungicide": 6,
            "chemical spray": 4,
            "what to spray": 4,
            "spray medicine": 4,
            "pesticide": 3,
            "insecticide": 3,
            "fungicide": 3,
            "spray": 2,
        },
        "hi": {
            "कौन सा कीटनाशक": 6,
            "कौनसा कीटनाशक": 6,
            "कौन सा फफूंदनाशक": 6,
            "कौनसी दवा छिड़कें": 5,
            "क्या छिड़काव करें": 5,
            "कीटनाशक बताएं": 5,
            "कीटनाशक": 3,
            "फफूंदनाशक": 3,
            "दवा": 2,
            "छिड़काव": 2,
        },
        "te": {
            "ఏ పురుగుమందు": 6,
            "ఏ కీటకనాశిని": 6,
            "ఏ శిలీంద్రనాశిని": 6,
            "ఏ మందు పిచికారీ": 5,
            "ఏ మందు వాడాలి": 5,
            "పురుగుమందు చెప్పండి": 5,
            "పురుగుమందు": 3,
            "కీటకనాశిని": 3,
            "శిలీంద్రనాశిని": 3,
            "పిచికారీ": 2,
        },
        "mr": {
            "कोणते कीटकनाशक": 6,
            "कोणते बुरशीनाशक": 6,
            "कोणती फवारणी": 5,
            "कोणते औषध फवारावे": 5,
            "कीटकनाशक सांगा": 5,
            "कीटकनाशक": 3,
            "बुरशीनाशक": 3,
            "औषध": 2,
            "फवारणी": 2,
        },
    },

    "fertilizer_recommendation": {
        "en": {
            "which fertilizer": 6,
            "recommend fertilizer": 6,
            "best fertilizer": 5,
            "nutrient recommendation": 5,
            "npk recommendation": 5,
            "what manure": 4,
            "fertilizer": 3,
            "manure": 3,
            "nutrient": 2,
            "npk": 3,
            "compost": 2,
        },
        "hi": {
            "कौन सी खाद": 6,
            "कौनसा उर्वरक": 6,
            "कौन सा उर्वरक": 6,
            "खाद बताएं": 5,
            "एनपीके": 4,
            "उर्वरक": 3,
            "खाद": 3,
            "पोषक तत्व": 2,
            "कम्पोस्ट": 2,
        },
        "te": {
            "ఏ ఎరువు": 6,
            "ఎరువు సూచించండి": 6,
            "ఏ ఎరువు వాడాలి": 6,
            "ఎరువు చెప్పండి": 5,
            "ఎన్ పి కె": 4,
            "ఎరువు": 3,
            "పోషకాలు": 2,
            "కంపోస్ట్": 2,
        },
        "mr": {
            "कोणते खत": 6,
            "खत सुचवा": 6,
            "कोणते खत वापरावे": 6,
            "खत सांगा": 5,
            "एनपीके": 4,
            "खत": 3,
            "पोषक तत्व": 2,
            "कंपोस्ट": 2,
        },
    },

    "treatment_recommendation": {
        "en": {
            "how to treat": 6,
            "how can i treat": 6,
            "treatment for": 5,
            "how to cure": 5,
            "control this disease": 5,
            "disease management": 5,
            "remedy": 3,
            "treatment": 3,
            "cure": 3,
            "control": 2,
            "medicine": 2,
        },
        "hi": {
            "इलाज कैसे करें": 6,
            "उपचार कैसे करें": 6,
            "रोग को कैसे रोकें": 5,
            "बीमारी का इलाज": 5,
            "रोग प्रबंधन": 5,
            "उपचार": 3,
            "इलाज": 3,
            "दवाई": 2,
        },
        "te": {
            "చికిత్స ఎలా చేయాలి": 6,
            "వ్యాధిని ఎలా నయం చేయాలి": 6,
            "రోగాన్ని ఎలా నియంత్రించాలి": 5,
            "వ్యాధి చికిత్స": 5,
            "వ్యాధి నిర్వహణ": 5,
            "చికిత్స": 3,
            "నయం": 3,
            "మందు": 2,
            "నియంత్రణ": 2,
        },
        "mr": {
            "उपचार कसा करावा": 6,
            "रोगाचा उपचार": 5,
            "रोग कसा नियंत्रित करावा": 5,
            "आजार बरा कसा करावा": 5,
            "रोग व्यवस्थापन": 5,
            "उपचार": 3,
            "नियंत्रण": 2,
            "औषध": 2,
        },
    },

    "symptom_information": {
        "en": {
            "what are the symptoms": 6,
            "disease symptoms": 5,
            "symptoms of": 5,
            "signs of": 4,
            "what are the signs": 4,
            "symptom": 3,
            "yellow spots": 2,
            "brown spots": 2,
            "leaf spots": 2,
        },
        "hi": {
            "लक्षण क्या हैं": 6,
            "बीमारी के लक्षण": 5,
            "रोग के लक्षण": 5,
            "क्या संकेत हैं": 4,
            "लक्षण": 3,
            "पीले धब्बे": 2,
            "भूरे धब्बे": 2,
        },
        "te": {
            "లక్షణాలు ఏమిటి": 6,
            "వ్యాధి లక్షణాలు": 5,
            "రోగ లక్షణాలు": 5,
            "సంకేతాలు ఏమిటి": 4,
            "లక్షణాలు": 3,
            "పసుపు మచ్చలు": 2,
            "గోధుమ మచ్చలు": 2,
        },
        "mr": {
            "लक्षणे काय आहेत": 6,
            "रोगाची लक्षणे": 5,
            "आजाराची लक्षणे": 5,
            "काय चिन्हे आहेत": 4,
            "लक्षणे": 3,
            "पिवळे डाग": 2,
            "तपकिरी डाग": 2,
        },
    },

    "prevention_advice": {
        "en": {
            "how to prevent": 6,
            "prevention methods": 5,
            "prevent this disease": 5,
            "stop disease spreading": 5,
            "avoid infection": 4,
            "prevention": 3,
            "protect crop": 3,
            "prevent": 3,
        },
        "hi": {
            "बचाव कैसे करें": 6,
            "रोकथाम कैसे करें": 6,
            "बीमारी से बचाव": 5,
            "रोग को फैलने से रोकें": 5,
            "फसल को बचाएं": 4,
            "रोकथाम": 3,
            "बचाव": 3,
        },
        "te": {
            "నివారణ ఎలా చేయాలి": 6,
            "వ్యాధిని ఎలా నివారించాలి": 6,
            "వ్యాధి నివారణ": 5,
            "వ్యాధి వ్యాప్తిని ఆపాలి": 5,
            "పంటను కాపాడాలి": 4,
            "నివారణ": 3,
            "కాపాడటం": 2,
        },
        "mr": {
            "प्रतिबंध कसा करावा": 6,
            "रोग कसा टाळावा": 6,
            "रोगाचा प्रतिबंध": 5,
            "रोगाचा प्रसार थांबवा": 5,
            "पिकाचे संरक्षण": 4,
            "प्रतिबंध": 3,
            "बचाव": 3,
        },
    },

    "weather_risk": {
        "en": {
            "weather risk": 6,
            "will rain increase": 6,
            "weather forecast": 5,
            "disease due to rain": 5,
            "humidity risk": 5,
            "temperature risk": 4,
            "rain": 2,
            "weather": 3,
            "humidity": 3,
            "temperature": 2,
        },
        "hi": {
            "मौसम का खतरा": 6,
            "बारिश से बीमारी": 5,
            "मौसम पूर्वानुमान": 5,
            "नमी से रोग": 5,
            "तापमान का प्रभाव": 4,
            "बारिश": 2,
            "मौसम": 3,
            "नमी": 3,
            "तापमान": 2,
        },
        "te": {
            "వాతావరణ ప్రమాదం": 6,
            "వర్షం వల్ల వ్యాధి": 5,
            "వాతావరణ సూచన": 5,
            "తేమ వల్ల వ్యాధి": 5,
            "ఉష్ణోగ్రత ప్రభావం": 4,
            "వర్షం": 2,
            "వాతావరణం": 3,
            "తేమ": 3,
            "ఉష్ణోగ్రత": 2,
        },
        "mr": {
            "हवामानाचा धोका": 6,
            "पावसामुळे रोग": 5,
            "हवामान अंदाज": 5,
            "आर्द्रतेमुळे रोग": 5,
            "तापमानाचा परिणाम": 4,
            "पाऊस": 2,
            "हवामान": 3,
            "आर्द्रता": 3,
            "तापमान": 2,
        },
    },

    "general_crop_advice": {
        "en": {
            "crop advice": 5,
            "plant care": 5,
            "crop care": 5,
            "help my crop": 4,
            "farming advice": 4,
            "crop": 2,
            "plant": 2,
            "farm": 2,
        },
        "hi": {
            "फसल की सलाह": 5,
            "पौधे की देखभाल": 5,
            "फसल की देखभाल": 5,
            "खेती की सलाह": 4,
            "फसल": 2,
            "पौधा": 2,
            "खेती": 2,
        },
        "te": {
            "పంట సలహా": 5,
            "మొక్క సంరక్షణ": 5,
            "పంట సంరక్షణ": 5,
            "వ్యవసాయ సలహా": 4,
            "పంట": 2,
            "మొక్క": 2,
            "వ్యవసాయం": 2,
        },
        "mr": {
            "पिकाचा सल्ला": 5,
            "झाडाची काळजी": 5,
            "पिकाची काळजी": 5,
            "शेतीचा सल्ला": 4,
            "पीक": 2,
            "झाड": 2,
            "शेती": 2,
        },
    },

    "greeting": {
        "en": {
            "hello": 5,
            "hi": 4,
            "good morning": 5,
            "good evening": 5,
            "namaste": 5,
        },
        "hi": {
            "नमस्ते": 5,
            "नमस्कार": 5,
            "सुप्रभात": 5,
        },
        "te": {
            "నమస్తే": 5,
            "నమస్కారం": 5,
            "శుభోదయం": 5,
        },
        "mr": {
            "नमस्ते": 5,
            "नमस्कार": 5,
            "शुभ सकाळ": 5,
        },
    },
}


def normalize_text(text: str) -> str:
    """
    Normalize text before intent matching.

    This preserves Indian-language characters while removing unnecessary
    punctuation and repeated spaces.
    """
    if not isinstance(text, str):
        raise TypeError("Input text must be a string.")

    normalized = unicodedata.normalize("NFKC", text)
    normalized = normalized.casefold()

    normalized = re.sub(
        r"[^\w\s\u0900-\u097F\u0C00-\u0C7F]",
        " ",
        normalized,
    )

    normalized = re.sub(r"\s+", " ", normalized).strip()

    return normalized


def calculate_intent_scores(
    normalized_text: str,
    language_code: Optional[str] = None,
) -> tuple[dict, dict]:
    """
    Calculate a score for every supported intent.

    If the language is known, its keywords receive slightly higher priority.
    Keywords from all supported languages are still checked because speech
    may contain mixed-language sentences.
    """
    scores = {
        intent: 0
        for intent in INTENT_KEYWORDS
    }

    matched_keywords = {
        intent: []
        for intent in INTENT_KEYWORDS
    }

    for intent, language_data in INTENT_KEYWORDS.items():
        for keyword_language, keyword_data in language_data.items():
            for keyword, weight in keyword_data.items():
                normalized_keyword = normalize_text(keyword)

                if normalized_keyword in normalized_text:
                    adjusted_weight = weight

                    if keyword_language == language_code:
                        adjusted_weight += 1

                    scores[intent] += adjusted_weight

                    matched_keywords[intent].append({
                        "keyword": keyword,
                        "language": keyword_language,
                        "score": adjusted_weight,
                    })

    return scores, matched_keywords


def detect_intent(
    text: str,
    language_code: Optional[str] = None,
) -> dict:
    """
    Detect the farmer's intent from recognized or typed text.

    Args:
        text:
            Farmer's question as text.
        language_code:
            en, hi, te or mr. It may be None for mixed-language matching.

    Returns:
        Dictionary containing detected intent, confidence and match details.
    """
    if language_code is not None:
        language_code = language_code.strip().lower()

        if language_code not in SUPPORTED_LANGUAGES:
            raise ValueError(
                "Unsupported language code. Use en, hi, te, mr or None."
            )

    normalized_text = normalize_text(text)

    if not normalized_text:
        return {
            "success": False,
            "text": text,
            "normalized_text": normalized_text,
            "language_code": language_code,
            "language_name": SUPPORTED_LANGUAGES.get(
                language_code,
                "Unknown",
            ),
            "intent": "unknown",
            "intent_description": INTENT_DESCRIPTIONS["unknown"],
            "confidence": 0.0,
            "matched_keywords": [],
            "all_scores": {},
        }

    scores, matched_keywords = calculate_intent_scores(
        normalized_text=normalized_text,
        language_code=language_code,
    )

    ranked_scores = sorted(
        scores.items(),
        key=lambda item: item[1],
        reverse=True,
    )

    best_intent, best_score = ranked_scores[0]

    total_positive_score = sum(
        score for score in scores.values()
        if score > 0
    )

    if best_score == 0:
        best_intent = "unknown"
        confidence = 0.0
        best_matches = []

    else:
        # This confidence measures the separation between intent scores.
        confidence = best_score / total_positive_score
        confidence = round(min(confidence, 1.0), 4)
        best_matches = matched_keywords[best_intent]

    return {
        "success": best_intent != "unknown",
        "text": text,
        "normalized_text": normalized_text,
        "language_code": language_code,
        "language_name": SUPPORTED_LANGUAGES.get(
            language_code,
            "Automatically matched",
        ),
        "intent": best_intent,
        "intent_description": INTENT_DESCRIPTIONS[best_intent],
        "confidence": confidence,
        "matched_keywords": best_matches,
        "all_scores": dict(ranked_scores),
    }


def print_intent_result(result: dict) -> None:
    """
    Display the detected intent in a readable format.
    """
    print("\nNLP INTENT-DETECTION RESULT")
    print("-" * 60)
    print(f"Success          : {result['success']}")
    print(f"Original text    : {result['text']}")
    print(f"Normalized text  : {result['normalized_text']}")
    print(f"Language         : {result['language_name']}")
    print(f"Detected intent  : {result['intent']}")
    print(f"Meaning          : {result['intent_description']}")
    print(f"Confidence       : {result['confidence']:.2%}")

    keywords = [
        item["keyword"]
        for item in result["matched_keywords"]
    ]

    print(
        "Matched keywords : "
        f"{', '.join(keywords) if keywords else 'None'}"
    )

    print("-" * 60)


def test_intent_detection() -> None:
    """
    Run built-in multilingual intent tests.
    """
    test_cases = [
        (
            "What disease is affecting my tomato plant?",
            "en",
            "disease_detection",
        ),
        (
            "Which pesticide should I spray?",
            "en",
            "pesticide_recommendation",
        ),
        (
            "मेरी फसल के लिए कौन सी खाद उपयोगी है?",
            "hi",
            "fertilizer_recommendation",
        ),
        (
            "నా టమాటా మొక్కకు ఏ వ్యాధి వచ్చింది?",
            "te",
            "disease_detection",
        ),
        (
            "ఈ వ్యాధికి చికిత్స ఎలా చేయాలి?",
            "te",
            "treatment_recommendation",
        ),
        (
            "कोणते कीटकनाशक वापरावे?",
            "mr",
            "pesticide_recommendation",
        ),
        (
            "रोगाची लक्षणे काय आहेत?",
            "mr",
            "symptom_information",
        ),
        (
            "Will rain increase the disease risk?",
            "en",
            "weather_risk",
        ),
    ]

    passed = 0

    print("\nRUNNING INTENT-DETECTION TESTS")
    print("=" * 75)

    for number, test_case in enumerate(test_cases, start=1):
        text, language, expected_intent = test_case

        result = detect_intent(
            text=text,
            language_code=language,
        )

        actual_intent = result["intent"]
        status = actual_intent == expected_intent

        if status:
            passed += 1

        print(f"\nTest {number}")
        print(f"Text     : {text}")
        print(f"Expected : {expected_intent}")
        print(f"Detected : {actual_intent}")
        print(f"Result   : {'PASS' if status else 'FAIL'}")

    print("\n" + "=" * 75)
    print(f"Passed: {passed}/{len(test_cases)}")
    print("=" * 75)


def run_manual_test() -> None:
    """
    Allow the user to type a farmer question manually.
    """
    print("\nSupported languages:")
    print("en = English")
    print("hi = Hindi")
    print("te = Telugu")
    print("mr = Marathi")

    text = input("\nEnter the farmer's question: ").strip()

    language_code = input(
        "Enter language code [press Enter for automatic matching]: "
    ).strip().lower()

    if not language_code:
        language_code = None

    result = detect_intent(
        text=text,
        language_code=language_code,
    )

    print_intent_result(result)

    print("\nJSON RESULT")
    print(
        json.dumps(
            result,
            ensure_ascii=False,
            indent=4,
        )
    )


if __name__ == "__main__":
    print("\nPHASE 14: NLP INTENT DETECTION")
    print("1. Test one typed question")
    print("2. Run all built-in tests")

    choice = input("\nEnter your choice [1 or 2]: ").strip()

    if choice == "1":
        run_manual_test()

    elif choice == "2":
        test_intent_detection()

    else:
        print("Invalid choice. Enter either 1 or 2.")