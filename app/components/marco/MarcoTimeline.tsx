'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface Chapter {
  era: string;
  year: string;
  title: string;
  location: string;
  coordinates: string;
  body: string;
  icon: string;
  color: string;
  accentHue: number;
}

const chapters: Chapter[] = [
  {
    era: 'I',
    year: '1985–2000',
    title: 'De Veengronden',
    location: 'Klazienaveen, Drenthe',
    coordinates: '52.7°N  6.9°E',
    body: 'Opgegroeid in de arbeiderswijken van Klazienaveen — een dorp gebouwd op turf en doorzettingsvermogen. Tussen de veengronden en kanalen van Zuidoost-Drenthe leerde Marco wat het betekent om met weinig veel te bereiken. Geen zilver in de wieg, maar een onbreekbare wil gesmeed in de nuchterheid van het Noorden. De wijde Drentse luchten en eindeloze velden vormden een jongen die altijd verder wilde kijken dan de horizon.',
    icon: '🏚️',
    color: 'from-amber-900/20 to-transparent',
    accentHue: 30,
  },
  {
    era: 'II',
    year: '2000–2006',
    title: 'Het Korps Mariniers',
    location: 'Rotterdam · Wereldwijd',
    coordinates: '51.9°N  4.5°E',
    body: 'Op jonge leeftijd meldde Marco zich bij het Korps Mariniers — de elite van de Nederlandse krijgsmacht. De basisopleiding in Rotterdam brak alles af wat zwak was en herbouwde wat nodig was. Jungle warfare in Belize, arctische operaties in Noorwegen, amfibische aanvallen in de Noordzee. Het Korps leerde hem leiderschap onder druk, broederschap in de modder, en het vermogen om te functioneren wanneer alles op instorten staat.',
    icon: '⚓',
    color: 'from-slate-600/20 to-transparent',
    accentHue: 210,
  },
  {
    era: 'III',
    year: '2006–2012',
    title: 'Politie & Diplomatieke Beveiliging',
    location: 'Nederland · Internationaal',
    coordinates: '52.1°N  5.1°E',
    body: 'Na het Korps volgde de politiedienst en een specialisatie in diplomatieke beveiliging. Het beschermen van ambassadeurs, konvooien door risicogebieden, en het opereren in de schaduw van internationale diplomatie. Marco leerde de kunst van het onzichtbaar zijn terwijl je overal aanwezig bent. Elke kamer werd beoordeeld op uitgangen, elke menigte op dreigingen, elke handdruk op intentie.',
    icon: '🛡️',
    color: 'from-slate-700/20 to-transparent',
    accentHue: 240,
  },
  {
    era: 'IV',
    year: '2012–2018',
    title: 'De Boardrooms van Dubai',
    location: 'Dubai · Abu Dhabi · Wereldwijd',
    coordinates: '25.2°N  55.3°E',
    body: 'De sprong van defensie naar business bracht Marco naar de wolkenkrabbers van Dubai en de boardrooms van het Midden-Oosten. Hier ontdekte hij dat dezelfde principes die werken onder vuur — leiderschap, besluitvaardigheid, systeemdenken — ook gelden in de zakenwereld. Van security consulting tot business development. De woestijn leerde een nieuwe les: wie dorst heeft, graaft dieper.',
    icon: '🏙️',
    color: 'from-yellow-600/10 to-transparent',
    accentHue: 45,
  },
  {
    era: 'V',
    year: '2018–2020',
    title: 'De Jungle & De Adem',
    location: 'Zuid-Amerika · Zuidoost-Azië',
    coordinates: '−3.4°S  72.8°W',
    body: 'Het keerpunt. Na jaren van high-performance leven trok Marco de jungle in — letterlijk en figuurlijk. Diep in de regenwouden van Zuid-Amerika en de tempels van Azië vond hij wat geen boardroom kan bieden: stilte. Als ademcoach en student van oude wijsheidstradities ontdekte hij de kracht van breathwork, meditatie en diepe innerlijke transformatie. De jungle leerde wat het Korps niet kon: dat ware kracht begint met overgave.',
    icon: '🌿',
    color: 'from-emerald-800/15 to-transparent',
    accentHue: 150,
  },
  {
    era: 'VI',
    year: '2020–2024',
    title: 'Spirituele Diepgang',
    location: 'Nederland · Finland · Overal',
    coordinates: '52.4°N  4.9°E',
    body: 'Terug van de reizen, maar innerlijk getransformeerd. Marco integreerde alles — de discipline van het Korps, de scherpte van de beveiliging, de ambitie van Dubai, de wijsheid van de jungle — tot een nieuw geheel. Diepe studie van systemen, bewustzijn en technologie. Het besef dat de toekomst niet ligt in óf technologie óf natuur, maar in de synthese van beide. De marinier werd filosoof. De beveiliger werd bouwer.',
    icon: '🕉️',
    color: 'from-purple-900/15 to-transparent',
    accentHue: 280,
  },
  {
    era: 'VII',
    year: '2024–nu',
    title: 'De Finse Wildernis',
    location: 'Kuusamo, Finland',
    coordinates: '65.9°N  29.2°E',
    body: 'In de eindeloze stilte van de Finse taiga — 180 hectare ongerept bos, waar wolven huilen en het noorderlicht danst — vond Marco eindelijk de plek waar alles samenkwam. Hier werd AetherLink geboren: de overtuiging dat AI en menselijke wijsheid samen moeten gaan. Hier ontstond TaigaSchool: een eco-hotel waar gasten de transformatieve kracht van de wildernis kunnen ervaren. Het verhaal is nog lang niet af.',
    icon: '🌲',
    color: 'from-cyan-900/15 to-transparent',
    accentHue: 190,
  },
];

export function MarcoTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 mb-20 md:mb-32">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-rose-gold/40 block mb-4"
        >
          Het Pad
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream"
        >
          Zeven <span className="text-rose-gradient italic">Levens</span>
        </motion.h2>
      </div>

      {/* Timeline with central line */}
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Central line — grows with scroll */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-rose-gold/[0.06]">
          <motion.div
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-rose-gold/40 via-rose-gold/20 to-rose-gold/5"
          />
        </div>

        {/* Chapter cards */}
        <div className="space-y-16 md:space-y-24">
          {chapters.map((chapter, i) => (
            <TimelineCard key={chapter.era} chapter={chapter} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [index % 2 === 0 ? -80 : 80, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.5], [index % 2 === 0 ? -2 : 2, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: cy * -8, y: cx * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, scale, rotateZ }}
      className={`relative grid md:grid-cols-2 gap-8 md:gap-16 ${
        index % 2 === 0 ? '' : 'md:direction-rtl'
      }`}
    >
      {/* Timeline dot — pulsing */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="absolute left-6 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-rose-gold/30 bg-navy-deep z-10 flex items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute w-8 h-8 rounded-full border border-rose-gold/10"
        />
        <div className="w-2 h-2 rounded-full bg-rose-gold/60" />
      </motion.div>

      {/* Era badge — positioned on the empty side */}
      <div className={`hidden md:flex items-start justify-center pt-2 ${
        index % 2 === 0 ? 'order-2' : 'order-1'
      }`} style={{ direction: 'ltr' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', delay: 0.4 }}
          className="text-center"
        >
          <span
            className="font-[family-name:var(--font-serif)] text-7xl md:text-8xl block leading-none"
            style={{
              background: `linear-gradient(180deg, hsla(${chapter.accentHue}, 50%, 60%, 0.12) 0%, transparent 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {chapter.era}
          </span>
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-cream/15 block mt-2">
            {chapter.year}
          </span>
          <span className="text-4xl block mt-4 opacity-20">
            {chapter.icon}
          </span>
          <span className="font-mono text-[8px] text-cream/8 block mt-3 tracking-wider">
            {chapter.coordinates}
          </span>
        </motion.div>
      </div>

      {/* Content card — 3D tilt on hover */}
      <div className={`pl-12 md:pl-0 ${
        index % 2 === 0 ? 'order-1 md:pr-16' : 'order-2 md:pl-16'
      }`} style={{ direction: 'ltr' }}>
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.3s ease-out',
          }}
          className="group relative p-6 md:p-10 border border-rose-gold/[0.06] hover:border-rose-gold/[0.15] transition-all duration-700 magnetic-glow overflow-hidden cursor-pointer"
        >
          {/* Accent glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, hsla(${chapter.accentHue}, 60%, 50%, 0.06) 0%, transparent 70%)`,
            }}
          />

          {/* Warm gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

          {/* Mobile era badge */}
          <div className="md:hidden flex items-center gap-3 mb-4">
            <span className="text-2xl">{chapter.icon}</span>
            <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-cream/20">
              {chapter.year}
            </span>
          </div>

          <div className="relative">
            {/* Location */}
            <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-rose-gold/40 block mb-2">
              {chapter.location}
            </span>

            {/* Title */}
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream group-hover:text-rose-gold-light transition-colors duration-500 mb-4 italic">
              {chapter.title}
            </h3>

            {/* Body — truncated with expand */}
            <AnimatePresence mode="wait">
              <motion.p
                key={isExpanded ? 'full' : 'truncated'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-[family-name:var(--font-serif)] text-sm md:text-base text-cream/35 leading-relaxed group-hover:text-cream/55 transition-colors duration-500"
              >
                {isExpanded ? chapter.body : chapter.body.slice(0, 180) + '...'}
              </motion.p>
            </AnimatePresence>

            {/* Read more indicator */}
            <motion.span
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mt-3 font-[family-name:var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-rose-gold/30"
            >
              {isExpanded ? '↑ Minder' : '↓ Lees meer'}
            </motion.span>
          </div>

          {/* Hover shimmer line */}
          <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />

          {/* Corner accent */}
          <div
            className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `linear-gradient(225deg, hsla(${chapter.accentHue}, 50%, 50%, 0.08) 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
