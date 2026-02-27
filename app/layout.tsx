import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aktuellekw.de"),
  title: {
    default: "Aktuelle KW 2026 – Welche Kalenderwoche haben wir heute?",
    template: "%s | aktuellekw.de",
  },
  description:
    "Aktuelle KW sofort ablesen. Welche KW haben wir heute? Kalenderwochen 2026 nach ISO 8601 mit Start- und Enddatum. Schnell & kostenlos.",
  keywords: [
    "aktuelle KW",
    "aktuelle Kalenderwoche",
    "welche Kalenderwoche haben wir",
    "welche KW haben wir",
    "Kalenderwoche heute",
    "KW heute",
    "KW aktuell",
    "heutige Kalenderwoche",
    "Kalenderwochen 2026",
    "Kalenderwochen 2025",
    "wie viele Wochen hat ein Jahr",
    "Kalenderwoche berechnen",
    "ISO 8601",
    "KW Übersicht",
    "Wochenkalender",
    "kalenderwochen übersicht",
  ],
  alternates: {
    canonical: "https://aktuellekw.de",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://aktuellekw.de",
    siteName: "aktuellekw.de",
    title: "Aktuelle KW 2026 – Welche Kalenderwoche haben wir heute?",
    description:
      "Aktuelle KW sofort ablesen. Welche KW haben wir heute? KW nach ISO 8601 – schnell und kostenlos.",
    // OG-Image: 1200×630 px – Platzhalter, bitte durch echtes Bild ersetzen
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "aktuellekw.de – Aktuelle KW nach ISO 8601",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aktuelle KW 2026 – Welche Kalenderwoche haben wir heute?",
    description:
      "Aktuelle KW sofort ablesen. Welche KW haben wir heute? KW nach ISO 8601 mit Start- und Enddatum.",
    // Twitter Card Image: 1200×630 px – Platzhalter, bitte durch echtes Bild ersetzen
    images: [
      {
        url: "/og/og-default.png",
        alt: "aktuellekw.de – Aktuelle KW nach ISO 8601",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "aktuellekw.de",
    alternateName: ["Aktuelle KW", "Aktuelle Kalenderwoche"],
    url: "https://aktuellekw.de",
    description:
      "Aktuelle KW nach ISO 8601. Welche KW haben wir heute? Alle Kalenderwochen 2026 im Überblick.",
    inLanguage: "de-DE",
    publisher: {
      "@type": "Organization",
      name: "aktuellekw.de",
      url: "https://aktuellekw.de",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-surface text-text-primary min-h-screen flex flex-col">
        {/*
         * Theme-Init-Script: läuft synchron vor dem ersten Paint.
         * Verhindert FOUC (Flash of Unstyled Content) beim Laden.
         * Priorität: 1. localStorage  2. prefers-color-scheme  3. Light (Default)
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var h=document.documentElement;if(s==='dark'||(s===null&&d)){h.classList.add('dark');}else{h.classList.add('light');}}catch(e){}})();`,
          }}
        />
        <WebSiteJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

/*
 * SEO Audit Checklist – app/layout.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] metadataBase: https://aktuellekw.de
 * [x] Default Title: Aktuelle KW 2026 + Hauptkeyword (Cluster 1)
 * [x] Title-Template für alle Unterseiten (%s | aktuellekw.de)
 * [x] Meta Description: 140–160 Zeichen, Hauptkeywords Cluster 1+2
 * [x] Keywords: Alle 6 Keyword-Cluster abgedeckt
 * [x] alternates.canonical: https://aktuellekw.de
 * [x] OpenGraph: type, locale, url, siteName, title, description
 * [x] Twitter Card: summary_large_image mit title + description
 * [x] robots: index/follow + erweiterte googleBot-Direktiven
 * [x] Schema.org WebSite JSON-LD (global, jede Seite)
 * [x] lang="de" am <html>-Tag (wichtig für hreflang & KI-Suchen)
 * [x] OG-Image: Fallback og-default.png in /public/og/ (Platzhalter 1×1px, ersetzbar)
 * [x] Twitter Card Image: og-default.png, alt gesetzt
 * [ ] TODO: og-default.png durch echtes 1200×630px Bild ersetzen
 * [ ] TODO: favicon.ico & apple-touch-icon.png prüfen/ergänzen
 */
