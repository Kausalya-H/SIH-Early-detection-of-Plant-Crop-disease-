import React from 'react';
import { AdvisoryItem } from '../../types/advisory';
import { CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface AdvisoryCardProps {
  advisory: AdvisoryItem;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({ advisory }) => {
  const categoryLabels = {
    CROP_HEALTH: 'Crop Health & Nutrition',
    DISEASE_PREVENTION: 'Disease Prevention',
    PEST_MANAGEMENT: 'Integrated Pest Management',
    IRRIGATION: 'Water & Irrigation',
    GENERAL_CARE: 'General Agronomy Care',
  };

  return (
    <div className="card border-stone-200 hover:border-agri-300 transition-all space-y-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="rounded-lg bg-agri-100 px-2.5 py-0.5 text-xs font-bold text-agri-800">
            {categoryLabels[advisory.category] || advisory.category}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Crop: <strong>{advisory.crop}</strong>
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {advisory.title}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {advisory.shortSummary}
        </p>
      </div>

      {/* Key practices */}
      <div className="rounded-xl bg-stone-50 p-4 border border-stone-200/80 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Key Recommended Practices:
        </h4>
        <ul className="space-y-1.5">
          {advisory.keyPractices.map((practice, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-agri-600 shrink-0 mt-0.5" />
              <span>{practice}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warning note if available */}
      {advisory.warningNote && (
        <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <span>{advisory.warningNote}</span>
        </div>
      )}

      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Published {new Date(advisory.publishedDate).toLocaleDateString()}</span>
        </div>
        {advisory.season && <span className="font-medium text-slate-600">{advisory.season}</span>}
      </div>
    </div>
  );
};
