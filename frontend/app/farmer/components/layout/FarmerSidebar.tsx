import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Headphones,
  ExternalLink,
  Bot,
} from 'lucide-react';

interface FarmerSidebarProps {
  onRequestOfficerSupport?: () => void;
}

export const FarmerSidebar: React.FC<FarmerSidebarProps> = ({ onRequestOfficerSupport }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from the Farmer Portal?')) {
      logout();
      navigate('/');
    }
  };

  const navLinks = [
    {
      to: '/farmer/dashboard',
      label: t.nav.dashboard,
      icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
      badge: null,
    },
    {
      to: '/farmer/farms',
      label: t.nav.myFarms,
      icon: <Sprout className="h-5 w-5 shrink-0" />,
      badge: '4 Plots',
    },
    {
      to: '/farmer/disease-detection',
      label: t.nav.diseaseDetection,
      icon: <ScanLine className="h-5 w-5 shrink-0" />,
      badge: 'Vision AI',
      isHighlight: true,
    },
    {
      to: '/farmer/advisory',
      label: 'AI Crop Doctor',
      icon: <Bot className="h-5 w-5 shrink-0" />,
      badge: 'NLP AI',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      to: '/farmer/alerts',
      label: t.nav.alerts,
      icon: <Bell className="h-5 w-5 shrink-0" />,
      badge: '3 Active',
      badgeColor: 'bg-orange-500 text-white',
    },
    {
      to: '/farmer/analytics',
      label: t.nav.analytics,
      icon: <BarChart3 className="h-5 w-5 shrink-0" />,
      badge: '86% Health',
    },
    {
      to: '/farmer/settings',
      label: t.nav.settings,
      icon: <Settings className="h-5 w-5 shrink-0" />,
      badge: null,
    },
  ];

  return (
    <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-stone-200/90 bg-white p-5 shrink-0 min-h-[calc(100vh-5rem)]">
      <div className="space-y-6">
        {/* Farmer Portal Identity Card */}
        <div className="rounded-2xl bg-gradient-to-br from-agri-800 to-agri-950 p-4 text-white shadow-md shadow-agri-950/15">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agri-600/60 text-white border border-agri-400/30">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Kisan Portal</h2>
              <p className="text-[11px] text-agri-200">KrishiRakshak AI Grid</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-agri-700/60 flex items-center justify-between text-xs text-agri-100">
            <span className="truncate">{user?.name || 'Ramesh Patil'}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-agri-700 text-agri-200 font-mono">
              {user?.id || 'MH-413801'}
            </span>
          </div>
        </div>

        {/* Navigation Item Links */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Portal Navigation
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-agri-700 text-white shadow-xs'
                    : link.isHighlight
                    ? 'text-agri-800 bg-agri-50 hover:bg-agri-100/80 border border-agri-200'
                    : 'text-slate-600 hover:bg-stone-100 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span>{link.label}</span>
              </div>

              {link.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    link.badgeColor || 'bg-stone-100 text-slate-700'
                  }`}
                >
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* Logout Action Item */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left mt-2"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 shrink-0" />
              <span>{t.nav.logout}</span>
            </div>
            <span className="text-[10px] text-rose-400">Exit</span>
          </button>
        </nav>
      </div>

      {/* Bottom Officer / KVK Help Widget */}
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold">KVK Extension Help</p>
              <p className="text-[10px] text-slate-500">Toll-Free: 1800-180-1551</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestOfficerSupport}
            className="mt-3 w-full rounded-xl bg-white border border-stone-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-stone-100 active:bg-stone-200 transition-colors shadow-2xs"
          >
            Request Officer Assistance
          </button>
        </div>
      </div>
    </aside>
  );
};
