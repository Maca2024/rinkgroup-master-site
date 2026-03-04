'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const values = [
  { latin: 'Prudentia', english: 'Prudence', description: 'We measure twice and act with conviction. Strategic patience is our competitive advantage.' },
  { latin: 'Integritas', english: 'Integrity', description: 'Our word is our bond. In every jurisdiction, every partnership, every handshake.' },
  { latin: 'Fortitudo', english: 'Fortitude', description: 'We build for decades, not quarters. True wealth compounds through resilience.' },
  { latin: 'Humanitas', english: 'Humanity', description: 'Technology serves people. Nature nurtures people. Business connects people.' },
];

export function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section id="heritage" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Background treatment */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy-light/20 to-navy-deep" />
        {/* Decorative border pattern */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-rose-gold/[0.06] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header with parallax quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="text-center mb-24 md:mb-32"
        >
          <span className="font-[family-name:var(--font-sans)] text-[11px] tracking-[0.4em] uppercase text-rose-gold/60 block mb-8">
            Our Heritage
          </span>

          <motion.blockquote style={{ y: textY }} className="max-w-3xl mx-auto">
            <p className="font-[family-name:var(--font-serif)] text-2xl md:text-4xl lg:text-5xl text-cream/80 leading-[1.3] font-light italic">
              &ldquo;Lumen Felicis&rdquo;
            </p>
            <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-cream/40 mt-4">
              The Light of Fortune &mdash; our founding principle since establishment
            </p>
          </motion.blockquote>

          <div className="gold-line w-16 mx-auto mt-12" />
        </motion.div>

        {/* Values grid */}
        <div className="grid md:grid-cols-2 gap-px bg-rose-gold/[0.06] max-w-4xl mx-auto">
          {values.map((value, i) => (
            <motion.div
              key={value.latin}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="bg-navy-deep p-10 md:p-14 group hover:bg-navy/50 transition-colors duration-700"
            >
              <span className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-rose-gold-light italic block mb-1">
                {value.latin}
              </span>
              <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-cream/25 block mb-5">
                {value.english}
              </span>
              <p className="font-[family-name:var(--font-serif)] text-base text-cream/40 leading-relaxed group-hover:text-cream/60 transition-colors duration-500">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Locations */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-24 md:mt-32"
        >
          {['Helsinki', 'Amsterdam', 'Kuusamo'].map((city, i) => (
            <div key={city} className="text-center">
              <span className="font-[family-name:var(--font-display)] text-lg md:text-xl text-cream/30">
                {city}
              </span>
              {i < 2 && (
                <span className="hidden md:inline-block ml-8 md:ml-16 text-rose-gold/20">&middot;</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
