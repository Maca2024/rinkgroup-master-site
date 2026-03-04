import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { VisionSection } from './components/VisionSection';
import { VenturesSection } from './components/VenturesSection';
import { HeritageSection } from './components/HeritageSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SmoothScroll } from './components/SmoothScroll';
import { ScrollProgress } from './components/ScrollProgress';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Navigation />
      <main>
        <HeroSection />
        <VisionSection />
        <VenturesSection />
        <HeritageSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
