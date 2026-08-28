import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { analyticsService } from '../services/analyticsService';
import { FarmAnalyticsData } from '../types/analytics';
import { BarChart3, TrendingUp, ShieldCheck, Activity, AlertTriangle, PieChart } from 'lucide-react';

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
            86% Overall Plot Health Index
          </span>
        }
      />

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card p-6 border-l-4 border-l-emerald-600 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Crop Health</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-emerald-700">{data.overallHealthScore}%</h3>
            <span className="text-xs font-bold text-emerald-600">+4% this quarter</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">3 of 4 plots in optimal vegetative/fruiting state</p>
        </div>

        <div className="card p-6 border-l-4 border-l-blue-600 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Diagnostic Scans</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-blue-700">{data.totalScansThisMonth}</h3>
            <span className="text-xs font-bold text-blue-600">Completed this month</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Average AI neural confidence score of 94.8%</p>
        </div>

        <div className="card p-6 border-l-4 border-l-orange-600 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Containment Action Rate</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-orange-700">100%</h3>
            <span className="text-xs font-bold text-emerald-600">3 of 3 treated</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Early leaf curl & blight addressed within 24h</p>
        </div>
      </div>

      {/* Health Distribution & Monthly Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Crop Health Distribution */}
        <div className="lg:col-span-6 card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Crop Health Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of registered acreage condition</p>
            </div>
            <PieChart className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {data.healthDistribution.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.status} ({item.plotCount} plots)</span>
                  <span className="font-mono font-bold text-slate-700">{item.percentage}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-slate-600 leading-relaxed">
            💡 <strong>Agronomic Insight:</strong> Tomato plot early blight was contained before entering second vegetative cluster. Chilli plot thrips suppression is 40% improved.
          </div>
        </div>

        {/* Monthly Scan & Diagnosis Frequency */}
        <div className="lg:col-span-6 card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly AI Scan Activity</h3>
              <p className="text-xs text-slate-500">Scan frequency and health outcomes (Apr - Aug)</p>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-5 gap-3 h-48 items-end pt-6 pb-2 border-b border-stone-100">
            {data.monthlyTrends.map((trend, i) => {
              const maxScans = 25;
              const heightPercent = (trend.scansCount / maxScans) * 100;
              return (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-700">{trend.scansCount}</span>
                  <div
                    className="w-full rounded-t-xl bg-agri-600 group-hover:bg-agri-700 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-500">{trend.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total scans: <strong>{data.monthlyTrends.reduce((a, b) => a + b.scansCount, 0)}</strong></span>
            <span>Diseases resolved: <strong>13 cases</strong></span>
          </div>
        </div>
      </div>

      {/* Top Recorded Pathologies Table */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-stone-100 pb-3">
          Top Detected Crop Pathologies & Severity Ranking
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Disease / Pest Name</th>
                <th className="py-3 px-4">Impacted Crop</th>
                <th className="py-3 px-4">Total Occurrences</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4 text-right">Containment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.topDiseases.map((d, i) => (
                <tr key={i} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                  <td className="py-3 px-4 font-medium text-slate-700">{d.crop}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">{d.count} Scans</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      d.risk === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">Controlled</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
