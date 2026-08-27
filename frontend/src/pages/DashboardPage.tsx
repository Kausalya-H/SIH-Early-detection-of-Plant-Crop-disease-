import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { farmService } from '../services/farmService';
import { scanService } from '../services/scanService';
import { alertService } from '../services/alertService';
import { weatherService } from '../services/weatherService';
import { Farm } from '../types/farmer';
import { CropScan } from '../types/scan';
import { CropAlert } from '../types/alert';
import { WeatherData } from '../types/weather';
import { QuickScanCTA } from '../components/dashboard/QuickScanCTA';
import { CropHealthOverview } from '../components/dashboard/CropHealthOverview';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { RecentScansList } from '../components/dashboard/RecentScansList';
import { CriticalAlertsBanner } from '../components/dashboard/CriticalAlertsBanner';
import { AIInsightCard } from '../components/dashboard/AIInsightCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { MapPin, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [scans, setScans] = useState<CropScan[]>([]);
  const [alerts, setAlerts] = useState<CropAlert[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [farmsData, scansData, alertsData, weatherData] = await Promise.all([
        farmService.getFarms(),
        scanService.getScans(),
        alertService.getAlerts(),
        weatherService.getWeather(),
      ]);
      setFarms(farmsData);
      setScans(scansData);
      setAlerts(alertsData);
      setWeather(weatherData);
    } catch (err: any) {
      console.error(err);
      setError('We could not load your farm dashboard information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading your farm health overview..." count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Farmer Greeting & Location Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {t.dashboard.greeting}, {user?.name || 'Farmer'}! 👋
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-agri-600 shrink-0" />
            <span>
              {user?.village}, Taluka {user?.taluka}, {user?.district}, {user?.state}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/farmer/farms"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-stone-50"
          >
            <Sprout className="h-4 w-4 text-agri-700" />
            <span>Manage {farms.length} Plots</span>
          </Link>
        </div>
      </div>

      {/* Critical Regional Alerts Banner */}
      <CriticalAlertsBanner alerts={alerts} />

      {/* Primary Hero CTA: Scan Crop Now */}
      <QuickScanCTA />

      {/* Crop Health Overview Stat Cards */}
      <CropHealthOverview farms={farms} />

      {/* Main Two-Column Grid: Weather & AI Predictive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          {weather && <WeatherWidget weather={weather} />}
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <AIInsightCard />
        </div>
      </div>

      {/* Recent Scans & Reports Section */}
      <div className="pt-2">
        <RecentScansList scans={scans} limit={3} />
      </div>
    </div>
  );
};
