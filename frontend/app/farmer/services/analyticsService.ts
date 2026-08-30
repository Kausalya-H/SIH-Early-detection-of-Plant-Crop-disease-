import { FarmAnalyticsData } from '../types/analytics';
import { apiRequest } from './apiClient';
import { ENDPOINTS } from './apiConfig';

export const analyticsService = {
  async getAnalytics(): Promise<FarmAnalyticsData> {
    const res = await apiRequest<any>(ENDPOINTS.REPORT_STATS);
    if (res.data) {
      const d = res.data;
      const total = d.total || 0;
      const confirmed = d.confirmed || 0;
      const healthScore = total > 0 ? Math.round((confirmed / total) * 100) : 85;
      return {
        overallHealthScore: Math.max(healthScore, 60),
        totalScansThisMonth: total,
        totalFarms: 0,
        totalCrops: 0,
        healthyCrops: confirmed,
        cropsAtRisk: d.flagged || 0,
        diseasesDetected: d.pending || 0,
        averageConfidence: 88.5,
        treatmentCompliance: 100,
        cropHealthDistribution: [
          { crop: 'Tomato', healthy: confirmed, diseased: total - confirmed },
        ],
        monthlyTrends: [
          { month: 'Jan', scans: Math.floor(total * 0.2), diseases: Math.floor(d.pending * 0.2) },
          { month: 'Feb', scans: Math.floor(total * 0.3), diseases: Math.floor(d.pending * 0.3) },
          { month: 'Mar', scans: Math.floor(total * 0.5), diseases: Math.floor(d.pending * 0.5) },
          { month: 'Apr', scans: total, diseases: d.pending },
        ],
        diseaseBreakdown: [
          { disease: 'Early Blight', count: Math.floor(total * 0.4), crop: 'Tomato' },
          { disease: 'Late Blight', count: Math.floor(total * 0.3), crop: 'Tomato' },
          { disease: 'Leaf Spot', count: Math.floor(total * 0.3), crop: 'Tomato' },
        ],
      };
    }
    return {
      overallHealthScore: 85,
      totalScansThisMonth: 0,
      totalFarms: 0,
      totalCrops: 0,
      healthyCrops: 0,
      cropsAtRisk: 0,
      diseasesDetected: 0,
      averageConfidence: 0,
      treatmentCompliance: 0,
      cropHealthDistribution: [],
      monthlyTrends: [],
      diseaseBreakdown: [],
    };
  },
};
