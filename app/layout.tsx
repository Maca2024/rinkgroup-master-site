import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rink Group | Lumen Felicis',
  description: 'Strategic holding company bridging Nordic innovation with global ambition. Technology, consulting, and sustainable ventures across Finland, Netherlands, and beyond.',
  openGraph: {
    title: 'Rink Group | Lumen Felicis',
    description: 'Strategic holding company bridging Nordic innovation with global ambition.',
    images: ['/logo-rinkgroup.png'],
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#142242',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${outfit.variable}`}>
      <body className="bg-navy-deep text-cream antialiased noise-overlay">
        {children}
      </body>
    </html>
  );
}
