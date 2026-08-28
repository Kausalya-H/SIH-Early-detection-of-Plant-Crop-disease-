export type AdvisoryCategory = 
  | 'CROP_HEALTH' 
  | 'DISEASE_PREVENTION' 
  | 'PEST_MANAGEMENT' 
  | 'IRRIGATION' 
  | 'GENERAL_CARE';

export interface AdvisoryItem {
  id: string;
  category: AdvisoryCategory;
  title: string;
  crop: string;
  season?: string;
  shortSummary: string;
  keyPractices: string[];
  preventiveTips: string[];
  warningNote?: string;
  publishedDate: string;
}

export interface DiseaseKnowledgeItem {
  id: string;
  crop: string;
  diseaseName: string;
  scientificName?: string;
  severityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  commonSymptoms: string[];
  favorableConditions: string;
  organicRemedies: string[];
  approvedTreatments: string;
  activeIngredients?: string;
  applicationGuidance: string;
  safetyInstructions: string;
}
