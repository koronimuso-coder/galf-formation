import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Loader } from '@/components/animations/Loader';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/animations/ScrollProgress';
import { PageTransition } from '@/components/animations/PageTransition';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { GlobalReferralTracker } from '@/components/layout/GlobalReferralTracker';
import { GoogleAdSense } from '@/components/layout/GoogleAdSense';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#090B10' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://galfformation.com'),
  title: {
    default: "GALF FORMATION | Excellence Industrielle BTP & Mines",
    template: "%s | GALF FORMATION"
  },
  description: "Leader de la formation professionnelle BTP en Côte d'Ivoire. Certifications engins lourds, levage, mines et sécurité HSE. 80% de pratique terrain.",
  keywords: ["formation BTP", "engins chantier", "permis G", "pelle hydraulique", "grue à tour", "Côte d'Ivoire", "GALF", "formation professionnelle"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GALF FORMATION",
  },
  icons: {
    icon: "/images/pwa-icon-192.png",
    apple: "/images/pwa-icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://galfformation.com",
    siteName: "GALF FORMATION",
    title: "GALF FORMATION | Excellence Industrielle BTP & Mines",
    description: "Leader de la formation professionnelle BTP en Côte d'Ivoire. Certifications engins lourds, levage, mines et sécurité HSE.",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth overflow-x-hidden" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased overflow-x-hidden`}>
        <ThemeProvider>
          <GoogleAdSense />
          <GlobalReferralTracker />
          <ScrollProgress />
          <Loader />
          <Navbar />
          <PageTransition>
            <main className="flex-1 pt-20 overflow-x-hidden">
              {children}
            </main>
          </PageTransition>
          <WhatsAppButton />
          <CookieBanner />
          <PWAInstallPrompt />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
