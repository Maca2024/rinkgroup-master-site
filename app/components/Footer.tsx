'use client';

import { useLanguage } from '../i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative py-14 border-t border-rose-gold/[0.04]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-0.5">
            <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.3em] text-rose-gold/25">
              RINK GROUP
            </span>
            <span className="font-[family-name:var(--font-serif)] text-[10px] tracking-[0.15em] text-cream/10 italic">
              Lumen Felicis
            </span>
          </div>

          <div className="flex items-center gap-5 text-cream/10 font-[family-name:var(--font-sans)] text-[9px] tracking-[0.25em] uppercase">
            <span>Helsinki</span>
            <span className="w-0.5 h-0.5 rounded-full bg-rose-gold/10" />
            <span>Amsterdam</span>
            <span className="w-0.5 h-0.5 rounded-full bg-rose-gold/10" />
            <span>Kuusamo</span>
          </div>

          <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.15em] text-cream/10">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}
