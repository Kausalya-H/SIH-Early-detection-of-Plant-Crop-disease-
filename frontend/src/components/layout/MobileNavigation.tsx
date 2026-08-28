import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  Camera,
  Bell,
  BookOpen,
  User,
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { t } = useLanguage();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-stone-200/90 bg-white/95 backdrop-blur-md pb-safe"
      aria-label="Mobile Navigation"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {/* Dashboard */}
        <NavLink
          to="/farmer/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-14 py-1 text-center transition-colors ${
              isActive ? 'text-agri-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          <span className="text-[10px] truncate max-w-full">{t.nav.dashboard}</span>
        </NavLink>

        {/* My Farms */}
        <NavLink
          to="/farmer/farms"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-14 py-1 text-center transition-colors ${
              isActive ? 'text-agri-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Sprout className="h-5 w-5 shrink-0" />
          <span className="text-[10px] truncate max-w-full">{t.nav.farms}</span>
        </NavLink>

        {/* Primary Action Center: Scan Crop Button */}
        <div className="relative -top-4 flex justify-center">
          <NavLink
            to="/farmer/scan"
            className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-agri-700 via-agri-600 to-agri-500 text-white shadow-lg shadow-agri-700/30 ring-4 ring-white active:scale-95 transition-transform"
            aria-label={t.nav.scanCrop}
          >
            <Camera className="h-6 w-6" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight">Scan</span>
          </NavLink>
        </div>

        {/* Alerts */}
        <NavLink
          to="/farmer/alerts"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-14 py-1 text-center transition-colors ${
              isActive ? 'text-agri-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Bell className="h-5 w-5 shrink-0" />
          <span className="text-[10px] truncate max-w-full">{t.nav.alerts}</span>
        </NavLink>

        {/* Advisory / Disease Info */}
        <NavLink
          to="/farmer/advisory"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-14 py-1 text-center transition-colors ${
              isActive ? 'text-agri-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <BookOpen className="h-5 w-5 shrink-0" />
          <span className="text-[10px] truncate max-w-full">Advisory</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/farmer/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-14 py-1 text-center transition-colors ${
              isActive ? 'text-agri-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <User className="h-5 w-5 shrink-0" />
          <span className="text-[10px] truncate max-w-full">{t.nav.profile}</span>
        </NavLink>
      </div>
    </nav>
  );
};
