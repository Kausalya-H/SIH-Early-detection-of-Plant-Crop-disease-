import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { ShieldCheck, Phone, Mail, ArrowRight, Globe, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('9822014321');
  const [name, setName] = useState('Ramesh Patil');
  const [otp, setOtp] = useState('4138');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(identifier, name);
      navigate('/farmer/dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoQuickLogin = async () => {
    setIsLoading(true);
    await login('+91 98220 14321', 'Ramesh Narayan Patil');
    navigate('/farmer/dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Bar with Language Selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 border border-stone-300 shadow-xs">
          <Globe className="h-4 w-4 text-agri-700" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Language selector"
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[170px] truncate"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Project Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-agri-600 to-agri-800 text-white shadow-lg shadow-agri-700/30">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <div>
            <span className="rounded-full bg-agri-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-agri-800">
              SIH26131 • Official Portal
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {t.appName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl shadow-stone-200/50 rounded-3xl border border-stone-200/80 sm:px-10">
          <div className="flex items-center justify-center gap-2 pb-6 border-b border-stone-100 mb-6">
            <button
              type="button"
              onClick={() => setMode('phone')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors ${
                mode === 'phone'
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              Mobile OTP Login
            </button>
            <button
              type="button"
              onClick={() => setMode('email')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors ${
                mode === 'email'
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              Email / Password
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Farmer Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {mode === 'phone' ? 'Mobile Number (WhatsApp/SMS)' : 'Email Address'}
              </label>
              <div className="relative">
                {mode === 'phone' ? (
                  <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                ) : (
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                )}
                <input
                  type={mode === 'phone' ? 'tel' : 'email'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={mode === 'phone' ? 'Enter 10-digit mobile number' : 'farmer@domain.com'}
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {mode === 'phone' ? 'Verification OTP' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={mode === 'phone' ? '4-digit OTP' : '••••••••'}
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base py-3.5 mt-2"
            >
              <span>{isLoading ? 'Signing In...' : 'Access Farmer Portal'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-6 border-t border-stone-100 text-center space-y-3">
            <p className="text-xs text-slate-500 font-medium">
              Demo Access for Reviewers & Hackathon Evaluators:
            </p>
            <button
              type="button"
              onClick={handleDemoQuickLogin}
              className="btn-secondary w-full text-xs sm:text-sm py-2.5 bg-agri-50 border-agri-200 text-agri-800 hover:bg-agri-100"
            >
              ⚡ Instant 1-Click Demo Login (Ramesh Patil - Pune)
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500">
          SIH26131 • Government & Extension Advisory Support Portal
        </p>
      </div>
    </div>
  );
};
