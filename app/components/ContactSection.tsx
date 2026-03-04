'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function ContactSection() {
  return (
    <section id="contact" className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep to-navy-deep" />

      {/* Decorative radial */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse at center bottom, #C5956B, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <span className="font-[family-name:var(--font-sans)] text-[11px] tracking-[0.4em] uppercase text-rose-gold/60 block mb-8">
            Connect
          </span>

          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-cream leading-[1.1] mb-6">
            Begin the
            <span className="text-rose-gradient italic"> conversation</span>
          </h2>

          <p className="font-[family-name:var(--font-serif)] text-lg text-cream/40 max-w-lg mx-auto mb-14">
            For partnership inquiries, investment opportunities, or strategic collaboration.
          </p>

          {/* Contact email */}
          <motion.a
            href="mailto:info@rinkgroup.io"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-4 px-10 py-5 border border-rose-gold/30 hover:border-rose-gold/60 hover:bg-rose-gold/[0.04] rounded-none transition-all duration-500 group"
          >
            <span className="font-[family-name:var(--font-sans)] text-sm tracking-[0.2em] uppercase text-rose-gold-light group-hover:text-rose-gold-pale transition-colors">
              info@rinkgroup.io
            </span>
            <svg
              className="w-4 h-4 text-rose-gold/50 group-hover:text-rose-gold group-hover:translate-x-1 transition-all duration-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
