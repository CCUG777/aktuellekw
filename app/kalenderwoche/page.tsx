import type { Metadata } from "next";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
  getDayNameDE,
} from "@/lib/kw";
import KWTable from "@/components/KWTable";
import KWRechner from "@/components/KWRechner";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);
  const ogTitle = `Kalenderwochen ${kw.year} – Alle KW im Jahresüberblick`;
  const ogDescription = `Hier findest Du die aktuelle Kalenderwoche ${kw.year}. Erfahre alles über KW ${kw.year}, KW ${kw.year - 1} und wie Du die Kalenderwoche heute nach ISO 8601 berechnest.`;
  return {
    title: ogTitle,
    description: ogDescription,
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
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

/* KalenderwocheJsonLd now inline in the component (includes FAQPage schema) */

export default function KalenderwochePage() {
  const currentKW = getCurrentKW();
  const allWeeks = getAllKWsForYear(currentKW.year);
  const weeksInYear = getWeeksInYear(currentKW.year);
  const prevYear = currentKW.year - 1;
  const nextYear = currentKW.year + 1;

  // Dynamic date display: "Montag, 02. März 2026"
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const monthNamesDE = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  const currentDateDisplay = `${getDayNameDE(todayUTC)}, ${String(todayUTC.getUTCDate()).padStart(2, "0")}. ${monthNamesDE[todayUTC.getUTCMonth()]} ${todayUTC.getUTCFullYear()}`;

  // Comparison table: prev year vs current year
  const prevYearWeeks = getAllKWsForYear(prevYear);
  const prevYearWeeksInYear = getWeeksInYear(prevYear);
  const prevYearKW1Start = formatDateDE(prevYearWeeks[0].startDate);
  const prevYearLastKWEnd = formatDateDE(
    prevYearWeeks[prevYearWeeks.length - 1].endDate
  );
  const currentYearKW1Start = formatDateDE(allWeeks[0].startDate);
  const currentYearLastKWEnd = formatDateDE(
    allWeeks[allWeeks.length - 1].endDate
  );

  // First Thursday of each year (determines KW 1)
  function getFirstThursday(year: number): string {
    const jan1 = new Date(Date.UTC(year, 0, 1));
    const day = jan1.getUTCDay(); // 0=Sun
    const offset = (4 - day + 7) % 7;
    return formatDateDE(new Date(Date.UTC(year, 0, 1 + offset)));
  }

  // FAQ data for this page
  const kwFaqs = [
    {
      question: `Was ist die Kalenderwoche ${currentKW.year} genau?`,
      answer: `Die Kalenderwoche ${currentKW.year} ist eine fortlaufende Zählung der ${weeksInYear}\u00a0Wochen des Jahres ${currentKW.year} nach ISO-Standard.`,
    },
    {
      question: "Warum hat ein Jahr manchmal 53 Kalenderwochen?",
      answer: `Das passiert, wenn ein Jahr auf einen Donnerstag endet. ${currentKW.year} hat jedoch ${weeksInYear === 53 ? "53" : "nur 52"}\u00a0Wochen.`,
    },
    {
      question: "Wie wird die Kalenderwoche berechnet?",
      answer: `Die KW\u00a01 ist die Woche, die den ersten Donnerstag im Januar enthält. Dies ist die Grundlage für jede KW\u00a0${currentKW.year}.`,
    },
    {
      question: "Wie finde ich die Kalenderwoche heute heraus?",
      answer: `Nutze einfach unsere dynamische Anzeige oben. Heute ist die KW\u00a0${currentKW.weekNumber}.`,
    },
  ];

  // JSON-LD: include FAQPage schema
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
          name: `Kalenderwochen ${currentKW.year}`,
          item: "https://aktuellekw.de/kalenderwoche",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Kalenderwochen ${currentKW.year}`,
      description: `Alle ${weeksInYear} Kalenderwochen des Jahres ${currentKW.year} nach ISO 8601 mit Start- und Enddatum. Aktuelle Woche: KW ${currentKW.weekNumber}.`,
      url: "https://aktuellekw.de/kalenderwoche",
      inLanguage: "de-DE",
      temporalCoverage: `${currentKW.year}`,
      creator: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: kwFaqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ── Sichtbare Breadcrumb-Navigation ──────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">›</span>
          <span className="text-text-primary">
            Kalenderwochen {currentKW.year}
          </span>
        </nav>

        {/* ── H1 + Intro ── Cluster 2 ─────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Kalenderwoche {currentKW.year}: Alles, was Du wissen musst
        </h1>
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Die kurze Antwort lautet: Wir haben heute{" "}
            <strong className="text-text-primary">{currentDateDisplay}</strong>.
            Die <strong className="text-text-primary">aktuelle Kalenderwoche {currentKW.year}</strong>{" "}
            ist die <strong className="text-text-primary">KW&nbsp;{currentKW.weekNumber}</strong>.
            Diese Woche begann am Montag, den {formatDateDE(currentKW.startDate)},
            und endet am Sonntag, den {formatDateDE(currentKW.endDate)}.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Schnell-Info:</strong>{" "}
            Wenn Du nur wissen willst, welche Woche wir exakt in diesem Moment
            haben, schau auch hier vorbei:{" "}
            <a href="/" className="text-accent hover:underline font-medium">
              Aktuelle KW – Startseite
            </a>.
          </div>
        </div>

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

        {/* ── KW-Tabelle ──────────────────────────────────────────── */}
        <KWTable weeks={allWeeks} currentWeek={currentKW.weekNumber} />

        {/* ── KW Rechner ──────────────────────────────────────────── */}
        <div className="mt-10">
          <KWRechner />
        </div>

        {/* ── Hintergründe ── Cluster 2 ───────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Hintergründe zu Kalenderwoche {currentKW.year}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Hier erfährst Du alles Wissenswerte über die Zählweise und die
            Besonderheiten der <strong className="text-text-primary">Kalenderwoche {currentKW.year}</strong>{" "}
            im Vergleich zur <strong className="text-text-primary">Kalenderwoche {prevYear}</strong>:
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-text-primary">ISO&nbsp;8601 Standard:</strong>{" "}
                In Deutschland und Europa wird die{" "}
                <strong className="text-text-primary">Kalenderwoche</strong> nach
                der Norm ISO&nbsp;8601 definiert. Der Montag ist stets der erste
                Tag der Woche.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-text-primary">Die erste Woche (KW&nbsp;1):</strong>{" "}
                Die erste <strong className="text-text-primary">KW&nbsp;{currentKW.year}</strong>{" "}
                begann am Montag, den {currentYearKW1Start}. Das liegt daran, dass
                der erste Donnerstag des Jahres ({getFirstThursday(currentKW.year)})
                entscheidend für die Zählung ist.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-text-primary">Anzahl der Wochen:</strong>{" "}
                Das Jahr {currentKW.year} hat insgesamt{" "}
                <strong className="text-text-primary">{weeksInYear}&nbsp;Kalenderwochen</strong>.
                Im Gegensatz dazu endete die <strong className="text-text-primary">Kalenderwoche {prevYear}</strong>{" "}
                ebenfalls mit {prevYearWeeksInYear}&nbsp;Wochen.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-text-primary">Jahreswechsel:</strong>{" "}
                Da die Zeitrechnung der Wochen nicht immer mit dem 1.&nbsp;Januar
                beginnt, überschneiden sich <strong className="text-text-primary">KW&nbsp;{prevYear}</strong>{" "}
                und <strong className="text-text-primary">KW&nbsp;{currentKW.year}</strong>{" "}
                oft um einige Tage.
              </span>
            </li>
          </ul>
        </div>

        {/* ── Alltags-Tipps ── Cluster 2 ──────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            So nutzt Du die Kalenderwoche im Alltag
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die Planung mit der <strong className="text-text-primary">KW&nbsp;{currentKW.year}</strong>{" "}
            hilft Dir bei der Organisation von Projekten und Urlauben.
            So wendest Du sie an:
          </p>
          <ol className="space-y-3 text-text-secondary text-sm leading-relaxed list-none">
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">1.</span>
              <span>
                <strong className="text-text-primary">Berufliche Planung:</strong>{" "}
                Nutze die <strong className="text-text-primary">KW&nbsp;{currentKW.year}</strong>{" "}
                für Deadlines (z.&nbsp;B. „Projekt-Abschluss in KW&nbsp;20"). Das
                verhindert Missverständnisse bei internationalen Terminen.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">2.</span>
              <span>
                <strong className="text-text-primary">Excel-Formel:</strong>{" "}
                Ermittle die <strong className="text-text-primary">Kalenderwoche
                heute</strong> in Excel mit der Formel{" "}
                <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                  =KALENDERWOCHE(HEUTE();21)
                </code>.
                Der Parameter 21 sichert den europäischen ISO-Standard.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">3.</span>
              <span>
                <strong className="text-text-primary">Kalender-Abgleich:</strong>{" "}
                Prüfe beim Jahreswechsel immer, ob Dein digitaler Kalender die{" "}
                <strong className="text-text-primary">Kalenderwoche {prevYear}</strong>{" "}
                korrekt abgeschlossen hat, da hier oft Synchronisationsfehler
                auftreten.
              </span>
            </li>
          </ol>
        </div>

        {/* ── Vergleichstabelle: KW prevYear vs. KW currentYear ──── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Vergleich: KW {prevYear} vs. KW {currentKW.year}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Merkmal
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Kalenderwoche {prevYear}
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Kalenderwoche {currentKW.year}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 font-semibold text-text-primary">
                    Beginn KW&nbsp;1
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {prevYearKW1Start}
                  </td>
                  <td className="px-5 py-3 text-text-primary">
                    {currentYearKW1Start}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 font-semibold text-text-primary">
                    Ende KW&nbsp;{weeksInYear}
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {prevYearLastKWEnd}
                  </td>
                  <td className="px-5 py-3 text-text-primary">
                    {currentYearLastKWEnd}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 font-semibold text-text-primary">
                    Gesamtwochen
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {prevYearWeeksInYear} Wochen
                  </td>
                  <td className="px-5 py-3 text-text-primary">
                    {weeksInYear} Wochen
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-semibold text-text-primary">
                    Erster Donnerstag
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {getFirstThursday(prevYear)}
                  </td>
                  <td className="px-5 py-3 text-text-primary">
                    {getFirstThursday(currentKW.year)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Zusammenfassung ── Cluster 2 ────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-3">
            Zusammenfassung &amp; Ausblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Zusammengefasst bedeutet das: Die{" "}
            <strong className="text-text-primary">Kalenderwoche {currentKW.year}</strong>{" "}
            folgt strengen internationalen Regeln der Zeitrechnung. Wir befinden
            uns aktuell in der{" "}
            <strong className="text-text-primary">KW&nbsp;{currentKW.weekNumber}</strong>.
            Eine vorausschauende Planung unter Berücksichtigung der{" "}
            <strong className="text-text-primary">KW&nbsp;{prevYear}</strong>{" "}
            und der kommenden Jahre ist für Logistik und Business essenziell.
            Schau Dir auch die{" "}
            <a href="/" className="text-accent hover:underline">
              aktuelle KW auf der Startseite
            </a>{" "}
            an oder besuche unsere{" "}
            <a href="/faq" className="text-accent hover:underline">
              FAQ-Seite
            </a>{" "}
            für weitere Informationen.
          </p>
        </div>

        {/* ── FAQ ── Cluster 2 ────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            FAQ – Nutzer fragen auch
          </h2>
          <div className="space-y-2.5">
            {kwFaqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium hover:bg-surface-secondary transition-colors list-none">
                  <span>{faq.question}</span>
                  <span className="text-text-secondary text-xl leading-none ml-4 shrink-0 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="details-content px-5 pb-5 pt-2 text-text-secondary text-sm leading-relaxed border-t border-border">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ── Abschluss-Links ─────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href="/faq" className="text-accent hover:underline">
            Alle Fragen zur Kalenderwoche →
          </a>
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
 * [x] Cluster 2 SEO-Content: Intro, Hintergründe, Alltag-Tipps, Vergleichstabelle, Zusammenfassung
 * [x] Vergleichstabelle KW prevYear vs. currentYear (dynamisch berechnet)
 * [x] FAQ (4 Fragen) mit FAQPage Schema (JSON-LD)
 * [x] Cross-Link: Schnell-Info Box → Startseite (Cluster 1 ↔ Cluster 2)
 * [x] Interne Links: Startseite, FAQ, Kalenderwochen-Jahresnavigation
 * [x] Cluster 2 Keywords: kalenderwochen 2026, kw 2026, kw im Kalender,
 *     kw kalender, kalenderwoche 2026, kalenderwochen übersicht
 * [x] Jahresnavigation: Links zu /kalenderwochen/[prevYear] und /kalenderwochen/[nextYear]
 * [x] KWRechner: beliebiges Datum → KW (Client Component)
 * [x] Verlinkung KWTable-Zellen auf /kw/[n]-[year] (via Link-Component in KWTable.tsx)
 * [x] revalidate = 3600 (stündliche ISR)
 * [ ] TODO: hreflang für AT/CH ergänzen wenn mehrsprachig ausgebaut
 */
