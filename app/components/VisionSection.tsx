'use client';

import { useRef, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  MotionValue,
} from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// ─── Ornamental divider ───────────────────────────────────────────────────────
function OrnamentDivider({ isRTL }: { isRTL: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ originX: isRTL ? 1 : 0 }}
      className={`flex items-center gap-4 my-14 ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      {/* Left arm */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5956B]/25 to-[#C5956B]/40" />
      {/* Diamond */}
      <motion.span
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="text-[#C5956B]/60 text-[10px] leading-none select-none"
        style={{ display: 'block', transform: 'rotate(45deg)', width: 7, height: 7, background: '#C5956B', opacity: 0.45 }}
      />
      {/* Right arm */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#C5956B]/25 to-[#C5956B]/40" />
    </motion.div>
  );
}

// ─── Scroll-driven gold line that draws left→right ───────────────────────────
function DrawingGoldLine({ progress, isRTL }: { progress: MotionValue<number>; isRTL: boolean }) {
  // Map section scroll progress 0→1 to scaleX 0→1
  const scaleX = useTransform(progress, [0, 0.7], [0, 1]);
  const smoothScale = useSpring(scaleX, { stiffness: 60, damping: 20 });

  return (
    <div className={`relative h-px w-full my-10 overflow-hidden ${isRTL ? 'scale-x-[-1]' : ''}`}>
      {/* Static faint base */}
      <div className="absolute inset-0 bg-[#C5956B]/[0.06]" />
      {/* Animated drawing line */}
      <motion.div
        style={{ scaleX: smoothScale, originX: 0 }}
        className="absolute inset-0 shimmer"
      />
      {/* Travelling bright tip */}
      <motion.div
        style={{
          left: useMotionTemplate`calc(${useTransform(progress, [0, 0.7], ['0%', '100%'])} - 60px)`,
        }}
        className="absolute top-0 h-full w-[60px] bg-gradient-to-r from-transparent via-[#E8CDB5]/80 to-transparent"
      />
    </div>
  );
}

// ─── Single word with blur + translate + opacity reveal ───────────────────────
function ScrollWord({
  word,
  globalRange,
  progress,
  isAccent,
  delay,
}: {
  word: string;
  globalRange: [number, number];
  progress: MotionValue<number>;
  isAccent: boolean;
  delay: number;
}) {
  const rawOpacity = useTransform(progress, globalRange, [0.04, 1]);
  const opacity = useSpring(rawOpacity, { stiffness: 55, damping: 18 });

  const rawY = useTransform(progress, globalRange, [44, 0]);
  const y = useSpring(rawY, { stiffness: 55, damping: 18 });

  const rawBlur = useTransform(progress, globalRange, [12, 0]);
  const blurFilter = useMotionTemplate`blur(${rawBlur}px)`;

  if (isAccent) {
    return (
      <span className="relative inline-block">
        {/* Radial glow behind accent word — fades in with the word */}
        <motion.span
          style={{ opacity }}
          className="pointer-events-none absolute inset-0 -inset-x-4 -inset-y-2 rounded-full"
          aria-hidden
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at 50% 60%, rgba(197,149,107,0.18) 0%, rgba(197,149,107,0.06) 50%, transparent 80%)',
              filter: 'blur(16px)',
            }}
          />
        </motion.span>
        <motion.span
          style={{ opacity, y, filter: blurFilter }}
          className="text-rose-gradient italic inline-block will-change-transform"
        >
          {word}
        </motion.span>
      </span>
    );
  }

  return (
    <motion.span
      style={{ opacity, y, filter: blurFilter }}
      className="text-cream inline-block will-change-transform"
    >
      {word}
    </motion.span>
  );
}

// ─── Character-by-character ink-spread paragraph ─────────────────────────────
function InkParagraph({
  text,
  delay,
  className,
  parallaxY,
}: {
  text: string;
  delay: number;
  className?: string;
  parallaxY: MotionValue<number>;
}) {
  const words = text.split(' ');

  return (
    <motion.p
      style={{ y: parallaxY }}
      className={`font-[family-name:var(--font-serif)] text-xl md:text-2xl leading-relaxed will-change-transform ${className ?? ''}`}
    >
      {words.map((word, wi) => (
        <motion.span
          key={wi}
          className="inline-block mr-[0.35em] text-cream/50"
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.65,
            delay: delay + wi * 0.022,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

// ─── VisionSection ─────────────────────────────────────────────────────────────
export function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t, isRTL } = useLanguage();

  // Scroll tracking across whole section for word reveal + gold line
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'center 0.3'],
  });

  // Separate scroll for parallax body columns (slower offset)
  const { scrollYProgress: bodyScroll } = useScroll({
    target: sectionRef,
    offset: ['center 0.9', 'end 0.1'],
  });

  const parallaxY1 = useTransform(bodyScroll, [0, 1], [30, -20]);
  const parallaxY2 = useTransform(bodyScroll, [0, 1], [50, -10]);

  const smoothY1 = useSpring(parallaxY1, { stiffness: 40, damping: 18 });
  const smoothY2 = useSpring(parallaxY2, { stiffness: 30, damping: 18 });

  const words = useMemo(() => t.vision.headline.split(' '), [t.vision.headline]);

  // Label entrance
  const labelY = useTransform(scrollYProgress, [0, 0.15], [20, 0]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <section id="vision" ref={sectionRef} className="relative py-32 md:py-52 overflow-hidden">

      {/* ── Ambient radial background glow ──────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(197,149,107,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Label ──────────────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className={`mb-10 ${isRTL ? 'text-right' : ''}`}
        >
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-[#C5956B]/40">
            {t.vision.label}
          </span>
        </motion.div>

        {/* ── Headline word reveal ───────────────────────────────────── */}
        <h2
          className={`flex flex-wrap gap-x-3 md:gap-x-5 font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-8xl font-light leading-[1.15] ${isRTL ? 'justify-end' : ''}`}
        >
          {words.map((word, i) => {
            // Stagger each word across a rolling window of scroll progress
            const windowSize = 0.55 / words.length;
            const start = (i / words.length) * 0.75;
            const end = start + windowSize + 0.12;

            return (
              <ScrollWord
                key={i}
                word={word}
                globalRange={[Math.min(start, 0.98), Math.min(end, 1)]}
                progress={scrollYProgress}
                isAccent={word === t.vision.accentWord}
                delay={i * 0.04}
              />
            );
          })}
        </h2>

        {/* ── Scroll-driven drawing gold line ───────────────────────── */}
        <DrawingGoldLine progress={scrollYProgress} isRTL={isRTL} />

        {/* ── Ornamental divider ─────────────────────────────────────── */}
        <OrnamentDivider isRTL={isRTL} />

        {/* ── Body paragraphs — ink spread + parallax ───────────────── */}
        <div className={`grid md:grid-cols-2 gap-16 md:gap-24 ${isRTL ? 'direction-rtl' : ''}`}>
          <InkParagraph
            text={t.vision.body1}
            delay={0}
            parallaxY={smoothY1}
            className={isRTL ? 'text-right' : ''}
          />
          <InkParagraph
            text={t.vision.body2}
            delay={0.18}
            parallaxY={smoothY2}
            className={isRTL ? 'text-right' : ''}
          />
        </div>
      </div>
    </section>
  );
}
