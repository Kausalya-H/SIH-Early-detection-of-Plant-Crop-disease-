import React from 'react';
import { CropAlert } from '../../types/alert';
import { AlertTriangle, CloudRain, Bug, ChevronRight, ShieldAlert, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface ActiveAlertsSectionProps {
  alerts: CropAlert[];
}

export const ActiveAlertsSection: React.FC<ActiveAlertsSectionProps> = ({ alerts }) => {
  const { t } = useLanguage();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'DISEASE_OUTBREAK':
        return <ShieldAlert className="h-5 w-5 text-rose-600" />;
      case 'PEST_SURGE':
        return <Bug className="h-5 w-5 text-orange-600" />;
      case 'WEATHER_WARNING':
        return <CloudRain className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.dashboard.activeAlertsTitle}</h2>
            <p className="text-xs text-slate-500">Government agricultural advisories & localized warnings</p>
          </div>
        </div>

        <Link
          to="/farmer/alerts"
          className="inline-flex items-center gap-1 text-xs font-bold text-agri-700 hover:text-agri-800"
        >
          <span>{t.dashboard.viewAll} ({alerts.length})</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl p-4 border transition-all ${
              alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                ? 'bg-rose-50/60 border-rose-200'
                : 'bg-amber-50/60 border-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{getCategoryIcon(alert.category)}</div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-stone-300 text-slate-700 w-fit">
                    {alert.severity} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>

                <div className="rounded-xl bg-white/90 p-2.5 border border-stone-200/80 text-xs text-slate-800 flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Action:</strong> {alert.actionRequired}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                  <span>Crops: <strong>{alert.affectedCrops.join(', ')}</strong></span>
                  <span>Issued: {alert.issuedBy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
