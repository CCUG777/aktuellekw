import type { Metadata } from "next";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWTable from "@/components/KWTable";
import AuthorByline from "@/components/AuthorByline";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);
  const ogTitle = `Kalenderwochen ${kw.year} – Alle KW im Überblick`;
  const ogDescription = `Kalenderwochen ${kw.year}: KW 1 bis KW ${weeksInYear} mit Start- & Enddatum im Überblick. ✓ Alle ${weeksInYear} Wochen nach ISO 8601.`;
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
      "@id": "https://aktuellekw.de/kalenderwochen-uebersicht#breadcrumb",
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
      "@id": "https://aktuellekw.de/kalenderwochen-uebersicht#dataset",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: "2026-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      name: `Kalenderwochen im Überblick ${currentKW.year}`,
      description: `Überblick aller ${weeksInYear} Kalenderwochen des Jahres ${currentKW.year}. Aktuelle KW: ${currentKW.weekNumber}.`,
      url: "https://aktuellekw.de/kalenderwochen-uebersicht",
      inLanguage: "de-DE",
      temporalCoverage: `${currentKW.year}`,
      creator: { "@id": "https://aktuellekw.de/#organization" },
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
        <h2 id="kalenderwochen-im-ueberblick" className="text-2xl font-semibold mb-4">
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

        {/* ── Quartals-Übersicht ── einzigartig für diese Seite ── */}
        <div className="mt-14">
          <h2 id="kalenderwochen-nach-quartal" className="text-2xl font-semibold mb-4">
            Kalenderwochen nach Quartal – {currentKW.year}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            Ein <strong className="text-text-primary">Kalenderwochen Überblick</strong> nach
            Quartalen hilft Dir, Geschäftsjahre, Berichtszeiträume und Projektphasen
            schnell einzuordnen. Hier siehst Du, welche KW zu welchem Quartal gehört:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { q: "Q1", label: "Januar – März", kw: "KW 1 – KW 13" },
              { q: "Q2", label: "April – Juni", kw: "KW 14 – KW 26" },
              { q: "Q3", label: "Juli – September", kw: "KW 27 – KW 39" },
              { q: "Q4", label: "Oktober – Dezember", kw: `KW 40 – KW ${weeksInYear}` },
            ].map(({ q, label, kw }) => (
              <div
                key={q}
                className="bg-surface-secondary border border-border rounded-2xl p-5 flex flex-col gap-1"
              >
                <span className="text-accent text-xs font-semibold uppercase tracking-wider">
                  {q}
                </span>
                <span className="text-text-primary font-bold">{kw}</span>
                <span className="text-text-secondary text-xs">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            Beachte: Die Quartals-Zuordnung ist eine Näherung. Da ISO-Wochen am
            Montag beginnen, kann die erste oder letzte Woche eines Quartals
            Tage aus dem angrenzenden Quartal enthalten.
          </p>
        </div>

        {/* ── Wann ist welche KW wichtig? ─────────────────────── */}
        <section className="mt-12 space-y-4">
          <h2 id="wichtige-kalenderwochen" className="text-2xl font-semibold mb-4">
            Wichtige Kalenderwochen {currentKW.year} im Überblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Nicht jede KW ist gleich relevant. Diese{" "}
            <strong className="text-text-primary">Kalenderwochen Übersicht</strong> zeigt
            Dir die wichtigsten Wochen des Jahres – von Quartalswechseln über Feiertags-Wochen
            bis hin zu typischen Urlaubs- und Planungszeiträumen:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">KW</th>
                  <th className="text-left py-2 pr-4">Zeitraum</th>
                  <th className="text-left py-2">Bedeutung</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">KW 1</td>
                  <td className="py-2.5 pr-4">{formatDateDE(allWeeks[0].startDate)}</td>
                  <td className="py-2.5">Jahresstart, Beginn Q1</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">KW 13</td>
                  <td className="py-2.5 pr-4">{allWeeks[12] ? formatDateDE(allWeeks[12].startDate) : "–"}</td>
                  <td className="py-2.5">Ende Q1, Quartalsberichte fällig</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">KW 26</td>
                  <td className="py-2.5 pr-4">{allWeeks[25] ? formatDateDE(allWeeks[25].startDate) : "–"}</td>
                  <td className="py-2.5">Halbjahreswechsel, Ende Q2</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">KW 29 – 32</td>
                  <td className="py-2.5 pr-4">Juli/August</td>
                  <td className="py-2.5">Hauptferienzeit, typische Sommerpause</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">KW 39</td>
                  <td className="py-2.5 pr-4">{allWeeks[38] ? formatDateDE(allWeeks[38].startDate) : "–"}</td>
                  <td className="py-2.5">Ende Q3, Jahresendplanung beginnt</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-text-primary">KW {weeksInYear}</td>
                  <td className="py-2.5 pr-4">{formatDateDE(allWeeks[allWeeks.length - 1].startDate)}</td>
                  <td className="py-2.5">Letzte KW des Jahres, Jahresabschluss</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── KW-Übersicht für Gehaltsabrechnung & Projekte ──── */}
        <section className="mt-12 space-y-4">
          <h2 id="kalenderwochen-im-beruf" className="text-2xl font-semibold mb-4">
            Kalenderwochen-Übersicht im Berufsalltag
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die <strong className="text-text-primary">Kalenderwochen Übersicht</strong>{" "}
              ist im Berufsalltag unverzichtbar. In vielen Branchen werden Termine,
              Lieferfristen und Projektmeilensteine nicht nach Datum, sondern
              nach Kalenderwoche kommuniziert – etwa „Lieferung in KW&nbsp;15" oder
              „Sprint-Review KW&nbsp;22".
            </p>
            <p>
              <strong className="text-text-primary">Gehaltsabrechnung:</strong>{" "}
              Für die monatliche Lohnabrechnung ist der{" "}
              <strong className="text-text-primary">Überblick der Kalenderwochen</strong>{" "}
              hilfreich, um Überstunden, Schichtpläne und Urlaubstage korrekt
              zuzuordnen. Besonders bei wochenbasierter Zeiterfassung ist die
              KW-Nummer die zentrale Referenz.
            </p>
            <p>
              <strong className="text-text-primary">Projektmanagement:</strong>{" "}
              Gantt-Diagramme, Sprint-Zyklen und Meilensteinpläne nutzen die
              Kalenderwoche als kleinste Zeiteinheit. Mit dieser Übersicht
              kannst Du schnell prüfen, in welche KW ein bestimmtes Datum
              fällt – und umgekehrt.
            </p>
          </div>
        </section>

        {/* ── Author Byline ─────────────────────────── */}
        <AuthorByline date={new Date()} />

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
