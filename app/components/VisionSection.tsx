'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const pillars = [
  {
    number: '01',
    title: 'Technology',
    subtitle: 'AetherLink B.V.',
    description: 'AI consulting and intelligent automation. We architect the systems that transform enterprises into adaptive, self-optimizing organisms.',
    accent: 'from-rose-gold to-rose-gold-light',
  },
  {
    number: '02',
    title: 'Ventures',
    subtitle: 'Nordic Innovation',
    description: 'Strategic investments in sustainable technology, eco-tourism, and educational innovation across the Finnish-Dutch corridor.',
    accent: 'from-rose-gold-light to-rose-gold-pale',
  },
  {
    number: '03',
    title: 'Heritage',
    subtitle: 'TaigaSchool',
    description: 'Preserving Nordic wilderness while pioneering regenerative hospitality. Where ancient forests meet contemporary sanctuary.',
    accent: 'from-rose-gold-pale to-cream-dark',
  },
];

export function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section id="vision" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Parallax background accent */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]"
      >
        <div className="w-full h-full bg-gradient-to-l from-rose-gold to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="mb-24 md:mb-32"
        >
          <span className="font-[family-name:var(--font-sans)] text-[11px] tracking-[0.4em] uppercase text-rose-gold/60 block mb-4">
            Our Philosophy
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream leading-[1.1] max-w-4xl">
            Building legacies that
            <span className="text-rose-gradient italic"> transcend </span>
            generations
          </h2>
          <div className="gold-line w-24 mt-10" />
        </motion.div>

        {/* Pillars */}
        <div className="grid gap-16 md:gap-0 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.article
              key={pillar.number}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className={`relative group ${i > 0 ? 'md:border-l md:border-rose-gold/10 md:pl-10' : ''}`}
            >
              {/* Number */}
              <span className="font-[family-name:var(--font-serif)] text-7xl md:text-8xl font-light text-rose-gold/[0.07] absolute -top-4 -left-2 select-none">
                {pillar.number}
              </span>

              <div className="relative">
                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream mb-1">
                  {pillar.title}
                </h3>
                <p className="font-[family-name:var(--font-sans)] text-xs tracking-[0.2em] uppercase text-rose-gold/60 mb-6">
                  {pillar.subtitle}
                </p>
                <p className="font-[family-name:var(--font-serif)] text-lg text-cream/50 leading-relaxed max-w-sm">
                  {pillar.description}
                </p>

                {/* Hover accent line */}
                <div className={`h-px w-0 group-hover:w-16 bg-gradient-to-r ${pillar.accent} transition-all duration-700 mt-8`} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
