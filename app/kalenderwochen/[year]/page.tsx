import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWTable from "@/components/KWTable";

export const revalidate = 86400; // daily – year data changes rarely

/* ── Static params ────────────────────────────────────────────── */
export async function generateStaticParams() {
  const currentYear = getCurrentKW().year;
  return [
    { year: String(currentYear - 1) },
    { year: String(currentYear) },
    { year: String(currentYear + 1) },
  ];
}

/* ── Helpers ──────────────────────────────────────────────────── */
function parseYear(yearStr: string): number | null {
  const yr = parseInt(yearStr, 10);
  if (isNaN(yr) || yr < 2000 || yr > 2099) return null;
  return yr;
}

/* ── Metadata ─────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year: yearStr } = await params;
  const year = parseYear(yearStr);
  if (!year) return { title: "Jahr nicht gefunden" };

  const weeksInYear = getWeeksInYear(year);
  const title = `Kalenderwochen ${year} – Alle ${weeksInYear} KW im Überblick`;
  const description = `Alle Kalenderwochen ${year} auf einen Blick: KW 1 bis KW ${weeksInYear} mit Start- und Enddatum. Jahreskalender ${year} nach ISO 8601.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://aktuellekw.de/kalenderwochen/${year}`,
    },
    openGraph: {
      title,
      description,
      url: `https://aktuellekw.de/kalenderwochen/${year}`,
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ── Page ─────────────────────────────────────────────────────── */
export default async function KalenderwochenYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearStr } = await params;
  const year = parseYear(yearStr);
  if (!year) notFound();

  const allWeeks = getAllKWsForYear(year);
  const weeksInYear = getWeeksInYear(year);
  const currentKW = getCurrentKW();
  const isCurrentYear = year === currentKW.year;

  const prevYear = year - 1;
  const nextYear = year + 1;
  const prevWeeksInYear = getWeeksInYear(prevYear);
  const nextWeeksInYear = getWeeksInYear(nextYear);

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
          item: `https://aktuellekw.de/kalenderwochen/${year}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Kalenderwochen ${year}`,
      description: `Alle ${weeksInYear} Kalenderwochen des Jahres ${year} nach ISO 8601 mit Start- und Enddatum.`,
      url: `https://aktuellekw.de/kalenderwochen/${year}`,
      inLanguage: "de-DE",
      temporalCoverage: String(year),
      creator: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden>›</span>
          <span className="text-text-primary">
            Kalenderwochen {year}
          </span>
        </nav>

        {/* ── Header ──────────────────────────────────────────── */}
        <section className="mb-10 fade-in">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <h1 className="text-3xl md:text-4xl font-bold">
              Kalenderwochen {year}
            </h1>
            {isCurrentYear && (
              <span className="text-xs bg-accent text-white px-3 py-1 rounded-full font-semibold uppercase tracking-wide self-center">
                Aktuelles Jahr
              </span>
            )}
          </div>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl">
            Alle {weeksInYear} Kalenderwochen {year} mit Start- und Enddatum
            (Montag bis Sonntag) nach ISO&nbsp;8601.
            {isCurrentYear &&
              ` Die aktuelle KW ${currentKW.weekNumber} ist hervorgehoben.`}
            {weeksInYear === 53 &&
              ` ${year} ist ein langes Jahr mit 53\u00a0Kalenderwochen.`}
          </p>
        </section>

        {/* ── Year Navigation ──────────────────────────────────── */}
        <nav
          aria-label="Jahresnavigation"
          className="flex items-center gap-2 mb-8 fade-in"
        >
          <a
            href={`/kalenderwochen/${prevYear}`}
            className="flex items-center gap-1.5 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
          >
            <span className="text-text-secondary">←</span>
            <span className="text-text-primary font-medium">{prevYear}</span>
            <span className="text-text-secondary text-xs">
              ({prevWeeksInYear}&nbsp;KW)
            </span>
          </a>

          <span className="flex-1 text-center text-sm font-semibold text-text-primary">
            {year}
          </span>

          <a
            href={`/kalenderwochen/${nextYear}`}
            className="flex items-center gap-1.5 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
          >
            <span className="text-text-secondary text-xs">
              ({nextWeeksInYear}&nbsp;KW)
            </span>
            <span className="text-text-primary font-medium">{nextYear}</span>
            <span className="text-text-secondary">→</span>
          </a>
        </nav>

        {/* ── KW Table ─────────────────────────────────────────── */}
        <section className="mb-10 fade-in-delay">
          {isCurrentYear ? (
            <KWTable
              weeks={allWeeks}
              currentWeek={currentKW.weekNumber}
            />
          ) : (
            <KWTable weeks={allWeeks} currentWeek={-1} />
          )}
        </section>

        {/* ── Stats row ────────────────────────────────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 fade-in-delay">
          <div className="bg-surface-secondary border border-border rounded-2xl p-4">
            <span className="text-text-secondary text-xs uppercase tracking-wider block mb-1">
              Kalenderwochen
            </span>
            <span className="text-2xl font-bold text-text-primary">
              {weeksInYear}
            </span>
          </div>
          <div className="bg-surface-secondary border border-border rounded-2xl p-4">
            <span className="text-text-secondary text-xs uppercase tracking-wider block mb-1">
              Erste KW beginnt
            </span>
            <span className="text-sm font-semibold text-text-primary">
              {formatDateDE(allWeeks[0].startDate)}
            </span>
          </div>
          <div className="bg-surface-secondary border border-border rounded-2xl p-4 col-span-2 sm:col-span-1">
            <span className="text-text-secondary text-xs uppercase tracking-wider block mb-1">
              Letzte KW endet
            </span>
            <span className="text-sm font-semibold text-text-primary">
              {formatDateDE(allWeeks[allWeeks.length - 1].endDate)}
            </span>
          </div>
        </section>

        {/* ── Footer links ─────────────────────────────────────── */}
        <div className="border-t border-border pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm fade-in-delay-2">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Übersicht aktuelles Jahr
          </a>
          <a href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche
          </a>
        </div>
      </div>
    </>
  );
}

/*
 * SEO Audit Checklist – app/kalenderwochen/[year]/page.tsx (Cluster 2)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: dynamischer Title „Kalenderwochen YYYY – Alle X KW im Überblick"
 * [x] Meta Description: dynamisch mit Jahr, Anzahl KW, ISO 8601
 * [x] Canonical URL: https://aktuellekw.de/kalenderwochen/[year]
 * [x] OG-Title + OG-Description + OG-URL: dynamisch
 * [x] H1: „Kalenderwochen YYYY" (Cluster 2 Hauptkeyword)
 * [x] Intro-Text: weeksInYear, ISO 8601, aktuelle KW hervorgehoben
 * [x] Schema.org: BreadcrumbList (2 Ebenen)
 * [x] Schema.org: Dataset (Jahres-Kalenderwochen)
 * [x] KWTable: alle KWs mit aktuellem Jahr hervorgehoben
 * [x] Jahresnavigation: Vorjahr / Folgejahr mit KW-Anzahl
 * [x] Stats-Row: Gesamtwochen, Erste KW-Start, Letzte KW-Ende
 * [x] „Aktuelles Jahr"-Badge wenn isCurrentYear
 * [x] KW-53-Hinweis in Intro-Text wenn weeksInYear === 53
 * [x] generateStaticParams: aktuelles Jahr ± 1
 * [x] notFound() bei ungültigem Jahr
 * [x] revalidate = 86400 (tägliche ISR)
 * [x] fade-in Animationen
 * [x] Interne Links: /, /kalenderwoche, /faq
 * [ ] TODO: Verlinkung KWTable-Zellen auf /kw/[n]-[year]
 * [ ] TODO: Kalender-Download-Link (Cluster 6, geplant)
 * [ ] TODO: hreflang AT/CH wenn mehrsprachig ausgebaut
 */
