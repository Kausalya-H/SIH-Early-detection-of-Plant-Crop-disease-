import React from 'react';
import { RiskLevel } from '../../types/scan';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const { t } = useLanguage();

  const configs: Record<
    RiskLevel,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    LOW: {
      label: t.risk.low,
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />,
    },
    MODERATE: {
      label: t.risk.moderate,
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      icon: <Info className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />,
    },
    HIGH: {
      label: t.risk.high,
      bg: 'bg-orange-50',
      text: 'text-orange-950',
      border: 'border-orange-300',
      icon: <AlertTriangle className="w-4 h-4 text-orange-700 shrink-0" aria-hidden="true" />,
    },
    CRITICAL: {
      label: t.risk.critical,
      bg: 'bg-red-50',
      text: 'text-red-950',
      border: 'border-red-300 ring-1 ring-red-400',
      icon: <AlertOctagon className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />,
    },
  };

  const config = configs[level] || configs.LOW;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5 font-medium',
    lg: 'text-base px-4 py-2 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={`Risk Level: ${config.label}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
