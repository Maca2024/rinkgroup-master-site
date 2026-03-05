'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

// Section IDs that map to # hrefs for IntersectionObserver
const SECTION_IDS = ['vision', 'ventures', 'heritage', 'philanthropy', 'contact'];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { t } = useLanguage();

  const links = [
    { label: t.nav.vision, href: '#vision' },
    { label: t.nav.ventures, href: '#ventures' },
    { label: t.nav.heritage, href: '#heritage' },
    { label: t.nav.philanthropy, href: '#philanthropy' },
    { label: 'The Founder', href: '/marco' },
    { label: t.nav.contact, href: '#contact' },
  ];

  // Scroll depth detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // IntersectionObserver — detect which section is in view
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio that is currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: '-10% 0px -10% 0px' }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Smooth scroll handler for anchor links
  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setMobileOpen(false);
    },
    []
  );

  // Determine if a link is active
  const isActive = (href: string) => {
    if (!href.startsWith('#')) return false;
    return activeSection === href.slice(1);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 2, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'glass-navy py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo — glows when scrolled */}
          <a href="/" className="flex items-center gap-3 group">
            <span
              className="font-[family-name:var(--font-display)] text-xl tracking-[0.2em] text-rose-gold-light group-hover:text-rose-gold-pale transition-all duration-500"
              style={
                scrolled
                  ? {
                      textShadow:
                        '0 0 18px rgba(197,149,107,0.35), 0 0 36px rgba(197,149,107,0.12)',
                    }
                  : undefined
              }
            >
              RINK GROUP
            </span>
          </a>

          {/* Desktop links + language switcher */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, i) => {
              const active = isActive(link.href);
              const hovered = hoveredLink === link.href;

              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + i * 0.1 }}
                  className="font-[family-name:var(--font-sans)] text-sm tracking-[0.15em] uppercase transition-colors duration-500 relative group overflow-hidden"
                  style={{
                    color: active
                      ? 'rgba(197,149,107,0.9)'
                      : hovered
                        ? 'rgba(212,165,116,1)'
                        : 'rgba(245,240,232,0.6)',
                  }}
                >
                  {/* Shimmer sweep on hover */}
                  <AnimatePresence>
                    {hovered && (
                      <motion.span
                        key="shimmer"
                        initial={{ x: '-110%', opacity: 0.6 }}
                        animate={{ x: '110%', opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(110deg, transparent 20%, rgba(197,149,107,0.25) 50%, transparent 80%)',
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {link.label}

                  {/* Golden underline — active state or hover */}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-px origin-left"
                    animate={{
                      scaleX: active ? 1 : hovered ? 1 : 0,
                      opacity: active ? 1 : hovered ? 0.7 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: '100%',
                      background: active
                        ? 'linear-gradient(90deg, #C5956B, #E0B88A, #C5956B)'
                        : 'rgba(197,149,107,0.7)',
                      boxShadow: active ? '0 0 6px rgba(197,149,107,0.4)' : 'none',
                    }}
                  />
                </motion.a>
              );
            })}
            <div className="border-l border-rose-gold/10 pl-4 ml-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
              className="w-6 h-px bg-rose-gold-light block"
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              className="w-6 h-px bg-rose-gold-light block"
            />
            <motion.span
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
              className="w-6 h-px bg-rose-gold-light block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-deep/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {links.map((link, i) => {
              const active = isActive(link.href);
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="font-[family-name:var(--font-display)] text-3xl tracking-[0.15em] transition-colors relative flex items-center gap-3"
                  style={{
                    color: active
                      ? 'rgba(228,185,143,1)'
                      : 'rgba(212,165,116,0.75)',
                    textShadow: active
                      ? '0 0 24px rgba(197,149,107,0.5), 0 0 48px rgba(197,149,107,0.2)'
                      : undefined,
                  }}
                >
                  {/* Active accent bar */}
                  <motion.span
                    className="block w-5 h-px origin-left flex-shrink-0"
                    animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background:
                        'linear-gradient(90deg, #E4B98F, rgba(197,149,107,0.4))',
                      boxShadow: '0 0 6px rgba(197,149,107,0.6)',
                    }}
                  />
                  {link.label}
                </motion.a>
              );
            })}
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
