import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const QuickScanCTA: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agri-800 via-agri-700 to-agri-900 p-6 sm:p-8 text-white shadow-xl shadow-agri-900/10">
      {/* Decorative leaf/light accents */}
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-agri-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 right-24 h-48 w-48 rounded-full bg-earth-500/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-agri-600/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-agri-100 backdrop-blur-md border border-agri-400/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>AI-Assisted Crop Health Diagnostics</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {t.dashboard.scanCTA}
          </h2>

          <p className="text-sm sm:text-base text-agri-100/90 leading-relaxed">
            {t.dashboard.scanSubCTA}. Detect early signs of blight, spots, and pests before damage spreads across your plot.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            to="/farmer/scan"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-bold text-agri-900 shadow-lg hover:bg-stone-100 active:scale-[0.98] transition-all"
          >
            <Camera className="h-6 w-6 text-agri-700" />
            <span>Take Leaf Photo</span>
            <ArrowRight className="h-5 w-5 text-agri-700" />
          </Link>

          <Link
            to="/farmer/scan"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-agri-600/60 border border-agri-400/40 px-5 py-4 text-base font-semibold text-white hover:bg-agri-600/80 active:scale-[0.98] transition-all"
          >
            <Upload className="h-5 w-5 text-agri-100" />
            <span>Upload Image</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
