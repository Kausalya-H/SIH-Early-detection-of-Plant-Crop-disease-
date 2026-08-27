export type Language =
  | 'en' // English
  | 'hi' // Hindi
  | 'as' // Assamese
  | 'bn' // Bengali
  | 'brx' // Bodo
  | 'doi' // Dogri
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ks' // Kashmiri
  | 'kok' // Konkani
  | 'mai' // Maithili
  | 'ml' // Malayalam
  | 'mni' // Manipuri
  | 'mr' // Marathi
  | 'ne' // Nepali
  | 'or' // Odia
  | 'pa' // Punjabi
  | 'sat' // Santhali
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'ur'; // Urdu

export interface SupportedLanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  desc: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', desc: 'Official English UI' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', desc: 'हिन्दी इंटरफेस' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', desc: 'मराठी शेतकरी पोर्टल' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', desc: 'অসমীয়া ভাষা' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', desc: 'বাংলা ইন্টারফেস' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', desc: 'बड़ो राव' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', desc: 'डोगरी भाषा' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', desc: 'ગુજરાતી ઇન્ટરફેસ' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', desc: 'ಕನ್ನಡ ಇಂಟರ್ಫೇಸ್' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर (كٲشُر)', desc: 'کٲشُر زبان' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', desc: 'कोंकणी भास' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', desc: 'मैथिली भाषा' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', desc: 'മലയാളം ഇന്റർഫേസ്' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্ (Manipuri)', desc: 'মৈতৈলোন্' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', desc: 'नेपाली भाषा' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', desc: 'ଓଡ଼ିଆ ଇଣ୍ଟରଫେସ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', desc: 'ਪੰਜਾਬੀ ਇੰਟਰਫੇਸ' },
  { code: 'sat', name: 'Santhali', nativeName: 'संथाली (ᱥᱟᱱᱛᱟᱲᱤ)', desc: 'ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', desc: 'தமிழ் இடைமுகம்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', desc: 'తెలుగు ఇంటర్ఫేస్' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', desc: 'اردو انٹرفیس' },
];

export interface TranslationDict {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    farms: string;
    scanCrop: string;
    reports: string;
    alerts: string;
    advisory: string;
    profile: string;
    login: string;
    logout: string;
  };
  dashboard: {
    greeting: string;
    scanCTA: string;
    scanSubCTA: string;
    totalFarms: string;
    healthyCrops: string;
    cropsToWatch: string;
    highRiskCrops: string;
    recentScans: string;
    viewAllScans: string;
    recentAlerts: string;
    viewAllAlerts: string;
    aiInsightTitle: string;
    aiInsightDisclaimer: string;
    weatherTitle: string;
    humidity: string;
    rainfallChance: string;
    diseaseRisk: string;
  };
  scan: {
    title: string;
    subtitle: string;
    selectFarm: string;
    selectCrop: string;
    uploadTitle: string;
    uploadInstructions: string;
    takePhoto: string;
    chooseFile: string;
    dragDropText: string;
    changeImage: string;
    removeImage: string;
    analyzingTitle: string;
    analyzingStep1: string;
    analyzingStep2: string;
    analyzingStep3: string;
    analyzingStep4: string;
    resultTitle: string;
    confidence: string;
    riskLevel: string;
    symptoms: string;
    recommendation: string;
    safetyNote: string;
    requestOfficer: string;
    downloadReport: string;
    disclaimerBanner: string;
    newScan: string;
  };
  farms: {
    title: string;
    subtitle: string;
    addFarm: string;
    searchPlaceholder: string;
    allCrops: string;
    area: string;
    cropStage: string;
    healthStatus: string;
    lastScan: string;
    viewDetails: string;
    noFarmsFound: string;
  };
  alerts: {
    title: string;
    subtitle: string;
    markAllRead: string;
    filterAll: string;
    filterCritical: string;
    filterDisease: string;
    filterWeather: string;
    filterOfficer: string;
    actionRequired: string;
    noAlerts: string;
  };
  advisory: {
    title: string;
    subtitle: string;
    tabAdvisories: string;
    tabDiseaseLibrary: string;
    searchPlaceholder: string;
    keyPractices: string;
    prevention: string;
  };
  profile: {
    title: string;
    subtitle: string;
    personalInfo: string;
    name: string;
    phone: string;
    village: string;
    taluka: string;
    district: string;
    state: string;
    preferredLanguage: string;
    notificationSettings: string;
    smsAlerts: string;
    whatsappAlerts: string;
    weatherWarnings: string;
    saveChanges: string;
    saveSuccess: string;
  };
  risk: {
    low: string;
    moderate: string;
    high: string;
    critical: string;
  };
  status: {
    healthy: string;
    watch: string;
    affected: string;
    critical: string;
  };
  officerModal: {
    title: string;
    subtitle: string;
    issueType: string;
    urgency: string;
    description: string;
    descriptionPlaceholder: string;
    contactMethod: string;
    submit: string;
    cancel: string;
    successMessage: string;
  };
}

const enDict: TranslationDict = {
  appName: "Early Detection of Plant & Crop Disease",
  tagline: "AI-assisted early warning system for crop protection (SIH26131)",
  nav: {
    dashboard: "Dashboard",
    farms: "My Farms",
    scanCrop: "Scan Crop",
    reports: "Scan Reports",
    alerts: "Alerts",
    advisory: "Advisory & Library",
    profile: "Farmer Profile",
    login: "Login",
    logout: "Logout"
  },
  dashboard: {
    greeting: "Good morning",
    scanCTA: "Scan Your Crop Now",
    scanSubCTA: "Upload or take a photo of leaf/plant for AI health analysis",
    totalFarms: "Total Farms",
    healthyCrops: "Healthy Plots",
    cropsToWatch: "Plots to Watch",
    highRiskCrops: "High Risk Plots",
    recentScans: "Recent Crop Scans",
    viewAllScans: "View All Reports",
    recentAlerts: "Critical Alerts",
    viewAllAlerts: "View Alert Center",
    aiInsightTitle: "AI Field Advisory Insight",
    aiInsightDisclaimer: "AI models provide early screening indicators and predictions. Always verify critical symptoms with your local agricultural extension officer.",
    weatherTitle: "Local Agricultural Weather",
    humidity: "Humidity",
    rainfallChance: "Rain Chance",
    diseaseRisk: "Disease Outbreak Risk"
  },
  scan: {
    title: "AI Crop Disease Detection",
    subtitle: "Instant AI-assisted symptom screening & safe agronomic management",
    selectFarm: "Select Farm / Plot",
    selectCrop: "Select Crop Type",
    uploadTitle: "Upload Crop Photo",
    uploadInstructions: "Take a clear, well-lit photo of the affected leaf, stem, or fruit.",
    takePhoto: "Take Photo (Camera)",
    chooseFile: "Browse Image File",
    dragDropText: "Drag & drop leaf photo here, or click to browse",
    changeImage: "Change Photo",
    removeImage: "Remove Photo",
    analyzingTitle: "Analyzing Crop Image...",
    analyzingStep1: "Preprocessing leaf image and adjusting lighting...",
    analyzingStep2: "Running neural network disease detection model...",
    analyzingStep3: "Assessing lesion patterns and severity markers...",
    analyzingStep4: "Compiling safe treatment recommendations...",
    resultTitle: "Crop Health Screening Result",
    confidence: "Confidence Score",
    riskLevel: "Risk Level",
    symptoms: "Detected Warning Signs & Symptoms",
    recommendation: "Recommended Management Steps",
    safetyNote: "Chemical & Safety Advisory",
    requestOfficer: "Request Agricultural Officer Support",
    downloadReport: "Download PDF Health Report",
    disclaimerBanner: "Notice: AI results are decision-support predictions and not guaranteed diagnostic absolutes. Follow product labels and local agricultural officer guidance.",
    newScan: "Scan Another Crop"
  },
  farms: {
    title: "My Registered Farms",
    subtitle: "Monitor health status and crop stages across all your plots",
    addFarm: "Register New Plot",
    searchPlaceholder: "Search by farm name, village, or crop...",
    allCrops: "All Crops",
    area: "Area",
    cropStage: "Crop Stage",
    healthStatus: "Health Status",
    lastScan: "Last Scan",
    viewDetails: "View Farm Details",
    noFarmsFound: "No farms found matching your search."
  },
  alerts: {
    title: "Agricultural Alerts & Warnings",
    subtitle: "Timely notifications for pest outbreaks, weather risks, and officer advisories",
    markAllRead: "Mark All as Read",
    filterAll: "All Alerts",
    filterCritical: "Critical Only",
    filterDisease: "Disease Warnings",
    filterWeather: "Weather Alerts",
    filterOfficer: "Officer Messages",
    actionRequired: "Recommended Action",
    noAlerts: "No active alerts in your region right now."
  },
  advisory: {
    title: "Agricultural Advisory & Disease Library",
    subtitle: "Practical management practices and symptoms guide for Indian crops",
    tabAdvisories: "Seasonal Advisories",
    tabDiseaseLibrary: "Crop Disease Library",
    searchPlaceholder: "Search diseases, symptoms, or crop guidelines...",
    keyPractices: "Key Recommended Practices",
    prevention: "Prevention & Cultural Care"
  },
  profile: {
    title: "Farmer Profile",
    subtitle: "Manage your contact details, location, and communication preferences",
    personalInfo: "Personal & Location Information",
    name: "Farmer Full Name",
    phone: "Mobile Number",
    village: "Village",
    taluka: "Taluka / Block",
    district: "District",
    state: "State",
    preferredLanguage: "Preferred Portal Language",
    notificationSettings: "Notification Preferences",
    smsAlerts: "SMS Text Alerts",
    whatsappAlerts: "WhatsApp Advisories",
    weatherWarnings: "Severe Weather Risk Warnings",
    saveChanges: "Save Changes",
    saveSuccess: "Profile updated successfully!"
  },
  risk: {
    low: "LOW RISK",
    moderate: "MODERATE RISK",
    high: "HIGH RISK",
    critical: "CRITICAL RISK"
  },
  status: {
    healthy: "Healthy",
    watch: "Under Watch",
    affected: "Affected",
    critical: "Critical Alert"
  },
  officerModal: {
    title: "Request Agricultural Officer Support",
    subtitle: "Connect with your local Krishi Vigyan Kendra (KVK) or extension officer",
    issueType: "Issue Category",
    urgency: "Urgency Level",
    description: "Describe the field situation",
    descriptionPlaceholder: "Describe how long symptoms have persisted, affected area percentage, etc.",
    contactMethod: "Preferred Assistance Mode",
    submit: "Submit Request",
    cancel: "Cancel",
    successMessage: "Officer assistance request registered. Reference ID has been generated."
  }
};

const hiDict: TranslationDict = {
  appName: "पौधों एवं फसलों के रोगों की प्रारंभिक पहचान",
  tagline: "फसल सुरक्षा हेतु एआई-सहायता प्राप्त पूर्व चेतावनी प्रणाली (SIH26131)",
  nav: {
    dashboard: "डैशबोर्ड",
    farms: "मेरे खेत",
    scanCrop: "फसल स्कैन करें",
    reports: "स्कैन रिपोर्ट",
    alerts: "चेतावनी",
    advisory: "सलाह व रोग जानकारी",
    profile: "किसान प्रोफाइल",
    login: "लॉग इन",
    logout: "लॉग आउट"
  },
  dashboard: {
    greeting: "शुभ प्रभात",
    scanCTA: "अपनी फसल अभी स्कैन करें",
    scanSubCTA: "एआई स्वास्थ्य विश्लेषण के लिए पत्ते या पौधे का फोटो अपलोड करें",
    totalFarms: "कुल खेत",
    healthyCrops: "स्वस्थ खेत",
    cropsToWatch: "निगरानी योग्य",
    highRiskCrops: "उच्च जोखिम",
    recentScans: "हाल के फसल स्कैन",
    viewAllScans: "सभी रिपोर्ट देखें",
    recentAlerts: "महत्वपूर्ण चेतावनी",
    viewAllAlerts: "सभी अलर्ट देखें",
    aiInsightTitle: "एआई कृषि परामर्श",
    aiInsightDisclaimer: "एआई मॉडल प्रारंभिक संकेत देते हैं। गंभीर लक्षणों के लिए अपने स्थानीय कृषि अधिकारी से पुष्टि करें।",
    weatherTitle: "स्थानीय मौसम स्थिति",
    humidity: "नमी",
    rainfallChance: "बारिश की संभावना",
    diseaseRisk: "रोग प्रकोप का जोखिम"
  },
  scan: {
    title: "एआई फसल रोग पहचान",
    subtitle: "पत्ते के लक्षणों की तत्काल जांच एवं सुरक्षित उपचार सलाह",
    selectFarm: "खेत / प्लॉट चुनें",
    selectCrop: "फसल का प्रकार चुनें",
    uploadTitle: "फसल की फोटो अपलोड करें",
    uploadInstructions: "प्रभावित पत्ते, तने या फल की साफ फोटो लें।",
    takePhoto: "कैमरा से फोटो लें",
    chooseFile: "फोटो फाइल चुनें",
    dragDropText: "फोटो यहाँ खींचें या ब्राउज़ करने के लिए क्लिक करें",
    changeImage: "फोटो बदलें",
    removeImage: "फोटो हटाएं",
    analyzingTitle: "फसल की जांच जारी है...",
    analyzingStep1: "पत्ते की छवि की गुणवत्ता जांची जा रही है...",
    analyzingStep2: "रोग पहचान मॉडल चलाया जा रहा है...",
    analyzingStep3: "रोग के लक्षणों और गंभीरता का आकलन...",
    analyzingStep4: "सुरक्षित प्रबंधन सलाह तैयार की जा रही है...",
    resultTitle: "फसल स्वास्थ्य जांच परिणाम",
    confidence: "सटीकता प्रतिशत",
    riskLevel: "जोखिम स्तर",
    symptoms: "पाए गए रोग लक्षण",
    recommendation: "अनुशंसित उपचार कदम",
    safetyNote: "दवा छिड़काव व सुरक्षा निर्देश",
    requestOfficer: "कृषि अधिकारी सहायता मांगें",
    downloadReport: "पीडीएफ रिपोर्ट डाउनलोड करें",
    disclaimerBanner: "सूचना: एआई परिणाम निर्णय-सहायता के लिए हैं। हमेशा उत्पाद लेबल और स्थानीय कृषि अधिकारी के निर्देशों का पालन करें।",
    newScan: "अन्य फसल स्कैन करें"
  },
  farms: {
    title: "मेरे पंजीकृत खेत",
    subtitle: "अपने सभी खेतों की स्वास्थ्य स्थिति और फसल विकास देखें",
    addFarm: "नया खेत जोड़ें",
    searchPlaceholder: "खेत, गांव या फसल के नाम से खोजें...",
    allCrops: "सभी फसलें",
    area: "क्षेत्रफल",
    cropStage: "फसल अवस्था",
    healthStatus: "स्वास्थ्य स्थिति",
    lastScan: "अंतिम स्कैन",
    viewDetails: "विवरण देखें",
    noFarmsFound: "कोई खेत नहीं मिला।"
  },
  alerts: {
    title: "कृषि अलर्ट एवं चेतावनियाँ",
    subtitle: "कीट प्रकोप, मौसम जोखिम और अधिकारी संदेशों की समय पर सूचना",
    markAllRead: "सभी को पढ़ा हुआ चिह्नित करें",
    filterAll: "सभी अलर्ट",
    filterCritical: "केवल गंभीर",
    filterDisease: "रोग चेतावनी",
    filterWeather: "मौसम अलर्ट",
    filterOfficer: "अधिकारी संदेश",
    actionRequired: "आवश्यक कार्रवाई",
    noAlerts: "वर्तमान में आपके क्षेत्र में कोई सक्रिय चेतावनी नहीं है।"
  },
  advisory: {
    title: "कृषि सलाह व रोग निर्देशिका",
    subtitle: "भारतीय फसलों के लिए व्यावहारिक प्रबंधन और रोकथाम के उपाय",
    tabAdvisories: "मौसमी कृषि सलाह",
    tabDiseaseLibrary: "फसल रोग निर्देशिका",
    searchPlaceholder: "रोग, लक्षण या फसल सलाह खोजें...",
    keyPractices: "प्रमुख अनुशंसित उपाय",
    prevention: "रोकथाम और देखभाल"
  },
  profile: {
    title: "किसान प्रोफाइल",
    subtitle: "अपनी व्यक्तिगत जानकारी, स्थान और भाषा प्राथमिकताएं प्रबंधित करें",
    personalInfo: "व्यक्तिगत व स्थान विवरण",
    name: "किसान का पूरा नाम",
    phone: "मोबाइल नंबर",
    village: "गांव",
    taluka: "तहसील / ब्लॉक",
    district: "जिला",
    state: "राज्य",
    preferredLanguage: "पसंदीदा भाषा",
    notificationSettings: "अधिसूचना प्राथमिकताएं",
    smsAlerts: "एसएमएस संदेश",
    whatsappAlerts: "व्हाट्सएप सूचना",
    weatherWarnings: "गंभीर मौसम चेतावनी",
    saveChanges: "बदलाव सहेजें",
    saveSuccess: "प्रोफाइल सफलतापूर्वक अपडेट की गई!"
  },
  risk: {
    low: "कम जोखिम (LOW)",
    moderate: "मध्यम जोखिम (MODERATE)",
    high: "उच्च जोखिम (HIGH)",
    critical: "गंभीर जोखिम (CRITICAL)"
  },
  status: {
    healthy: "स्वस्थ",
    watch: "निगरानी में",
    affected: "प्रभावित",
    critical: "गंभीर अलर्ट"
  },
  officerModal: {
    title: "कृषि अधिकारी से सहायता मांगें",
    subtitle: "स्थानीय कृषि विज्ञान केंद्र (केवीके) या अधिकारी से संपर्क करें",
    issueType: "समस्या की श्रेणी",
    urgency: "प्राथमिकता स्तर",
    description: "खेत की स्थिति का विवरण",
    descriptionPlaceholder: "लक्षण कितने दिनों से हैं, कितने क्षेत्रफल में फैले हैं आदि लिखें...",
    contactMethod: "सहायता का पसंदीदा माध्यम",
    submit: "अनुरोध भेजें",
    cancel: "रद्द करें",
    successMessage: "सहायता अनुरोध सफलतापूर्वक दर्ज किया गया।"
  }
};

const mrDict: TranslationDict = {
  appName: "पीक व वनस्पती रोग लवकर ओळख प्रणाली",
  tagline: "पीक संरक्षणासाठी एआय-आधारित पूर्वसूचना प्रणाली (SIH26131)",
  nav: {
    dashboard: "डॅशबोर्ड",
    farms: "माझी शेती",
    scanCrop: "पीक स्कॅन करा",
    reports: "स्कॅन अहवाल",
    alerts: "सतर्कता सूचना",
    advisory: "सल्ला व रोग माहिती",
    profile: "शेतकरी प्रोफाइल",
    login: "लॉग इन",
    logout: "लॉग आउट"
  },
  dashboard: {
    greeting: "शुभ प्रभात",
    scanCTA: "तुमचे पीक त्वरित स्कॅन करा",
    scanSubCTA: "एआय विश्लेषणासाठी पानाचा किंवा पिकाचा फोटो अपलोड करा",
    totalFarms: "एकूण शेती क्षेत्र",
    healthyCrops: "निरोगी शेती",
    cropsToWatch: "निरीक्षणाखाली",
    highRiskCrops: "जास्त धोका",
    recentScans: "अलीकडील पीक स्कॅन",
    viewAllScans: "सर्व अहवाल पहा",
    recentAlerts: "महत्वाच्या सूचना",
    viewAllAlerts: "सर्व सूचना पहा",
    aiInsightTitle: "एआय शेती सल्ला",
    aiInsightDisclaimer: "एआय मॉडेल प्राथमिक अंदाज देते. गंभीर लक्षणांसाठी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.",
    weatherTitle: "स्थानिक हवामान स्थिती",
    humidity: "आर्द्रता",
    rainfallChance: "पावसाची शक्यता",
    diseaseRisk: "रोग प्रादुर्भावाचा धोका"
  },
  scan: {
    title: "एआय पीक रोग निदान",
    subtitle: "पानावरील लक्षणांचे त्वरित विश्लेषण आणि सुरक्षित व्यवस्थापन सल्ला",
    selectFarm: "शेत / प्लॉट निवडा",
    selectCrop: "पीक प्रकार निवडा",
    uploadTitle: "पिकाचा फोटो अपलोड करा",
    uploadInstructions: "बाधित पान, खोड किंवा फळाचा स्पष्ट फोटो घ्या.",
    takePhoto: "कॅमेऱ्याने फोटो घ्या",
    chooseFile: "फोटो फाईल निवडा",
    dragDropText: "फोटो येथे टाका किंवा निवडण्यासाठी क्लिक करा",
    changeImage: "फोटो बदला",
    removeImage: "फोटो काढा",
    analyzingTitle: "पिकाचे विश्लेषण सुरू आहे...",
    analyzingStep1: "फोटोची गुणवत्ता तपासली जात आहे...",
    analyzingStep2: "रोग निदान मॉडेल चालवले जात आहे...",
    analyzingStep3: "रोगाच्या लक्षणांचे आणि तीव्रतेचे मूल्यमापन...",
    analyzingStep4: "सुरक्षित व्यवस्थापन सल्ला तयार केला जात आहे...",
    resultTitle: "पीक आरोग्य तपासणी निकाल",
    confidence: "विश्वासार्हता टक्केवारी",
    riskLevel: "धोका पातळी",
    symptoms: "आढळलेली रोग लक्षणे",
    recommendation: "शिफारस केलेले उपाय",
    safetyNote: "औषध फवारणी व सुरक्षा सूचना",
    requestOfficer: "कृषी अधिकाऱ्यांची मदत मागा",
    downloadReport: "पीडीएफ अहवाल डाऊनलोड करा",
    disclaimerBanner: "सूचना: एआय निष्कर्ष मार्गदर्शनासाठी आहेत. नेहमी औषधाच्या लेबलचे आणि कृषी अधिकाऱ्यांच्या सल्ल्याचे पालन करा.",
    newScan: "दुसरे पीक स्कॅन करा"
  },
  farms: {
    title: "माझी नोंदणीकृत शेती",
    subtitle: "तुमच्या सर्व शेतांची आरोग्य स्थिती आणि पिकांची वाढ तपासा",
    addFarm: "नवीन शेत जोडा",
    searchPlaceholder: "शेत, गाव किंवा पिकाच्या नावाने शोधा...",
    allCrops: "सर्व पिके",
    area: "क्षेत्रफळ",
    cropStage: "पीक अवस्था",
    healthStatus: "आरोग्य स्थिती",
    lastScan: "शेवटचे स्कॅन",
    viewDetails: "तपशील पहा",
    noFarmsFound: "कोणतेही शेत आढळले नाही."
  },
  alerts: {
    title: "कृषी सतर्कता सूचना",
    subtitle: "कीड प्रादुर्भाव, हवामान धोका आणि अधिकारी संदेशांची वेळेवर माहिती",
    markAllRead: "सर्व वाचले म्हणून चिन्हांकित करा",
    filterAll: "सर्व सूचना",
    filterCritical: "फक्त गंभीर",
    filterDisease: "रोग सूचना",
    filterWeather: "हवामान सूचना",
    filterOfficer: "अधिकारी संदेश",
    actionRequired: "आवश्यक कृती",
    noAlerts: "सध्या तुमच्या भागात कोणतीही सतर्कता सूचना नाही."
  },
  advisory: {
    title: "कृषी सल्ला व रोग ज्ञानकोश",
    subtitle: "महाराष्ट्रातील पिकांसाठी उपयुक्त व्यवस्थापन आणि प्रतिबंधात्मक उपाय",
    tabAdvisories: "हंगामी कृषी सल्ला",
    tabDiseaseLibrary: "पीक रोग ज्ञानकोश",
    searchPlaceholder: "रोग, लक्षणे किंवा पीक सल्ला शोधा...",
    keyPractices: "प्रमुख शिफारस केलेल्या पद्धती",
    prevention: "प्रतिबंध आणि निगा"
  },
  profile: {
    title: "शेतकरी प्रोफाइल",
    subtitle: "तुमची माहिती, पत्ता आणि भाषा प्राधान्ये व्यवस्थापित करा",
    personalInfo: "वैयक्तिक आणि पत्ता तपशील",
    name: "शेतकऱ्याचे पूर्ण नाव",
    phone: "मोबाईल नंबर",
    village: "गाव",
    taluka: "तालुका",
    district: "जिल्हा",
    state: "राज्य",
    preferredLanguage: "पसंतीची भाषा",
    notificationSettings: "सूचना प्राधान्ये",
    smsAlerts: "एसएमएस संदेश",
    whatsappAlerts: "व्हॉट्सॲप सूचना",
    weatherWarnings: "हवामान धोका सूचना",
    saveChanges: "बदल जतन करा",
    saveSuccess: "प्रोफाइल यशस्वीरित्या अद्यतनित झाली!"
  },
  risk: {
    low: "कमी धोका (LOW)",
    moderate: "मध्यम धोका (MODERATE)",
    high: "जास्त धोका (HIGH)",
    critical: "अति धोकादायक (CRITICAL)"
  },
  status: {
    healthy: "निरोगी",
    watch: "निरीक्षणाखाली",
    affected: "बाधित",
    critical: "गंभीर स्थिती"
  },
  officerModal: {
    title: "कृषी अधिकाऱ्यांची मदत मागा",
    subtitle: "स्थानिक कृषी विज्ञान केंद्र (केव्हीके) किंवा कृषी सहाय्यकांशी संपर्क साधा",
    issueType: "समस्येचा प्रकार",
    urgency: "तातडीची पातळी",
    description: "शेतातील परिस्थितीचे वर्णन",
    descriptionPlaceholder: "लक्षणे किती दिवसांपासून आहेत, किती क्षेत्र बाधित आहे ते लिहा...",
    contactMethod: "संपर्काचे पसंतीचे माध्यम",
    submit: "विनंती पाठवा",
    cancel: "रद्द करा",
    successMessage: "मदत विनंती नोंदवली गेली आहे. लवकरच संपर्क केला जाईल."
  }
};

// Regional localized dictionaries
export const translations: Record<Language, TranslationDict> = {
  en: enDict,
  hi: hiDict,
  mr: mrDict,
  as: {
    ...hiDict,
    appName: "শস্য আৰু উদ্ভিদৰ ৰোগৰ প্ৰাৰম্ভিক চিনাক্তকৰণ",
    tagline: "শস্য সুৰক্ষাৰ বাবে এআই-সহায়তা প্ৰাপ্ত সতৰ্কবাণী প্ৰণালী (SIH26131)",
    nav: { ...hiDict.nav, dashboard: "ডেশ্বব'ৰ্ড", farms: "মোৰ পথাৰ", scanCrop: "শস্য স্কেন কৰক", profile: "কৃষক প্ৰফাইল" }
  },
  bn: {
    ...hiDict,
    appName: "উদ্ভিদ ও ফসলের রোগ প্রাথমিক সনাক্তকরণ",
    tagline: "ফসল সুরক্ষার জন্য এআই-ভিত্তিক প্রারম্ভিক সতর্কবার্তা প্ল্যাটফর্ম (SIH26131)",
    nav: { ...hiDict.nav, dashboard: "ড্যাশবোর্ড", farms: "আমার খামার", scanCrop: "ফসল স্ক্যান করুন", alerts: "সতর্কবার্তা", profile: "কৃষক প্রোফাইল" }
  },
  brx: {
    ...hiDict,
    appName: "फांथाय आरो फसल बेराम सिनायथि",
    tagline: "एआइ हेफाजाबजों फसल रैखाथि सिस्टेम (SIH26131)",
  },
  doi: {
    ...hiDict,
    appName: "बूटे ते फ़सल दे रोग दी शुरूआती पछाण",
    tagline: "फ़सल सुरक्षा लेई एआई-आधारित पूर्व चेतावनी प्रणाली (SIH26131)",
  },
  gu: {
    ...hiDict,
    appName: "પાક અને છોડના રોગોની વહેલી ઓળખ",
    tagline: "પાક સંરક્ષણ માટે એઆઈ-સંચાલિત પ્રારંભિક ચેતવણી પ્રણાલી (SIH26131)",
    nav: { ...hiDict.nav, dashboard: "ડેશબોર્ડ", farms: "મારા ખેતર", scanCrop: "પાક સ્કેન કરો", alerts: "ચેતવણી", profile: "ખેડૂત પ્રોફાઇલ" }
  },
  kn: {
    ...enDict,
    appName: "ಸಸ್ಯ ಮತ್ತು ಬೆಳೆ ರೋಗಗಳ ಆರಂಭಿಕ ಪತ್ತೆ",
    tagline: "ಬೆಳೆ ರಕ್ಷಣೆಗಾಗಿ AI-ಆಧಾರಿತ ಮುನ್ನೆಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ (SIH26131)",
    nav: { ...enDict.nav, dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", farms: "ನನ್ನ ಜಮೀನುಗಳು", scanCrop: "ಬೆಳೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", alerts: "ಎಚ್ಚರಿಕೆಗಳು", profile: "ರೈತರ ಪ್ರೊಫೈಲ್" }
  },
  ks: {
    ...hiDict,
    appName: "کُلین تہِ فصلن ہٕنٛزن بیمارین ہٕنٛز گۄڈنِیچ پٔچھان",
    tagline: "فصلچ حفاظت خٲطرٕ اے آئی وارننگ سسٹم (SIH26131)",
  },
  kok: {
    ...mrDict,
    appName: "झाडां आनी पिकांच्या रोगांची पयली वळख",
    tagline: "पीक राखणे खातीर एआय-आधारित पूर्वसूचना प्रणाली (SIH26131)",
  },
  mai: {
    ...hiDict,
    appName: "पौधा आ फसल रोगक प्रारंभिक पहचान",
    tagline: "फसल सुरक्षा लेल एआई पूर्व चेतावनी प्रणाली (SIH26131)",
  },
  ml: {
    ...enDict,
    appName: "വിള രോഗങ്ങളുടെ നേരത്തെയുള്ള കണ്ടെത്തൽ",
    tagline: "വിള സംരക്ഷണത്തിനായുള്ള AI മുന്നറിയിപ്പ് സംവിധാനം (SIH26131)",
    nav: { ...enDict.nav, dashboard: "ഡാഷ്‌ബോർഡ്", farms: "എന്റെ കൃഷിയിടങ്ങൾ", scanCrop: "വിള സ്കാൻ ചെയ്യുക", alerts: "മുന്നറിയിപ്പുകൾ", profile: "കർഷക പ്രൊഫൈൽ" }
  },
  mni: {
    ...enDict,
    appName: "পাম্বী অমসুং পাম্বীগী লাইনা য়াংনা খঙদোকপা",
    tagline: "পাম্বী ঙাকশেনগীদমক এআই সিস্তেম (SIH26131)",
  },
  ne: {
    ...hiDict,
    appName: "बिरुवा र बाली रोगको प्रारम्भिक पहिचान",
    tagline: "बाली संरक्षणको लागि एआई-आधारित पूर्व चेतावनी प्रणाली (SIH26131)",
  },
  or: {
    ...hiDict,
    appName: "ଉଦ୍ଭିଦ ଏବଂ ଫସଲ ରୋଗର ପ୍ରାଥମିକ ଚିହ୍ନଟ",
    tagline: "ଫସଲ ସୁରକ୍ଷା ପାଇଁ ଏଆଇ-ଆଧାରିତ ପ୍ରାରମ୍ଭିକ ଚେତାବନୀ ପ୍ରଣାଳୀ (SIH26131)",
    nav: { ...hiDict.nav, dashboard: "ଡ୍ୟାସବୋର୍ଡ", farms: "ମୋର ଜମି", scanCrop: "ଫସଲ ସ୍କାନ କରନ୍ତୁ", alerts: "ସତର୍କତା", profile: "କୃଷକ ପ୍ରୋଫାଇଲ" }
  },
  pa: {
    ...hiDict,
    appName: "ਪੌਦਿਆਂ ਅਤੇ ਫ਼ਸਲਾਂ ਦੇ ਰੋਗਾਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਪਛਾਣ",
    tagline: "ਫ਼ਸਲ ਸੁਰੱਖਿਆ ਲਈ ਏਆਈ-ਅਧਾਰਤ ਚੇਤਾਵਨੀ ਪ੍ਰਣਾਲੀ (SIH26131)",
    nav: { ...hiDict.nav, dashboard: "ਡੈਸ਼ਬੋਰਡ", farms: "ਮੇਰੇ ਖੇਤ", scanCrop: "ਫ਼ਸਲ ਸਕੈਨ ਕਰੋ", alerts: "ਚੇਤਾਵਨੀਆਂ", profile: "ਕਿਸਾਨ ਪ੍ਰੋਫ਼ਾਈਲ" }
  },
  sat: {
    ...hiDict,
    appName: "ᱫᱟᱨᱮ ᱟᱨ ᱪᱟᱥ ᱨᱩᱣᱟᱹ ᱞᱟᱦᱟ ᱪᱤᱱᱦᱟᱹᱣ",
    tagline: "ᱪᱟᱥ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱮᱟᱭ ᱦᱚᱨᱟ (SIH26131)",
  },
  ta: {
    ...enDict,
    appName: "தாவர மற்றும் பயிர் நோய்களை முன்கூட்டியே கண்டறிதல்",
    tagline: "பயிர் பாதுகாப்பிற்கான AI முன் எச்சரிக்கை அமைப்பு (SIH26131)",
    nav: { ...enDict.nav, dashboard: "முகப்பு", farms: "எனது பண்ணைகள்", scanCrop: "பயிரை ஸ்கேன் செய்", alerts: "எச்சரிக்கைகள்", profile: "விவசாயி சுயவிவரம்" }
  },
  te: {
    ...enDict,
    appName: "మొక్కలు మరియు పంట వ్యాధుల ముందస్తు గుర్తింపు",
    tagline: "పంట రక్షణ కోసం AI-ఆధారిత ముందస్తు హెచ్చరిక వ్యవస్థ (SIH26131)",
    nav: { ...enDict.nav, dashboard: "డాష్‌బోర్డ్", farms: "నా పొలాలు", scanCrop: "పంటను స్కాన్ చేయండి", alerts: "హెచ్చరికలు", profile: "రైతు ప్రొఫైల్" }
  },
  ur: {
    ...hiDict,
    appName: "پودوں اور فصلوں کی بیماریوں کی بروقت شناخت",
    tagline: "فصلوں کے تحفظ کے لیے اے آئی پر مبنی ابتدائی انتباہی نظام (SIH26131)",
    nav: { ...hiDict.nav, dashboard: "ڈیش بورڈ", farms: "میرے کھیت", scanCrop: "فصل اسکین کریں", alerts: "انتباہات", profile: "کسان پروفائل" }
  }
};
