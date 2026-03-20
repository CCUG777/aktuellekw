import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_YEARS, BUNDESLAENDER, getBundeslandBySlug } from "@/lib/constants";
import {
  getFeiertageFuerJahr,
  getFeiertageFuerBundesland,
  getBrueckentageForState,
  getNextFeiertagForState,
  BUNDESLAND_NAMES,
  formatDateDE,
  getDayNameDE,
  getISOWeekNumber,
} from "@/lib/feiertage";

export const revalidate = 86400;

/* ── SEO: Title abbreviations for high-volume keywords ─────────── */
const TITLE_SHORT: Record<string, string> = {
  NW: "NRW",
  BW: "BW",
};

/* ── Regional holiday descriptions ─────────────────────────────── */
const REGIONAL_DESCRIPTIONS: Record<string, string> = {
  "Heilige Drei Könige":
    "Auch Epiphanias genannt – erinnert an die Ankunft der Weisen aus dem Morgenland.",
  "Internationaler Frauentag":
    "Seit 2019 gesetzlicher Feiertag – würdigt die Gleichberechtigung der Geschlechter.",
  Fronleichnam:
    "Katholischer Feiertag 60 Tage nach Ostern – feiert die Gegenwart Christi in der Eucharistie.",
  "Mariä Himmelfahrt":
    "Katholischer Feiertag am 15. August – feiert die Aufnahme Marias in den Himmel.",
  Weltkindertag:
    "Seit 2019 gesetzlicher Feiertag in Thüringen – setzt ein Zeichen für Kinderrechte.",
  Reformationstag:
    "Evangelischer Gedenktag am 31. Oktober – erinnert an Martin Luthers Thesenanschlag 1517.",
  Allerheiligen:
    "Katholischer Feiertag am 1. November – Gedenken an alle Heiligen der Kirche.",
  "Buß- und Bettag":
    "Evangelischer Feiertag – nur noch in Sachsen gesetzlicher Feiertag, in anderen Ländern 1995 abgeschafft.",
};

/* ── Static Params ─────────────────────────────────────────────── */
export function generateStaticParams() {
  return CONTENT_YEARS.flatMap((year) =>
    BUNDESLAENDER.map((bl) => ({
      year: String(year),
      bundesland: bl.slug,
    }))
  );
}

/* ── State-specific FAQs ──────────────────────────────────────── */
function getStateFAQs(
  year: number,
  stateName: string,
  stateCode: string,
  totalCount: number,
  regionalHolidays: { name: string; date: Date }[],
  brueckentageCount: number
) {
  const faqs: { question: string; answer: string }[] = [
    {
      question: `Wie viele Feiertage hat ${stateName} ${year}?`,
      answer: `${stateName} hat ${year} insgesamt ${totalCount} gesetzliche Feiertage: 9 bundesweite Feiertage, die in ganz Deutschland gelten, sowie ${totalCount - 9} zusätzliche landeseigene Feiertage${regionalHolidays.length > 0 ? ` (${regionalHolidays.map((h) => h.name).join(", ")})` : ""}.`,
    },
    {
      question: `Welche Feiertage gelten nur in ${stateName}?`,
      answer:
        regionalHolidays.length > 0
          ? `In ${stateName} gelten neben den 9 bundesweiten Feiertagen auch: ${regionalHolidays.map((h) => `${h.name} (${formatDateDE(h.date)})`).join(", ")}. Diese regionalen Feiertage gelten nicht in allen Bundesländern.`
          : `${stateName} hat ausschließlich die 9 bundesweiten Feiertage. Es gibt keine zusätzlichen landeseigenen Feiertage.`,
    },
  ];

  if (brueckentageCount > 0) {
    faqs.push({
      question: `Wann sind die besten Brückentage ${year} in ${stateName}?`,
      answer: `${year} gibt es in ${stateName} ${brueckentageCount} günstige Brückentag-Möglichkeiten. Feiertage, die auf Donnerstag oder Dienstag fallen, eignen sich besonders gut – mit nur einem Urlaubstag ergibt sich ein langes Wochenende mit 4 freien Tagen.`,
    });
  }

  // Dynamic: Ask about a prominent regional holiday
  if (stateCode === "NW" || stateCode === "BW" || stateCode === "BY" || stateCode === "HE" || stateCode === "RP" || stateCode === "SL") {
    faqs.push({
      question: `Ist Fronleichnam in ${stateName} ein Feiertag?`,
      answer: `Ja, Fronleichnam ist in ${stateName} ein gesetzlicher Feiertag. Er fällt ${year} auf ${getDayNameDE(getFeiertageFuerBundesland(year, stateCode).find((h) => h.name === "Fronleichnam")!.date)}, den ${formatDateDE(getFeiertageFuerBundesland(year, stateCode).find((h) => h.name === "Fronleichnam")!.date)}. Fronleichnam gilt außerdem in ${["BW", "BY", "HE", "NW", "RP", "SL"].filter((c) => c !== stateCode).map((c) => BUNDESLAND_NAMES[c]).join(", ")}.`,
    });
  } else if (["BB", "HB", "HH", "MV", "NI", "SN", "SH", "TH"].includes(stateCode)) {
    faqs.push({
      question: `Ist der Reformationstag in ${stateName} ein Feiertag?`,
      answer: `Ja, der Reformationstag am 31. Oktober ist in ${stateName} ein gesetzlicher Feiertag. Er gilt auch in ${["BB", "HB", "HH", "MV", "NI", "SN", "SH", "TH"].filter((c) => c !== stateCode).map((c) => BUNDESLAND_NAMES[c]).join(", ")}.`,
    });
  }

  if (stateCode === "BW" || stateCode === "BY" || stateCode === "NW" || stateCode === "RP" || stateCode === "SL") {
    faqs.push({
      question: `Ist Allerheiligen in ${stateName} ein Feiertag?`,
      answer: `Ja, Allerheiligen am 1. November ist in ${stateName} ein gesetzlicher Feiertag. Er gilt auch in ${["BW", "BY", "NW", "RP", "SL"].filter((c) => c !== stateCode).map((c) => BUNDESLAND_NAMES[c]).join(", ")}.`,
    });
  }

  faqs.push({
    question: `Hat ${stateName} mehr Feiertage als andere Bundesländer?`,
    answer: `${stateName} hat ${totalCount} gesetzliche Feiertage pro Jahr. ${totalCount >= 12 ? `Damit gehört ${stateName} zu den Bundesländern mit den meisten Feiertagen.` : totalCount <= 10 ? `Damit gehört ${stateName} zu den Bundesländern mit den wenigsten Feiertagen. Bayern und das Saarland haben mit 12 die meisten.` : `Im Vergleich: Bayern und das Saarland haben mit 12 die meisten, Bremen und Hamburg mit 10 die wenigsten Feiertage.`}`,
  });

  return faqs;
}

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; bundesland: string }>;
}): Promise<Metadata> {
  const { year: yearStr, bundesland: slug } = await params;
  const year = parseInt(yearStr, 10);
  const bl = getBundeslandBySlug(slug);

  if (!bl || isNaN(year) || year < 2020 || year > 2100)
    return { title: "Nicht gefunden" };

  const holidays = getFeiertageFuerBundesland(year, bl.code);
  const count = holidays.length;
  const brueckentage = getBrueckentageForState(year, bl.code);
  const titleName = TITLE_SHORT[bl.code] || bl.name;

  const title = `Feiertage ${titleName} ${year} – Alle ${count} gesetzlichen Feiertage`;
  const description = `Gesetzliche Feiertage ${year} in ${bl.name}: ${count} Feiertage mit Datum, Wochentag & KW. Plus ${brueckentage.length} Brückentage für maximale Freizeit.`;
  const url = `https://aktuellekw.de/feiertage/${year}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ── Page Component ────────────────────────────────────────────── */
export default async function FeiertageBundeslandPage({
  params,
}: {
  params: Promise<{ year: string; bundesland: string }>;
}) {
  const { year: yearStr, bundesland: slug } = await params;
  const year = parseInt(yearStr, 10);
  const bl = getBundeslandBySlug(slug);

  if (!bl || isNaN(year) || year < 2020 || year > 2100) notFound();

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const currentYear = todayUTC.getUTCFullYear();

  /* ── Holiday data ───────────────────────────────────────────── */
  const holidays = getFeiertageFuerBundesland(year, bl.code);
  const totalCount = holidays.length;
  const nationwideCount = holidays.filter((h) => h.isNationwide).length;
  const regionalCount = totalCount - nationwideCount;
  const regionalHolidays = holidays.filter((h) => !h.isNationwide);

  /* ── Brückentage (including regional!) ───────────────────────── */
  const brueckentage = getBrueckentageForState(year, bl.code);

  /* ── Next holiday (current year only) ────────────────────────── */
  const nextHoliday =
    year === currentYear ? getNextFeiertagForState(bl.code) : null;

  /* ── Year navigation ─────────────────────────────────────────── */
  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = CONTENT_YEARS.includes(prevYear);
  const hasNext = CONTENT_YEARS.includes(nextYear);

  /* ── Year comparison data ────────────────────────────────────── */
  const comparisonYears = CONTENT_YEARS;
  const comparisonData = comparisonYears.map((y) => ({
    year: y,
    holidays: getFeiertageFuerBundesland(y, bl.code),
    isCurrent: y === year,
  }));

  /* ── Other states for cross-navigation ───────────────────────── */
  const otherStates = BUNDESLAENDER.filter((b) => b.slug !== slug).sort(
    (a, b) => a.name.localeCompare(b.name, "de")
  );

  /* ── FAQs ────────────────────────────────────────────────────── */
  const faqs = getStateFAQs(
    year,
    bl.name,
    bl.code,
    totalCount,
    regionalHolidays,
    brueckentage.length
  );

  /* ── JSON-LD ─────────────────────────────────────────────────── */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `https://aktuellekw.de/feiertage/${year}/${slug}#breadcrumb`,
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
        {
          "@type": "ListItem",
          position: 4,
          name: bl.name,
          item: `https://aktuellekw.de/feiertage/${year}/${slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `https://aktuellekw.de/feiertage/${year}/${slug}#dataset`,
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: `${year}-01-01`,
      dateModified: year === new Date().getFullYear() ? new Date().toISOString().split("T")[0] : `${year}-01-01`,
      name: `Gesetzliche Feiertage ${year} in ${bl.name}`,
      description: `Alle ${totalCount} gesetzlichen Feiertage ${year} in ${bl.name} mit Datum und Kalenderwoche.`,
      temporalCoverage: `${year}`,
      spatialCoverage: {
        "@type": "Place",
        name: bl.name,
        address: {
          "@type": "PostalAddress",
          addressRegion: bl.name,
          addressCountry: "DE",
        },
      },
      creator: { "@id": "https://aktuellekw.de/#organization" },
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `https://aktuellekw.de/feiertage/${year}/${slug}#faqpage`,
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
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
          <Link
            href="/feiertage"
            className="hover:text-accent transition-colors"
          >
            Feiertage
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <Link
            href={`/feiertage/${year}`}
            className="hover:text-accent transition-colors"
          >
            Feiertage {year}
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">{bl.name}</span>
        </nav>

        {/* ── Year Navigation ─────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          {hasPrev ? (
            <Link
              href={`/feiertage/${prevYear}/${slug}`}
              className="text-sm text-accent hover:underline"
            >
              &larr; Feiertage {bl.name} {prevYear}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/feiertage/${nextYear}/${slug}`}
              className="text-sm text-accent hover:underline"
            >
              Feiertage {bl.name} {nextYear} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── H1 + Intro ──────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Feiertage {bl.name} {year}
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Alle{" "}
            <strong className="text-text-primary">
              {totalCount} gesetzlichen Feiertage
            </strong>{" "}
            in {bl.name} f&uuml;r {year} auf einen Blick:{" "}
            {nationwideCount} bundesweite Feiertage
            {regionalCount > 0 && (
              <>
                {" "}
                und{" "}
                <strong className="text-text-primary">
                  {regionalCount} landeseigene
                </strong>{" "}
                Feiertage ({regionalHolidays.map((h) => h.name).join(", ")})
              </>
            )}
            . Jeder Feiertag mit Datum, Wochentag und Kalenderwoche &ndash;
            plus{" "}
            <strong className="text-text-primary">
              {brueckentage.length} Br&uuml;ckentage
            </strong>{" "}
            f&uuml;r maximale Freizeit.
          </p>
        </div>

        {/* ── Next holiday box (current year only) ─────────────── */}
        {nextHoliday && nextHoliday.daysUntil >= 0 && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl px-5 py-4 mb-8 text-sm">
            <span className="text-text-secondary">
              N&auml;chster Feiertag in {bl.name}:{" "}
            </span>
            <strong className="text-text-primary">
              {nextHoliday.feiertag.name}
            </strong>{" "}
            am {formatDateDE(nextHoliday.feiertag.date)} (
            {getDayNameDE(nextHoliday.feiertag.date)})
            {nextHoliday.daysUntil === 0 ? (
              <span className="text-accent font-semibold"> &ndash; heute!</span>
            ) : (
              <span className="text-text-secondary">
                {" "}
                &ndash; noch{" "}
                <strong className="text-accent">
                  {nextHoliday.daysUntil}
                </strong>{" "}
                {nextHoliday.daysUntil === 1 ? "Tag" : "Tage"}
              </span>
            )}
          </div>
        )}

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Gesamt", value: String(totalCount) },
            { label: "Bundesweit", value: String(nationwideCount) },
            { label: "Regional", value: String(regionalCount) },
            {
              label: "Brückentage",
              value: String(brueckentage.length),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-secondary border border-border rounded-xl px-4 py-3 text-center"
            >
              <div className="text-lg md:text-xl font-bold text-accent">
                {stat.value}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── All holidays table ───────────────────────────────── */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Alle {totalCount} gesetzlichen Feiertage in {bl.name} {year}
          </h2>
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
                    Typ
                  </th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h, i) => {
                  const isPast =
                    year === currentYear &&
                    h.date.getTime() < todayUTC.getTime();
                  const isToday =
                    year === currentYear &&
                    h.date.getTime() === todayUTC.getTime();
                  return (
                    <tr
                      key={i}
                      className={`border-b border-border last:border-b-0 ${
                        isToday
                          ? "bg-accent/10"
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
                      <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">
                        {h.isNationwide ? (
                          <span className="text-text-primary font-medium">
                            bundesweit
                          </span>
                        ) : (
                          <span className="text-accent font-medium">
                            {bl.name}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            {totalCount} Feiertage: {nationwideCount} bundesweite +{" "}
            {regionalCount} regionale. Alle{" "}
            <Link
              href={`/feiertage/${year}`}
              className="text-accent hover:underline"
            >
              Feiertage {year} in Deutschland
            </Link>
            .
          </p>
        </div>

        {/* ── Brückentage ──────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Br&uuml;ckentage {year} in {bl.name}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mit <strong className="text-text-primary">Br&uuml;ckentagen</strong>{" "}
            holst du das Maximum aus deinem Urlaub heraus. Feiertage, die auf
            Donnerstag oder Dienstag fallen, sind ideal &ndash;{" "}
            {brueckentage.length > 0
              ? `${year} gibt es in ${bl.name} ${brueckentage.length} günstige Möglichkeiten:`
              : `${year} fallen in ${bl.name} leider keine Feiertage günstig.`}
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
              {year} fallen in {bl.name} keine Feiertage auf Donnerstag,
              Dienstag oder Mittwoch &ndash; das Oster- und
              Weihnachts-Wochenende bringt aber trotzdem freie Tage.
            </div>
          )}
        </div>

        {/* ── Regional holidays detail ─────────────────────────── */}
        {regionalCount > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-semibold mb-4">
              Regionale Feiertage in {bl.name}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Neben den 9 bundesweiten Feiertagen hat {bl.name}{" "}
              <strong className="text-text-primary">
                {regionalCount} zus&auml;tzliche
              </strong>{" "}
              landeseigene Feiertage:
            </p>
            <div className="space-y-3">
              {regionalHolidays.map((h, i) => {
                const allStatesForHoliday = getFeiertageFuerJahr(year)
                  .find((fh) => fh.name === h.name)
                  ?.states.filter((c) => c !== bl.code)
                  .map((c) => BUNDESLAND_NAMES[c]);
                return (
                  <div
                    key={i}
                    className="bg-surface-secondary border border-border rounded-xl p-4 text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-text-primary">{h.name}</strong>
                      <span className="text-text-secondary text-xs">
                        {formatDateDE(h.date)} &middot;{" "}
                        {getDayNameDE(h.date)}
                      </span>
                    </div>
                    <p className="text-text-secondary">
                      {REGIONAL_DESCRIPTIONS[h.name] ||
                        "Regionaler gesetzlicher Feiertag."}
                    </p>
                    {allStatesForHoliday && allStatesForHoliday.length > 0 && (
                      <p className="text-text-secondary text-xs mt-1">
                        Gilt auch in: {allStatesForHoliday.join(", ")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Year comparison ──────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Feiertage {bl.name} im Jahresvergleich
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            So fallen die Feiertage in {bl.name} &uuml;ber die Jahre:
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Feiertag
                  </th>
                  {comparisonData.map((cd) => (
                    <th
                      key={cd.year}
                      className={`text-left px-4 py-3 font-medium ${cd.isCurrent ? "text-accent" : "text-text-secondary"}`}
                    >
                      {cd.isCurrent ? (
                        cd.year
                      ) : (
                        <Link
                          href={`/feiertage/${cd.year}/${slug}`}
                          className="text-accent hover:underline"
                        >
                          {cd.year}
                        </Link>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holidays.map((h, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap text-xs">
                      {h.name}
                      {!h.isNationwide && (
                        <span className="ml-1 text-accent">*</span>
                      )}
                    </td>
                    {comparisonData.map((cd) => {
                      const match = cd.holidays.find(
                        (ch) => ch.name === h.name
                      );
                      return (
                        <td
                          key={cd.year}
                          className={`px-4 py-3 text-text-secondary text-xs whitespace-nowrap ${cd.isCurrent ? "font-medium text-text-primary" : ""}`}
                        >
                          {match
                            ? `${getDayNameDE(match.date).slice(0, 2)}, ${formatDateDE(match.date)}`
                            : "–"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {regionalCount > 0 && (
            <p className="text-text-secondary text-xs mt-2">
              * = regionaler Feiertag (nur in {bl.name} und ggf. weiteren
              Bundesl&auml;ndern)
            </p>
          )}
        </div>

        {/* ── Cross-state navigation ───────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Feiertage in anderen Bundesl&auml;ndern {year}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherStates.map((state) => (
              <Link
                key={state.slug}
                href={`/feiertage/${year}/${state.slug}`}
                className="inline-block bg-surface-secondary border border-border rounded-full px-4 py-2 text-sm text-text-secondary hover:text-accent hover:border-accent/50 transition-all"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zu Feiertagen in {bl.name}
          </h2>
          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
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

        {/* ── Year Navigation (bottom) ─────────────────────────── */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Link
              href={`/feiertage/${prevYear}/${slug}`}
              className="text-sm text-accent hover:underline"
            >
              &larr; Feiertage {bl.name} {prevYear}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/feiertage/${nextYear}/${slug}`}
              className="text-sm text-accent hover:underline"
            >
              Feiertage {bl.name} {nextYear} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── Internal links ───────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link
            href={`/feiertage/${year}`}
            className="text-accent hover:underline"
          >
            Feiertage {year} &rarr;
          </Link>
          <Link href="/feiertage" className="text-accent hover:underline">
            Feiertage &Uuml;bersicht &rarr;
          </Link>
          <Link
            href={`/schulferien/${year}/${slug}`}
            className="text-accent hover:underline"
          >
            Schulferien {bl.name} {year} &rarr;
          </Link>
          <Link
            href={`/ostern/${year}`}
            className="text-accent hover:underline"
          >
            Ostern {year} &rarr;
          </Link>
          <Link
            href={`/osterferien/${year}`}
            className="text-accent hover:underline"
          >
            Osterferien {year} &rarr;
          </Link>
          <Link
            href={`/kalenderwochen/${year}`}
            className="text-accent hover:underline"
          >
            Kalenderwochen {year} &rarr;
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
