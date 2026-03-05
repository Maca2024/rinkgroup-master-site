'use client';

import { useRef, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// ─── SVG: Elegant sitting dog silhouette in rose-gold ──────────────────────

function DogSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <radialGradient id="dog-glow" cx="50%" cy="60%" r="45%">
          <stop offset="0%" stopColor="#C5956B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C5956B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dog-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8CDB5" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#C5956B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#A0754E" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="dog-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C5956B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7A5535" stopOpacity="0.25" />
        </linearGradient>
        <filter id="dog-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-halo" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient glow halo behind figure */}
      <ellipse
        cx="60"
        cy="78"
        rx="32"
        ry="18"
        fill="url(#dog-glow)"
        opacity="0.7"
      />

      {/* Ground shadow */}
      <ellipse
        cx="60"
        cy="108"
        rx="22"
        ry="4"
        fill="#C5956B"
        opacity="0.12"
      />

      {/* ── Body (haunches / torso sitting) ── */}
      {/* Rear haunch — left mass */}
      <path
        d="M30 108 C28 96 26 84 32 76 C37 69 46 67 52 70 C56 72 57 78 56 86 C55 94 52 102 50 108 Z"
        fill="url(#dog-body)"
        opacity="0.82"
        filter="url(#dog-soft-glow)"
      />
      {/* Main torso block */}
      <path
        d="M52 70 C54 62 56 54 60 50 C64 46 70 46 74 50 C78 54 78 62 76 70 C74 78 68 84 62 86 C57 87 53 80 52 70 Z"
        fill="url(#dog-body)"
        opacity="0.88"
      />
      {/* Seated rump / right haunch */}
      <path
        d="M56 86 C58 92 60 100 60 108 L70 108 C70 100 69 90 68 82 C66 76 62 74 58 76 C56 78 56 82 56 86 Z"
        fill="url(#dog-shadow)"
        opacity="0.75"
      />

      {/* ── Front legs (upright, sitting) ── */}
      {/* Left front leg */}
      <path
        d="M48 86 C46 88 44 92 44 98 C44 104 46 107 48 108 L52 108 C52 104 52 98 52 92 C52 88 51 86 48 86 Z"
        fill="url(#dog-body)"
        opacity="0.7"
      />
      {/* Right front leg */}
      <path
        d="M64 84 C62 86 62 92 62 98 C62 104 63 107 65 108 L69 108 C69 104 68 98 68 92 C68 88 67 85 64 84 Z"
        fill="url(#dog-body)"
        opacity="0.7"
      />

      {/* ── Neck ── */}
      <path
        d="M58 52 C56 46 57 40 60 36 C61 34 63 33 65 34 C67 36 67 40 66 46 C65 50 63 54 60 56 Z"
        fill="url(#dog-body)"
        opacity="0.85"
      />

      {/* ── Head ── */}
      {/* Skull */}
      <ellipse
        cx="66"
        cy="30"
        rx="12"
        ry="11"
        fill="url(#dog-body)"
        opacity="0.9"
        filter="url(#dog-soft-glow)"
      />
      {/* Muzzle */}
      <path
        d="M54 32 C52 33 51 35 52 37 C53 39 56 40 60 40 C63 40 66 39 67 37 C68 35 67 33 65 32 C62 31 57 31 54 32 Z"
        fill="url(#dog-shadow)"
        opacity="0.78"
      />
      {/* Nose */}
      <ellipse
        cx="58"
        cy="36"
        rx="2.5"
        ry="1.8"
        fill="#7A5535"
        opacity="0.55"
      />

      {/* ── Ear (folded, shepherd-style pointing up slightly) ── */}
      <path
        d="M72 22 C74 14 76 10 73 8 C70 6 66 10 64 16 C62 20 63 24 66 26 C69 27 71 25 72 22 Z"
        fill="url(#dog-body)"
        opacity="0.8"
      />
      {/* Ear inner shadow */}
      <path
        d="M71 21 C72 16 72 12 70 10 C68 11 66 15 66 19 C66 22 68 24 70 24 C71 23 71 22 71 21 Z"
        fill="#A0754E"
        opacity="0.35"
      />

      {/* ── Tail (curled upward behind, German shepherd style) ── */}
      <path
        d="M30 76 C24 68 20 58 22 50 C24 44 30 40 36 42 C40 44 40 50 38 56 C36 60 34 66 36 70 C38 74 36 76 32 76"
        fill="none"
        stroke="url(#dog-body)"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.72"
      />
      {/* Tail highlight */}
      <path
        d="M31 74 C26 66 23 56 25 50 C26 46 30 43 34 44"
        fill="none"
        stroke="#E8CDB5"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* ── Eye ── */}
      <ellipse
        cx="63"
        cy="28"
        rx="2"
        ry="2"
        fill="#4A2E18"
        opacity="0.6"
      />
      {/* Eye gleam */}
      <ellipse
        cx="63.6"
        cy="27.4"
        rx="0.7"
        ry="0.7"
        fill="#E8CDB5"
        opacity="0.55"
      />

      {/* ── Fur detail lines (depth / texture) ── */}
      <path
        d="M56 72 C58 68 62 66 66 68"
        fill="none"
        stroke="#E8CDB5"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.22"
      />
      <path
        d="M54 80 C57 76 62 75 65 77"
        fill="none"
        stroke="#E8CDB5"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.18"
      />
      <path
        d="M60 54 C62 50 65 48 68 50"
        fill="none"
        stroke="#E8CDB5"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
}

// ─── SVG: Elegant vector paw print ────────────────────────────────────────

interface PawPrintProps {
  size?: number;
  opacity?: number;
  className?: string;
}

function PawPrint({ size = 24, opacity = 1, className }: PawPrintProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="paw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8CDB5" />
          <stop offset="100%" stopColor="#C5956B" />
        </linearGradient>
      </defs>

      {/* Main central pad — elongated teardrop */}
      <path
        d="M20 38 C14 38 11 33 11 28 C11 22 14 18 20 18 C26 18 29 22 29 28 C29 33 26 38 20 38 Z"
        fill="url(#paw-grad)"
      />

      {/* Top-left toe pad */}
      <ellipse
        cx="13"
        cy="14"
        rx="4"
        ry="5"
        fill="url(#paw-grad)"
        opacity="0.85"
        transform="rotate(-18 13 14)"
      />

      {/* Top-center-left toe pad */}
      <ellipse
        cx="18"
        cy="11"
        rx="3.8"
        ry="4.8"
        fill="url(#paw-grad)"
        opacity="0.9"
        transform="rotate(-6 18 11)"
      />

      {/* Top-center-right toe pad */}
      <ellipse
        cx="23"
        cy="11"
        rx="3.8"
        ry="4.8"
        fill="url(#paw-grad)"
        opacity="0.9"
        transform="rotate(6 23 11)"
      />

      {/* Top-right toe pad */}
      <ellipse
        cx="28"
        cy="14"
        rx="4"
        ry="5"
        fill="url(#paw-grad)"
        opacity="0.85"
        transform="rotate(18 28 14)"
      />
    </svg>
  );
}

// ─── 3D perspective tilt wrapper ──────────────────────────────────────────

function PerspectiveCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 120, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = (e.clientX - left) / width - 0.5;
      const cy = (e.clientY - top) / height - 0.5;
      rotateX.set(-cy * 7);
      rotateY.set(cx * 7);
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
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated walking paw using SVG PawPrint ──────────────────────────────

function WalkingPaw({ index, total }: { index: number; total: number }) {
  const offsetY = index % 2 === 0 ? -6 : 6;
  const rotate = -15 + index * (30 / (total - 1));

  return (
    <motion.span
      initial={{ opacity: 0, y: 20, scale: 0.4 }}
      whileInView={{ opacity: 1, y: offsetY, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.4 + index * 0.18,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className="inline-block select-none"
      style={{
        transform: `rotate(${rotate}deg) translateY(${offsetY}px)`,
        filter: 'drop-shadow(0 0 4px rgba(197,149,107,0.14))',
      }}
    >
      <PawPrint size={18} opacity={0.18} />
    </motion.span>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────

export function PhilanthropySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Breathing, rotating paw watermark
  const pawScale = useTransform(scrollYProgress, [0.05, 0.5], [0.75, 1.05]);
  const pawOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75], [0, 1, 0]);
  const pawRotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  // Scroll-linked stat label fade
  const statProgress = useTransform(scrollYProgress, [0.25, 0.55], [0, 1]);

  const { t, isRTL } = useLanguage();

  return (
    <section
      id="philanthropy"
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Warm amber radial gradient behind card area */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(197,149,107,0.04) 0%, rgba(197,149,107,0.01) 50%, transparent 70%)',
        }}
      />

      {/* Giant SVG paw watermark — rotates and breathes */}
      <motion.div
        style={{ scale: pawScale, opacity: pawOpacity, rotate: pawRotate }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none w-[280px] h-[280px] md:w-[520px] md:h-[520px]"
        aria-hidden="true"
      >
        <PawPrint size={520} opacity={0.065} className="w-full h-full" />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className={`mb-20 md:mb-28 ${isRTL ? 'text-right' : ''}`}
        >
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-4">
            {t.philanthropy.label}
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream">
            {t.philanthropy.title}{' '}
            <span className="text-rose-gradient italic">
              {t.philanthropy.titleAccent}
            </span>
          </h2>
        </motion.div>

        {/* Intro paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`font-[family-name:var(--font-serif)] text-xl md:text-2xl text-cream/40 leading-relaxed max-w-3xl mb-20 ${isRTL ? 'mr-0 ml-auto' : ''}`}
        >
          {t.philanthropy.intro}
        </motion.p>

        {/* Dog welfare card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <PerspectiveCard>
            <div className="group relative border border-[#C5956B]/[0.08] hover:border-[#C5956B]/25 transition-all duration-700 overflow-hidden magnetic-glow">

              {/* Amber hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 30% 50%, rgba(197,149,107,0.07) 0%, rgba(197,120,60,0.03) 40%, transparent 70%)',
                }}
              />

              {/* Inner ambient glow edges */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                style={{
                  boxShadow:
                    'inset 0 1px 40px rgba(197,149,107,0.05), inset 0 -1px 40px rgba(197,149,107,0.03)',
                }}
              />

              <div className="relative grid md:grid-cols-12 gap-8 p-8 md:p-14">

                {/* Icon column */}
                <div className="md:col-span-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="mb-6 inline-block"
                    style={{
                      filter:
                        'drop-shadow(0 0 18px rgba(197,149,107,0.22)) drop-shadow(0 0 40px rgba(197,149,107,0.08))',
                    }}
                  >
                    <DogSilhouette className="w-24 h-24 md:w-32 md:h-32" />
                  </motion.div>

                  <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-rose-gold-light/80 italic mb-2">
                    {t.philanthropy.dogTitle}
                  </h3>

                  {/* Scroll-driven stat */}
                  <div className="flex items-center gap-4 mt-6">
                    <motion.span
                      className="font-[family-name:var(--font-display)] text-4xl md:text-5xl italic group-hover:text-rose-gold/70 transition-colors duration-700"
                      style={{ color: 'rgba(197,149,107,0.3)' }}
                      whileInView={{ color: 'rgba(197,149,107,0.55)' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4 }}
                    >
                      {t.philanthropy.dogStat}
                    </motion.span>
                    <motion.span
                      className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.25em] uppercase text-cream/20"
                      style={{ opacity: statProgress }}
                    >
                      {t.philanthropy.dogStatLabel}
                    </motion.span>
                  </div>
                </div>

                {/* Body text column */}
                <div className="md:col-span-8">
                  <p
                    className={`font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/40 leading-relaxed group-hover:text-cream/65 transition-colors duration-600 mb-10 ${isRTL ? 'text-right' : ''}`}
                  >
                    {t.philanthropy.dogBody}
                  </p>

                  {/* Ornament divider with animated spark */}
                  <div className="ornament max-w-lg mb-8">
                    <motion.span
                      aria-hidden="true"
                      animate={{ opacity: [0.2, 0.65, 0.2] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {/* Four-pointed star in SVG — replaces ✦ emoji */}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="font-[family-name:var(--font-serif)]"
                      >
                        <path
                          d="M6 0 C6 0 6.4 4 6 6 C5.6 8 6 12 6 12 C6 12 5.6 8 6 6 C6.4 4 6 0 6 0 Z"
                          fill="#C5956B"
                          opacity="0.7"
                        />
                        <path
                          d="M0 6 C0 6 4 5.6 6 6 C8 6.4 12 6 12 6 C12 6 8 6.4 6 6 C4 5.6 0 6 0 6 Z"
                          fill="#C5956B"
                          opacity="0.7"
                        />
                        <path
                          d="M1.76 1.76 C1.76 1.76 4.24 4.59 6 6 C7.76 7.41 10.24 10.24 10.24 10.24 C10.24 10.24 7.76 7.41 6 6 C4.24 4.59 1.76 1.76 1.76 1.76 Z"
                          fill="#C5956B"
                          opacity="0.35"
                        />
                        <path
                          d="M10.24 1.76 C10.24 1.76 7.41 4.24 6 6 C4.59 7.76 1.76 10.24 1.76 10.24 C1.76 10.24 4.59 7.76 6 6 C7.41 4.24 10.24 1.76 10.24 1.76 Z"
                          fill="#C5956B"
                          opacity="0.35"
                        />
                      </svg>
                    </motion.span>
                  </div>

                  {/* Gandhi quote */}
                  <blockquote className="relative">
                    {/* Large decorative quotation mark */}
                    <span
                      className={`absolute -top-4 font-[family-name:var(--font-display)] text-6xl md:text-7xl leading-none pointer-events-none select-none ${isRTL ? '-right-2' : '-left-2'}`}
                      style={{ color: 'rgba(197,149,107,0.15)' }}
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>
                    <p
                      className={`font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/30 italic leading-relaxed pl-6 group-hover:text-cream/45 transition-colors duration-700 ${isRTL ? 'text-right pr-6 pl-0' : ''}`}
                    >
                      {t.philanthropy.quote}
                    </p>
                  </blockquote>
                </div>
              </div>

              {/* Hover shimmer line */}
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
            </div>
          </PerspectiveCard>
        </motion.div>

        {/* Walking paw prints trail */}
        <div className="flex items-end justify-center gap-3 md:gap-5 mt-16" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <WalkingPaw key={i} index={i} total={5} />
          ))}
        </div>

      </div>
    </section>
  );
}
