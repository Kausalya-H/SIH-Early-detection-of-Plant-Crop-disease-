import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { AlertTriangleIcon, RefreshIcon } from './Icons';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'inline' | 'card' | 'page';
  className?: string;
}

export function ErrorState({
  title = 'Service Interruption',
  message = 'An unexpected error occurred while communicating with the surveillance servers.',
  onRetry,
  variant = 'card',
  className,
}: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-xs',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <AlertTriangleIcon className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-rose-800 font-semibold underline hover:text-rose-950 ml-3 shrink-0 cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-lg border border-rose-200 bg-rose-50/40',
        variant === 'page' ? 'min-h-[400px]' : '',
        className
      )}
    >
      <div className="p-3 rounded-full bg-rose-100 text-rose-700 mb-3">
        <AlertTriangleIcon className="w-6 h-6" />
      </div>

      <h4 className="text-sm font-semibold text-rose-950 mb-1">{title}</h4>
      <p className="text-xs text-rose-800/90 max-w-md mb-4 leading-relaxed">{message}</p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshIcon className="w-3.5 h-3.5" />}
          className="bg-white border-rose-200 text-rose-900 hover:bg-rose-50"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
