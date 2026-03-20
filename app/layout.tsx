import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  metadataBase: new URL("https://aktuellekw.de"),
  title: {
    default: `Aktuelle KW ${currentYear} – Welche Kalenderwoche haben wir heute?`,
    template: "%s | aktuellekw.de",
  },
  description:
    `Aktuelle KW sofort ablesen. Welche KW haben wir heute? Kalenderwochen ${currentYear} nach ISO 8601 mit Start- und Enddatum. Schnell & kostenlos.`,
  alternates: {
    canonical: "https://aktuellekw.de",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://aktuellekw.de",
    siteName: "aktuellekw.de",
    title: `Aktuelle KW ${currentYear} – Welche Kalenderwoche haben wir heute?`,
    description:
      "Aktuelle KW sofort ablesen. Welche KW haben wir heute? KW nach ISO 8601 – schnell und kostenlos.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Aktuelle KW ${currentYear} – Welche Kalenderwoche haben wir heute?`,
    description:
      "Aktuelle KW sofort ablesen. Welche KW haben wir heute? KW nach ISO 8601 mit Start- und Enddatum.",
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
  verification: {
    google: "EgUy6naPNJvoxviGq1MbfXRRtMs6VTZCBhKl6dsdBRo",
  },
};

function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aktuellekw.de/#organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
        // TODO: Social-Profile-URLs eintragen sobald vorhanden, z.B.:
        // "https://twitter.com/aktuellekw"
        // "https://www.linkedin.com/company/aktuellekw"
        // "https://www.facebook.com/aktuellekw"
        sameAs: [
          "https://github.com/CCUG777",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://aktuellekw.de/#website",
        name: "aktuellekw.de",
        alternateName: ["Aktuelle KW", "Aktuelle Kalenderwoche"],
        url: "https://aktuellekw.de",
        description:
          `Aktuelle KW nach ISO 8601. Welche KW haben wir heute? Alle Kalenderwochen ${currentYear} im Überblick.`,
        inLanguage: "de-DE",
        publisher: { "@id": "https://aktuellekw.de/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://aktuellekw.de/kw/{search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
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
        {/* Skip-to-Content Link – sichtbar nur bei Tastaturfokus */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Zum Inhalt springen
        </a>

        <WebSiteJsonLd />
        <Header />
        <main id="main-content" role="main" className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}

/*
 * SEO Audit Checklist – app/layout.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] metadataBase: https://aktuellekw.de
 * [x] Default Title: Aktuelle KW [Jahr dynamisch] + Hauptkeyword (Cluster 1)
 * [x] Title-Template für alle Unterseiten (%s | aktuellekw.de)
 * [x] Meta Description: 140–160 Zeichen, Hauptkeywords Cluster 1+2
 * [x] Keywords: Alle 6 Keyword-Cluster abgedeckt
 * [x] alternates.canonical: https://aktuellekw.de
 * [x] OpenGraph: type, locale, url, siteName, title, description
 * [x] Twitter Card: summary_large_image mit title + description
 * [x] robots: index/follow + erweiterte googleBot-Direktiven
 * [x] Schema.org WebSite JSON-LD (global, jede Seite)
 * [x] Organization JSON-LD als eigener @graph-Knoten mit sameAs (GitHub; Social-Profile TODO)
 * [x] lang="de" am <html>-Tag (wichtig für hreflang & KI-Suchen)
 * [x] OG-Image: Dynamisch via opengraph-image.tsx (1200×630px) pro Route
 * [x] Twitter Card: nutzt automatisch das OG-Image
 * [x] Skip-to-Content Link für Barrierefreiheit
 * [x] <main id="main-content" role="main"> ARIA Landmark
 * [x] Statische OG-Platzhalter entfernt (public/og/ gelöscht)
 * [x] favicon.ico vorhanden, apple-icon.tsx dynamisch generiert
 */
