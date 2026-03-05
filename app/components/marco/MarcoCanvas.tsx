'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
  maxLife: number;
  type: 'dust' | 'ember' | 'spirit';
}

export function MarcoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);

  const createParticle = useCallback((w: number, h: number, type: Particle['type']): Particle => {
    const configs = {
      dust: { size: [0.5, 2], hue: [25, 50], speed: 0.3, life: [200, 600] },
      ember: { size: [1, 3], hue: [15, 45], speed: 0.8, life: [100, 300] },
      spirit: { size: [1, 4], hue: [180, 280], speed: 0.5, life: [300, 800] },
    };
    const c = configs[type];
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * c.speed,
      vy: (Math.random() - 0.5) * c.speed - 0.2,
      size: c.size[0] + Math.random() * (c.size[1] - c.size[0]),
      hue: c.hue[0] + Math.random() * (c.hue[1] - c.hue[0]),
      life: 0,
      maxLife: c.life[0] + Math.random() * (c.life[1] - c.life[0]),
      type,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Initialize particles
    const w = window.innerWidth;
    const h = window.innerHeight;
    const particles = particlesRef.current;
    for (let i = 0; i < 120; i++) particles.push(createParticle(w, h, 'dust'));
    for (let i = 0; i < 40; i++) particles.push(createParticle(w, h, 'ember'));
    for (let i = 0; i < 30; i++) particles.push(createParticle(w, h, 'spirit'));

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const animate = () => {
      frameRef.current++;
      const t = frameRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scroll = scrollRef.current;

      // Evolving background color based on scroll
      const bgHue = 220 + scroll * 80; // navy → teal as you scroll
      ctx.fillStyle = `hsla(${bgHue}, 30%, 4%, 0.08)`;
      ctx.fillRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life > p.maxLife) {
          particles[i] = createParticle(w, h, p.type);
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.1
          ? lifeRatio * 10
          : lifeRatio > 0.8
            ? (1 - lifeRatio) * 5
            : 1;

        // Mouse influence
        const dx = mx * w - p.x;
        const dy = my * h - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250 && dist > 0) {
          const force = (250 - dist) / 250;
          if (p.type === 'spirit') {
            // Spirits are attracted to mouse
            p.vx += dx / dist * force * 0.03;
            p.vy += dy / dist * force * 0.03;
          } else {
            // Others repelled
            p.vx -= dx / dist * force * 0.015;
            p.vy -= dy / dist * force * 0.015;
          }
        }

        // Organic movement
        p.vx += Math.sin(t * 0.003 + p.y * 0.005) * 0.008;
        p.vy += Math.cos(t * 0.002 + p.x * 0.005) * 0.008;

        // Scroll wind
        p.vx += scroll * 0.02 * Math.sin(t * 0.01 + i);

        // Damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw
        const saturation = p.type === 'spirit' ? 70 : 50;
        const lightness = p.type === 'ember' ? 55 : p.type === 'spirit' ? 60 : 40;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + scroll * 60}, ${saturation}%, ${lightness}%, ${alpha * (p.type === 'dust' ? 0.25 : p.type === 'ember' ? 0.5 : 0.4)})`;
        ctx.fill();

        // Glow for embers and spirits
        if (p.type !== 'dust' && alpha > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grd.addColorStop(0, `hsla(${p.hue}, ${saturation}%, ${lightness}%, ${alpha * 0.15})`);
          grd.addColorStop(1, 'transparent');
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Connection lines for nearby spirits
        if (p.type === 'spirit') {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            if (q.type !== 'spirit') continue;
            const d2 = Math.hypot(p.x - q.x, p.y - q.y);
            if (d2 < 120) {
              const qAlpha = q.life / q.maxLife;
              const lineAlpha = (1 - d2 / 120) * Math.min(alpha, qAlpha < 0.1 ? qAlpha * 10 : qAlpha > 0.8 ? (1 - qAlpha) * 5 : 1) * 0.15;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 60%, 55%, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Mouse glow
      const glowX = mx * w;
      const glowY = my * h;
      const glowGrd = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 200);
      glowGrd.addColorStop(0, `hsla(${30 + scroll * 150}, 60%, 50%, 0.02)`);
      glowGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrd;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      particlesRef.current = [];
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: '#060a10' }}
    />
  );
}
