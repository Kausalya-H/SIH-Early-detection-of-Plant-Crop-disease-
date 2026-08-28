export interface CropHealthStat {
  status: string;
  percentage: number;
  plotCount: number;
  color: string;
}

export interface MonthlyDiseaseTrend {
  month: string;
  scansCount: number;
  diseasesDetected: number;
  healthyCount: number;
}

export interface FarmAnalyticsData {
  totalFarms: number;
  totalAcreage: number;
  overallHealthScore: number;
  healthyCropsPercentage: number;
  activeAlertsCount: number;
  totalScansThisMonth: number;
  healthDistribution: CropHealthStat[];
  monthlyTrends: MonthlyDiseaseTrend[];
  topDiseases: { name: string; crop: string; count: number; risk: string }[];
}
