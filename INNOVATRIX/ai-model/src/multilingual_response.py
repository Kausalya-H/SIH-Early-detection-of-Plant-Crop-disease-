import json
from typing import Optional


SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "te": "Telugu",
    "mr": "Marathi",
}


LANGUAGE_FALLBACK_MESSAGE = {
    "en": (
        "The requested language is not currently supported. "
        "The response is being provided in English."
    ),
    "hi": "अनुरोधित भाषा अभी समर्थित नहीं है।",
    "te": "అభ్యర్థించిన భాషకు ప్రస్తుతం మద్దతు లేదు.",
    "mr": "विनंती केलेली भाषा सध्या समर्थित नाही.",
}


RESPONSES = {
    "greeting": {
        "en": (
            "Hello! I can help identify crop diseases and provide "
            "information about symptoms, prevention, treatment, "
            "pesticides, fertilizers and weather-related disease risks. "
            "Please describe your problem or upload a clear leaf image."
        ),
        "hi": (
            "नमस्ते! मैं फसल रोगों की पहचान और लक्षण, रोकथाम, उपचार, "
            "कीटनाशक, उर्वरक तथा मौसम से जुड़े रोग के खतरे की जानकारी "
            "देने में सहायता कर सकता हूँ। कृपया अपनी समस्या बताएं या "
            "पत्ती की साफ तस्वीर अपलोड करें।"
        ),
        "te": (
            "నమస్తే! పంట వ్యాధులను గుర్తించడం, లక్షణాలు, నివారణ, చికిత్స, "
            "పురుగుమందులు, ఎరువులు మరియు వాతావరణ సంబంధిత వ్యాధి ప్రమాదాల "
            "గురించి సమాచారం అందించడంలో నేను సహాయపడగలను. దయచేసి మీ "
            "సమస్యను వివరించండి లేదా ఆకు యొక్క స్పష్టమైన చిత్రాన్ని అప్‌లోడ్ చేయండి."
        ),
        "mr": (
            "नमस्कार! मी पिकांचे रोग ओळखणे तसेच लक्षणे, प्रतिबंध, उपचार, "
            "कीटकनाशके, खते आणि हवामानाशी संबंधित रोगाचा धोका याबद्दल "
            "माहिती देऊ शकतो. कृपया समस्या सांगा किंवा पानाचे स्पष्ट "
            "छायाचित्र अपलोड करा."
        ),
    },

    "disease_detection": {
        "en": (
            "Please upload a clear image of the affected leaf. Ensure that "
            "the leaf is well lit, in focus and occupies most of the image. "
            "The disease-detection model will analyse it and return the "
            "predicted disease with a confidence score."
        ),
        "hi": (
            "कृपया प्रभावित पत्ती की साफ तस्वीर अपलोड करें। तस्वीर में "
            "पर्याप्त रोशनी हो, पत्ती स्पष्ट दिखाई दे और तस्वीर का अधिकांश "
            "भाग पत्ती से भरा हो। रोग पहचान मॉडल तस्वीर का विश्लेषण करके "
            "संभावित रोग और विश्वास स्कोर बताएगा।"
        ),
        "te": (
            "దయచేసి ప్రభావితమైన ఆకు యొక్క స్పష్టమైన చిత్రాన్ని అప్‌లోడ్ "
            "చేయండి. చిత్రంలో తగినంత వెలుతురు ఉండాలి, ఆకు స్పష్టంగా కనిపించాలి "
            "మరియు చిత్రంలో ఎక్కువ భాగం ఆకు ఉండాలి. వ్యాధి గుర్తింపు మోడల్ "
            "చిత్రాన్ని విశ్లేషించి అంచనా వేసిన వ్యాధి మరియు నమ్మక స్కోరును అందిస్తుంది."
        ),
        "mr": (
            "कृपया प्रभावित पानाचे स्पष्ट छायाचित्र अपलोड करा. छायाचित्रात "
            "पुरेसा प्रकाश असावा, पान स्पष्ट दिसावे आणि छायाचित्राचा बहुतांश "
            "भाग पानाने व्यापलेला असावा. रोग ओळख मॉडेल छायाचित्राचे विश्लेषण "
            "करून संभाव्य रोग आणि विश्वास गुण देईल."
        ),
    },

    "pesticide_recommendation": {
        "en": (
            "To recommend an appropriate pesticide, I first need the crop "
            "name and confirmed disease or pest. Upload a clear image or "
            "provide the prediction result. Use only locally registered "
            "products and follow the product label, waiting period and "
            "agricultural expert's instructions."
        ),
        "hi": (
            "उपयुक्त कीटनाशक बताने के लिए पहले फसल का नाम और पुष्टि किया गया "
            "रोग या कीट आवश्यक है। साफ तस्वीर अपलोड करें या रोग पहचान परिणाम "
            "बताएं। केवल स्थानीय रूप से पंजीकृत उत्पाद का उपयोग करें और उत्पाद "
            "लेबल, प्रतीक्षा अवधि तथा कृषि विशेषज्ञ के निर्देशों का पालन करें।"
        ),
        "te": (
            "సరైన పురుగుమందును సూచించడానికి ముందుగా పంట పేరు మరియు నిర్ధారించిన "
            "వ్యాధి లేదా పురుగు వివరాలు అవసరం. స్పష్టమైన చిత్రాన్ని అప్‌లోడ్ చేయండి "
            "లేదా వ్యాధి అంచనా ఫలితాన్ని అందించండి. స్థానికంగా నమోదైన ఉత్పత్తులను "
            "మాత్రమే ఉపయోగించి, లేబుల్, నిరీక్షణ కాలం మరియు వ్యవసాయ నిపుణుల "
            "సూచనలను పాటించండి."
        ),
        "mr": (
            "योग्य कीटकनाशक सुचवण्यासाठी प्रथम पिकाचे नाव आणि निश्चित झालेला "
            "रोग किंवा कीड आवश्यक आहे. स्पष्ट छायाचित्र अपलोड करा किंवा रोग "
            "ओळखीचा निकाल द्या. फक्त स्थानिक नोंदणीकृत उत्पादन वापरा आणि "
            "उत्पादनाचे लेबल, प्रतीक्षा कालावधी व कृषी तज्ज्ञांच्या सूचनांचे पालन करा."
        ),
    },

    "fertilizer_recommendation": {
        "en": (
            "A fertilizer recommendation requires the crop name, crop stage "
            "and preferably a soil-test result. Avoid applying fertilizer only "
            "because a leaf looks diseased, because infections and nutrient "
            "deficiencies require different actions. Provide the crop and soil details."
        ),
        "hi": (
            "उर्वरक की सही सलाह के लिए फसल का नाम, फसल की अवस्था और संभव हो "
            "तो मिट्टी परीक्षण का परिणाम आवश्यक है। केवल पत्ती रोगग्रस्त दिखने "
            "के कारण उर्वरक न डालें, क्योंकि संक्रमण और पोषक तत्वों की कमी का "
            "उपचार अलग होता है। कृपया फसल और मिट्टी की जानकारी दें।"
        ),
        "te": (
            "సరైన ఎరువు సూచనకు పంట పేరు, పంట దశ మరియు సాధ్యమైతే మట్టి పరీక్ష "
            "ఫలితం అవసరం. ఆకు వ్యాధిగ్రస్తంగా కనిపిస్తోందనే కారణంతో మాత్రమే ఎరువు "
            "వేయవద్దు. సంక్రమణ మరియు పోషక లోపానికి వేర్వేరు చర్యలు అవసరం. "
            "దయచేసి పంట మరియు మట్టి వివరాలను అందించండి."
        ),
        "mr": (
            "योग्य खताच्या शिफारसीसाठी पिकाचे नाव, पिकाची अवस्था आणि शक्य "
            "असल्यास माती परीक्षणाचा निकाल आवश्यक आहे. पान रोगग्रस्त दिसते "
            "म्हणूनच खत वापरू नका, कारण संसर्ग आणि पोषक तत्त्वांची कमतरता "
            "यासाठी वेगवेगळे उपाय आवश्यक असतात. कृपया पीक व मातीची माहिती द्या."
        ),
    },

    "treatment_recommendation": {
        "en": (
            "Treatment depends on the crop and confirmed disease. Please "
            "provide the disease-prediction result. General first steps are "
            "to isolate affected plants when practical, remove severely "
            "infected material safely, avoid unnecessary overhead watering "
            "and keep tools clean."
        ),
        "hi": (
            "उपचार फसल और पुष्टि किए गए रोग पर निर्भर करता है। कृपया रोग पहचान "
            "परिणाम बताएं। सामान्य प्रारंभिक कदमों में संभव होने पर प्रभावित "
            "पौधों को अलग करना, अत्यधिक संक्रमित भागों को सुरक्षित रूप से हटाना, "
            "अनावश्यक ऊपरी सिंचाई से बचना और औजारों को साफ रखना शामिल है।"
        ),
        "te": (
            "చికిత్స పంట మరియు నిర్ధారించిన వ్యాధిపై ఆధారపడి ఉంటుంది. దయచేసి "
            "వ్యాధి అంచనా ఫలితాన్ని అందించండి. సాధారణ ప్రారంభ చర్యలుగా సాధ్యమైనప్పుడు "
            "ప్రభావిత మొక్కలను వేరుచేయడం, తీవ్రంగా దెబ్బతిన్న భాగాలను సురక్షితంగా "
            "తొలగించడం, అవసరం లేని పై నుంచి నీరు పోయడాన్ని నివారించడం మరియు "
            "పరికరాలను శుభ్రంగా ఉంచడం చేయవచ్చు."
        ),
        "mr": (
            "उपचार पिकावर आणि निश्चित झालेल्या रोगावर अवलंबून असतो. कृपया "
            "रोग ओळखीचा निकाल द्या. शक्य असल्यास प्रभावित झाडे वेगळी करणे, "
            "अतिशय संक्रमित भाग सुरक्षितपणे काढणे, अनावश्यक वरून पाणी देणे "
            "टाळणे आणि साधने स्वच्छ ठेवणे हे प्राथमिक उपाय आहेत."
        ),
    },

    "symptom_information": {
        "en": (
            "Please provide the crop name and predicted disease name to receive "
            "the relevant symptoms. You can also upload a clear image showing "
            "the spots, colour changes, curling, wilting or damaged areas."
        ),
        "hi": (
            "संबंधित लक्षणों की जानकारी के लिए फसल का नाम और अनुमानित रोग का "
            "नाम बताएं। आप धब्बे, रंग परिवर्तन, पत्ती मुड़ना, मुरझाना या "
            "क्षतिग्रस्त भाग दिखाने वाली साफ तस्वीर भी अपलोड कर सकते हैं।"
        ),
        "te": (
            "సంబంధిత లక్షణాల సమాచారం పొందడానికి పంట పేరు మరియు అంచనా వేసిన "
            "వ్యాధి పేరును అందించండి. మచ్చలు, రంగు మార్పు, ఆకులు ముడుచుకోవడం, "
            "వాడిపోవడం లేదా దెబ్బతిన్న భాగాలు కనిపించే స్పష్టమైన చిత్రాన్ని కూడా "
            "అప్‌లోడ్ చేయవచ్చు."
        ),
        "mr": (
            "संबंधित लक्षणांची माहिती मिळवण्यासाठी पिकाचे नाव आणि अंदाजित "
            "रोगाचे नाव द्या. डाग, रंगातील बदल, पाने वाकणे, कोमेजणे किंवा "
            "नुकसान झालेले भाग दिसणारे स्पष्ट छायाचित्रही अपलोड करू शकता."
        ),
    },

    "prevention_advice": {
        "en": (
            "Disease prevention depends on the disease, but general measures "
            "include using healthy planting material, maintaining field "
            "sanitation, rotating crops, avoiding excessive irrigation, "
            "providing proper plant spacing and regularly inspecting plants."
        ),
        "hi": (
            "रोग की रोकथाम रोग के प्रकार पर निर्भर करती है। सामान्य उपायों में "
            "स्वस्थ रोपण सामग्री का उपयोग, खेत की स्वच्छता, फसल चक्र, अत्यधिक "
            "सिंचाई से बचाव, पौधों के बीच उचित दूरी और नियमित निरीक्षण शामिल हैं।"
        ),
        "te": (
            "వ్యాధి నివారణ వ్యాధి రకంపై ఆధారపడి ఉంటుంది. సాధారణ చర్యల్లో ఆరోగ్యకరమైన "
            "నాటే పదార్థాన్ని ఉపయోగించడం, పొలం పరిశుభ్రత, పంట మార్పిడి, అధిక నీటిపారుదల "
            "నివారణ, మొక్కల మధ్య సరైన దూరం మరియు మొక్కలను క్రమం తప్పకుండా పరిశీలించడం ఉన్నాయి."
        ),
        "mr": (
            "रोगाचा प्रतिबंध रोगाच्या प्रकारावर अवलंबून असतो. सामान्य उपायांमध्ये "
            "निरोगी लागवड साहित्य, शेताची स्वच्छता, पीक फेरपालट, जास्त सिंचन "
            "टाळणे, झाडांमध्ये योग्य अंतर आणि नियमित तपासणी यांचा समावेश होतो."
        ),
    },

    "weather_risk": {
        "en": (
            "Weather-related disease risk requires location, temperature, "
            "humidity and rainfall information. Warm and humid conditions may "
            "increase the risk of several fungal and bacterial diseases. "
            "Provide the location and crop name for a more relevant assessment."
        ),
        "hi": (
            "मौसम से जुड़े रोग के खतरे का आकलन करने के लिए स्थान, तापमान, नमी "
            "और वर्षा की जानकारी आवश्यक है। गर्म और नम परिस्थितियाँ कई फफूंद "
            "तथा जीवाणु रोगों का खतरा बढ़ा सकती हैं। बेहतर आकलन के लिए स्थान "
            "और फसल का नाम बताएं।"
        ),
        "te": (
            "వాతావరణ సంబంధిత వ్యాధి ప్రమాదాన్ని అంచనా వేయడానికి ప్రాంతం, ఉష్ణోగ్రత, "
            "తేమ మరియు వర్షపాతం వివరాలు అవసరం. వేడి మరియు తేమతో కూడిన పరిస్థితులు "
            "అనేక శిలీంద్ర మరియు బ్యాక్టీరియా వ్యాధుల ప్రమాదాన్ని పెంచవచ్చు. మరింత "
            "సంబంధిత అంచనాకు ప్రాంతం మరియు పంట పేరును అందించండి."
        ),
        "mr": (
            "हवामानाशी संबंधित रोगाचा धोका ठरवण्यासाठी स्थान, तापमान, आर्द्रता "
            "आणि पावसाची माहिती आवश्यक आहे. उबदार व दमट परिस्थिती अनेक बुरशीजन्य "
            "आणि जिवाणूजन्य रोगांचा धोका वाढवू शकते. योग्य आकलनासाठी स्थान आणि "
            "पिकाचे नाव द्या."
        ),
    },

    "general_crop_advice": {
        "en": (
            "Please provide the crop name, growth stage, visible symptoms, "
            "location and recent weather conditions. This information will "
            "help provide more relevant crop-care guidance."
        ),
        "hi": (
            "कृपया फसल का नाम, वृद्धि अवस्था, दिखाई देने वाले लक्षण, स्थान और "
            "हाल की मौसम स्थिति बताएं। यह जानकारी अधिक उपयोगी फसल देखभाल सलाह "
            "देने में सहायता करेगी।"
        ),
        "te": (
            "దయచేసి పంట పేరు, పెరుగుదల దశ, కనిపించే లక్షణాలు, ప్రాంతం మరియు ఇటీవలి "
            "వాతావరణ పరిస్థితులను అందించండి. ఈ సమాచారం మరింత ఉపయోగకరమైన పంట "
            "సంరక్షణ సలహా ఇవ్వడానికి సహాయపడుతుంది."
        ),
        "mr": (
            "कृपया पिकाचे नाव, वाढीची अवस्था, दिसणारी लक्षणे, स्थान आणि अलीकडील "
            "हवामानाची स्थिती द्या. ही माहिती अधिक योग्य पीक व्यवस्थापन सल्ला "
            "देण्यासाठी उपयुक्त ठरेल."
        ),
    },

    "unknown": {
        "en": (
            "I could not clearly understand the request. Please ask about "
            "disease identification, symptoms, treatment, prevention, "
            "pesticides, fertilizers or weather-related crop risk."
        ),
        "hi": (
            "मैं अनुरोध को स्पष्ट रूप से नहीं समझ पाया। कृपया रोग पहचान, लक्षण, "
            "उपचार, रोकथाम, कीटनाशक, उर्वरक या मौसम से जुड़े फसल खतरे के बारे में पूछें।"
        ),
        "te": (
            "మీ అభ్యర్థనను స్పష్టంగా అర్థం చేసుకోలేకపోయాను. దయచేసి వ్యాధి గుర్తింపు, "
            "లక్షణాలు, చికిత్స, నివారణ, పురుగుమందులు, ఎరువులు లేదా వాతావరణ సంబంధిత "
            "పంట ప్రమాదం గురించి అడగండి."
        ),
        "mr": (
            "तुमची विनंती स्पष्टपणे समजली नाही. कृपया रोग ओळख, लक्षणे, उपचार, "
            "प्रतिबंध, कीटकनाशके, खते किंवा हवामानाशी संबंधित पिकाच्या धोक्याबद्दल विचारा."
        ),
    },
}


def normalize_language_code(
    language_code: Optional[str],
) -> tuple[str, bool]:
    """
    Validate the requested language.

    Returns:
        selected language and whether fallback was required.
    """
    if language_code is None:
        return "en", True

    language_code = language_code.strip().lower()

    if language_code not in SUPPORTED_LANGUAGES:
        return "en", True

    return language_code, False


def generate_response(
    intent: str,
    language_code: Optional[str],
    crop_name: Optional[str] = None,
    disease_name: Optional[str] = None,
) -> dict:
    """
    Generate a multilingual response for a detected intent.

    Args:
        intent:
            Intent returned by Phase 14.
        language_code:
            en, hi, te or mr.
        crop_name:
            Optional crop name.
        disease_name:
            Optional disease predicted by the image model.

    Returns:
        Dictionary containing response details.
    """
    selected_language, used_fallback = normalize_language_code(
        language_code
    )

    selected_intent = intent

    if selected_intent not in RESPONSES:
        selected_intent = "unknown"

    message = RESPONSES[selected_intent][selected_language]

    context_parts = []

    if crop_name:
        context_parts.append(f"crop={crop_name}")

    if disease_name:
        context_parts.append(f"disease={disease_name}")

    return {
        "success": selected_intent != "unknown",
        "intent": selected_intent,
        "requested_language_code": language_code,
        "response_language_code": selected_language,
        "response_language_name": SUPPORTED_LANGUAGES[
            selected_language
        ],
        "used_language_fallback": used_fallback,
        "crop_name": crop_name,
        "disease_name": disease_name,
        "context": context_parts,
        "response": message,
    }


def print_response(result: dict) -> None:
    """
    Print the generated response.
    """
    print("\nMULTILINGUAL RESPONSE")
    print("-" * 70)
    print(f"Success           : {result['success']}")
    print(f"Intent            : {result['intent']}")
    print(
        f"Response language : "
        f"{result['response_language_name']}"
    )
    print(
        f"Language fallback : "
        f"{result['used_language_fallback']}"
    )

    if result["crop_name"]:
        print(f"Crop              : {result['crop_name']}")

    if result["disease_name"]:
        print(f"Disease           : {result['disease_name']}")

    print(f"\nResponse:\n{result['response']}")
    print("-" * 70)


def run_tests() -> None:
    """
    Test multilingual response generation.
    """
    tests = [
        ("disease_detection", "en"),
        ("disease_detection", "hi"),
        ("disease_detection", "te"),
        ("disease_detection", "mr"),
        ("pesticide_recommendation", "en"),
        ("fertilizer_recommendation", "hi"),
        ("treatment_recommendation", "te"),
        ("symptom_information", "mr"),
        ("prevention_advice", "en"),
        ("weather_risk", "hi"),
        ("general_crop_advice", "te"),
        ("unknown", "mr"),
    ]

    passed = 0

    print("\nRUNNING MULTILINGUAL RESPONSE TESTS")
    print("=" * 75)

    for number, test in enumerate(tests, start=1):
        intent, language = test

        result = generate_response(
            intent=intent,
            language_code=language,
        )

        has_response = bool(result["response"].strip())
        correct_language = (
            result["response_language_code"] == language
        )

        status = has_response and correct_language

        if status:
            passed += 1

        print(
            f"Test {number:02d}: "
            f"intent={intent}, "
            f"language={language}, "
            f"result={'PASS' if status else 'FAIL'}"
        )

    print("=" * 75)
    print(f"Passed: {passed}/{len(tests)}")
    print("=" * 75)


if __name__ == "__main__":
    print("\nPHASE 15: MULTILINGUAL RESPONSE")
    print("1. Generate one response")
    print("2. Run all tests")

    choice = input("\nEnter your choice [1 or 2]: ").strip()

    if choice == "1":
        print("\nAvailable intents:")

        for intent_name in RESPONSES:
            print(f"- {intent_name}")

        entered_intent = input(
            "\nEnter detected intent: "
        ).strip()

        entered_language = input(
            "Enter language code [en/hi/te/mr]: "
        ).strip().lower()

        crop = input(
            "Enter crop name [optional]: "
        ).strip()

        disease = input(
            "Enter disease name [optional]: "
        ).strip()

        response_result = generate_response(
            intent=entered_intent,
            language_code=entered_language,
            crop_name=crop or None,
            disease_name=disease or None,
        )

        print_response(response_result)

        print("\nJSON OUTPUT")

        print(
            json.dumps(
                response_result,
                ensure_ascii=False,
                indent=4,
            )
        )

    elif choice == "2":
        run_tests()

    else:
        print("Invalid choice. Enter 1 or 2.")