'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

export function PhilanthropySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const pawScale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1]);
  const pawOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.8], [0, 0.06, 0]);
  const { t, isRTL } = useLanguage();

  return (
    <section id="philanthropy" ref={ref} className="relative py-32 md:py-48 overflow-hidden">
      {/* Large paw print watermark */}
      <motion.div
        style={{ scale: pawScale, opacity: pawOpacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] md:text-[600px] select-none pointer-events-none"
        aria-hidden
      >
        🐾
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className={`mb-20 md:mb-28 ${isRTL ? 'text-right' : ''}`}
        >
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-4">
            {t.philanthropy.label}
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream">
            {t.philanthropy.title}{' '}
            <span className="text-rose-gradient italic">{t.philanthropy.titleAccent}</span>
          </h2>
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`font-[family-name:var(--font-serif)] text-xl md:text-2xl text-cream/40 leading-relaxed max-w-3xl mb-20 ${isRTL ? 'mr-0 ml-auto' : ''}`}
        >
          {t.philanthropy.intro}
        </motion.p>

        {/* Dog welfare card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="group relative border border-rose-gold/[0.08] hover:border-rose-gold/20 transition-all duration-700 magnetic-glow overflow-hidden"
        >
          {/* Warm glow background on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/[0.02] via-transparent to-rose-gold/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative grid md:grid-cols-12 gap-8 p-8 md:p-14">
            {/* Icon & Title */}
            <div className="md:col-span-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-6xl md:text-8xl mb-6 inline-block"
              >
                🐕
              </motion.div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-rose-gold-light/80 italic mb-2">
                {t.philanthropy.dogTitle}
              </h3>
              <div className="flex items-center gap-4 mt-6">
                <span className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-rose-gold/25 group-hover:text-rose-gold/50 transition-colors duration-500">
                  {t.philanthropy.dogStat}
                </span>
                <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.25em] uppercase text-cream/20">
                  {t.philanthropy.dogStatLabel}
                </span>
              </div>
            </div>

            {/* Body text */}
            <div className="md:col-span-8">
              <p className="font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/40 leading-relaxed group-hover:text-cream/60 transition-colors duration-500 mb-10">
                {t.philanthropy.dogBody}
              </p>

              {/* Gandhi quote */}
              <div className="ornament max-w-lg mb-8">
                <span className="font-[family-name:var(--font-serif)] text-rose-gold/15 text-xs">✦</span>
              </div>
              <blockquote className="font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/25 italic leading-relaxed">
                {t.philanthropy.quote}
              </blockquote>
            </div>
          </div>

          {/* Hover shimmer line */}
          <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
        </motion.div>

        {/* Small paw prints trail */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-16 text-cream/[0.06]"
        >
          {['🐾', '🐾', '🐾', '🐾', '🐾'].map((paw, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.12 }}
              className="text-lg md:text-xl"
              style={{ transform: `rotate(${(i - 2) * 8}deg)` }}
            >
              {paw}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
