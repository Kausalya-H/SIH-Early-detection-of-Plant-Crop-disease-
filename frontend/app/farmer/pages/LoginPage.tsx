import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { ShieldCheck, Phone, ArrowRight, Globe, Lock, Sprout, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [phone, setPhone] = useState('9822014321');
  const [name, setName] = useState('Ramesh Patil');
  const [otp, setOtp] = useState('4138');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(phone, name);
      navigate('/farmer/dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    await login('+91 98220 14321', 'Ramesh Narayan Patil');
    navigate('/farmer/dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
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
            <span className="text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-3 py-0.5 rounded-full border border-agri-300">
              SIH26131 • Government of India
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
              KrishiRakshak AI — Kisan Portal
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Early Detection & Management of Crop Diseases and Pest Infestations
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-8 card p-6 sm:p-8 bg-white shadow-xl">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Patil"
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
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
              className="btn-primary w-full py-3 text-sm font-bold shadow-md"
            >
              <span>Log In to Farmer Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <span className="text-xs text-slate-400 block mb-2 font-medium">Evaluation Fast-Access:</span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full rounded-xl bg-agri-50 border border-agri-300 p-2.5 text-xs font-bold text-agri-800 hover:bg-agri-100 transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <CheckCircle2 className="h-4 w-4 text-agri-600" />
              <span>1-Click Instant Demo Login (Ramesh Patil)</span>
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Supported in 21 Indian Official Languages
        </p>
      </div>
    </div>
  );
};
