'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Sacred geometry canvas — draws breath-synced concentric patterns
function SacredGeometryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const size = Math.min(window.innerWidth * 0.8, 600);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      const size = canvas.width / dpr;
      const cx = size / 2;
      const cy = size / 2;
      const t = time * 0.001;

      ctx.clearRect(0, 0, size, size);

      // Breathing cycle — 6 second period (inhale 3s, exhale 3s)
      const breathPhase = (Math.sin(t * Math.PI / 3) + 1) / 2; // 0-1
      const baseRadius = 80 + breathPhase * 40;

      // Concentric rings
      for (let ring = 0; ring < 7; ring++) {
        const r = baseRadius + ring * (20 + breathPhase * 10);
        const segments = 6 + ring * 2;
        const rotation = t * 0.1 * (ring % 2 === 0 ? 1 : -1) + ring * 0.3;

        ctx.beginPath();
        ctx.strokeStyle = `hsla(${30 + ring * 25}, 50%, 55%, ${0.06 - ring * 0.006})`;
        ctx.lineWidth = 0.5;

        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2 + rotation;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Vertices
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2 + rotation;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;
          const dotSize = 1 + breathPhase * 0.5;

          ctx.beginPath();
          ctx.arc(px, py, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${30 + ring * 25}, 60%, 60%, ${0.15 - ring * 0.015})`;
          ctx.fill();
        }
      }

      // Center — flower of life pattern
      const petalCount = 6;
      const petalR = baseRadius * 0.6;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2 + t * 0.05;
        const px = cx + Math.cos(angle) * petalR * 0.5;
        const py = cy + Math.sin(angle) * petalR * 0.5;

        ctx.beginPath();
        ctx.arc(px, py, petalR * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(30, 60%, 55%, ${0.04 + breathPhase * 0.03})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Center dot — breath indicator
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15 + breathPhase * 10);
      centerGlow.addColorStop(0, `hsla(30, 70%, 60%, ${0.2 + breathPhase * 0.2})`);
      centerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(cx - 30, cy - 30, 60, 60);

      ctx.beginPath();
      ctx.arc(cx, cy, 2 + breathPhase * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(30, 70%, 65%, ${0.4 + breathPhase * 0.3})`;
      ctx.fill();

      // Radial lines — rotating spokes
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * 0.02;
        const innerR = baseRadius * 0.3;
        const outerR = baseRadius + 7 * (20 + breathPhase * 10);

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
        ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
        ctx.strokeStyle = `hsla(30, 40%, 50%, 0.02)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
    />
  );
}

const insights = [
  {
    symbol: '◯',
    title: 'De Cirkel van Dienst',
    body: 'Van het beschermen van naties tot het beschermen van ideeën. Dienst is geen fase — het is een frequentie. Of je nu een konvooi door Helmand leidt of een AI-strategie voor een multinational ontwikkelt: het fundament is hetzelfde. Luisteren. Analyseren. Handelen. Beschermen.',
    hue: 30,
  },
  {
    symbol: '△',
    title: 'Kracht door Overgave',
    body: 'Het Korps leerde vechten. De jungle leerde loslaten. De diepste les kwam niet uit een trainingshandboek maar uit de stilte tussen twee ademhalingen. Ware kracht is niet de afwezigheid van kwetsbaarheid — het is de moed om er doorheen te ademen.',
    hue: 150,
  },
  {
    symbol: '□',
    title: 'Systemen Zien',
    body: 'Elk slagveld is een systeem. Elke boardroom is een systeem. Elk ecosysteem is een systeem. De rode draad door alles: het vermogen om patronen te zien waar anderen chaos ervaren. Van militaire operaties tot autonome AI-architecturen — de taal verandert, de grammatica blijft.',
    hue: 200,
  },
  {
    symbol: '◇',
    title: 'De Synthese',
    body: 'Technologie zonder wijsheid is gevaarlijk. Wijsheid zonder technologie is traag. De toekomst ligt in de synthese — waar de precisie van machines samenkomt met de intuïtie van het menselijk hart. AetherLink is geboren uit deze overtuiging.',
    hue: 280,
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
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
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

        {/* Sacred geometry + breath quote — cinematic center piece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.2 }}
          className="relative mb-24 md:mb-40 py-20 md:py-32 flex flex-col items-center text-center"
        >
          {/* Sacred geometry canvas behind the quote */}
          <SacredGeometryCanvas />

          {/* Breathing pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-56 h-56 md:w-80 md:h-80 rounded-full border border-rose-gold/10"
          />
          <motion.div
            animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.06, 0.15, 0.06] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute w-44 h-44 md:w-64 md:h-64 rounded-full border border-cyan-500/10"
          />
          <motion.div
            animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.04, 0.12, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full border border-purple-400/10"
          />

          {/* Breath instruction */}
          <motion.div
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 md:top-8"
          >
            <span className="font-[family-name:var(--font-sans)] text-[8px] tracking-[0.6em] uppercase text-cream/20">
              Adem mee
            </span>
          </motion.div>

          <blockquote className="relative z-10 max-w-2xl">
            <p className="font-[family-name:var(--font-serif)] text-xl md:text-2xl lg:text-3xl text-cream/50 italic leading-relaxed">
              &ldquo;{breathQuote.text}&rdquo;
            </p>
            <footer className="mt-8 font-[family-name:var(--font-sans)] text-[10px] tracking-[0.4em] uppercase text-rose-gold/30">
              {breathQuote.attribution}
            </footer>
          </blockquote>
        </motion.div>

        {/* Insight cards — perspective grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 md:p-10 border border-rose-gold/[0.06] hover:border-rose-gold/[0.15] transition-all duration-700 overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Hover gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(ellipse at 30% 20%, hsla(${insight.hue}, 60%, 50%, 0.06) 0%, transparent 70%)`,
                }}
              />

              <div className="relative">
                {/* Symbol — animated */}
                <motion.span
                  className="block text-5xl md:text-6xl font-light mb-6"
                  style={{ color: `hsla(${insight.hue}, 50%, 60%, 0.5)` }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {insight.symbol}
                </motion.span>

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
