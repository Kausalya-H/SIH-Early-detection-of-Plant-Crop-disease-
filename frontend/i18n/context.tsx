'use client';

import React, { createContext, useContext, useCallback, useMemo, useSyncExternalStore, useEffect } from 'react';
import { SupportedLanguage, TranslationKey, LanguageMeta } from './types';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, LANGUAGES, LANGUAGE_MAP } from './config';
import { TRANSLATIONS } from './translations';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  currentLanguageMeta: LanguageMeta;
  supportedLanguages: LanguageMeta[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// External store listeners for synchronizing language state across components & tabs
const listeners = new Set<() => void>();

function emitLanguageChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeToLanguageStore(callback: () => void): () => void {
  listeners.add(callback);

  const onStorage = (e: StorageEvent) => {
    if (e.key === LANGUAGE_STORAGE_KEY) {
      callback();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

function getLanguageSnapshot(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
    if (saved && (saved in TRANSLATIONS)) {
      return saved;
    }
  } catch {
    // Handle restricted storage
  }
  return DEFAULT_LANGUAGE;
}

function getServerLanguageSnapshot(): SupportedLanguage {
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguageStore,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );

  const currentLanguageMeta = useMemo(() => {
    return LANGUAGE_MAP.get(language) || LANGUAGES[0];
  }, [language]);

  // Synchronize document dir (RTL/LTR) and lang attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = currentLanguageMeta.direction;
    }
  }, [language, currentLanguageMeta]);

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    if (newLang in TRANSLATIONS) {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
        const meta = LANGUAGE_MAP.get(newLang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = newLang;
          if (meta) {
            document.documentElement.dir = meta.direction;
          }
        }
      } catch {
        // Handle storage write failure gracefully
      }
      emitLanguageChange();
    }
  }, []);

  // Nested dot-notation key lookup with automatic English fallback
  const t = useCallback(
    (keyPath: TranslationKey | string, fallback?: string): string => {
      const keys = keyPath.split('.');

      // Helper to traverse a dictionary object safely
      const resolveValue = (dict: unknown): string | null => {
        let current: unknown = dict;
        for (const key of keys) {
          if (current && typeof current === 'object' && key in current) {
            current = (current as Record<string, unknown>)[key];
          } else {
            return null;
          }
        }
        return typeof current === 'string' ? current : null;
      };

      // 1. Try active language dictionary
      const activeDict = TRANSLATIONS[language];
      if (activeDict) {
        const activeValue = resolveValue(activeDict);
        if (activeValue !== null) return activeValue;
      }

      // 2. Fallback to master English dictionary
      if (language !== 'en' && TRANSLATIONS.en) {
        const enValue = resolveValue(TRANSLATIONS.en);
        if (enValue !== null) return enValue;
      }

      // 3. Fallback to provided default or original key string
      return fallback || keyPath;
    },
    [language]
  );

  const isRTL = currentLanguageMeta.direction === 'rtl';

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      currentLanguageMeta,
      supportedLanguages: LANGUAGES,
      isRTL,
    }),
    [language, setLanguage, t, currentLanguageMeta, isRTL]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Hook to access current language, changer function, and language metadata.
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Hook for translating UI strings.
 */
export function useTranslation() {
  const { t, language, setLanguage, currentLanguageMeta, supportedLanguages, isRTL } = useLanguage();
  return { t, language, setLanguage, currentLanguageMeta, supportedLanguages, isRTL };
}
