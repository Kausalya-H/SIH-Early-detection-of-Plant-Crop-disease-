import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ShieldCheck,
  MapPin,
  AlertTriangle,
  Users,
  Activity,
  LogOut,
  Radio,
  Layers,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const OfficerPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'outbreaks' | 'zones'>('overview');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from Officer Command?')) {
      logout();
      navigate('/');
    }
  };

  const outbreaks = [
    {
      id: 'OB-2026-084',
      crop: 'Tomato',
      disease: 'Early Blight (Alternaria solani)',
      location: 'Pimpalgaon Baswant, Nashik',
      severity: 'CRITICAL',
      status: 'AFFECTED',
      farmsAffected: 42,
      acreage: 185,
      containmentProgress: 45,
      date: '2026-08-28',
    },
    {
      id: 'OB-2026-081',
      crop: 'Chilli',
      disease: 'Bacterial Leaf Spot (Xanthomonas)',
      location: 'Niphad Block, Nashik',
      severity: 'HIGH',
      status: 'WATCH',
      farmsAffected: 28,
      acreage: 94,
      containmentProgress: 70,
      date: '2026-08-26',
    },
    {
      id: 'OB-2026-079',
      crop: 'Groundnut',
      disease: 'Early Leaf Spot (Cercospora)',
      location: 'Malegaon Khurd, Baramati',
      severity: 'MODERATE',
      status: 'HEALTHY',
      farmsAffected: 14,
      acreage: 52,
      containmentProgress: 90,
      date: '2026-08-24',
    },
    {
      id: 'OB-2026-075',
      crop: 'Rice',
      disease: 'Bacterial Panicle Blight',
      location: 'Haveli, Pune',
      severity: 'MODERATE',
      status: 'WATCH',
      farmsAffected: 19,
      acreage: 68,
      containmentProgress: 60,
      date: '2026-08-22',
    },
  ];

  const riskZones = [
    {
      name: 'Niphad Agro-Zone',
      district: 'Nashik',
      state: 'Maharashtra',
      risk: 'CRITICAL',
      crops: ['Tomato', 'Grapes', 'Onion'],
      farms: 3420,
      activeClusters: 2,
    },
    {
      name: 'Baramati Basin',
      district: 'Pune',
      state: 'Maharashtra',
      risk: 'MODERATE',
      crops: ['Sugarcane', 'Groundnut', 'Chilli'],
      farms: 2890,
      activeClusters: 1,
    },
    {
      name: 'Ludhiana Central',
      district: 'Ludhiana',
      state: 'Punjab',
      risk: 'HIGH',
      crops: ['Wheat', 'Paddy', 'Cotton'],
      farms: 4120,
      activeClusters: 1,
    },
  ];

  const filteredOutbreaks = outbreaks.filter(
    (o) =>
      o.crop.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.disease.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.location.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Officer Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="h-6 w-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Officer Command Center
              </span>
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                Surveillance Grid Active
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight">
              KrishiRakshak AI — Phytopathological Epidemic Control
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right text-xs">
            <span className="font-bold text-slate-200">{user?.name || 'Dr. Rajesh Deshmukh'}</span>
            <span className="text-[11px] text-blue-300">
              {user?.designation || 'District Agriculture Officer (DAO)'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-950/60 hover:border-rose-700 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Scope Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-6 text-white shadow-xl border border-blue-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <MapPin className="h-4 w-4" />
              <span>{user?.jurisdiction || 'Pune Division & Baramati Sub-Division, Maharashtra'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Regional Crop Health & Outbreak Surveillance Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Real-time epidemiological risk mapping, bio-security quarantine perimeter management, and direct emergency advisory broadcast.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 rounded-2xl px-4 py-2 text-xs text-blue-200 shrink-0">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>FastAPI Grid Status: <strong>Synced</strong></span>
          </div>
        </div>

        {/* Command Center StatCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monitored Holdings</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">10,140</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +42 this week
              </span>
            </div>
            <span className="text-xs text-slate-500">28,400 Total Monitored Acres</span>
          </div>

          <div className="card p-5 bg-white border border-rose-200 bg-rose-50/20 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Active Outbreak Clusters</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-rose-900">4 Clusters</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                1 Critical
              </span>
            </div>
            <span className="text-xs text-slate-500">Niphad • Malegaon • Haveli</span>
          </div>

          <div className="card p-5 bg-white border border-amber-200 bg-amber-50/20 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">High-Risk Agro-Zones</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-amber-900">3 Zones</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                Watch Active
              </span>
            </div>
            <span className="text-xs text-slate-500">Weather trigger: 84% Humidity</span>
          </div>

          <div className="card p-5 bg-white border border-blue-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Broadcast Advisories</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-blue-900">3,420 Sent</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                99.4% Delivery
              </span>
            </div>
            <span className="text-xs text-slate-500">SMS & WhatsApp Channels</span>
          </div>
        </div>

        {/* 2-Column Section: Critical Incident & Spore Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Incident Panel */}
          <div className="card p-6 bg-white border-2 border-rose-300 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                  Emergency Containment Alert • OB-2026-084
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Tomato Early Blight Spore Surge (Niphad Block)
                </h3>
              </div>
              <RiskBadge level="CRITICAL" size="md" />
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">
                Aggressive Alternaria solani spore dispersion observed across 42 tomato plots in Pimpalgaon Baswant following 3 days of high relative humidity (&gt;82%) and moderate 26°C canopy temperatures.
              </p>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-medium space-y-1">
                <strong className="block text-amber-900 font-bold">Officer Containment Directive:</strong>
                <span>
                  Deploy mobile spray squads with Chlorothalonil 75% WP @ 2g/L across a 5km buffer perimeter. Trigger automated voice SMS advisory to 3,420 registered farmers.
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Containment Perimeter Progress</span>
                  <span className="text-rose-700 font-bold">45% Completed</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-600 w-[45%]" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Spore Dispersion Forecast */}
          <div className="card p-6 bg-white border-2 border-indigo-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                  Neural Predictive Spore Trajectory
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  48-Hour Micro-Climate Pathogen Vector
                </h3>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-300">
                94.8% Confidence
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Vector Direction</span>
                  <span className="font-bold text-slate-900 text-sm">North-East (14 km/h)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Infection Probability</span>
                  <span className="font-bold text-rose-700 text-sm">78% High Risk</span>
                </div>
              </div>

              <p className="leading-relaxed">
                IMD radar indicates wind shift toward Dindori sub-district. Neighboring chilli and tomato cultivators should be notified immediately for preventive biocontrol.
              </p>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <strong className="block text-emerald-900 font-bold">Recommended Preventative Action:</strong>
                <span>
                  Advise preventative Trichoderma viride seed/soil enrichment and prophylactic copper oxychloride applications.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Surveillance Outbreak Log Table */}
        <div className="card p-6 bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Active Outbreak Surveillance Incident Log
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-district field inspection reports and farmer diagnosis escalation feed
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by crop, disease or block..."
                className="input-field pl-9 text-xs py-2"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Incident Code</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Crop & Disease</th>
                  <th className="py-3 px-4">Risk Severity</th>
                  <th className="py-3 px-4">Affected Scale</th>
                  <th className="py-3 px-4">Containment</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOutbreaks.map((ob) => (
                  <tr key={ob.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{ob.id}</td>
                    <td className="py-3 px-4 text-slate-700">{ob.location}</td>
                    <td className="py-3 px-4">
                      <strong className="block text-slate-900">{ob.crop}</strong>
                      <span className="text-slate-500 text-[11px]">{ob.disease}</span>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={ob.severity} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <strong>{ob.farmsAffected} Farms</strong> ({ob.acreage} ac)
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 space-y-1">
                        <span className="text-[11px] font-bold text-slate-700">{ob.containmentProgress}%</span>
                        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${ob.containmentProgress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ob.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerPortalPage;
