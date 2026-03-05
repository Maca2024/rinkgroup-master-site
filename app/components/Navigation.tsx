'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { label: t.nav.vision, href: '#vision' },
    { label: t.nav.ventures, href: '#ventures' },
    { label: t.nav.heritage, href: '#heritage' },
    { label: t.nav.philanthropy, href: '#philanthropy' },
    { label: 'The Founder', href: '/marco' },
    { label: t.nav.contact, href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 2, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'glass-navy py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.2em] text-rose-gold-light group-hover:text-rose-gold-pale transition-colors duration-500">
              RINK GROUP
            </span>
          </a>

          {/* Desktop links + language switcher */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.1 }}
                className="font-[family-name:var(--font-sans)] text-sm tracking-[0.15em] uppercase text-cream/60 hover:text-rose-gold-light transition-colors duration-500 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-rose-gold group-hover:w-full transition-all duration-500" />
              </motion.a>
            ))}
            <div className="border-l border-rose-gold/10 pl-4 ml-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
              className="w-6 h-px bg-rose-gold-light block"
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              className="w-6 h-px bg-rose-gold-light block"
            />
            <motion.span
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
              className="w-6 h-px bg-rose-gold-light block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-deep/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setMobileOpen(false)}
                className="font-[family-name:var(--font-display)] text-3xl tracking-[0.15em] text-rose-gold-light hover:text-rose-gold-pale transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
