'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// Floating golden particle around the CTA
function GoldParticle({ index }: { index: number }) {
  const angle = (index / 12) * 360;
  const radius = 90 + (index % 3) * 30;
  const rad = (angle * Math.PI) / 180;
  const cx = Math.cos(rad) * radius;
  const cy = Math.sin(rad) * radius;
  const size = 1.5 + (index % 2);
  const duration = 4 + (index % 6);
  const delay = index * 0.3;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `calc(50% + ${cx}px)`,
        top: `calc(50% + ${cy}px)`,
        background: `rgba(197,149,107,${0.15 + (index % 4) * 0.1})`,
      }}
      animate={{
        x: [0, Math.cos(rad + 0.5) * 12, 0],
        y: [0, Math.sin(rad + 0.5) * 12, 0],
        opacity: [0.3, 0.9, 0.3],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Three concentric rings at different speeds
  const ring1Scale = useTransform(scrollYProgress, [0.15, 0.75], [0, 1.4]);
  const ring2Scale = useTransform(scrollYProgress, [0.2, 0.8], [0, 1.8]);
  const ring3Scale = useTransform(scrollYProgress, [0.25, 0.85], [0, 2.3]);
  const ring1Opacity = useTransform(scrollYProgress, [0.15, 0.45, 0.75], [0, 0.08, 0]);
  const ring2Opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.05, 0]);
  const ring3Opacity = useTransform(scrollYProgress, [0.25, 0.55, 0.85], [0, 0.03, 0]);

  const { t } = useLanguage();

  return (
    <section id="contact" ref={ref} className="relative py-40 md:py-56 overflow-hidden">

      {/* Spotlight ray from above — golden light streak */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        aria-hidden
        style={{
          width: '1px',
          height: '55%',
          background:
            'linear-gradient(180deg, rgba(197,149,107,0.18) 0%, rgba(197,149,107,0.06) 40%, transparent 100%)',
          filter: 'blur(18px)',
          transform: 'translateX(-50%) scaleX(60)',
        }}
      />

      {/* Three expanding concentric rings */}
      {[
        { scale: ring1Scale, opacity: ring1Opacity },
        { scale: ring2Scale, opacity: ring2Opacity },
        { scale: ring3Scale, opacity: ring3Opacity },
      ].map(({ scale, opacity }, i) => (
        <motion.div
          key={i}
          style={{ scale, opacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          aria-hidden
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              border: `1px solid rgba(197,149,107,${0.5 - i * 0.12})`,
            }}
          />
        </motion.div>
      ))}

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-8"
        >
          {t.contact.label}
        </motion.span>

        {/* Headline — blur + translateY + opacity entrance */}
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: 'blur(16px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream leading-[1.1] mb-6"
        >
          {t.contact.title}{' '}
          <span className="text-rose-gradient italic">{t.contact.titleAccent}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-cream/30 max-w-md mx-auto mb-16"
        >
          {t.contact.body}
        </motion.p>

        {/* CTA — golden shimmer border + envelope icon morph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block"
        >
          {/* Floating golden particles around CTA */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {Array.from({ length: 12 }, (_, i) => (
              <GoldParticle key={i} index={i} />
            ))}
          </div>

          <motion.a
            href="mailto:info@rinkgroup.io"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-flex items-center gap-5 px-12 py-6 group magnetic-glow overflow-hidden"
            data-magnetic
            style={{
              border: '1px solid rgba(197,149,107,0.2)',
            }}
          >
            {/* Shimmer sweep on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  'linear-gradient(105deg, transparent 20%, rgba(197,149,107,0.06) 50%, transparent 80%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
            />

            {/* Animated golden border glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
              style={{
                boxShadow:
                  '0 0 0 1px rgba(197,149,107,0.5), 0 0 20px rgba(197,149,107,0.12), inset 0 0 20px rgba(197,149,107,0.04)',
              }}
            />

            <span className="relative font-[family-name:var(--font-sans)] text-sm tracking-[0.25em] uppercase text-rose-gold-light/80 group-hover:text-rose-gold-pale transition-colors duration-500">
              info@rinkgroup.io
            </span>

            {/* Arrow that morphs to envelope on hover — CSS group controls opacity */}
            <span className="relative w-5 h-5 flex items-center justify-center">
              {/* Arrow — visible by default, fades out on group hover */}
              <svg
                className="absolute w-4 h-4 text-rose-gold/50 group-hover:text-rose-gold group-hover:opacity-0 group-hover:translate-x-1 transition-all duration-300 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
              {/* Envelope — hidden by default, fades in on group hover */}
              <svg
                className="absolute w-4 h-4 text-rose-gold opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </span>
          </motion.a>
        </motion.div>

        {/* Animated ornament */}
        <div className="ornament max-w-xs mx-auto mt-20">
          <motion.span
            className="font-[family-name:var(--font-serif)] text-rose-gold/10 text-sm"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            ✦
          </motion.span>
        </div>
      </div>
    </section>
  );
}
