import React from 'react';
import { RiskLevel } from '../../types/disease';
import { AlertSeverity } from '../../types/alert';

interface RiskBadgeProps {
  level: RiskLevel | AlertSeverity | string;
  size?: 'sm' | 'md' | 'lg' | string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'sm' }) => {
  const config = {
    INFO: {
      label: 'INFO ADVISORY',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    LOW: {
      label: 'LOW RISK',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    MODERATE: {
      label: 'MODERATE RISK',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    HIGH: {
      label: 'HIGH RISK',
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
    },
    CRITICAL: {
      label: 'CRITICAL RISK',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
    },
  }[level as string] || {
    label: level,
    bg: 'bg-stone-50 text-stone-700 border-stone-200',
    dot: 'bg-stone-500',
  };

  const sizeClass = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size as 'sm' | 'md' | 'lg'] || 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${config.bg} ${sizeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
