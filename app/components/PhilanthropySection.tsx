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

// 3D perspective tilt wrapper for the dog welfare card
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

// Individual animated paw print that "walks in"
function WalkingPaw({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  // Alternate left/right foot placement like real paw prints
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
      className="inline-block text-lg md:text-xl select-none"
      style={{
        transform: `rotate(${rotate}deg) translateY(${offsetY}px)`,
        color: 'rgba(197,149,107,0.12)',
        filter: 'drop-shadow(0 0 4px rgba(197,149,107,0.08))',
      }}
    >
      🐾
    </motion.span>
  );
}

export function PhilanthropySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Breathing, rotating paw watermark
  const pawScale = useTransform(scrollYProgress, [0.05, 0.5], [0.75, 1.05]);
  const pawOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.75], [0, 0.07, 0]);
  const pawRotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  // Scroll-linked stat — animates from 0 context as you scroll in
  const statProgress = useTransform(scrollYProgress, [0.25, 0.55], [0, 1]);

  const { t, isRTL } = useLanguage();

  return (
    <section id="philanthropy" ref={ref} className="relative py-32 md:py-48 overflow-hidden">

      {/* Warm amber radial gradient behind card area */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(197,149,107,0.04) 0%, rgba(197,149,107,0.01) 50%, transparent 70%)',
        }}
      />

      {/* Giant paw watermark — rotates & breathes */}
      <motion.div
        style={{ scale: pawScale, opacity: pawOpacity, rotate: pawRotate }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] md:text-[600px] select-none pointer-events-none"
        aria-hidden
      >
        🐾
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

        {/* Intro */}
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

              {/* Amber hover glow — warm, not just opacity */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 30% 50%, rgba(197,149,107,0.07) 0%, rgba(197,120,60,0.03) 40%, transparent 70%)',
                }}
              />

              {/* Inner ambient glow edges on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                style={{
                  boxShadow:
                    'inset 0 1px 40px rgba(197,149,107,0.05), inset 0 -1px 40px rgba(197,149,107,0.03)',
                }}
              />

              <div className="relative grid md:grid-cols-12 gap-8 p-8 md:p-14">
                {/* Icon & Title */}
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
                    className="text-6xl md:text-8xl mb-6 inline-block"
                  >
                    🐕
                  </motion.div>

                  <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-rose-gold-light/80 italic mb-2">
                    {t.philanthropy.dogTitle}
                  </h3>

                  {/* Animated scroll-driven stat */}
                  <div className="flex items-center gap-4 mt-6">
                    <motion.span
                      className="font-[family-name:var(--font-display)] text-4xl md:text-5xl italic group-hover:text-rose-gold/70 transition-colors duration-700"
                      style={{
                        color: 'rgba(197,149,107,0.3)',
                      }}
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

                {/* Body text */}
                <div className="md:col-span-8">
                  <p
                    className={`font-[family-name:var(--font-serif)] text-base md:text-lg text-cream/40 leading-relaxed group-hover:text-cream/65 transition-colors duration-600 mb-10 ${isRTL ? 'text-right' : ''}`}
                  >
                    {t.philanthropy.dogBody}
                  </p>

                  {/* Gandhi quote — golden ornament + italic emphasis */}
                  <div className="ornament max-w-lg mb-8">
                    <motion.span
                      className="font-[family-name:var(--font-serif)] text-rose-gold/20 text-sm"
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      ✦
                    </motion.span>
                  </div>

                  <blockquote className="relative">
                    {/* Large decorative quotation mark */}
                    <span
                      className={`absolute -top-4 font-[family-name:var(--font-display)] text-6xl md:text-7xl leading-none pointer-events-none select-none ${isRTL ? '-right-2' : '-left-2'}`}
                      style={{ color: 'rgba(197,149,107,0.15)' }}
                      aria-hidden
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
        <div className="flex items-end justify-center gap-5 mt-16" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <WalkingPaw key={i} index={i} total={5} />
          ))}
        </div>
      </div>
    </section>
  );
}
