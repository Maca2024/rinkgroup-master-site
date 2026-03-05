'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const insights = [
  {
    symbol: '◯',
    title: 'De Cirkel van Dienst',
    body: 'Van het beschermen van naties tot het beschermen van ideeën. Dienst is geen fase — het is een frequentie. Of je nu een konvooi door Helmand leidt of een AI-strategie voor een multinational ontwikkelt: het fundament is hetzelfde. Luisteren. Analyseren. Handelen. Beschermen.',
    accent: 'text-rose-gold/60',
  },
  {
    symbol: '△',
    title: 'Kracht door Overgave',
    body: 'Het Korps leerde vechten. De jungle leerde loslaten. De diepste les kwam niet uit een trainingshandboek maar uit de stilte tussen twee ademhalingen. Ware kracht is niet de afwezigheid van kwetsbaarheid — het is de moed om er doorheen te ademen.',
    accent: 'text-emerald-400/60',
  },
  {
    symbol: '□',
    title: 'Systemen Zien',
    body: 'Elk slagveld is een systeem. Elke boardroom is een systeem. Elk ecosysteem is een systeem. De rode draad door alles: het vermogen om patronen te zien waar anderen chaos ervaren. Van militaire operaties tot autonome AI-architecturen — de taal verandert, de grammatica blijft.',
    accent: 'text-cyan-400/60',
  },
  {
    symbol: '◇',
    title: 'De Synthese',
    body: 'Technologie zonder wijsheid is gevaarlijk. Wijsheid zonder technologie is traag. De toekomst ligt in de synthese — waar de precisie van machines samenkomt met de intuïtie van het menselijk hart. AetherLink is geboren uit deze overtuiging: dat AI en menselijkheid geen tegenpolen zijn, maar partners.',
    accent: 'text-purple-400/60',
  },
];

const breathQuote = {
  text: 'Tussen de inademing en de uitademing ligt een stilte. In die stilte woont alles wat je nodig hebt.',
  attribution: '— Marco Rink, ergens in de jungle',
};

export function MarcoPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 overflow-hidden">
      {/* Ambient background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 20% 50%, rgba(139,92,246,0.04) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 80% 30%, rgba(6,182,212,0.03) 0%, transparent 60%),
              radial-gradient(ellipse 70% 60% at 50% 80%, rgba(197,149,107,0.03) 0%, transparent 50%)
            `,
          }}
        />
      </motion.div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mb-20 md:mb-32"
        >
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-4">
            Filosofie
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream">
            Wat de <span className="text-rose-gradient italic">Reis</span> Leerde
          </h2>
        </motion.div>

        {/* Breath quote — cinematic center piece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="relative mb-24 md:mb-36 py-16 md:py-24 flex flex-col items-center text-center"
        >
          {/* Breathing circle */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full border border-rose-gold/10"
          />
          <motion.div
            animate={{
              scale: [1.1, 0.95, 1.1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute w-36 h-36 md:w-56 md:h-56 rounded-full border border-cyan-500/10"
          />

          <blockquote className="relative z-10 max-w-2xl">
            <p className="font-[family-name:var(--font-serif)] text-xl md:text-2xl lg:text-3xl text-cream/50 italic leading-relaxed">
              &ldquo;{breathQuote.text}&rdquo;
            </p>
            <footer className="mt-6 font-[family-name:var(--font-sans)] text-[10px] tracking-[0.4em] uppercase text-rose-gold/30">
              {breathQuote.attribution}
            </footer>
          </blockquote>
        </motion.div>

        {/* Insight cards */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group relative p-8 md:p-10 border border-rose-gold/[0.06] hover:border-rose-gold/[0.15] transition-all duration-700 overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative">
                {/* Symbol */}
                <span className={`block text-4xl md:text-5xl font-light ${insight.accent} mb-6 transition-transform duration-500 group-hover:scale-110 origin-left`}>
                  {insight.symbol}
                </span>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-cream group-hover:text-rose-gold-light transition-colors duration-500 mb-4 italic">
                  {insight.title}
                </h3>

                {/* Body */}
                <p className="font-[family-name:var(--font-serif)] text-sm md:text-base text-cream/30 leading-relaxed group-hover:text-cream/50 transition-colors duration-500">
                  {insight.body}
                </p>
              </div>

              {/* Bottom shimmer */}
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
