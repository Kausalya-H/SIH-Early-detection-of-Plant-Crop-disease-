import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  Badge,
} from '@/components/shared';
import { AnalyticsIcon, ActivityIcon, ShieldIcon } from '@/components/shared/ui/Icons';

export default function OfficerAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-emerald-900 text-white border border-emerald-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AnalyticsIcon className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold tracking-tight">
              Epidemiological Analytics & Historical Crop Intelligence
            </h2>
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed max-w-2xl">
            Spatio-temporal analysis of pathogen spread rates, crop loss prevention metrics, seasonal susceptibility indices, and multi-year disease cycle forecasting.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          Analytics Engine Active
        </Badge>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Containment Success"
          value="87.4%"
          subtitle="Past 90 Days"
          icon={<ShieldIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
          trend={{ value: '+4.1%', direction: 'up', label: 'YoY' }}
        />

        <StatCard
          title="Average Containment Time"
          value="6.2 Days"
          subtitle="From 1st Field Report"
          icon={<ActivityIcon className="w-5 h-5 text-blue-700" />}
          accentColor="blue"
          trend={{ value: '-1.4 days', direction: 'up', label: 'faster' }}
        />

        <StatCard
          title="Estimated Acreage Saved"
          value="4,820 Acres"
          subtitle="Early Intervention Yield"
          icon={<AnalyticsIcon className="w-5 h-5 text-emerald-700" />}
          accentColor="emerald"
          trend={{ value: '₹14.2 Cr', direction: 'neutral', label: 'value' }}
        />

        <StatCard
          title="Farmer Advisory Adherence"
          value="79.1%"
          subtitle="Spray protocol adoption"
          icon={<ActivityIcon className="w-5 h-5 text-amber-700" />}
          accentColor="amber"
        />
      </div>

      {/* Analytics Visualization Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[320px] flex flex-col">
          <CardHeader>
            <CardTitle>Disease Incidence vs. Relative Humidity</CardTitle>
            <CardDescription>Correlation matrix between monsoon moisture surges and fungal sporulation.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-b-lg border-t border-slate-100 text-center">
            <div className="p-3.5 rounded-full bg-emerald-100 text-emerald-800 mb-3">
              <AnalyticsIcon className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Time-Series Incidence Graph Foundation Ready</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              Chart components (Recharts / Chart.js) will bind to aggregate regional telemetry during the dashboard build phase.
            </p>
          </CardContent>
        </Card>

        <Card className="min-h-[320px] flex flex-col">
          <CardHeader>
            <CardTitle>Seasonal Outbreak Recurrence Projections</CardTitle>
            <CardDescription>Predictive modeling for Rabi & Kharif seasonal pathogen vulnerability.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-b-lg border-t border-slate-100 text-center">
            <div className="p-3.5 rounded-full bg-blue-100 text-blue-800 mb-3">
              <ActivityIcon className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Recurrence Predictive Model Ready</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              Historical outbreak datasets mapped across 5-year agro-climatic historical averages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
