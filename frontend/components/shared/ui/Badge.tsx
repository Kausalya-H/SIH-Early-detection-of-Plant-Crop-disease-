import React from 'react';
import { RiskLevel, UserRole } from '@/types';
import { cn, getRiskColorTokens } from '@/lib/utils';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  ...props
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    primary: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-600/10',
    success: 'bg-green-50 text-green-800 border-green-300',
    warning: 'bg-amber-50 text-amber-900 border-amber-300',
    danger: 'bg-rose-50 text-rose-900 border-rose-300',
    info: 'bg-sky-50 text-sky-800 border-sky-300',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const dotClasses: Record<BadgeVariant, string> = {
    default: 'bg-slate-500',
    primary: 'bg-emerald-600',
    success: 'bg-green-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    info: 'bg-sky-600',
    neutral: 'bg-gray-500',
  };

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-md border font-sans tracking-wide uppercase',
        variantClasses[variant],
        sizeClasses,
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])} />}
      {children}
    </span>
  );
}

export interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

/**
 * Dedicated Risk Badge strictly displaying LOW, MODERATE, HIGH, CRITICAL levels
 * with public-sector high-contrast accessibility standards.
 */
export function RiskBadge({ level, size = 'md', showDot = true, className }: RiskBadgeProps) {
  const tokens = getRiskColorTokens(level);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-semibold tracking-wider uppercase',
        tokens.badge,
        sizeClasses,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {level === 'CRITICAL' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          )}
          <span className={cn('relative inline-flex rounded-full h-2 w-2', tokens.dot)} />
        </span>
      )}
      <span>{tokens.label}</span>
    </span>
  );
}

export interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = {
    FARMER: { label: 'Farmer / Kisan', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    OFFICER: { label: 'Agriculture Officer', bg: 'bg-blue-100 text-blue-900 border-blue-300' },
    ADMIN: { label: 'Central Admin', bg: 'bg-purple-100 text-purple-900 border-purple-300' },
  }[role];

  return (
    <span
      className={cn(
        'inline-flex items-center text-[11px] px-2 py-0.5 rounded font-semibold border uppercase tracking-wider',
        config.bg,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let variant: BadgeVariant = 'default';
  if (['ACTIVE', 'CONFIRMED', 'RESOLVED', 'HEALTHY', 'SUCCESS'].includes(normalized)) {
    variant = 'success';
  } else if (['PENDING', 'SUSPECTED', 'CONTAINING', 'WARNING'].includes(normalized)) {
    variant = 'warning';
  } else if (['CRITICAL', 'FAILURE', 'SUSPENDED', 'DEGRADED'].includes(normalized)) {
    variant = 'danger';
  } else if (['INFO'].includes(normalized)) {
    variant = 'info';
  }

  return (
    <Badge variant={variant} dot className={className}>
      {status}
    </Badge>
  );
}
