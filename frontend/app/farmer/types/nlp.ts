export interface NLPQueryRequest {
  query: string;
  crop?: string;
  language?: string;
}

export interface NLPQueryResponse {
  query: string;
  crop: string;
  matched_disease: string;
  confidence: number;
  intent: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  summary: string;
  warning_signs: string[];
  advice: string;
  treatment: string;
  active_ingredient: string;
  application: string;
  organic_remedies: string[];
  preventive_tips: string[];
  safety_note: string;
  language: string;
  message: string;
  isFallback?: boolean;
}

export interface NLPSampleQuery {
  id: string;
  crop: string;
  query: string;
  topic: string;
}

export interface NLPQueryHistoryItem {
  id: string;
  timestamp: string;
  request: NLPQueryRequest;
  response: NLPQueryResponse;
}
