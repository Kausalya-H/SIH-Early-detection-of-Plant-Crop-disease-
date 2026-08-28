import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { alertService } from '../services/alertService';
import { CropAlert } from '../types/alert';
import { AlertTriangle, CloudRain, Bug, ShieldAlert, Check, Bell } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<CropAlert[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIGH' | 'WEATHER' | 'DISEASE'>('ALL');

  useEffect(() => {
    alertService.getAlerts().then(setAlerts);
  }, []);

  const handleMarkRead = async (id: string) => {
    await alertService.markAsRead(id);
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const filtered = alerts.filter((a) => {
    if (activeFilter === 'HIGH') return a.severity === 'HIGH' || a.severity === 'CRITICAL';
    if (activeFilter === 'WEATHER') return a.category === 'WEATHER_WARNING';
    if (activeFilter === 'DISEASE') return a.category === 'DISEASE_OUTBREAK';
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Crop Alerts & Outbreak Warnings"
        subtitle="Real-time notifications issued by regional agricultural officers and plant pathology stations"
        badge={
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800 border border-orange-300">
            {alerts.filter((a) => !a.isRead).length} Unread Alerts
          </span>
        }
      />

      {/* Filter Tabs */}
      <div className="card p-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeFilter === 'ALL'
              ? 'bg-agri-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-stone-100'
          }`}
        >
          All Alerts ({alerts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('HIGH')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeFilter === 'HIGH'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-stone-100'
          }`}
        >
          High Priority Only
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('DISEASE')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeFilter === 'DISEASE'
              ? 'bg-agri-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-stone-100'
          }`}
        >
          Disease Outbreaks
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('WEATHER')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeFilter === 'WEATHER'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-stone-100'
          }`}
        >
          Weather Risks
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`card p-6 transition-all ${
              !alert.isRead ? 'border-l-4 border-l-orange-500 bg-orange-50/20' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    alert.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {alert.severity} Priority
                  </span>
                  <span className="text-xs font-semibold text-slate-500">•</span>
                  <span className="text-xs font-semibold text-slate-700">{alert.category.replace('_', ' ')}</span>
                  <span className="text-xs text-slate-400">Valid: {alert.validUntil}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{alert.message}</p>

                <div className="rounded-xl bg-white p-3 border border-stone-200 text-xs text-slate-800 flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Advisory Action:</strong> {alert.actionRequired}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Impacted Crops: <strong>{alert.affectedCrops.join(', ')}</strong></span>
                  <span>District: <strong>{alert.district}</strong></span>
                  <span>Source: {alert.issuedBy}</span>
                </div>
              </div>

              {!alert.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(alert.id)}
                  className="rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 px-3 py-1.5 text-xs font-semibold transition-colors shrink-0"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
