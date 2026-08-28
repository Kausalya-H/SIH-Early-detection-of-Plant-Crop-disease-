import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'bg-white border-stone-200/80 text-slate-800',
    success: 'bg-emerald-50/50 border-emerald-200 text-emerald-950',
    warning: 'bg-amber-50/50 border-amber-200 text-amber-950',
    danger: 'bg-red-50/50 border-red-200 text-red-950',
  };

  const iconBgStyles = {
    default: 'bg-stone-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <div
      onClick={onClick}
      className={`card flex items-start justify-between border ${variantStyles[variant]} ${
        onClick ? 'cursor-pointer hover:border-agri-400' : ''
      }`}
    >
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className={`rounded-xl p-3 ${iconBgStyles[variant]} shrink-0`} aria-hidden="true">
        {icon}
      </div>
    </div>
  );
};
