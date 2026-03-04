'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative py-16 border-t border-rose-gold/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo text */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.25em] text-rose-gold/40">
              RINK GROUP
            </span>
            <span className="font-[family-name:var(--font-serif)] text-xs tracking-[0.15em] text-cream/15 italic">
              Lumen Felicis
            </span>
          </div>

          {/* Locations */}
          <div className="flex items-center gap-6 text-cream/15 font-[family-name:var(--font-sans)] text-[10px] tracking-[0.2em] uppercase">
            <span>Helsinki</span>
            <span className="w-0.5 h-0.5 rounded-full bg-rose-gold/20" />
            <span>Amsterdam</span>
            <span className="w-0.5 h-0.5 rounded-full bg-rose-gold/20" />
            <span>Kuusamo</span>
          </div>

          {/* Copyright */}
          <span className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.15em] text-cream/15">
            &copy; {new Date().getFullYear()} Rink Group OY. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
