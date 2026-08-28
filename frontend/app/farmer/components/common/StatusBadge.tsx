import React from 'react';
import { HealthStatus } from '../../types/farmer';

interface StatusBadgeProps {
  status: HealthStatus | string;
  size?: 'sm' | 'md' | 'lg' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = {
    HEALTHY: {
      label: 'Healthy',
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    WATCH: {
      label: 'Under Watch',
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    AFFECTED: {
      label: 'Affected',
      bg: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    CRITICAL: {
      label: 'Critical Alert',
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
    },
  }[status as HealthStatus] || {
    label: status,
    bg: 'bg-stone-100 text-slate-700 border-stone-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg}`}
    >
      {config.label}
    </span>
  );
};
