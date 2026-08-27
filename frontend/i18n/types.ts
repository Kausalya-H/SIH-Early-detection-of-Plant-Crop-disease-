export type SupportedLanguage =
  | 'en' // English
  | 'as' // Assamese (অসমীয়া)
  | 'bn' // Bengali (বাংলা)
  | 'brx' // Bodo (बर')
  | 'doi' // Dogri (डोगरी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'hi' // Hindi (हिन्दी)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ks' // Kashmiri (کٲشُر) - RTL
  | 'kok' // Konkani (कोंकणी)
  | 'mai' // Maithili (मैथिली)
  | 'ml' // Malayalam (മലയാളം)
  | 'mni' // Manipuri (মৈতৈলোন্)
  | 'mr' // Marathi (मराठी)
  | 'ne' // Nepali (नेपाली)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'sa' // Sanskrit (संस्कृतम्)
  | 'sat' // Santali (ᱥᱟᱱᱛᱟᱲᱤ)
  | 'sd' // Sindhi (سنڌي) - RTL
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'ur'; // Urdu (اردو) - RTL

export type TextDirection = 'ltr' | 'rtl';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string; // English name e.g. "Bengali"
  nativeName: string; // Native script name e.g. "বাংলা"
  direction: TextDirection;
  regionLabel?: string;
}

export interface TranslationSchema {
  common: {
    appName: string;
    appSubtitle: string;
    govTitle: string;
    govSubtitle: string;
    nationalGrid: string;
    gridActive: string;
    search: string;
    searchPlaceholder: string;
    notifications: string;
    language: string;
    selectLanguage: string;
    searchLanguagePlaceholder: string;
    noLanguagesFound: string;
    logout: string;
    loading: string;
    error: string;
    retry: string;
    back: string;
    save: string;
    cancel: string;
    submit: string;
    status: string;
    authorizedAccess: string;
    processing: string;
    allRightsReserved: string;
    switchPortal: string;
    returnHome: string;
    viewDetails: string;
  };
  portals: {
    farmer: {
      title: string;
      subtitle: string;
      enterBtn: string;
      tagline: string;
    };
    officer: {
      title: string;
      subtitle: string;
      enterBtn: string;
      tagline: string;
    };
    admin: {
      title: string;
      subtitle: string;
      enterBtn: string;
      tagline: string;
    };
  };
  roles: {
    farmer: string;
    officer: string;
    admin: string;
  };
  riskLevels: {
    low: string;
    lowDesc: string;
    moderate: string;
    moderateDesc: string;
    high: string;
    highDesc: string;
    critical: string;
    criticalDesc: string;
  };
  nav: {
    dashboard: string;
    riskMap: string;
    outbreaks: string;
    farms: string;
    analytics: string;
    alerts: string;
    users: string;
    cropsDiseases: string;
    aiMonitoring: string;
    auditLogs: string;
    settings: string;
    cropDiagnosis: string;
    reportDisease: string;
    advisory: string;
    myProfile: string;
  };
  officer: {
    activeClusters: string;
    monitoredAcreage: string;
    containmentRate: string;
    emergencyAdvisories: string;
    outbreakQueue: string;
    outbreakQueueDesc: string;
    containmentProgress: string;
  };
  admin: {
    modelFleet: string;
    modelFleetDesc: string;
    auditTrail: string;
    auditTrailDesc: string;
    modelAccuracy: string;
    registeredOfficers: string;
    dailyInferences: string;
  };
  farmer: {
    aiLeafDiagnosis: string;
    regionalAdvisories: string;
    outbreakReporting: string;
    readyEndpoints: string;
  };
}

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationSchema>;
