'use client';

import { useRef, useState, useCallback, useEffect, useMemo, useLayoutEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Pillar {
  number: string;
  title: string;
  subtitle: string;
  body: string;
  stat: string;
  statLabel: string;
}

// ─── Animated counting stat ───────────────────────────────────────────────────
function AnimatedStat({ value, isHovered }: { value: string; isHovered: boolean }) {
  const [displayed, setDisplayed] = useState(value);
  const rafRef = useRef<number | null>(null);

  // Parse the numeric portion and suffix (e.g. "€2.4B" → prefix="€", num=2.4, suffix="B")
  const parsed = useMemo(() => {
    const match = value.match(/^([^0-9]*)([0-9]+\.?[0-9]*)(.*)$/);
    if (!match) return null;
    return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
  }, [value]);

  useEffect(() => {
    if (!isHovered || !parsed) {
      setDisplayed(value);
      return;
    }

    const startTime = performance.now();
    const duration = 900;
    const startVal = parsed.num * 0.2;
    const endVal = parsed.num;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * eased;

      const formatted =
        Number.isInteger(endVal)
          ? Math.round(current).toString()
          : current.toFixed(1);

      setDisplayed(`${parsed!.prefix}${formatted}${parsed!.suffix}`);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isHovered, parsed, value]);

  return (
    <span className="tabular-nums">
      {displayed}
    </span>
  );
}

// ─── Vertical animated connection spine ──────────────────────────────────────
function ConnectionSpine({
  progress,
  isRTL,
}: {
  progress: MotionValue<number>;
  isRTL: boolean;
}) {
  const scaleY = useTransform(progress, [0.05, 0.85], [0, 1]);
  const smoothScaleY = useSpring(scaleY, { stiffness: 35, damping: 18 });

  return (
    <div
      className={`absolute top-0 bottom-0 w-px ${isRTL ? 'right-0' : 'left-0'}`}
      style={{ marginLeft: isRTL ? undefined : '-1px' }}
      aria-hidden
    >
      {/* Static faint spine */}
      <div className="absolute inset-0 bg-[#C5956B]/[0.06]" />
      {/* Animated growing spine */}
      <motion.div
        style={{ scaleY: smoothScaleY, originY: 0 }}
        className="absolute inset-0 bg-gradient-to-b from-[#C5956B]/50 via-[#E8CDB5]/30 to-[#C5956B]/50"
      />
    </div>
  );
}

// ─── Per-card 3D tilt panel ───────────────────────────────────────────────────
function PillarCard({
  pillar,
  index,
  isRTL,
  isLast,
}: {
  pillar: Pillar;
  index: number;
  isRTL: boolean;
  isLast: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useLayoutEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  // Scroll-driven entrance
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.92', 'start 0.45'],
  });

  const entranceX = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -50 : 50, 0]
  );
  const entranceOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const smoothX = useSpring(entranceX, { stiffness: 50, damping: 20 });

  // 3D tilt on mouse move — disabled on touch devices
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 5, y: dx * 7 });
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  // Per-card accent colour (hsl cycling through warm metallics)
  const accentHue = 30 + index * 50;
  const accentColor = `hsl(${accentHue}, 48%, 62%)`;

  const springConfig = { stiffness: 200, damping: 26 };
  const tiltX = useSpring(tilt.x, springConfig);
  const tiltY = useSpring(tilt.y, springConfig);

  return (
    <motion.div
      ref={cardRef}
      style={{ x: smoothX, opacity: entranceOpacity }}
      className={`relative pl-8 ${isRTL ? 'pr-8 pl-0' : ''} ${!isLast ? 'mb-6' : ''}`}
    >
      {/* Left accent bar (unique per card) */}
      <motion.div
        className={`absolute top-0 bottom-0 w-[3px] rounded-full ${isRTL ? 'right-0' : 'left-0'}`}
        style={{ background: accentColor, opacity: 0.35 }}
        whileHover={{ opacity: 0.85, scaleX: 1.5 }}
        transition={{ duration: 0.4 }}
      />

      {/* 3D tilting card panel */}
      <motion.div
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          perspective: 800,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={isTouchDevice ? undefined : handleMouseMove}
        onMouseEnter={isTouchDevice ? undefined : () => setIsHovered(true)}
        onMouseLeave={isTouchDevice ? undefined : handleMouseLeave}
        className="group relative overflow-hidden rounded-[2px] border border-[#C5956B]/[0.07] bg-[#080E1A]/60 px-8 py-10 md:px-12 md:py-14 magnetic-glow transition-colors duration-700 hover:border-[#C5956B]/[0.18] hover:bg-[#0F1B33]/70"
      >
        {/* ── Large watermark number ──────────────────────────────── */}
        <span
          className={`pointer-events-none absolute font-[family-name:var(--font-display)] text-[6rem] md:text-[10rem] lg:text-[14rem] font-bold leading-none select-none ${isRTL ? 'left-6 top-0' : 'right-6 top-0'}`}
          style={{
            color: accentColor,
            opacity: 0.03,
            transform: 'translateY(-15%)',
            letterSpacing: '-0.02em',
          }}
          aria-hidden
        >
          {pillar.number}
        </span>

        <div className={`relative z-10 grid grid-cols-12 gap-4 md:gap-8 items-start ${isRTL ? 'direction-rtl' : ''}`}>

          {/* ── Number badge ─────────────────────────────────────── */}
          <div className="col-span-2 md:col-span-1 flex items-start pt-1">
            <motion.span
              className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl transition-colors duration-500"
              style={{ color: accentColor, opacity: 0.25 }}
              whileHover={{ opacity: 0.75 }}
            >
              {pillar.number}
            </motion.span>
          </div>

          {/* ── Title + subtitle ─────────────────────────────────── */}
          <div className="col-span-10 md:col-span-3 space-y-2">
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-[#F5F0E8] group-hover:text-[#E8CDB5] transition-colors duration-500 leading-tight">
              {pillar.title}
            </h3>
            <motion.span
              className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.3em] uppercase block transition-colors duration-500"
              style={{ color: accentColor, opacity: 0.5 }}
            >
              {pillar.subtitle}
            </motion.span>
          </div>

          {/* ── Body text ────────────────────────────────────────── */}
          <p
            className={`col-span-12 md:col-span-5 font-[family-name:var(--font-serif)] text-base md:text-lg text-[#F5F0E8]/35 leading-relaxed group-hover:text-[#F5F0E8]/60 transition-colors duration-500 ${isRTL ? 'text-right' : ''}`}
          >
            {pillar.body}
          </p>

          {/* ── Stat ─────────────────────────────────────────────── */}
          <div className={`col-span-12 md:col-span-3 ${isRTL ? 'md:text-left' : 'md:text-right'}`}>
            <div
              className="font-[family-name:var(--font-display)] text-2xl md:text-4xl lg:text-5xl font-light transition-all duration-500"
              style={{ color: accentColor, opacity: isHovered ? 0.85 : 0.18 }}
            >
              <AnimatedStat value={pillar.stat} isHovered={isHovered} />
            </div>
            <span className="block font-[family-name:var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-[#F5F0E8]/20 mt-2 group-hover:text-[#F5F0E8]/40 transition-colors duration-500">
              {pillar.statLabel}
            </span>
          </div>
        </div>

        {/* ── Shimmer bottom line on hover ───────────────────────── */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] shimmer"
          initial={{ width: '0%' }}
          animate={{ width: isHovered ? '100%' : '0%' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ── Subtle inner glow on hover ─────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[2px]"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${accentColor}0D 0%, transparent 70%)`,
          }}
          aria-hidden
        />
      </motion.div>
    </motion.div>
  );
}

// ─── PillarsSection ───────────────────────────────────────────────────────────
export function PillarsSection() {
  const { t, isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'end 0.2'],
  });

  return (
    <section id="ventures" className="relative py-20 md:py-40">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Dramatic header entrance ────────────────────────────── */}
        <div className={`mb-24 md:mb-36 ${isRTL ? 'text-left' : 'text-right'}`}>
          <motion.span
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-[#C5956B]/40 block mb-5"
          >
            {t.pillars.label}
          </motion.span>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '110%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-[#F5F0E8] leading-tight"
            >
              {t.pillars.title}{' '}
              <span className="text-rose-gradient italic">
                {t.pillars.titleAccent}
              </span>
            </motion.h2>
          </div>

          {/* Decorative underline accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: isRTL ? 0 : 1 }}
            className="mt-8 h-px w-32 ml-auto shimmer"
          />
        </div>

        {/* ── Cards + spine container ─────────────────────────────── */}
        <div
          ref={containerRef}
          className={`relative ${isRTL ? 'pr-6' : 'pl-6'}`}
        >
          {/* Animated vertical spine */}
          <ConnectionSpine progress={scrollYProgress} isRTL={isRTL} />

          {/* Cards */}
          {t.pillars.items.map((pillar, i) => (
            <PillarCard
              key={pillar.number}
              pillar={pillar}
              index={i}
              isRTL={isRTL}
              isLast={i === t.pillars.items.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
