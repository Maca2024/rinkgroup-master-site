'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
}

export function ParticleLaurel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Array<{ x: number; y: number; size: number; alpha: number; twinkleSpeed: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
      initStars();
    };

    const initStars = () => {
      starsRef.current = [];
      const count = Math.floor((width * height) / 8000);
      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.4 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    const initParticles = () => {
      particlesRef.current = [];
      const cx = width / 2;
      const cy = height * 0.42;
      const radiusX = Math.min(width, height) * 0.14;
      const radiusY = Math.min(width, height) * 0.14;
      const count = 180;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const wobble = Math.sin(angle * 6) * (radiusX * 0.08);
        const r = radiusX + wobble;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * (radiusY + wobble * 0.7);

        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.005 + 0.002,
        });
      }

      // Add leaf-shaped particle clusters
      for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI * 2;
        const leafAngle = angle + Math.PI / 2;
        const leafLen = radiusX * 0.25;
        const baseR = radiusX + Math.sin(angle * 6) * (radiusX * 0.08);

        for (let j = 0; j < 5; j++) {
          const t = (j / 5) * leafLen;
          const spread = Math.sin((j / 5) * Math.PI) * 6;

          const bx = cx + Math.cos(angle) * baseR;
          const by = cy + Math.sin(angle) * (radiusY + Math.sin(angle * 6) * radiusY * 0.08);

          const lx = bx + Math.cos(leafAngle) * t + (Math.random() - 0.5) * spread;
          const ly = by + Math.sin(leafAngle) * t + (Math.random() - 0.5) * spread;

          particlesRef.current.push({
            x: lx,
            y: ly,
            baseX: lx,
            baseY: ly,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.8 + 0.5,
            alpha: Math.random() * 0.4 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.008 + 0.003,
          });
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / width,
        y: e.clientY / height,
      };
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 165, 116, ${star.alpha * twinkle})`;
        ctx.fill();
      }

      const mx = mouseRef.current.x * width;
      const my = mouseRef.current.y * height;

      // Draw and update particles
      for (const p of particlesRef.current) {
        // Organic breathing
        const breathX = Math.sin(time * p.speed + p.phase) * 3;
        const breathY = Math.cos(time * p.speed * 0.7 + p.phase) * 3;

        // Mouse repulsion
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let repelX = 0;
        let repelY = 0;

        if (dist < 120) {
          const force = (120 - dist) / 120;
          repelX = -dx * force * 0.08;
          repelY = -dy * force * 0.08;
        }

        // Spring back to base
        const springX = (p.baseX - p.x) * 0.03;
        const springY = (p.baseY - p.y) * 0.03;

        p.vx += springX + repelX;
        p.vy += springY + repelY;
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx + breathX * 0.1;
        p.y += p.vy + breathY * 0.1;

        // Draw with glow
        const glowAlpha = p.alpha * (0.7 + Math.sin(time * 0.003 + p.phase) * 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 149, 107, ${glowAlpha * 0.15})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 165, 116, ${glowAlpha})`;
        ctx.fill();
      }

      // Draw connection lines between nearby particles (subtle)
      for (let i = 0; i < particlesRef.current.length; i++) {
        const a = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const b = particlesRef.current[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 20) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(197, 149, 107, ${0.08 * (1 - d / 20)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ background: 'transparent' }}
    />
  );
}
