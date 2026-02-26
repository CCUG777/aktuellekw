import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWDisplay from "@/components/KWDisplay";
import WeekdayTable from "@/components/WeekdayTable";

export const revalidate = 3600;

/* ── Slug helpers ─────────────────────────────────────────────── */
function parseSlug(slug: string): { weekNumber: number; year: number } | null {
  // Accept "9-2026" or "9" (defaults to current ISO-week year)
  const parts = slug.split("-");
  if (parts.length === 1) {
    const kw = parseInt(parts[0], 10);
    if (isNaN(kw) || kw < 1 || kw > 53) return null;
    return { weekNumber: kw, year: getCurrentKW().year };
  }
  if (parts.length === 2) {
    const kw = parseInt(parts[0], 10);
    const yr = parseInt(parts[1], 10);
    if (isNaN(kw) || isNaN(yr) || kw < 1 || kw > 53 || yr < 2000 || yr > 2099)
      return null;
    return { weekNumber: kw, year: yr };
  }
  return null;
}

function getKWInfoByNumberAndYear(weekNumber: number, year: number) {
  const weeks = getAllKWsForYear(year);
  return weeks.find((w) => w.weekNumber === weekNumber) ?? null;
}

function getPrevKW(weekNumber: number, year: number) {
  if (weekNumber === 1) {
    const prevYear = year - 1;
    const prevWeeks = getAllKWsForYear(prevYear);
    const lastKW = prevWeeks[prevWeeks.length - 1];
    return { weekNumber: lastKW.weekNumber, year: prevYear };
  }
  return { weekNumber: weekNumber - 1, year };
}

function getNextKW(weekNumber: number, year: number) {
  const total = getWeeksInYear(year);
  if (weekNumber === total) {
    return { weekNumber: 1, year: year + 1 };
  }
  return { weekNumber: weekNumber + 1, year };
}

/* ── Static params ────────────────────────────────────────────── */
export async function generateStaticParams() {
  const currentYear = getCurrentKW().year;
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const params: { slug: string }[] = [];
  for (const year of years) {
    const weeks = getAllKWsForYear(year);
    for (const week of weeks) {
      params.push({ slug: `${week.weekNumber}-${year}` });
    }
  }
  return params;
}

/* ── Metadata ─────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "KW nicht gefunden" };

  const kwInfo = getKWInfoByNumberAndYear(parsed.weekNumber, parsed.year);
  if (!kwInfo) return { title: "KW nicht gefunden" };

  const title = `KW ${kwInfo.weekNumber} ${kwInfo.year} – ${formatDateDE(kwInfo.startDate)} bis ${formatDateDE(kwInfo.endDate)}`;
  const description = `Kalenderwoche ${kwInfo.weekNumber} ${kwInfo.year}: ${formatDateDE(kwInfo.startDate)} (Montag) bis ${formatDateDE(kwInfo.endDate)} (Sonntag). Alle 7 Tage im Überblick, berechnet nach ISO 8601.`;
  // OG-Image: 1200×630 px – Platzhalter, bitte durch echtes Bild mit KW-Nummer ersetzen
  const ogImage = {
    url: "/og/og-kw.png",
    width: 1200,
    height: 630,
    alt: `KW ${kwInfo.weekNumber} ${kwInfo.year} – ${formatDateDE(kwInfo.startDate)} bis ${formatDateDE(kwInfo.endDate)}`,
    type: "image/png" as const,
  };

  return {
    title,
    description,
    alternates: {
      canonical: `https://aktuellekw.de/kw/${kwInfo.weekNumber}-${kwInfo.year}`,
    },
    openGraph: {
      title,
      description,
      url: `https://aktuellekw.de/kw/${kwInfo.weekNumber}-${kwInfo.year}`,
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImage.url, alt: ogImage.alt }],
    },
  };
}

/* ── Page ─────────────────────────────────────────────────────── */
export default async function KWDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const kwInfo = getKWInfoByNumberAndYear(parsed.weekNumber, parsed.year);
  if (!kwInfo) notFound();

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const prev = getPrevKW(kwInfo.weekNumber, kwInfo.year);
  const next = getNextKW(kwInfo.weekNumber, kwInfo.year);
  const weeksInYear = getWeeksInYear(kwInfo.year);
  const currentKW = getCurrentKW();
  const isCurrent =
    kwInfo.weekNumber === currentKW.weekNumber &&
    kwInfo.year === currentKW.year;

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
          name: `Kalenderwochen ${kwInfo.year}`,
          item: `https://aktuellekw.de/kalenderwochen/${kwInfo.year}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `KW ${kwInfo.weekNumber} ${kwInfo.year}`,
          item: `https://aktuellekw.de/kw/${kwInfo.weekNumber}-${kwInfo.year}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `Kalenderwoche ${kwInfo.weekNumber} ${kwInfo.year}`,
      startDate: kwInfo.startDate.toISOString().split("T")[0],
      endDate: kwInfo.endDate.toISOString().split("T")[0],
      description: `KW ${kwInfo.weekNumber} ${kwInfo.year} nach ISO 8601: ${formatDateDE(kwInfo.startDate)} bis ${formatDateDE(kwInfo.endDate)}.`,
      url: `https://aktuellekw.de/kw/${kwInfo.weekNumber}-${kwInfo.year}`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">

        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden>›</span>
          <a
            href={`/kalenderwochen/${kwInfo.year}`}
            className="hover:text-accent transition-colors"
          >
            Kalenderwochen {kwInfo.year}
          </a>
          <span aria-hidden>›</span>
          <span className="text-text-primary">
            KW {kwInfo.weekNumber}
          </span>
        </nav>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center mb-12 fade-in">
          {isCurrent && (
            <span className="text-xs bg-accent text-white px-3 py-1 rounded-full font-semibold uppercase tracking-wide mb-5">
              Aktuelle Woche
            </span>
          )}
          <p className="text-text-secondary text-xs uppercase tracking-[0.22em] mb-6">
            Kalenderwoche {kwInfo.year}
          </p>
          <KWDisplay weekNumber={kwInfo.weekNumber} year={kwInfo.year} />
          <p className="text-text-secondary mt-6 text-base md:text-lg">
            {formatDateDE(kwInfo.startDate)} – {formatDateDE(kwInfo.endDate)}
          </p>
          <p className="text-text-secondary text-sm mt-1.5 tracking-wide">
            Montag bis Sonntag · ISO 8601
          </p>
        </section>

        {/* ── Weekday Table ────────────────────────────────────── */}
        <section className="mb-10 fade-in-delay">
          <h2 className="text-lg font-semibold mb-4">
            Wochentage KW {kwInfo.weekNumber} {kwInfo.year}
          </h2>
          <WeekdayTable startDate={kwInfo.startDate} today={todayUTC} />
        </section>

        {/* ── Info Card ────────────────────────────────────────── */}
        <section className="mb-10 fade-in-delay">
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 md:p-6">
            <h2 className="font-semibold text-base mb-4">
              Details zu KW {kwInfo.weekNumber} {kwInfo.year}
            </h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <dt className="text-text-secondary">Beginn</dt>
              <dd className="text-text-primary font-medium">
                {formatDateDE(kwInfo.startDate)} (Montag)
              </dd>

              <dt className="text-text-secondary">Ende</dt>
              <dd className="text-text-primary font-medium">
                {formatDateDE(kwInfo.endDate)} (Sonntag)
              </dd>

              <dt className="text-text-secondary">KW-Nummer</dt>
              <dd className="text-text-primary font-medium">
                {kwInfo.weekNumber} von {weeksInYear}
              </dd>

              <dt className="text-text-secondary">
                Kalenderwochen {kwInfo.year}
              </dt>
              <dd className="text-text-primary font-medium">
                {weeksInYear} gesamt
              </dd>

              <dt className="text-text-secondary">Standard</dt>
              <dd className="text-text-primary font-medium">ISO 8601</dd>
            </dl>
          </div>
        </section>

        {/* ── Prev / Next Navigation ───────────────────────────── */}
        <nav
          aria-label="Wochennavigation"
          className="flex items-center justify-between gap-3 mb-12 fade-in-delay-2"
        >
          <a
            href={`/kw/${prev.weekNumber}-${prev.year}`}
            className="flex items-center gap-2.5 bg-surface-secondary border border-border rounded-xl px-4 py-3 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all group"
          >
            <span className="text-text-secondary group-hover:text-accent transition-colors">
              ←
            </span>
            <div className="flex flex-col">
              <span className="text-text-secondary text-xs">Vorherige</span>
              <span className="text-text-primary font-medium">
                KW {prev.weekNumber}{" "}
                {prev.year !== kwInfo.year && (
                  <span className="text-text-secondary font-normal">
                    {prev.year}
                  </span>
                )}
              </span>
            </div>
          </a>

          <a
            href="/"
            className="text-xs text-text-secondary hover:text-accent transition-colors text-center px-2"
          >
            Aktuelle KW
          </a>

          <a
            href={`/kw/${next.weekNumber}-${next.year}`}
            className="flex items-center gap-2.5 bg-surface-secondary border border-border rounded-xl px-4 py-3 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all text-right group"
          >
            <div className="flex flex-col">
              <span className="text-text-secondary text-xs">Nächste</span>
              <span className="text-text-primary font-medium">
                KW {next.weekNumber}{" "}
                {next.year !== kwInfo.year && (
                  <span className="text-text-secondary font-normal">
                    {next.year}
                  </span>
                )}
              </span>
            </div>
            <span className="text-text-secondary group-hover:text-accent transition-colors">
              →
            </span>
          </a>
        </nav>

        {/* ── Internal links ───────────────────────────────────── */}
        <div className="border-t border-border pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle Kalenderwoche
          </a>
          <a
            href={`/kalenderwochen/${kwInfo.year}`}
            className="text-accent hover:underline"
          >
            Alle KW {kwInfo.year}
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
 * SEO Audit Checklist – app/kw/[slug]/page.tsx (Cluster 5)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: dynamischer Title „KW X YYYY – DD.MM.YYYY bis DD.MM.YYYY"
 * [x] Meta Description: dynamisch mit KW, Start-/Enddatum, ISO 8601
 * [x] Canonical URL: https://aktuellekw.de/kw/[weekNumber]-[year]
 * [x] OG-Title + OG-Description + OG-URL: dynamisch
 * [x] H1 (via KWDisplay): KW-Nummer (Cluster 5 Keyword)
 * [x] H2 #1: „Wochentage KW X YYYY"
 * [x] H2 #2: „Details zu KW X YYYY"
 * [x] Schema.org: BreadcrumbList (3 Ebenen: Startseite → Kalenderwochen → KW X)
 * [x] Schema.org: Event (Wochenzeitraum mit startDate / endDate)
 * [x] WeekdayTable: alle 7 Tage Mo–So mit Datum + Heute-Highlight
 * [x] Infokarte: Beginn, Ende, KW-Nummer, Gesamtwochen, ISO-Standard
 * [x] Prev/Next Navigation: /kw/[prev]-[year] ↔ /kw/[next]-[year]
 * [x] Jahresgrenze: KW 1 → letzte KW Vorjahr; letzte KW → KW 1 Folgejahr
 * [x] generateStaticParams: aktuelles Jahr ± 1 (alle KWs)
 * [x] notFound() bei ungültigem Slug
 * [x] „Aktuelle Woche" Badge wenn isCurrent
 * [x] fade-in Animationen
 * [x] revalidate = 3600 (stündliche ISR)
 * [x] Interne Links: /, /kalenderwochen/[year], /faq
 * [ ] TODO: OG-Image mit KW-Nummer (1200×630 px)
 * [ ] TODO: Speakable Schema für KI-Sprachsuche
 * [ ] TODO: Verlinkung von KWTable-Zellen auf /kw/[n]-[year]
 */
