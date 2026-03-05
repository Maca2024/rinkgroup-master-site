'use client';

import { useEffect, useRef } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Orb {
  // Position as fraction of canvas dimensions [0..1]
  x: number;
  y: number;
  // Radius in logical pixels
  radius: number;
  // RGBA color components
  r: number;
  g: number;
  b: number;
  baseOpacity: number;
  // Phase offsets for the sin/cos fake-Perlin path
  phaseX: number;
  phaseY: number;
  // Frequency of the oscillation
  freqX: number;
  freqY: number;
  // Amplitude of drift in logical pixels
  ampX: number;
  ampY: number;
  // Parallax depth factor [0..1]  — deeper orbs move less with scroll
  depth: number;
  // Current pushed offset from mouse repulsion (smoothed)
  pushX: number;
  pushY: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const ORB_COUNT = 8;
const MOUSE_RADIUS = 220;         // pixels — repulsion zone
const PUSH_STRENGTH = 60;         // max push distance in pixels
const PUSH_SMOOTHING = 0.06;      // lerp factor per frame
const SCROLL_PARALLAX = 0.18;     // max parallax fraction per depth unit

// Rose-gold palette variants (R, G, B)
const ORB_COLORS: Array<[number, number, number]> = [
  [197, 149, 107],   // rose-gold #C5956B
  [212, 165, 116],   // rose-gold-light #D4A574
  [232, 205, 181],   // rose-gold-pale #E8CDB5
  [180, 130,  90],   // slightly darker warm gold
  [220, 175, 130],   // peachy gold
  [197, 149, 107],   // rose-gold repeat
  [215, 185, 155],   // warm champagne
  [190, 140, 100],   // muted amber
];

// ─── Orb factory ───────────────────────────────────────────────────────────────

function createOrbs(): Orb[] {
  return Array.from({ length: ORB_COUNT }, (_, i) => {
    const [r, g, b] = ORB_COLORS[i % ORB_COLORS.length];
    return {
      x: 0.05 + Math.random() * 0.90,
      y: 0.05 + Math.random() * 0.90,
      radius: 100 + Math.random() * 200,
      r, g, b,
      baseOpacity: 0.018 + Math.random() * 0.038,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      // Very slow drift: one full oscillation every ~15–35 seconds
      freqX: (0.018 + Math.random() * 0.022) * 0.001,
      freqY: (0.014 + Math.random() * 0.018) * 0.001,
      ampX: 60 + Math.random() * 80,
      ampY: 50 + Math.random() * 70,
      depth: 0.2 + Math.random() * 0.8,
      pushX: 0,
      pushY: 0,
    };
  });
}

// ─── AmbientOrbs component ─────────────────────────────────────────────────────

export function AmbientOrbs() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const orbsRef    = useRef<Orb[]>(createOrbs());
  const rafRef     = useRef<number>(0);
  const mouseRef   = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const scrollRef  = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Resize: match canvas to physical pixels ──────────────────────────────
    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      if (ctx) ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Mouse tracking ────────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Scroll tracking ───────────────────────────────────────────────────────
    function onScroll() {
      scrollRef.current = window.scrollY;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Animation loop ────────────────────────────────────────────────────────
    function draw(timestamp: number) {
      if (!canvas || !ctx) return;

      const W = window.innerWidth;
      const H = window.innerHeight;

      ctx.clearRect(0, 0, W, H);

      const mouse  = mouseRef.current;
      const scroll = scrollRef.current;
      const orbs   = orbsRef.current;

      for (const orb of orbs) {
        // ── Organic drift (fake Perlin via layered sin/cos) ──────────────────
        const t = timestamp;
        const driftX = Math.sin(t * orb.freqX + orb.phaseX) * orb.ampX
                     + Math.cos(t * orb.freqX * 0.7 + orb.phaseY) * orb.ampX * 0.4;
        const driftY = Math.cos(t * orb.freqY + orb.phaseY) * orb.ampY
                     + Math.sin(t * orb.freqY * 0.6 + orb.phaseX) * orb.ampY * 0.35;

        // ── Parallax offset from scroll ──────────────────────────────────────
        // Deeper orbs (higher depth) move more — gives a layered 3-D feel
        const parallaxY = scroll * SCROLL_PARALLAX * orb.depth * 0.12;

        // ── Centre of this orb in screen-space ──────────────────────────────
        const cx = orb.x * W + driftX + orb.pushX;
        const cy = orb.y * H + driftY + orb.pushY - parallaxY;

        // ── Mouse repulsion ──────────────────────────────────────────────────
        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetPushX = 0;
        let targetPushY = 0;
        if (dist < MOUSE_RADIUS && dist > 0) {
          // Quadratic falloff so the push is strong near the cursor
          const strength = (1 - dist / MOUSE_RADIUS) ** 2 * PUSH_STRENGTH;
          targetPushX = (dx / dist) * strength;
          targetPushY = (dy / dist) * strength;
        }

        // Smooth the push with lerp so orbs ease in and out of repulsion
        orb.pushX += (targetPushX - orb.pushX) * PUSH_SMOOTHING;
        orb.pushY += (targetPushY - orb.pushY) * PUSH_SMOOTHING;

        // ── Breathing opacity (pulse gently) ─────────────────────────────────
        const breathe = 0.8 + 0.2 * Math.sin(t * 0.0007 + orb.phaseX);
        const alpha   = orb.baseOpacity * breathe;

        // ── Draw radial gradient blob ─────────────────────────────────────────
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.radius);
        grad.addColorStop(0,   `rgba(${orb.r},${orb.g},${orb.b},${alpha})`);
        grad.addColorStop(0.4, `rgba(${orb.r},${orb.g},${orb.b},${alpha * 0.55})`);
        grad.addColorStop(0.7, `rgba(${orb.r},${orb.g},${orb.b},${alpha * 0.18})`);
        grad.addColorStop(1,   `rgba(${orb.r},${orb.g},${orb.b},0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        // Soft compositing so orbs blend luxuriously over the dark background
        mixBlendMode: 'screen',
      }}
    />
  );
}
