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
        "Eine Kalenderwoche (KW) ist ein Zeitraum von sieben Tagen, der nach ISO\u00a08601 am Montag beginnt und am Sonntag endet. In Deutschland, Österreich und der Schweiz ist der ISO-8601-Standard verbindlich und bildet die Grundlage für Geschäftstermine, Lieferzeiten und Projektpläne. Die Nummerierung beginnt mit KW\u00a01 und endet je nach Jahr mit KW\u00a052 oder KW\u00a053. KW\u00a01 ist immer die Woche mit dem ersten Donnerstag des Jahres. Das US-amerikanische System beginnt die Woche am Sonntag und definiert KW\u00a01 anders – internationale Kalenderanwendungen weichen daher gelegentlich vom deutschen Standard ab.",
    },
    {
      question: "Wann beginnt die Kalenderwoche 1?",
      answer:
        "KW\u00a01 ist die Woche, die den ersten Donnerstag des Jahres enthält. Der 4.\u00a0Januar liegt immer in KW\u00a01, egal auf welchen Wochentag er fällt. Dadurch kann KW\u00a01 bereits am letzten Montag des Dezembers des Vorjahres beginnen, und die ersten Januartage können noch zur letzten KW des Vorjahres gehören. Diese Regelung ist in Deutschland nach DIN\u00a0EN\u00a028601 verbindlich. Der Donnerstag wurde als Bezugstag gewählt, weil er genau in der Mitte einer Montag-bis-Sonntag-Woche liegt (Tag\u00a04 von\u00a07). Praktisches Beispiel: KW\u00a01\u00a02026 beginnt bereits am 29.\u00a0Dezember\u00a02025.",
    },
    {
      question: "Wie viele Wochen hat ein Jahr?",
      answer: `Die meisten Jahre haben 52 Kalenderwochen. ${kw.year} hat ${weeksInYear}\u00a0KW. Eine 53.\u00a0KW gibt es, wenn der 1.\u00a0Januar auf einen Donnerstag fällt – oder in Schaltjahren auf einen Mittwoch. Ein normales Jahr hat 365 Tage, also 52 vollständige Wochen und einen Resttag. Fällt dieser Resttag auf einen Donnerstag, entsteht eine zusätzliche 53.\u00a0KW. In einem 400-Jahres-Zyklus gibt es genau 71 lange Jahre mit 53\u00a0KW – das entspricht ungefähr jedem fünften bis sechsten Jahr. Aktuelle Beispiele: 2015, 2020, 2026 und 2032.`,
    },
    {
      question: "Wie wird die Kalenderwoche berechnet?",
      answer:
        "Die KW wird nach ISO\u00a08601 berechnet: Man bestimmt den Donnerstag der betreffenden Woche und zählt, die wievielte Woche des Jahres dieser Donnerstag angehört. Wochen beginnen stets am Montag. Die Berechnungslogik in drei Schritten: Finde den Montag der Woche, finde den Donnerstag (Montag\u00a0+\u00a03\u00a0Tage), zähle den wievielten Donnerstag des Jahres das ist. In Excel steht ISOKALENDERWOCHE() bereit, Smartphone-Kalender nutzen dieselbe Logik, sofern die Region auf Deutschland eingestellt ist. Unser KW-Rechner auf der Startseite erledigt die Berechnung sofort für jedes beliebige Datum.",
    },
    {
      question: "Was bedeutet ISO 8601?",
      answer:
        "ISO\u00a08601 ist ein internationaler Standard der ISO (International Organization for Standardization) zur einheitlichen Darstellung von Datum und Uhrzeit. Er legt fest, dass Wochen am Montag beginnen und KW\u00a01 den ersten Donnerstag des Jahres enthält. In Deutschland ist dieser Standard nach DIN\u00a0EN\u00a028601 verbindlich. Das abweichende US-amerikanische System startet die Woche am Sonntag – daher kann ein und dasselbe Datum in Europa und den USA unterschiedlichen KW-Nummern zugeordnet sein. In Outlook, Google Kalender und Apple Kalender lässt sich die KW-Anzeige auf den ISO-Standard umstellen, indem du die Region auf Deutschland setzt.",
    },
    {
      question: `Hat ${kw.year} eine KW\u00a053?`,
      answer:
        weeksInYear === 53
          ? `Ja, ${kw.year} hat 53\u00a0Kalenderwochen. Das tritt auf, weil der 1.\u00a0Januar\u00a0${kw.year} auf einen Donnerstag fällt. Nach ISO\u00a08601 wird eine Woche dem Jahr zugeordnet, in dem ihr Donnerstag liegt. Ein normales Jahr hat 365\u00a0Tage, also 52\u00a0volle Wochen plus einen Resttag. Fällt dieser Resttag auf einen Donnerstag, entsteht die zusätzliche 53.\u00a0KW. In einem 400-Jahres-Zyklus kommen genau 71 solche langen Jahre vor – ungefähr jedes fünfte bis sechste Jahr.`
          : `Nein, ${kw.year} hat 52\u00a0Kalenderwochen. Eine KW\u00a053 gibt es, wenn der 1.\u00a0Januar auf einen Donnerstag fällt (oder in Schaltjahren auf einen Mittwoch). Das Jahr muss dann 53\u00a0Donnerstage enthalten. In einem 400-Jahres-Zyklus gibt es genau 71 solche langen Jahre – ungefähr jedes fünfte bis sechste Jahr. Die nächsten Jahre mit 53\u00a0KW sind 2026, 2032 und 2037.`,
    },
    {
      question: "Wie unterscheiden sich KW und Wochennummer?",
      answer:
        "Die Begriffe Kalenderwoche (KW) und Wochennummer werden im deutschsprachigen Raum synonym verwendet. Beide beziehen sich auf den ISO-8601-Standard, der die Nummerierung nach dem Donnerstag-Prinzip definiert. Im internationalen Kontext kann der Begriff 'Wochennummer' auch nach anderen Standards berechnet sein, etwa dem US-System mit Sonntag als Wochenbeginn. Deshalb ist es wichtig, bei internationalen Terminen explizit auf ISO\u00a08601 zu verweisen. In Deutschland, Österreich und der Schweiz ist ISO\u00a08601 der verbindliche Standard für offizielle und geschäftliche Datumsangaben.",
    },
    {
      question: "Welche KW haben wir am nächsten Montag?",
      answer: `Ab dem nächsten Montag befinden wir uns in KW\u00a0${nextKW.weekNumber}\u00a0${nextKW.year}. Nach ISO\u00a08601 beginnt jede neue Kalenderwoche am Montag um 0:00\u00a0Uhr. Die KW-Nummer wechselt also nicht zur Wochenmitte, sondern immer zum Montag. Wenn der nächste Montag auf einen Termin in der Übergangsphase Ende Dezember / Anfang Januar fällt, kann sich dabei auch die Jahreszahl der KW ändern – die Woche gehört dann bereits zum neuen Kalenderjahr nach ISO\u00a08601.`,
    },
    {
      question: "Wie kann ich Kalenderwochen im iPhone- oder Android-Kalender anzeigen?",
      answer:
        "Auf dem iPhone: Einstellungen → Kalender → Wochennummern aktivieren. Unter Android (Google\u00a0Kalender): Einstellungen → Allgemein → Wochennummern anzeigen. Die KW wird dann direkt in der Wochenansicht eingeblendet. In Microsoft Outlook aktivierst du die KW-Anzeige unter Datei → Optionen → Kalender → Kalenderoptionen → Wochennummern anzeigen. Achte in allen Anwendungen darauf, dass der Wochenstart auf Montag und die Region auf Deutschland eingestellt ist, damit die Berechnung dem ISO-8601-Standard entspricht.",
    },
    {
      question: "Wo finde ich einen Kalender mit Kalenderwochen?",
      answer:
        "Auf aktuellekw.de findest du alle Kalenderwochen im Überblick – mit KW-Nummer, exaktem Start- und Enddatum sowie einer Jahresübersicht für mehrere Jahre. Alternativ kannst du in Outlook, Google Kalender oder deinem Smartphone-Kalender die Wochennummern einblenden lassen. Für ausgedruckte Kalender mit KW-Angabe findest du auf dieser Seite eine Jahresübersicht, die du direkt im Browser aufrufen kannst. Unsere KW-Tabelle zeigt dir auf einen Blick vergangene, aktuelle und zukünftige Wochen inklusive Feiertagen.",
    },
    {
      question: "Warum zeigt mein Kalender eine andere KW an?",
      answer:
        "Das liegt meist an einer falschen Einstellung des Wochenstarts. In den USA beginnt die Woche am Sonntag, nach ISO\u00a08601 am Montag. Prüfe in deinen Kalender-Einstellungen, ob die Region auf Deutschland (oder Europa) und der Wochenstart auf Montag gesetzt ist. Ein weiterer häufiger Grund: Einige ältere Kalenderversionen nutzen die veraltete DIN\u00a01355 (Wochennummer nach dem 1.\u00a0Januar-Prinzip) statt ISO\u00a08601. Microsoft Office und Apple-Produkte verwenden bei korrekter Regionseinstellung automatisch den ISO-Standard.",
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
              Eine Kalenderwoche beginnt gemäß DIN&nbsp;1355 immer am{" "}
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
              bezeichnet – sie kommen im Schnitt alle 5 bis 6 Jahre vor.
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

      {/* ── 3d2. KALENDERWOCHEN IN DIGITALEN KALENDERN ─────────── */}
      <section id="kalender-apps" className="max-w-2xl mx-auto px-4 pb-14 scroll-mt-20">
        <h2 id="kalenderwochen-im-smartphone-und-outlook-anzeigen" className="text-2xl font-semibold mb-4">
          Kalenderwochen im Smartphone &amp; Outlook anzeigen
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Du möchtest die <strong className="text-text-primary">Kalenderwoche</strong>{" "}
          direkt in Deinem Kalender sehen? Öffne die Einstellungen Deiner App
          und aktiviere <strong className="text-text-primary">Wochennummern</strong>.
          Der genaue Menüpfad unterscheidet sich je nach Gerät – das Vorgehen
          bleibt aber gleich:
        </p>
        {/* Desktop: Tabelle */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-border mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Gerät</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Wo aktivieren?</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Menüpunkt</th>
                <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Hinweis</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-medium text-text-primary">iPhone</td>
                <td className="px-4 py-2.5">Einstellungen (iOS)</td>
                <td className="px-4 py-2.5">Wochennummern</td>
                <td className="px-4 py-2.5">Region &amp; Wochenbeginn prüfen</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-medium text-text-primary">Android</td>
                <td className="px-4 py-2.5">Kalender-App</td>
                <td className="px-4 py-2.5">Wochennummern</td>
                <td className="px-4 py-2.5">Wochenbeginn auf Montag stellen</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-medium text-text-primary">Outlook</td>
                <td className="px-4 py-2.5">Optionen → Kalender</td>
                <td className="px-4 py-2.5">Wochennummern anzeigen</td>
                <td className="px-4 py-2.5">Regionseinstellungen prüfen</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-text-primary">Google Kalender</td>
                <td className="px-4 py-2.5">Einstellungen</td>
                <td className="px-4 py-2.5">Wochennummern anzeigen</td>
                <td className="px-4 py-2.5">Bei Problemen App neu starten</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Mobile: Karten-Layout */}
        <div className="sm:hidden space-y-3 mb-4">
          {[
            { device: "iPhone", where: "Einstellungen (iOS)", menu: "Wochennummern", hint: "Region & Wochenbeginn pr\u00fcfen" },
            { device: "Android", where: "Kalender-App", menu: "Wochennummern", hint: "Wochenbeginn auf Montag stellen" },
            { device: "Outlook", where: "Optionen \u2192 Kalender", menu: "Wochennummern anzeigen", hint: "Regionseinstellungen pr\u00fcfen" },
            { device: "Google Kalender", where: "Einstellungen", menu: "Wochennummern anzeigen", hint: "Bei Problemen App neu starten" },
          ].map((item) => (
            <div key={item.device} className="bg-surface-secondary border border-border rounded-xl p-4">
              <span className="text-text-primary font-semibold text-sm">{item.device}</span>
              <p className="text-text-secondary text-xs mt-1.5">
                <span className="text-text-secondary/70">Wo:</span> {item.where} → <strong className="text-text-primary">{item.menu}</strong>
              </p>
              <p className="text-text-secondary text-xs mt-1">
                <span className="text-text-secondary/70">Tipp:</span> {item.hint}
              </p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-xs">
          Achte darauf, dass der <strong className="text-text-primary">Wochenbeginn
          auf Montag</strong> eingestellt ist und die Region auf Deutschland/Europa
          steht – sonst kann die angezeigte KW abweichen.
        </p>
      </section>

      {/* Vergleichstabelle entfernt – Daten bereits in "KW morgen" Sektion */}

      <hr className="section-divider" />

      {/* ── Block D: getönter Hintergrund ─────────────────────── */}
      <div className="bg-surface-secondary/50 py-2">

      {/* ── 3e2. HÄUFIGE FEHLER BEI DER KW ────────────────────────── */}
      <section id="kalender-fehler" className="max-w-2xl mx-auto px-4 pb-14 scroll-mt-20">
        <h2 id="warum-zeigt-mein-kalender-eine-andere-kw-an" className="text-2xl font-semibold mb-4">
          Warum zeigt mein Kalender eine andere KW an?
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Wenn die <strong className="text-text-primary">Kalenderwoche heute</strong>{" "}
          nicht zu Deiner Erwartung passt, liegt das meist an abweichenden
          Einstellungen: Einige Tools und US-Kalender starten die Woche am{" "}
          <strong className="text-text-primary">Sonntag</strong> statt am Montag –
          dadurch verschiebt sich die KW-Zählung. Auch eine falsche Region
          oder Locale (z.&nbsp;B. USA statt Deutschland) kann die Anzeige
          beeinflussen.
        </p>
        <ol className="space-y-2.5 text-text-secondary text-sm leading-relaxed list-none">
          <li className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">1.</span>
            <span><strong className="text-text-primary">Wochenstart prüfen:</strong>{" "}
            Stelle in den Einstellungen „Woche beginnt am: Montag" ein.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">2.</span>
            <span><strong className="text-text-primary">Region einstellen:</strong>{" "}
            Wähle Deutschland oder Europa als Locale – nicht USA.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">3.</span>
            <span><strong className="text-text-primary">Wochennummern aktivieren:</strong>{" "}
            Schalte die KW-Anzeige in der Kalender-App explizit ein.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">4.</span>
            <span><strong className="text-text-primary">Zeitzone kontrollieren:</strong>{" "}
            Besonders nach Reisen oder bei VPN-Nutzung kann die Zeitzone falsch stehen.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">5.</span>
            <span><strong className="text-text-primary">App aktualisieren:</strong>{" "}
            Starte die App neu oder synchronisiere den Kalender, wenn Werte „hängen".</span>
          </li>
        </ol>
      </section>

      {/* ── 3e3. KW SCHNELL BESTIMMEN ──────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-14">
        <h2 id="kalenderwoche-schnell-bestimmen" className="text-2xl font-semibold mb-4">
          Kalenderwoche schnell bestimmen – 3 einfache Methoden
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Wenn Du die{" "}
          <strong className="text-text-primary">aktuelle KW herausfinden</strong>{" "}
          willst, brauchst Du keinen Rechner. In den meisten Fällen reicht ein
          Blick in Deinen Kalender:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface-secondary border border-border rounded-xl p-4">
            <span className="text-accent font-bold text-lg">1</span>
            <h3 className="font-medium text-text-primary text-sm mt-1 mb-1.5">
              Smartphone-Kalender
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed">
              Wochennummern in den iOS- oder Android-Einstellungen aktivieren.
              Die KW steht dann direkt in der Wochenansicht.
            </p>
          </div>
          <div className="bg-surface-secondary border border-border rounded-xl p-4">
            <span className="text-accent font-bold text-lg">2</span>
            <h3 className="font-medium text-text-primary text-sm mt-1 mb-1.5">
              Outlook / Google Kalender
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed">
              KW in den Kalender-Einstellungen einblenden. Ideal im Alltag,
              weil Du die KW neben Terminen siehst.
            </p>
          </div>
          <div className="bg-surface-secondary border border-border rounded-xl p-4">
            <span className="text-accent font-bold text-lg">3</span>
            <h3 className="font-medium text-text-primary text-sm mt-1 mb-1.5">
              Online-Kalender nutzen
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed">
              Funktioniert sofort im Browser. Achte darauf, dass nach{" "}
              <strong>ISO&nbsp;8601</strong> (Wochenstart Montag) gezählt wird.
            </p>
          </div>
        </div>
      </section>

      </div>{/* Ende Block D (getönter Hintergrund) */}

      <hr className="section-divider" />

      {/* ── 3f. ZUSAMMENFASSUNG ── Cluster 1 ─────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 id="zusammenfassung-und-ausblick" className="text-2xl font-semibold mb-3">
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

      {/* ── 3g. SEO-TEXT – CLUSTER 1 ──────────────────────────────
       * H2: "Was ist die aktuelle Kalenderwoche?"
       * ~180 Wörter | Keywords: aktuelle KW, Kalenderwoche heute, KW aktuell
       * ──────────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-14">
        <h2 id="was-ist-die-aktuelle-kalenderwoche" className="text-2xl font-semibold mb-4">
          Was ist die aktuelle Kalenderwoche?
        </h2>
        <div className="text-text-secondary text-sm leading-relaxed space-y-3">
          <p>
            Die <strong className="text-text-primary">aktuelle KW</strong> bezeichnet
            die laufende Kalenderwoche nach dem internationalen Standard ISO&nbsp;8601.
            In Deutschland, Österreich und der Schweiz ist diese Zählweise verbindlich.
            Die <strong className="text-text-primary">Kalenderwoche heute</strong>{" "}
            (KW&nbsp;{kw.weekNumber}) begann am {formatDateDE(kw.startDate)} und endet
            am {formatDateDE(kw.endDate)}.
          </p>
          <p>
            Wer wissen möchte, welche <strong className="text-text-primary">KW aktuell</strong>{" "}
            gilt, findet die Antwort hier sofort: Wir befinden uns in der
            KW&nbsp;{kw.weekNumber}&nbsp;{kw.year}. Die Berechnung basiert auf dem
            Donnerstag-Prinzip – KW&nbsp;1 ist stets die Woche, die den ersten
            Donnerstag im Januar enthält. Jede Woche beginnt am Montag und endet am Sonntag.
          </p>
          <p>
            Der Begriff <strong className="text-text-primary">aktuelle Kalenderwoche</strong>{" "}
            wird im Geschäftsalltag häufig für Deadlines, Liefertermine und
            Projektplanung verwendet. Statt ein genaues Datum zu nennen, sagt man
            etwa „Lieferung in KW&nbsp;{kw.weekNumber}" – jeder weiß sofort, welcher
            Zeitraum gemeint ist. Auch in Outlook, Google Kalender und vielen
            ERP-Systemen lässt sich die{" "}
            <strong className="text-text-primary">KW-Nummer</strong> einblenden, um
            Termine schneller zuzuordnen.
          </p>
          <p>
            Im Unterschied zum amerikanischen System, bei dem die Woche am Sonntag
            beginnt, startet die <strong className="text-text-primary">KW nach
            ISO&nbsp;8601</strong> immer am Montag. Auch die Nummerierung weicht ab:
            In den USA kann es eine Woche&nbsp;0 geben, während in Europa
            KW&nbsp;1 die erste Woche mit mindestens vier Tagen im neuen Jahr ist.
            aktuellekw.de zeigt Dir die{" "}
            <strong className="text-text-primary">heutige Kalenderwoche</strong>{" "}
            stets nach dem in Deutschland gültigen Standard.
          </p>
          <p>
            <strong className="text-text-primary">Aktuelle KW {kw.year} – Jahreseinordnung:</strong>{" "}
            Rund um den Jahreswechsel gibt es Sonderfälle. KW&nbsp;1 kann bereits
            Ende Dezember beginnen, und die ersten Tage im Januar können noch zur
            letzten KW des Vorjahres gehören. Deshalb ist es sinnvoll,
            Kalenderwochen immer als „KW&nbsp;{kw.weekNumber}&nbsp;/&nbsp;{kw.year}" zu
            schreiben – so ist sofort erkennbar, welches Jahr gemeint ist.
          </p>
        </div>
      </section>

      {/* ── 3h. CLUSTER 4: Woche im Jahr ── Info-Section ──────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-14">
        <h2 id="die-wievielte-woche-im-jahr-ist-heute" className="text-2xl font-semibold mb-3">
          Die wievielte Woche im Jahr ist heute?
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Wir befinden uns in{" "}
          <strong className="text-text-primary">
            Woche&nbsp;{kw.weekNumber} von {weeksInYear}
          </strong>{" "}
          im Jahr {kw.year}. Das bedeutet, dass bereits{" "}
          {kw.weekNumber - 1}&nbsp;KW Wochen vergangen sind und
          noch {remainingWeeks}&nbsp;Wochen in diesem Jahr verbleiben.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Die Zählung der Wochen im Jahr folgt dem ISO-8601-Standard. Ein normales
          Kalenderjahr hat 52&nbsp;Wochen, in Ausnahmefällen 53. Das aktuelle
          Jahr {kw.year} hat insgesamt {weeksInYear}&nbsp;<a href="/kalenderwoche" className="text-accent hover:underline">Kalenderwochen</a>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          Die Frage „<strong className="text-text-primary">Wieviele Wochen hat ein
          Jahr?</strong>" lässt sich nicht pauschal beantworten. Nach ISO&nbsp;8601
          hat ein Kalenderjahr entweder 52 oder 53&nbsp;Kalenderwochen. Eine
          53.&nbsp;KW entsteht, wenn der 1.&nbsp;Januar auf einen Donnerstag fällt –
          oder in Schaltjahren auf einen Mittwoch. Diese sogenannten{" "}
          <strong className="text-text-primary">Langwochen-Jahre</strong> treten
          im Schnitt alle fünf bis sechs Jahre auf.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          Wer schnell wissen möchte, in welcher{" "}
          <strong className="text-text-primary">Woche des Jahres</strong> wir uns
          befinden, kann unseren{" "}
          <a href="#kw-rechner-input" className="text-accent hover:underline">
            KW-Rechner
          </a>{" "}
          nutzen: Beliebiges Datum eingeben und sofort die zugehörige
          Kalenderwoche erfahren – inklusive Start- und Enddatum der{" "}
          <strong className="text-text-primary">KW Woche</strong>.
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
