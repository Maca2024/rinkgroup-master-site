'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { type Locale, type Translations, translations } from './translations';

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rg-locale', newLocale);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('rg-locale') as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const isRTL = locale === 'ar';

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
