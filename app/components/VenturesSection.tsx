'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ventures = [
  {
    name: 'AetherLink',
    role: 'AI & Technology',
    location: 'Netherlands',
    description: 'Enterprise AI consulting. Intelligent automation, agent ecosystems, and strategic digital transformation for industry leaders.',
    stats: { metric: 'EUR 225', label: '/hour consulting' },
  },
  {
    name: 'TaigaSchool',
    role: 'Hospitality & Nature',
    location: 'Finland',
    description: 'Regenerative eco-resort in the Kuusamo wilderness. Boutique cabins, Northern Lights experiences, and deep forest immersion.',
    stats: { metric: '180ha', label: 'of pristine taiga' },
  },
  {
    name: 'Van Diemen',
    role: 'Maritime Technology',
    location: 'Netherlands',
    description: 'Advanced ship recycling and maritime decommissioning technology. Pioneering sustainable end-of-life solutions for the global fleet.',
    stats: { metric: '€50K', label: 'first contract value' },
  },
  {
    name: 'Solvari',
    role: 'Platform Design',
    location: 'Netherlands',
    description: 'Design system and AI integration for one of the largest home improvement platforms in the Benelux. Strategic consulting and UX architecture.',
    stats: { metric: '2026', label: 'design system' },
  },
];

export function VenturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const counterY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="ventures" ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Subtle gradient shift */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy to-navy-deep" />

      {/* Floating accent */}
      <motion.div
        style={{ y: counterY, background: 'radial-gradient(circle, #C5956B, transparent 70%)' }}
        className="absolute left-0 top-1/4 w-96 h-96 rounded-full opacity-[0.03]"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="mb-24 md:mb-32 text-right"
        >
          <span className="font-[family-name:var(--font-sans)] text-[11px] tracking-[0.4em] uppercase text-rose-gold/60 block mb-4">
            Portfolio
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream leading-[1.1]">
            Our
            <span className="text-rose-gradient italic"> Ventures</span>
          </h2>
          <div className="gold-line w-24 mt-10 ml-auto" />
        </motion.div>

        {/* Venture cards */}
        <div className="space-y-1">
          {ventures.map((venture, i) => (
            <motion.article
              key={venture.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative border-t border-rose-gold/10 py-10 md:py-14 cursor-default"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-0">
                {/* Name + Role */}
                <div className="md:w-1/3">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream group-hover:text-rose-gold-light transition-colors duration-500">
                    {venture.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-[family-name:var(--font-sans)] text-xs tracking-[0.15em] uppercase text-rose-gold/50">
                      {venture.role}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-rose-gold/30" />
                    <span className="font-[family-name:var(--font-sans)] text-xs tracking-[0.1em] text-cream/30">
                      {venture.location}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="md:w-1/3 font-[family-name:var(--font-serif)] text-base text-cream/40 leading-relaxed group-hover:text-cream/60 transition-colors duration-500">
                  {venture.description}
                </p>

                {/* Stat */}
                <div className="md:w-1/3 md:text-right">
                  <span className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-rose-gold/20 group-hover:text-rose-gold/50 transition-colors duration-500">
                    {venture.stats.metric}
                  </span>
                  <span className="block font-[family-name:var(--font-sans)] text-[10px] tracking-[0.2em] uppercase text-cream/20 mt-1">
                    {venture.stats.label}
                  </span>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-gold/[0.02] via-transparent to-transparent" />
              </div>
            </motion.article>
          ))}
          <div className="border-t border-rose-gold/10" />
        </div>
      </div>
    </section>
  );
}
