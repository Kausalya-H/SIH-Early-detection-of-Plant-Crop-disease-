import { RiskLevel } from '@/types';

/**
 * Utility to combine Tailwind class names cleanly without external dependencies.
 */
export function cn(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;

    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      for (const [key, val] of Object.entries(item)) {
        if (val) result.push(key);
      }
    }
  }

  return result.join(' ');
}

/**
 * Formats standard ISO date strings into Indian Standard format.
 */
export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats a date without timestamp.
 */
export function formatDateOnly(dateInput?: string | Date | null): string {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return String(dateInput);
  }
}

/**
 * Returns accessible, government-grade color tokens for Risk Levels.
 */
export function getRiskColorTokens(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
  bar: string;
  label: string;
} {
  switch (level) {
    case 'LOW':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-600/20',
        dot: 'bg-emerald-500',
        bar: 'bg-emerald-600',
        label: 'Low Risk',
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        badge: 'bg-amber-50 text-amber-900 border-amber-300 ring-amber-600/20',
        dot: 'bg-amber-500',
        bar: 'bg-amber-500',
        label: 'Moderate Risk',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        border: 'border-orange-200',
        badge: 'bg-orange-50 text-orange-900 border-orange-300 ring-orange-600/20',
        dot: 'bg-orange-500',
        bar: 'bg-orange-500',
        label: 'High Alert',
      };
    case 'CRITICAL':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-900',
        border: 'border-rose-200',
        badge: 'bg-rose-50 text-rose-900 border-rose-300 ring-rose-600/20',
        dot: 'bg-rose-600',
        bar: 'bg-rose-600',
        label: 'Critical Outbreak',
      };
  }
}

/**
 * Truncates text cleanly.
 */
export function truncate(text: string, maxLen = 60): string {
  if (!text || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen)}...`;
}

/**
 * Formats Indian phone numbers with standard spacing.
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}
