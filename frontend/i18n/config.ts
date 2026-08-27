import { LanguageMeta, SupportedLanguage } from './types';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const LANGUAGE_STORAGE_KEY = 'krishirakshak_lang';

export const LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    regionLabel: 'Default / All India',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    regionLabel: 'National / Northern & Central India',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    direction: 'ltr',
    regionLabel: 'Andhra Pradesh & Telangana',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    direction: 'ltr',
    regionLabel: 'Tamil Nadu & Puducherry',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    direction: 'ltr',
    regionLabel: 'Karnataka',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    direction: 'ltr',
    regionLabel: 'Kerala & Lakshadweep',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    direction: 'ltr',
    regionLabel: 'Maharashtra & Goa',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: 'ltr',
    regionLabel: 'West Bengal & Tripura',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    direction: 'ltr',
    regionLabel: 'Gujarat & Daman/Diu',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    direction: 'ltr',
    regionLabel: 'Punjab & Chandigarh',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    direction: 'rtl',
    regionLabel: 'Jammu & Kashmir, Telangana, UP, Bihar',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    direction: 'ltr',
    regionLabel: 'Odisha',
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    direction: 'ltr',
    regionLabel: 'Assam',
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    direction: 'ltr',
    regionLabel: 'Bihar & Jharkhand',
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    direction: 'ltr',
    regionLabel: 'Goa & Coastal Karnataka/Maharashtra',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    direction: 'ltr',
    regionLabel: 'Sikkim & West Bengal',
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    direction: 'ltr',
    regionLabel: 'Classical / Pan-India',
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    direction: 'ltr',
    regionLabel: 'Jharkhand, Odisha, West Bengal',
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर\'',
    direction: 'ltr',
    regionLabel: 'Assam (Bodoland)',
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    direction: 'ltr',
    regionLabel: 'Jammu & Kashmir',
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر',
    direction: 'rtl',
    regionLabel: 'Jammu & Kashmir',
  },
  {
    code: 'mni',
    name: 'Manipuri (Meitei)',
    nativeName: 'মৈতৈলোন্',
    direction: 'ltr',
    regionLabel: 'Manipur',
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي',
    direction: 'rtl',
    regionLabel: 'Gujarat, Rajasthan, Maharashtra',
  },
];

export const LANGUAGE_MAP = new Map<SupportedLanguage, LanguageMeta>(
  LANGUAGES.map((lang) => [lang.code, lang])
);
