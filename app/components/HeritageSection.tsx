'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// ─── Dust Particle ────────────────────────────────────────────────────────────

function DustParticle({ index }: { index: number }) {
  const x = 5 + ((index * 37 + 11) % 90);
  const y = 10 + ((index * 53 + 7) % 80);
  const size = 1 + (index % 3);
  const duration = 6 + (index % 8);
  const delay = (index * 0.7) % 5;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `rgba(197,149,107,${0.06 + (index % 4) * 0.04})`,
      }}
      animate={{
        y: [0, -18, 0, 8, 0],
        x: [0, 6, -4, 2, 0],
        opacity: [0.3, 0.8, 0.4, 0.9, 0.3],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ─── Sacred Geometry — Flower of Life ────────────────────────────────────────

function FlowerOfLife({ visible }: { visible: boolean }) {
  // One central circle + 6 surrounding at radius r
  const r = 40;
  const cx = 200;
  const cy = 200;
  const offsets = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  // Second ring: 6 more at distance 2r, at 30° offset
  const outerOffsets = Array.from({ length: 6 }, (_, i) => {
    const angle = ((i * 60 + 30) * Math.PI) / 180;
    return { x: cx + Math.cos(angle) * r * 1.73, y: cy + Math.sin(angle) * r * 1.73 };
  });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden
      initial={{ opacity: 0, scale: 0.92 }}
      animate={
        visible
          ? {
              opacity: 1,
              scale: [0.98, 1.02, 0.98],
              transition: {
                opacity: { duration: 2, ease: 'easeOut' },
                scale: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 },
              },
            }
          : { opacity: 0 }
      }
    >
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '80vw', maxHeight: '80vw' }}
      >
        {/* Central circle */}
        <circle cx={cx} cy={cy} r={r} stroke="rgba(197,149,107,0.18)" strokeWidth="0.5" fill="none" />
        {/* Inner ring */}
        {offsets.map((o, i) => (
          <circle key={`in-${i}`} cx={o.x} cy={o.y} r={r} stroke="rgba(197,149,107,0.12)" strokeWidth="0.5" fill="none" />
        ))}
        {/* Outer ring */}
        {outerOffsets.map((o, i) => (
          <circle key={`out-${i}`} cx={o.x} cy={o.y} r={r} stroke="rgba(197,149,107,0.06)" strokeWidth="0.5" fill="none" />
        ))}
        {/* Enclosing large circle */}
        <circle cx={cx} cy={cy} r={r * 2} stroke="rgba(197,149,107,0.05)" strokeWidth="0.5" fill="none" />
        <circle cx={cx} cy={cy} r={r * 3} stroke="rgba(197,149,107,0.03)" strokeWidth="0.5" fill="none" />
      </svg>
    </motion.div>
  );
}

// ─── Light-Sweep Motto ────────────────────────────────────────────────────────

function MottoWithLightSweep({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <span ref={ref} className="relative inline-block">
      {/* Base shimmer text */}
      <span
        className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl italic font-light shimmer"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {text}
      </span>

      {/* Light-sweep overlay — fires once on entrance */}
      {isInView && (
        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 20%, rgba(232,205,181,0.55) 48%, rgba(255,240,210,0.7) 50%, rgba(232,205,181,0.55) 52%, transparent 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '300% 100%',
          }}
          initial={{ backgroundPosition: '200% 0' }}
          animate={{ backgroundPosition: '-100% 0' }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      )}
    </span>
  );
}

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = (e.clientX - left) / width - 0.5;
      const cy = (e.clientY - top) / height - 0.5;
      rotateX.set(-cy * 10);
      rotateY.set(cx * 10);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Value Card with Domino Entrance + Border Glow Pulse ─────────────────────

function ValueCard({
  v,
  index,
  isRTL,
}: {
  v: { latin: string; english: string; icon: string; text: string };
  index: number;
  isRTL: boolean;
}) {
  const [hasEntered, setHasEntered] = useState(false);

  const dominoVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotate: index % 2 === 0 ? -4 : 4,
      x: index % 2 === 0 ? -12 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      x: 0,
      transition: {
        duration: 0.9,
        delay: index * 0.18,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      variants={dominoVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      onAnimationComplete={() => setHasEntered(true)}
      className={index % 2 === 1 ? 'md:mt-16' : ''}
    >
      <TiltCard className="group relative p-8 md:p-12 border border-[#C5956B]/[0.07] hover:border-[#C5956B]/25 transition-all duration-700 magnetic-glow overflow-hidden">
        {/* Entrance border glow pulse — fires once after card settles */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          initial={{ opacity: 0 }}
          animate={
            hasEntered
              ? {
                  opacity: [0, 1, 0],
                  transition: { duration: 1.4, delay: 0.1, ease: 'easeInOut' },
                }
              : {}
          }
          style={{
            boxShadow:
              '0 0 0 1px rgba(197,149,107,0.55), 0 0 28px rgba(197,149,107,0.18), inset 0 0 20px rgba(197,149,107,0.08)',
          }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            boxShadow:
              'inset 0 0 30px rgba(197,149,107,0.06), 0 0 50px rgba(197,149,107,0.06)',
          }}
        />

        {/* Warm gradient wash on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(197,149,107,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Icon */}
        <motion.span
          className={`absolute top-3 font-[family-name:var(--font-serif)] text-2xl text-rose-gold/[0.10] group-hover:text-rose-gold/35 transition-colors duration-700 ${isRTL ? 'left-4' : 'right-4'}`}
          whileHover={{ rotate: 15, scale: 1.3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          {v.icon}
        </motion.span>

        <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-rose-gold-light/80 italic block mb-1">
          {v.latin}
        </span>
        <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.35em] uppercase text-cream/20 block mb-6">
          {v.english}
        </span>
        <p
          className={`font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/35 leading-relaxed group-hover:text-cream/60 transition-colors duration-500 ${isRTL ? 'text-right' : ''}`}
        >
          {v.text}
        </p>

        {/* Bottom shimmer line on hover */}
        <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
      </TiltCard>
    </motion.div>
  );
}

// ─── City Flight Path SVG ─────────────────────────────────────────────────────

function CityFlightPaths() {
  // Positions are approximate % within the cities row container (600px wide reference)
  // Helsinki ~ left, Amsterdam ~ center, Kuusamo ~ right
  // We draw dashed arcs between them using SVG quadratic bezier curves
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(svgRef, { once: true, margin: '-5%' });

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      viewBox="0 0 600 60"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <style>{`
          @keyframes dash-march {
            to { stroke-dashoffset: -48; }
          }
          .flight-path {
            stroke-dasharray: 6 10;
            animation: dash-march 1.6s linear infinite;
          }
        `}</style>
      </defs>

      {/* Helsinki (100,30) → Amsterdam (300,30): arc upward */}
      <motion.path
        d="M 100 30 Q 200 -8 300 30"
        stroke="rgba(197,149,107,0.18)"
        strokeWidth="0.7"
        fill="none"
        className="flight-path"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Amsterdam (300,30) → Kuusamo (500,30): arc upward */}
      <motion.path
        d="M 300 30 Q 400 -8 500 30"
        stroke="rgba(197,149,107,0.18)"
        strokeWidth="0.7"
        fill="none"
        className="flight-path"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Tiny plane dots at midpoints */}
      {[
        { cx: 200, cy: 2 },
        { cx: 400, cy: 2 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="2"
          fill="rgba(197,149,107,0.45)"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: [0, 1, 0.6], scale: [0, 1.2, 1] } : {}}
          transition={{ duration: 0.6, delay: 1.4 + i * 0.2 }}
        />
      ))}
    </svg>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mottoRef = useRef<HTMLDivElement>(null);
  const mottoInView = useInView(mottoRef, { once: true, margin: '-15%' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const quoteY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const valuesY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const lineScale = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);
  const { t, isRTL } = useLanguage();

  const nodePositions = [8, 22, 38, 55, 70, 85];

  return (
    <section
      id="heritage"
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Ambient floating dust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => (
          <DustParticle key={i} index={i} />
        ))}
      </div>

      {/* Central vertical line with golden nodes */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none"
        aria-hidden
      >
        <motion.div
          style={{ scaleY: lineScale, transformOrigin: 'top' }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C5956B]/[0.08] to-transparent"
        />
        {nodePositions.map((top, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: `${top}%` }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ width: 14, height: 14, left: '50%', top: '50%' }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3.5, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ background: 'rgba(197,149,107,0.25)' }}
              />
            </motion.div>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'rgba(197,149,107,0.55)',
                boxShadow: '0 0 8px rgba(197,149,107,0.6)',
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Motto block with Sacred Geometry behind it */}
        <motion.div
          ref={mottoRef}
          className="text-center mb-32 md:mb-40 relative"
          style={{ y: quoteY }}
        >
          {/* Sacred Geometry — Flower of Life, centered behind motto */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden
            style={{ transform: 'translateY(-10%)' }}
          >
            <FlowerOfLife visible={mottoInView} />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-10 relative z-10"
          >
            {t.heritage.label}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <MottoWithLightSweep text={t.heritage.motto} />
            <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-cream/25 mt-6 tracking-wide">
              {t.heritage.mottoTranslation}
            </p>
          </motion.div>

          <div className="ornament max-w-xs mx-auto mt-12 relative z-10">
            <motion.span
              className="font-[family-name:var(--font-serif)] text-rose-gold/20 text-sm tracking-[0.3em]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
          </div>
        </motion.div>

        {/* Values — domino cascade */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-12"
          style={{ y: valuesY }}
        >
          {t.heritage.values.map((v, i) => (
            <ValueCard key={v.latin} v={v} index={i} isRTL={isRTL} />
          ))}
        </motion.div>

        {/* Cities — pulsing dots + flight path connecting lines */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative flex items-center justify-center gap-6 md:gap-10 mt-28 md:mt-36"
        >
          {/* SVG flight paths — absolutely positioned over the cities row */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: '600px',
              maxWidth: '90vw',
              height: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              top: '-20px',
            }}
            aria-hidden
          >
            <CityFlightPaths />
          </div>

          {['Helsinki', 'Amsterdam', 'Kuusamo'].map((city, i) => (
            <div key={city} className="flex items-center gap-6 md:gap-10">
              <div className="flex items-center gap-2.5">
                <div className="relative w-1.5 h-1.5">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(197,149,107,0.6)' }}
                    animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{
                      duration: 2.4,
                      delay: i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(197,149,107,0.8)' }}
                  />
                </div>
                <span className="font-[family-name:var(--font-display)] text-base md:text-lg text-cream/20 hover:text-rose-gold/50 transition-colors duration-500">
                  {city}
                </span>
              </div>
              {i < 2 && (
                <span className="text-rose-gold/10 text-[8px]">◆</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
