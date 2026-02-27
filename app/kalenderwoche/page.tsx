import type { Metadata } from "next";
import { getAllKWsForYear, getCurrentKW, getWeeksInYear } from "@/lib/kw";
import KWTable from "@/components/KWTable";
import KWRechner from "@/components/KWRechner";

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);
  const ogTitle = `Kalenderwochen ${kw.year} – Alle ${weeksInYear} KW im Jahresüberblick`;
  const ogDescription = `KW 1 bis KW ${weeksInYear} mit genauen Datumsangaben. Aktuelle KW ${kw.weekNumber} auf einen Blick.`;
  // OG-Image: 1200×630 px – Platzhalter, bitte durch echtes Bild ersetzen
  const ogImage = {
    url: "/og/og-kalenderwoche.png",
    width: 1200,
    height: 630,
    alt: `Kalenderwochen ${kw.year} – alle ${weeksInYear} KW im Überblick`,
    type: "image/png" as const,
  };
  return {
    title: ogTitle,
    description: `Alle Kalenderwochen ${kw.year} auf einen Blick: KW 1 bis KW ${weeksInYear} mit Start- und Enddatum nach ISO 8601. Aktuelle KW ${kw.weekNumber} ist hervorgehoben.`,
    alternates: {
      canonical: "https://aktuellekw.de/kalenderwoche",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/kalenderwoche",
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [{ url: ogImage.url, alt: ogImage.alt }],
    },
  };
}

function KalenderwocheJsonLd({
  year,
  weeksInYear,
  currentWeek,
}: {
  year: number;
  weeksInYear: number;
  currentWeek: number;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Startseite",
          item: "https://aktuellekw.de",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `Kalenderwochen ${year}`,
          item: "https://aktuellekw.de/kalenderwoche",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Kalenderwochen ${year}`,
      description: `Alle ${weeksInYear} Kalenderwochen des Jahres ${year} nach ISO 8601 mit Start- und Enddatum. Aktuelle Woche: KW ${currentWeek}.`,
      url: "https://aktuellekw.de/kalenderwoche",
      inLanguage: "de-DE",
      temporalCoverage: `${year}`,
      creator: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function KalenderwochePage() {
  const currentKW = getCurrentKW();
  const allWeeks = getAllKWsForYear(currentKW.year);
  const weeksInYear = getWeeksInYear(currentKW.year);
  const prevYear = currentKW.year - 1;
  const nextYear = currentKW.year + 1;

  return (
    <>
      <KalenderwocheJsonLd
        year={currentKW.year}
        weeksInYear={weeksInYear}
        currentWeek={currentKW.weekNumber}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Kalenderwochen {currentKW.year}
        </h1>
        <p className="text-text-secondary mb-4">
          Alle {allWeeks.length} Kalenderwochen im Überblick (ISO 8601)
        </p>

        {/* Year navigation */}
        <nav
          aria-label="Jahresnavigation"
          className="flex items-center gap-2 mb-8"
        >
          <a
            href={`/kalenderwochen/${prevYear}`}
            className="flex items-center gap-1.5 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
          >
            <span className="text-text-secondary">←</span>
            <span className="text-text-primary font-medium">{prevYear}</span>
            <span className="text-text-secondary text-xs">
              ({getWeeksInYear(prevYear)}&nbsp;KW)
            </span>
          </a>
          <span className="flex-1 text-center text-sm font-semibold text-accent">
            {currentKW.year}
          </span>
          <a
            href={`/kalenderwochen/${nextYear}`}
            className="flex items-center gap-1.5 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
          >
            <span className="text-text-secondary text-xs">
              ({getWeeksInYear(nextYear)}&nbsp;KW)
            </span>
            <span className="text-text-primary font-medium">{nextYear}</span>
            <span className="text-text-secondary">→</span>
          </a>
        </nav>

        <div className="text-text-secondary mb-8 leading-relaxed space-y-3">
          <p>
            Diese Übersicht zeigt alle Kalenderwochen {currentKW.year} im
            Detail – von KW&nbsp;1 bis KW&nbsp;{weeksInYear}. Jede
            Kalenderwoche ist mit dem exakten Start- (Montag) und Enddatum
            (Sonntag) nach ISO&nbsp;8601 angegeben. Die aktuelle
            Woche (KW&nbsp;{currentKW.weekNumber}) ist farblich hervorgehoben,
            damit Sie sie auf einen Blick finden.
          </p>
          <p>
            {weeksInYear === 53
              ? `Das Jahr ${currentKW.year} hat 53 Kalenderwochen – ein sogenanntes langes Jahr. Das tritt auf, weil der 1. Januar ${currentKW.year} auf einen Donnerstag fällt.`
              : `Das Jahr ${currentKW.year} hat ${weeksInYear} Kalenderwochen.`}{" "}
            Klicken Sie auf eine beliebige KW, um alle Details wie
            Wochentage und genaue Datumsangaben zu sehen. Die Übersicht eignet
            sich ideal für Projektplanung, Terminkoordination und die schnelle
            Zuordnung von Kalenderwochen zu konkreten Zeiträumen.
          </p>
        </div>

        <KWTable weeks={allWeeks} currentWeek={currentKW.weekNumber} />

        {/* KW Rechner */}
        <div className="mt-10">
          <KWRechner />
        </div>

        <div className="mt-10 pt-8 border-t border-border space-y-3">
          <p className="text-text-secondary text-sm leading-relaxed">
            Wie viele Kalenderwochen hat ein Jahr? Die meisten Jahre haben
            52&nbsp;KW, doch {currentKW.year} hat{" "}
            {weeksInYear}&nbsp;Kalenderwochen.{" "}
            {weeksInYear === 53
              ? "Eine 53. Woche entsteht, wenn der 1. Januar auf einen Donnerstag fällt – oder in Schaltjahren auf einen Mittwoch. "
              : ""}
            Nutzen Sie diese Übersicht als Wochenkalender {currentKW.year} für
            Ihre Termin- und Projektplanung.{" "}
            <a href="/faq" className="text-accent hover:underline">
              Weitere Fragen zur Kalenderwoche →
            </a>
          </p>
          <p className="text-text-secondary text-sm">
            <a href="/" className="text-accent hover:underline">
              ← Aktuelle Kalenderwoche
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/kalenderwoche/page.tsx (Cluster 2)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: dynamischer Title mit Jahr + Anzahl KW (Cluster 2)
 * [x] Meta Description: dynamisch mit Jahr, KW-Anzahl, aktuelle KW (Cluster 2)
 * [x] Canonical URL: https://aktuellekw.de/kalenderwoche
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: „Kalenderwochen [Jahr]" (Cluster 2 Hauptkeyword)
 * [x] Intro-Text: aktuelle KW hervorgehoben, ISO 8601 erwähnt
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → Kalenderwochen Jahr)
 * [x] Schema.org: Dataset (Jahres-Kalenderwochen-Übersicht)
 * [x] PLACEHOLDER: Einleitungstext (100–150 Wörter) mit Cluster-2-Keywords
 * [x] PLACEHOLDER: Abschlusstext (60–80 Wörter) mit Cluster-4-Keywords
 * [x] Interne Links: Startseite, FAQ (KW 53-Erklärung)
 * [x] Cluster 2 Keywords: kalenderwochen 2026, kw 2026, kw im Kalender,
 *     kw kalender, kalenderwoche 2026, kalenderwochen übersicht
 * [x] Jahresnavigation: Links zu /kalenderwochen/[prevYear] und /kalenderwochen/[nextYear]
 * [x] KWRechner: beliebiges Datum → KW (Client Component)
 * [ ] TODO: Verlinkung KWTable-Zellen auf /kw/[n]-[year]
 * [ ] TODO: hreflang für AT/CH ergänzen wenn mehrsprachig ausgebaut
 * [ ] TODO: Tabelle mit strukturierten Event-Daten (Schema.org Event) ausbauen
 */
