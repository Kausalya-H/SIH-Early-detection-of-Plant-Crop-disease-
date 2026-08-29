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

/**
 * Generates and downloads the official PDF crop health report.
 * Matches backend: POST /disease/report (FileResponse: application/pdf)
 */
export async function downloadDiseaseReportPdf(params: ReportDiseaseParams): Promise<Blob> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('crop', params.crop);
  formData.append('farmer_name', params.farmerName);
  formData.append('phone', params.phone);
  formData.append('location', params.location);

  const response = await fetch(`${API_BASE_URL}/disease/report`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = `Failed to generate PDF report (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson && (errJson.message || errJson.detail)) {
        errorDetail = errJson.message || errJson.detail;
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.blob();
}

/**
 * Triggers a browser download of a generated Blob (e.g. PDF).
 */
export function triggerBlobDownload(blob: Blob, fileName: string): void {
  if (typeof window === 'undefined') return;
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(anchor);
}
