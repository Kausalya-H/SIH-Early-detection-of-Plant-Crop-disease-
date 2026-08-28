import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Sun, CloudRain, Droplets, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agri-800 via-agri-700 to-agri-900 p-6 sm:p-8 text-white shadow-xl shadow-agri-950/15">
      {/* Background ambient lighting */}
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-agri-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-20 h-48 w-48 rounded-full bg-earth-500/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-agri-600/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-agri-100 backdrop-blur-md border border-agri-400/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>AI-Assisted Field Protection Grid</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {t.dashboard.greeting}, {user?.name.split(' ')[0] || 'Farmer'}! 👋
          </h1>

          <p className="text-sm sm:text-base text-agri-100 leading-relaxed font-medium">
            {t.dashboard.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-agri-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-300 shrink-0" />
              <span>{user?.village}, {user?.taluka}, {user?.district}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-300 shrink-0" />
              <span>28°C • Partly Sunny</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-sky-300 shrink-0" />
              <span>72% Humidity</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Link
            to="/farmer/disease-detection"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-agri-900 shadow-md hover:bg-stone-50 active:scale-98 transition-all"
          >
            <Sparkles className="h-4 w-4 text-agri-700" />
            <span>Diagnose Crop Now</span>
          </Link>

          <Link
            to="/farmer/farms"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-agri-600/70 border border-agri-400/40 px-5 py-3 text-sm font-bold text-white hover:bg-agri-600 active:scale-98 transition-all"
          >
            <span>Manage 4 Plots</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
