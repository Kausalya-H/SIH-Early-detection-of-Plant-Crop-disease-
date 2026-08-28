import React from 'react';
import { Sprout } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="card text-center py-12 px-6 flex flex-col items-center justify-center">
      <div className="rounded-2xl bg-agri-50 p-4 text-agri-700 mb-4 border border-agri-100">
        {icon || <Sprout className="w-10 h-10" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-md">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary mt-6 text-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
