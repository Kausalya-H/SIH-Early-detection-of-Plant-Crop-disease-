import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { analyticsService } from '../services/analyticsService';
import { FarmAnalyticsData } from '../types/analytics';
import { BarChart3, ShieldCheck, PieChart } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<FarmAnalyticsData | null>(null);

  useEffect(() => {
    analyticsService.getAnalytics().then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farm Health & Disease Analytics"
        subtitle="Historical scan trends, disease recurrence rates, and overall agricultural risk telemetry"
        badge={
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
            {data.healthyCropsPercentage}% Overall Health
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card p-6 border-l-4 border-l-emerald-600 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Crop Health</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-emerald-700">{data.overallHealthScore}%</h3>
          </div>
          <p className="text-xs text-slate-500 mt-2">Based on {data.totalScansThisMonth} total scans</p>
        </div>

        <div className="card p-6 border-l-4 border-l-blue-600 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Diagnostic Scans</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-blue-700">{data.totalScansThisMonth}</h3>
            <span className="text-xs font-bold text-blue-600">Completed</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">{data.totalFarms} farms registered, {data.totalAcreage.toFixed(1)} acres total</p>
        </div>

        <div className="card p-6 border-l-4 border-l-orange-600 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Alerts</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-orange-700">{data.activeAlertsCount}</h3>
            <span className="text-xs font-bold text-orange-600">Pending</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">{data.activeAlertsCount > 0 ? 'Requires attention' : 'No active alerts'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Crop Health Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of registered acreage condition</p>
            </div>
            <PieChart className="h-5 w-5 text-slate-400" />
          </div>

          {data.healthDistribution.length > 0 ? (
            <div className="space-y-4">
              {data.healthDistribution.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.status}</span>
                    <span className="font-mono font-bold text-slate-700">{item.percentage}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: item.percentage + '%', backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No scan data yet. Run your first crop diagnosis to see health distribution.</p>
          )}
        </div>

        <div className="lg:col-span-6 card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly AI Scan Activity</h3>
              <p className="text-xs text-slate-500">Scan frequency and health outcomes</p>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>

          {data.monthlyTrends.length > 0 ? (
            <div className="grid grid-cols-5 gap-3 h-48 items-end pt-6 pb-2 border-b border-stone-100">
              {data.monthlyTrends.map((trend, i) => {
                const maxScans = Math.max(...data.monthlyTrends.map(t => t.scansCount), 1);
                const heightPercent = (trend.scansCount / maxScans) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono font-bold text-slate-700">{trend.scansCount}</span>
                    <div className="w-full rounded-t-xl bg-agri-600 group-hover:bg-agri-700 transition-all" style={{ height: heightPercent + '%' }} />
                    <span className="text-xs font-semibold text-slate-500">{trend.month}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No scan history yet. Data will appear here after your first diagnosis.</p>
          )}
        </div>
      </div>

      {data.topDiseases.length > 0 && (
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-stone-100 pb-3">Top Detected Pathologies</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Disease</th>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Count</th>
                  <th className="py-3 px-4">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.topDiseases.map((d, i) => (
                  <tr key={i} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{d.crop}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{d.count}</td>
                    <td className="py-3 px-4">
                      <span className={d.risk === "HIGH" ? "bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase" : "bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase"}>{d.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
