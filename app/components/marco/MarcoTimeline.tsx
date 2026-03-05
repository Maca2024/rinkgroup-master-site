'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Chapter {
  era: string;
  year: string;
  title: string;
  location: string;
  body: string;
  icon: string;
  color: string;
}

const chapters: Chapter[] = [
  {
    era: 'I',
    year: '1985–2000',
    title: 'De Veengronden',
    location: 'Klazienaveen, Drenthe',
    body: 'Opgegroeid in de arbeiderswijken van Klazienaveen — een dorp gebouwd op turf en doorzettingsvermogen. Tussen de veengronden en kanalen van Zuidoost-Drenthe leerde Marco wat het betekent om met weinig veel te bereiken. Geen zilver in de wieg, maar een onbreekbare wil gesmeed in de nuchterheid van het Noorden. De wijde Drentse luchten en eindeloze velden vormden een jongen die altijd verder wilde kijken dan de horizon.',
    icon: '🏚️',
    color: 'from-amber-900/20 to-transparent',
  },
  {
    era: 'II',
    year: '2000–2006',
    title: 'Het Korps Mariniers',
    location: 'Rotterdam · Wereldwijd',
    body: 'Op jonge leeftijd meldde Marco zich bij het Korps Mariniers — de elite van de Nederlandse krijgsmacht. De basisopleiding in Rotterdam brak alles af wat zwak was en herbouwde wat nodig was. Jungle warfare in Belize, arctische operaties in Noorwegen, amfibische aanvallen in de Noordzee. Het Korps leerde hem leiderschap onder druk, broederschap in de modder, en het vermogen om te functioneren wanneer alles op instorten staat. "Per Mare, Per Terram" werd meer dan een motto — het werd een levenshouding.',
    icon: '⚓',
    color: 'from-navy-light/30 to-transparent',
  },
  {
    era: 'III',
    year: '2006–2012',
    title: 'Politie & Diplomatieke Beveiliging',
    location: 'Nederland · Internationaal',
    body: 'Na het Korps volgde de politiedienst en een specialisatie in diplomatieke beveiliging. Het beschermen van ambassadeurs, konvooien door risicogebieden, en het opereren in de schaduw van internationale diplomatie. Marco leerde de kunst van het onzichtbaar zijn terwijl je overal aanwezig bent. De wereld zag er anders uit door het vizier van een beveiligingsdetail — elke kamer werd beoordeeld op uitgangen, elke menigte op dreigingen, elke handdruk op intentie.',
    icon: '🛡️',
    color: 'from-slate-700/20 to-transparent',
  },
  {
    era: 'IV',
    year: '2012–2018',
    title: 'De Boardrooms van Dubai',
    location: 'Dubai · Abu Dhabi · Wereldwijd',
    body: 'De sprong van defensie naar business bracht Marco naar de wolkenkrabbers van Dubai en de boardrooms van het Midden-Oosten. Hier ontdekte hij dat dezelfde principes die werken onder vuur — leiderschap, besluitvaardigheid, systeemdenken — ook gelden in de zakenwereld. Van security consulting tot business development, van de haven van Jebel Ali tot de skyline van Downtown Dubai. De woestijn leerde een nieuwe les: wie dorst heeft, graaft dieper.',
    icon: '🏙️',
    color: 'from-yellow-600/10 to-transparent',
  },
  {
    era: 'V',
    year: '2018–2020',
    title: 'De Jungle & De Adem',
    location: 'Zuid-Amerika · Zuidoost-Azië',
    body: 'Het keerpunt. Na jaren van high-performance leven trok Marco de jungle in — letterlijk en figuurlijk. Diep in de regenwouden van Zuid-Amerika en de tempels van Azië vond hij wat geen boardroom kan bieden: stilte. Als ademcoach en student van oude wijsheidstradities ontdekte hij de kracht van breathwork, meditatie en diepe innerlijke transformatie. De jungle leerde wat het Korps niet kon: dat ware kracht begint met overgave. Dat de diepste strategieën niet in het hoofd maar in het hart ontstaan.',
    icon: '🌿',
    color: 'from-emerald-800/15 to-transparent',
  },
  {
    era: 'VI',
    year: '2020–2024',
    title: 'Spirituele Diepgang',
    location: 'Nederland · Finland · Overal',
    body: 'Terug van de reizen, maar innerlijk getransformeerd. Marco integreerde alles — de discipline van het Korps, de scherpte van de beveiliging, de ambitie van Dubai, de wijsheid van de jungle — tot een nieuw geheel. Diepe studie van systemen, bewustzijn en technologie. Het besef dat de toekomst niet ligt in óf technologie óf natuur, maar in de synthese van beide. De marinier werd filosoof. De beveiliger werd bouwer. De avonturier vond zijn thuisbasis.',
    icon: '🕉️',
    color: 'from-purple-900/15 to-transparent',
  },
  {
    era: 'VII',
    year: '2024–nu',
    title: 'De Finse Wildernis',
    location: 'Kuusamo, Finland',
    body: 'In de eindeloze stilte van de Finse taiga — 180 hectare ongerept bos, waar wolven huilen en het noorderlicht danst — vond Marco eindelijk de plek waar alles samenkwam. Hier, in de diepte van de natuur, werd AetherLink geboren: de overtuiging dat AI en menselijke wijsheid samen moeten gaan. Hier ontstond TaigaSchool: een eco-hotel waar gasten de transformatieve kracht van de wildernis kunnen ervaren. Van een arbeiderskind uit Drenthe tot de oprichter van een holding die technologie, natuur en menselijkheid verbindt. Het verhaal is nog lang niet af.',
    icon: '🌲',
    color: 'from-cyan-900/15 to-transparent',
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
            className="w-full bg-gradient-to-b from-rose-gold/30 via-rose-gold/20 to-rose-gold/5"
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [index % 2 === 0 ? -60 : 60, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, scale }}
      className={`relative grid md:grid-cols-2 gap-8 md:gap-16 ${
        index % 2 === 0 ? '' : 'md:direction-rtl'
      }`}
    >
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-rose-gold/30 bg-navy-deep z-10 flex items-center justify-center"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-rose-gold/50" />
      </motion.div>

      {/* Era badge — positioned on the empty side */}
      <div className={`hidden md:flex items-start justify-center pt-2 ${
        index % 2 === 0 ? 'order-2' : 'order-1'
      }`} style={{ direction: 'ltr' }}>
        <div className="text-center">
          <span className="font-[family-name:var(--font-serif)] text-6xl md:text-7xl text-rose-gold/[0.08] block">
            {chapter.era}
          </span>
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.3em] uppercase text-cream/15 block mt-2">
            {chapter.year}
          </span>
          <span className="text-4xl block mt-4 opacity-20">
            {chapter.icon}
          </span>
        </div>
      </div>

      {/* Content card */}
      <div className={`pl-12 md:pl-0 ${
        index % 2 === 0 ? 'order-1 md:pr-16' : 'order-2 md:pl-16'
      }`} style={{ direction: 'ltr' }}>
        <div className={`group relative p-6 md:p-10 border border-rose-gold/[0.06] hover:border-rose-gold/[0.15] transition-all duration-700 magnetic-glow overflow-hidden`}>
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

            {/* Body */}
            <p className="font-[family-name:var(--font-serif)] text-sm md:text-base text-cream/35 leading-relaxed group-hover:text-cream/55 transition-colors duration-500">
              {chapter.body}
            </p>
          </div>

          {/* Hover shimmer */}
          <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}
