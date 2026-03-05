'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

export function PillarsSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section id="ventures" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className={`mb-20 md:mb-28 ${isRTL ? 'text-left' : 'text-right'}`}
        >
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-4">
            {t.pillars.label}
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream">
            {t.pillars.title} <span className="text-rose-gradient italic">{t.pillars.titleAccent}</span>
          </h2>
        </motion.div>

        {/* Pillar cards */}
        <div className="space-y-px">
          {t.pillars.items.map((p, i) => (
            <PillarCard key={p.number} pillar={p} index={i} isRTL={isRTL} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index, isRTL }: {
  pillar: { number: string; title: string; subtitle: string; body: string; stat: string; statLabel: string };
  index: number;
  isRTL: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 0.5], [index % 2 === 0 ? -30 : 30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ x, opacity }}
      className="group relative border-t border-rose-gold/[0.08] py-12 md:py-16 hover:bg-rose-gold/[0.015] transition-colors duration-700"
    >
      <div className={`grid grid-cols-12 gap-4 md:gap-6 items-start ${isRTL ? 'direction-rtl' : ''}`}>
        {/* Number */}
        <div className="col-span-2 md:col-span-1">
          <span className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-rose-gold/[0.12] group-hover:text-rose-gold/30 transition-colors duration-700">
            {pillar.number}
          </span>
        </div>

        {/* Title + Subtitle */}
        <div className="col-span-10 md:col-span-3">
          <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream group-hover:text-rose-gold-light transition-colors duration-500">
            {pillar.title}
          </h3>
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.25em] uppercase text-rose-gold/40 mt-1 block">
            {pillar.subtitle}
          </span>
        </div>

        {/* Description */}
        <p className={`col-span-12 md:col-span-5 font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/35 leading-relaxed group-hover:text-cream/55 transition-colors duration-500 ${isRTL ? 'text-right' : ''}`}>
          {pillar.body}
        </p>

        {/* Stat */}
        <div className={`col-span-12 md:col-span-3 ${isRTL ? 'md:text-left' : 'md:text-right'}`}>
          <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-rose-gold/15 group-hover:text-rose-gold/40 transition-colors duration-500">
            {pillar.stat}
          </span>
          <span className="block font-[family-name:var(--font-sans)] text-[9px] tracking-[0.25em] uppercase text-cream/15 mt-1">
            {pillar.statLabel}
          </span>
        </div>
      </div>

      {/* Hover line accent */}
      <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
    </motion.div>
  );
}
