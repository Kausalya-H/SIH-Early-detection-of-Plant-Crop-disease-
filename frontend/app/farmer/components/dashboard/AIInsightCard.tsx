import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AIInsightCard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="card border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-agri-50/60 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 text-white shadow-sm">
          <Sparkles className="h-6 w-6 text-amber-300" />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t.dashboard.aiInsightTitle}
            </h3>
            <span className="rounded-full bg-agri-100 px-2.5 py-0.5 text-[11px] font-bold text-agri-800 border border-agri-300">
              Predictive Agronomy
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            Based on current Western Maharashtra humidity trends (84%) and recent scans in Baramati block, solanaceous crops (Tomato & Chilli) are at an elevated risk of fungal leaf spot germination. Ensure bottom leaves do not touch wet soil.
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-agri-900 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-agri-700" /> Drip spacing check
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-agri-700" /> Airflow between rows
            </span>
          </div>

          {/* AI Decision Support Disclaimer Notice */}
          <div className="mt-3 rounded-xl bg-amber-50 p-3 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-normal">
              <strong>Notice:</strong> {t.dashboard.aiInsightDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
