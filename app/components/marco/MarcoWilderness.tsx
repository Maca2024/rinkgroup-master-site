'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Full aurora borealis + snow canvas
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Snow particles
    const snowflakes: Array<{ x: number; y: number; r: number; vx: number; vy: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Init snowflakes
      snowflakes.length = 0;
      for (let i = 0; i < 80; i++) {
        snowflakes.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 0.5 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 0.3 + Math.random() * 1,
          opacity: 0.1 + Math.random() * 0.4,
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = time * 0.001;

      ctx.clearRect(0, 0, w, h);

      // === AURORA BOREALIS ===
      // Multiple undulating curtains
      for (let curtain = 0; curtain < 3; curtain++) {
        const baseY = h * (0.1 + curtain * 0.08);
        const amplitude = 30 + curtain * 15;
        const hue = curtain === 0 ? 130 : curtain === 1 ? 170 : 280;
        const speed = 0.3 + curtain * 0.1;

        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= w; x += 3) {
          const noise1 = Math.sin(x * 0.003 + t * speed) * amplitude;
          const noise2 = Math.sin(x * 0.007 + t * speed * 0.7 + curtain) * amplitude * 0.5;
          const noise3 = Math.sin(x * 0.001 + t * speed * 0.3) * amplitude * 0.8;
          const y = baseY + noise1 + noise2 + noise3;
          ctx.lineTo(x, y);
        }

        // Close the path to fill downward
        ctx.lineTo(w, baseY + amplitude * 3);
        ctx.lineTo(0, baseY + amplitude * 3);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - amplitude, 0, baseY + amplitude * 3);
        grad.addColorStop(0, `hsla(${hue}, 80%, 55%, ${0.02 + Math.sin(t * 0.5 + curtain) * 0.01})`);
        grad.addColorStop(0.3, `hsla(${hue}, 70%, 50%, ${0.04 + Math.sin(t * 0.3 + curtain) * 0.02})`);
        grad.addColorStop(0.6, `hsla(${hue + 20}, 60%, 45%, ${0.02 + Math.sin(t * 0.7 + curtain) * 0.01})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fill();

        // Bright edge at the top of each curtain
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const noise1 = Math.sin(x * 0.003 + t * speed) * amplitude;
          const noise2 = Math.sin(x * 0.007 + t * speed * 0.7 + curtain) * amplitude * 0.5;
          const noise3 = Math.sin(x * 0.001 + t * speed * 0.3) * amplitude * 0.8;
          const y = baseY + noise1 + noise2 + noise3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${0.06 + Math.sin(t + curtain) * 0.03})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // === TREELINE SILHOUETTE ===
      ctx.beginPath();
      ctx.moveTo(0, h);

      const treeLine = h * 0.7;
      for (let x = 0; x <= w; x += 1) {
        // Procedural treeline
        const treeNoise = Math.sin(x * 0.02) * 20 +
          Math.sin(x * 0.05) * 10 +
          Math.sin(x * 0.15) * 5;

        // Individual tree spikes
        const treeSpike = Math.abs(Math.sin(x * 0.08)) ** 3 * 40;

        const y = treeLine + treeNoise - treeSpike;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = '#040808';
      ctx.fill();

      // === SNOWFLAKES ===
      for (const flake of snowflakes) {
        flake.x += flake.vx + Math.sin(t + flake.y * 0.01) * 0.3;
        flake.y += flake.vy;

        if (flake.y > h) {
          flake.y = -5;
          flake.x = Math.random() * w;
        }
        if (flake.x < 0) flake.x = w;
        if (flake.x > w) flake.x = 0;

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 240, ${flake.opacity})`;
        ctx.fill();

        // Subtle glow
        if (flake.r > 1.5) {
          const glow = ctx.createRadialGradient(flake.x, flake.y, 0, flake.x, flake.y, flake.r * 3);
          glow.addColorStop(0, `rgba(220, 230, 240, ${flake.opacity * 0.3})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(flake.x - flake.r * 3, flake.y - flake.r * 3, flake.r * 6, flake.r * 6);
        }
      }

      // === STARS (above treeline) ===
      for (let i = 0; i < 50; i++) {
        const sx = (i * 23.7 + 11) % w;
        const sy = (i * 17.3 + 5) % (treeLine * 0.6);
        const twinkle = Math.sin(t * 2 + i * 1.7) * 0.3 + 0.4;
        const starSize = i % 7 === 0 ? 1.5 : 0.8;

        ctx.beginPath();
        ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 240, 232, ${twinkle * 0.5})`;
        ctx.fill();
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
      className="absolute inset-0 pointer-events-none"
    />
  );
}

const features = [
  { label: '180 ha', description: 'Ongerept Fins taigabos', icon: '🌲' },
  { label: '66°N', description: 'Arctische cirkel, Kuusamo', icon: '🧭' },
  { label: '−40°C', description: 'Winters onder het noorderlicht', icon: '❄️' },
  { label: '∞', description: 'Stilte', icon: '🔇' },
];

export function MarcoWilderness() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="relative py-0 overflow-hidden">
      {/* Full bleed aurora section */}
      <div className="relative min-h-screen flex flex-col justify-center">
        {/* Aurora canvas background */}
        <div className="absolute inset-0" style={{ background: '#060a10' }}>
          <AuroraCanvas />
        </div>

        <motion.div style={{ y: contentY }} className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-40">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="mb-16 md:mb-24"
          >
            <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.5em] uppercase text-emerald-400/50 block mb-4">
              Het Begin van Alles
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-8xl font-light text-cream">
              De Finse{' '}
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Wildernis
              </span>
            </h2>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20 md:mb-28"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.12 }}
                className="group text-center p-6 border border-emerald-500/[0.08] hover:border-emerald-500/[0.25] transition-all duration-700 backdrop-blur-sm bg-black/20"
              >
                <span className="text-2xl block mb-2 group-hover:scale-125 transition-transform duration-500">
                  {feat.icon}
                </span>
                <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-emerald-400/80 block mb-2 group-hover:text-emerald-300 transition-colors duration-500">
                  {feat.label}
                </span>
                <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.3em] uppercase text-cream/25">
                  {feat.description}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Two origin stories */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-20 md:mb-28">
            {/* AetherLink */}
            <motion.div
              initial={{ opacity: 0, x: -60, rotateY: -5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 md:p-10 border border-rose-gold/[0.06] hover:border-rose-gold/[0.2] transition-all duration-700 overflow-hidden backdrop-blur-sm bg-black/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative">
                <motion.span
                  className="text-4xl block mb-4"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  ⚡
                </motion.span>
                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream group-hover:text-rose-gold-light transition-colors duration-500 mb-4 italic">
                  AetherLink
                </h3>
                <p className="font-[family-name:var(--font-serif)] text-sm md:text-base text-cream/30 leading-relaxed group-hover:text-cream/55 transition-colors duration-500">
                  In de absolute stilte van het Finse bos — waar het enige geluid de wind door de berken is — ontstond het idee voor AetherLink. De overtuiging dat kunstmatige intelligentie niet tegenover de mens hoeft te staan, maar naast hem. Dat de kracht van AI pas echt tot zijn recht komt wanneer het wordt geleid door menselijke wijsheid, ervaring en empathie. Van consulting tot autonome systemen — AetherLink bouwt de brug tussen technologie en menselijkheid.
                </p>
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
            </motion.div>

            {/* TaigaSchool */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: 5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 md:p-10 border border-emerald-500/[0.08] hover:border-emerald-500/[0.25] transition-all duration-700 overflow-hidden backdrop-blur-sm bg-black/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative">
                <motion.span
                  className="text-4xl block mb-4"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  🌲
                </motion.span>
                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-cream group-hover:text-emerald-300 transition-colors duration-500 mb-4 italic">
                  TaigaSchool
                </h3>
                <p className="font-[family-name:var(--font-serif)] text-sm md:text-base text-cream/30 leading-relaxed group-hover:text-cream/55 transition-colors duration-500">
                  Wat als je de transformatieve kracht van de wildernis kon delen? TaigaSchool is het antwoord — een eco-hotel diep in de taiga van Kuusamo, waar gasten niet alleen de natuur bezoeken maar er deel van worden. Wandelingen door oerbos, nachten onder het noorderlicht, stilte als luxe. Van de veengronden van Drenthe tot de taiga van Finland — de cirkel is rond.
                </p>
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full shimmer transition-all duration-1000" />
            </motion.div>
          </div>

          {/* Closing statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="gold-line w-24 mx-auto mb-10" />
            <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl lg:text-2xl text-cream/35 italic leading-relaxed mb-6">
              Van een arbeiderskind in de veengronden van Drenthe tot de oprichter van een holding die technologie, natuur en menselijkheid verbindt.
            </p>
            <motion.p
              className="font-[family-name:var(--font-display)] text-3xl md:text-4xl lg:text-5xl italic leading-tight"
              style={{
                background: 'linear-gradient(135deg, #F5F0E8 0%, #C5956B 50%, #F5F0E8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Het verhaal is nog lang niet af.
            </motion.p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.4em] uppercase text-cream/15">
                Kuusamo, Finland
              </span>
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400/40"
              />
              <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.4em] uppercase text-cream/15">
                66°N
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
