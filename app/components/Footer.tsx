'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function Footer() {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch/mobile device — only runs on client
  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    );
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const year = new Date().getFullYear();

  return (
    <footer
      className="relative py-14 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated golden gradient line at the top (replaces static border) */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden" aria-hidden>
        <motion.div
          className="shimmer absolute inset-0"
          style={{ opacity: 0.35 }}
          animate={{ backgroundPosition: ['300% 0', '-300% 0'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Soft glow layer above the line */}
        <div
          className="absolute inset-x-0 top-0 h-4 -translate-y-1/2 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(197,149,107,0.08) 30%, rgba(197,149,107,0.15) 50%, rgba(197,149,107,0.08) 70%, transparent 100%)',
            filter: 'blur(4px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">

          {/* Brand block */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.3em] text-rose-gold/30">
              RINK GROUP
            </span>

            {/* Breathing rose-gold dot between brand and motto */}
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1 h-1 rounded-full"
                style={{ background: 'rgba(197,149,107,0.6)' }}
                animate={{
                  scale: [1, 1.7, 1],
                  opacity: [0.5, 1, 0.5],
                  boxShadow: [
                    '0 0 0px rgba(197,149,107,0)',
                    '0 0 6px rgba(197,149,107,0.7)',
                    '0 0 0px rgba(197,149,107,0)',
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="font-[family-name:var(--font-serif)] text-[10px] tracking-[0.15em] text-cream/10 italic">
                Lumen Felicis
              </span>
            </div>
          </div>

          {/* Cities */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 font-[family-name:var(--font-sans)] text-[9px] tracking-[0.25em] uppercase">
            {['Helsinki', 'Amsterdam', 'Kuusamo'].map((city, i) => (
              <div key={city} className="flex items-center gap-3 md:gap-5">
                <motion.span
                  className="text-cream/10 cursor-default"
                  whileHover={{
                    color: 'rgba(197,149,107,0.5)',
                    textShadow: '0 0 14px rgba(197,149,107,0.35)',
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {city}
                </motion.span>
                {i < 2 && (
                  <span className="w-0.5 h-0.5 rounded-full bg-rose-gold/10 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Copyright + back-to-top */}
          <div className="flex items-center gap-4">
            {/* Copyright with shimmer on hover */}
            <motion.span
              className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.15em] text-cream/10 relative overflow-hidden"
              whileHover={{ color: 'rgba(197,149,107,0.3)' }}
              transition={{ duration: 0.4 }}
            >
              &copy;{' '}
              <motion.span
                className="shimmer inline-block"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {year}
              </motion.span>{' '}
              {t.footer.copyright}
            </motion.span>

            {/* Back to top — hover-triggered on desktop, always visible on touch */}
            <AnimatePresence initial={false}>
              {(isHovered || isTouchDevice) && (
                <motion.button
                  key="back-to-top"
                  onClick={scrollToTop}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center w-7 h-7 border border-rose-gold/15 hover:border-rose-gold/40 active:border-rose-gold/60 transition-all duration-400 group magnetic-glow touch-manipulation"
                  aria-label="Back to top"
                >
                  <motion.svg
                    className="w-3 h-3 text-rose-gold/30 group-hover:text-rose-gold/70 transition-colors duration-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    whileHover={{ y: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </motion.svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
}
