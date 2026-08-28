export type Language =
  | 'en' // English
  | 'hi' // Hindi
  | 'mr' // Marathi
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
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', desc: 'മലയാളം ഇന്റർഫೇಸ್' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্ (Manipuri)', desc: 'মৈতৈলোন্' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', desc: 'नेपाली भाषा' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', desc: 'ଓଡ଼ିଆ ଇଣ୍ଟରଫେସ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', desc: 'ਪੰਜਾਬੀ ਇੰਟਰਫੇਸ' },
  { code: 'sat', name: 'Santhali', nativeName: 'संथाली (ᱥᱟᱱᱛᱟᱲᱤ)', desc: 'ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', desc: 'தமிழ் இடைமுகம்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', desc: 'తెలుగు ఇంటర్ఫೇಸ್' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', desc: 'اردو انٹرفیس' },
];

export interface TranslationDict {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    myFarms: string;
    diseaseDetection: string;
    alerts: string;
    analytics: string;
    settings: string;
    logout: string;
  };
  dashboard: {
    greeting: string;
    subtitle: string;
    farmSummary: string;
    myFarms: string;
    healthyCrops: string;
    activeAlerts: string;
    recentDiagnoses: string;
    quickActions: string;
    diagnoseCrop: string;
    viewMyFarms: string;
    viewAlerts: string;
    cropHealthOverview: string;
    recentDiagnosesTitle: string;
    activeAlertsTitle: string;
    viewAll: string;
    aiInsightTitle?: string;
    aiInsightDisclaimer?: string;
    scanCTA?: string;
    scanSubCTA?: string;
    recentScans?: string;
    viewAllScans?: string;
    weatherTitle?: string;
    diseaseRisk?: string;
    humidity?: string;
    rainfallChance?: string;
    [key: string]: any;
  };
  farms?: Record<string, any>;
  scan?: Record<string, any>;
  advisory?: Record<string, any>;
  profile?: Record<string, any>;
  officerModal?: Record<string, any>;
  common?: Record<string, any>;
  [key: string]: any;
}

const enDict: TranslationDict = {
  appName: 'KrishiRakshak AI — Kisan Portal',
  tagline: 'Early Detection & Management of Crop Diseases and Pest Infestations',
  nav: {
    dashboard: 'Dashboard',
    myFarms: 'My Farms',
    diseaseDetection: 'Disease Detection',
    alerts: 'Alerts',
    analytics: 'Analytics',
    settings: 'Settings',
    logout: 'Logout',
  },
  dashboard: {
    greeting: 'Welcome, Farmer',
    subtitle: 'Monitor your farms and protect your crops with AI-assisted diagnostics.',
    farmSummary: 'Farm Summary',
    myFarms: 'My Farms',
    healthyCrops: 'Healthy Crops',
    activeAlerts: 'Active Alerts',
    recentDiagnoses: 'Recent Diagnoses',
    quickActions: 'Quick Actions',
    diagnoseCrop: '🔬 Diagnose Crop',
    viewMyFarms: '🌾 View My Farms',
    viewAlerts: '🔔 View Alerts',
    cropHealthOverview: 'Crop Health Overview',
    recentDiagnosesTitle: 'Recent Disease Diagnoses',
    activeAlertsTitle: 'Active Outbreak & Weather Alerts',
    viewAll: 'View All',
    aiInsightTitle: 'AI Pathology Insight',
    aiInsightDisclaimer: 'AI predictions assist early screening. Always verify with your local KVK extension officer.',
    scanCTA: 'Start New Leaf Scan',
    scanSubCTA: 'Upload or capture a leaf photo for instant computer vision analysis',
    recentScans: 'Recent Crop Scans',
    viewAllScans: 'View All Scans',
    weatherTitle: 'Local Agricultural Weather',
    diseaseRisk: 'Disease Risk Forecast',
    humidity: 'Humidity',
    rainfallChance: 'Rainfall Probability',
  },
  farms: {
    title: 'My Registered Farms',
    subtitle: 'Manage your plots and crops',
    addFarm: 'Register New Plot',
    searchPlaceholder: 'Search farms by name, crop or location...',
    area: 'Area',
    acres: 'Acres',
    cropStage: 'Growth Stage',
    lastScan: 'Last Health Scan',
    viewDetails: 'View Plot Details',
    healthy: 'Healthy',
    underWatch: 'Under Watch',
    affected: 'Affected',
  },
  scan: {
    title: 'AI Crop Disease Detection',
    subtitle: 'Upload or capture a leaf photo for instant computer vision pathology diagnosis',
    uploadPrompt: 'Upload or capture leaf photo',
    browse: 'Browse Image File',
    analyzing: 'Analyzing Crop Leaf Pathology...',
    step1: '1. Preprocessing image contrast & leaf segmentation',
    step2: '2. Scanning lesion morphology & fungal spore markers',
    step3: '3. Compiling approved CIB&RC treatment advisory',
    confidence: 'Model Confidence',
    symptoms: 'Observed Symptoms',
    treatment: 'Recommended Treatment',
    downloadPdf: 'Download Official PDF Health Report',
    selectCrop: 'Crop Specimen Type',
    selectFarm: 'Target Farm / Plot',
  },
  advisory: {
    title: 'Regional Agricultural Advisories',
    subtitle: 'Seasonal weather warnings & crop management protocols',
    viewAll: 'View All Advisories',
    highPriority: 'High Priority',
  },
  profile: {
    title: 'Farmer Profile & Settings',
    subtitle: 'Manage your account and preferences',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    phone: 'Mobile Number',
    email: 'Email Address',
    location: 'Village & District',
    language: 'Preferred Language',
    notifications: 'Notification Channels',
    save: 'Save Preferences',
  },
  officerModal: {
    title: 'Request KVK Officer Assistance',
    subtitle: 'Connect with your block agricultural extension officer',
    problemCategory: 'Problem Category',
    urgencyLevel: 'Urgency Level',
    notes: 'Field Observations & Description',
    submit: 'Submit Request',
    successTitle: 'Assistance Request Registered',
    successMessage: 'Your issue has been forwarded to the extension officer. They will review and call you.',
    close: 'Close',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    close: 'Close',
  },
};

const hiDict: TranslationDict = {
  appName: 'कृषि रक्षक एआई — किसान पोर्टल',
  tagline: 'फसल रोगों और कीटों की प्रारंभिक पहचान एवं प्रबंधन प्रणाली',
  nav: {
    dashboard: 'डैशबोर्ड',
    myFarms: 'मेरे खेत',
    diseaseDetection: 'रोग पहचान',
    alerts: 'चेतावनी',
    analytics: 'एनालिटिक्स',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
  },
  dashboard: {
    greeting: 'स्वागत है, किसान भाई',
    subtitle: 'अपने खेतों की निगरानी करें और एआई की सहायता से फसलों की रक्षा करें।',
    farmSummary: 'खेत का सारांश',
    myFarms: 'कुल खेत',
    healthyCrops: 'स्वस्थ फसल',
    activeAlerts: 'सक्रिय चेतावनी',
    recentDiagnoses: 'हाल की जांचें',
    quickActions: 'त्वरित कार्य',
    diagnoseCrop: '🔬 फसल जांचें',
    viewMyFarms: '🌾 मेरे खेत देखें',
    viewAlerts: '🔔 चेतावनियाँ देखें',
    cropHealthOverview: 'फसल स्वास्थ्य अवलोकन',
    recentDiagnosesTitle: 'हाल के रोग निदान',
    activeAlertsTitle: 'सक्रिय प्रकोप और मौसम अलर्ट',
    viewAll: 'सभी देखें',
    aiInsightTitle: 'एआई पैथोलॉजी इनसाइट',
    aiInsightDisclaimer: 'एआई पूर्वानुमान प्रारंभिक जांच में सहायता करते हैं। स्थानीय केवीके विस्तार अधिकारी से सलाह लें।',
    scanCTA: 'नई पत्ती स्कैन करें',
    scanSubCTA: 'त्वरित कंप्यूटर विज़न विश्लेषण के लिए पत्ती की फोटो अपलोड करें',
    recentScans: 'हाल के स्कैन',
    viewAllScans: 'सभी स्कैन देखें',
    weatherTitle: 'स्थानीय कृषि मौसम',
    diseaseRisk: 'रोग जोखिम पूर्वानुमान',
    humidity: 'आर्द्रता',
    rainfallChance: 'वर्षा की संभावना',
  },
  farms: enDict.farms,
  scan: enDict.scan,
  advisory: enDict.advisory,
  profile: enDict.profile,
  officerModal: enDict.officerModal,
  common: enDict.common,
};

const mrDict: TranslationDict = {
  appName: 'कृषी रक्षक एआय — शेतकरी पोर्टल',
  tagline: 'पीक रोग व कीड प्रादुर्भाव लवकर ओळख व व्यवस्थापन प्रणाली',
  nav: {
    dashboard: 'डॅशबोर्ड',
    myFarms: 'माझी शेती',
    diseaseDetection: 'रोग निदान',
    alerts: 'सतर्कता सूचना',
    analytics: 'अनालिटिक्स',
    settings: 'सेटिंग्ज',
    logout: 'लॉग आउट',
  },
  dashboard: {
    greeting: 'नमस्कार, शेतकरी मित्र',
    subtitle: 'तुमच्या शेतीचे निरीक्षण करा आणि एआय तंत्रज्ञानाने पिकांचे संरक्षण करा.',
    farmSummary: 'शेती सारांश',
    myFarms: 'एकूण शेती',
    healthyCrops: 'निरोगी पिके',
    activeAlerts: 'सक्रिय सूचना',
    recentDiagnoses: 'नुकतेच केलेले निदान',
    quickActions: 'जलद कृती',
    diagnoseCrop: '🔬 पीक तपासा',
    viewMyFarms: '🌾 माझी शेती पहा',
    viewAlerts: '🔔 सूचना पहा',
    cropHealthOverview: 'पीक आरोग्य आढावा',
    recentDiagnosesTitle: 'अलीकडील पीक रोग निदान',
    activeAlertsTitle: 'सक्रिय प्रादुर्भाव व हवामान सूचना',
    viewAll: 'सर्व पहा',
    aiInsightTitle: 'एआय रोग निदान इनसाइट',
    aiInsightDisclaimer: 'एआय भाकिते प्राथमिक तपासणीसाठी आहेत. नेहमी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.',
    scanCTA: 'नवीन पान स्कॅन करा',
    scanSubCTA: 'तत्काळ संगणक दृष्टी विश्लेषणासाठी फोटो अपलोड करा',
    recentScans: 'अलीकडील स्कॅन',
    viewAllScans: 'सर्व स्कॅन पहा',
    weatherTitle: 'स्थानिक कृषी हवामान',
    diseaseRisk: 'रोग जोखीम अंदाज',
    humidity: 'हवेतील आर्द्रता',
    rainfallChance: 'पावसाची शक्यता',
  },
  farms: enDict.farms,
  scan: enDict.scan,
  advisory: enDict.advisory,
  profile: enDict.profile,
  officerModal: enDict.officerModal,
  common: enDict.common,
};

export const translations: Record<Language, TranslationDict> = {
  en: enDict,
  hi: hiDict,
  mr: mrDict,
  as: { ...hiDict, appName: 'কৃষি ৰক্ষক এআই — কৃষক পৰ্টেল' },
  bn: { ...hiDict, appName: 'কৃষি রক্ষক এআই — কৃষক পোর্টাল' },
  brx: { ...hiDict, appName: 'फांथाय आरो फसल बेराम सिनायथि' },
  doi: { ...hiDict, appName: 'फ़सल रोग दी पछाण प्रणाली' },
  gu: { ...hiDict, appName: 'કૃષિ રક્ષક એઆઈ — ખેડૂત પોર્ટલ' },
  kn: { ...enDict, appName: 'ಕೃಷಿ ರಕ್ಷಕ್ AI — ರೈತ ಪೋರ್ಟಲ್' },
  ks: { ...hiDict, appName: 'فصلن ہٕنٛز پٔچھان پورٹل' },
  kok: { ...mrDict, appName: 'कृषी रक्षक — शेतकरी पोर्टल' },
  mai: { ...hiDict, appName: 'कृषि रक्षक एआई — किसान पोर्टल' },
  ml: { ...enDict, appName: 'കൃഷി രക്ഷക് AI — കർഷക പോർട്ടൽ' },
  mni: { ...enDict, appName: 'পাম্বী লাইনা খঙদোকপা পোৰ্টেল' },
  ne: { ...hiDict, appName: 'कृषि रक्षक एआई — किसान पोर्टल' },
  or: { ...hiDict, appName: 'କୃଷି ରକ୍ଷକ ଏଆଇ — କୃଷକ ପୋର୍ଟାଲ' },
  pa: { ...hiDict, appName: 'ਕ੍ਰਿਸ਼ੀ ਰੱਖਿਅਕ ਏਆਈ — ਕਿਸਾਨ ਪੋਰਟਲ' },
  sat: { ...hiDict, appName: 'ᱪᱟᱥ ᱨᱩᱣᱟᱹ ᱞᱟᱦᱟ ᱪᱤᱱᱦᱟᱹᱣ' },
  ta: { ...enDict, appName: 'கிருஷி ரக்ஷக் AI — உழவர் போர்டல்' },
  te: { ...enDict, appName: 'కృషి రక్షక్ AI — రైతు పోర్టల్' },
  ur: { ...hiDict, appName: 'کرشی رکشک اے آئی — کسان پورٹل' },
};
