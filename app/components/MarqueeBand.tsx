'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface MarqueeBandProps {
  textKey?: 'marquee1' | 'marquee2';
  text?: string;
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export function MarqueeBand({ textKey, text: textProp, reverse = false, className = '' }: MarqueeBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const { t } = useLanguage();

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ['-10%', '10%'] : ['10%', '-10%']
  );

  const displayText = textKey ? t[textKey] : (textProp ?? '');
  const repeated = Array(6).fill(displayText).join(' \u2022 ');

  return (
    <div ref={ref} className={`overflow-hidden py-6 md:py-10 ${className}`}>
      <motion.div style={{ x }} className="whitespace-nowrap">
        <span className="marquee-track inline-block">
          <span className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-[8rem] font-light tracking-tight">
            {repeated}
          </span>
        </span>
      </motion.div>
    </div>
  );
}
