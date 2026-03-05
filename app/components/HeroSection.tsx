'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { ParticleLaurel } from './ParticleLaurel';
import { useLanguage } from '../i18n/LanguageContext';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const logoScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const logoY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const overlayOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
  const { t } = useLanguage();

  return (
    <section ref={ref} className="relative h-[140vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden vignette">
        {/* Deep cinematic gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 50% 45% at 50% 38%, rgba(28, 48, 88, 0.5) 0%, transparent 70%),
              radial-gradient(ellipse 100% 40% at 50% 110%, rgba(197, 149, 107, 0.03) 0%, transparent 50%),
              radial-gradient(ellipse 40% 30% at 20% 20%, rgba(28, 48, 88, 0.3) 0%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 80% 70%, rgba(28, 48, 88, 0.2) 0%, transparent 60%),
              linear-gradient(180deg, #080E1A 0%, #0F1B33 40%, #142242 60%, #0F1B33 80%, #080E1A 100%)
            `,
          }}
        />

        {/* Particle wreath */}
        <ParticleLaurel />

        {/* Logo with parallax */}
        <motion.div
          style={{ scale: logoScale, opacity: logoOpacity, y: logoY }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/logo-rinkgroup.png"
              alt="Rink Group — Lumen Felicis"
              width={500}
              height={350}
              priority
              className="w-56 md:w-72 lg:w-96 h-auto drop-shadow-[0_0_80px_rgba(197,149,107,0.12)]"
            />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          style={{ opacity: logoOpacity }}
          className="relative z-10 mt-10 flex flex-col items-center"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="gold-line w-20 md:w-32 mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="font-[family-name:var(--font-sans)] text-[10px] md:text-xs tracking-[0.4em] uppercase text-cream/30 text-center px-6"
          >
            {t.hero.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.6 }}
            className="font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/20 italic mt-4"
          >
            {t.hero.established}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          style={{ opacity: logoOpacity }}
          className="absolute bottom-8 md:bottom-12 z-10 flex flex-col items-center"
        >
          <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.5em] uppercase text-cream/15 mb-3">
            {t.hero.scroll}
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-rose-gold/30 to-transparent"
          />
        </motion.div>

        {/* Scroll fade overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-navy-deep z-20 pointer-events-none"
        />
      </div>
    </section>
  );
}
