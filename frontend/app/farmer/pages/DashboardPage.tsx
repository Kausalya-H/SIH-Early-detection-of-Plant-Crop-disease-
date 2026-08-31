import React, { useEffect, useState } from 'react';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { FarmSummaryCards } from '../components/dashboard/FarmSummaryCards';
import { CropHealthOverview } from '../components/dashboard/CropHealthOverview';
import { ActiveAlertsSection } from '../components/dashboard/ActiveAlertsSection';
import { RecentDiagnosesSection } from '../components/dashboard/RecentDiagnosesSection';
import { QuickActions } from '../components/dashboard/QuickActions';
import { farmService } from '../services/farmService';
import { diagnosisService } from '../services/diagnosisService';
import { alertService } from '../services/alertService';
import { analyticsService } from '../services/analyticsService';
import { Farm } from '../types/farmer';
import { DiagnosisRecord } from '../types/disease';
import { CropAlert } from '../types/alert';
import { FarmAnalyticsData } from '../types/analytics';

export const DashboardPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [alerts, setAlerts] = useState<CropAlert[]>([]);
  const [analytics, setAnalytics] = useState<FarmAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      const [fRes, dRes, aRes, anRes] = await Promise.allSettled([
        farmService.getFarms(),
        diagnosisService.getDiagnoses(),
        alertService.getAlerts(),
        analyticsService.getAnalytics(),
      ]);
      if (fRes.status === 'fulfilled') setFarms(fRes.value);
      if (dRes.status === 'fulfilled') setDiagnoses(dRes.value);
      if (aRes.status === 'fulfilled') setAlerts(aRes.value);
      if (anRes.status === 'fulfilled') setAnalytics(anRes.value);
      setIsLoading(false);
    };
    loadAll();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <WelcomeBanner />
      <FarmSummaryCards
        totalFarms={farms.length}
        healthyPercentage={analytics?.healthyCropsPercentage || 0}
        activeAlertsCount={alerts.length}
        recentDiagnosesCount={diagnoses.length}
      />
      <QuickActions />
      <CropHealthOverview farms={farms} />
      <ActiveAlertsSection alerts={alerts} />
      <RecentDiagnosesSection diagnoses={diagnoses} />
    </div>
  );
};
