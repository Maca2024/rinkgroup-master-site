'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const NAVY_DEEP  = '#080E1A';
const ROSE_GOLD  = '#C5956B';
const CREAM      = '#F5F0E8';

// ─── Letter shimmer ────────────────────────────────────────────────────────────

interface ShimmerLetterProps {
  char: string;
  index: number;
  total: number;
}

function ShimmerLetter({ char, index, total }: ShimmerLetterProps) {
  // Each letter fades in and then receives a rolling golden shimmer pass
  const baseDelay   = 0.4 + index * 0.08;            // stagger entrance
  const shimmerDelay = 0.4 + total * 0.08 + 0.3 + index * 0.06; // shimmer rolls after all letters appear

  return (
    <motion.span
      aria-hidden="true"
      style={{ display: char === ' ' ? 'inline' : 'inline-block', position: 'relative' }}
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: baseDelay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Base letter */}
      <span style={{ color: CREAM, opacity: 0.85 }}>
        {char === ' ' ? '\u00A0' : char}
      </span>

      {/* Shimmer overlay — golden flash that sweeps across */}
      <motion.span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'inline-block',
          color: ROSE_GOLD,
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.45,
          delay: shimmerDelay,
          ease: 'easeInOut',
          times: [0, 0.4, 1],
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </motion.span>
  );
}

// ─── Horizontal golden line that draws from center outward ─────────────────────

function DrawLine({ delay }: { delay: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 320,
        height: 1,
        overflow: 'hidden',
      }}
    >
      {/* Left arm */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          right: '50%',
          height: 1,
          background: `linear-gradient(to left, ${ROSE_GOLD}, transparent)`,
          transformOrigin: 'right center',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
        className="w-1/2"
      />
      {/* Center glow dot */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: ROSE_GOLD,
          boxShadow: `0 0 8px 3px ${ROSE_GOLD}`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0.6], scale: [0, 1.4, 1] }}
        transition={{ duration: 0.6, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Right arm */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          height: 1,
          background: `linear-gradient(to right, ${ROSE_GOLD}, transparent)`,
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
        className="w-1/2"
      />
    </div>
  );
}

// ─── Main LoadingScreen ─────────────────────────────────────────────────────────

const LOGO_TEXT     = 'RINK GROUP';
const TAGLINE_TEXT  = 'Lumen Felicis';
const DISMISS_AFTER = 3500; // ms

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after the cinematic sequence completes
    const timer = setTimeout(() => setVisible(false), DISMISS_AFTER);
    return () => clearTimeout(timer);
  }, []);

  // Line appears after the last letter has faded in
  const lineDelay   = 0.4 + LOGO_TEXT.length * 0.08 + 0.2;
  // Tagline appears after the line finishes drawing
  const taglineDelay = lineDelay + 0.9;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          role="status"
          aria-label="Loading Rink Group"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: NAVY_DEEP,
            overflow: 'hidden',
          }}
          // Exit: content floats upward while the overlay blurs and fades
          exit={{
            y: '-6%',
            opacity: 0,
            filter: 'blur(18px)',
            scale: 1.03,
          }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Radial ambient glow behind the logo */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 600,
              height: 400,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, rgba(197,149,107,0.10) 0%, rgba(197,149,107,0.04) 40%, transparent 70%)`,
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Content column */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
            }}
          >
            {/* RINK GROUP — letter-by-letter with shimmer */}
            <div
              aria-label={LOGO_TEXT}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                letterSpacing: '0.35em',
                fontWeight: 400,
                lineHeight: 1,
                userSelect: 'none',
                marginBottom: 28,
                paddingRight: '0.35em', // compensate for letter-spacing on last char
              }}
            >
              {LOGO_TEXT.split('').map((char, i) => (
                <ShimmerLetter
                  key={i}
                  char={char}
                  index={i}
                  total={LOGO_TEXT.length}
                />
              ))}
            </div>

            {/* Golden line drawing from center outward */}
            <DrawLine delay={lineDelay} />

            {/* Lumen Felicis — fades in below the line */}
            <motion.p
              aria-label={TAGLINE_TEXT}
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                letterSpacing: '0.3em',
                color: ROSE_GOLD,
                opacity: 0,
                marginTop: 24,
                userSelect: 'none',
              }}
              animate={{
                opacity: [0, 0.9],
                y: [10, 0],
                filter: ['blur(6px)', 'blur(0px)'],
              }}
              transition={{
                duration: 1.0,
                delay: taglineDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {TAGLINE_TEXT}
            </motion.p>
          </div>

          {/* Corner ornaments — thin golden lines in each corner */}
          {(['tl', 'tr', 'bl', 'br'] as const).map((corner, i) => (
            <CornerOrnament key={corner} corner={corner} delay={0.3 + i * 0.08} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Corner ornament ───────────────────────────────────────────────────────────

type Corner = 'tl' | 'tr' | 'bl' | 'br';

interface CornerOrnamentProps {
  corner: Corner;
  delay: number;
}

function CornerOrnament({ corner, delay }: CornerOrnamentProps) {
  const [size, setSize] = useState(20);
  const [offset, setOffset] = useState(16);
  const thickness = 1;

  useEffect(() => {
    function update() {
      const isMobile = window.innerWidth < 768;
      setSize(isMobile ? 20 : 32);
      setOffset(isMobile ? 16 : 28);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const posStyle: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    ...(corner === 'tl' ? { top: offset, left: offset } : {}),
    ...(corner === 'tr' ? { top: offset, right: offset } : {}),
    ...(corner === 'bl' ? { bottom: offset, left: offset } : {}),
    ...(corner === 'br' ? { bottom: offset, right: offset } : {}),
  };

  // Horizontal and vertical hair-lines in the corner
  const borderTop    = corner === 'tl' || corner === 'tr';
  const borderBottom = corner === 'bl' || corner === 'br';
  const borderLeft   = corner === 'tl' || corner === 'bl';
  const borderRight  = corner === 'tr' || corner === 'br';

  return (
    <motion.div
      aria-hidden="true"
      style={{
        ...posStyle,
        borderTop:    borderTop    ? `${thickness}px solid rgba(197,149,107,0.35)` : undefined,
        borderBottom: borderBottom ? `${thickness}px solid rgba(197,149,107,0.35)` : undefined,
        borderLeft:   borderLeft   ? `${thickness}px solid rgba(197,149,107,0.35)` : undefined,
        borderRight:  borderRight  ? `${thickness}px solid rgba(197,149,107,0.35)` : undefined,
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
