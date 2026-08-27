import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  FileSpreadsheet,
  Bell,
  BookOpen,
  User,
  PhoneCall,
  LogOut,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FarmerSidebarProps {
  onRequestOfficerSupport?: () => void;
}

export const FarmerSidebar: React.FC<FarmerSidebarProps> = ({ onRequestOfficerSupport }) => {
  const { t } = useLanguage();
  const { logout } = useAuth();

  const navItems = [
    { to: '/farmer/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/farmer/farms', label: t.nav.farms, icon: Sprout },
    { to: '/farmer/scan', label: t.nav.scanCrop, icon: ScanLine, highlight: true },
    { to: '/farmer/reports', label: t.nav.reports, icon: FileSpreadsheet },
    { to: '/farmer/alerts', label: t.nav.alerts, icon: Bell },
    { to: '/farmer/advisory', label: t.nav.advisory, icon: BookOpen },
    { to: '/farmer/profile', label: t.nav.profile, icon: User },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-stone-200 bg-white p-5">
      <div className="space-y-6">
        {/* Navigation links */}
        <nav className="space-y-1.5" aria-label="Farmer Portal Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    item.highlight && !isActive
                      ? 'bg-agri-50 text-agri-800 border border-agri-200 hover:bg-agri-100/80 shadow-xs'
                      : isActive
                      ? 'bg-agri-700 text-white shadow-md shadow-agri-700/20'
                      : 'text-slate-600 hover:bg-stone-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Officer Emergency Support Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-agri-100/60 p-4">
          <div className="flex items-center gap-2 text-agri-900 font-bold text-sm">
            <PhoneCall className="h-4 w-4 text-agri-700" />
            <span>KVK & Officer Help</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Need urgent expert guidance on disease spread or fertilizer dosing?
          </p>
          <button
            type="button"
            onClick={onRequestOfficerSupport}
            className="mt-3 w-full rounded-xl bg-agri-700 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-agri-800 transition-colors"
          >
            Request Officer Support
          </button>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="space-y-3 pt-4 border-t border-stone-100">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Info className="h-3.5 w-3.5 text-agri-600 shrink-0" />
          <span>Govt. SIH26131 Advisory Portal</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>{t.nav.logout}</span>
        </button>
      </div>
    </aside>
  );
};
