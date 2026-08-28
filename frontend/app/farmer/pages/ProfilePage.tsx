import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { PageHeader } from '../components/common/PageHeader';
import { User, Phone, Globe, Bell, Check, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [name, setName] = useState(user?.name || 'Ramesh Narayan Patil');
  const [phone, setPhone] = useState(user?.phone || '+91 98220 14321');
  const [email, setEmail] = useState(user?.email || 'ramesh.patil@agrimail.in');
  const [village, setVillage] = useState(user?.village || 'Malegaon Khurd');
  const [taluka, setTaluka] = useState(user?.taluka || 'Baramati');
  const [district, setDistrict] = useState(user?.district || 'Pune');
  const [state, setState] = useState(user?.state || 'Maharashtra');

  // Notifications
  const [smsAlerts, setSmsAlerts] = useState(user?.notificationPreferences?.sms ?? true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(user?.notificationPreferences?.whatsapp ?? true);
  const [weatherWarnings, setWeatherWarnings] = useState(user?.notificationPreferences?.weatherAlerts ?? true);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
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
        weatherAlerts: weatherWarnings,
        diseaseWarnings: true,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.profile.title}
        subtitle={t.profile.subtitle}
        badge={
          <span className="rounded-full bg-agri-100 px-3 py-1 text-xs font-bold text-agri-800 border border-agri-300">
            Registered Farmer ID: {user?.id || 'MH-413801'}
          </span>
        }
      />

      {isSaved && (
        <div className="rounded-2xl bg-emerald-100 p-4 text-sm font-bold text-emerald-900 border border-emerald-300 flex items-center gap-2 animate-fade-in">
          <Check className="h-5 w-5 text-emerald-700" />
          <span>{t.profile.saveSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Contact Details */}
        <div className="card bg-white p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100 text-slate-900 font-bold text-base">
            <User className="h-5 w-5 text-agri-700" />
            <span>{t.profile.personalInfo}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {t.profile.name} *
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
                {t.profile.phone} *
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
                {t.profile.village} *
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
                {t.profile.taluka} *
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
                {t.profile.district} *
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="card bg-white p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-3 text-slate-900 font-bold text-base">
              <Globe className="h-5 w-5 text-agri-700" />
              <span>{t.profile.preferredLanguage}</span>
            </div>
            <span className="text-xs font-semibold text-agri-800 bg-agri-100 px-2.5 py-0.5 rounded-full">
              {SUPPORTED_LANGUAGES.length} Languages Supported
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((langItem) => {
              const isSelected = language === langItem.code;
              return (
                <div
                  key={langItem.code}
                  onClick={() => setLanguage(langItem.code)}
                  className={`cursor-pointer rounded-2xl p-3.5 border transition-all ${
                    isSelected
                      ? 'border-agri-600 bg-agri-50/80 ring-2 ring-agri-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {langItem.nativeName} ({langItem.name})
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-agri-700 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{langItem.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card bg-white p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100 text-slate-900 font-bold text-base">
            <Bell className="h-5 w-5 text-agri-700" />
            <span>{t.profile.notificationSettings}</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  {t.profile.smsAlerts}
                </span>
                <span className="text-xs text-slate-500">
                  Receive critical disease outbreak bulletins via SMS
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-5 w-5 rounded border-stone-300 text-agri-600 focus:ring-agri-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  {t.profile.whatsappAlerts}
                </span>
                <span className="text-xs text-slate-500">
                  Receive scan diagnostic reports and officer advisories on WhatsApp
                </span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="h-5 w-5 rounded border-stone-300 text-agri-600 focus:ring-agri-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  {t.profile.weatherWarnings}
                </span>
                <span className="text-xs text-slate-500">
                  Immediate alerts when heavy rainfall or high humidity risk is forecast
                </span>
              </div>
              <input
                type="checkbox"
                checked={weatherWarnings}
                onChange={(e) => setWeatherWarnings(e.target.checked)}
                className="h-5 w-5 rounded border-stone-300 text-agri-600 focus:ring-agri-500"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-primary text-base py-3.5 px-8 shadow-lg shadow-agri-700/20 inline-flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            <span>{t.profile.saveChanges}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
