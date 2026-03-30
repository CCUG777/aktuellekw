import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWTable from "@/components/KWTable";
import AuthorByline from "@/components/AuthorByline";

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

const titleMap: Record<number, string> = {
  2025: `Kalenderwochen 2025 – Rückblick und Tabellen-Referenz`,
  2026: `Kalenderwochen 2026 – Die Übersicht zum 53-Wochen-Jahr`,
  2027: `Kalenderwochen 2027 – Termine und Vorab-Planung`,
};

const descMap: Record<number, string> = {
  2025: `Kalenderwochen 2025: Alle 52 KW mit Start- & Enddatum. Rückblick auf das Gemeinjahr 2025 – ideal für Buchhaltung, Archivierung & Projektdokumentation nach ISO 8601.`,
  2026: `Kalenderwochen 2026: Alle 53 KW mit Start- & Enddatum im Überblick. 2026 ist ein langes Jahr mit KW 53 – Brückentage, Urlaubsplanung & ISO 8601.`,
  2027: `Kalenderwochen 2027: Alle 52 KW auf einen Blick. KW 1 beginnt erst am 4. Januar – Brückentage, Budgetierung & Vorab-Planung nach ISO 8601.`,
};

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
  const currentYear = getCurrentKW().year;
  const isCurrentYear = year === currentYear;
  const title = titleMap[year] ?? `Kalenderwochen ${year} – Alle ${weeksInYear} KW im Überblick`;
  const description = descMap[year] ?? `Alle Kalenderwochen ${year} auf einen Blick: KW 1 bis KW ${weeksInYear} mit Start- und Enddatum. Jahreskalender ${year} nach ISO 8601.`;
  return {
    title,
    description,
    // Phase 1.3: Nur aktuelles Jahr im Index halten
    ...(!isCurrentYear && {
      robots: { index: false, follow: true },
    }),
    alternates: {
      canonical: isCurrentYear
        ? `https://aktuellekw.de/kalenderwochen/${year}`
        : `https://aktuellekw.de/kalenderwochen/${currentYear}`,
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

  /* ── Year-specific FAQ data ──────────────────────────────── */
  const yearFaqs = [
    {
      question: `Wie viele Kalenderwochen hat ${year}?`,
      answer: weeksInYear === 53
        ? `Das Jahr ${year} hat 53 Kalenderwochen. Der 1. Januar ${year} fällt auf einen Donnerstag, weshalb nach ISO 8601 (§ 2.2.10) eine zusätzliche KW 53 entsteht. KW 53 läuft vom ${formatDateDE(allWeeks[allWeeks.length - 1].startDate)} bis zum ${formatDateDE(allWeeks[allWeeks.length - 1].endDate)}.`
        : `Das Jahr ${year} hat ${weeksInYear} Kalenderwochen (KW 1 bis KW ${weeksInYear}) nach ISO 8601. Es ist kein langes Jahr, da der 1. Januar ${year} nicht auf einen Donnerstag fällt.`,
    },
    {
      question: `Wann beginnt KW 1 ${year}?`,
      answer: `KW 1 ${year} beginnt am Montag, dem ${formatDateDE(allWeeks[0].startDate)}, und endet am Sonntag, dem ${formatDateDE(allWeeks[0].endDate)}. Nach ISO 8601 (§ 2.2.10) ist KW 1 immer die Woche, die den ersten Donnerstag des Jahres enthält.`,
    },
    {
      question: `Wann endet die letzte KW ${year}?`,
      answer: `Die letzte Kalenderwoche ${year} ist KW ${weeksInYear}. Sie endet am Sonntag, dem ${formatDateDE(allWeeks[allWeeks.length - 1].endDate)}. ${weeksInYear === 53 ? `Da ${year} ein 53-Wochen-Jahr ist, reicht KW 53 bis in den Januar ${year + 1}.` : `Die erste Woche des Folgejahres ${year + 1} beginnt am darauffolgenden Montag.`}`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://aktuellekw.de/kalenderwochen/${year}#breadcrumb`,
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
        "@type": "Dataset",
        "@id": `https://aktuellekw.de/kalenderwochen/${year}#dataset`,
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        datePublished: `${year}-01-01`,
        dateModified: year === currentKW.year ? new Date().toISOString().split("T")[0] : `${year}-01-01`,
        name: `Kalenderwochen ${year}`,
        description: `Alle ${weeksInYear} Kalenderwochen des Jahres ${year} nach ISO 8601 mit Start- und Enddatum.`,
        url: `https://aktuellekw.de/kalenderwochen/${year}`,
        inLanguage: "de-DE",
        temporalCoverage: `${allWeeks[0].startDate.toISOString().split("T")[0]}/${allWeeks[allWeeks.length - 1].endDate.toISOString().split("T")[0]}`,
        creator: {
          "@type": "Organization",
          "@id": "https://aktuellekw.de/#organization",
          name: "aktuellekw.de",
          url: "https://aktuellekw.de",
        },
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
    ],
  };

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
              {titleMap[year] ?? `Kalenderwochen ${year}`}
            </h1>
            {isCurrentYear && (
              <span className="text-xs bg-accent text-white px-3 py-1 rounded-full font-semibold uppercase tracking-wide self-center">
                Aktuelles Jahr
              </span>
            )}
          </div>

          {/* ── Einleitung (SEO-optimiert, ~100 Wörter) ─────────── */}
          <div className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl space-y-3">
            {year === 2025 ? (
              /* ── 2025: Rückblick & Archiv ───────────────────────── */
              <>
                <p>
                  Das Jahr 2025 war ein klassisches Gemeinjahr mit insgesamt{" "}
                  <strong className="text-text-primary">52&nbsp;Kalenderwochen</strong>.
                  Für Buchhaltung, Archivierung oder die Nachbereitung von Projekten
                  finden Sie hier die vollständige Übersicht aller KW-Termine
                  des Jahres 2025.
                </p>
              </>
            ) : year === 2026 ? (
              /* ── 2026: 53-Wochen-Jahr ─────────────────────────── */
              <>
                <p>
                  Sie suchen die{" "}
                  <a href="/" className="text-accent hover:underline">aktuelle Kalenderwoche</a>{" "}
                  oder planen Ihre Termine für {year}? Das Jahr {year} hält
                  eine Besonderheit bereit: Es ist ein Jahr mit{" "}
                  <strong className="text-text-primary">53&nbsp;Kalenderwochen</strong>.
                  Da der 31.&nbsp;Dezember&nbsp;{year} auf einen Donnerstag fällt,
                  wird die letzte Woche des Jahres nach der ISO-Norm&nbsp;8601
                  (§&nbsp;2.2.10) als volle KW&nbsp;53 gezählt.
                </p>
                <p>
                  Dies hat direkten Einfluss auf Ihre{" "}
                  <strong className="text-text-primary">Entgeltabrechnung</strong>,{" "}
                  <strong className="text-text-primary">Schichtpläne</strong> und die{" "}
                  <strong className="text-text-primary">Urlaubsplanung</strong>.
                  {isCurrentYear &&
                    ` Die aktuelle KW\u00a0${currentKW.weekNumber} ist in der Tabelle blau hervorgehoben.`}
                </p>
              </>
            ) : year === 2027 ? (
              /* ── 2027: Vorab-Planung, verspäteter KW-1-Start ── */
              <>
                <p>
                  Wer früh plant, entspannt früher. Das Jahr 2027 kehrt nach dem
                  „langen" Vorjahr wieder zum Standard von{" "}
                  <strong className="text-text-primary">52&nbsp;Kalenderwochen</strong>{" "}
                  zurück. Eine Besonderheit für Planer: Da der Neujahrstag 2027
                  ein Freitag ist, gehört er offiziell noch zur{" "}
                  <a href="/kw/53-2026" className="text-accent hover:underline">
                    KW&nbsp;53 des Vorjahres 2026
                  </a>.
                </p>
                <p>
                  KW&nbsp;1 beginnt erst am{" "}
                  <strong className="text-text-primary">Montag, dem {formatDateDE(allWeeks[0].startDate)}</strong>{" "}
                  – nutzen Sie diese Übersicht für Ihre{" "}
                  <strong className="text-text-primary">Budgetierung</strong> und{" "}
                  <strong className="text-text-primary">Vorab-Planung</strong>.
                  {isCurrentYear &&
                    ` Die aktuelle KW\u00a0${currentKW.weekNumber} ist in der Tabelle blau hervorgehoben.`}
                </p>
              </>
            ) : (
              /* ── Generisch ────────────────────────────────────── */
              <p>
                Alle {weeksInYear} Kalenderwochen {year} mit Start- und Enddatum
                (Montag bis Sonntag) nach ISO&nbsp;8601.
                {isCurrentYear &&
                  ` Die aktuelle KW\u00a0${currentKW.weekNumber} ist hervorgehoben.`}
                {weeksInYear === 53 &&
                  ` ${year} ist ein langes Jahr mit 53\u00a0Kalenderwochen.`}
              </p>
            )}
          </div>
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

        {/* ── H2: 2025 – Struktur des Kalenderjahres ────────── */}
        {year === 2025 && (
          <section className="mb-12 fade-in-delay">
            <h2 id="struktur-kalenderjahr-2025" className="text-2xl font-semibold mb-4">
              Struktur des Kalenderjahres 2025
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                Im Gegensatz zum Folgejahr 2026 startete 2025 direkt am
                Neujahrstag (Mittwoch) mitten in der ersten Woche. Die
                konkreten Eckdaten:
              </p>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Start von KW&nbsp;1:</strong>{" "}
                    Montag, 30.12.2024 – die erste Woche begann bereits im
                    Dezember des Vorjahres.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Ende von KW&nbsp;52:</strong>{" "}
                    Sonntag, 28.12.2025 – die letzten drei Tage des Jahres
                    (29.–31.&nbsp;Dezember) gehörten bereits zur{" "}
                    <a href="/kw/1-2026" className="text-accent hover:underline">
                      KW&nbsp;1 des Jahres 2026
                    </a>.
                  </span>
                </li>
              </ul>
              <p>
                Dies bedeutete, dass die Tage nach dem 28.&nbsp;Dezember
                bereits zur ersten Woche des Folgejahres zählten. Diese
                „kurzen" Jahresenden sind typisch für 52-Wochen-Jahre und
                erfordern in der Projektplanung oft ein Umdenken bei Fristen
                zum Jahreswechsel.
              </p>
              <p>
                <strong className="text-text-primary">Praxis-Tipp für die Archivierung:</strong>{" "}
                Wenn Sie Projekte oder Abrechnungen aus 2025 nachträglich
                dokumentieren, achten Sie darauf, dass KW&nbsp;1 bereits am
                30.12.2024 begann und KW&nbsp;52 am 28.12.2025 endete –
                Dezember-Buchungen können also über den Jahreswechsel
                verteilt sein.
              </p>
            </div>
          </section>
        )}

        {/* ── H2: 2027 – Der verspätete Start ──────────────── */}
        {year === 2027 && (
          <section className="mb-12 fade-in-delay">
            <h2 id="verspaeteter-start-kw1" className="text-2xl font-semibold mb-4">
              Der verspätete Start: Wann beginnt die KW&nbsp;1 2027?
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                Die erste Kalenderwoche des Jahres 2027 lässt auf sich warten.
                Sie beginnt erst am{" "}
                <strong className="text-text-primary">
                  Montag, dem {formatDateDE(allWeeks[0].startDate)}
                </strong>.
                Für Business-Termine bedeutet das: Die erste volle Arbeitswoche
                im neuen Jahr startet im Vergleich zu anderen Jahren sehr spät.
              </p>
              <p>
                Achten Sie bei der{" "}
                <strong className="text-text-primary">Budgetierung</strong> und dem{" "}
                <strong className="text-text-primary">Projektstart</strong> darauf,
                dass die ersten drei Januartage (1.–3.&nbsp;Januar) kalendarisch
                noch dem „alten" Wochenzyklus angehören – sie zählen zur{" "}
                <a href="/kw/53-2026" className="text-accent hover:underline">
                  KW&nbsp;53 des Jahres 2026
                </a>{" "}
                (ISO&nbsp;8601, §&nbsp;2.2.10).
              </p>
              <p>
                <strong className="text-text-primary">Praxis-Tipp:</strong>{" "}
                Stimmen Sie interne Deadlines und Berichtszeiträume frühzeitig
                ab, damit keine Buchungen oder Projektmeilensteine im
                „Niemandsland" zwischen den Kalenderjahren verloren gehen.
              </p>
            </div>
          </section>
        )}

        {/* ── H2: Warum KW 53? (nur bei 53-Wochen-Jahren) ──── */}
        {weeksInYear === 53 && (
          <section className="mb-12 fade-in-delay">
            <h2 id="warum-kw-53" className="text-2xl font-semibold mb-4">
              Warum hat {year} eine KW&nbsp;53?
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                Die Zählung der Kalenderwochen folgt klaren Regeln nach{" "}
                <strong className="text-text-primary">ISO&nbsp;8601</strong> (§&nbsp;2.2.10).
                Die erste Woche des Jahres (KW&nbsp;1) ist die Woche, die mindestens
                vier Tage des neuen Jahres enthält. Da {year} ein Gemeinjahr ist,
                das an einem Donnerstag beginnt und endet, rutschen genau vier Tage
                der letzten Woche in das neue Jahr bzw. schließen das alte Jahr ab.
              </p>
              <p>
                Das Ergebnis ist die seltene Zusatzwoche:{" "}
                <strong className="text-text-primary">KW&nbsp;53</strong> dauert vom{" "}
                <strong className="text-text-primary">
                  {formatDateDE(allWeeks[allWeeks.length - 1].startDate)}
                </strong>{" "}
                bis zum{" "}
                <strong className="text-text-primary">
                  {formatDateDE(allWeeks[allWeeks.length - 1].endDate)}
                </strong>.
                In einem 400-Jahres-Zyklus gibt es genau 71 solche langen Jahre –
                das sind 17,75&nbsp;% aller Jahre (Quelle: ISO&nbsp;8601 Annex&nbsp;B).
              </p>
              <p>
                <strong className="text-text-primary">Gut zu wissen:</strong>{" "}
                Für die Entgeltabrechnung bedeutet ein 53-Wochen-Jahr, dass ein
                zusätzlicher Abrechnungszeitraum entsteht. Arbeitgeber sollten
                Schichtpläne und Wochenstunden-Kontingente frühzeitig anpassen.
              </p>
            </div>
          </section>
        )}

        {/* ── H2: Urlaubsplanung & Brückentage (year-spezifisch) */}
        <section className="mb-12 fade-in-delay">
          <h2 id="urlaubsplanung-brueckentage" className="text-2xl font-semibold mb-4">
            {year === 2025
              ? `Feiertage & Brückentage 2025 im Rückblick`
              : year === 2027
                ? `Vorschau auf die Brückentage ${year}`
                : `Urlaubsplanung ${year}: Brückentage optimal nutzen`}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            {year === 2025
              ? "Ein Blick zurück auf die Feiertagsverteilung 2025 – relevant für Zeiterfassung, Stundennachweise und Projektabrechnungen:"
              : year === 2027
                ? "Planen Sie schon jetzt die freien Tage 2027 – einige Feiertage fallen günstig, andere weniger:"
                : `Nutzen Sie die Verteilung der Kalenderwochen ${year} für mehr Freizeit. Mit geschickter Kombination aus Feiertagen und Urlaubstagen holen Sie das Maximum heraus:`}
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
            {year === 2025 ? (
              /* ── Brückentage 2025 (Rückblick) ────────────────── */
              <>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Neujahr (KW&nbsp;1):</strong>{" "}
                    Der 1.&nbsp;Januar 2025 fiel auf einen Mittwoch – kein
                    klassischer Brückentag, aber mit zwei Urlaubstagen (Do + Fr)
                    war eine ganze freie Woche möglich.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Ostern (KW&nbsp;16/17):</strong>{" "}
                    Karfreitag am 18.&nbsp;April, Ostermontag am 21.&nbsp;April.
                    Vier Urlaubstage ergaben zehn zusammenhängende freie Tage.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Tag der Arbeit (KW&nbsp;18):</strong>{" "}
                    Der 1.&nbsp;Mai fiel 2025 auf einen{" "}
                    <strong className="text-text-primary">Donnerstag</strong>{" "}
                    – ein idealer Brückentag am Freitag bescherte ein
                    langes Wochenende.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Christi Himmelfahrt (KW&nbsp;22):</strong>{" "}
                    Am 29.&nbsp;Mai (Donnerstag) mit dem klassischen
                    Brückentag-Freitag.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Tag der Deutschen Einheit (KW&nbsp;40):</strong>{" "}
                    Der 3.&nbsp;Oktober fiel 2025 auf einen Freitag – ein
                    automatisches langes Wochenende ohne Urlaubstag.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Weihnachten (KW&nbsp;52):</strong>{" "}
                    Der 25.&nbsp;Dezember war ein Donnerstag, der
                    26.&nbsp;Dezember ein Freitag – perfekt für einen
                    langen Jahresausklang.
                  </span>
                </li>
              </>
            ) : year === 2027 ? (
              /* ── Brückentage 2027 ──────────────────────────── */
              <>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Neujahr (KW&nbsp;53/2026):</strong>{" "}
                    Der 1.&nbsp;Januar 2027 gehört kalendarisch noch zur KW&nbsp;53
                    des Vorjahres. Das erste Arbeitswochenende fällt damit spät – planen
                    Sie einen sanften Jahresstart ein.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Ostern (KW&nbsp;13/14):</strong>{" "}
                    Karfreitag fällt auf den 26.&nbsp;März, Ostermontag auf den
                    29.&nbsp;März. Mit vier Urlaubstagen (Mo–Do vor Karfreitag)
                    sichern Sie sich zehn freie Tage am Stück.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Tag der Arbeit (KW&nbsp;18):</strong>{" "}
                    Der 1.&nbsp;Mai fällt 2027 auf einen <strong className="text-text-primary">Samstag</strong>{" "}
                    – hier gibt es leider keinen Bonus-Brückentag.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Christi Himmelfahrt (KW&nbsp;20):</strong>{" "}
                    Fällt auf Donnerstag, den 6.&nbsp;Mai – der Freitag danach
                    ist der klassische Brückentag für ein langes Wochenende.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Pfingsten (KW&nbsp;21):</strong>{" "}
                    Liegt 2027 recht früh im Mai (Pfingstmontag: 17.&nbsp;Mai) –
                    ideal für Städtetrips oder einen frühen Sommerurlaub.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Weihnachten (KW&nbsp;52):</strong>{" "}
                    Der 25.&nbsp;Dezember 2027 ist ein Samstag – mit
                    geschickter Planung zwischen den Jahren holen Sie
                    trotzdem maximale Erholung heraus.
                  </span>
                </li>
              </>
            ) : (
              /* ── Brückentage 2026 / generisch ─────────────── */
              <>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Ostern (KW&nbsp;14/15):</strong>{" "}
                    Mit geschickter Planung in diesen zwei Wochen verdoppeln Sie
                    Ihre freien Tage. Karfreitag und Ostermontag sind bundesweit
                    Feiertage – ideal für einen Kurzurlaub.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Christi Himmelfahrt (KW&nbsp;20):</strong>{" "}
                    Der Klassiker für ein langes Wochenende. Fällt immer auf einen
                    Donnerstag – ein Brückentag am Freitag ergibt vier freie Tage.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">Pfingsten (KW&nbsp;22):</strong>{" "}
                    Ideal für einen frühen Sommerurlaub. Pfingstmontag plus
                    anschließende Brückentage ergeben bis zu neun freie Tage
                    mit nur vier Urlaubstagen.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>
                    <strong className="text-text-primary">
                      Weihnachten (KW&nbsp;{weeksInYear === 53 ? "52/53" : "52"}):
                    </strong>{" "}
                    {weeksInYear === 53
                      ? "Durch die KW\u00a053 haben Sie zwischen den Jahren eine besondere Konstellation, die sich perfekt für den Jahresausklang eignet."
                      : "Die Weihnachtswoche eignet sich ideal, um mit wenigen Urlaubstagen eine lange Auszeit zu genießen."}
                  </span>
                </li>
              </>
            )}
          </ul>
          <p className="text-text-secondary text-xs mt-4">
            Tipp: Eine vollständige Übersicht aller Feiertage finden Sie auf unserer{" "}
            <a href={`/feiertage/${year}`} className="text-accent hover:underline">
              Feiertage-Seite {year}
            </a>.
          </p>
        </section>

        {/* ── H2: Jahresvergleich ────────────────────────────── */}
        <section className="mb-12 fade-in-delay">
          <h2 id="jahresvergleich" className="text-2xl font-semibold mb-4">
            Kalenderwochen {year} im Jahresvergleich
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">Jahr</th>
                  <th className="text-left py-2 pr-4">Anzahl KW</th>
                  <th className="text-left py-2 pr-4">KW 1 beginnt</th>
                  <th className="text-left py-2">Letzter Tag</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[prevYear, year, nextYear].map((y) => {
                  const weeks = getAllKWsForYear(y);
                  const wiy = getWeeksInYear(y);
                  const isCurr = y === year;
                  return (
                    <tr
                      key={y}
                      className={`border-b border-border/50 ${isCurr ? "bg-accent/5" : ""}`}
                    >
                      <td className="py-2.5 pr-4">
                        {isCurr ? (
                          <strong className="text-text-primary">{y}</strong>
                        ) : (
                          <a
                            href={`/kalenderwochen/${y}`}
                            className="text-accent hover:underline"
                          >
                            {y}
                          </a>
                        )}
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={isCurr ? "text-text-primary font-semibold" : ""}>
                          {wiy} KW
                          {wiy === 53 && (
                            <span className="text-accent text-xs ml-1">(lang)</span>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4">{formatDateDE(weeks[0].startDate)}</td>
                      <td className="py-2.5">{formatDateDE(weeks[weeks.length - 1].endDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── H2: FAQ (3 Fragen, jahrspezifisch) ─────────────── */}
        <section className="mb-10 fade-in-delay-2">
          <h2 id="faq-kalenderwochen" className="text-2xl font-semibold mb-4">
            Häufige Fragen zu Kalenderwochen {year}
          </h2>
          <div className="space-y-2.5">
            {yearFaqs.map((faq, i) => (
              <details
                key={i}
                open={i < 2 ? true : undefined}
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

        {/* ── Author Byline ─────────────────────────── */}
        <AuthorByline date={year === currentKW.year ? new Date() : new Date(`${year}-01-01`)} />

        {/* ── Footer links ─────────────────────────────────────── */}
        <div className="border-t border-border pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm fade-in-delay-2">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Übersicht aktuelles Jahr
          </a>
          <a href={`/feiertage/${year}`} className="text-accent hover:underline">
            Feiertage {year}
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
 * [x] Verlinkung KWTable-Zellen auf /kw/[n]-[year]
 * [ ] TODO: Kalender-Download-Link (Cluster 6, geplant)
 * [ ] TODO: hreflang AT/CH wenn mehrsprachig ausgebaut
 */
