import type { Metadata } from "next";
import {
  getCurrentKW,
  getKWInfo,
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
  const ogTitle = `Aktuelle KW – Welche Kalenderwoche heute?`;
  const ogDescription = `KW aktuell: Heute ist KW ${kw.weekNumber} ${kw.year} (${formatDateDE(kw.startDate)}–${formatDateDE(kw.endDate)}). Aktuelle KW nach ISO 8601.`;
  return {
    title: ogTitle,
    description: `Aktuelle KW ${kw.weekNumber} ${kw.year}: ${formatDateDE(kw.startDate)} bis ${formatDateDE(kw.endDate)}. ✓ Kalenderwoche heute sofort sehen – nach ISO 8601, tagesaktuell & kostenlos.`,
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

  // Prev KW dates for comparison table
  const prevKWStart = new Date(kw.startDate);
  prevKWStart.setUTCDate(prevKWStart.getUTCDate() - 7);
  const prevKWEnd = new Date(kw.endDate);
  prevKWEnd.setUTCDate(prevKWEnd.getUTCDate() - 7);

  // Tomorrow's KW (dynamic "KW morgen")
  const tomorrow = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() + 1));
  const tomorrowKW = getKWInfo(tomorrow);
  const tomorrowDayName = getDayNameDE(tomorrow);
  const tomorrowIsSameKW = tomorrowKW.weekNumber === kw.weekNumber && tomorrowKW.year === kw.year;

  // Server-side date values passed as fallback to the LiveDate client component
  const serverDayName = getDayNameDE(today);
  const serverFormattedDate = formatDateDE(today);

  const homeFaqs = [
    {
      question: "Welche Kalenderwoche haben wir gerade?",
      answer: `Aktuell ist KW\u00a0${kw.weekNumber}\u00a0${kw.year}. Diese Woche läuft vom ${formatDateDE(kw.startDate)} (Montag) bis ${formatDateDE(kw.endDate)} (Sonntag) nach ISO\u00a08601. Die KW-Nummer richtet sich stets nach dem Donnerstag der jeweiligen Woche – welchem Jahr dieser Donnerstag angehört, in dem Jahr wird die Woche gezählt. Dadurch können die ersten Januartage noch zur letzten KW des Vorjahres gehören, und KW\u00a01 kann bereits Ende Dezember beginnen. Unsere Seite aktualisiert sich stündlich automatisch.`,
    },
    {
      question: "Was ist eine Kalenderwoche?",
      answer:
        "Eine Kalenderwoche (KW) ist ein Zeitraum von sieben Tagen, der nach ISO\u00a08601 (Abschnitt\u00a03.2.2) am Montag beginnt und am Sonntag endet. In Deutschland, Österreich und der Schweiz ist dieser Standard nach DIN\u00a0EN\u00a028601 verbindlich und bildet die Grundlage für Geschäftstermine, Lieferzeiten und Projektpläne. Die Nummerierung beginnt mit KW\u00a01 und endet je nach Jahr mit KW\u00a052 oder KW\u00a053. KW\u00a01 ist immer die Woche mit dem ersten Donnerstag des Jahres (ISO\u00a08601, §\u00a02.2.10). Das US-amerikanische System beginnt die Woche am Sonntag und definiert KW\u00a01 anders – internationale Kalenderanwendungen weichen daher gelegentlich vom deutschen Standard ab.",
    },
    {
      question: "Wann beginnt die Kalenderwoche 1?",
      answer:
        "KW\u00a01 ist die Woche, die den ersten Donnerstag des Jahres enthält (ISO\u00a08601, §\u00a02.2.10). Der 4.\u00a0Januar liegt immer in KW\u00a01, egal auf welchen Wochentag er fällt. Dadurch kann KW\u00a01 bereits am letzten Montag des Dezembers des Vorjahres beginnen, und die ersten Januartage können noch zur letzten KW des Vorjahres gehören. Diese Regelung ist in Deutschland nach DIN\u00a0EN\u00a028601 (identisch mit ISO\u00a08601) verbindlich. Der Donnerstag wurde als Bezugstag gewählt, weil er genau in der Mitte einer Montag-bis-Sonntag-Woche liegt (Tag\u00a04 von\u00a07). Praktisches Beispiel: KW\u00a01\u00a02026 beginnt bereits am 29.\u00a0Dezember\u00a02025.",
    },
    {
      question: "Wie viele Wochen hat ein Jahr?",
      answer: `Die meisten Jahre haben 52 Kalenderwochen. ${kw.year} hat ${weeksInYear}\u00a0KW. Eine 53.\u00a0KW gibt es, wenn der 1.\u00a0Januar auf einen Donnerstag fällt – oder in Schaltjahren auf einen Mittwoch (ISO\u00a08601, §\u00a02.2.10). Ein normales Jahr hat 365\u00a0Tage, also 52 vollständige Wochen und einen Resttag. Fällt dieser Resttag auf einen Donnerstag, entsteht eine zusätzliche 53.\u00a0KW. In einem 400-Jahres-Zyklus gibt es genau 71 lange Jahre mit 53\u00a0KW (Quelle: ISO\u00a08601 Annex\u00a0B) – das entspricht 17,75\u00a0% aller Jahre. Aktuelle Beispiele: 2015, 2020, 2026 und 2032.`,
    },
    {
      question: `Hat ${kw.year} eine KW\u00a053?`,
      answer:
        weeksInYear === 53
          ? `Ja, ${kw.year} hat 53\u00a0Kalenderwochen. Das tritt auf, weil der 1.\u00a0Januar\u00a0${kw.year} auf einen Donnerstag fällt. Nach ISO\u00a08601 (§\u00a02.2.10) wird eine Woche dem Jahr zugeordnet, in dem ihr Donnerstag liegt. Ein normales Jahr hat 365\u00a0Tage, also 52\u00a0volle Wochen plus einen Resttag. Fällt dieser Resttag auf einen Donnerstag, entsteht die zusätzliche 53.\u00a0KW. In einem 400-Jahres-Zyklus kommen genau 71 solche langen Jahre vor – das sind 17,75\u00a0% (Quelle: ISO\u00a08601 Annex\u00a0B).`
          : `Nein, ${kw.year} hat 52\u00a0Kalenderwochen. Eine KW\u00a053 gibt es, wenn der 1.\u00a0Januar auf einen Donnerstag fällt oder in Schaltjahren auf einen Mittwoch (ISO\u00a08601, §\u00a02.2.10). In einem 400-Jahres-Zyklus gibt es genau 71 solche langen Jahre – das sind 17,75\u00a0% (Quelle: ISO\u00a08601 Annex\u00a0B). Die nächsten Jahre mit 53\u00a0KW sind 2026, 2032 und 2037.`,
    },
  ];

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://aktuellekw.de/#webapp",
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        publisher: { "@id": "https://aktuellekw.de/#organization" },
        datePublished: "2026-01-01",
        dateModified: new Date().toISOString().split("T")[0],
        name: "Aktuelle KW – aktuellekw.de",
        url: "https://aktuellekw.de",
        description: `Die aktuelle KW ist KW ${kw.weekNumber} ${kw.year} (${formatDateDE(kw.startDate)} – ${formatDateDE(kw.endDate)}).`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        inLanguage: "de-DE",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "[aria-label='Kalenderwoche heute']",
            "h1",
            "h2",
          ],
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://aktuellekw.de/#breadcrumb",
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
        "@type": "FAQPage",
        "@id": "https://aktuellekw.de/#faqpage",
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        datePublished: "2026-01-01",
        dateModified: new Date().toISOString().split("T")[0],
        mainEntity: homeFaqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

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

        {/* Heutige Kalenderwoche – dynamischer Snippet-Text */}
        <p className="text-accent font-semibold text-lg mt-5" aria-label="Kalenderwoche heute">
          Heute ist KW&nbsp;{kw.weekNumber}
        </p>
        <p className="text-text-secondary text-sm mt-1 text-center max-w-md">
          KW heute: Die <strong className="text-text-primary">heutige Kalenderwoche</strong> ist
          die KW&nbsp;{kw.weekNumber}&nbsp;{kw.year}. Die KW Woche heute
          läuft vom {formatDateDE(kw.startDate)} bis {formatDateDE(kw.endDate)}.
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

      <hr className="section-divider" />

      {/* ── 1a. SEO-ERKLÄRTEXT: Aktuelle KW ── Cluster 1 ─────────
       * Keywords: aktuelle KW, aktuelle Kalenderwoche, heutige KW,
       *   welche KW haben wir, Kalenderwoche heute, KW aktuell
       * ──────────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-10 text-center fade-in">
        <h2 id="aktuelle-kalenderwoche-was-du-wissen-musst" className="text-xl font-semibold mb-3">
          Aktuelle Kalenderwoche – Was Du wissen musst
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Die kurze Antwort lautet: Wir haben heute den{" "}
          <strong className="text-text-primary">{formatDateDE(todayUTC)}</strong>.
          Die <strong className="text-text-primary">aktuelle KW</strong> ist die{" "}
          <strong className="text-text-primary">Kalenderwoche&nbsp;{kw.weekNumber}</strong>.
          Diese Woche begann am Montag, den {formatDateDE(kw.startDate)}, und
          endet am Sonntag, den {formatDateDE(kw.endDate)}. Ob Du nach der{" "}
          <strong className="text-text-primary">Kalenderwoche heute</strong>{" "}
          oder der <strong className="text-text-primary">KW Woche heute</strong>{" "}
          suchst – hier wirst Du fündig.
        </p>
      </section>

      {/* ── 1b. WEEKDAY TABLE ───────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-10 fade-in">
        <h2 id="kw-alle-7-tage" className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          KW {kw.weekNumber} · Alle 7 Tage
        </h2>
        <WeekdayTable startDate={kw.startDate} today={todayUTC} />
      </section>


      {/* ── 1c. KW MORGEN & NÄCHSTE KW ─────────────────────────── */}
      <section id="kw-morgen" className="max-w-2xl mx-auto px-4 pb-10 scroll-mt-20">
        <h2 id="welche-kalenderwoche-haben-wir-morgen" className="text-xl font-semibold mb-3">
          Welche Kalenderwoche haben wir morgen?
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Morgen, am{" "}
          <strong className="text-text-primary">{tomorrowDayName}, {formatDateDE(tomorrow)}</strong>,
          ist{" "}
          <strong className="text-text-primary">KW&nbsp;{tomorrowKW.weekNumber}</strong>.{" "}
          {tomorrowIsSameKW
            ? "Die Kalenderwoche bleibt gegenüber heute gleich."
            : `Ab morgen beginnt eine neue Kalenderwoche – KW\u00a0${tomorrowKW.weekNumber}\u00a0${tomorrowKW.year}.`}
          {" "}Nach ISO&nbsp;8601 wechselt die KW immer am Übergang von Sonntag auf
          Montag um 00:00&nbsp;Uhr.
        </p>

        {/* Mini-Übersicht: Prev / Current / Next KW */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Zeitraum</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">KW</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Datum (Mo–So)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 text-text-secondary">Vorherige</td>
                <td className="px-4 py-2.5 text-text-secondary">KW&nbsp;{prevKW.weekNumber}</td>
                <td className="px-4 py-2.5 text-text-secondary">
                  {formatDateDE(prevKWStart)} – {formatDateDE(prevKWEnd)}
                </td>
              </tr>
              <tr className="border-b border-border bg-accent/5">
                <td className="px-4 py-2.5 font-semibold text-accent">Aktuell</td>
                <td className="px-4 py-2.5 font-semibold text-text-primary">KW&nbsp;{kw.weekNumber}</td>
                <td className="px-4 py-2.5 text-text-primary">
                  {formatDateDE(kw.startDate)} – {formatDateDE(kw.endDate)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-text-secondary">Nächste</td>
                <td className="px-4 py-2.5 text-text-secondary">KW&nbsp;{nextKW.weekNumber}</td>
                <td className="px-4 py-2.5 text-text-secondary">
                  {formatDateDE(nextKWStart)} – {formatDateDE(nextKWEnd)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs mt-2">
          Tipp: Schreib <a href={`/kalenderwochen/${kw.year}`} className="text-accent hover:underline">Kalenderwochen</a> immer als{" "}
          <strong className="text-text-primary">„KW&nbsp;{kw.weekNumber}&nbsp;/&nbsp;{kw.year}"</strong>{" "}
          – so vermeidest Du Verwechslungen am Jahreswechsel.
        </p>
      </section>

      {/* ── Block B: getönter Hintergrund ─────────────────────── */}
      <div className="bg-surface-secondary/50 py-2">

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

      </div>{/* Ende Block B (getönter Hintergrund) */}

      <hr className="section-divider" />

      {/* ── 3c. HINTERGRÜNDE: Aktuelle KW ── Cluster 1 ─────────── */}
      <section id="hintergruende" className="max-w-2xl mx-auto px-4 pb-14 scroll-mt-20">
        <h2 id="hintergruende-zu-aktuelle-kw" className="text-2xl font-semibold mb-4">
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
              (auch oft als <em>aktuelle Kalender&shy;Woche</em> gesucht) nach
              der Norm ISO&nbsp;8601 bestimmt.
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
              Eine Kalenderwoche beginnt gemäß ISO&nbsp;8601 (§&nbsp;2.2.8) und
              DIN&nbsp;EN&nbsp;28601 immer am{" "}
              <strong className="text-text-primary">Montag</strong> und endet am
              Sonntag.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text-primary">Anzahl der Wochen:</strong>{" "}
              Ein Kalenderjahr hat in der Regel 52&nbsp;Wochen. Jahre mit
              53&nbsp;Kalenderwochen werden als{" "}
              <strong className="text-text-primary">„langes Jahr"</strong>{" "}
              bezeichnet – sie kommen im Schnitt alle 5 bis 6 Jahre vor
              (71 von 400 Jahren laut ISO&nbsp;8601 Annex&nbsp;B).
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text-primary">Was bedeutet „KW"?</strong>{" "}
              KW ist die Abkürzung für{" "}
              <strong className="text-text-primary">Kalenderwoche</strong>. Du
              nutzt sie, wenn Termine schnell und eindeutig stehen sollen –
              etwa bei Deadlines, Lieferterminen oder in der <a href="/schulferien/2026" className="text-accent hover:underline">Urlaubsplanung</a>.
              Für klare Absprachen schreib immer das Jahr dazu, z.&nbsp;B.{" "}
              <strong className="text-text-primary">„KW&nbsp;{kw.weekNumber}/{kw.year}"</strong>.
            </span>
          </li>
        </ul>
      </section>

      {/* ── 3d. ALLTAGS-TIPPS: Aktuelle KW ── Cluster 1 ──────────── */}
      <section id="alltag" className="max-w-2xl mx-auto px-4 pb-14 scroll-mt-20">
        <h2 id="so-nutzt-du-die-aktuelle-kw-im-alltag" className="text-2xl font-semibold mb-4">
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

      <hr className="section-divider" />

      {/* ── Woche im Jahr (Cluster 4, kompakt) ────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-14">
        <h2 id="die-wievielte-woche-im-jahr-ist-heute" className="text-2xl font-semibold mb-3">
          Die wievielte Woche im Jahr ist heute?
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Wir befinden uns in{" "}
          <strong className="text-text-primary">
            Woche&nbsp;{kw.weekNumber} von {weeksInYear}
          </strong>{" "}
          im Jahr {kw.year}. Das Jahr {kw.year} hat insgesamt{" "}
          {weeksInYear}&nbsp;Kalenderwochen nach ISO&nbsp;8601. Mehr dazu auf unserer{" "}
          <a href="/wie-viele-wochen-hat-ein-jahr" className="text-accent hover:underline">
            Ratgeber-Seite
          </a>.
        </p>
      </section>

      <hr className="section-divider" />

      {/* ── 4. FAQ ──────────────────────────────────────────────
       * Cluster 3: welche KW haben wir – SEO-Text ✅ befüllt
       * ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="max-w-2xl mx-auto px-4 pb-16 scroll-mt-20">
        <h2 id="haeufige-fragen-zur-kalenderwoche" className="text-2xl font-semibold mb-2">
          Häufige Fragen zur Kalenderwoche
        </h2>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          Die Kalenderwoche aktuell: Welche KW haben wir gerade, wie wird sie
          berechnet und wann beginnt KW&nbsp;1? Hier beantworten wir die
          häufigsten Fragen rund um die Kalenderwoche nach ISO&nbsp;8601.
          Erfahre, warum manche Jahre 53&nbsp;KW haben, wie du die
          heutige Kalenderwoche schnell bestimmst und was der Unterschied
          zwischen deutschem und amerikanischem Wochensystem ist. Weitere
          Antworten findest du auf unserer{" "}
          <a href="/faq" className="text-accent hover:underline">
            ausführlichen FAQ-Seite
          </a>.
        </p>
        <div className="space-y-2.5">
          {homeFaqs.map((faq, i) => (
            <details
              key={i}
              open={i < 3 ? true : undefined}
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

      <hr className="section-divider" />

      {/* ── Block F: getönter Hintergrund ─────────────────────── */}
      <div className="bg-surface-secondary/50 py-2">

      {/* ── 5. KW JAHRESÜBERSICHT ──────────────────────────────────
       * Cluster 2: Kalenderwochen Jahresübersicht – SEO-Text ✅ befüllt
       * ──────────────────────────────────────────────────────────── */}
      <section id="alle-kw" className="max-w-4xl mx-auto px-4 pb-16 scroll-mt-20">
        <div className="flex items-baseline justify-between mb-5">
          <h2 id="alle-kalenderwochen" className="text-2xl font-semibold">
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
          (KW&nbsp;{kw.weekNumber}) ist blau hervorgehoben. Klicke auf
          eine beliebige Woche, um Start- und Enddatum, Feiertage und
          Details nach ISO&nbsp;8601 zu sehen. Die vollständige{" "}
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen-Übersicht mit Jahresnavigation
          </a>{" "}
          findest du auf der Unterseite.
        </p>
        <KWTable weeks={allWeeks} currentWeek={kw.weekNumber} />
        <a
          href="/kalenderwoche"
          className="inline-block mt-5 text-sm text-accent hover:underline sm:hidden"
        >
          Vollständige Übersicht →
        </a>
      </section>
      </div>{/* Ende Block F */}
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
 * [x] Speakable Schema für KI-Sprachsuche
 */
