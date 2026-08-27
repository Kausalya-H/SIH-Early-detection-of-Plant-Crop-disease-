import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRightIcon, ArrowDownRightIcon } from './Icons';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'flat' | 'elevated';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-slate-200 shadow-xs',
    bordered: 'bg-white border-2 border-slate-300',
    flat: 'bg-slate-50 border border-slate-200',
    elevated: 'bg-white border border-slate-200 shadow-md',
  }[variant];

  return (
    <div className={cn('rounded-lg overflow-hidden', variantStyles, className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  action,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { action?: React.ReactNode }) {
  return (
    <div
      className={cn('px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-4', className)}
      {...props}
    >
      <div className="space-y-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-slate-900 tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-slate-500 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  accentColor?: 'emerald' | 'rose' | 'amber' | 'blue' | 'slate';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'emerald',
  className,
}: StatCardProps) {
  const accentBorder = {
    emerald: 'border-l-4 border-l-emerald-600',
    rose: 'border-l-4 border-l-rose-600',
    amber: 'border-l-4 border-l-amber-500',
    blue: 'border-l-4 border-l-blue-600',
    slate: 'border-l-4 border-l-slate-600',
  }[accentColor];

  return (
    <Card className={cn('bg-white p-5 hover:border-slate-300 transition-colors', accentBorder, className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className="p-2.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {trend ? (
            <div className="flex items-center gap-1">
              {trend.direction === 'up' && (
                <span className="inline-flex items-center text-emerald-700 font-semibold gap-0.5">
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  {trend.value}
                </span>
              )}
              {trend.direction === 'down' && (
                <span className="inline-flex items-center text-rose-700 font-semibold gap-0.5">
                  <ArrowDownRightIcon className="w-3.5 h-3.5" />
                  {trend.value}
                </span>
              )}
              {trend.direction === 'neutral' && (
                <span className="font-semibold text-slate-700">{trend.value}</span>
              )}
              {trend.label && <span className="text-slate-400">({trend.label})</span>}
            </div>
          ) : (
            <div />
          )}

          {subtitle && <span className="text-slate-400 text-right">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
