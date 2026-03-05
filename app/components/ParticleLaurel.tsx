'use client';

import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  baseX: number; baseY: number;
  vx: number; vy: number;
  size: number; alpha: number;
  phase: number; speed: number;
  type: 'ring' | 'leaf' | 'dust';
  // Orbital angle offset for rotation
  orbitAngle: number;
  orbitRadius: number;
}

interface Star {
  x: number; y: number;
  size: number; alpha: number;
  speed: number; twinklePhase: number;
}

interface Ripple {
  x: number; y: number;
  radius: number; maxRadius: number;
  alpha: number; createdAt: number;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number;
  life: number; maxLife: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ParticleLaurel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const prevMouseRef = useRef({ x: -9999, y: -9999 });
  const lastSparkRef = useRef(0);
  const orbitRotationRef = useRef(0);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let w = 0, h = 0;
    let cx = 0, cy = 0, radius = 0;

    // ── Resize + init ─────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      init();
    };

    const init = () => {
      particlesRef.current = [];
      starsRef.current = [];
      ripplesRef.current = [];
      sparksRef.current = [];

      const isMobile = w < 768;
      isMobileRef.current = isMobile;

      cx = w / 2;
      cy = h * 0.40;
      radius = Math.min(w, h) * (isMobile ? 0.18 : 0.13);

      // ── Stars ──────────────────────────────────────────────────────────────
      const starCount = Math.min(Math.floor((w * h) / 5000), isMobile ? 60 : 300);
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.2 + 0.2,
          alpha: Math.random() * 0.3 + 0.05,
          speed: Math.random() * 0.015 + 0.003,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }

      // ── Ring particles (300 desktop / 150 mobile) ─────────────────────────
      const ringCount = isMobile ? 150 : 300;
      for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2;
        const wave1 = Math.sin(angle * 8) * radius * 0.06;
        const wave2 = Math.cos(angle * 5) * radius * 0.04;
        const r = radius + wave1 + wave2;

        particlesRef.current.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          baseX: cx + Math.cos(angle) * r,
          baseY: cy + Math.sin(angle) * r,
          vx: 0, vy: 0,
          size: Math.random() * 2 + 0.8,
          alpha: Math.random() * 0.6 + 0.4,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.004 + 0.001,
          type: 'ring',
          orbitAngle: angle,
          orbitRadius: r,
        });
      }

      // ── Leaf clusters (60 × 8 = 480 desktop / 30 × 8 = 240 mobile) ────────
      const leafClusterCount = isMobile ? 30 : 60;
      for (let i = 0; i < leafClusterCount; i++) {
        const angle = (i / leafClusterCount) * Math.PI * 2;
        const leafDir = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.4;
        const leafLen = radius * (0.2 + Math.random() * 0.15);
        const baseR = radius + Math.sin(angle * 8) * radius * 0.06;
        const bx = cx + Math.cos(angle) * baseR;
        const by = cy + Math.sin(angle) * baseR;

        for (let j = 0; j < 8; j++) {
          const t = (j / 8) * leafLen;
          const spread = Math.sin((j / 8) * Math.PI) * (4 + Math.random() * 4);
          const lx = bx + Math.cos(leafDir) * t + (Math.random() - 0.5) * spread;
          const ly = by + Math.sin(leafDir) * t + (Math.random() - 0.5) * spread;
          const distFromCenter = Math.sqrt((lx - cx) ** 2 + (ly - cy) ** 2);
          const leafAngle = Math.atan2(ly - cy, lx - cx);

          particlesRef.current.push({
            x: lx, y: ly, baseX: lx, baseY: ly,
            vx: 0, vy: 0,
            size: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.4 + 0.15,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.006 + 0.002,
            type: 'leaf',
            orbitAngle: leafAngle,
            orbitRadius: distFromCenter,
          });
        }
      }

      // ── Floating dust (80 desktop / 40 mobile) ────────────────────────────
      const dustCount = isMobile ? 40 : 80;
      for (let i = 0; i < dustCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * (0.5 + Math.random() * 1.2);
        particlesRef.current.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          baseX: cx + Math.cos(angle) * dist,
          baseY: cy + Math.sin(angle) * dist,
          vx: 0, vy: 0,
          size: Math.random() * 1 + 0.3,
          alpha: Math.random() * 0.15 + 0.03,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.01 + 0.005,
          type: 'dust',
          orbitAngle: angle,
          orbitRadius: dist,
        });
      }
    };

    // ── Mouse / Touch handlers ─────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      const prev = prevMouseRef.current;
      const moved = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);

      // Spawn ripple on significant movement
      if (moved > 12) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: 80 + Math.random() * 40,
          alpha: 0.35,
          createdAt: performance.now(),
        });
        // Keep ripple list bounded
        if (ripplesRef.current.length > 12) ripplesRef.current.shift();
      }

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const onTouch = (e: TouchEvent) => {
      mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
    };

    const onClick = (e: MouseEvent) => {
      // Click spawns a burst of ripples
      for (let k = 0; k < 3; k++) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: k * 15,
          maxRadius: 60 + k * 35,
          alpha: 0.5 - k * 0.1,
          createdAt: performance.now(),
        });
      }
    };

    // ── Spark emitter (called each frame near wreath) ──────────────────────────
    const maybeSpawnSpark = (time: number, orbitalRotation: number) => {
      const mobile = isMobileRef.current;
      const minInterval = mobile ? 400 : 200;
      const maxSparks = mobile ? 15 : 30;
      if (time - lastSparkRef.current < minInterval) return;
      lastSparkRef.current = time;

      // Random position on the ring
      const angle = Math.random() * Math.PI * 2 + orbitalRotation;
      const wave = Math.sin(angle * 8) * radius * 0.06 + Math.cos(angle * 5) * radius * 0.04;
      const r = radius + wave;
      const sx = cx + Math.cos(angle) * r;
      const sy = cy + Math.sin(angle) * r;

      // Direction: outward + slight random
      const outDir = angle + (Math.random() - 0.5) * 0.8;
      const speed = 0.8 + Math.random() * 1.4;

      sparksRef.current.push({
        x: sx, y: sy,
        vx: Math.cos(outDir) * speed,
        vy: Math.sin(outDir) * speed,
        alpha: 0.9,
        size: Math.random() * 1.5 + 0.5,
        life: 0,
        maxLife: 60 + Math.random() * 60,
      });

      // Trim
      if (sparksRef.current.length > maxSparks) sparksRef.current.shift();
    };

    // ── Main draw loop ─────────────────────────────────────────────────────────
    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // Global breathing scale (entire wreath contracts/expands)
      const breathScale = 1 + Math.sin(time * 0.0007) * 0.018;

      // Orbital rotation accumulates
      orbitRotationRef.current += 0.0002;
      const orbRot = orbitRotationRef.current;

      // ── Stars ────────────────────────────────────────────────────────────────
      for (const s of starsRef.current) {
        const twinkle = Math.sin(time * s.speed + s.twinklePhase);
        const a = s.alpha * (0.5 + twinkle * 0.5);
        if (a < 0.01) continue;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,130,${a})`;
        ctx.fill();

        if (s.size > 1 && a > 0.15) {
          ctx.beginPath();
          ctx.moveTo(s.x - s.size * 3, s.y);
          ctx.lineTo(s.x + s.size * 3, s.y);
          ctx.moveTo(s.x, s.y - s.size * 3);
          ctx.lineTo(s.x, s.y + s.size * 3);
          ctx.strokeStyle = `rgba(212,175,130,${a * 0.3})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Update + draw particles ───────────────────────────────────────────────
      for (const p of particlesRef.current) {
        // Apply orbital rotation: rotate base position around center
        const cosR = Math.cos(orbRot);
        const sinR = Math.sin(orbRot);
        const dx0 = p.baseX - cx;
        const dy0 = p.baseY - cy;
        const rotatedBaseX = cx + (dx0 * cosR - dy0 * sinR) * breathScale;
        const rotatedBaseY = cy + (dx0 * sinR + dy0 * cosR) * breathScale;

        // Breathing micro-motion
        const breathAmt = p.type === 'dust' ? 8 : p.type === 'leaf' ? 4 : 2;
        const breathX = Math.sin(time * p.speed + p.phase) * breathAmt;
        const breathY = Math.cos(time * p.speed * 0.7 + p.phase + 1) * breathAmt;

        // Mouse magnetic attraction / brightening
        let mouseBrightness = 1.0;
        let mouseSizeBoost = 1.0;
        if (mouseRef.current.active) {
          const pdx = mx - p.x;
          const pdy = my - p.y;
          const dist = Math.sqrt(pdx * pdx + pdy * pdy);
          const attractRange = p.type === 'dust' ? 160 : 120;
          const repelRange = p.type === 'dust' ? 200 : 140;

          if (dist < repelRange) {
            const force = ((repelRange - dist) / repelRange) * (p.type === 'dust' ? 0.12 : 0.05);
            // Gentle pull toward mouse within attractRange, then repel closer
            const direction = dist < attractRange * 0.4 ? -1 : 1;
            p.vx += pdx * force * direction * 0.01;
            p.vy += pdy * force * direction * 0.01;

            // Magnetic brightening
            const proximity = 1 - dist / repelRange;
            mouseBrightness = 1 + proximity * 1.2;
            mouseSizeBoost = 1 + proximity * 0.8;
          }
        }

        // Spring back to (rotated) base
        const springForce = p.type === 'dust' ? 0.01 : 0.04;
        p.vx += (rotatedBaseX - p.x) * springForce;
        p.vy += (rotatedBaseY - p.y) * springForce;
        p.vx *= 0.93;
        p.vy *= 0.93;

        p.x += p.vx + breathX * 0.05;
        p.y += p.vy + breathY * 0.05;

        const glowPulse = 0.7 + Math.sin(time * 0.002 + p.phase) * 0.3;
        const a = Math.min(1, p.alpha * glowPulse * mouseBrightness);
        const drawSize = p.size * mouseSizeBoost;

        // Outer glow
        if (p.type !== 'dust' && p.size > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(197,149,107,${a * 0.05})`;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        if (p.type === 'ring') {
          ctx.fillStyle = `rgba(212,165,116,${a})`;
        } else if (p.type === 'leaf') {
          ctx.fillStyle = `rgba(224,184,138,${a})`;
        } else {
          ctx.fillStyle = `rgba(197,149,107,${a})`;
        }
        ctx.fill();
      }

      // ── Constellation lines between ring particles ────────────────────────────
      const ringParticles = particlesRef.current.filter(p => p.type === 'ring');

      // Nearby particle connections (golden constellation, form/dissolve over time)
      for (let i = 0; i < ringParticles.length; i += 2) {
        const pa = ringParticles[i];
        // Check next few in the ring
        for (let j = i + 1; j < Math.min(i + 6, ringParticles.length); j++) {
          const pb = ringParticles[j];
          const d = Math.hypot(pa.x - pb.x, pa.y - pb.y);
          const maxDist = 32;
          if (d < maxDist) {
            // Dissolve factor driven by time — creates organic forming/dissolving
            const dissolveFactor = Math.sin(time * 0.0008 + i * 0.15 + j * 0.07);
            const lineAlpha = Math.max(0, dissolveFactor) * (1 - d / maxDist) * 0.18;
            if (lineAlpha < 0.005) continue;

            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);

            // Golden gradient line
            const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
            grad.addColorStop(0, `rgba(232,205,168,${lineAlpha})`);
            grad.addColorStop(0.5, `rgba(212,165,116,${lineAlpha * 1.4})`);
            grad.addColorStop(1, `rgba(232,205,168,${lineAlpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Long-distance sparse constellation (random pairings)
        if (i % 20 === 0) {
          const target = ringParticles[(i + 50 + Math.floor(Math.sin(i) * 30 + 30)) % ringParticles.length];
          const d = Math.hypot(pa.x - target.x, pa.y - target.y);
          if (d < 80) {
            const pulse = (Math.sin(time * 0.001 + i * 0.3) + 1) * 0.5;
            const a = pulse * (1 - d / 80) * 0.06;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(197,149,107,${a})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }

      // ── Ripple waves ─────────────────────────────────────────────────────────
      const now = performance.now();
      ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0.005);
      for (const r of ripplesRef.current) {
        const age = (now - r.createdAt) / 1000;
        r.radius += 1.8;
        r.alpha *= 0.94;

        if (r.radius > r.maxRadius) { r.alpha = 0; continue; }

        // Concentric circle — golden ripple
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,165,116,${r.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Inner fainter ring
        if (r.radius > 10) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(232,205,168,${r.alpha * 0.4})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }

        void age;
      }

      // ── Sparks ────────────────────────────────────────────────────────────────
      maybeSpawnSpark(time, orbRot);
      sparksRef.current = sparksRef.current.filter(s => s.life < s.maxLife);
      for (const s of sparksRef.current) {
        s.life++;
        const progress = s.life / s.maxLife;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.alpha = (1 - progress) * 0.9;

        // Spark glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,205,168,${s.alpha * 0.15})`;
        ctx.fill();

        // Spark core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,184,138,${s.alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('click', onClick);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
