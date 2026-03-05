'use client';

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { ParticleLaurel } from './ParticleLaurel';
import { useLanguage } from '../i18n/LanguageContext';

// ─── Ambient light particle (floats upward behind content) ───────────────────

interface AmbientParticle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

function useAmbientParticles(count: number): AmbientParticle[] {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,          // percent across width
      size: 1 + Math.random() * 2.5,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
      opacity: 0.06 + Math.random() * 0.14,
      drift: (Math.random() - 0.5) * 60,   // horizontal drift px
    }));
  }, [count]);
}

// ─── Letter-by-letter text ────────────────────────────────────────────────────

interface LetterRevealProps {
  text: string;
  staggerMs?: number;
  startDelay?: number;
  className?: string;
}

function LetterReveal({ text, staggerMs = 40, startDelay = 0, className }: LetterRevealProps) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.5,
            delay: startDelay + (i * staggerMs) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Word-by-word text reveal ─────────────────────────────────────────────────

interface WordRevealProps {
  text: string;
  startDelay?: number;
  className?: string;
}

function WordReveal({ text, startDelay = 0, className }: WordRevealProps) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.8,
            delay: startDelay + i * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Scroll indicator (dot → line → arrow morphing cycle) ─────────────────────

function ScrollIndicator({ label }: { label: string }) {
  const [phase, setPhase] = useState<'dot' | 'line' | 'arrow'>('dot');

  useEffect(() => {
    const sequence: Array<'dot' | 'line' | 'arrow'> = ['dot', 'line', 'arrow'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % sequence.length;
      setPhase(sequence[index]);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.8, duration: 1 }}
      className="absolute bottom-8 md:bottom-12 z-10 flex flex-col items-center gap-3"
    >
      <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.5em] uppercase text-cream/15">
        {label}
      </span>

      <div className="flex flex-col items-center" style={{ height: 48 }}>
        <AnimatePresence mode="wait">
          {phase === 'dot' && (
            <motion.div
              key="dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              className="w-1.5 h-1.5 rounded-full bg-rose-gold/40"
            />
          )}

          {phase === 'line' && (
            <motion.div
              key="line"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-px bg-gradient-to-b from-rose-gold/40 to-transparent origin-top"
              style={{ height: 40 }}
            />
          )}

          {phase === 'arrow' && (
            <motion.div
              key="arrow"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-0.5"
            >
              <div className="w-px h-8 bg-gradient-to-b from-rose-gold/40 to-rose-gold/10" />
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 1L4 4.5L7 1" stroke="rgba(197,149,107,0.5)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Smooth spring for parallax feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  const logoScale    = useTransform(smoothProgress, [0, 0.5], [1, 0.7]);
  const logoOpacity  = useTransform(smoothProgress, [0, 0.6], [1, 0]);
  const logoY        = useTransform(smoothProgress, [0, 0.5], [0, -60]);
  const overlayOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);

  // Glow pulse amplitude behind logo
  const [glowPhase, setGlowPhase] = useState(0);
  useEffect(() => {
    let raf: number;
    const tick = (t: number) => {
      setGlowPhase(t * 0.001);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const glowSize = 55 + Math.sin(glowPhase) * 8;

  const [particleCount, setParticleCount] = useState(10);
  useEffect(() => {
    const update = () => setParticleCount(window.innerWidth < 768 ? 10 : 22);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);
  const ambientParticles = useAmbientParticles(particleCount);

  return (
    <section ref={ref} className="relative h-[140vh]">
      {/* Cinematic widescreen bars */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="h-[12px] md:h-[20px] bg-black" />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="h-[12px] md:h-[20px] bg-black" />
      </div>

      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden vignette">

        {/* Background: deep multi-source radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 55% at 50% 38%, rgba(28, 52, 100, 0.55) 0%, transparent 65%),
              radial-gradient(ellipse 35% 35% at 50% 38%, rgba(40, 68, 128, 0.30) 0%, transparent 50%),
              radial-gradient(ellipse 80% 30% at 50% 115%, rgba(197, 149, 107, 0.05) 0%, transparent 60%),
              radial-gradient(ellipse 45% 35% at 18% 18%, rgba(28, 48, 88, 0.32) 0%, transparent 65%),
              radial-gradient(ellipse 45% 35% at 82% 75%, rgba(28, 48, 88, 0.22) 0%, transparent 65%),
              radial-gradient(ellipse 25% 20% at 50% 55%, rgba(197, 149, 107, 0.04) 0%, transparent 50%),
              linear-gradient(180deg, #080E1A 0%, #0F1B33 38%, #142242 55%, #0F1B33 78%, #080E1A 100%)
            `,
          }}
        />

        {/* Particle wreath */}
        <ParticleLaurel />

        {/* Concentric pulse rings — beacon effect behind logo */}
        <div className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                border: '1px solid rgba(197,149,107,0.18)',
                width: 220,
                height: 220,
              }}
              animate={{
                scale: [0.4, 2.5],
                opacity: [0.06, 0],
              }}
              transition={{
                duration: 6,
                delay: i * 2,
                repeat: Infinity,
                ease: [0.16, 1, 0.3, 1],
                repeatDelay: 0,
              }}
            />
          ))}
        </div>

        {/* Ambient light particles (float upward) */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {ambientParticles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                bottom: '-10px',
                width: p.size,
                height: p.size,
                background: `rgba(197,149,107,1)`,
                opacity: p.opacity,
              }}
              animate={{
                y: [0, -900],
                x: [0, p.drift],
                opacity: [0, p.opacity, p.opacity * 0.5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Logo + content wrapper (parallax) */}
        <motion.div
          style={{ scale: logoScale, opacity: logoOpacity, y: logoY }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Golden breathing glow behind logo */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${glowSize * 4}px`,
              height: `${glowSize * 3}px`,
              background: `radial-gradient(ellipse at center, rgba(197,149,107,0.07) 0%, rgba(197,149,107,0.03) 40%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(20px)',
            }}
          />

          {/* Logo entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, filter: 'blur(30px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 3.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/logo-rinkgroup.png"
              alt="Rink Group — Lumen Felicis"
              width={500}
              height={350}
              priority
              className="w-56 md:w-72 lg:w-96 h-auto drop-shadow-[0_0_100px_rgba(197,149,107,0.18)]"
            />
          </motion.div>

          {/* Gold separator line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
            className="gold-line w-24 md:w-36 mt-8 mb-7"
          />

          {/* "Lumen Felicis" — letter by letter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.1 }}
            className="mb-5"
          >
            <LetterReveal
              text="Lumen Felicis"
              staggerMs={40}
              startDelay={2.3}
              className="font-[family-name:var(--font-display)] text-lg md:text-xl lg:text-2xl text-rose-gradient tracking-[0.25em]"
            />
          </motion.div>

          {/* Tagline — word by word */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 0.1 }}
            className="px-6 text-center"
          >
            <WordReveal
              text={t.hero.tagline}
              startDelay={3.1}
              className="font-[family-name:var(--font-sans)] text-[10px] md:text-xs tracking-[0.4em] uppercase text-cream/30"
            />
          </motion.div>

          {/* Established */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/20 italic mt-4"
          >
            {t.hero.established}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div style={{ opacity: logoOpacity }} className="absolute bottom-0 left-0 right-0 z-10 flex justify-center">
          <ScrollIndicator label={t.hero.scroll} />
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
