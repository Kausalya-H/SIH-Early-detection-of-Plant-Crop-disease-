import React, { useEffect, useState } from "react";
import { WelcomeBanner } from "../components/dashboard/WelcomeBanner";
import { FarmSummaryCards } from "../components/dashboard/FarmSummaryCards";
import { CropHealthOverview } from "../components/dashboard/CropHealthOverview";
import { ActiveAlertsSection } from "../components/dashboard/ActiveAlertsSection";
import { RecentDiagnosesSection } from "../components/dashboard/RecentDiagnosesSection";
import { QuickActions } from "../components/dashboard/QuickActions";
import { farmService } from "../services/farmService";
import { reportService, DiseaseReport } from "../services/reportService";
import { Farm as UIFarm } from "../types/farmer";
import { DiagnosisRecord } from "../types/disease";
import { mapApiFarmToUIFarm, mapReportToDiagnosis } from "../utils/dataMapper";
import { useAuth } from "../context/AuthContext";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [uiFarms, setUiFarms] = useState<UIFarm[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [farmsRes, reportsRes] = await Promise.all([
          farmService.getMyFarms(),
          reportService.getMyReports({ limit: 10 }),
        ]);

        const apiFarms = farmsRes.data || [];
        const reports = reportsRes.data || [];

        // Map backend data to frontend types
        const mapped = apiFarms.map((f) => mapApiFarmToUIFarm(f, reports));
        setUiFarms(mapped);

        // Build a farm lookup for farm names in diagnosis records
        const farmLookup: Record<string, string> = {};
        apiFarms.forEach((f) => { farmLookup[f._id] = f.farmName; });

        const mappedDiagnoses = reports.map((r) =>
          mapReportToDiagnosis(r, farmLookup[r.farmId || ""] || "")
        );
        setDiagnoses(mappedDiagnoses);
      } catch (e: any) {
        console.error("Failed to load dashboard data", e);
        setError(e.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  const totalCrops = uiFarms.reduce((sum, f) => sum + (f.crop?.name ? 1 : 0), 0);
  const totalAcres = uiFarms.reduce((sum, f) => sum + (f.areaAcres || 0), 0);
  const pendingReports = diagnoses.filter((d) => d.status === "PENDING").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-agri-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-slate-500">Loading your farms and reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600 font-semibold">Error loading dashboard</p>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <WelcomeBanner />
      <FarmSummaryCards
        totalFarms={uiFarms.length}
        healthyPercentage={uiFarms.length > 0 ? Math.round((uiFarms.filter((f) => f.crop.health === "HEALTHY").length / uiFarms.length) * 100) : 100}
        activeAlertsCount={pendingReports}
        recentDiagnosesCount={diagnoses.length}
        totalAcres={totalAcres}
        totalCrops={totalCrops}
      />
      <QuickActions />
      <CropHealthOverview farms={uiFarms} />
      <RecentDiagnosesSection diagnoses={diagnoses} />
    </div>
  );
};
