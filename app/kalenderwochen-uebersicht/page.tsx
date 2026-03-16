import type { Metadata } from "next";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWTable from "@/components/KWTable";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);
  const ogTitle = `Kalenderwochen ${kw.year} – Alle KW im Überblick`;
  const ogDescription = `Kalender mit Wochenübersicht: Alle ${weeksInYear} Kalenderwochen ${kw.year} im Überblick. KW 1 bis KW ${weeksInYear} mit Start- und Enddatum nach ISO 8601.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: "https://aktuellekw.de/kalenderwochen-uebersicht",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/kalenderwochen-uebersicht",
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export default function KalenderwochenUebersichtPage() {
  const currentKW = getCurrentKW();
  const allWeeks = getAllKWsForYear(currentKW.year);
  const weeksInYear = getWeeksInYear(currentKW.year);
  const prevYear = currentKW.year - 1;
  const nextYear = currentKW.year + 1;

  const pageJsonLd = [
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
          name: `Kalenderwochen-Übersicht ${currentKW.year}`,
          item: "https://aktuellekw.de/kalenderwochen-uebersicht",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Kalenderwochen im Überblick ${currentKW.year}`,
      description: `Überblick aller ${weeksInYear} Kalenderwochen des Jahres ${currentKW.year}. Aktuelle KW: ${currentKW.weekNumber}.`,
      url: "https://aktuellekw.de/kalenderwochen-uebersicht",
      inLanguage: "de-DE",
      temporalCoverage: `${currentKW.year}`,
      creator: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">›</span>
          <span className="text-text-primary">
            Kalenderwochen-Übersicht {currentKW.year}
          </span>
        </nav>

        {/* ── H1 + Intro ── Cluster 3 ─────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Kalender Wochenübersicht {currentKW.year}
        </h1>
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Alle <strong className="text-text-primary">Kalenderwochen im Überblick</strong>:{" "}
            Das Jahr {currentKW.year} hat {weeksInYear}&nbsp;Wochen nach ISO&nbsp;8601.
            Die aktuelle Woche ist die{" "}
            <strong className="text-text-primary">KW&nbsp;{currentKW.weekNumber}</strong>{" "}
            ({formatDateDE(currentKW.startDate)} – {formatDateDE(currentKW.endDate)}).
          </p>
          <p>
            Diese <strong className="text-text-primary">Kalender mit Wochenübersicht</strong>{" "}
            zeigt Dir den kompletten{" "}
            <strong className="text-text-primary">Kalenderwochen Überblick</strong>{" "}
            von KW&nbsp;1 bis KW&nbsp;{weeksInYear} mit Start- und Enddatum.
          </p>
        </div>

        {/* ── H2: Kalenderwochen im Überblick ─────────────────── */}
        <h2 className="text-2xl font-semibold mb-4">
          Kalenderwochen im Überblick – {currentKW.year}
        </h2>
        <p className="text-text-secondary text-sm mb-5 leading-relaxed">
          Der <strong className="text-text-primary">Überblick Kalenderwochen</strong>{" "}
          {currentKW.year} zeigt alle {weeksInYear}&nbsp;KW mit Datum.
          Die aktuelle KW&nbsp;{currentKW.weekNumber} ist blau hervorgehoben.
          Klicke auf eine Woche für Details.
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

        {/* ── KW-Tabelle ──────────────────────────────────────── */}
        <KWTable weeks={allWeeks} currentWeek={currentKW.weekNumber} />

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-text-secondary text-xs uppercase tracking-wider">
              Gesamt
            </span>
            <span className="text-2xl font-bold text-text-primary">
              {weeksInYear} KW
            </span>
            <span className="text-text-secondary text-xs">
              im Jahr {currentKW.year}
            </span>
          </div>
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-text-secondary text-xs uppercase tracking-wider">
              KW 1 beginnt
            </span>
            <span className="text-lg font-bold text-text-primary">
              {formatDateDE(allWeeks[0].startDate)}
            </span>
            <span className="text-text-secondary text-xs">Montag</span>
          </div>
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-text-secondary text-xs uppercase tracking-wider">
              KW {weeksInYear} endet
            </span>
            <span className="text-lg font-bold text-text-primary">
              {formatDateDE(allWeeks[allWeeks.length - 1].endDate)}
            </span>
            <span className="text-text-secondary text-xs">Sonntag</span>
          </div>
        </div>

        {/* ── Erklärung ── Cluster 3 ──────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Alle Kalenderwochen {currentKW.year} im Überblick
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die <strong className="text-text-primary">Kalenderwochen Überblick</strong>-Tabelle
              oben zeigt Dir alle {weeksInYear}&nbsp;Wochen des Jahres {currentKW.year}
              mit ihrem jeweiligen Start- und Enddatum. Die Berechnung folgt dem
              internationalen Standard ISO&nbsp;8601.
            </p>
            <p>
              Die <strong className="text-text-primary">Wochenübersicht</strong> beginnt
              mit KW&nbsp;1 am {formatDateDE(allWeeks[0].startDate)} und endet
              mit KW&nbsp;{weeksInYear} am{" "}
              {formatDateDE(allWeeks[allWeeks.length - 1].endDate)}.
              Jede Woche startet am Montag und endet am Sonntag.
            </p>
          </div>
        </div>

        {/* ── SEO-TEXT – CLUSTER 3 ──────────────────────────────── */}
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">
            Alle Kalenderwochen {currentKW.year} im Überblick
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Diese <strong className="text-text-primary">Kalenderwochen Übersicht</strong>{" "}
              zeigt Dir sämtliche {weeksInYear}&nbsp;KW des Jahres {currentKW.year} auf
              einen Blick. Die <strong className="text-text-primary">Wochenübersicht</strong>{" "}
              enthält das exakte Start- und Enddatum jeder Woche nach ISO&nbsp;8601 –
              ideal zum schnellen Nachschlagen oder als Ergänzung zu Deinem
              Taschenkalender.
            </p>
            <p>
              Der <strong className="text-text-primary">Überblick Kalenderwochen</strong>{" "}
              hilft Dir, auf einen Blick zu erkennen, wann eine bestimmte KW beginnt
              und endet. Das ist besonders nützlich bei der Urlaubsplanung, für
              Quartalsberichte oder die Abstimmung von Lieferterminen. Die aktuelle
              KW&nbsp;{currentKW.weekNumber} ist blau markiert, vergangene Wochen
              sind optisch abgedimmt.
            </p>
            <p>
              Über die Jahresnavigation oben wechselst Du bequem
              zu {currentKW.year - 1} oder {currentKW.year + 1}. Für noch mehr
              Details zu einer einzelnen Woche klicke auf die entsprechende
              KW-Kachel – dort findest Du Wochentage, Feiertage und
              weitere Informationen zur gewählten{" "}
              <strong className="text-text-primary">Kalenderwoche</strong>.
            </p>
          </div>
        </section>

        {/* ── Abschluss-Links ────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href="/kalender-mit-kalenderwochen" className="text-accent hover:underline">
            Kalender mit KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {currentKW.year}
          </a>
          <a href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche →
          </a>
        </div>
      </section>
    </>
  );
}
