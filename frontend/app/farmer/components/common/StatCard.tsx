import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  colorScheme?: 'green' | 'blue' | 'amber' | 'orange' | 'rose' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  colorScheme = 'emerald',
}) => {
  const colorStyles = {
    green: {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    emerald: {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    blue: {
      bg: 'bg-blue-50/80',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    amber: {
      bg: 'bg-amber-50/80',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    orange: {
      bg: 'bg-orange-50/80',
      text: 'text-orange-700',
      border: 'border-orange-200/80',
      iconBg: 'bg-orange-100 text-orange-700',
    },
    rose: {
      bg: 'bg-rose-50/80',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      iconBg: 'bg-rose-100 text-rose-700',
    },
  }[colorScheme];

  return (
    <div className="card p-5 sm:p-6 card-hover flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-medium text-slate-500">{title}</p>
          <h3 className={`mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight ${colorStyles.text}`}>
            {value}
          </h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorStyles.iconBg} shadow-xs shrink-0`}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-stone-100">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ml-auto ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
