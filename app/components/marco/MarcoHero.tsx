'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function MarcoHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.9], [0, 1]);

  return (
    <section ref={ref} className="relative h-[160vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Layered cinematic background — misty Drenthe moorland */}
        <div className="absolute inset-0">
          {/* Base gradient — peat brown to navy */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg,
                  #0a0806 0%,
                  #1a1510 15%,
                  #2a2218 30%,
                  #1a1812 50%,
                  #0f1520 70%,
                  #080E1A 100%
                )
              `,
            }}
          />

          {/* Mist layers */}
          <motion.div
            animate={{ x: [0, 30, 0], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 120% 40% at 30% 60%, rgba(200,180,150,0.08) 0%, transparent 70%)',
            }}
          />
          <motion.div
            animate={{ x: [0, -20, 0], opacity: [0.02, 0.05, 0.02] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 100% 30% at 70% 70%, rgba(200,180,150,0.06) 0%, transparent 60%)',
            }}
          />

          {/* Horizon glow — distant peat fire */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 15% at 50% 85%, rgba(197,149,107,0.06) 0%, transparent 60%)',
            }}
          />

          {/* Stars */}
          <div className="absolute inset-0">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px h-px bg-cream/30 rounded-full"
                style={{
                  left: `${(i * 17 + 3) % 100}%`,
                  top: `${(i * 13 + 7) % 45}%`,
                }}
                animate={{ opacity: [0.1, 0.6, 0.1] }}
                transition={{
                  duration: 3 + (i % 4),
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,14,26,0.8)_100%)]" />

        {/* Text content */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          {/* Small label */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.6em] uppercase text-rose-gold/40 block mb-8"
          >
            The Founder
          </motion.span>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-[family-name:var(--font-display)] text-6xl md:text-8xl lg:text-9xl font-light text-cream mb-4"
          >
            Marco <span className="text-rose-gradient italic">Rink</span>
          </motion.h1>

          {/* Gold line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.8 }}
            className="gold-line w-24 md:w-40 mx-auto mb-8"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-cream/30 italic max-w-lg mx-auto"
          >
            Van de Drentse veengronden tot de Finse wildernis — een reis door dienst, avontuur en innerlijke transformatie
          </motion.p>

          {/* Origin marker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.4em] uppercase text-cream/15">
              Klazienaveen, Drenthe
            </span>
            <span className="w-1 h-1 rounded-full bg-rose-gold/20" />
            <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.4em] uppercase text-cream/15">
              NL
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          style={{ opacity: textOpacity }}
          className="absolute bottom-10 z-10 flex flex-col items-center"
        >
          <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.5em] uppercase text-cream/15 mb-3">
            Ontdek het verhaal
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-px h-10 bg-gradient-to-b from-rose-gold/30 to-transparent"
          />
        </motion.div>

        {/* Scroll fade */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-navy-deep z-20 pointer-events-none"
        />
      </div>
    </section>
  );
}
