import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '../i18n/translations';
import { User, Globe, Bell, Shield, Save, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [name, setName] = useState(user?.name || 'Ramesh Narayan Patil');
  const [phone, setPhone] = useState(user?.phone || '+91 98220 14321');
  const [email, setEmail] = useState(user?.email || 'ramesh.patil@agrimail.in');
  const [village, setVillage] = useState(user?.village || 'Malegaon Khurd');
  const [taluka, setTaluka] = useState(user?.taluka || 'Baramati');
  const [district, setDistrict] = useState(user?.district || 'Pune');
  const [state, setState] = useState(user?.state || 'Maharashtra');

  const [smsAlerts, setSmsAlerts] = useState(user?.notificationPreferences?.sms ?? true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(user?.notificationPreferences?.whatsapp ?? true);
  const [weatherAlerts, setWeatherAlerts] = useState(user?.notificationPreferences?.weatherAlerts ?? true);
  const [diseaseWarnings, setDiseaseWarnings] = useState(user?.notificationPreferences?.diseaseWarnings ?? true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      phone,
      email,
      village,
      taluka,
      district,
      state,
      preferredLanguage: language,
      notificationPreferences: {
        sms: smsAlerts,
        whatsapp: whatsappAlerts,
        inApp: true,
        weatherAlerts,
        diseaseWarnings,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Farmer Settings & Account"
        subtitle="Manage your personal details, regional language, and advisory notification preferences"
        badge={
          <span className="rounded-full bg-agri-100 px-3 py-1 text-xs font-bold text-agri-800 border border-agri-300">
            Farmer ID: {user?.id || 'MH-413801'}
          </span>
        }
      />

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2.5 animate-fade-in shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Your profile preferences and notification settings were updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 1. Personal & Contact Information */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 text-slate-900 font-bold text-base">
            <User className="h-5 w-5 text-agri-700" />
            <span>Personal & Location Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Village / Town *
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Taluka / Block *
              </label>
              <input
                type="text"
                required
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                District & State *
              </label>
              <input
                type="text"
                required
                value={`${district}, ${state}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setDistrict(parts[0]?.trim() || district);
                  if (parts[1]) setState(parts[1].trim());
                }}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* 2. Portal Language Selector (21 Indian Languages) */}
        <div className="card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
              <Globe className="h-5 w-5 text-agri-700" />
              <span>Preferred Portal Language</span>
            </div>
            <span className="text-xs font-bold text-agri-800 bg-agri-100 px-2.5 py-0.5 rounded-full border border-agri-300 w-fit">
              {SUPPORTED_LANGUAGES.length} Languages Supported
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((langItem) => {
              const isSelected = language === langItem.code;
              return (
                <div
                  key={langItem.code}
                  onClick={() => setLanguage(langItem.code)}
                  className={`cursor-pointer rounded-2xl p-3.5 border transition-all ${
                    isSelected
                      ? 'border-agri-600 bg-agri-50/90 ring-2 ring-agri-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {langItem.nativeName}
                    </span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-agri-700 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{langItem.name} ({langItem.desc})</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Notification Preferences */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 text-slate-900 font-bold text-base">
            <Bell className="h-5 w-5 text-agri-700" />
            <span>Notification & Advisory Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 cursor-pointer hover:bg-stone-50">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-agri-700 focus:ring-agri-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">SMS Text Alerts</span>
                <span className="text-slate-500">Receive urgent outbreak SMS messages on mobile</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 cursor-pointer hover:bg-stone-50">
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-agri-700 focus:ring-agri-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">WhatsApp Advisories</span>
                <span className="text-slate-500">Get weather forecasts and digital spray recommendations</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 cursor-pointer hover:bg-stone-50">
              <input
                type="checkbox"
                checked={weatherAlerts}
                onChange={(e) => setWeatherAlerts(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-agri-700 focus:ring-agri-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Severe Weather Warnings</span>
                <span className="text-slate-500">Pre-monsoon, frost, and high humidity risk warnings</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 cursor-pointer hover:bg-stone-50">
              <input
                type="checkbox"
                checked={diseaseWarnings}
                onChange={(e) => setDiseaseWarnings(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-agri-700 focus:ring-agri-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Disease Cluster Alerts</span>
                <span className="text-slate-500">Notifications when neighboring farms report fungal outbreaks</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-primary py-3 px-6 text-sm font-bold shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
