import React, { useEffect, useState } from 'react';
import { alertService } from '../services/alertService';
import { CropAlert } from '../types/alert';
import { PageHeader } from '../components/common/PageHeader';
import { AlertCard } from '../components/alerts/AlertCard';
import { FilterBar } from '../components/common/FilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { useLanguage } from '../context/LanguageContext';
import { CheckCheck } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<CropAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkRead = async (id: string) => {
    await alertService.markAsRead(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const handleMarkAllRead = async () => {
    await alertService.markAllAsRead();
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const filterOptions = [
    { id: 'ALL', label: t.alerts.filterAll, count: alerts.length },
    {
      id: 'CRITICAL',
      label: t.alerts.filterCritical,
      count: alerts.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH').length,
    },
    {
      id: 'DISEASE',
      label: t.alerts.filterDisease,
      count: alerts.filter((a) => a.category === 'DISEASE_OUTBREAK').length,
    },
    {
      id: 'PEST',
      label: 'Pest Warnings',
      count: alerts.filter((a) => a.category === 'PEST_WARNING').length,
    },
    {
      id: 'WEATHER',
      label: t.alerts.filterWeather,
      count: alerts.filter((a) => a.category === 'WEATHER_RISK').length,
    },
    {
      id: 'OFFICER',
      label: t.alerts.filterOfficer,
      count: alerts.filter((a) => a.category === 'OFFICER_MESSAGE').length,
    },
  ];

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'CRITICAL') return alert.severity === 'CRITICAL' || alert.severity === 'HIGH';
    if (selectedFilter === 'DISEASE') return alert.category === 'DISEASE_OUTBREAK';
    if (selectedFilter === 'PEST') return alert.category === 'PEST_WARNING';
    if (selectedFilter === 'WEATHER') return alert.category === 'WEATHER_RISK';
    if (selectedFilter === 'OFFICER') return alert.category === 'OFFICER_MESSAGE';
    return true;
  });

  if (isLoading) {
    return <LoadingState message="Loading agricultural alert bulletins..." count={3} />;
  }

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.alerts.title}
        subtitle={t.alerts.subtitle}
        action={
          unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="btn-secondary text-xs sm:text-sm py-2 px-3.5 inline-flex items-center gap-1.5"
            >
              <CheckCheck className="h-4 w-4 text-agri-700" />
              <span>{t.alerts.markAllRead}</span>
            </button>
          )
        }
      />

      <FilterBar
        options={filterOptions}
        selectedId={selectedFilter}
        onSelect={setSelectedFilter}
      />

      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No alerts in this category"
          description={t.alerts.noAlerts}
        />
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
};
