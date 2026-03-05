'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function TypewriterText({ text, delay = 0, speed = 40 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-rose-gold/60 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

function GlitchText({ children, className }: { children: string; className?: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className || ''}`}>
      <span className="relative z-10">{children}</span>
      {glitching && (
        <>
          <span
            className="absolute top-0 left-0 z-20 text-cyan-400/40"
            style={{ transform: 'translate(-2px, -1px)', clipPath: 'inset(20% 0 40% 0)' }}
          >
            {children}
          </span>
          <span
            className="absolute top-0 left-0 z-20 text-rose-gold/30"
            style={{ transform: 'translate(2px, 1px)', clipPath: 'inset(50% 0 10% 0)' }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}

export function MarcoHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.9], [0, 1]);
  const scaleText = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const blurValue = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

  return (
    <section ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic widescreen bars */}
        <div className="absolute top-0 left-0 right-0 h-16 md:h-24 bg-black z-30" />
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-black z-30" />

        {/* Layered atmospheric background */}
        <div className="absolute inset-0">
          {/* Peat-to-navy gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg,
                  #050403 0%,
                  #1a1510 12%,
                  #2a2218 25%,
                  #1a1812 40%,
                  #0f1520 60%,
                  #080E1A 80%,
                  #060a10 100%
                )
              `,
            }}
          />

          {/* Volumetric fog layers */}
          <motion.div
            animate={{ x: [0, 50, 0], opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 150% 40% at 20% 65%, rgba(200,180,150,0.1) 0%, transparent 70%)',
            }}
          />
          <motion.div
            animate={{ x: [0, -40, 0], opacity: [0.02, 0.07, 0.02] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 120% 30% at 75% 70%, rgba(200,180,150,0.08) 0%, transparent 60%)',
            }}
          />
          <motion.div
            animate={{ x: [20, -20, 20], opacity: [0.01, 0.04, 0.01] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 100% 50% at 50% 75%, rgba(180,160,130,0.05) 0%, transparent 60%)',
            }}
          />

          {/* Distant horizon glow — peat fire */}
          <motion.div
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 100% 12% at 50% 88%, rgba(197,149,107,0.1) 0%, transparent 60%)',
            }}
          />

          {/* Deep stars field */}
          <div className="absolute inset-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${(i * 17.3 + 3.7) % 100}%`,
                  top: `${(i * 13.1 + 2.3) % 50}%`,
                  width: i % 7 === 0 ? '2px' : '1px',
                  height: i % 7 === 0 ? '2px' : '1px',
                  backgroundColor: i % 11 === 0 ? 'rgba(197,149,107,0.4)' : 'rgba(245,240,232,0.3)',
                }}
                animate={{ opacity: [0.05, i % 5 === 0 ? 0.8 : 0.5, 0.05] }}
                transition={{
                  duration: 2.5 + (i % 5) * 0.8,
                  repeat: Infinity,
                  delay: i * 0.12,
                }}
              />
            ))}
          </div>

          {/* Shooting star — occasional */}
          <motion.div
            className="absolute w-20 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(245,240,232,0.6), transparent)',
              top: '15%',
              left: '60%',
              transform: 'rotate(-25deg)',
            }}
            animate={{
              x: [-200, 400],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 12,
              ease: 'easeOut',
            }}
          />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,4,3,0.9)_100%)]" />

        {/* Text content */}
        <motion.div
          style={{
            y: textY,
            opacity: textOpacity,
            scale: scaleText,
            filter: blurValue.get() > 0 ? `blur(${blurValue.get()}px)` : undefined,
          }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          {/* Coordinates */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.3 }}
            className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.8em] uppercase text-cream/10 mb-10 font-mono"
          >
            <TypewriterText text="52.7°N  6.9°E  ·  KLAZIENAVEEN, NL" delay={500} speed={30} />
          </motion.div>

          {/* Small label */}
          <motion.span
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.6em] uppercase text-rose-gold/50 block mb-8"
          >
            The Founder
          </motion.span>

          {/* Name — cinematic reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 2.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-[family-name:var(--font-display)] text-7xl md:text-9xl lg:text-[10rem] font-light text-cream mb-4 leading-[0.85]"
          >
            <GlitchText>Marco</GlitchText>{' '}
            <span className="text-rose-gradient italic">
              <GlitchText>Rink</GlitchText>
            </span>
          </motion.h1>

          {/* Animated gold line — expands from center */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 3 }}
            className="mx-auto mb-8 h-px w-40 md:w-64"
            style={{
              background: 'linear-gradient(90deg, transparent, #C5956B, #E8CDB5, #C5956B, transparent)',
            }}
          />

          {/* Subtitle — typewriter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.5 }}
            className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-cream/25 italic max-w-2xl mx-auto"
          >
            <TypewriterText
              text="Van de Drentse veengronden tot de Finse wildernis — een reis door dienst, avontuur en innerlijke transformatie"
              delay={4000}
              speed={25}
            />
          </motion.p>

          {/* Life chapter markers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 7, duration: 2 }}
            className="mt-16 flex items-center justify-center gap-3 flex-wrap"
          >
            {['Marinier', 'Beveiliger', 'Ondernemer', 'Ademcoach', 'Filosoof', 'Bouwer'].map((role, i) => (
              <motion.span
                key={role}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 7.5 + i * 0.2, duration: 0.6 }}
                className="font-[family-name:var(--font-sans)] text-[8px] tracking-[0.3em] uppercase text-cream/12 px-3 py-1 border border-cream/[0.04] hover:border-rose-gold/20 hover:text-rose-gold/30 transition-all duration-500"
              >
                {role}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator — morphing arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 9 }}
          style={{ opacity: textOpacity }}
          className="absolute bottom-28 z-10 flex flex-col items-center"
        >
          <span className="font-[family-name:var(--font-sans)] text-[8px] tracking-[0.6em] uppercase text-cream/12 mb-4">
            Scroll om te ontdekken
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-px h-8 bg-gradient-to-b from-rose-gold/30 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-rose-gold/20" />
          </motion.div>
        </motion.div>

        {/* Scroll fade overlay */}
        <motion.div
          style={{ opacity: overlayOpacity, background: '#060a10' }}
          className="absolute inset-0 z-20 pointer-events-none"
        />
      </div>
    </section>
  );
}
