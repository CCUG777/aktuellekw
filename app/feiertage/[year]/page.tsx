import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_YEARS } from "@/lib/constants";
import {
  getFeiertageFuerJahr,
  getHolidaysPerState,
  getBrueckentage,
  getNextFeiertag,
  getEasterDate,
  addDays,
  getISOWeekNumber,
  formatDateDE,
  getDayNameDE,
  BUNDESLAND_NAMES,
  FEIERTAGE_FAQS,
} from "@/lib/feiertage";
import AuthorByline from "@/components/AuthorByline";

export const revalidate = 3600;

/* ── Valid years ───────────────────────────────────────────────── */
const FEIERTAGE_YEARS = CONTENT_YEARS;

/* ── Weekday helpers ──────────────────────────────────────────── */
const WOCHENTAG_KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

/* ── State-specific additional holidays for detail table ──────── */
const STATE_EXTRAS: Record<
  string,
  { extras: string[]; hinweis?: string }
> = {
  BW: { extras: ["Heilige Drei Könige", "Fronleichnam", "Allerheiligen"] },
  BY: {
    extras: [
      "Heilige Drei Könige",
      "Fronleichnam",
      "Mariä Himmelfahrt",
      "Allerheiligen",
      "Buß- und Bettag",
    ],
    hinweis: "Mariä Himmelfahrt teils kommunal; Buß- und Bettag nur BY/SN",
  },
  BE: { extras: ["Internationaler Frauentag"] },
  BB: { extras: ["Reformationstag"] },
  HB: { extras: ["Reformationstag"] },
  HH: { extras: ["Reformationstag"] },
  HE: { extras: ["Fronleichnam"] },
  MV: { extras: ["Internationaler Frauentag", "Reformationstag"] },
  NI: { extras: ["Reformationstag"] },
  NW: { extras: ["Fronleichnam", "Allerheiligen"] },
  RP: { extras: ["Fronleichnam", "Allerheiligen"] },
  SL: { extras: ["Fronleichnam", "Mariä Himmelfahrt", "Allerheiligen"] },
  SN: { extras: ["Reformationstag", "Buß- und Bettag"] },
  ST: { extras: ["Heilige Drei Könige", "Reformationstag"] },
  SH: { extras: ["Reformationstag"] },
  TH: { extras: ["Weltkindertag", "Reformationstag"] },
};

/* ── Static Params ─────────────────────────────────────────────── */
export function generateStaticParams() {
  return FEIERTAGE_YEARS.map((y) => ({ year: String(y) }));
}

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (isNaN(year) || year < 2020 || year > 2100) {
    return { title: "Nicht gefunden" };
  }

  const holidays = getFeiertageFuerJahr(year);
  const nationwide = holidays.filter((h) => h.isNationwide).length;
  const regional = holidays.filter((h) => !h.isNationwide).length;

  const title = `Feiertage ${year} Deutschland – Alle ${nationwide + regional} Feiertage`;
  const description = `Gesetzliche Feiertage ${year} in Deutschland: ${nationwide} bundesweite + ${regional} regionale Feiertage mit Datum, Wochentag & KW. Brückentage ${year} clever planen – inkl. Bundesland-Übersicht.`;
  const url = `https://aktuellekw.de/feiertage/${year}`;

  const currentYear = new Date().getFullYear();
  const isCurrentYear = year === currentYear;

  return {
    title,
    description,
    // Phase 1.3: Nur aktuelles Jahr im Index halten
    ...(!isCurrentYear && {
      robots: { index: false, follow: true },
    }),
    alternates: {
      canonical: isCurrentYear ? url : `https://aktuellekw.de/feiertage/${currentYear}`,
    },
    openGraph: {
      title,
      description,
      url,
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

/* ── Helper: year-specific dynamic FAQs ─────────────────────────── */
function getYearFAQs(
  year: number,
  nationwideCount: number,
  regionalCount: number,
  easter: Date,
  weekendNationwide: number,
  workdayNationwide: number
) {
  const fronleichnam = addDays(easter, 60);
  const himmelfahrt = addDays(easter, 39);
  const pfingstsonntag = addDays(easter, 49);
  const pfingstmontag = addDays(easter, 50);
  const karfreitag = addDays(easter, -2);
  const ostermontag = addDays(easter, 1);

  return [
    {
      question: `Wie viele gesetzliche Feiertage gibt es ${year} in Deutschland?`,
      answer: `Bundesweit gibt es ${year} in Deutschland ${nationwideCount} gesetzliche Feiertage, die in allen Bundesländern gelten. Zusätzlich kommen je nach Bundesland weitere Feiertage dazu (z.\u00a0B. Fronleichnam oder Reformationstag). Insgesamt gibt es ${nationwideCount + regionalCount} verschiedene gesetzliche Feiertage – wie viele davon für Sie gelten, hängt von Ihrem Bundesland ab.`,
    },
    {
      question: `Welche Feiertage ${year} sind bundesweit (in allen Bundesländern)?`,
      answer: `Bundesweite Feiertage ${year}: Neujahr (01.01.), Karfreitag (${formatDateDE(karfreitag)}), Ostermontag (${formatDateDE(ostermontag)}), Tag der Arbeit (01.05.), Christi Himmelfahrt (${formatDateDE(himmelfahrt)}), Pfingstmontag (${formatDateDE(pfingstmontag)}), Tag der Deutschen Einheit (03.10.), 1.\u00a0Weihnachtstag (25.12.) und 2.\u00a0Weihnachtstag (26.12.).`,
    },
    {
      question: `Auf welche Tage fallen die Feiertage ${year}?`,
      answer: `${year} fallen ${workdayNationwide} der ${nationwideCount} bundesweiten Feiertage auf Werktage (Montag bis Freitag) und ${weekendNationwide} auf ein Wochenende (Samstag/Sonntag). Feiertage am Donnerstag oder Dienstag bieten besonders gute Brückentage-Chancen.`,
    },
    {
      question: `Wann ist Ostern ${year} in Deutschland?`,
      answer: `Ostersonntag ist ${year} am ${formatDateDE(easter)}. Die gesetzlichen Feiertage rund um Ostern ${year} sind Karfreitag (${formatDateDE(karfreitag)}) und Ostermontag (${formatDateDE(ostermontag)}). Diese Termine gelten bundesweit.`,
    },
    {
      question: `Wann ist Christi Himmelfahrt ${year}?`,
      answer: `Christi Himmelfahrt ist ${year} am ${formatDateDE(himmelfahrt)} (${getDayNameDE(himmelfahrt)}). Der Feiertag gehört zu den bundesweiten gesetzlichen Feiertagen ${year} und gilt in allen Bundesländern. Er fällt immer auf einen Donnerstag – ideal für einen Brückentag am Freitag.`,
    },
    {
      question: `Wann ist Pfingsten ${year}?`,
      answer: `Pfingstsonntag ist ${year} am ${formatDateDE(pfingstsonntag)}, Pfingstmontag am ${formatDateDE(pfingstmontag)}. Gesetzlicher Feiertag ist Pfingstmontag, und der gilt bundesweit.`,
    },
    {
      question: `Wann ist Fronleichnam ${year} und wo ist es ein Feiertag?`,
      answer: `Fronleichnam ist ${year} am ${formatDateDE(fronleichnam)} (${getDayNameDE(fronleichnam)}). Gesetzlicher Feiertag ist Fronleichnam in Baden-Württemberg, Bayern, Hessen, Nordrhein-Westfalen, Rheinland-Pfalz und Saarland sowie in Teilen von Sachsen und Thüringen.`,
    },
    {
      question: `Fällt ein Feiertag ${year} auf ein Wochenende – gibt es dann einen Ersatz-Feiertag?`,
      answer: `Nein, in Deutschland gibt es in der Regel keinen Ersatz-Feiertag, wenn ein gesetzlicher Feiertag ${year} auf ein Wochenende fällt. Der Feiertag bleibt am Datum, auch wenn er auf Samstag oder Sonntag liegt. Ausnahmen ergeben sich nur durch landesrechtliche Sonderregelungen.`,
    },
    {
      question: `Wo ist Reformationstag ${year} ein gesetzlicher Feiertag?`,
      answer: `Reformationstag (31.10.${year}) ist ein gesetzlicher Feiertag in Brandenburg, Bremen, Hamburg, Mecklenburg-Vorpommern, Niedersachsen, Sachsen, Sachsen-Anhalt, Schleswig-Holstein und Thüringen.`,
    },
    {
      question: `Wo gilt Mariä Himmelfahrt ${year} als gesetzlicher Feiertag?`,
      answer: `Mariä Himmelfahrt am 15.08.${year} ist nur regional gesetzlicher Feiertag: im Saarland und in Bayern in Gemeinden mit überwiegend katholischer Bevölkerung. Ob Sie arbeitsfrei haben, hängt von Ihrem konkreten Wohnort ab.`,
    },
    {
      question: `Was ist der Buß- und Bettag ${year} und wo ist er arbeitsfrei?`,
      answer: `Der Buß- und Bettag ist ein evangelischer Gedenk- und Feiertag. Gesetzlich arbeitsfrei ist er nur in Sachsen. In anderen Bundesländern gelten teils besondere Regelungen (z.\u00a0B. für Schulen und Kitas).`,
    },
    {
      question: `Welche Feiertage ${year} gelten in Baden-Württemberg?`,
      answer: `In Baden-Württemberg gelten ${year} alle bundesweiten Feiertage plus: Heilige Drei Könige (06.01.), Fronleichnam (${formatDateDE(fronleichnam)}) und Allerheiligen (01.11.). Damit gehören die Feiertage ${year} in Baden-Württemberg zu den umfangreicheren.`,
    },
    {
      question: `Welche Feiertage ${year} gelten in NRW?`,
      answer: `In NRW gelten ${year} alle bundesweiten Feiertage plus: Fronleichnam (${formatDateDE(fronleichnam)}) und Allerheiligen (01.11.). Damit haben Sie in Nordrhein-Westfalen ${nationwideCount + 2} gesetzliche Feiertage ${year}.`,
    },
    {
      question: `Was ändert sich bei den Feiertagen ${year} gegenüber ${year - 1}?`,
      answer: `Die Anzahl der gesetzlichen Feiertage bleibt gleich, aber die Wochentage verschieben sich. Dadurch ändern sich die möglichen Brückentage und Ihre Urlaubsplanung. Prüfen Sie die Brückentage-Tabelle oben für die optimale Planung ${year}.`,
    },
  ];
}

/* ── Page Component ────────────────────────────────────────────── */
export default async function FeiertageYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (isNaN(year) || year < 2020 || year > 2100) notFound();

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const currentYear = todayUTC.getUTCFullYear();
  const isCurrentYear = year === currentYear;

  const holidays = getFeiertageFuerJahr(year);
  const nationwideHolidays = holidays.filter((h) => h.isNationwide);
  const nationwideCount = nationwideHolidays.length;
  const regionalCount = holidays.filter((h) => !h.isNationwide).length;
  const stateHolidayCounts = getHolidaysPerState(holidays);
  const brueckentage = getBrueckentage(year);
  const nextHoliday = getNextFeiertag();

  /* ── Weekday distribution ─────────────────────────────────── */
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // So Mo Di Mi Do Fr Sa
  nationwideHolidays.forEach((h) => {
    weekdayCounts[h.date.getUTCDay()]++;
  });
  const weekendNationwide = weekdayCounts[0] + weekdayCounts[6];
  const workdayNationwide = nationwideCount - weekendNationwide;

  /* ── Easter & movable holidays ─────────────────────────────── */
  const easter = getEasterDate(year);
  const movableHolidays = [
    { name: "Karfreitag", offset: -2, date: addDays(easter, -2), regional: false },
    { name: "Ostersonntag", offset: 0, date: easter, regional: false },
    { name: "Ostermontag", offset: +1, date: addDays(easter, 1), regional: false },
    { name: "Christi Himmelfahrt", offset: +39, date: addDays(easter, 39), regional: false },
    { name: "Pfingstsonntag", offset: +49, date: addDays(easter, 49), regional: false },
    { name: "Pfingstmontag", offset: +50, date: addDays(easter, 50), regional: false },
    { name: "Fronleichnam", offset: +60, date: addDays(easter, 60), regional: true },
  ];

  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = FEIERTAGE_YEARS.includes(prevYear);
  const hasNext = FEIERTAGE_YEARS.includes(nextYear);

  /* ── Year-specific FAQs ───────────────────────────────────── */
  const yearFAQs = getYearFAQs(
    year,
    nationwideCount,
    regionalCount,
    easter,
    weekendNationwide,
    workdayNationwide
  );
  // Generic FAQs only on current year to avoid duplicate content across year pages
  const allFAQs = isCurrentYear
    ? [...yearFAQs, ...FEIERTAGE_FAQS]
    : yearFAQs;

  /* ── Holiday date lookups for state sections ─────────────── */
  const findHoliday = (name: string) =>
    holidays.find((h) => h.name === name);
  const dreiKoenige = findHoliday("Heilige Drei Könige");
  const fronleichnam = findHoliday("Fronleichnam");
  const allerheiligen = findHoliday("Allerheiligen");
  const frauentag = findHoliday("Internationaler Frauentag");
  const mariaeHimmelfahrt = findHoliday("Mariä Himmelfahrt");

  /* ── JSON-LD ───────────────────────────────────────────────── */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `https://aktuellekw.de/feiertage/${year}#breadcrumb`,
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
          name: "Feiertage",
          item: "https://aktuellekw.de/feiertage",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Feiertage ${year}`,
          item: `https://aktuellekw.de/feiertage/${year}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `https://aktuellekw.de/feiertage/${year}#dataset`,
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: `${year}-01-01`,
      dateModified: year === new Date().getFullYear() ? new Date().toISOString().split("T")[0] : `${year}-01-01`,
      name: `Gesetzliche Feiertage ${year} in Deutschland`,
      description: `Alle ${nationwideCount + regionalCount} gesetzlichen Feiertage in Deutschland f\u00fcr das Jahr ${year} mit Datum, Wochentag und Kalenderwoche.`,
      temporalCoverage: `${year}-01-01/${year}-12-31`,
      url: `https://aktuellekw.de/feiertage/${year}`,
      inLanguage: "de-DE",
      creator: { "@id": "https://aktuellekw.de/#organization" },
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `https://aktuellekw.de/feiertage/${year}#faqpage`,
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      mainEntity: allFAQs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            Startseite
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <Link href="/feiertage" className="hover:text-accent transition-colors">
            Feiertage
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Feiertage {year}</span>
        </nav>

        {/* ── Year Navigation ─────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          {hasPrev ? (
            <Link
              href={`/feiertage/${prevYear}`}
              className="text-sm text-accent hover:underline"
            >
              &larr; {prevYear}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/feiertage/${nextYear}`}
              className="text-sm text-accent hover:underline"
            >
              {nextYear} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── H1 + Intro ──────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Feiertage {year} in Deutschland
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Feiertage {year}: Wann haben Sie frei – inklusive Datum und Wochentag?
            Hier finden Sie den Schnell-&Uuml;berblick mit allen{" "}
            <strong className="text-text-primary">
              {nationwideCount + regionalCount} gesetzlichen Feiertagen {year}
            </strong>{" "}
            in Deutschland auf einen Blick: {nationwideCount} bundesweite und{" "}
            {regionalCount} regionale Feiertage mit Datum, Wochentag und{" "}
            <strong className="text-text-primary">Kalenderwoche</strong>.
          </p>
          {isCurrentYear && (
          <p>
            Danach sehen Sie alle gesetzlichen Feiertage {year} nach Bundesland
            in einer einzigen, kompakten &Uuml;bersicht &ndash; ideal, wenn Sie
            zwischen Wohnort, Job und Familie planen. Dazu gibt es einen{" "}
            <strong className="text-text-primary">Br&uuml;ckentage-Block</strong>{" "}
            mit den besten Urlaubs-Kombis f&uuml;r extra lange Wochenenden
            {brueckentage.length > 0 && (
              <> &ndash; {brueckentage.length} Br&uuml;ckentage warten auf Sie</>
            )}.
          </p>
          )}

          {/* Schnell-Info box – nur im aktuellen Jahr */}
          {isCurrentYear && (
            <div className="next-holiday-box bg-surface-secondary border border-border rounded-xl p-4 text-sm">
              <strong className="text-text-primary">
                N&auml;chster Feiertag:
              </strong>{" "}
              <span className="text-accent font-semibold">
                {nextHoliday.feiertag.name}
              </span>{" "}
              am {getDayNameDE(nextHoliday.feiertag.date)},{" "}
              {formatDateDE(nextHoliday.feiertag.date)} (KW&nbsp;
              {getISOWeekNumber(nextHoliday.feiertag.date)})
              {nextHoliday.daysUntil === 0
                ? " \u2013 heute!"
                : nextHoliday.daysUntil === 1
                ? " \u2013 morgen!"
                : ` \u2013 in ${nextHoliday.daysUntil} Tagen`}
            </div>
          )}
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Bundesweit", value: String(nationwideCount) },
            { label: "Regional", value: String(regionalCount) },
            { label: "Gesamt", value: String(nationwideCount + regionalCount) },
            { label: "Br\u00fcckentage", value: String(brueckentage.length) },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-secondary border border-border rounded-xl px-4 py-3 text-center"
            >
              <div className="text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-text-secondary mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 1: Bundesweite Feiertage-Tabelle
            ═════════════════════════════════════════════════════════ */}
        <div>
          <h2 className="text-2xl font-semibold mb-2" id="feiertage-in-deutschland-bundesweit-termine-und-wochentage">
            Feiertage {year} in Deutschland (bundesweit): Termine und Wochentage
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            <strong className="text-text-primary">Feste Feiertage</strong> haben
            jedes Jahr dasselbe Datum,{" "}
            <strong className="text-text-primary">bewegliche Feiertage</strong>{" "}
            richten sich nach Ostern. In dieser Tabelle finden Sie alle{" "}
            {nationwideCount + regionalCount} gesetzlichen Feiertage {year} mit
            Datum, Wochentag, Kalenderwoche und G&uuml;ltigkeitsbereich.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Feiertag
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Datum
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Wochentag
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    KW
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Bundesl&auml;nder
                  </th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h, i) => {
                  const isPast =
                    isCurrentYear && h.date.getTime() < todayUTC.getTime();
                  const isToday =
                    isCurrentYear && h.date.getTime() === todayUTC.getTime();

                  return (
                    <tr
                      key={i}
                      className={`border-b border-border last:border-b-0 ${
                        isToday
                          ? "bg-accent/10"
                          : isCurrentYear && !isPast
                          ? "bg-accent/5"
                          : isPast
                          ? "opacity-60"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                        {h.name}
                        {isToday && (
                          <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                            heute
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatDateDE(h.date)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {getDayNameDE(h.date)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        <Link
                          href={`/kw/${getISOWeekNumber(h.date)}-${year}`}
                          className="text-accent hover:underline"
                        >
                          KW&nbsp;{getISOWeekNumber(h.date)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-xs">
                        {h.isNationwide ? (
                          <span className="font-medium text-text-primary">
                            alle
                          </span>
                        ) : (
                          h.states.join(", ")
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            {nationwideCount} bundesweite + {regionalCount} regionale
            Feiertage = {nationwideCount + regionalCount} gesamt.{" "}
            F&uuml;r regionale Feiertage und eine komplette Jahres&uuml;bersicht nutzen
            Sie die{" "}
            <Link href="/feiertage" className="text-accent hover:underline">
              Feiertage-&Uuml;bersicht
            </Link>.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 2: Auf welche Tage fallen die Feiertage?
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="auf-welche-tage-fallen-die-feiertage">
            Auf welche Tage fallen die Feiertage {year}?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-4">
            <p>
              F&uuml;r Ihre Planung z&auml;hlt vor allem, welche Termine auf das Wochenende
              fallen. {year} liegen{" "}
              <strong className="text-text-primary">{workdayNationwide}</strong> der{" "}
              {nationwideCount} bundesweiten Feiertage auf <strong className="text-text-primary">Werktagen</strong> (Montag
              bis Freitag) und{" "}
              <strong className="text-text-primary">{weekendNationwide}</strong> auf
              einem <strong className="text-text-primary">Wochenende</strong> (Samstag/Sonntag).
            </p>
            <p>
              Besonders <strong className="text-text-primary">br&uuml;ckentagefreundlich</strong>{" "}
              sind Feiertage, die auf Donnerstag oder Freitag liegen: So reicht oft ein
              zus&auml;tzlicher Urlaubstag f&uuml;r ein langes Wochenende.
            </p>
          </div>

          {/* Weekday distribution */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Bundesweite Feiertage {year} nach Wochentag
            </p>
            <div className="grid grid-cols-7 gap-2 text-center">
              {WOCHENTAG_KURZ.map((tag, i) => (
                <div key={tag}>
                  <div className="text-xs text-text-secondary mb-1">{tag}</div>
                  <div
                    className={`text-lg font-bold ${
                      weekdayCounts[i] > 0
                        ? i === 0 || i === 6
                          ? "text-text-secondary"
                          : "text-accent"
                        : "text-text-secondary/40"
                    }`}
                  >
                    {weekdayCounts[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* InfoBox */}
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm">
            <p className="text-text-primary">
              <strong>Kurzfazit:</strong> Bundeseinheitliche Feiertage am{" "}
              <strong>Wochenende</strong>: {weekendNationwide} (Sa/So) &middot;{" "}
              Bundeseinheitliche Feiertage am <strong>Werktag</strong>: {workdayNationwide} (Mo&ndash;Fr)
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 3: Feiertage nach Bundesland (enhanced)
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="gesetzliche-feiertage-nach-bundesland">
            Gesetzliche Feiertage {year} nach Bundesland
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Das Feiertagsrecht ist in Deutschland L&auml;ndersache. Neben den
            bundesweit einheitlichen Terminen gibt es je nach Region weitere
            gesetzliche Feiertage {year}. F&uuml;r Ihre Urlaubs- und
            Projektplanung lohnt sich deshalb ein kurzer Check im eigenen
            Bundesland.
          </p>

          {/* Detailed state table */}
          <div className="overflow-x-auto rounded-xl border border-border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Bundesland
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Zus&auml;tzliche Feiertage
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Gesamt
                  </th>
                </tr>
              </thead>
              <tbody>
                {stateHolidayCounts.map((s) => {
                  const info = STATE_EXTRAS[s.code];
                  const slug = s.name
                    .toLowerCase()
                    .replace(/ä/g, "ae")
                    .replace(/ö/g, "oe")
                    .replace(/ü/g, "ue")
                    .replace(/ß/g, "ss")
                    .replace(/\s+/g, "-");
                  return (
                    <tr
                      key={s.code}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                        <Link
                          href={`/feiertage/${year}/${slug}`}
                          className="text-accent hover:underline"
                        >
                          {s.name}
                        </Link>{" "}
                        <span className="text-text-secondary text-xs">({s.code})</span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {info ? info.extras.join("; ") : "–"}
                        {info?.hinweis && (
                          <span className="block text-xs text-text-secondary/70 mt-0.5">
                            {info.hinweis}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-accent font-semibold">{s.count}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* State-specific quick-access grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stateHolidayCounts.map((s) => {
              const slug = s.name
                .toLowerCase()
                .replace(/ä/g, "ae")
                .replace(/ö/g, "oe")
                .replace(/ü/g, "ue")
                .replace(/ß/g, "ss")
                .replace(/\s+/g, "-");
              return (
                <Link
                  key={s.code}
                  href={`/feiertage/${year}/${slug}`}
                  className="flex items-center justify-between bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-secondary/80 transition-colors"
                >
                  <span className="text-text-primary font-medium">
                    {s.name}
                  </span>
                  <span className="text-text-secondary">
                    <span className="text-accent font-semibold">{s.count}</span>{" "}
                    Feiertage &rarr;
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── State subsections: BW, NRW, Bayern, Berlin (current year only) ─── */}
          {isCurrentYear && (
          <div className="mt-8 space-y-6">

            {/* BW */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Feiertage {year} in Baden-W&uuml;rttemberg
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                F&uuml;r die Feiertage {year} in BW gelten neben den bundesweiten
                Terminen drei zus&auml;tzliche gesetzliche Feiertage: zwei davon sind
                fest, einer ist beweglich &ndash; das hilft bei der Urlaubsplanung rund
                um die gesetzlichen Feiertage Baden-W&uuml;rttemberg {year}.
              </p>
              <ul className="text-text-secondary text-sm list-disc list-inside space-y-1">
                <li>
                  <strong className="text-text-primary">Heilige Drei K&ouml;nige</strong>{" "}
                  (fest: {dreiKoenige ? formatDateDE(dreiKoenige.date) : "06.01."})
                </li>
                <li>
                  <strong className="text-text-primary">Fronleichnam</strong>{" "}
                  (beweglich: {fronleichnam ? formatDateDE(fronleichnam.date) : "Juni"})
                </li>
                <li>
                  <strong className="text-text-primary">Allerheiligen</strong>{" "}
                  (fest: {allerheiligen ? formatDateDE(allerheiligen.date) : "01.11."})
                </li>
              </ul>
              <p className="text-text-secondary text-xs mt-2">
                <Link
                  href={`/feiertage/${year}/baden-wuerttemberg`}
                  className="text-accent hover:underline"
                >
                  Alle Feiertage BW {year} im Detail &rarr;
                </Link>
              </p>
            </div>

            {/* NRW */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Feiertage {year} in Nordrhein-Westfalen (NRW)
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                In Nordrhein-Westfalen gibt es {year} zus&auml;tzlich zu den
                bundesweiten Terminen zwei landesspezifische Feiertage:{" "}
                <strong className="text-text-primary">Fronleichnam</strong> ({fronleichnam ? formatDateDE(fronleichnam.date) : ""})
                und{" "}
                <strong className="text-text-primary">Allerheiligen</strong> ({allerheiligen ? formatDateDE(allerheiligen.date) : "01.11."}).
                Diese Tage sind besonders relevant, wenn Sie Br&uuml;ckentage
                oder Urlaub planen.
              </p>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-sm">
                <strong className="text-text-primary">Gesetzliche Feiertage NRW {year}
                insgesamt:</strong>{" "}
                {holidays.filter((h) => h.states.includes("NW")).length}{" "}
                ({nationwideCount} bundesweit + {holidays.filter((h) => h.states.includes("NW")).length - nationwideCount} in NRW)
              </div>
              <p className="text-text-secondary text-xs mt-2">
                <Link
                  href={`/feiertage/${year}/nordrhein-westfalen`}
                  className="text-accent hover:underline"
                >
                  Alle Feiertage NRW {year} im Detail &rarr;
                </Link>
              </p>
            </div>

            {/* Bayern */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Feiertage {year} in Bayern
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                Bei den Feiertagen {year} in Bayern sind viele Termine im ganzen
                Bundesland gesetzlich geregelt. Einige{" "}
                <strong className="text-text-primary">regionale Feiertage</strong>{" "}
                gelten jedoch nur in bestimmten Gemeinden oder St&auml;dten. So f&auml;llt{" "}
                <strong className="text-text-primary">Mari&auml; Himmelfahrt</strong> nur dann
                als Feiertag an, wenn die Gemeinde dazu z&auml;hlt. Das{" "}
                <strong className="text-text-primary">Augsburger Friedensfest</strong>{" "}
                (8. August) gilt ausschlie&szlig;lich in Augsburg.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-secondary">
                      <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Feiertag</th>
                      <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Landesweit?</th>
                      <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Hinweis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 text-text-primary font-medium">Fronleichnam</td>
                      <td className="px-4 py-2.5 text-accent">Ja</td>
                      <td className="px-4 py-2.5 text-text-secondary text-xs">Gesetzlicher Feiertag Bayern {year}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 text-text-primary font-medium">Mari&auml; Himmelfahrt</td>
                      <td className="px-4 py-2.5 text-text-secondary">Nein (Gemeinde)</td>
                      <td className="px-4 py-2.5 text-text-secondary text-xs">Abh&auml;ngig vom Gemeinde-Status</td>
                    </tr>
                    <tr className="border-b border-border last:border-b-0">
                      <td className="px-4 py-2.5 text-text-primary font-medium">Augsburger Friedensfest</td>
                      <td className="px-4 py-2.5 text-text-secondary">Nein (Stadt)</td>
                      <td className="px-4 py-2.5 text-text-secondary text-xs">Nur Stadt Augsburg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-text-secondary text-xs mt-2">
                <Link
                  href={`/feiertage/${year}/bayern`}
                  className="text-accent hover:underline"
                >
                  Alle Feiertage Bayern {year} im Detail &rarr;
                </Link>
              </p>
            </div>

            {/* Berlin */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Feiertage {year} in Berlin
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                Die Feiertage {year} in Berlin umfassen neben den bundesweiten
                gesetzlichen Feiertagen einen zus&auml;tzlichen Termin: den{" "}
                <strong className="text-text-primary">
                  Internationalen Frauentag
                </strong>{" "}
                ({frauentag ? `${formatDateDE(frauentag.date)}, ${getDayNameDE(frauentag.date)}` : "8. M\u00e4rz"}).
                Wenn Sie die gesetzlichen Feiertage Berlin {year} planen, lohnt
                sich ein Blick auf die Wochentage: F&auml;llt ein Feiertag auf
                Samstag oder Sonntag, gibt es keinen automatischen Ausgleichstag.
              </p>
              <p className="text-text-secondary text-xs">
                <Link
                  href={`/feiertage/${year}/berlin`}
                  className="text-accent hover:underline"
                >
                  Alle Feiertage Berlin {year} im Detail &rarr;
                </Link>
              </p>
            </div>

            {/* Weitere Bundesländer */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Weitere Bundesl&auml;nder: Feiertage {year} als &Uuml;bersicht
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                F&uuml;r die Feiertage {year} in Niedersachsen, Mecklenburg-Vorpommern,
                Hessen, Sachsen, Th&uuml;ringen und den weiteren Bundesl&auml;ndern nutzen
                Sie die Tabelle oben oder w&auml;hlen Sie Ihr Bundesland direkt aus
                der &Uuml;bersicht. Wichtig: Es gibt regionale Sonderregeln &ndash;
                den Bu&szlig;- und Bettag gibt es nur in Sachsen, in Th&uuml;ringen
                kommt der Weltkindertag dazu, und in Brandenburg gelten zus&auml;tzlich
                Ostersonntag und Pfingstsonntag als Feiertage.
              </p>
            </div>
          </div>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 4: Brückentage
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="brueckentage-so-holen-sie-mit-wenig-urlaubstagen-mehr-freie-tage-heraus">
            Br&uuml;ckentage {year}: So holen Sie mit wenig Urlaubstagen mehr
            freie Tage heraus
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn Sie{" "}
            <strong className="text-text-primary">Br&uuml;ckentage {year}</strong>{" "}
            clever planen, starten Sie mit Feiertagen am Donnerstag oder
            Dienstag. Dann gen&uuml;gen oft{" "}
            <strong className="text-text-primary">1&ndash;2 Urlaubstage</strong>{" "}
            f&uuml;r ein langes Wochenende. F&uuml;r den schnellen &Uuml;berblick hilft Ihnen ein{" "}
            <Link href="/kalender-mit-kalenderwochen" className="text-accent hover:underline">
              Kalender mit Kalenderwochen
            </Link>
            , damit Sie sofort sehen, wie die Wochen liegen.
          </p>
          {brueckentage.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">
                      Feiertag
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">
                      Datum
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">
                      Wochentag
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">
                      Br&uuml;ckentag-Tipp
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">
                      Urlaub
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">
                      Frei
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {brueckentage.map((b, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                        {b.feiertag}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatDateDE(b.feiertagDate)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {b.wochentag}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {b.tipp}
                      </td>
                      <td className="px-4 py-3 text-accent font-semibold text-center">
                        {b.urlaubstage}
                      </td>
                      <td className="px-4 py-3 text-text-primary font-semibold text-center">
                        {b.freieTage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary">
              {year} bieten die bundesweiten Feiertage leider keine
              klassischen Br&uuml;ckentage, da keiner g&uuml;nstig auf Dienstag,
              Mittwoch oder Donnerstag f&auml;llt. Pr&uuml;fen Sie die regionalen
              Feiertage Ihres Bundeslandes f&uuml;r zus&auml;tzliche
              M&ouml;glichkeiten.
            </div>
          )}
          <p className="text-text-secondary text-sm mt-3">
            Zus&auml;tzliche Br&uuml;ckentage {year} nach Bundesland lohnen sich rund
            um <strong className="text-text-primary">Fronleichnam</strong> (Donnerstag),{" "}
            <strong className="text-text-primary">Reformationstag</strong> und{" "}
            <strong className="text-text-primary">Allerheiligen</strong>. So k&ouml;nnen
            Sie Ihre Urlaubsplanung {year} gezielt ausrichten.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 5: Bewegliche Feiertage
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="welche-feiertage-sind-beweglich">
            Welche Feiertage sind {year} beweglich?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die{" "}
            <strong className="text-text-primary">beweglichen Feiertage {year}</strong>{" "}
            fallen jedes Jahr auf andere Daten, weil sie sich am Ostertermin
            orientieren.{" "}
            <strong className="text-text-primary">Ostern {year}</strong> ist am{" "}
            <strong className="text-text-primary">
              {getDayNameDE(easter)}, {formatDateDE(easter)}
            </strong>
            . Von diesem Datum leiten sich weitere wichtige Feiertage ab:
          </p>

          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Feiertag
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Datum
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Wochentag
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Offset zu Ostern
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Geltung
                  </th>
                </tr>
              </thead>
              <tbody>
                {movableHolidays.map((m, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                      {m.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {formatDateDE(m.date)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {getDayNameDE(m.date)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {m.offset === 0
                        ? "Ostersonntag"
                        : m.offset > 0
                        ? `+${m.offset} Tage`
                        : `${m.offset} Tage`}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {m.regional ? "regional" : "bundesweit"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm space-y-2">
            <p className="text-text-primary font-medium">
              Merksatz: Von Ostersonntag abgeleitete Feiertage
            </p>
            <p className="text-text-secondary">
              <strong className="text-text-primary">+1 Tag</strong> (Ostermontag) &middot;{" "}
              <strong className="text-text-primary">+39 Tage</strong> (Christi Himmelfahrt) &middot;{" "}
              <strong className="text-text-primary">+50 Tage</strong> (Pfingstmontag) &middot;{" "}
              <strong className="text-text-primary">+60 Tage</strong> (Fronleichnam)
            </p>
            <p className="text-text-secondary text-xs">
              Mini-Regel: Ostern ist der erste Sonntag nach dem ersten Vollmond
              im Fr&uuml;hling.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 6: SEO Erklärtext (current year only – avoid duplicate content)
            ═════════════════════════════════════════════════════════ */}
        {isCurrentYear && (
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="gesetzliche-feiertage-erklaert">
            Gesetzliche Feiertage {year} erkl&auml;rt
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Deutschland hat <strong className="text-text-primary">9 bundeseinheitliche
              Feiertage</strong>, die in allen 16 Bundesl&auml;ndern gelten. Dazu
              kommen je nach Region weitere Feiertage, sodass die Gesamtzahl
              zwischen 10 und 13 pro Jahr schwankt.
            </p>
            <p>
              Einige Feiertage haben ein{" "}
              <strong className="text-text-primary">festes Datum</strong> (z.&thinsp;B.
              Neujahr am 1.&nbsp;Januar oder der Tag der Deutschen Einheit am
              3.&nbsp;Oktober), w&auml;hrend andere{" "}
              <strong className="text-text-primary">bewegliche Feiertage</strong>{" "}
              sind und sich nach dem Osterdatum richten. Karfreitag,
              Ostermontag, Christi Himmelfahrt und Pfingstmontag &auml;ndern ihr
              Datum jedes Jahr.
            </p>
            <p>
              F&uuml;r die Planung ist es hilfreich, die{" "}
              <strong className="text-text-primary">Kalenderwoche</strong> jedes
              Feiertags zu kennen. Die KW-Angabe in unserer Tabelle ist nach dem
              internationalen Standard ISO&nbsp;8601 berechnet und verlinkt
              direkt zur entsprechenden{" "}
              <Link href="/kalenderwoche" className="text-accent hover:underline">
                KW-&Uuml;bersicht
              </Link>
              .
            </p>
          </div>
        </div>
        )}

        {/* ═════════════════════════════════════════════════════════
            SECTION 7: FAQ (expanded with year-specific)
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5" id="haeufige-fragen-zu-feiertagen">
            H&auml;ufige Fragen zu Feiertagen {year}
          </h2>
          <div className="space-y-2.5">
            {allFAQs.map((faq, i) => (
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

        {/* ═════════════════════════════════════════════════════════
            SECTION 8: Nächste Schritte (CTA – current year only)
            ═════════════════════════════════════════════════════════ */}
        {isCurrentYear && (
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="feiertage-naechste-schritte">
            Feiertage {year}: N&auml;chste Schritte
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            F&uuml;r die schnelle Orientierung k&ouml;nnen Sie parallel die{" "}
            <Link href="/welche-kalenderwoche-haben-wir" className="text-accent hover:underline">
              aktuelle Kalenderwoche pr&uuml;fen
            </Link>
            , um Wochenplanung und Feiertage sauber abzugleichen. Achten Sie besonders
            auf Feiertage am <strong className="text-text-primary">Dienstag</strong>{" "}
            oder <strong className="text-text-primary">Donnerstag</strong>: Hier holen
            Sie mit einem einzelnen Urlaubstag oft das Maximum heraus.
          </p>

          {/* Mini-Checkliste */}
          <div className="bg-surface-secondary border border-border rounded-xl p-5">
            <p className="text-text-primary font-semibold text-sm mb-3">
              In 2 Minuten geplant &ndash; Mini-Checkliste:
            </p>
            <ol className="text-text-secondary text-sm space-y-2 list-decimal list-inside">
              <li>
                <strong className="text-text-primary">Bundesland</strong> in der
                Tabelle oben w&auml;hlen &ndash; regionale Feiertage pr&uuml;fen
              </li>
              <li>
                <strong className="text-text-primary">Br&uuml;ckentage</strong>{" "}
                markieren und Zeitfenster notieren
              </li>
              <li>
                <strong className="text-text-primary">Urlaub</strong> beantragen
                und im Kalender blocken
              </li>
              <li>
                <Link href={`/kalenderwochen/${year}`} className="text-accent hover:underline">
                  Kalenderwochen {year}
                </Link>{" "}
                f&uuml;r die &Uuml;bersicht nutzen
              </li>
            </ol>
          </div>

          {hasPrev || hasNext ? (
            <p className="text-text-secondary text-sm mt-3">
              Wenn Sie weiter vorausplanen:{" "}
              {hasNext && (
                <Link
                  href={`/feiertage/${nextYear}`}
                  className="text-accent hover:underline"
                >
                  Feiertage {nextYear} ansehen
                </Link>
              )}
              {hasNext && hasPrev && " | "}
              {hasPrev && (
                <Link
                  href={`/feiertage/${prevYear}`}
                  className="text-accent hover:underline"
                >
                  Feiertage {prevYear} zum Vergleich
                </Link>
              )}
            </p>
          ) : null}
        </div>
        )}

        {/* ── Year Navigation (bottom) ─────────────────────────── */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Link
              href={`/feiertage/${prevYear}`}
              className="text-sm text-accent hover:underline"
            >
              &larr; Feiertage {prevYear}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/feiertage/${nextYear}`}
              className="text-sm text-accent hover:underline"
            >
              Feiertage {nextYear} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── Author Byline ─────────────────────────── */}
        <AuthorByline date={year === new Date().getFullYear() ? new Date() : new Date(`${year}-01-01`)} />

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/feiertage" className="text-accent hover:underline">
            Feiertage &Uuml;bersicht &rarr;
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche &rarr;
          </Link>
          <Link href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {year} &rarr;
          </Link>
          <Link href={`/ostern/${year}`} className="text-accent hover:underline">
            Ostern {year} &rarr;
          </Link>
          <Link href={`/kalenderwochen/${year}`} className="text-accent hover:underline">
            KW-&Uuml;bersicht {year} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
