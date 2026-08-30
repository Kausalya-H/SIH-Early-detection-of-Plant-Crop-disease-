import { Farm as UIFarm, CropInfo, HealthStatus, CropStage } from "../types/farmer";
import { DiagnosisRecord, RiskLevel, TreatmentRecommendation } from "../types/disease";
import { Farm as ApiFarm, Crop as ApiCrop } from "../services/farmService";
import { DiseaseReport } from "../services/reportService";

export function mapApiFarmToUIFarm(apiFarm: ApiFarm, reports: DiseaseReport[] = []): UIFarm {
  const primaryCrop: ApiCrop | undefined = apiFarm.crops && apiFarm.crops[0];
  const farmReports = reports.filter(r => r.farmId === apiFarm._id);
  const health: HealthStatus = deriveHealth(farmReports);
  const risk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" = deriveRisk(farmReports);
  const locationParts = parseLocation(apiFarm.location || "");

  const cropInfo: CropInfo = primaryCrop
    ? {
        name: primaryCrop.cropName,
        variety: primaryCrop.variety || "Standard",
        sowingDate: primaryCrop.sowingDate || "",
        stage: deriveStage(primaryCrop.sowingDate),
        health,
        currentRisk: risk,
      }
    : {
        name: "No crop registered",
        variety: "",
        sowingDate: "",
        stage: "VEGETATIVE" as CropStage,
        health: "WATCH" as HealthStatus,
        currentRisk: "MODERATE",
      };

  return {
    id: apiFarm._id,
    farmerId: apiFarm.userId,
    name: apiFarm.farmName || "Unnamed Farm",
    plotNumber: "",
    village: locationParts.village,
    taluka: locationParts.taluka,
    district: locationParts.district,
    state: locationParts.state,
    areaAcres: apiFarm.area || 0,
    soilType: apiFarm.soilType,
    irrigationType: mapIrrigationType(apiFarm.irrigation),
    crop: cropInfo,
    lastScanDate: farmReports.length > 0 ? farmReports[0].createdAt : undefined,
    totalScansCount: farmReports.length,
    createdAt: apiFarm.createdAt,
  };
}

export function mapReportToDiagnosis(report: DiseaseReport, farmName?: string): DiagnosisRecord {
  const riskLevel: RiskLevel = mapSeverityToRisk(report.overallSeverity || report.severity);
  const treatment: TreatmentRecommendation = {
    chemicalControl: report.activeIngredient ? [report.activeIngredient] : [],
    biologicalControl: [],
    culturalPractices: report.treatment ? [report.treatment] : [],
    safetyPrecautions: report.safetyNote ? [report.safetyNote] : [],
  };
  const symptoms: string[] = Array.isArray(report.warning_signs)
    ? report.warning_signs
    : report.severity
    ? ["Severity: " + report.severity]
    : [];

  return {
    id: report._id,
    farmId: report.farmId || "",
    farmName: farmName || "",
    cropName: report.cropName || "Unknown",
    cropVariety: undefined,
    imageUrl: "",
    diseaseDetected: report.disease || "Unknown disease",
    scientificName: report.causalAgent || undefined,
    confidence: report.confidence || 0,
    riskLevel,
    symptoms,
    diagnosedAt: formatDate(report.createdAt),
    treatment,
    status: mapReportStatus(report.status),
    severity: report.severity,
    warning_signs: report.warning_signs,
    advice: report.advice,
    treatmentText: report.treatment,
    active_ingredient: report.activeIngredient,
    safety_note: report.safetyNote,
    isLiveBackendResult: true,
  };
}

function parseLocation(location: string) {
  const parts = location.split(",").map((p) => p.trim());
  if (parts.length >= 3) return { village: parts[0], taluka: parts[1], district: parts[2], state: parts[3] || "" };
  if (parts.length === 2) return { village: parts[0], taluka: "", district: parts[1], state: "" };
  return { village: location, taluka: "", district: "", state: "" };
}

function mapIrrigationType(type?: string): "DRIP" | "SPRINKLER" | "FLOOD" | "RAINFED" {
  if (!type) return "RAINFED";
  const t = type.toLowerCase();
  if (t.includes("drip")) return "DRIP";
  if (t.includes("sprinkler")) return "SPRINKLER";
  if (t.includes("flood") || t.includes("canal")) return "FLOOD";
  return "RAINFED";
}

function deriveStage(sowingDate?: string): CropStage {
  if (!sowingDate) return "VEGETATIVE";
  const planted = new Date(sowingDate);
  const now = new Date();
  const daysSinceSow = Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceSow < 15) return "SOWING";
  if (daysSinceSow < 40) return "VEGETATIVE";
  if (daysSinceSow < 65) return "FLOWERING";
  if (daysSinceSow < 90) return "FRUITING";
  if (daysSinceSow < 110) return "MATURITY";
  return "HARVEST_READY";
}

function deriveHealth(reports: DiseaseReport[]): HealthStatus {
  if (reports.length === 0) return "HEALTHY";
  const highRisk = reports.some((r) => r.overallSeverity === "High" || r.overallSeverity === "Critical");
  const mediumRisk = reports.some((r) => r.overallSeverity === "Medium");
  if (highRisk) return "CRITICAL";
  if (mediumRisk) return "AFFECTED";
  return "WATCH";
}

function deriveRisk(reports: DiseaseReport[]): "LOW" | "MODERATE" | "HIGH" | "CRITICAL" {
  if (reports.length === 0) return "LOW";
  const scores = reports.map((r) => r.riskScore || 0);
  const maxScore = Math.max(...scores);
  if (maxScore >= 75) return "CRITICAL";
  if (maxScore >= 50) return "HIGH";
  if (maxScore >= 25) return "MODERATE";
  return "LOW";
}

function mapSeverityToRisk(severity?: string): RiskLevel {
  if (!severity) return "LOW";
  const s = severity.toLowerCase();
  if (s.includes("critical") || s.includes("high")) return "HIGH";
  if (s.includes("medium") || s.includes("moderate")) return "MODERATE";
  return "LOW";
}

function mapReportStatus(status: string): "REVIEWED" | "ACTION_TAKEN" | "PENDING" | "RESOLVED" {
  switch (status) {
    case "confirmed": return "REVIEWED";
    case "flagged": return "ACTION_TAKEN";
    default: return "PENDING";
  }
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return diffHrs + "h ago";
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return diffDays + "d ago";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}
