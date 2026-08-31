import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { officerDataService, RiskZoneData } from '../services/officerDataService';
import { ShieldCheck, MapPin, LogOut, Search, Sparkles, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

export const OfficerPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const [filterQuery, setFilterQuery] = useState('');
  const [riskZones, setRiskZones] = useState<RiskZoneData[]>([]);
  const [riskSummary, setRiskSummary] = useState<{ criticalCount: number; highCount: number; moderateCount: number; lowCount: number } | null>(null);
  const [isLoadingRisk, setIsLoadingRisk] = useState(true);
  const [realOutbreaks, setRealOutbreaks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingRisk(true);
      try {
        const data = await officerDataService.getRiskZones();
        if (data) {
          setRiskZones(data.zones);
          setRiskSummary({ criticalCount: data.criticalCount, highCount: data.highCount, moderateCount: data.moderateCount, lowCount: data.lowCount });
        }
      } catch (err) { console.error(err); } finally { setIsLoadingRisk(false); }
      // Fetch real disease reports from MongoDB
      try {
        const token = localStorage.getItem('krishirakshak_token') || '';
        const res = await fetch('/reports', { headers: { 'Authorization': 'Bearer ' + token } });
        const reports = await res.json();
        if (Array.isArray(reports)) {
          // Group by disease and location to create outbreaks
          const outbreakMap: Record<string, any> = {};
          reports.forEach((r: any) => {
            const key = `${r.cropName || r.crop || 'Unknown'}-${r.disease || 'Unknown'}`;
            if (!outbreakMap[key]) {
              outbreakMap[key] = {
                id: 'OB-' + (r.id || r._id || '').slice(-6),
                crop: r.cropName || r.crop || 'Unknown',
                disease: r.disease || 'Unknown',
                location: r.location || 'Unknown',
                severity: r.overallSeverity || r.severity || 'MODERATE',
                status: r.status === 'confirmed' ? 'AFFECTED' : 'WATCH',
                farmsAffected: 1,
                acreage: 0,
                containmentProgress: 50,
              };
            } else {
              outbreakMap[key].farmsAffected += 1;
            }
          });
          setRealOutbreaks(Object.values(outbreakMap));
        }
      } catch (err) { console.error('Failed to fetch reports:', err); }
    };
    fetchData();
  }, []);

  const handleLogout = () => { if (window.confirm('Log out?')) { logout(); navigate('/'); } };

  const outbreaks = realOutbreaks.length > 0 ? realOutbreaks : [
    { id: 'OB-001', crop: 'No data yet', disease: 'Register farmers and run scans to populate this section', location: '-', severity: 'LOW', status: 'HEALTHY', farmsAffected: 0, acreage: 0, containmentProgress: 0 },
  ];

  const filtered = outbreaks.filter((o) => o.crop.toLowerCase().includes(filterQuery.toLowerCase()) || o.disease.toLowerCase().includes(filterQuery.toLowerCase()));

  const displayZones = riskZones.length > 0
    ? riskZones.map((z) => ({ name: z.name.split(',')[0], district: z.name.split(',')[1]?.trim() || '', state: z.name.split(',')[2]?.trim() || '', risk: z.diseaseRiskIndex, score: z.diseaseRiskScore, reason: z.diseaseRiskReason, temp: z.weather?.temperatureC, humidity: z.weather?.humidityPercent, wind: z.weather?.windSpeedKmh }))
    : [{ name: 'No risk zones yet', district: 'Run disease scans to generate risk data', state: '', risk: 'LOW' as const, score: 0, reason: 'No data', temp: 0, humidity: 0, wind: 0 }];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center"><ShieldCheck className="h-6 w-6 text-blue-200" /></div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Officer Command Center</span>
            <h1 className="text-sm font-extrabold text-white">KrishiRakshak AI</h1>
          </div>
        </div>
        <button onClick={handleLogout} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-rose-300 flex items-center gap-1.5"><LogOut className="h-3.5 w-3.5" />Log Out</button>
      </header>
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1">
        <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-6 text-white shadow-xl border border-blue-900/40">
          <h2 className="text-xl sm:text-2xl font-black">Regional Crop Health Surveillance</h2>
          <p className="text-xs sm:text-sm text-slate-300">Real-time weather-based disease risk from Open-Meteo data.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 bg-white border border-stone-200 space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Holdings</span><span className="text-2xl font-extrabold text-slate-900">10,140</span></div>
          <div className="card p-5 bg-white border border-rose-200 bg-rose-50/20 space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-rose-800">Outbreaks</span><span className="text-2xl font-extrabold text-rose-900">4</span></div>
          <div className="card p-5 bg-white border border-amber-200 bg-amber-50/20 space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-amber-800">High-Risk Zones</span><span className="text-2xl font-extrabold text-amber-900">{riskSummary ? riskSummary.criticalCount + riskSummary.highCount : 3}</span></div>
          <div className="card p-5 bg-white border border-blue-200 space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-blue-800">Broadcasts</span><span className="text-2xl font-extrabold text-blue-900">3,420</span></div>
        </div>
        <div className="card p-6 bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2"><CloudRain className="h-5 w-5 text-blue-600" />Live Weather Disease Risk</h3>
            {isLoadingRisk && <span className="text-xs text-blue-600 animate-pulse">Loading...</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayZones.map((zone, idx) => (
              <div key={idx} className={`p-4 rounded-xl border-2 ${zone.risk === 'CRITICAL' ? 'border-rose-300 bg-rose-50/50' : zone.risk === 'HIGH' ? 'border-amber-300 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/30'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div><h4 className="text-sm font-bold text-slate-900">{zone.name}</h4><p className="text-[11px] text-slate-500">{zone.district}, {zone.state}</p></div>
                  <RiskBadge level={zone.risk} size="sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className="flex items-center gap-1.5 bg-white/80 rounded-lg px-2 py-1.5 border border-stone-200/60"><Thermometer className="h-3 w-3 text-orange-500" /><span className="font-semibold text-slate-700">{zone.temp}C</span></div>
                  <div className="flex items-center gap-1.5 bg-white/80 rounded-lg px-2 py-1.5 border border-stone-200/60"><Droplets className="h-3 w-3 text-blue-500" /><span className="font-semibold text-slate-700">{zone.humidity}%</span></div>
                  <div className="flex items-center gap-1.5 bg-white/80 rounded-lg px-2 py-1.5 border border-stone-200/60"><Wind className="h-3 w-3 text-cyan-500" /><span className="font-semibold text-slate-700">{zone.wind} km/h</span></div>
                  <div className="flex items-center gap-1.5 bg-white/80 rounded-lg px-2 py-1.5 border border-stone-200/60"><Sparkles className="h-3 w-3 text-purple-500" /><span className="font-semibold text-slate-700">Score: {zone.score}</span></div>
                </div>
                <p className="text-[11px] text-slate-600 bg-white/60 rounded-lg p-2 border border-stone-200/40">{zone.reason}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6 bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-slate-900">Outbreak Log</h3>
            <div className="relative w-full sm:w-72"><Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" /><input type="text" value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} placeholder="Filter..." className="input-field pl-9 text-xs py-2" /></div>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
              <tr><th className="py-3 px-4">Code</th><th className="py-3 px-4">Location</th><th className="py-3 px-4">Crop</th><th className="py-3 px-4">Risk</th><th className="py-3 px-4">Farms</th><th className="py-3 px-4">Containment</th><th className="py-3 px-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((ob) => (
                <tr key={ob.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{ob.id}</td>
                  <td className="py-3 px-4 text-slate-700">{ob.location}</td>
                  <td className="py-3 px-4"><strong className="block text-slate-900">{ob.crop}</strong><span className="text-slate-500 text-[11px]">{ob.disease}</span></td>
                  <td className="py-3 px-4"><RiskBadge level={ob.severity} size="sm" /></td>
                  <td className="py-3 px-4 text-slate-700"><strong>{ob.farmsAffected}</strong> ({ob.acreage} ac)</td>
                  <td className="py-3 px-4"><div className="w-24 space-y-1"><span className="text-[11px] font-bold text-slate-700">{ob.containmentProgress}%</span><div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: ob.containmentProgress + '%' }} /></div></div></td>
                  <td className="py-3 px-4"><StatusBadge status={ob.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
export default OfficerPortalPage;
