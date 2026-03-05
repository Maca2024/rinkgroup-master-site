'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const circleScale = useTransform(scrollYProgress, [0.2, 0.7], [0, 1.5]);
  const circleOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.04, 0]);
  const { t } = useLanguage();

  return (
    <section id="contact" ref={ref} className="relative py-40 md:py-56 overflow-hidden">
      {/* Expanding radial behind */}
      <motion.div
        style={{ scale: circleScale, opacity: circleOpacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        aria-hidden
      >
        <div className="w-full h-full rounded-full border border-rose-gold" />
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-8"
        >
          {t.contact.label}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream leading-[1.1] mb-6"
        >
          {t.contact.title} <span className="text-rose-gradient italic">{t.contact.titleAccent}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-cream/30 max-w-md mx-auto mb-14"
        >
          {t.contact.body}
        </motion.p>

        {/* CTA */}
        <motion.a
          href="mailto:info@rinkgroup.io"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-5 px-12 py-6 border border-rose-gold/20 hover:border-rose-gold/50 hover:bg-rose-gold/[0.03] transition-all duration-700 group magnetic-glow"
          data-magnetic
        >
          <span className="font-[family-name:var(--font-sans)] text-sm tracking-[0.25em] uppercase text-rose-gold-light/80 group-hover:text-rose-gold-pale transition-colors duration-500">
            info@rinkgroup.io
          </span>
          <svg
            className="w-4 h-4 text-rose-gold/40 group-hover:text-rose-gold group-hover:translate-x-1.5 transition-all duration-500 rtl:rotate-180"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </motion.a>

        {/* Ornamental bottom */}
        <div className="ornament max-w-xs mx-auto mt-20">
          <span className="font-[family-name:var(--font-serif)] text-rose-gold/10 text-xs">✦</span>
        </div>
      </div>
    </section>
  );
}
