'use client';

import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
} from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface MarqueeBandProps {
  textKey?: 'marquee1' | 'marquee2';
  text?: string;
  reverse?: boolean;
  className?: string;
}

/** Glowing rose-gold dot separator rendered between each text repeat */
function GlowDot() {
  return (
    <span
      className="inline-block mx-10 align-middle"
      aria-hidden="true"
      style={{ lineHeight: 0 }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#C5956B',
          boxShadow:
            '0 0 8px 2px rgba(197,149,107,0.8), 0 0 20px 6px rgba(197,149,107,0.35)',
          verticalAlign: 'middle',
        }}
      />
    </span>
  );
}

/**
 * A single pass of the marquee content — text alternates between filled and
 * outline variants so the eye never locks onto a static repeat pattern.
 */
function MarqueeSegment({
  text,
  index,
}: {
  text: string;
  index: number;
}) {
  const isOutline = index % 2 === 1;
  return (
    <>
      <span
        className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-[8rem] font-light tracking-tight"
        style={
          isOutline
            ? {
                WebkitTextStroke: '1px #C5956B',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }
            : {
                color: '#C5956B',
              }
        }
      >
        {text}
      </span>
      <GlowDot />
    </>
  );
}

export function MarqueeBand({
  textKey,
  text: textProp,
  reverse = false,
  className = '',
}: MarqueeBandProps) {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const { t } = useLanguage();

  // --- Scroll-driven parallax for the whole band ---
  const { scrollY, scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ['-12px', '12px'] : ['12px', '-12px']
  );

  // --- Velocity-reactive speed ---
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 50,
    damping: 20,
  });

  /**
   * We drive the CSS animation duration directly via a ref so we never
   * trigger a React re-render on every frame. The base duration maps to
   * the 40s defined in globals.css; faster scroll compresses it toward 8s.
   */
  const [paused, setPaused] = useState(false);

  useAnimationFrame(() => {
    const el = trackRef.current;
    if (!el || paused) return;

    const absVel = Math.abs(smoothVelocity.get());
    // Map 0 → 40s, 2000px/s → 8s (clamped)
    const duration = Math.max(8, 40 - absVel * 0.016);
    el.style.animationDuration = `${duration}s`;

    // Direction: reverse prop + scroll direction flip
    const goingDown = smoothVelocity.get() > 0;
    const shouldReverse = reverse ? !goingDown : goingDown;
    el.style.animationDirection = shouldReverse
      ? 'reverse'
      : 'normal';
  });

  const handleMouseEnter = useCallback(() => setPaused(true), []);
  const handleMouseLeave = useCallback(() => setPaused(false), []);

  const displayText = textKey ? t[textKey] : (textProp ?? '');

  // Repeat 8× so the seam is always off-screen at all viewport widths
  const REPEAT_COUNT = 8;

  return (
    <motion.div
      ref={bandRef}
      style={{ y: parallaxY }}
      className={`overflow-hidden py-6 md:py-10 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fade masks at left and right edges */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 z-10"
          style={{
            background:
              'linear-gradient(90deg, #080E1A 0%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 z-10"
          style={{
            background:
              'linear-gradient(270deg, #080E1A 0%, transparent 100%)',
          }}
        />

        <div className="whitespace-nowrap">
          {/*
           * The track contains 2× the content so the CSS translateX(-50%)
           * animation produces a seamless loop — identical to the original
           * globals.css @keyframes marquee approach.
           */}
          <span
            ref={trackRef}
            className="marquee-track inline-block"
            style={{
              animationPlayState: paused ? 'paused' : 'running',
            }}
          >
            {/* First half */}
            {Array.from({ length: REPEAT_COUNT }, (_, i) => (
              <MarqueeSegment key={`a-${i}`} text={displayText} index={i} />
            ))}
            {/* Second half — exact mirror so -50% translateX loops cleanly */}
            {Array.from({ length: REPEAT_COUNT }, (_, i) => (
              <MarqueeSegment
                key={`b-${i}`}
                text={displayText}
                index={i}
              />
            ))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
