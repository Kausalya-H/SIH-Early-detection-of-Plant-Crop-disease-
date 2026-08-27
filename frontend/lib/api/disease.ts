import { apiClient } from './client';
import { DiseasePrediction, DiseaseReport } from '@/types';

export interface PredictDiseaseParams {
  file: File | Blob;
  crop: string;
}

export interface ReportDiseaseParams {
  file: File | Blob;
  crop: string;
  farmerName: string;
  phone: string;
  location: string;
}

/**
 * Predicts crop disease from an uploaded leaf image.
 * Matches backend: POST /disease/predict (multipart form: file, crop)
 */
export async function predictDisease(params: PredictDiseaseParams): Promise<DiseasePrediction> {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('crop', params.crop);

  return apiClient<DiseasePrediction>('/disease/predict', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Submits a disease outbreak report from field or farmer with crop photo and farmer metadata.
 * Matches backend: POST /disease/report (multipart form: file, crop, farmer_name, phone, location)
 */
export async function reportDisease(params: ReportDiseaseParams): Promise<DiseaseReport> {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('crop', params.crop);
  formData.append('farmer_name', params.farmerName);
  formData.append('phone', params.phone);
  formData.append('location', params.location);

  return apiClient<DiseaseReport>('/disease/report', {
    method: 'POST',
    body: formData,
  });
}
