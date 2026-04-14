import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Loader } from '@/components/animations/Loader';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/animations/ScrollProgress';
import { PageTransition } from '@/components/animations/PageTransition';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://galfformation.com'),
  title: {
    default: "GALF FORMATION | Excellence Industrielle BTP & Mines",
    template: "%s | GALF FORMATION"
  },
  description: "Leader de la formation professionnelle BTP en Côte d'Ivoire. Certifications engins lourds, levage, mines et sécurité HSE. 80% de pratique terrain.",
  keywords: ["formation BTP", "engins chantier", "permis G", "pelle hydraulique", "grue à tour", "Côte d'Ivoire", "GALF", "formation professionnelle"],
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://galfformation.com",
    siteName: "GALF FORMATION",
    images: [{
      url: "/images/og-main.png",
      width: 1200,
      height: 630,
      alt: "GALF FORMATION - Excellence Industrielle"
    }]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`} style={{ background: 'var(--galf-bg)', color: 'var(--galf-text)' }}>
        <ThemeProvider>
          <ScrollProgress />
          <Loader />
          <Navbar />
          <PageTransition>
            <main className="flex-1 pt-20">
              {children}
            </main>
          </PageTransition>
          <WhatsAppButton />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
