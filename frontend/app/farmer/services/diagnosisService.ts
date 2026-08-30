import { DiagnosisRecord, BackendPredictResponse, RiskLevel } from "../types/disease";
import { apiRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export interface GenerateReportParams {
  file: File | Blob;
  crop: string;
  farmer_name?: string;
  phone?: string;
  location?: string;
  filename?: string;
}

export const diagnosisService = {
  async getDiagnoses(): Promise<DiagnosisRecord[]> {
    const { data, error } = await apiRequest<any[]>(ENDPOINTS.REPORTS);
    if (data && Array.isArray(data)) {
      return data.map((r) => this._mapReportToDiagnosis(r));
    }
    console.warn("Backend reports unavailable:", error);
    return [];
  },

  async getDiagnosisById(id: string): Promise<DiagnosisRecord | null> {
    const { data } = await apiRequest<any>(ENDPOINTS.REPORT_DETAIL(id));
    if (data) return this._mapReportToDiagnosis(data);
    return null;
  },

  async predictDisease(imageFile: File | Blob, crop: string, farmId?: string): Promise<{ data: BackendPredictResponse | null; error: string | null }> {
    const formData = new FormData();
    const fileName = imageFile instanceof File ? imageFile.name : crop.toLowerCase() + "_sample.jpg";
    formData.append("file", imageFile, fileName);
    formData.append("crop", crop);
    if (farmId) formData.append("farm_id", farmId);
    const res = await apiRequest<BackendPredictResponse>(ENDPOINTS.DISEASE_PREDICT, { method: "POST", body: formData });
    if (res.data) return { data: res.data, error: null };
    return { data: null, error: res.error || "Failed to predict disease" };
  },

  async generateReport(params: GenerateReportParams): Promise<{ blob: Blob | null; error: string | null }> {
    const formData = new FormData();
    const fileName = params.file instanceof File ? params.file.name : params.crop.toLowerCase() + "_sample.jpg";
    formData.append("file", params.file, fileName);
    formData.append("crop", params.crop);
    formData.append("farmer_name", params.farmer_name || "Farmer");
    formData.append("phone", params.phone || "Not provided");
    formData.append("location", params.location || "Not provided");
    const res = await apiRequest<Blob>(ENDPOINTS.DISEASE_REPORT, { method: "POST", body: formData });
    if (res.data instanceof Blob) {
      const blobUrl = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = params.filename || params.crop + "_crop_health_report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return { blob: res.data, error: null };
    }
    return { blob: null, error: res.error || "Failed to generate PDF" };
  },

  async addDiagnosis(record: Omit<DiagnosisRecord, "id" | "diagnosedAt">): Promise<DiagnosisRecord> {
    const payload: any = {
      crop: record.cropName,
      disease: record.diseaseDetected,
      confidence: record.confidence,
      severity: record.severity || record.riskLevel,
      warning_signs: record.warning_signs || record.symptoms || [],
      advice: record.advice || record.treatmentText,
      treatment: record.treatmentText || (record.treatment.culturalPractices[0] || ""),
      active_ingredient: record.active_ingredient || (record.treatment.chemicalControl[0] || ""),
      safety_note: record.safety_note || (record.treatment.safetyPrecautions[0] || ""),
      farmId: record.farmId || undefined,
      status: record.status === "PENDING" ? "pending" : record.status === "REVIEWED" ? "confirmed" : "pending",
    };
    const { data } = await apiRequest<any>(ENDPOINTS.REPORTS, { method: "POST", body: JSON.stringify(payload) });
    if (data) {
      return { ...record, id: data._id || data.reportId || Date.now().toString(), diagnosedAt: formatDate(data.createdAt || new Date().toISOString()) };
    }
    return { ...record, id: "local_" + Date.now(), diagnosedAt: new Date().toLocaleDateString("en-IN") };
  },

  _mapReportToDiagnosis(r: any): DiagnosisRecord {
    return {
      id: r._id, farmId: r.farmId || "", farmName: r.farmName || "",
      cropName: r.cropName || r.crop || "Unknown", imageUrl: "",
      diseaseDetected: r.disease || "Unknown", scientificName: r.causalAgent,
      confidence: r.confidence || 0,
      riskLevel: mapSeverityToRisk(r.overallSeverity || r.severity),
      symptoms: Array.isArray(r.warning_signs) ? r.warning_signs : [],
      diagnosedAt: formatDate(r.createdAt),
      treatment: { chemicalControl: r.activeIngredient ? [r.activeIngredient] : [], biologicalControl: [], culturalPractices: r.treatment ? [r.treatment] : [], safetyPrecautions: r.safetyNote ? [r.safetyNote] : [] },
      status: mapReportStatus(r.status), severity: r.severity,
      warning_signs: r.warning_signs, advice: r.advice, treatmentText: r.treatment,
      active_ingredient: r.activeIngredient, safety_note: r.safetyNote, isLiveBackendResult: true,
    };
  },
};

function mapSeverityToRisk(s?: string): RiskLevel {
  if (!s) return "LOW";
  const v = s.toLowerCase();
  if (v.includes("critical") || v.includes("high")) return "HIGH";
  if (v.includes("medium") || v.includes("moderate")) return "MODERATE";
  return "LOW";
}

function mapReportStatus(s: string): "REVIEWED" | "ACTION_TAKEN" | "PENDING" | "RESOLVED" {
  if (s === "confirmed") return "REVIEWED";
  if (s === "flagged") return "ACTION_TAKEN";
  return "PENDING";
}

function formatDate(d: string): string {
  try {
    const dt = new Date(d);
    const now = new Date();
    const hrs = Math.floor((now.getTime() - dt.getTime()) / 3600000);
    if (hrs < 1) return "Just now";
    if (hrs < 24) return hrs + "h ago";
    const days = Math.floor(hrs / 24);
    if (days < 7) return days + "d ago";
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch { return d; }
}
