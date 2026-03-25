import type { Metadata } from "next";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWTable from "@/components/KWTable";
import KWRechner from "@/components/KWRechner";
import CalendarPrintSection from "@/components/CalendarPrintSection";
import AuthorByline from "@/components/AuthorByline";

export const revalidate = 3600;

/* ── Metadata ──────────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);
  const ogTitle = `Kalender mit Wochen ${kw.year}: ISO-KW-Tabelle + Download`;
  const ogDescription = `Kalender mit Wochen ${kw.year}: aktuelle KW + Datumsspanne sofort oben. ISO-8601 Tabelle KW 1–${weeksInYear} mit Start/Enddatum, PDF/Excel-Download & Druckansichten.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: "https://aktuellekw.de/kalender-mit-kalenderwochen",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/kalender-mit-kalenderwochen",
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

/* ── Monthly KW ranges helper ──────────────────────────────────────── */
const MONTH_NAMES_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
] as const;

function getMonthlyKWRanges(year: number) {
  const allWeeks = getAllKWsForYear(year);
  const ranges: { month: string; kwStart: number; kwEnd: number; dateRange: string }[] = [];

  for (let m = 0; m < 12; m++) {
    const monthStart = new Date(year, m, 1);
    const monthEnd = new Date(year, m + 1, 0);
    let firstKW = 0;
    let lastKW = 0;
    let firstDate = "";
    let lastDate = "";

    for (const w of allWeeks) {
      const weekEnd = w.endDate;
      const weekStart = w.startDate;
      // A week "belongs" to a month if its date range overlaps the month
      if (weekEnd >= monthStart && weekStart <= monthEnd) {
        if (!firstKW) {
          firstKW = w.weekNumber;
          firstDate = formatDateDE(w.startDate);
        }
        lastKW = w.weekNumber;
        lastDate = formatDateDE(w.endDate);
      }
    }

    ranges.push({
      month: MONTH_NAMES_DE[m],
      kwStart: firstKW,
      kwEnd: lastKW,
      dateRange: `${firstDate}–${lastDate}`,
    });
  }
  return ranges;
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function KalenderMitKalenderwochenPage() {
  const currentKW = getCurrentKW();
  const year = currentKW.year;
  const allWeeks = getAllKWsForYear(year);
  const weeksInYear = getWeeksInYear(year);
  const prevYear = year - 1;
  const nextYear = year + 1;
  const monthRanges = getMonthlyKWRanges(year);

  /* ── FAQ data ────────────────────────────────────────────────────── */
  const faqs = [
    {
      question: `Hat ${year} 52 oder 53 Kalenderwochen?`,
      answer: weeksInYear === 53
        ? `${year} hat nach ISO 8601 insgesamt 53 Kalenderwochen. Du erkennst das daran, dass es eine KW 53 gibt, die ins Jahr ${year + 1} hineinreicht. Für deinen „Kalender mit Wochen ${year}" bedeutet das: KW 1–53 sind relevant.`
        : `${year} hat nach ISO 8601 insgesamt 52 Kalenderwochen (KW 1–52). Es ist kein „langes Jahr", da der 1. Januar ${year} nicht auf einen Donnerstag fällt.`,
    },
    {
      question: `Wann beginnt KW 1 im Jahr ${year}?`,
      answer: `KW 1 im Jahr ${year} beginnt am ${formatDateDE(allWeeks[0].startDate)} (Montag) und endet am ${formatDateDE(allWeeks[0].endDate)} (Sonntag). Das folgt der ISO-8601-Regel, nach der Kalenderwochen am Montag starten und KW 1 die Woche mit dem ersten Donnerstag des Jahres ist.`,
    },
    ...(weeksInYear === 53
      ? [{
          question: `Wann beginnt KW 53 im Jahr ${year} und wann endet sie?`,
          answer: `KW 53 im Jahr ${year} beginnt am ${formatDateDE(allWeeks[allWeeks.length - 1].startDate)} (Montag) und endet am ${formatDateDE(allWeeks[allWeeks.length - 1].endDate)} (Sonntag). Damit liegt der Wochenstart noch in ${year}, das Wochenende aber bereits in ${year + 1}.`,
        }]
      : []),
    {
      question: "Warum startet KW 1 manchmal schon im Dezember des Vorjahres?",
      answer: `KW 1 kann schon im Dezember beginnen, weil ISO 8601 Wochen nach dem „Mehrheit-im-Jahr"-Prinzip zählt. Entscheidend ist, dass die Woche den ersten Donnerstag (bzw. mindestens vier Tage) im neuen Jahr enthält. Deshalb startet KW 1 in manchen Jahren im Dezember – auch im Kalender mit Wochen ${year}.`,
    },
    {
      question: "Beginnt die Kalenderwoche in Deutschland am Montag oder Sonntag?",
      answer: "In Deutschland beginnt die Kalenderwoche am Montag und endet am Sonntag (ISO 8601). Das ist auch die Standardlogik für Kalenderwochen (KW) in deutschen Kalendern und Planern.",
    },
    {
      question: `Gibt es den Kalender ${year} zum Ausdrucken als PDF kostenlos?`,
      answer: `Ja – auf aktuellekw.de kannst du den Kalender ${year} mit Kalenderwochen als PDF direkt herunterladen. Wähle zwischen Jahres-, Monats- oder Wochenkalender. Achte darauf, dass die PDF die ISO-Kalenderwochen (KW 1–${weeksInYear}) enthält.`,
    },
    {
      question: `Kann ich den Kalender ${year} als Excel-Vorlage mit Kalenderwochen herunterladen?`,
      answer: `Ja – die Excel-Vorlage für ${year} enthält Kalenderwochen nach ISO 8601 (Wochenstart Montag). Verfügbar als Basic (KW), Plus (KW + Feiertage) und Urlaub (KW + Feiertage + Abwesenheiten). So kannst du deinen Kalender mit Wochen ${year} leicht filtern und weiterverarbeiten.`,
    },
    {
      question: `Sind Feiertage im Kalender ${year} bundesweit gleich oder je Bundesland unterschiedlich?`,
      answer: `In Deutschland sind einige Feiertage bundesweit gleich (z. B. Weihnachten, Neujahr, Tag der Deutschen Einheit), andere gelten nur in bestimmten Bundesländern (z. B. Fronleichnam, Reformationstag). Wähle dein Bundesland, damit die Feiertage im Kalender ${year} stimmen.`,
    },
    {
      question: "Wie finde ich schnell heraus, welche Kalenderwoche ein bestimmtes Datum hat?",
      answer: `Am schnellsten findest du die Kalenderwoche über unseren KW-Rechner oder die ISO-8601-KW-Tabelle auf dieser Seite. Gib einfach ein Datum ein und du erhältst sofort die passende KW samt Datumsspanne (Montag–Sonntag).`,
    },
    {
      question: `Kann ich die Kalenderwochen ${year} als CSV exportieren?`,
      answer: `Ja – unsere KW-Tabelle lässt sich als CSV exportieren, z. B. für den Import in Projektmanagement-Tools oder ERP-Systeme. Start- und Enddatum je KW sind enthalten und das Format folgt ISO 8601 (Montag–Sonntag).`,
    },
  ];

  /* ── JSON-LD ─────────────────────────────────────────────────────── */
  const pageJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://aktuellekw.de/kalender-mit-kalenderwochen#breadcrumb",
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
          name: `Kalender mit Wochen ${year}`,
          item: "https://aktuellekw.de/kalender-mit-kalenderwochen",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": "https://aktuellekw.de/kalender-mit-kalenderwochen#dataset",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: `${year}-01-01`,
      dateModified: new Date().toISOString().split("T")[0],
      name: `Kalender mit Wochen ${year}`,
      description: `Kalender mit allen ${weeksInYear} Kalenderwochen des Jahres ${year} nach ISO 8601. Aktuelle Woche: KW ${currentKW.weekNumber}.`,
      url: "https://aktuellekw.de/kalender-mit-kalenderwochen",
      inLanguage: "de-DE",
      temporalCoverage: `${year}-01-01/${year}-12-31`,
      creator: { "@id": "https://aktuellekw.de/#organization" },
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://aktuellekw.de/kalender-mit-kalenderwochen#faqpage",
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: `${year}-01-01`,
      dateModified: new Date().toISOString().split("T")[0],
      mainEntity: faqs.map((f) => ({
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
            Kalender mit Wochen {year}
          </span>
        </nav>

        {/* ── H1 + Intro ─────────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Kalender mit Wochen {year} (KW&nbsp;1–{weeksInYear}): Kalenderwochen {year} mit Datum + kostenloser Druckkalender
        </h1>
        <div className="text-text-secondary leading-relaxed mb-8 space-y-3">
          <p>
            Du brauchst einen{" "}
            <strong className="text-text-primary">Kalender mit Wochen {year}</strong>{" "}
            und willst nicht jedes Mal selbst rechnen? Hier bekommst du sofort
            die <strong className="text-text-primary">aktuelle Kalenderwoche</strong>{" "}
            (<strong className="text-text-primary">KW&nbsp;{currentKW.weekNumber}</strong>,{" "}
            {formatDateDE(currentKW.startDate)} – {formatDateDE(currentKW.endDate)})
            inklusive Datumsspanne von Montag bis Sonntag – direkt oben, auf einen
            Blick.
          </p>
          <p>
            Darunter wartet die komplette{" "}
            <strong className="text-text-primary">ISO-8601-Tabelle der Kalenderwochen {year}</strong>{" "}
            (KW&nbsp;1–{weeksInYear}) mit Start- und Enddatum, damit du Termine,
            Projekte und Urlaube in Sekunden planst. Zusätzlich kannst du dir den{" "}
            <strong className="text-text-primary">Kalender {year} kostenlos als PDF oder Excel</strong>{" "}
            herunterladen und als Jahres-, Monats- oder Wochenkalender drucken.
            {weeksInYear === 53 && (
              <> Nach ISO-Logik hat <strong className="text-text-primary">{year} tatsächlich 53 Kalenderwochen</strong>.</>
            )}
          </p>
        </div>

        {/* ── Sprungmarken (TOC) ─────────────────────────────────── */}
        <nav
          aria-label="Inhaltsverzeichnis"
          className="bg-surface-secondary border border-border rounded-2xl p-5 mb-10"
        >
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-3">
            Inhaltsverzeichnis
          </p>
          <ul className="grid sm:grid-cols-2 gap-1.5 text-sm">
            <li>
              <a href="#aktuelle-kw" className="text-accent hover:underline">
                Aktuelle Kalenderwoche
              </a>
            </li>
            <li>
              <a href="#iso-8601-erklaert" className="text-accent hover:underline">
                ISO 8601 kurz erklärt
              </a>
            </li>
            <li>
              <a href="#anzahl-kalenderwochen" className="text-accent hover:underline">
                {weeksInYear === 53 ? "52 oder 53 Wochen?" : `Anzahl KW ${year}`}
              </a>
            </li>
            <li>
              <a href="#kalenderwochen-tabelle" className="text-accent hover:underline">
                KW-Tabelle {year}
              </a>
            </li>
            <li>
              <a href="#kalenderwochen-nach-monaten" className="text-accent hover:underline">
                KW nach Monaten
              </a>
            </li>
            <li>
              <a href="#kalender-ausdrucken" className="text-accent hover:underline">
                PDF-Download & Drucken
              </a>
            </li>
            <li>
              <a href="#kalender-excel" className="text-accent hover:underline">
                Excel-Vorlage
              </a>
            </li>
            <li>
              <a href="#kalender-feiertage" className="text-accent hover:underline">
                Kalender mit Feiertagen
              </a>
            </li>
            <li>
              <a href="#kw-rechner-input" className="text-accent hover:underline">
                KW-Rechner
              </a>
            </li>
            <li>
              <a href="#download-hub" className="text-accent hover:underline">
                Alle Downloads
              </a>
            </li>
            <li>
              <a href="#kw-in-kalender-apps-aktivieren" className="text-accent hover:underline">
                KW in Apps aktivieren
              </a>
            </li>
            <li>
              <a href="#faq" className="text-accent hover:underline">
                Häufige Fragen (FAQ)
              </a>
            </li>
          </ul>
        </nav>

        {/* ── H2: Aktuelle KW ────────────────────────────────────── */}
        <section id="aktuelle-kw" className="mb-10 fade-in">
          <h2 className="text-2xl font-semibold mb-4">
            Aktuelle Kalenderwoche: KW&nbsp;{currentKW.weekNumber} heute mit Datum
          </h2>
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 mb-4">
            <p className="text-2xl font-bold text-text-primary mb-1">
              Heute ist KW&nbsp;{currentKW.weekNumber}
            </p>
            <p className="text-text-secondary text-sm">
              Zeitraum: <strong className="text-text-primary">
                {formatDateDE(currentKW.startDate)} – {formatDateDE(currentKW.endDate)}
              </strong>{" "}
              (Montag – Sonntag)
            </p>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Du möchtest eine <strong className="text-text-primary">Kalenderwoche berechnen</strong>?
            Nutze den{" "}
            <a href="#kw-rechner-input" className="text-accent hover:underline">KW-Rechner</a>{" "}
            weiter unten – gib ein Datum ein und du erhältst sofort die passende KW.
            Praktisch, wenn du Termine in Kalenderwochen {year} planst oder vergangene
            Wochen prüfen willst. Mehr Details findest du unter{" "}
            <a href="/welche-kalenderwoche-haben-wir" className="text-accent hover:underline">
              Welche Kalenderwoche haben wir heute?
            </a>
          </p>
        </section>

        {/* ── H3: ISO 8601 erklärt ───────────────────────────────── */}
        <section id="iso-8601-erklaert" className="mb-10 fade-in">
          <h3 className="text-xl font-semibold mb-3">
            So wird die Kalenderwoche gezählt (ISO&nbsp;8601 kurz erklärt)
          </h3>
          <div className="text-text-secondary text-sm leading-relaxed space-y-2">
            <p>
              Die <strong className="text-text-primary">ISO-8601-Kalenderwoche</strong>{" "}
              folgt klaren Regeln. Damit du sofort richtig zählst:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">•</span>
                <span>
                  <strong className="text-text-primary">Montag bis Sonntag:</strong>{" "}
                  Eine KW startet immer am Montag und endet am Sonntag.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">•</span>
                <span>
                  <strong className="text-text-primary">KW-1-Regel:</strong>{" "}
                  KW&nbsp;1 ist die Woche mit dem ersten Donnerstag im Jahr.
                  Alternativ: die Woche, die den 4.&nbsp;Januar enthält.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">•</span>
                <span>
                  <strong className="text-text-primary">Konsequenz:</strong>{" "}
                  KW&nbsp;1 kann schon im Dezember des Vorjahres beginnen –
                  wie {year}: KW&nbsp;1 startet am{" "}
                  {formatDateDE(allWeeks[0].startDate)}.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── H2: Anzahl Kalenderwochen ──────────────────────────── */}
        <section id="anzahl-kalenderwochen" className="mb-10 fade-in">
          <h2 className="text-2xl font-semibold mb-4">
            Hat {year} 52 oder 53 Wochen? Anzahl der Kalenderwochen {year}
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Wenn du wissen willst, <strong className="text-text-primary">
              hat {year} 52 oder 53 Wochen</strong>, gilt nach ISO&nbsp;8601:
              {year} hat{" "}
              <strong className="text-text-primary">{weeksInYear} Kalenderwochen</strong>.
              Entscheidend ist die ISO-Regel mit dem ersten Donnerstag im Jahr.
              Sie legt fest, ob ein Jahr eine zusätzliche Kalenderwoche bekommt.
            </p>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-xs space-y-1">
              <p className="font-semibold text-text-primary text-sm mb-2">Fakten (ISO 8601):</p>
              <p>{year}: 365{year % 4 === 0 ? " (Schaltjahr: 366)" : ""} Tage, <strong className="text-text-primary">{weeksInYear} Kalenderwochen</strong> (ISO)</p>
              <p>Start <strong className="text-text-primary">KW&nbsp;1 {year}:</strong> {formatDateDE(allWeeks[0].startDate)} (Montag)</p>
              {weeksInYear === 53 && (
                <p>Start <strong className="text-text-primary">KW&nbsp;53 {year}:</strong> {formatDateDE(allWeeks[allWeeks.length - 1].startDate)} (Montag)</p>
              )}
              <p className="text-text-secondary">Quelle: ISO 8601 (§&nbsp;2.2.10, Definition der Kalenderwoche)</p>
            </div>
            {weeksInYear === 53 && (
              <p>
                <strong className="text-text-primary">KW&nbsp;53 {year}</strong> startet
                am {formatDateDE(allWeeks[allWeeks.length - 1].startDate)}. Sie endet
                am {formatDateDE(allWeeks[allWeeks.length - 1].endDate)}.
                In einem 400-Jahres-Zyklus gibt es genau 71 solche langen Jahre –
                das sind 17,75&nbsp;% aller Jahre (Quelle: ISO&nbsp;8601 Annex&nbsp;B).
              </p>
            )}
          </div>
        </section>

        {/* ── H2: KW-Tabelle ─────────────────────────────────────── */}
        <section id="kalenderwochen-tabelle" className="mb-10 fade-in">
          <h2 className="text-2xl font-semibold mb-3">
            Kalenderwochen {year}: Tabelle KW&nbsp;1–{weeksInYear} mit Datum
          </h2>
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            Hier findest du die <strong className="text-text-primary">KW-{year}-Tabelle</strong> als
            schnellen Wochenkalender zum Nachschlagen. Die aktuelle
            KW&nbsp;{currentKW.weekNumber} ist blau hervorgehoben. Klicke auf eine
            Woche, um Start- und Enddatum sowie weitere Details zu sehen. Eine
            kompakte Übersicht findest du unter{" "}
            <a href="/kalenderwochen-uebersicht" className="text-accent hover:underline">
              Kalenderwochen im Überblick
            </a>.
          </p>

          {/* Year navigation */}
          <nav
            aria-label="Jahresnavigation"
            className="flex items-center gap-2 mb-6"
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
              {year}
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

          <KWTable weeks={allWeeks} currentWeek={currentKW.weekNumber} />
        </section>

        {/* ── H3: KW nach Monaten ────────────────────────────────── */}
        <section id="kalenderwochen-nach-monaten" className="mb-10 fade-in">
          <h3 className="text-xl font-semibold mb-3">
            Kalenderwochen {year} nach Monaten (Januar bis Dezember)
          </h3>
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            Hier findest du die <strong className="text-text-primary">Kalenderwochen {year}</strong> im
            Überblick – nach Monaten sortiert mit dem jeweiligen KW-Bereich und Datumsbereich.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">Monat</th>
                  <th className="text-left py-2 pr-4">Kalenderwochen</th>
                  <th className="text-left py-2">Zeitraum</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {monthRanges.map((r, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium text-text-primary">{r.month}</td>
                    <td className="py-2 pr-4">
                      <strong className="text-text-primary">KW&nbsp;{r.kwStart}–{r.kwEnd}</strong>
                    </td>
                    <td className="py-2 text-xs">{r.dateRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── KW-Rechner ─────────────────────────────────────────── */}
        <section className="mb-10 fade-in">
          <h2 id="kw-rechner" className="text-2xl font-semibold mb-3">
            Kalenderwochen {year} schnell finden: KW für ein Datum berechnen
          </h2>
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            Wenn du {year} eine <strong className="text-text-primary">Kalenderwoche berechnen</strong>{" "}
            willst, geht das ohne Kopfrechnen. Wähle ein Datum aus und du siehst
            sofort die KW samt Zeitraum. Achte besonders auf den Jahreswechsel –
            Ende Dezember und Anfang Januar liegen teils in derselben KW.
          </p>
          <KWRechner />
        </section>

        {/* ── Kalender zum Ausdrucken ────────────────────────────── */}
        <section id="kalender-ausdrucken" className="fade-in">
          <h2 className="text-2xl font-semibold mb-3">
            Kalender {year} zum Ausdrucken (kostenlos): PDF-Download mit Kalenderwochen
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-4">
            <p>
              Hier findest du deinen{" "}
              <strong className="text-text-primary">Kalender {year} zum Ausdrucken</strong> als
              PDF-Download: <strong className="text-text-primary">Jahreskalender</strong> (1&nbsp;Seite),{" "}
              <strong className="text-text-primary">Monatskalender</strong> (12&nbsp;Seiten) und{" "}
              <strong className="text-text-primary">Wochenkalender</strong> ({weeksInYear}&nbsp;Wochen).
              Wähle flexibel zwischen mit oder ohne Kalenderwochen (KW), Hoch- oder
              Querformat sowie als Schwarzweiß-Druckvorlage.
            </p>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-xs">
              <p className="font-semibold text-text-primary text-sm mb-2">Download- & Druck-Checkliste:</p>
              <ul className="space-y-1">
                <li>✓ Vorlage wählen: Jahr / Monat / Woche, mit/ohne KW, Hoch/Quer, S/W</li>
                <li>✓ PDF öffnen</li>
                <li>✓ Druckeinstellungen kontrollieren: Skalierung und Ränder</li>
                <li>✓ Bei Abschneidungen: „An Seite anpassen" in den Druckoptionen wählen</li>
              </ul>
            </div>
          </div>
          <CalendarPrintSection year={year} />
        </section>

        {/* ── H2: Kalender mit Feiertagen ────────────────────────── */}
        <section id="kalender-feiertage" className="mt-12 mb-10 fade-in">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender {year} mit Feiertagen (Deutschland)
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Kalender {year} mit Feiertagen</strong> zeigt
              dir, welche freien Tage bundesweit gelten und welche nur in bestimmten{" "}
              <strong className="text-text-primary">Bundesländern</strong>. Zu den Feiertagen {year}{" "}
              gehören feste Termine wie Neujahr, Tag der Arbeit und Weihnachten –
              viele zusätzliche freie Tage hängen jedoch vom jeweiligen Bundesland ab
              (z.&nbsp;B. Fronleichnam, Reformationstag, Mariä Himmelfahrt).
            </p>
            <p>
              Wenn du Urlaub planst oder Termine koordinierst, ist ein{" "}
              <strong className="text-text-primary">Kalender mit Feiertagen nach Bundesland</strong>{" "}
              besonders praktisch. Alle Details findest du unter{" "}
              <a href={`/feiertage/${year}`} className="text-accent hover:underline">
                Feiertage {year} in Deutschland
              </a>.
            </p>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-xs">
              <p className="font-semibold text-text-primary text-sm mb-2">Download-Optionen:</p>
              <ul className="space-y-1">
                <li>☐ Bundesweit (DE) / ☐ nach Bundesland</li>
                <li>☐ Jahresformat / ☐ Monatsformat</li>
                <li>☐ mit KW / ☐ ohne KW</li>
              </ul>
              <p className="mt-2 text-text-secondary">Stand: aktuelle Rechtslage. Änderungen möglich.</p>
            </div>
          </div>
        </section>

        {/* ── H2: Excel-Vorlage ──────────────────────────────────── */}
        <section id="kalender-excel" className="mb-10 fade-in">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender {year} als Excel: Vorlage mit Kalenderwochen
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Du suchst eine <strong className="text-text-primary">Excel-Kalender-Vorlage {year}</strong>?
              Hier kannst du einen Excel-Kalender {year} mit KW als bearbeitbare Datei
              herunterladen. Je nach Version enthält die Vorlage zusätzliche Tabs:
              Jahresübersicht, Monatsblätter oder eine Liste für Urlaub/Abwesenheiten.
            </p>
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">Variante</th>
                  <th className="text-left py-2 pr-4">Inhalt</th>
                  <th className="text-left py-2 pr-4">Format</th>
                  <th className="text-left py-2">Umfang</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Basic (KW)</td>
                  <td className="py-2.5 pr-4">Kalenderwochen, klare Struktur</td>
                  <td className="py-2.5 pr-4">.xlsx</td>
                  <td className="py-2.5">Jahres- & Monatsansicht</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Plus (KW + Feiertage)</td>
                  <td className="py-2.5 pr-4">KW + Feiertage (optional)</td>
                  <td className="py-2.5 pr-4">.xlsx</td>
                  <td className="py-2.5">Jahres-, Monats- & Feiertags-Tab</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Urlaub (Komplett)</td>
                  <td className="py-2.5 pr-4">KW, Feiertage, Urlaubsplanung</td>
                  <td className="py-2.5 pr-4">.xlsx</td>
                  <td className="py-2.5">inkl. Abwesenheitsliste</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die <strong className="text-text-primary">Excel-Kalender-Vorlage {year} kostenlos</strong>{" "}
              funktioniert in Microsoft Excel und meist auch in LibreOffice. Je nach
              Programm können einzelne Formatierungen leicht abweichen.
            </p>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-xs">
              <p className="font-semibold text-text-primary text-sm mb-2">So nutzt du die Vorlage:</p>
              <ul className="space-y-1">
                <li>1. Datei öffnen</li>
                <li>2. Bundesland auswählen (optional, für Feiertage)</li>
                <li>3. Termine eintragen und bei Bedarf Zeilen filtern</li>
                <li>4. Druckbereich prüfen: Seitenlayout → Ausrichtung, Ränder, „An Seite anpassen"</li>
                <li>5. Als PDF exportieren oder direkt drucken</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── H2: Download-Hub ───────────────────────────────────── */}
        <section id="download-hub" className="mb-10 fade-in">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender mit Wochen {year} herunterladen: Alle Formate
          </h2>
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            Hier findest du deinen Download-Hub – alles gesammelt, ohne Suchen.
            Wähle <strong className="text-text-primary">PDF</strong> zum Drucken,{" "}
            <strong className="text-text-primary">XLSX</strong> zum Bearbeiten oder{" "}
            <strong className="text-text-primary">CSV</strong> für den Import in
            Projektmanagement- oder ERP-Tools.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-3">Format</th>
                  <th className="text-left py-2 pr-3">Inhalt</th>
                  <th className="text-center py-2 pr-3">KW</th>
                  <th className="text-center py-2 pr-3">Feiertage</th>
                  <th className="text-left py-2">Größe</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-3 font-medium text-text-primary">PDF</td>
                  <td className="py-2.5 pr-3">Jahresübersicht</td>
                  <td className="py-2.5 pr-3 text-center text-green-500">✓</td>
                  <td className="py-2.5 pr-3 text-center text-text-secondary">optional</td>
                  <td className="py-2.5 text-xs">ca. 200–500 KB</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-3 font-medium text-text-primary">XLSX</td>
                  <td className="py-2.5 pr-3">Planer + KW</td>
                  <td className="py-2.5 pr-3 text-center text-green-500">✓</td>
                  <td className="py-2.5 pr-3 text-center text-text-secondary">optional</td>
                  <td className="py-2.5 text-xs">ca. 50–150 KB</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium text-text-primary">CSV</td>
                  <td className="py-2.5 pr-3">KW-Import</td>
                  <td className="py-2.5 pr-3 text-center text-green-500">✓</td>
                  <td className="py-2.5 pr-3 text-center text-red-400">–</td>
                  <td className="py-2.5 text-xs">ca. 20–60 KB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-3">
            Alle Dateien sind für private und geschäftliche Nutzung gedacht.
          </p>
        </section>

        {/* ── KW in Kalender-Apps aktivieren ──────────────────────── */}
        <section className="mb-10 fade-in">
          <h2 id="kw-in-kalender-apps-aktivieren" className="text-2xl font-semibold mb-4">
            KW im Kalender aktivieren – App-Vergleich
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            Viele <strong className="text-text-primary">Kalender</strong> zeigen
            Kalenderwochen nicht automatisch an. So aktivierst du die{" "}
            <strong className="text-text-primary">KW im Kalender</strong> in den
            gängigsten Apps:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">App</th>
                  <th className="text-left py-2 pr-4">Pfad</th>
                  <th className="text-left py-2">ISO 8601</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">iPhone / iPad</td>
                  <td className="py-2.5 pr-4">Einstellungen → Kalender → Wochennummern</td>
                  <td className="py-2.5 text-green-500">✓ Standard</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Google Kalender</td>
                  <td className="py-2.5 pr-4">Einstellungen → Ansicht → Wochennummern anzeigen</td>
                  <td className="py-2.5 text-green-500">✓ Standard</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Outlook (Desktop)</td>
                  <td className="py-2.5 pr-4">Datei → Optionen → Kalender → Wochennummern</td>
                  <td className="py-2.5 text-yellow-500">⚠ Einstellung prüfen</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Outlook 365 (Web)</td>
                  <td className="py-2.5 pr-4">Zahnrad → Kalender → Wochennummern anzeigen</td>
                  <td className="py-2.5 text-yellow-500">⚠ Einstellung prüfen</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Samsung Kalender</td>
                  <td className="py-2.5 pr-4">Menü → Einstellungen → Wochennummern anzeigen</td>
                  <td className="py-2.5 text-green-500">✓ Standard</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Thunderbird</td>
                  <td className="py-2.5 pr-4">Einstellungen → Kalender → Wochennummern in Monatsansicht</td>
                  <td className="py-2.5 text-green-500">✓ Standard</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-3">
            ⚠ = Outlook nutzt je nach Regioneinstellung das US-System (Woche beginnt
            am Sonntag). Stelle unter „Erste Woche des Jahres" → „Erste 4-Tage-Woche"
            ein, um ISO&nbsp;8601 zu erhalten.
          </p>
        </section>

        {/* ── Kalender mit vs. ohne KW ───────────────────────────── */}
        <section id="kalender-mit-oder-ohne-kw" className="mb-10 fade-in">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender mit oder ohne Kalenderwochen – was ist besser?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Kalender mit Kalenderwochen</strong>{" "}
              lohnt sich besonders, wenn du beruflich mit Lieferfristen, Sprint-Zyklen
              oder Gehaltsabrechnungen arbeitest. In Deutschland, Österreich und der
              Schweiz sind KW-Angaben im Geschäftsverkehr üblich – Formulierungen
              wie „Lieferung KW&nbsp;15" oder „Fertigstellung bis KW&nbsp;22"
              setzen voraus, dass alle Beteiligten die gleiche Wochennummerierung nutzen.
            </p>
            <p>
              Ohne <strong className="text-text-primary">KW im Kalender</strong> müsstest
              du jedes Mal manuell zählen oder nachschlagen, in welche Woche ein
              bestimmtes Datum fällt. Das kostet Zeit und ist fehleranfällig – besonders
              bei Jahresübergängen, wenn KW&nbsp;1 bereits im Dezember des Vorjahres
              beginnen kann (wie {year}: KW&nbsp;1 startet am{" "}
              {formatDateDE(allWeeks[0].startDate)}).
            </p>
            <p>
              Unser <strong className="text-text-primary">Kalender mit KW</strong> zeigt
              dir alle {weeksInYear}&nbsp;Wochen des Jahres {year} auf einen
              Blick. Die aktuelle KW&nbsp;{currentKW.weekNumber} ist blau markiert,
              sodass du sofort erkennst, wo im Jahr du dich befindest. Für die genaue
              Zuordnung eines beliebigen Datums nutze den{" "}
              <a href="#kw-rechner-input" className="text-accent hover:underline">
                KW-Rechner
              </a>{" "}
              oben.
            </p>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="mb-12 fade-in">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-3 text-text-primary">
              Kalender {year} kostenlos herunterladen
            </h2>
            <p className="text-text-secondary text-sm mb-5 max-w-lg mx-auto">
              Lade dir den Kalender als PDF zum Ausdrucken herunter oder nutze die
              Excel-Vorlage, um Termine flexibel zu bearbeiten. Jahres-, Monats-
              oder Wochenkalender – du hast die Wahl.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#kalender-ausdrucken"
                className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                📄 PDF drucken
              </a>
              <a
                href="#kalender-excel"
                className="inline-flex items-center gap-2 bg-surface-secondary border border-border text-text-primary px-5 py-2.5 rounded-xl text-sm font-medium hover:border-accent/50 transition-colors"
              >
                📊 Excel-Vorlage
              </a>
              <a
                href={`/kalenderwochen/${prevYear}`}
                className="inline-flex items-center gap-2 bg-surface-secondary border border-border text-text-secondary px-5 py-2.5 rounded-xl text-sm font-medium hover:border-accent/50 transition-colors"
              >
                Kalender {prevYear}
              </a>
              <a
                href={`/kalenderwochen/${nextYear}`}
                className="inline-flex items-center gap-2 bg-surface-secondary border border-border text-text-secondary px-5 py-2.5 rounded-xl text-sm font-medium hover:border-accent/50 transition-colors"
              >
                Kalender {nextYear}
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section id="faq" className="mb-10 fade-in">
          <h2 className="text-2xl font-semibold mb-4">
            Häufig gestellte Fragen
          </h2>
          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
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
        </section>

        {/* ── Abschluss ──────────────────────────────────────────── */}
        <div className="text-text-secondary text-sm leading-relaxed mb-8 space-y-3">
          <p>
            Mit dem <strong className="text-text-primary">Kalender mit Wochen {year}</strong>{" "}
            musst du nichts mehr ausrechnen: Du siehst sofort die aktuelle KW mit
            Datumsspanne (Mo–So), bekommst die komplette ISO-8601-Tabelle{" "}
            <strong className="text-text-primary">KW&nbsp;1–{weeksInYear}</strong>{" "}
            und kannst dir den Kalender {year} direkt als PDF/Excel zum Ausdrucken sichern.
          </p>
          <p>
            Lade dir jetzt die passende Druckansicht herunter und schau dir als
            Nächstes die{" "}
            <a href={`/kalenderwochen/${prevYear}`} className="text-accent hover:underline">
              Kalenderwochen {prevYear}
            </a>{" "}
            oder{" "}
            <a href={`/kalenderwochen/${nextYear}`} className="text-accent hover:underline">
              Kalenderwochen {nextYear}
            </a>{" "}
            sowie{" "}
            <a href={`/feiertage/${year}`} className="text-accent hover:underline">
              Feiertage & Brückentage {year}
            </a>{" "}
            an, um deine Planung rund zu machen.
          </p>
        </div>

        {/* ── Author Byline ─────────────────────────── */}
        <AuthorByline date={new Date()} />

        {/* ── Footer-Links ───────────────────────────────────────── */}
        <div className="pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {year}
          </a>
          <a href="/kalenderwochen-uebersicht" className="text-accent hover:underline">
            KW-Übersicht →
          </a>
          <a href={`/feiertage/${year}`} className="text-accent hover:underline">
            Feiertage {year}
          </a>
          <a href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche →
          </a>
        </div>
      </section>
    </>
  );
}
