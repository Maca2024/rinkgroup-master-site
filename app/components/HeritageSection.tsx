'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

export function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const quoteY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const { t, isRTL } = useLanguage();

  return (
    <section id="heritage" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Central vertical line */}
      <motion.div
        style={{ scaleY: lineScale, transformOrigin: 'top' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-rose-gold/[0.08] to-transparent"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Quote */}
        <motion.div className="text-center mb-32 md:mb-40" style={{ y: quoteY }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-10"
          >
            {t.heritage.label}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <p className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl text-rose-gradient italic font-light">
              {t.heritage.motto}
            </p>
            <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-cream/25 mt-6 tracking-wide">
              {t.heritage.mottoTranslation}
            </p>
          </motion.div>

          <div className="ornament max-w-xs mx-auto mt-12">
            <span className="font-[family-name:var(--font-serif)] text-rose-gold/20 text-xs tracking-[0.3em]">✦</span>
          </div>
        </motion.div>

        {/* Values — staggered asymmetric layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {t.heritage.values.map((v, i) => (
            <motion.div
              key={v.latin}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative p-8 md:p-12 border border-rose-gold/[0.05] hover:border-rose-gold/[0.12] transition-all duration-700 magnetic-glow ${
                i % 2 === 1 ? 'md:mt-16' : ''
              }`}
            >
              {/* Corner ornament */}
              <span className={`absolute top-3 font-[family-name:var(--font-serif)] text-lg text-rose-gold/[0.08] group-hover:text-rose-gold/20 transition-colors duration-700 ${isRTL ? 'left-4' : 'right-4'}`}>
                {v.icon}
              </span>

              <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-rose-gold-light/80 italic block mb-1">
                {v.latin}
              </span>
              <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.35em] uppercase text-cream/20 block mb-6">
                {v.english}
              </span>
              <p className={`font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/35 leading-relaxed group-hover:text-cream/55 transition-colors duration-500 ${isRTL ? 'text-right' : ''}`}>
                {v.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Locations with connecting dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-center gap-4 md:gap-8 mt-28 md:mt-36"
        >
          {['Helsinki', 'Amsterdam', 'Kuusamo'].map((city, i) => (
            <div key={city} className="flex items-center gap-4 md:gap-8">
              <div className="text-center">
                <span className="font-[family-name:var(--font-display)] text-base md:text-lg text-cream/20 hover:text-rose-gold/40 transition-colors duration-500">
                  {city}
                </span>
              </div>
              {i < 2 && (
                <span className="text-rose-gold/10 text-[8px]">◆</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
