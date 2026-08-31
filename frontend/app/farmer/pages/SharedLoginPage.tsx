import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { authService } from '../services/authService';
import { farmService } from '../services/farmService';
const ALL_CROPS = ['Tomato','Apple','Blueberry','Cherry','Corn','Grape','Orange','Peach','Pepper','Potato','Raspberry','Soybean','Strawberry'];

import { ShieldCheck, ArrowRight, Globe, Sprout, CheckCircle2, Cpu, UserCheck, LogOut, Sparkles, UserPlus, LogIn, MapPin, Home } from 'lucide-react';

export const SharedLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, login, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [regStep, setRegStep] = useState(1);
  const [loginEmail, setLoginEmail] = useState('test@farm.com');
  const [loginPassword, setLoginPassword] = useState('farmer123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPlaceName, setRegPlaceName] = useState('');
  const [regFarmName, setRegFarmName] = useState('');
  const [regFarmArea, setRegFarmArea] = useState('2.0');
  const [regCropName, setRegCropName] = useState('Tomato');
  const [regLat, setRegLat] = useState<number | null>(null);
  const [regLng, setRegLng] = useState<number | null>(null);
  const [regCropNames, setRegCropNames] = useState<string[]>(['Tomato']);
  const [officerId, setOfficerId] = useState('OFF-PUNE-7402');
  const [officerName, setOfficerName] = useState('Dr. Rajesh');
  const [officerPin, setOfficerPin] = useState('7402');
  const [adminId, setAdminId] = useState('ADMIN-01');
  const [adminName, setAdminName] = useState('Priya');
  const [adminKey, setAdminKey] = useState('admin2026');
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setIsLoading(true);
    const ok = await login('FARMER', { email: loginEmail, password: loginPassword });
    setIsLoading(false);
    if (ok) navigate('/farmer/dashboard'); else setError('Login failed.');
  };

  const handleReg1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regPhone) { setError('All fields are required'); return; }
    setError(''); setRegStep(2);
  };

  const handleReg2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPlaceName) { setError('Enter your village or place name'); return; }
    setError(''); setRegStep(3);
  };

  const handleReg3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFarmName) { setError('Enter your farm name'); return; }
    setError(''); setRegStep(4);
  };

  const handleReg4 = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setIsLoading(true);
    try {
      const r = await authService.registerFull({
        name: regName, email: regEmail, password: regPassword, phone: regPhone,
        placeName: regPlaceName, lat: regLat || undefined, lng: regLng || undefined,
        farmName: regFarmName, farmArea: parseFloat(regFarmArea) || 2.0,
        cropNames: regCropNames,
      });
      if (r.user && !r.error) {
        await login('FARMER', { email: regEmail, password: regPassword, name: regName });
        setIsLoading(false); navigate('/farmer/dashboard');
      } else { setError(r.error || 'Registration failed'); setIsLoading(false); }
    } catch (err: any) { setError(err.message || 'Failed'); setIsLoading(false); }
  };

  const toggleCrop = (crop: string) => {
    setRegCropNames(prev => prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]);
  };

  const handleDemo = async () => {
    setIsLoading(true);
    try {
      await authService.register({ name: 'Demo Farmer', email: 'demo@farm.com', password: 'demo123', phone: '999' });
      try { const f = await farmService.addFarm({ farmName: 'Demo Farm', area: 3.0, location: 'Baramati' }); if (f?.id) { await farmService.addCrop(f.id, { cropName: 'Tomato' }); await farmService.addCrop(f.id, { cropName: 'Chilli' }); await farmService.addCrop(f.id, { cropName: 'Groundnut' }); } } catch(e){}
    } catch(e){}
    await login('FARMER', { email: 'demo@farm.com', password: 'demo123', name: 'Demo' });
    setIsLoading(false); navigate('/farmer/dashboard');
  };

  const handleOfficer = async (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); await login('OFFICER', { officerId, name: officerName }); setIsLoading(false); navigate('/officer'); };
  const handleAdmin = async (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); await login('ADMIN', { adminId, name: adminName, password: adminKey }); setIsLoading(false); navigate('/admin'); };

  const R = [['FARMER','Farmer','bg-emerald-700 text-white','text-slate-600 hover:bg-stone-100'],['OFFICER','Officer','bg-blue-700 text-white','text-slate-600 hover:bg-stone-100'],['ADMIN','Admin','bg-slate-900 text-white','text-slate-600 hover:bg-stone-100']] as [UserRole,string,string,string][];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between font-sans">
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 sm:px-8 border-b border-slate-800 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2"><span className="font-bold text-white uppercase tracking-wider">Government of India</span><span className="text-emerald-400 font-semibold">SIH 2026</span></div>
        <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-emerald-400" /><select value={language} onChange={(e)=>setLanguage(e.target.value as Language)} className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-0.5">{SUPPORTED_LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.nativeName}</option>)}</select></div>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-6 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-agri-700 to-agri-950 text-white shadow-xl border-2 border-emerald-400/20"><ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-300" /></div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-agri-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-agri-800 border border-agri-300 mb-1.5"><Sparkles className="h-3.5 w-3.5" /><span>Unified Gateway</span></div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">KrishiRakshak AI</h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-1">AI-powered Crop Disease Detection & Advisory</p>
          </div>
        </div>
        {isAuthenticated && user && (
          <div className="card p-6 bg-white border-2 border-agri-500 shadow-lg text-center space-y-4 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs uppercase"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /><span>Active Session</span></div>
            <div><h2 className="text-lg font-bold text-slate-900">{user.name}</h2><p className="text-xs text-slate-500">Logged in as <strong>{user.role}</strong></p></div>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={()=>navigate(role==='FARMER'?'/farmer/dashboard':role==='OFFICER'?'/officer':'/admin')} className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md flex items-center gap-2"><span>Enter {role}</span><ArrowRight className="h-4 w-4" /></button>
              <button onClick={logout} className="rounded-xl border border-stone-300 bg-white py-2.5 px-4 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"><LogOut className="h-3.5 w-3.5" /><span>Logout</span></button>
            </div>
          </div>
        )}

        {(!isAuthenticated || !user) && (
          <div className="card p-6 sm:p-8 bg-white shadow-2xl border border-stone-200/80 max-w-xl mx-auto w-full space-y-5">
            <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              {R.map(([id,label,ac,ic])=>(
                <button key={id} onClick={()=>{setSelectedRole(id as UserRole);setAuthMode('login');setError('');setRegStep(1);}}
                  className={"flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all " + (selectedRole===id?ac:ic)}>
                  {id==='FARMER'?<Sprout className="h-5 w-5"/>:id==='OFFICER'?<UserCheck className="h-5 w-5"/>:<Cpu className="h-5 w-5"/>}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {error && <div className="rounded-xl bg-red-50 border border-red-300 p-3 text-xs text-red-800 font-medium">{error}</div>}

            {selectedRole==='FARMER' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <Sprout className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div><strong className="block font-bold">Farmer Portal</strong><span>AI leaf diagnosis, crop advisories, farm management.</span></div>
                </div>

                <div className="flex gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
                  <button onClick={()=>{setAuthMode('login');setError('');setRegStep(1);}} className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all " + (authMode==='login'?'bg-white shadow text-emerald-800':'text-slate-500 hover:text-slate-700')}><LogIn className="h-4 w-4"/><span>Login</span></button>
                  <button onClick={()=>{setAuthMode('register');setError('');setRegStep(1);}} className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all " + (authMode==='register'?'bg-white shadow text-emerald-800':'text-slate-500 hover:text-slate-700')}><UserPlus className="h-4 w-4"/><span>New Registration</span></button>
                </div>

                {authMode==='login' && (
                  <form onSubmit={handleLogin} className="space-y-3">
                    <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Email</label><input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} className="input-field" required /></div>
                    <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Password</label><input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className="input-field" required /></div>
                    <button type="submit" disabled={isLoading} className="btn-primary w-full"><span>{isLoading?"Logging in...":"Login to Kisan Portal"}</span><ArrowRight className="h-4 w-4" /></button>
                  </form>
                )}

                                {authMode==='register' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold text-emerald-700 uppercase">Step {regStep} of 4: {['','Personal Info','Location','Farm Details','Select Crops'][regStep]}</div>
                      <div className="flex gap-1">{[1,2,3,4].map(s=><div key={s} className={"h-1.5 w-6 rounded-full " + (s<=regStep?'bg-emerald-500':'bg-stone-300')} />)}</div>
                    </div>

                    {regStep===1 && (
                      <form onSubmit={handleReg1} className="space-y-3">
                        <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Full Name *</label><input type="text" value={regName} onChange={e=>setRegName(e.target.value)} className="input-field" placeholder="Ravi Kumar" required /></div>
                        <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Email *</label><input type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} className="input-field" placeholder="ravi@farm.com" required /></div>
                        <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Phone *</label><input type="tel" value={regPhone} onChange={e=>setRegPhone(e.target.value)} className="input-field" placeholder="9876543210" required /></div>
                        <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Password *</label><input type="password" value={regPassword} onChange={e=>setRegPassword(e.target.value)} className="input-field" placeholder="Min 6 characters" required minLength={6} /></div>
                        <button type="submit" className="btn-primary w-full"><span>Next: Location</span><ArrowRight className="h-4 w-4" /></button>
                      </form>
                    )}

                    {regStep===2 && (
                      <form onSubmit={handleReg2} className="space-y-3">
                        <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2"><MapPin className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" /><div><strong className="block font-bold">Your Location</strong><span>Enter your village or town name. Weather data and risk forecasts will be fetched automatically.</span></div></div>
                        <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Village / Town Name *</label><input type="text" value={regPlaceName} onChange={e=>{setRegPlaceName(e.target.value);setRegLat(null);setRegLng(null);}} className="input-field" placeholder="e.g. Baramati, Nashik, Indore" required /></div>
                        <div className="flex gap-2"><button type="button" onClick={()=>setRegStep(1)} className="btn-secondary flex-1">Back</button><button type="submit" className="btn-primary flex-1"><span>Next: Farm Details</span><ArrowRight className="h-4 w-4" /></button></div>
                      </form>
                    )}
                    {regStep===3 && (
                      <form onSubmit={handleReg3} className="space-y-3">
                        <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Farm / Plot Name *</label><input type="text" value={regFarmName} onChange={e=>setRegFarmName(e.target.value)} className="input-field" placeholder="e.g. South Mango Orchard" required /></div>
                        <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Farm Area (Acres)</label><input type="number" step="0.1" value={regFarmArea} onChange={e=>setRegFarmArea(e.target.value)} className="input-field" /></div>
                        <div className="flex gap-2"><button type="button" onClick={()=>setRegStep(2)} className="btn-secondary flex-1">Back</button><button type="submit" className="btn-primary flex-1"><span>Next: Select Crops</span><ArrowRight className="h-4 w-4" /></button></div>
                      </form>
                    )}

                    {regStep===4 && (
                      <form onSubmit={handleReg4} className="space-y-3">
                        <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-2">Select Your Crops *</label>
                          <div className="grid grid-cols-3 gap-2">
                            {ALL_CROPS.map(crop=>(
                              <button key={crop} type="button" onClick={()=>toggleCrop(crop)}
                                className={"p-2 rounded-xl text-xs font-bold border-2 transition-all " + (regCropNames.includes(crop)?'border-emerald-500 bg-emerald-50 text-emerald-800':'border-stone-200 bg-white text-slate-600 hover:border-stone-300')}>
                                {regCropNames.includes(crop)?<CheckCircle2 className="h-3.5 w-3.5 inline mr-1 text-emerald-600"/>:null}{crop}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">Selected: {regCropNames.length} crop(s)</p>
                        </div>
                        <div className="flex gap-2"><button type="button" onClick={()=>setRegStep(3)} className="btn-secondary flex-1">Back</button><button type="submit" disabled={isLoading||regCropNames.length===0} className="btn-primary flex-1"><span>{isLoading?"Registering...":"Register & Enter Portal"}</span><ArrowRight className="h-4 w-4" /></button></div>
                      </form>
                    )}
                  </div>
                )}

                <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div><div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400"><span className="bg-white px-2">or</span></div></div>
                <button onClick={handleDemo} disabled={isLoading} className="w-full rounded-xl bg-gradient-to-r from-agri-600 to-emerald-600 text-white py-3 text-xs font-bold shadow-lg hover:from-agri-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"><Sparkles className="h-4 w-4" /><span>1-Click Demo (Auto-creates farm + 3 crops)</span></button>
              </div>
            )}

            {selectedRole==='OFFICER' && (
              <form onSubmit={handleOfficer} className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2"><UserCheck className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" /><div><strong className="block font-bold">Officer Portal</strong><span>Field survey reports, outbreak tracking, validation dashboard.</span></div></div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Officer ID</label><input type="text" value={officerId} onChange={e=>setOfficerId(e.target.value)} className="input-field" /></div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Name</label><input type="text" value={officerName} onChange={e=>setOfficerName(e.target.value)} className="input-field" /></div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">PIN</label><input type="password" value={officerPin} onChange={e=>setOfficerPin(e.target.value)} className="input-field" /></div>
                <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-blue-600 text-white py-3 text-xs font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><span>Officer Access</span><ArrowRight className="h-4 w-4" /></button>
              </form>
            )}

            {selectedRole==='ADMIN' && (
              <form onSubmit={handleAdmin} className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-900 flex items-start gap-2"><Cpu className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" /><div><strong className="block font-bold">Central Admin</strong><span>Full system oversight, model management, governance dashboards.</span></div></div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Admin ID</label><input type="text" value={adminId} onChange={e=>setAdminId(e.target.value)} className="input-field" /></div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Name</label><input type="text" value={adminName} onChange={e=>setAdminName(e.target.value)} className="input-field" /></div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Admin Key</label><input type="password" value={adminKey} onChange={e=>setAdminKey(e.target.value)} className="input-field" /></div>
                <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-slate-900 text-white py-3 text-xs font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><span>Admin Access</span><ArrowRight className="h-4 w-4" /></button>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-900 text-slate-500 py-3 px-4 text-center text-[10px] border-t border-slate-800">
        Built for Smart India Hackathon 2026 | KrishiRakshak AI Platform v1.2
      </div>
    </div>
  );
};

