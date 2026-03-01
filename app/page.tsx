import type { Metadata } from "next";
import {
  getCurrentKW,
  formatDateDE,
  getWeeksInYear,
  getAllKWsForYear,
  getDayOfYear,
  isLeapYear,
  getDayNameDE,
} from "@/lib/kw";
import KWDisplay from "@/components/KWDisplay";
import KWTable from "@/components/KWTable";
import LiveDate from "@/components/LiveDate";
import WeekdayTable from "@/components/WeekdayTable";
import KWRechner from "@/components/KWRechner";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const ogTitle = `KW ${kw.weekNumber} ${kw.year} – Aktuelle KW heute`;
  const ogDescription = `Heute ist KW ${kw.weekNumber} ${kw.year} (${formatDateDE(kw.startDate)}–${formatDateDE(kw.endDate)}). Aktuelle KW nach ISO 8601.`;
  return {
    title: ogTitle,
    description: `Heute ist KW ${kw.weekNumber} ${kw.year} (${formatDateDE(kw.startDate)}–${formatDateDE(kw.endDate)}). Aktuelle KW nach ISO 8601. Welche KW haben wir? Schnell & kostenlos.`,
    alternates: { canonical: "https://aktuellekw.de" },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de",
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

export default function Home() {
  const kw = getCurrentKW();
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const weeksInYear = getWeeksInYear(kw.year);
  const dayOfYear = getDayOfYear(today);
  const daysInYear = isLeapYear(kw.year) ? 366 : 365;
  const yearProgressPct = Math.round((dayOfYear / daysInYear) * 1000) / 10;
  const kwBarPct = ((kw.weekNumber - 1) / weeksInYear) * 100;
  const remainingWeeks = weeksInYear - kw.weekNumber;
  const allWeeks = getAllKWsForYear(kw.year);

  // Prev / Next KW for hero navigation
  const prevKW =
    kw.weekNumber === 1
      ? (() => {
          const py = kw.year - 1;
          const pn = getWeeksInYear(py);
          return { weekNumber: pn, year: py };
        })()
      : { weekNumber: kw.weekNumber - 1, year: kw.year };
  const nextKW =
    kw.weekNumber === weeksInYear
      ? { weekNumber: 1, year: kw.year + 1 }
      : { weekNumber: kw.weekNumber + 1, year: kw.year };

  // Next KW dates for comparison table
  const nextKWStart = new Date(kw.startDate);
  nextKWStart.setUTCDate(nextKWStart.getUTCDate() + 7);
  const nextKWEnd = new Date(kw.endDate);
  nextKWEnd.setUTCDate(nextKWEnd.getUTCDate() + 7);

  // Server-side date values passed as fallback to the LiveDate client component
  const serverDayName = getDayNameDE(today);
  const serverFormattedDate = formatDateDE(today);

  const homeFaqs = [
    {
      question: "Welche Kalenderwoche haben wir gerade?",
      answer: `Aktuell ist KW\u00a0${kw.weekNumber}\u00a0${kw.year}. Diese Woche läuft vom ${formatDateDE(kw.startDate)} (Montag) bis ${formatDateDE(kw.endDate)} (Sonntag) nach ISO\u00a08601.`,
    },
    {
      question: "Was ist eine Kalenderwoche?",
      answer:
        "Eine Kalenderwoche (KW) ist ein Zeitraum von sieben Tagen, der nach ISO\u00a08601 am Montag beginnt und am Sonntag endet. In Deutschland, Österreich und der Schweiz ist der ISO-8601-Standard verbindlich.",
    },
    {
      question: "Wann beginnt die Kalenderwoche 1?",
      answer:
        "KW\u00a01 ist die Woche, die den ersten Donnerstag des Jahres enthält. Der 4.\u00a0Januar liegt immer in KW\u00a01. Dadurch kann KW\u00a01 bereits Ende Dezember des Vorjahres beginnen.",
    },
    {
      question: "Wie viele Wochen hat ein Jahr?",
      answer: `Die meisten Jahre haben 52 Kalenderwochen. ${kw.year} hat ${weeksInYear}\u00a0KW. Eine 53.\u00a0KW gibt es, wenn der 1.\u00a0Januar auf einen Donnerstag fällt – oder in Schaltjahren auf einen Mittwoch.`,
    },
    {
      question: "Wie wird die Kalenderwoche berechnet?",
      answer:
        "Die KW wird nach ISO\u00a08601 berechnet: Man bestimmt den nächsten Donnerstag zum aktuellen Datum und zählt, die wievielte Woche des Jahres dieser Donnerstag angehört. Wochen beginnen stets am Montag.",
    },
    {
      question: "Was bedeutet ISO 8601?",
      answer:
        "ISO\u00a08601 ist ein internationaler Standard für Datum und Uhrzeit. Er definiert, dass Wochen am Montag beginnen und KW\u00a01 den ersten Donnerstag des Jahres enthält. Deutschland, Österreich und die Schweiz folgen diesem Standard.",
    },
    {
      question: `Hat ${kw.year} eine KW\u00a053?`,
      answer:
        weeksInYear === 53
          ? `Ja, ${kw.year} hat 53\u00a0Kalenderwochen. Das tritt auf, weil der 1.\u00a0Januar\u00a0${kw.year} auf einen Donnerstag fällt.`
          : `Nein, ${kw.year} hat 52\u00a0Kalenderwochen. Eine KW\u00a053 gibt es, wenn der 1.\u00a0Januar auf einen Donnerstag fällt (oder Mittwoch in Schaltjahren).`,
    },
    {
      question: "Wie unterscheiden sich KW und Wochennummer?",
      answer:
        "Die Begriffe Kalenderwoche (KW) und Wochennummer werden im deutschsprachigen Raum synonym verwendet. Beide beziehen sich auf den ISO-8601-Standard, der die Nummerierung nach dem Donnerstag-Prinzip definiert.",
    },
    {
      question: "Welche KW haben wir am nächsten Montag?",
      answer: `Ab dem nächsten Montag befinden wir uns in der KW\u00a0${nextKW.weekNumber}\u00a0${nextKW.year}.`,
    },
  ];

  const pageJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Aktuelle KW – aktuellekw.de",
      url: "https://aktuellekw.de",
      description: `Die aktuelle KW ist KW ${kw.weekNumber} ${kw.year} (${formatDateDE(kw.startDate)} – ${formatDateDE(kw.endDate)}).`,
      applicationCategory: "UtilityApplication",
      operatingSystem: "All",
      inLanguage: "de-DE",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    },
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
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: homeFaqs.map((f) => ({
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

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center px-4 pt-10 pb-8 md:pt-14 md:pb-12 fade-in">
        <h1 className="text-text-secondary text-xs uppercase tracking-[0.22em] mb-8 font-normal">
          Aktuelle KW
        </h1>
        <KWDisplay weekNumber={kw.weekNumber} year={kw.year} />
        <p className="text-text-secondary mt-7 text-base md:text-lg text-center">
          {formatDateDE(kw.startDate)} – {formatDateDE(kw.endDate)}
        </p>
        <p className="text-text-secondary text-sm mt-1.5 tracking-wide">
          Montag bis Sonntag · ISO 8601
        </p>

        {/* Prev / Next KW navigation */}
        <nav
          aria-label="Wochennavigation"
          className="flex items-center gap-3 mt-8"
        >
          <a
            href={`/kw/${prevKW.weekNumber}-${prevKW.year}`}
            className="flex items-center gap-2 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
          >
            <span className="text-text-secondary">←</span>
            <span className="text-text-primary font-medium">
              KW {prevKW.weekNumber}
              {prevKW.year !== kw.year && (
                <span className="text-text-secondary font-normal ml-1">
                  {prevKW.year}
                </span>
              )}
            </span>
          </a>
          <a
            href={`/kw/${kw.weekNumber}-${kw.year}`}
            className="text-xs text-text-secondary hover:text-accent transition-colors px-2"
          >
            KW {kw.weekNumber} Details →
          </a>
          <a
            href={`/kw/${nextKW.weekNumber}-${nextKW.year}`}
            className="flex items-center gap-2 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
          >
            <span className="text-text-primary font-medium">
              KW {nextKW.weekNumber}
              {nextKW.year !== kw.year && (
                <span className="text-text-secondary font-normal ml-1">
                  {nextKW.year}
                </span>
              )}
            </span>
            <span className="text-text-secondary">→</span>
          </a>
        </nav>
      </section>

      {/* ── 1a. SEO-ERKLÄRTEXT: Aktuelle KW ── Cluster 1 ─────────
       * Keywords: aktuelle KW, aktuelle Kalenderwoche, heutige KW,
       *   welche KW haben wir, Kalenderwoche heute, KW aktuell
       * ──────────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-10 text-center fade-in">
        <h2 className="text-xl font-semibold mb-3">
          Aktuelle KW: Alles, was Du wissen musst
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Die kurze Antwort lautet: Wir haben heute den{" "}
          <strong className="text-text-primary">{formatDateDE(todayUTC)}</strong>.
          Die <strong className="text-text-primary">aktuelle KW</strong> ist die{" "}
          <strong className="text-text-primary">Kalenderwoche&nbsp;{kw.weekNumber}</strong>.
          Diese Woche begann am Montag, den {formatDateDE(kw.startDate)}, und
          endet am Sonntag, den {formatDateDE(kw.endDate)}.
        </p>
      </section>

      {/* ── 1b. WEEKDAY TABLE ───────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-10 fade-in">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          KW {kw.weekNumber} · Alle 7 Tage
        </h2>
        <WeekdayTable startDate={kw.startDate} today={todayUTC} />
      </section>

      {/* ── 2. STATS GRID ───────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-10 fade-in-delay">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Card: Aktuelles Datum */}
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 flex flex-col gap-0.5">
            <span className="text-text-secondary text-xs uppercase tracking-wider mb-1">
              Heute
            </span>
            <LiveDate
              fallbackDay={serverDayName}
              fallbackDate={serverFormattedDate}
            />
          </div>

          {/* Card: Jahresfortschritt */}
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 flex flex-col gap-2.5">
            <span className="text-text-secondary text-xs uppercase tracking-wider">
              Jahresfortschritt
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-text-primary">
                {yearProgressPct.toFixed(1)}
              </span>
              <span className="text-text-secondary text-sm">% von {kw.year}</span>
            </div>
            {/* Mini progress bar */}
            <div className="relative h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-blue-300 progress-fill-anim"
                style={{ width: `${yearProgressPct}%` }}
              />
            </div>
            <span className="text-text-secondary text-xs">
              Tag {dayOfYear} von {daysInYear}
            </span>
          </div>

          {/* Card: Verbleibende KWs */}
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-text-secondary text-xs uppercase tracking-wider mb-1">
              Verbleibend
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-text-primary">
                {remainingWeeks}
              </span>
              <span className="text-text-secondary text-sm">KW</span>
            </div>
            <span className="text-text-secondary text-sm">
              noch in {kw.year}
            </span>
            <span className="text-text-secondary text-xs mt-auto pt-3">
              von {weeksInYear} KW gesamt
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. JAHRESFORTSCHRITTS-BALKEN ────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-14 fade-in-delay-2">
        <div className="flex justify-between text-xs text-text-secondary mb-2 px-0.5">
          <span>KW 1</span>
          <span className="text-accent font-medium">
            KW {kw.weekNumber} – jetzt
          </span>
          <span>KW {weeksInYear}</span>
        </div>
        {/* Track */}
        <div className="relative h-2 rounded-full bg-surface-secondary border border-border">
          {/* Filled portion */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent via-blue-400 to-blue-300 progress-fill-anim"
            style={{ width: `${kwBarPct}%` }}
          />
          {/* Glowing position dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-accent rounded-full ring-2 ring-surface shadow-[0_0_14px_rgba(10,132,255,0.85)]"
            style={{ left: `calc(${kwBarPct}% - 7px)` }}
          />
        </div>
        <p className="text-center text-xs text-text-secondary mt-3">
          {remainingWeeks} von {weeksInYear} Kalenderwochen verbleiben in{" "}
          {kw.year}
        </p>
      </section>

      {/* ── 3b. KW RECHNER ──────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-14 fade-in-delay-2">
        <KWRechner />
      </section>

      {/* ── 3c. HINTERGRÜNDE: Aktuelle KW ── Cluster 1 ─────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-semibold mb-4">
          Hintergründe zu Aktuelle KW
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Hier erfährst Du alles Wissenswerte über die Zählweise und Definition
          der Wochen in Deutschland und Europa:
        </p>
        <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <li className="flex gap-2.5">
            <span className="text-accent mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text-primary">ISO&nbsp;8601 Standard:</strong>{" "}
              In Deutschland und den meisten europäischen Ländern wird die{" "}
              <strong className="text-text-primary">aktuelle Kalenderwoche</strong>{" "}
              nach der Norm ISO&nbsp;8601 bestimmt.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text-primary">Der erste Donnerstag:</strong>{" "}
              Die KW&nbsp;1 eines Jahres ist immer die Woche, die den{" "}
              <strong className="text-text-primary">ersten Donnerstag</strong> des
              Jahres enthält. Das bedeutet auch, dass sie immer den 4.&nbsp;Januar
              einschließt.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text-primary">Wochenstart:</strong>{" "}
              Eine Kalenderwoche beginnt gemäß DIN&nbsp;1355 immer am{" "}
              <strong className="text-text-primary">Montag</strong> und endet am
              Sonntag.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text-primary">Anzahl der Wochen:</strong>{" "}
              Ein Kalenderjahr hat in der Regel 52&nbsp;Wochen. In sogenannten
              Gemeinjahren mit 53&nbsp;Wochen spricht man von einem
              „Saturationsjahr".
            </span>
          </li>
        </ul>
      </section>

      {/* ── 3d. ALLTAGS-TIPPS: Aktuelle KW ── Cluster 1 ──────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-semibold mb-4">
          So nutzt Du die aktuelle KW im Alltag
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Die Planung nach Kalenderwochen ist besonders im Business-Kontext
          essenziell:
        </p>
        <ol className="space-y-3 text-text-secondary text-sm leading-relaxed list-none">
          <li className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">1.</span>
            <span>
              <strong className="text-text-primary">Terminplanung:</strong>{" "}
              Nutze die KW-Angabe in Outlook oder Google Kalender, um Deadlines
              präzise zu kommunizieren.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">2.</span>
            <span>
              <strong className="text-text-primary">Excel-Berechnung:</strong>{" "}
              Berechne die <strong className="text-text-primary">aktuelle
              Kalenderwoche heute</strong> in Excel mit der Formel{" "}
              <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                =KALENDERWOCHE(HEUTE();21)
              </code>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">3.</span>
            <span>
              <strong className="text-text-primary">Papierkalender:</strong>{" "}
              Achte beim Kauf darauf, dass die Wochennummern am Rand vermerkt
              sind, um schnell zu sehen,{" "}
              <strong className="text-text-primary">welche KW wir haben</strong>.
            </span>
          </li>
        </ol>
      </section>

      {/* ── 3e. VERGLEICHSTABELLE: Aktuelle + Nächste KW ─────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-semibold mb-4">
          Übersicht: Der aktuelle Zeitraum {kw.year}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-5 py-3 font-medium text-text-secondary">
                  Zeitraum
                </th>
                <th className="text-left px-5 py-3 font-medium text-text-secondary">
                  Kalenderwoche
                </th>
                <th className="text-left px-5 py-3 font-medium text-text-secondary">
                  Datum (Mo–So)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-accent/5">
                <td className="px-5 py-3 font-semibold text-accent">
                  Aktuell
                </td>
                <td className="px-5 py-3 font-semibold text-text-primary">
                  KW&nbsp;{kw.weekNumber}
                </td>
                <td className="px-5 py-3 text-text-primary">
                  {formatDateDE(kw.startDate)} – {formatDateDE(kw.endDate)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-text-secondary">
                  Nächste Woche
                </td>
                <td className="px-5 py-3 text-text-secondary">
                  KW&nbsp;{nextKW.weekNumber}
                </td>
                <td className="px-5 py-3 text-text-secondary">
                  {formatDateDE(nextKWStart)} – {formatDateDE(nextKWEnd)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 3f. ZUSAMMENFASSUNG ── Cluster 1 ─────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold mb-3">
          Zusammenfassung &amp; Ausblick
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Zusammengefasst bedeutet das: Wir befinden uns in der{" "}
          <strong className="text-text-primary">KW&nbsp;{kw.weekNumber}</strong>{" "}
          des Jahres {kw.year}. Die Planung nach Wochennummern hilft Dir dabei,
          Projekte effizienter zu strukturieren. Nutze unseren{" "}
          <a href="#kw-rechner-input" className="text-accent hover:underline">
            KW-Rechner
          </a>{" "}
          oben, um jedes beliebige Datum in eine Kalenderwoche umzurechnen, oder
          schau Dir die vollständige{" "}
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen-Übersicht {kw.year}
          </a>{" "}
          an.
        </p>
      </section>

      {/* ── 4. FAQ ──────────────────────────────────────────────
       * PLACEHOLDER – Cluster 3: welche KW haben wir
       * Zielkeywords: welche Kalenderwoche haben wir, welche KW ist heute,
       *   Kalenderwoche heute, heutige Kalenderwoche, KW berechnen
       * Ziel: 60–80 Wörter
       * Hinweis: Dieser Text wird durch redaktionellen SEO-Content ersetzt.
       * ──────────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold mb-2">
          Häufige Fragen zur Kalenderwoche
        </h2>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          Welche Kalenderwoche haben wir gerade? Wie wird die aktuelle KW
          berechnet und wann beginnt KW&nbsp;1? Hier beantworten wir die
          häufigsten Fragen rund um die Kalenderwoche nach ISO&nbsp;8601.
          Erfahren Sie, warum manche Jahre 53&nbsp;KW haben, wie Sie die
          heutige Kalenderwoche schnell bestimmen und was der Unterschied
          zwischen deutschem und amerikanischem Wochensystem ist. Weitere
          Antworten finden Sie auf unserer{" "}
          <a href="/faq" className="text-accent hover:underline">
            ausführlichen FAQ-Seite
          </a>.
        </p>
        <div className="space-y-2.5">
          {homeFaqs.map((faq, i) => (
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
        <a
          href="/faq"
          className="inline-block mt-6 text-sm text-accent hover:underline"
        >
          Alle Fragen zur Kalenderwoche →
        </a>
      </section>

      {/* ── 5. KW JAHRESÜBERSICHT ──────────────────────────────────
       * PLACEHOLDER – Cluster 2: Kalenderwochen Jahresübersicht
       * Zielkeywords: Kalenderwochen 2026, alle KW, KW Übersicht,
       *   KW Jahresüberblick, Wochenkalender, Kalenderwochen Tabelle
       * Ziel: 50–70 Wörter
       * Hinweis: Dieser Text wird durch redaktionellen SEO-Content ersetzt.
       * ──────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-2xl font-semibold">
            Alle Kalenderwochen {kw.year}
          </h2>
          <a
            href="/kalenderwoche"
            className="text-sm text-accent hover:underline hidden sm:inline"
          >
            Vollansicht →
          </a>
        </div>
        <p className="text-text-secondary text-sm mb-5 leading-relaxed">
          Alle {weeksInYear} Kalenderwochen {kw.year} auf einen Blick – von
          KW&nbsp;1 bis KW&nbsp;{weeksInYear}. Die aktuelle KW
          (KW&nbsp;{kw.weekNumber}) ist blau hervorgehoben. Klicken Sie auf
          eine beliebige Woche, um Start- und Enddatum, Feiertage und
          Details nach ISO&nbsp;8601 zu sehen. Die vollständige{" "}
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen-Übersicht mit Jahresnavigation
          </a>{" "}
          finden Sie auf der Unterseite.
        </p>
        <KWTable weeks={allWeeks} currentWeek={kw.weekNumber} />
        <a
          href="/kalenderwoche"
          className="inline-block mt-5 text-sm text-accent hover:underline sm:hidden"
        >
          Vollständige Übersicht →
        </a>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/page.tsx (Startseite / Cluster 1 + 3 + 4)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: dynamischer Title mit KW-Nummer (Cluster 1)
 * [x] Meta Description: dynamisch mit KW, Datum, Keywords
 * [x] Canonical URL: https://aktuellekw.de
 * [x] OG-Title + OG-Description: dynamisch
 * [x] H1 (via KWDisplay): „Aktuelle Kalenderwoche" (Cluster 1)
 * [x] H2 #1: „Häufige Fragen zur Kalenderwoche" (Cluster 3, mit FAQPage Schema)
 * [x] H2 #2: „Alle Kalenderwochen [Jahr]" (Cluster 2)
 * [x] Schema.org: WebApplication, BreadcrumbList, FAQPage (9 Fragen)
 * [x] Stats-Grid: LiveDate (Echtzeit), Jahresfortschritt %, Verbleibende KWs
 * [x] Jahresfortschrittsbalken mit KW-Markierung + Glowing Dot
 * [x] progress-fill-anim (CSS-only, kein JS, animiert beim Laden)
 * [x] fade-in Animationen (3 Stufen: hero, stats, balken)
 * [x] LiveDate Client Component (suppressHydrationWarning)
 * [x] revalidate = 3600 (stündliche ISR)
 * [x] Interne Links: /faq, /kalenderwoche
 * [x] PLACEHOLDER: FAQ Einleitungstext
 * [x] PLACEHOLDER: Kurztext Jahresübersicht
 * [x] WeekdayTable: Alle 7 Tage der aktuellen KW (Mo–So) mit Heute-Highlight
 * [x] KWRechner: Beliebiges Datum → KW-Berechnung (Client Component)
 * [x] Prev/Next KW Navigation im Hero (links zu /kw/[n]-[year])
 * [x] „Details →" Link zu /kw/[kw]-[year] (Cluster 5)
 * [x] Cluster 1 SEO-Content: Intro, Hintergründe, Alltags-Tipps, Tabelle, Zusammenfassung
 * [x] Vergleichstabelle aktuelle KW + nächste KW (dynamisch)
 * [x] OG-Image: dynamisch via opengraph-image.tsx (1200×630px)
 * [ ] TODO: Speakable Schema für KI-Sprachsuche
 */
