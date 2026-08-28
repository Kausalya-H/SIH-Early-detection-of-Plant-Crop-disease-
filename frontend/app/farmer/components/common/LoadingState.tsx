import React from 'react';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading information...',
  count = 3,
}) => {
  return (
    <div className="space-y-4 py-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-agri-700 font-medium text-sm">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-agri-600 border-t-transparent" />
        <span>{message}</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-28 w-full animate-pulse rounded-2xl bg-stone-200/70" />
        ))}
      </div>
    </div>
  );
};
