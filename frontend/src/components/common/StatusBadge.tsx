import React from 'react';
import { HealthStatus } from '../../types/farmer';
import { useLanguage } from '../../context/LanguageContext';

interface StatusBadgeProps {
  status: HealthStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useLanguage();

  const configs: Record<HealthStatus, { label: string; dot: string; bg: string; text: string }> = {
    HEALTHY: {
      label: t.status.healthy,
      dot: 'bg-emerald-500',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-800',
    },
    WATCH: {
      label: t.status.watch,
      dot: 'bg-amber-500',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      text: 'text-amber-800',
    },
    AFFECTED: {
      label: t.status.affected,
      dot: 'bg-orange-500',
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      text: 'text-orange-800',
    },
    CRITICAL: {
      label: t.status.critical,
      dot: 'bg-red-500 animate-pulse',
      bg: 'bg-red-50 text-red-800 border-red-200',
      text: 'text-red-800',
    },
  };

  const config = configs[status] || configs.HEALTHY;
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${sizeClasses}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
};
