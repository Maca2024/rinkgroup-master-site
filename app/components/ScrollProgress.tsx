'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/** Bright travelling glow tip at the leading edge of the progress line */
function GlowTip({ progress }: { progress: number }) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ left: `${progress * 100}%` }}
    >
      {/* Core bright point */}
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#F5E6D0',
          transform: 'translate(-50%, -50%)',
          boxShadow:
            '0 0 6px 2px rgba(245,230,208,0.9), 0 0 14px 5px rgba(197,149,107,0.7), 0 0 28px 10px rgba(197,149,107,0.35)',
        }}
      />
    </motion.div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    restDelta: 0.0005,
  });

  // Live numeric value for the percentage counter and glow tip position
  const [liveProgress, setLiveProgress] = useState(0);
  useEffect(() => {
    return smoothProgress.on('change', (v) => setLiveProgress(v));
  }, [smoothProgress]);

  const percentage = Math.round(liveProgress * 100);

  /*
   * Pulse intensity: we detect section boundaries by checking if the
   * progress value is near a quarter increment (0.25, 0.5, 0.75).
   * The closer we are, the stronger the glow.
   */
  const distToNearest = [0.25, 0.5, 0.75].reduce((min, boundary) => {
    return Math.min(min, Math.abs(liveProgress - boundary));
  }, 1);
  // 1 at boundary, 0 far away — drives extra shadow intensity
  const pulseStrength = Math.max(0, 1 - distToNearest / 0.06);

  const baseShadow = '0 0 8px rgba(197,149,107,0.4)';
  const pulseShadow = `0 0 ${12 + pulseStrength * 16}px rgba(197,149,107,${0.5 + pulseStrength * 0.5})`;

  // scaleX drives the actual width of the filled bar (origin 0%)
  const scaleX = useTransform(smoothProgress, (v) => v);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60]"
      style={{ height: '2px', pointerEvents: 'none' }}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      {/* Track — very subtle dark rail */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />

      {/* Filled bar — gradient + dynamic glow shadow */}
      <motion.div
        className="absolute inset-y-0 left-0 origin-left"
        style={{
          scaleX,
          background:
            'linear-gradient(90deg, #C5956B 0%, #D4A574 30%, #E8CDB5 50%, #D4A574 70%, #C5956B 100%)',
          backgroundSize: '200% 100%',
          boxShadow: pulseStrength > 0.1
            ? `${baseShadow}, ${pulseShadow}`
            : baseShadow,
          right: 0,
          // scaleX doesn't require right:0 — we use width:100% with scale
          width: '100%',
        }}
      />

      {/* Travelling glow tip */}
      <div className="absolute inset-0">
        <GlowTip progress={liveProgress} />
      </div>

      {/* Percentage counter — ultra-subtle, right-aligned */}
      <div
        className="absolute top-3 right-3"
        style={{ opacity: 0.15 }}
        aria-hidden="true"
      >
        <span
          className="font-[family-name:var(--font-sans)] text-[10px] tabular-nums"
          style={{
            color: '#C5956B',
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}
        >
          {String(percentage).padStart(2, '0')}%
        </span>
      </div>
    </div>
  );
}
