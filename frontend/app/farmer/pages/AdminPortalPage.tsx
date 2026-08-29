import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ShieldCheck,
  Cpu,
  Users,
  Activity,
  LogOut,
  Database,
  Lock,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
  HardDrive,
  Key,
} from 'lucide-react';

export const AdminPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from Central Admin?')) {
      logout();
      navigate('/');
    }
  };

  const aiModels = [
    {
      id: 'MOD-VIT-01',
      name: 'Vision Transformer (ViT-Base-Patch16)',
      version: 'v2.4.1-prod',
      accuracy: '98.4%',
      latency: '142ms',
      crops: 'Tomato, Chilli, Groundnut, Rice, Cotton',
      classes: 54,
      status: 'HEALTHY',
    },
    {
      id: 'MOD-YOLO-11',
      name: 'YOLOv11 Multi-Disease Spore Detector',
      version: 'v11.0.3-fastapi',
      accuracy: '96.2%',
      latency: '88ms',
      crops: 'Tomato, Chilli, Potato, Soybean',
      classes: 38,
      status: 'HEALTHY',
    },
    {
      id: 'MOD-RF-EPI',
      name: 'Epidemic Spread Vector Predictor',
      version: 'v1.8.0',
      accuracy: '93.7%',
      latency: '210ms',
      crops: 'All Major National Agro-Zones',
      classes: 12,
      status: 'WATCH',
    },
  ];

  const auditLogs = [
    {
      id: 'AUD-9041',
      timestamp: '2026-08-28 22:45:10 IST',
      actor: 'Priya Sharma',
      role: 'ADMIN',
      action: 'MODEL_RETRAIN_DEPLOY',
      description: 'Promoted YOLOv11 leaf classifier weights to production cluster',
      status: 'HEALTHY',
    },
    {
      id: 'AUD-9039',
      timestamp: '2026-08-28 20:12:44 IST',
      actor: 'Dr. Rajesh Deshmukh',
      role: 'OFFICER',
      action: 'EMERGENCY_BROADCAST',
      description: 'Dispatched 3,420 early blight warning SMS messages to Niphad block',
      status: 'HEALTHY',
    },
    {
      id: 'AUD-9038',
      timestamp: '2026-08-28 18:30:19 IST',
      actor: 'System Daemon',
      role: 'SYSTEM',
      action: 'GRID_HEALTH_CHECK',
      description: 'Routine FastAPI micro-service latency benchmark (100% healthy)',
      status: 'HEALTHY',
    },
    {
      id: 'AUD-9035',
      timestamp: '2026-08-28 14:05:00 IST',
      actor: 'Sunil Verma',
      role: 'ADMIN',
      action: 'RBAC_PROVISION',
      description: 'Approved DAO surveillance credentials for Nashik East District',
      status: 'HEALTHY',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center shadow-md">
            <Cpu className="h-6 w-6 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Central Administration & AI Governance
              </span>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-400/30">
                NIC Cloud Active
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight">
              KrishiRakshak AI — Vision Transformer Telemetry & Security Registry
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right text-xs">
            <span className="font-bold text-slate-200">{user?.name || 'Priya Sharma'}</span>
            <span className="text-[11px] text-purple-300">
              {user?.designation || 'Senior Agricultural AI Governance Lead'}
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
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-6 text-white shadow-xl border border-purple-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <HardDrive className="h-4 w-4" />
              <span>National Central AI Node, New Delhi (ICAR-NIC Cluster)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              AI Vision Model Fleet & Audit Governance Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Real-time deep neural inference telemetry, model drift tracking, RBAC security provisioning, and cryptographically verified audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-purple-900/40 border border-purple-700/50 rounded-2xl px-4 py-2 text-xs text-purple-200 shrink-0">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Inference Grid: <strong>99.9% Uptime</strong></span>
          </div>
        </div>

        {/* Admin KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Vision Model</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">ViT v2.4.1</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                98.4% Acc
              </span>
            </div>
            <span className="text-xs text-slate-500">142ms Avg Latency Benchmark</span>
          </div>

          <div className="card p-5 bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Officers</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">48 DAOs</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                28 States & UTs
              </span>
            </div>
            <span className="text-xs text-slate-500">Role-Based Access Verified</span>
          </div>

          <div className="card p-5 bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Inferences</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">23,410</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +12% volume
              </span>
            </div>
            <span className="text-xs text-slate-500">FastAPI Model Micro-service</span>
          </div>

          <div className="card p-5 bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Signed Audit Logs</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">1,842</span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                SHA-256 Valid
              </span>
            </div>
            <span className="text-xs text-slate-500">Immutable Compliance Trail</span>
          </div>
        </div>

        {/* AI Model Fleet Registry Table */}
        <div className="card p-6 bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Vision Model Fleet & Inference Performance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time accuracy, inference latency, and disease class coverage across deployed models
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
              3 Models Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Model Name</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Covered Crops & Classes</th>
                  <th className="py-3 px-4">Cluster Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {aiModels.map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <strong className="block text-slate-900">{m.name}</strong>
                      <span className="text-[11px] font-mono text-slate-400">{m.id}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{m.version}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{m.accuracy}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{m.latency}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <span>{m.crops}</span>
                      <span className="block text-[11px] text-slate-400">({m.classes} total classes)</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={m.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit & Compliance Stream Table */}
        <div className="card p-6 bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                System Audit & Security Compliance Stream
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographically recorded administrative operations, model updates, and advisory dispatches
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Audit Buffer: 1,842 Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action Code</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{log.actor}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <code className="rounded bg-purple-50 px-1.5 py-0.5 font-mono text-[11px] font-bold text-purple-900">
                        {log.action}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{log.description}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={log.status} size="sm" />
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

export default AdminPortalPage;
