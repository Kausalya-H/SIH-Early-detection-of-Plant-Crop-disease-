import React from 'react';
import { WeatherData } from '../../types/weather';
import { CloudRain, Droplets, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { useLanguage } from '../../context/LanguageContext';

interface WeatherWidgetProps {
  weather: WeatherData;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const { t } = useLanguage();

  return (
    <div className="card bg-gradient-to-br from-white via-stone-50 to-emerald-50/40 border-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <span className="text-xs font-semibold text-agri-700 uppercase tracking-wider">
            {t.dashboard.weatherTitle}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">{weather.location}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{t.dashboard.diseaseRisk}:</span>
          <RiskBadge level={weather.diseaseRiskIndex} size="sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-stone-200/80 shadow-xs">
          <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
            <Thermometer className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Temperature</p>
            <p className="text-base font-bold text-slate-900">{weather.temperatureC}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-stone-200/80 shadow-xs">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">{t.dashboard.humidity}</p>
            <p className="text-base font-bold text-slate-900">{weather.humidityPercent}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-stone-200/80 shadow-xs">
          <div className="rounded-lg bg-cyan-50 p-2 text-cyan-600">
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">{t.dashboard.rainfallChance}</p>
            <p className="text-base font-bold text-slate-900">{weather.rainfallChancePercent}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-stone-200/80 shadow-xs">
          <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
            <Wind className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Wind</p>
            <p className="text-base font-bold text-slate-900">{weather.windSpeedKmh} km/h</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50/80 p-3 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Agronomic Warning: </span>
          <span>{weather.diseaseRiskReason}</span>
        </div>
      </div>
    </div>
  );
};
