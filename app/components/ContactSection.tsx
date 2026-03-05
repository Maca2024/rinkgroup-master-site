'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  MotionValue,
  AnimatePresence,
} from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// ─── Aurora Background ────────────────────────────────────────────────────────

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <style>{`
        @keyframes aurora-1 {
          0%   { transform: translate(-10%, 20%) scale(1.1) rotate(0deg); }
          33%  { transform: translate(5%, -5%) scale(1.25) rotate(8deg); }
          66%  { transform: translate(-20%, 10%) scale(1.05) rotate(-5deg); }
          100% { transform: translate(-10%, 20%) scale(1.1) rotate(0deg); }
        }
        @keyframes aurora-2 {
          0%   { transform: translate(15%, -15%) scale(1.2) rotate(0deg); }
          40%  { transform: translate(-8%, 8%) scale(1.0) rotate(-10deg); }
          70%  { transform: translate(20%, -5%) scale(1.3) rotate(5deg); }
          100% { transform: translate(15%, -15%) scale(1.2) rotate(0deg); }
        }
        @keyframes aurora-3 {
          0%   { transform: translate(-5%, 5%) scale(1.15) rotate(0deg); }
          50%  { transform: translate(10%, -10%) scale(0.95) rotate(12deg); }
          100% { transform: translate(-5%, 5%) scale(1.15) rotate(0deg); }
        }
      `}</style>

      {/* Band 1 — rose-gold */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 40% at 30% 60%, rgba(197,149,107,0.07) 0%, transparent 70%)',
          animation: 'aurora-1 22s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      {/* Band 2 — navy-light / cool blue */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(28,48,88,0.12) 0%, transparent 65%)',
          animation: 'aurora-2 28s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      {/* Band 3 — rose-gold-pale */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 50% 35% at 50% 80%, rgba(232,205,181,0.05) 0%, transparent 65%)',
          animation: 'aurora-3 18s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

// ─── Shimmer Ring — bright dot orbiting a concentric ring ────────────────────

function ShimmerRing({
  size,
  scale,
  opacity,
  index,
}: {
  size: number;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  index: number;
}) {
  const duration = 6 + index * 2.5;
  const delay = index * 1.2;

  return (
    <motion.div
      style={{ scale, opacity }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      aria-hidden
    >
      {/* Static ring border */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `1px solid rgba(197,149,107,${0.5 - index * 0.12})`,
          position: 'relative',
        }}
      >
        {/* Orbiting shimmer dot */}
        <motion.div
          style={{
            position: 'absolute',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'rgba(232,205,181,0.9)',
            boxShadow: '0 0 8px 2px rgba(197,149,107,0.7)',
            top: '50%',
            left: '50%',
            marginTop: -2.5,
            marginLeft: -2.5,
            transformOrigin: `${-size / 2}px 0px`,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Typing Effect for email address ─────────────────────────────────────────

function TypingEmail({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isInView || done) return;

    // Short delay before typing starts
    const startDelay = setTimeout(() => {
      let i = 0;
      timerRef.current = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setDone(true);
        }
      }, 52);
    }, 350);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInView, text, done]);

  return (
    <span ref={ref} className="relative">
      {done ? text : displayed}
      {/* Blinking cursor while typing */}
      {!done && isInView && (
        <motion.span
          aria-hidden
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ marginLeft: 1, borderRight: '1.5px solid rgba(197,149,107,0.8)' }}
        />
      )}
    </span>
  );
}

// ─── Orbiting Particles around CTA (hover-activated) ─────────────────────────

function OrbitParticles({ active }: { active: boolean }) {
  const count = 10;

  return (
    <AnimatePresence>
      {active &&
        Array.from({ length: count }, (_, i) => {
          const angle = (i / count) * 360;
          const radius = 64 + (i % 3) * 14;
          const size = 1.5 + (i % 2) * 1.5;
          const duration = 2.8 + (i % 3) * 0.8;
          const delay = i * 0.04;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: size,
                height: size,
                background: `rgba(197,149,107,${0.3 + (i % 4) * 0.15})`,
                top: '50%',
                left: '50%',
                marginTop: -size / 2,
                marginLeft: -size / 2,
                transformOrigin: `${-radius}px 0px`,
                rotate: angle,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: [angle, angle + 360],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                rotate: { duration, delay, repeat: Infinity, ease: 'linear' },
              }}
            />
          );
        })}
    </AnimatePresence>
  );
}

// ─── Magnetic CTA Button ──────────────────────────────────────────────────────

function MagneticCTAButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [orbiting, setOrbiting] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 120, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 18 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = buttonRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = (e.clientX - left) / width - 0.5;
      const cy = (e.clientY - top) / height - 0.5;
      const dist = Math.sqrt(cx * cx + cy * cy);
      const maxDist = 0.8; // roughly 100px in normalized coords

      if (dist < maxDist) {
        // Tilt toward cursor
        rotateX.set(-cy * 18);
        rotateY.set(cx * 18);
      }
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setOrbiting(false);
  }, [rotateX, rotateY]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    // Listen on document to catch 100px radius outside button
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="relative inline-block"
    >
      {/* Orbit particles — shown on hover */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <OrbitParticles active={orbiting} />
      </div>

      <motion.a
        ref={buttonRef}
        href="mailto:info@rinkgroup.io"
        onMouseEnter={() => setOrbiting(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformPerspective: 600,
          border: '1px solid rgba(197,149,107,0.2)',
        }}
        whileTap={{ scale: 0.97 }}
        className="relative inline-flex items-center gap-5 px-12 py-6 group magnetic-glow overflow-hidden"
        data-magnetic
      >
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 20%, rgba(197,149,107,0.06) 50%, transparent 80%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
        />

        {/* Border glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
          style={{
            boxShadow:
              '0 0 0 1px rgba(197,149,107,0.55), 0 0 28px rgba(197,149,107,0.14), inset 0 0 20px rgba(197,149,107,0.04)',
          }}
        />

        <span className="relative font-[family-name:var(--font-sans)] text-sm tracking-[0.25em] uppercase text-rose-gold-light/80 group-hover:text-rose-gold-pale transition-colors duration-500">
          <TypingEmail text="info@rinkgroup.io" />
        </span>

        {/* Arrow → Envelope morph */}
        <span className="relative w-5 h-5 flex items-center justify-center">
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
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const ring1Scale = useTransform(scrollYProgress, [0.15, 0.75], [0, 1.4]);
  const ring2Scale = useTransform(scrollYProgress, [0.2, 0.8], [0, 1.8]);
  const ring3Scale = useTransform(scrollYProgress, [0.25, 0.85], [0, 2.3]);
  const ring1Opacity = useTransform(scrollYProgress, [0.15, 0.45, 0.75], [0, 0.08, 0]);
  const ring2Opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.05, 0]);
  const ring3Opacity = useTransform(scrollYProgress, [0.25, 0.55, 0.85], [0, 0.03, 0]);

  const { t } = useLanguage();

  const rings = [
    { scale: ring1Scale, opacity: ring1Opacity, size: 500 },
    { scale: ring2Scale, opacity: ring2Opacity, size: 500 },
    { scale: ring3Scale, opacity: ring3Opacity, size: 500 },
  ];

  return (
    <section id="contact" ref={ref} className="relative py-40 md:py-56 overflow-hidden">

      {/* Aurora bands */}
      <AuroraBackground />

      {/* Spotlight ray */}
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

      {/* Concentric rings with orbiting shimmer dots */}
      {rings.map(({ scale, opacity, size }, i) => (
        <ShimmerRing
          key={i}
          size={size}
          scale={scale}
          opacity={opacity}
          index={i}
        />
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

        {/* Headline */}
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

        {/* Magnetic CTA with typing email + orbiting particles */}
        <MagneticCTAButton />

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
