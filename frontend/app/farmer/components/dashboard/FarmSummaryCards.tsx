import React from 'react';
import { StatCard } from '../common/StatCard';
import { Sprout, ShieldCheck, AlertTriangle, Microscope } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FarmSummaryCardsProps {
  totalFarms?: number;
  healthyPercentage?: number;
  activeAlertsCount?: number;
  recentDiagnosesCount?: number;
  totalAcres?: number;
  totalCrops?: number;
}

export const FarmSummaryCards: React.FC<FarmSummaryCardsProps> = ({
  totalFarms = 0,
  healthyPercentage = 100,
  activeAlertsCount = 0,
  recentDiagnosesCount = 0,
  totalAcres = 0,
  totalCrops = 0,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. My Farms */}
      <StatCard
        title={t.dashboard.myFarms}
        value={totalFarms}
        icon={<Sprout className="h-6 w-6 text-agri-700" />}
        subtitle={totalAcres > 0 ? totalAcres.toFixed(1) + ' Total Acres' : 'No farms registered'}
        trend={totalCrops > 0 ? { value: totalCrops + ' Crops Planted', isPositive: true } : { value: 'Register your first farm', isPositive: true }}
        colorScheme="green"
      />

      {/* 2. Healthy Crops */}
      <StatCard
        title={t.dashboard.healthyCrops}
        value={healthyPercentage + '%'}
        icon={<ShieldCheck className="h-6 w-6 text-emerald-700" />}
        subtitle={totalFarms > 0 ? Math.round((healthyPercentage / 100) * totalFarms) + ' Plots Optimal' : 'No data yet'}
        trend={healthyPercentage >= 80 ? { value: 'Good health status', isPositive: true } : { value: 'Needs attention', isPositive: false }}
        colorScheme="emerald"
      />

      {/* 3. Active Alerts */}
      <StatCard
        title={t.dashboard.activeAlerts}
        value={activeAlertsCount}
        icon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
        subtitle={activeAlertsCount > 0 ? activeAlertsCount + ' Reports pending review' : 'No active alerts'}
        trend={activeAlertsCount > 0 ? { value: 'Action Required', isPositive: false } : { value: 'All clear', isPositive: true }}
        colorScheme="orange"
      />

      {/* 4. Recent Diagnoses */}
      <StatCard
        title={t.dashboard.recentDiagnoses}
        value={recentDiagnosesCount}
        icon={<Microscope className="h-6 w-6 text-blue-700" />}
        subtitle="Latest 48 hrs"
        trend={recentDiagnosesCount > 0 ? { value: recentDiagnosesCount + ' scans completed', isPositive: true } : { value: 'No scans yet', isPositive: true }}
        colorScheme="blue"
      />
    </div>
  );
};
