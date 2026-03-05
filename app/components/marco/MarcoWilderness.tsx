'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const features = [
  { label: '180 hectare', description: 'Ongerept Fins taigabos' },
  { label: '66°N', description: 'Arctische cirkel, Kuusamo' },
  { label: '−40°C', description: 'Winters onder het noorderlicht' },
  { label: '∞', description: 'Stilte' },
];

export function MarcoWilderness() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const treesY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const auroraOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.6, 0]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 overflow-hidden">
      {/* Layered wilderness background */}
      <div className="absolute inset-0 -z-10">
        {/* Deep forest gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg,
                #080E1A 0%,
                #0a1a15 20%,
                #0d2218 40%,
                #0a1a15 60%,
                #080E1A 100%
              )
            `,
          }}
        />

        {/* Aurora borealis */}
        <motion.div
          style={{ opacity: auroraOpacity }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              opacity: [0.3, 0.6, 0.4, 0.3],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 20% at 30% 20%, rgba(34,197,94,0.12) 0%, transparent 70%),
                radial-gradient(ellipse 60% 15% at 60% 15%, rgba(6,182,212,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 40% 10% at 45% 25%, rgba(139,92,246,0.06) 0%, transparent 50%)
              `,
            }}
          />
        </motion.div>

        {/* Treeline silhouette — parallax */}
        <motion.div
          style={{ y: treesY }}
          className="absolute bottom-0 left-0 right-0 h-64 md:h-96"
        >
          {/* Tree shapes via CSS triangles */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => {
              const height = 60 + Math.sin(i * 0.7) * 40 + Math.cos(i * 1.3) * 20;
              const width = 12 + Math.sin(i * 1.1) * 6;
              return (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    background: `linear-gradient(180deg, rgba(10,26,21,0.9) 0%, rgba(8,14,26,0.95) 100%)`,
                    marginLeft: '-2px',
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-cream/20 rounded-full"
              style={{
                left: `${(i * 19 + 5) % 100}%`,
                top: `${(i * 11 + 3) % 40}%`,
              }}
              animate={{ opacity: [0.05, 0.4, 0.05] }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mb-16 md:mb-24"
        >
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-emerald-400/40 block mb-4">
            Het Begin van Alles
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream">
            De Finse <span className="text-rose-gradient italic">Wildernis</span>
          </h2>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 md:mb-28"
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center p-6 border border-emerald-500/[0.08] hover:border-emerald-500/[0.2] transition-colors duration-700"
            >
              <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-emerald-400/70 block mb-2">
                {feat.label}
              </span>
              <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-cream/25">
                {feat.description}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Two origin stories side by side */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-20 md:mb-28">
          {/* AetherLink birth */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="group relative p-8 md:p-10 border border-rose-gold/[0.06] hover:border-rose-gold/[0.15] transition-all duration-700 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative">
              <span className="text-3xl block mb-4">⚡</span>
              <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream group-hover:text-rose-gold-light transition-colors duration-500 mb-4 italic">
                AetherLink
              </h3>
              <p className="font-[family-name:var(--font-serif)] text-sm md:text-base text-cream/30 leading-relaxed group-hover:text-cream/50 transition-colors duration-500">
                In de absolute stilte van het Finse bos — waar het enige geluid de wind door de berken is — ontstond het idee voor AetherLink. De overtuiging dat kunstmatige intelligentie niet tegenover de mens hoeft te staan, maar naast hem. Dat de kracht van AI pas echt tot zijn recht komt wanneer het wordt geleid door menselijke wijsheid, ervaring en empathie. Van consulting tot autonome systemen — AetherLink bouwt de brug tussen technologie en menselijkheid.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
          </motion.div>

          {/* TaigaSchool birth */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="group relative p-8 md:p-10 border border-emerald-500/[0.06] hover:border-emerald-500/[0.15] transition-all duration-700 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative">
              <span className="text-3xl block mb-4">🌲</span>
              <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream group-hover:text-emerald-300 transition-colors duration-500 mb-4 italic">
                TaigaSchool
              </h3>
              <p className="font-[family-name:var(--font-serif)] text-sm md:text-base text-cream/30 leading-relaxed group-hover:text-cream/50 transition-colors duration-500">
                Wat als je de transformatieve kracht van de wildernis kon delen? TaigaSchool is het antwoord — een eco-hotel diep in de taiga van Kuusamo, waar gasten niet alleen de natuur bezoeken maar er deel van worden. Wandelingen door oerbos, nachten onder het noorderlicht, stilte als luxe. Van de veengronden van Drenthe tot de taiga van Finland — de cirkel is rond. De arbeidersjongen die altijd verder wilde kijken dan de horizon, heeft zijn horizon gevonden.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
          </motion.div>
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="gold-line w-24 mx-auto mb-10" />
          <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl lg:text-2xl text-cream/30 italic leading-relaxed mb-6">
            Van een arbeiderskind in de veengronden van Drenthe tot de oprichter van een holding die technologie, natuur en menselijkheid verbindt.
          </p>
          <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream/50 italic">
            Het verhaal is nog lang niet af.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.4em] uppercase text-cream/15">
              Kuusamo, Finland
            </span>
            <span className="w-1 h-1 rounded-full bg-emerald-400/20" />
            <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.4em] uppercase text-cream/15">
              66°N
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
