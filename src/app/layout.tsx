import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: {
    default: 'Vistera – VR-Immobilienplattform für den DACH-Raum',
    template: '%s | Vistera',
  },
  description: 'Besichtigen Sie Immobilien in Österreich, Deutschland und der Schweiz virtuell mit 360°-VR-Touren. Für Käufer, Verkäufer, Mieter und Makler.',
  keywords: ['VR Immobilien', 'virtuelle Besichtigung', '360 Tour', 'DACH Immobilien', 'Austria real estate', 'VR property tour'],
  authors: [{ name: 'Vistera GmbH' }],
  creator: 'Vistera GmbH',
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    alternateLocale: 'en_GB',
    title: 'Vistera – VR-Immobilienplattform',
    description: 'Immobilien im DACH-Raum virtuell erleben',
    siteName: 'Vistera',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vistera – VR-Immobilienplattform',
    description: 'Immobilien im DACH-Raum virtuell erleben',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
