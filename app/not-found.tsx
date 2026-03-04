'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-deep px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <span className="font-[family-name:var(--font-display)] text-8xl md:text-9xl text-rose-gold/10">
          404
        </span>
        <p className="font-[family-name:var(--font-serif)] text-xl text-cream/40 mt-4 mb-8">
          This path leads beyond our grounds.
        </p>
        <Link
          href="/"
          className="font-[family-name:var(--font-sans)] text-sm tracking-[0.2em] uppercase text-rose-gold/60 hover:text-rose-gold transition-colors border-b border-rose-gold/30 pb-1"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
