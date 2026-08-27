import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshIcon } from './Icons';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <RefreshIcon className={cn('animate-spin text-emerald-700', sizeClasses, className)} />
      {label && <p className="text-xs font-medium text-slate-500 animate-pulse">{label}</p>}
    </div>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/80', className)}
      {...props}
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-5 rounded-lg border border-slate-200 bg-white space-y-4 shadow-xs', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <Skeleton className="h-8 w-20" />
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white overflow-hidden p-4 space-y-3">
      <div className="flex gap-4 border-b border-slate-100 pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`head-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageLoader({ message = 'Loading National Surveillance Data...' }: { message?: string }) {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-center space-y-3">
      <LoadingSpinner size="xl" />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        <p className="text-xs text-slate-500">Connecting to KrishiRakshak National AI Grid</p>
      </div>
    </div>
  );
}
