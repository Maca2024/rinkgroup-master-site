'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// Lightweight floating dust particle using motion.div
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
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// 3D tilt card wrapper
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

export function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const quoteY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const valuesY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const lineScale = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);
  const { t, isRTL } = useLanguage();

  // Golden line nodes: 6 evenly spaced dots along the vertical line
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none" aria-hidden>
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
            {/* outer glow ring */}
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
            {/* core dot */}
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgba(197,149,107,0.55)', boxShadow: '0 0 8px rgba(197,149,107,0.6)' }}
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Quote — parallax faster than values */}
        <motion.div className="text-center mb-32 md:mb-40" style={{ y: quoteY }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-10"
          >
            {t.heritage.label}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Dramatic shimmer on the motto itself */}
            <p
              className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl italic font-light shimmer"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.heritage.motto}
            </p>
            <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-cream/25 mt-6 tracking-wide">
              {t.heritage.mottoTranslation}
            </p>
          </motion.div>

          <div className="ornament max-w-xs mx-auto mt-12">
            <motion.span
              className="font-[family-name:var(--font-serif)] text-rose-gold/20 text-sm tracking-[0.3em]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
          </div>
        </motion.div>

        {/* Values — slight counter-parallax vs quote */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-12"
          style={{ y: valuesY }}
        >
          {t.heritage.values.map((v, i) => (
            <motion.div
              key={v.latin}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={i % 2 === 1 ? 'md:mt-16' : ''}
            >
              <TiltCard className="group relative p-8 md:p-12 border border-[#C5956B]/[0.07] hover:border-[#C5956B]/25 transition-all duration-700 magnetic-glow overflow-hidden">
                {/* Golden border glow on hover — pseudo via absolute div */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 30px rgba(197,149,107,0.06), 0 0 50px rgba(197,149,107,0.06)',
                  }}
                />

                {/* Subtle warm gradient wash */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 0%, rgba(197,149,107,0.05) 0%, transparent 70%)',
                  }}
                />

                {/* Icon — rotates and pulses on hover */}
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
          ))}
        </motion.div>

        {/* Cities — pulsing live indicator dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-center gap-6 md:gap-10 mt-28 md:mt-36"
        >
          {['Helsinki', 'Amsterdam', 'Kuusamo'].map((city, i) => (
            <div key={city} className="flex items-center gap-6 md:gap-10">
              <div className="flex items-center gap-2.5">
                {/* Pulsing live dot */}
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
