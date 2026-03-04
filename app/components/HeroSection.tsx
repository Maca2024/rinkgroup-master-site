'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ParticleLaurel } from './ParticleLaurel';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Deep radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 40%, rgba(28, 48, 88, 0.6) 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(197, 149, 107, 0.05) 0%, transparent 50%),
            linear-gradient(180deg, #0B1629 0%, #142242 50%, #0B1629 100%)
          `,
        }}
      />

      {/* Particle laurel wreath */}
      <ParticleLaurel />

      {/* Logo image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mb-8"
      >
        <Image
          src="/logo-rinkgroup.png"
          alt="Rink Group"
          width={500}
          height={350}
          priority
          className="w-64 md:w-80 lg:w-[420px] h-auto drop-shadow-[0_0_60px_rgba(197,149,107,0.15)]"
        />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 font-[family-name:var(--font-sans)] text-sm md:text-base tracking-[0.3em] uppercase text-cream/40 text-center px-6"
      >
        Strategic Ventures &middot; Nordic Heritage &middot; Global Ambition
      </motion.p>

      {/* Gold divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 gold-line w-32 md:w-48 mt-8"
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.4em] uppercase text-cream/25">
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-rose-gold/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
