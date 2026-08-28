import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Sprout, Bell, BarChart3, HelpCircle, FileSpreadsheet } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const QuickActions: React.FC = () => {
  const { t } = useLanguage();

  const actions = [
    {
      to: '/farmer/disease-detection',
      label: '🔬 Diagnose Crop',
      desc: 'Take photo or upload leaf for instant AI scan',
      color: 'bg-agri-700 text-white hover:bg-agri-800 border-agri-800',
    },
    {
      to: '/farmer/farms',
      label: '🌾 View My Farms',
      desc: 'Check crop stages, health & plot acreage',
      color: 'bg-white text-agri-800 hover:bg-agri-50 border-stone-300',
    },
    {
      to: '/farmer/alerts',
      label: '🔔 View Alerts',
      desc: '3 regional warnings for Solanaceous & Cotton',
      color: 'bg-white text-orange-700 hover:bg-orange-50 border-stone-300',
    },
    {
      to: '/farmer/analytics',
      label: '📊 Farm Analytics',
      desc: 'Productivity trends, disease rates & historical data',
      color: 'bg-white text-slate-700 hover:bg-stone-50 border-stone-300',
    },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t.dashboard.quickActions}</h2>
          <p className="text-xs text-slate-500">Instant shortcuts for essential farmer operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actions.map((act) => (
          <Link
            key={act.to}
            to={act.to}
            className={`flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 hover:shadow-card-hover group ${act.color}`}
          >
            <div>
              <span className="font-bold text-sm block group-hover:translate-x-0.5 transition-transform">
                {act.label}
              </span>
              <p className="text-xs opacity-80 mt-1 leading-relaxed">{act.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
