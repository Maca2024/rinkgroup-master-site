'use client';

import { LanguageProvider } from './i18n/LanguageContext';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { MarqueeBand } from './components/MarqueeBand';
import { VisionSection } from './components/VisionSection';
import { PillarsSection } from './components/PillarsSection';
import { HeritageSection } from './components/HeritageSection';
import { PhilanthropySection } from './components/PhilanthropySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SmoothScroll } from './components/SmoothScroll';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { AetherBot } from './components/AetherBot';
import { LoadingScreen } from './components/LoadingScreen';
import { AmbientOrbs } from './components/AmbientOrbs';
import { SectionDivider } from './components/SectionDivider';

export default function Home() {
  return (
    <LanguageProvider>
      <LoadingScreen />
      <AmbientOrbs />
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <Navigation />
      <main>
        <HeroSection />
        <MarqueeBand
          textKey="marquee1"
          className="text-rose-gold/[0.04] border-y border-rose-gold/[0.04]"
        />
        <VisionSection />
        <SectionDivider variant="diamond" />
        <MarqueeBand
          textKey="marquee2"
          reverse
          className="text-cream/[0.03]"
        />
        <PillarsSection />
        <SectionDivider variant="lines" />
        <HeritageSection />
        <SectionDivider variant="particles" />
        <PhilanthropySection />
        <SectionDivider variant="diamond" />
        <ContactSection />
      </main>
      <Footer />
      <AetherBot />
    </LanguageProvider>
  );
}
