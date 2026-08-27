import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { ShieldIcon } from './Icons';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
    >
      <div className="p-3 rounded-full bg-white border border-slate-200 text-slate-400 mb-3 shadow-xs">
        {icon || <ShieldIcon className="w-6 h-6" />}
      </div>

      <h4 className="text-sm font-semibold text-slate-800 tracking-tight mb-1">{title}</h4>

      {description && (
        <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
