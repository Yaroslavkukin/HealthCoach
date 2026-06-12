import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type TranslationKey } from '@/i18n/translations/en';
import { ru } from '@/i18n/translations/ru';

export type Language = 'en' | 'ru';

type TranslationParams = Record<string, string | number>;

type I18nContextValue = {
  language: Language;
  isReady: boolean;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const languageStorageKey = 'healthcoach.language';
const translations: Record<Language, Record<TranslationKey, string>> = { en, ru };

export const languageOptions: { value: Language; labelKey: TranslationKey }[] = [
  { value: 'en', labelKey: 'settings.english' },
  { value: 'ru', labelKey: 'settings.russian' }
];

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSavedLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem(languageStorageKey);

        if (active && isLanguage(savedLanguage)) {
          setLanguageState(savedLanguage);
        }
      } catch {
        // Keep English as the safe local fallback if storage is unavailable.
      } finally {
        if (active) {
          setIsReady(true);
        }
      }
    }

    void loadSavedLanguage();

    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: Language) => {
    setLanguageState(nextLanguage);

    try {
      await AsyncStorage.setItem(languageStorageKey, nextLanguage);
    } catch {
      // The in-memory language still updates for this session if local persistence fails.
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => {
      const template = translations[language][key] ?? translations.en[key] ?? key;

      if (!params) {
        return template;
      }

      return Object.entries(params).reduce(
        (text, [paramKey, paramValue]) => text.replaceAll(`{${paramKey}}`, String(paramValue)),
        template
      );
    },
    [language]
  );

  const value = useMemo<I18nContextValue>(() => ({ language, isReady, setLanguage, t }), [isReady, language, setLanguage, t]);

  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider.');
  }

  return context;
}

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'ru';
}
