'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import type { Locale } from '../i18n/translations';

const locales: Locale[] = ['en', 'nl', 'fi', 'ar'];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc) => (
        <motion.button
          key={loc}
          onClick={() => setLocale(loc)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`px-2 py-1 font-[family-name:var(--font-sans)] text-[9px] tracking-[0.2em] uppercase transition-colors duration-500 ${
            locale === loc
              ? 'text-rose-gold-light border-b border-rose-gold/40'
              : 'text-cream/30 hover:text-cream/60'
          }`}
        >
          {t.langSwitch[loc]}
        </motion.button>
      ))}
    </div>
  );
}
