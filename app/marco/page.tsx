'use client';

import { LanguageProvider } from '../i18n/LanguageContext';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SmoothScroll } from '../components/SmoothScroll';
import { ScrollProgress } from '../components/ScrollProgress';
import { CustomCursor } from '../components/CustomCursor';
import { AetherBot } from '../components/AetherBot';
import { MarcoHero } from '../components/marco/MarcoHero';
import { MarcoTimeline } from '../components/marco/MarcoTimeline';
import { MarcoPhilosophy } from '../components/marco/MarcoPhilosophy';
import { MarcoWilderness } from '../components/marco/MarcoWilderness';

export default function MarcoPage() {
  return (
    <LanguageProvider>
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <Navigation />
      <main>
        <MarcoHero />
        <MarcoTimeline />
        <MarcoPhilosophy />
        <MarcoWilderness />
      </main>
      <Footer />
      <AetherBot />
    </LanguageProvider>
  );
}
