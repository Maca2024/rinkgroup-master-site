'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const ROSE_GOLD = '#C5956B';
const ROSE_GOLD_DIM = 'rgba(197,149,107,0.35)';
const ROSE_GOLD_FAINT = 'rgba(197,149,107,0.15)';

// ---------------------------------------------------------------------------
// Shared animation config
// ---------------------------------------------------------------------------
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------------
// Lines variant
// ---------------------------------------------------------------------------
function LinesVariant() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const lines = [
    { delay: 0,    opacity: 0.6,  thickness: 1   },
    { delay: 0.12, opacity: 1,    thickness: 1   },
    { delay: 0.24, opacity: 0.4,  thickness: 1   },
  ];

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center gap-[5px] w-full"
      style={{ height: '70px' }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="relative overflow-hidden"
          style={{ width: '100%', maxWidth: '420px', height: `${line.thickness}px` }}
        >
          {/* Left arm */}
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${ROSE_GOLD} 100%)`,
              opacity: line.opacity,
              originX: 1,
            }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{
              duration: 0.9,
              delay: line.delay,
              ease: EASE_EXPO,
            }}
          />
          {/* Right arm (mirror) */}
          <motion.div
            className="absolute inset-y-0 right-0"
            style={{
              background: `linear-gradient(270deg, transparent 0%, ${ROSE_GOLD} 100%)`,
              opacity: line.opacity,
              originX: 0,
            }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{
              duration: 0.9,
              delay: line.delay,
              ease: EASE_EXPO,
            }}
          />
          {/* Centre join dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: ROSE_GOLD,
              opacity: line.opacity,
              boxShadow: `0 0 6px 2px rgba(197,149,107,0.5)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: line.opacity } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, delay: line.delay + 0.6, ease: 'backOut' }}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diamond variant
// ---------------------------------------------------------------------------
function DiamondVariant() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scale down on mobile: container 56px, rays shorter, diamond smaller
  const containerSize = isMobile ? 56 : 80;
  const primaryRayLength = isMobile ? 24 : 36;
  const secondaryRayLength = isMobile ? 18 : 26;
  const outerDiamondSize = isMobile ? 13 : 18;
  const innerDiamondSize = isMobile ? 6 : 8;
  const flankingLineWidth = isMobile ? 56 : 80;

  // 4 radiating lines at 0°, 90°, 180°, 270° plus 4 diagonal faint ones
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  const primaryRays = [0, 90, 180, 270];

  return (
    <div
      ref={ref}
      className="flex items-center justify-center w-full"
      style={{ height: isMobile ? '64px' : '80px' }}
      aria-hidden="true"
    >
      <div className="relative" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
        {/* Radiating lines */}
        {rays.map((angle) => {
          const isPrimary = primaryRays.includes(angle);
          return (
            <motion.div
              key={angle}
              className="absolute top-1/2 left-1/2"
              style={{
                width: isPrimary ? `${primaryRayLength}px` : `${secondaryRayLength}px`,
                height: '1px',
                background: `linear-gradient(90deg, ${ROSE_GOLD} 0%, transparent 100%)`,
                opacity: isPrimary ? 0.7 : 0.3,
                transformOrigin: '0% 50%',
                rotate: angle,
                marginTop: '-0.5px',
              }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + (rays.indexOf(angle) * 0.04),
                ease: EASE_EXPO,
              }}
            />
          );
        })}

        {/* Diamond shape */}
        <motion.div
          className="absolute inset-0 m-auto"
          style={{
            width: `${outerDiamondSize}px`,
            height: `${outerDiamondSize}px`,
            border: `1px solid ${ROSE_GOLD}`,
            rotate: 45,
            boxShadow: `0 0 12px 2px rgba(197,149,107,0.3), inset 0 0 8px rgba(197,149,107,0.1)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'backOut' }}
        />

        {/* Inner diamond fill */}
        <motion.div
          className="absolute inset-0 m-auto"
          style={{
            width: `${innerDiamondSize}px`,
            height: `${innerDiamondSize}px`,
            background: ROSE_GOLD,
            rotate: 45,
            boxShadow: `0 0 10px 3px rgba(197,149,107,0.6)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'backOut' }}
        />

        {/* Flanking horizontal lines extending from the diamond */}
        {[-1, 1].map((dir) => (
          <motion.div
            key={dir}
            className="absolute top-1/2"
            style={{
              width: `${flankingLineWidth}px`,
              height: '1px',
              background:
                dir === -1
                  ? `linear-gradient(270deg, ${ROSE_GOLD_DIM} 0%, transparent 100%)`
                  : `linear-gradient(90deg, ${ROSE_GOLD_DIM} 0%, transparent 100%)`,
              [dir === -1 ? 'right' : 'left']: '50%',
              marginTop: '-0.5px',
              originX: dir === -1 ? 1 : 0,
            }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE_EXPO }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Particles variant
// ---------------------------------------------------------------------------
interface Particle {
  id: number;
  x: number;       // resting x as % of container width
  offsetY: number; // vertical scatter offset in px
  size: number;
  opacity: number;
  delay: number;
}

function ParticlesVariant() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Desktop: 30 particles — Mobile: 15 particles (reduced for performance)
  const particleCount = isMobile ? 15 : 30;

  const particles = useMemo<Particle[]>(() => {
    // Deterministic seed so SSR and client match exactly (no Math.random)
    const seed = (n: number, offset: number) =>
      ((n * 1103515245 + offset) & 0x7fffffff) / 0x7fffffff;

    const count = particleCount;
    const divisor = count - 1;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i / divisor) * 100,                     // evenly spread across width
      offsetY: (seed(i, 12345) - 0.5) * 28,       // ±14px vertical scatter
      size: 2 + seed(i, 99999) * 3,               // 2–5px
      opacity: 0.25 + seed(i, 54321) * 0.55,      // 0.25–0.8
      delay: seed(i, 11111) * 0.4,                // 0–0.4s stagger
    }));
  }, [particleCount]);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: '70px' }}
      aria-hidden="true"
    >
      {/* Subtle horizontal baseline */}
      <motion.div
        className="absolute top-1/2 left-0 right-0"
        style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${ROSE_GOLD_FAINT} 20%, ${ROSE_GOLD_FAINT} 80%, transparent 100%)`,
          marginTop: '-0.5px',
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: ROSE_GOLD,
            left: `${p.x}%`,
            top: '50%',
            marginLeft: `-${p.size / 2}px`,
            marginTop: `-${p.size / 2}px`,
            boxShadow: `0 0 ${p.size * 2}px rgba(197,149,107,0.5)`,
          }}
          // Scatter outward from centre line when NOT in view; gather when in view
          initial={{
            y: p.offsetY * 3,
            opacity: 0,
            scale: 0,
          }}
          animate={
            inView
              ? {
                  y: p.offsetY,
                  opacity: p.opacity,
                  scale: 1,
                }
              : {
                  y: p.offsetY * 3,
                  opacity: 0,
                  scale: 0,
                }
          }
          transition={{
            duration: 0.9,
            delay: p.delay,
            ease: EASE_EXPO,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export type SectionDividerVariant = 'lines' | 'diamond' | 'particles';

interface SectionDividerProps {
  variant?: SectionDividerVariant;
  className?: string;
}

export function SectionDivider({
  variant = 'lines',
  className = '',
}: SectionDividerProps) {
  return (
    <div
      className={`w-full flex items-center justify-center px-8 ${className}`}
      aria-hidden="true"
    >
      {variant === 'lines' && <LinesVariant />}
      {variant === 'diamond' && <DiamondVariant />}
      {variant === 'particles' && <ParticlesVariant />}
    </div>
  );
}
