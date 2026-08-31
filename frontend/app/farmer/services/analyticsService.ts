import { FarmAnalyticsData } from '../types/analytics';
import { apiRequest } from './apiClient';
import { ENDPOINTS } from './apiConfig';
import { farmService } from './farmService';
import { diagnosisService } from './diagnosisService';

export const analyticsService = {
  async getAnalytics(): Promise<FarmAnalyticsData> {
    // Try backend stats endpoint first
    try {
      const res = await apiRequest<any>(ENDPOINTS.REPORT_STATS);
      if (res.data) {
        return {
          totalFarms: res.data.totalFarms || 0,
          totalAcreage: res.data.totalAcreage || 0,
          overallHealthScore: res.data.healthyPercentage || 0,
          healthyCropsPercentage: res.data.healthyPercentage || 0,
          activeAlertsCount: 0,
          totalScansThisMonth: res.data.totalReports || 0,
          healthDistribution: [
            { status: 'Healthy Crops', percentage: res.data.healthyPercentage || 0, plotCount: 0, color: '#16a34a' },
            { status: 'Under Watch', percentage: 25, plotCount: 0, color: '#eab308' },
            { status: 'Active Disease Risk', percentage: res.data.highRiskReports || 0, plotCount: 0, color: '#ea580c' },
          ],
          monthlyTrends: [],
          topDiseases: [],
        };
      }
    } catch (e) {
      console.warn('Backend stats failed, computing from farms:', e);
    }

    // Fallback: compute from real farm data
    const farms = await farmService.getFarms();
    const diagnoses = await diagnosisService.getDiagnoses();
    const totalFarms = farms.length;
    const totalAcreage = farms.reduce((sum, f) => sum + (f.areaAcres || 0), 0);
    const totalScans = diagnoses.length;
    const healthyCount = diagnoses.filter(d => d.riskLevel === 'LOW').length;
    const healthyPct = totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 100;

    return {
      totalFarms,
      totalAcreage,
      overallHealthScore: healthyPct,
      healthyCropsPercentage: healthyPct,
      activeAlertsCount: 0,
      totalScansThisMonth: totalScans,
      healthDistribution: [
        { status: 'Healthy Crops', percentage: healthyPct, plotCount: 0, color: '#16a34a' },
        { status: 'Under Watch', percentage: 100 - healthyPct, plotCount: 0, color: '#eab308' },
      ],
      monthlyTrends: [],
      topDiseases: [],
    };
  },
};
