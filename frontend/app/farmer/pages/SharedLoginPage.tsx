import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '../i18n/translations';
import {
  ShieldCheck,
  Phone,
  ArrowRight,
  Globe,
  Lock,
  Sprout,
  CheckCircle2,
  MapPin,
  Cpu,
  UserCheck,
  Building2,
  Sparkles,
  Layers,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const SharedLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, login, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [isLoading, setIsLoading] = useState(false);

  // Farmer form state
  const [farmerPhone, setFarmerPhone] = useState('9822014321');
  const [farmerName, setFarmerName] = useState('Ramesh Narayan Patil');
  const [farmerOtp, setFarmerOtp] = useState('4138');

  // Officer form state
  const [officerId, setOfficerId] = useState('OFF-PUNE-7402');
  const [officerName, setOfficerName] = useState('Dr. Rajesh Deshmukh');
  const [officerPin, setOfficerPin] = useState('7402');
  const [officerDivision, setOfficerDivision] = useState('Pune Division & Baramati Sub-Division');

  // Admin form state
  const [adminId, setAdminId] = useState('ADMIN-CENTRAL-01');
  const [adminName, setAdminName] = useState('Priya Sharma');
  const [adminKey, setAdminKey] = useState('admin2026');

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login('FARMER', {
      phone: farmerPhone,
      name: farmerName,
      otp: farmerOtp,
    });
    setIsLoading(false);
    navigate('/farmer/dashboard');
  };

  const handleOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login('OFFICER', {
      officerId,
      name: officerName,
      password: officerPin,
      jurisdiction: officerDivision,
    });
    setIsLoading(false);
    navigate('/officer');
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login('ADMIN', {
      adminId,
      name: adminName,
      password: adminKey,
    });
    setIsLoading(false);
    navigate('/admin');
  };

  const handleQuickDemo = async (targetRole: UserRole) => {
    setIsLoading(true);
    if (targetRole === 'FARMER') {
      await login('FARMER', {
        phone: '+91 98220 14321',
        name: 'Ramesh Narayan Patil',
      });
      setIsLoading(false);
      navigate('/farmer/dashboard');
    } else if (targetRole === 'OFFICER') {
      await login('OFFICER', {
        officerId: 'OFF-PUNE-7402',
        name: 'Dr. Rajesh Deshmukh',
        jurisdiction: 'Pune Division & Baramati Sub-Division',
      });
      setIsLoading(false);
      navigate('/officer');
    } else if (targetRole === 'ADMIN') {
      await login('ADMIN', {
        adminId: 'ADMIN-CENTRAL-01',
        name: 'Priya Sharma',
      });
      setIsLoading(false);
      navigate('/admin');
    }
  };

  const roleTabConfig = [
    {
      id: 'FARMER' as UserRole,
      label: 'Kisan / Farmer',
      hindiLabel: 'किसान सेवा पोर्टल',
      icon: <Sprout className="h-5 w-5" />,
      color: 'emerald',
      activeClass: 'bg-emerald-700 text-white shadow-md',
      inactiveClass: 'text-slate-600 hover:bg-stone-100',
      badge: 'Public Portal',
    },
    {
      id: 'OFFICER' as UserRole,
      label: 'Agri Officer',
      hindiLabel: 'कृषि अधिकारी निगरानी कक्ष',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'blue',
      activeClass: 'bg-blue-700 text-white shadow-md',
      inactiveClass: 'text-slate-600 hover:bg-stone-100',
      badge: 'Command & GIS',
    },
    {
      id: 'ADMIN' as UserRole,
      label: 'Central Admin',
      hindiLabel: 'केंद्रीय प्रशासन एवं नियंत्रण',
      icon: <Cpu className="h-5 w-5" />,
      color: 'purple',
      activeClass: 'bg-slate-900 text-white shadow-md',
      inactiveClass: 'text-slate-600 hover:bg-stone-100',
      badge: 'AI Governance',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between font-sans">
      {/* Top Official Banner */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 sm:px-8 border-b border-slate-800 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider">Government of India</span>
          <span className="text-slate-500">•</span>
          <span>Ministry of Agriculture & Farmers Welfare</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-semibold">Smart India Hackathon 2026</span>
        </div>

        {/* 21-Language Selector */}
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Language selector"
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-0.5 font-medium focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8 flex-1 flex flex-col justify-center">
        {/* Portal Branding & National Heading */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-agri-700 via-agri-800 to-agri-950 text-white shadow-xl shadow-agri-900/20 border-2 border-emerald-400/20">
            <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-300" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-agri-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-agri-800 border border-agri-300 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-agri-700" />
              <span>Unified Public-Sector Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              KrishiRakshak AI — कृषि रक्षक
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-1">
              National Plant & Crop Disease Early Detection, Containment Surveillance & AI Governance Platform
            </p>
          </div>
        </div>

        {/* If user is already authenticated, show Active Session card */}
        {isAuthenticated && user && (
          <div className="card p-6 bg-white border-2 border-agri-500 shadow-lg text-center space-y-4 animate-fade-in max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Authentication Session</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500">
                Logged in as <strong>{user.role}</strong> • {user.designation || user.jurisdiction || user.id}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (role === 'FARMER') navigate('/farmer/dashboard');
                  else if (role === 'OFFICER') navigate('/officer');
                  else if (role === 'ADMIN') navigate('/admin');
                }}
                className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Enter Authorized {role} Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-stone-300 bg-white py-2.5 px-4 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out / Switch User</span>
              </button>
            </div>
          </div>
        )}

        {/* Shared Login Card with 3 Role Tabs */}
        {(!isAuthenticated || !user) && (
          <div className="card p-6 sm:p-8 bg-white shadow-2xl border border-stone-200/80 max-w-xl mx-auto w-full space-y-6">
            {/* Role Selection Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                Select Your Operational Role Gateway
              </label>
              <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                {roleTabConfig.map((tab) => {
                  const isActive = selectedRole === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedRole(tab.id)}
                      className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive ? tab.activeClass : tab.inactiveClass
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                      </div>
                      <span className="text-[10px] opacity-85 mt-0.5 hidden sm:block truncate max-w-[110px]">
                        {tab.hindiLabel}
                      </span>
                      <span className="sm:hidden text-[10px] mt-0.5">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: FARMER LOGIN FORM */}
            {selectedRole === 'FARMER' && (
              <form onSubmit={handleFarmerSubmit} className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <Sprout className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-950 font-bold">Kisan / Farmer Portal Access</strong>
                    <span>Instant AI leaf diagnosis, regional crop advisories, and local plot management.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Farmer Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile"
                      className="input-field pl-12 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Farmer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="Ramesh Narayan Patil"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    One-Time Password (OTP)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={farmerOtp}
                    onChange={(e) => setFarmerOtp(e.target.value)}
                    placeholder="4138"
                    className="input-field font-mono text-center tracking-widest text-base"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Demo OTP: <strong>4138</strong> (Pre-filled for testing)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-sm font-bold shadow-md bg-emerald-800 hover:bg-emerald-900"
                >
                  <span>Log In to Kisan Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('FARMER')}
                    className="w-full rounded-xl bg-emerald-50 border border-emerald-300 p-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span>1-Click Fast Login (Ramesh Patil • Baramati Plot)</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: OFFICER LOGIN FORM */}
            {selectedRole === 'OFFICER' && (
              <form onSubmit={handleOfficerSubmit} className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                  <UserCheck className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-blue-950 font-bold">Officer Command & Surveillance</strong>
                    <span>Geospatial risk heatmaps, outbreak containment clusters, and SMS broadcast queue.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Government Officer ID / Official Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder="OFF-PUNE-7402"
                    className="input-field font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Officer Full Name & Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder="Dr. Rajesh Deshmukh"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Jurisdiction / Agro-Climatic Sub-Division
                  </label>
                  <input
                    type="text"
                    value={officerDivision}
                    onChange={(e) => setOfficerDivision(e.target.value)}
                    placeholder="Pune Division & Baramati Sub-Division"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Security Passcode / PIN
                  </label>
                  <input
                    type="password"
                    value={officerPin}
                    onChange={(e) => setOfficerPin(e.target.value)}
                    placeholder="••••"
                    className="input-field font-mono text-center tracking-widest text-base"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Demo PIN: <strong>7402</strong> (Pre-filled for officer evaluation)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-sm font-bold shadow-md bg-blue-800 hover:bg-blue-900"
                >
                  <span>Log In to Officer Command Center</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('OFFICER')}
                    className="w-full rounded-xl bg-blue-50 border border-blue-300 p-2.5 text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-blue-700" />
                    <span>1-Click Fast Login (Dr. Rajesh Deshmukh • DAO Pune)</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: ADMIN LOGIN FORM */}
            {selectedRole === 'ADMIN' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
                  <Cpu className="h-5 w-5 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-purple-950 font-bold">Admin Central & AI Governance</strong>
                    <span>Vision Transformer model telemetry, RBAC access provisioning, and audit logs.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    System Administrator ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="ADMIN-CENTRAL-01"
                    className="input-field font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Administrator Name
                  </label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Security Key / Passphrase
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="admin2026"
                    className="input-field font-mono text-sm"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Demo Key: <strong>admin2026</strong> (Pre-filled for admin evaluation)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-sm font-bold shadow-md bg-slate-900 hover:bg-slate-950"
                >
                  <span>Log In to Admin Central</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('ADMIN')}
                    className="w-full rounded-xl bg-purple-50 border border-purple-300 p-2.5 text-xs font-bold text-purple-900 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-purple-700" />
                    <span>1-Click Fast Login (Priya Sharma • AI Governance Lead)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3 Portal Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <Sprout className="h-4 w-4 text-emerald-600" />
              <span>1. Kisan Portal</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mobile-first image upload for instant leaf pathology diagnostics, CIB&RC-approved sprays, and 21 regional languages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span>2. Officer Command</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              GIS pathogen spread heatmaps, outbreak cluster quarantine boundaries, and automated emergency broadcast dispatches.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
              <Cpu className="h-4 w-4 text-purple-600" />
              <span>3. Admin Central</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vision model telemetry (YOLOv11 & ViT), RBAC security provisioning, and cryptographically verified audit trails.
            </p>
          </div>
        </div>
      </div>

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 sm:px-8 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-slate-200 font-bold">
              KrishiRakshak AI — National Agriculture Disease Early Warning Grid
            </p>
            <p className="text-[11px] text-slate-400">
              Department of Agriculture & Farmers Welfare, Ministry of Agriculture, Government of India
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <p>Smart India Hackathon 2026 Public-Sector Initiative</p>
            <p className="text-emerald-400 font-semibold">21 Indian Languages Supported</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
