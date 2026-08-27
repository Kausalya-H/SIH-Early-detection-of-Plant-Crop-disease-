import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { Bell, MapPin, Globe, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FarmerHeaderProps {
  unreadAlertsCount?: number;
}

export const FarmerHeader: React.FC<FarmerHeaderProps> = ({ unreadAlertsCount = 2 }) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-20 w-full items-center justify-between border-b border-stone-200/90 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Project Branding & Farmer Greeting */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/farmer/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 text-white shadow-md shadow-agri-600/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="hidden min-[450px]:block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-agri-700">
              SIH26131 • Farmer Portal
            </span>
            <span className="block text-sm sm:text-base font-bold text-slate-900 leading-tight">
              Early Detection of Crop Disease
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Location Pill, Language Switcher, Alerts & Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Location Badge (Desktop/Tablet) */}
        {user && (
          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-slate-700 border border-stone-200">
            <MapPin className="h-3.5 w-3.5 text-agri-600 shrink-0" />
            <span>{user.village}, {user.district}</span>
          </div>
        )}

        {/* Language Switcher Dropdown */}
        <div className="relative inline-flex items-center">
          <Globe className="absolute left-2.5 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Select portal language"
            className="rounded-xl border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-xs sm:text-sm font-medium text-slate-700 shadow-sm focus:border-agri-600 focus:outline-none focus:ring-1 focus:ring-agri-500 cursor-pointer max-w-[130px] sm:max-w-[160px] truncate"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Notification Alert Bell */}
        <Link
          to="/farmer/alerts"
          className="relative rounded-xl border border-stone-200 bg-white p-2 text-slate-600 hover:bg-stone-50 hover:text-slate-900 focus:outline-none transition-colors"
          aria-label={`${unreadAlertsCount} unread agricultural alerts`}
        >
          <Bell className="h-5 w-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </Link>

        {/* Farmer Profile Button */}
        <Link
          to="/farmer/profile"
          className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-1.5 sm:px-3 sm:py-1.5 text-slate-700 hover:bg-stone-100 hover:border-stone-300 transition-colors"
          aria-label="Farmer Profile"
        >
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-agri-700 text-white text-xs font-bold">
            {user?.name ? user.name.charAt(0) : <User className="h-4 w-4" />}
          </div>
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-medium text-slate-500 leading-none">
              {t.dashboard.greeting}
            </span>
            <span className="block text-sm font-semibold text-slate-900 truncate max-w-[120px]">
              {user?.name.split(' ')[0] || 'Farmer'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
