import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Sprout, ScanLine, Bell, BarChart3, Settings } from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/farmer/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/farmer/farms', label: t.nav.myFarms, icon: Sprout },
    { to: '/farmer/disease-detection', label: 'Detect', icon: ScanLine, isCenterHero: true },
    { to: '/farmer/alerts', label: t.nav.alerts, icon: Bell },
    { to: '/farmer/analytics', label: t.nav.analytics, icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-stone-200 bg-white/95 px-2 backdrop-blur-md lg:hidden shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isCenterHero) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `-mt-5 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-agri-600 to-agri-800 p-3 text-white shadow-lg shadow-agri-800/30 transition-transform active:scale-95 ${
                  isActive ? 'ring-4 ring-agri-400' : ''
                }`
              }
            >
              <Icon className="h-6 w-6" />
              <span className="sr-only">Detect Disease</span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-agri-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-5 w-5 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
