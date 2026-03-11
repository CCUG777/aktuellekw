import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_YEARS } from "@/lib/constants";
import {
  getEasterDate,
  addDays,
  getBrueckentage,
  getISOWeekNumber,
  formatDateDE,
  getDayNameDE,
} from "@/lib/feiertage";
import {
  getAllSchulferienForYear,
  formatDateShort,
  ferienDauer,
} from "@/lib/schulferien";

export const revalidate = 86400;

/* ── Valid years ───────────────────────────────────────────────── */
const OSTERN_YEARS = CONTENT_YEARS;

/* ── Static Params ─────────────────────────────────────────────── */
export function generateStaticParams() {
  return OSTERN_YEARS.map((y) => ({ year: String(y) }));
}

/* ── Orthodoxes Ostern (Julian calendar → Gregorian) ───────────── */
function getOrthodoxEasterDate(year: number): Date {
  const a = year % 19;
  const b = year % 4;
  const c = year % 7;
  const d = (19 * a + 15) % 30;
  const e = (2 * b + 4 * c - d + 34) % 7;
  const julianMonth = Math.floor((d + e + 114) / 31); // 1-indexed
  const julianDay = ((d + e + 114) % 31) + 1;
  // Convert Julian → Gregorian (+13 days for 21st century)
  const dt = new Date(Date.UTC(year, julianMonth - 1, julianDay));
  dt.setUTCDate(dt.getUTCDate() + 13);
  return dt;
}

/* ── Ostern-spezifische FAQ (Keyword-optimiert) ────────────────── */
const getOsternFAQs = (year: number, easterDateStr: string) => [
  {
    question: `Wann ist Ostern ${year}?`,
    answer: `Ostersonntag f\u00e4llt ${year} auf den ${easterDateStr}. Karfreitag ist am ${formatDateDE(addDays(getEasterDate(year), -2))} und Ostermontag am ${formatDateDE(addDays(getEasterDate(year), 1))}. Ostern liegt damit in Kalenderwoche\u00a0${getISOWeekNumber(getEasterDate(year))}.`,
  },
  {
    question: `Ist Ostermontag ${year} ein Feiertag?`,
    answer: `Ja, Ostermontag ist ein bundesweiter gesetzlicher Feiertag in allen 16 Bundesl\u00e4ndern Deutschlands. Zusammen mit Karfreitag (ebenfalls gesetzlicher Feiertag) ergibt sich jedes Jahr ein langes Osterwochenende mit mindestens 4 freien Tagen.`,
  },
  {
    question: `Wann sind Osterferien ${year}?`,
    answer: `Die Osterferien ${year} variieren je nach Bundesland. In den meisten Bundesl\u00e4ndern liegen sie rund um das Osterwochenende und dauern zwischen 1 und 3 Wochen. Die genauen Termine f\u00fcr alle 16 Bundesl\u00e4nder finden Sie in der Osterferien-Tabelle auf dieser Seite.`,
  },
  {
    question: "Ist Ostersonntag ein gesetzlicher Feiertag?",
    answer: "Nein, Ostersonntag ist in Deutschland kein gesetzlicher Feiertag. Gesetzliche Feiertage rund um Ostern sind nur Karfreitag und Ostermontag. Da Ostersonntag aber auf einen Sonntag f\u00e4llt, ist er in der Regel ohnehin arbeitsfrei.",
  },
  {
    question: "Warum \u00e4ndert sich das Osterdatum jedes Jahr?",
    answer: 'Ostern ist ein beweglicher Feiertag, der nach einer astronomischen Regel bestimmt wird: Ostersonntag ist der erste Sonntag nach dem ersten Fr\u00fchlingsvollmond (nach dem 21.\u00a0M\u00e4rz). Dadurch kann Ostern fr\u00fchestens am 22.\u00a0M\u00e4rz und sp\u00e4testens am 25.\u00a0April stattfinden. Diese Regel wurde 325\u00a0n.\u00a0Chr. auf dem Konzil von Nic\u00e4a festgelegt.',
  },
  {
    question: "Welche Feiertage h\u00e4ngen vom Osterdatum ab?",
    answer: "Insgesamt richten sich 6 Feiertage nach dem Osterdatum: Karfreitag (\u22122\u00a0Tage), Ostermontag (+1\u00a0Tag), Christi Himmelfahrt (+39\u00a0Tage), Pfingstsonntag (+49\u00a0Tage), Pfingstmontag (+50\u00a0Tage) und Fronleichnam (+60\u00a0Tage, nur in 6 Bundesl\u00e4ndern). Damit bestimmt das Osterdatum fast die H\u00e4lfte aller deutschen Feiertage.",
  },
  {
    question: `Wann ist orthodoxes Ostern ${year}?`,
    answer: `Orthodoxes Ostern ${year} wird nach dem julianischen Kalender berechnet und f\u00e4llt auf den ${formatDateDE(getOrthodoxEasterDate(year))}. Westliches (katholisches/evangelisches) Ostern ist am ${formatDateDE(getEasterDate(year))}. Die Differenz entsteht durch unterschiedliche Kalendergrundlagen.`,
  },
  {
    question: "Wie viele freie Tage gibt es an Ostern?",
    answer: "Durch Karfreitag (Freitag) und Ostermontag (Montag) ergibt sich jedes Jahr automatisch ein langes Wochenende mit 4 freien Tagen \u2013 ganz ohne Urlaubstage. Mit geschickter Br\u00fcckentag-Planung lassen sich bis zu 10 zusammenh\u00e4ngende freie Tage erzielen.",
  },
];

/* ── Metadata (Cluster 1: Datum & Termin) ──────────────────────── */
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

  const easter = getEasterDate(year);
  const easterDateStr = formatDateDE(easter);

  // Meta-Titel aus Excel Keyword Cluster (SISTRIX-verifiziert: 408px ✅)
  const title = `Ostern ${year}: Datum, Termine & alle Feiertage`;
  const description = `Wann ist Ostern ${year}? Ostersonntag am ${easterDateStr}. Karfreitag, Ostermontag, Osterferien & Br\u00fcckentage \u2013 alle Termine mit KW auf einen Blick.`;
  const url = `https://aktuellekw.de/ostern/${year}`;

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ── Page Component ────────────────────────────────────────────── */
export default async function OsternPage({
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

  /* ── Easter dates ──────────────────────────────────────────── */
  const easter = getEasterDate(year);
  const gruendonnerstag = addDays(easter, -3);
  const karfreitag = addDays(easter, -2);
  const ostersamstag = addDays(easter, -1);
  const ostermontag = addDays(easter, 1);
  const himmelfahrt = addDays(easter, 39);
  const pfingstsonntag = addDays(easter, 49);
  const pfingstmontag = addDays(easter, 50);
  const fronleichnam = addDays(easter, 60);

  const easterKW = getISOWeekNumber(easter);
  const easterDateStr = formatDateDE(easter);

  /* ── Orthodoxes Ostern ─────────────────────────────────────── */
  const orthodoxEaster = getOrthodoxEasterDate(year);
  const sameDate =
    easter.getTime() === orthodoxEaster.getTime();

  /* ── Countdown ─────────────────────────────────────────────── */
  const daysUntilEaster = Math.ceil(
    (easter.getTime() - todayUTC.getTime()) / 86400000
  );
  const easterIsPast = daysUntilEaster < 0;
  const easterIsToday = daysUntilEaster === 0;

  /* ── Easter-related Brückentage ────────────────────────────── */
  const allBrueckentage = getBrueckentage(year);
  const osterBrueckentage = allBrueckentage.filter(
    (b) =>
      b.feiertag === "Karfreitag" ||
      b.feiertag === "Ostermontag" ||
      b.feiertag === "Christi Himmelfahrt" ||
      b.feiertag === "Pfingstmontag"
  );

  /* ── Oster-Feiertage (Kern) ────────────────────────────────── */
  const osterFeiertage = [
    {
      name: "Gr\u00fcndonnerstag",
      date: gruendonnerstag,
      gesetzlich: false,
      info: "kein gesetzlicher Feiertag",
    },
    {
      name: "Karfreitag",
      date: karfreitag,
      gesetzlich: true,
      info: "bundesweit",
    },
    {
      name: "Ostersamstag",
      date: ostersamstag,
      gesetzlich: false,
      info: "kein gesetzlicher Feiertag",
    },
    {
      name: "Ostersonntag",
      date: easter,
      gesetzlich: false,
      info: "kein gesetzlicher Feiertag",
    },
    {
      name: "Ostermontag",
      date: ostermontag,
      gesetzlich: true,
      info: "bundesweit",
    },
  ];

  /* ── Bewegliche Feiertage (abhängig von Ostern) ────────────── */
  const beweglicheFeiertage = [
    { name: "Karfreitag", date: karfreitag, offset: -2, states: "bundesweit" },
    { name: "Ostermontag", date: ostermontag, offset: 1, states: "bundesweit" },
    { name: "Christi Himmelfahrt", date: himmelfahrt, offset: 39, states: "bundesweit" },
    { name: "Pfingstsonntag", date: pfingstsonntag, offset: 49, states: "kein Feiertag" },
    { name: "Pfingstmontag", date: pfingstmontag, offset: 50, states: "bundesweit" },
    { name: "Fronleichnam", date: fronleichnam, offset: 60, states: "BW, BY, HE, NW, RP, SL" },
  ];

  /* ── Osterferien aus Schulferien-Daten ─────────────────────── */
  const allSchulferien = await getAllSchulferienForYear(year);
  const osterferienData = allSchulferien
    .map((sf) => {
      const osterferien = sf.ferien.find((f) => f.typeId === 4);
      return osterferien
        ? {
            bundesland: sf.bundesland,
            code: sf.code,
            slug: sf.slug,
            start: osterferien.starts_on,
            end: osterferien.ends_on,
            dauer: ferienDauer(osterferien.starts_on, osterferien.ends_on),
          }
        : null;
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .sort((a, b) => a.start.localeCompare(b.start));

  /* ── Ostern-Vergleich (5 Jahre) ────────────────────────────── */
  const comparisonYears = [year - 2, year - 1, year, year + 1, year + 2];
  const osterVergleich = comparisonYears.map((y) => {
    const e = getEasterDate(y);
    return { year: y, date: e, kw: getISOWeekNumber(e), isCurrent: y === year };
  });

  /* ── Year navigation ───────────────────────────────────────── */
  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = OSTERN_YEARS.includes(prevYear);
  const hasNext = OSTERN_YEARS.includes(nextYear);

  /* ── FAQs ──────────────────────────────────────────────────── */
  const osternFAQs = getOsternFAQs(year, easterDateStr);

  /* ── JSON-LD ───────────────────────────────────────────────── */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://aktuellekw.de" },
        { "@type": "ListItem", position: 2, name: "Feiertage", item: "https://aktuellekw.de/feiertage" },
        { "@type": "ListItem", position: 3, name: `Ostern ${year}`, item: `https://aktuellekw.de/ostern/${year}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `Ostern ${year}`,
      description: `Ostern ${year} in Deutschland: Karfreitag ${formatDateDE(karfreitag)} bis Ostermontag ${formatDateDE(ostermontag)}.`,
      startDate: karfreitag.toISOString().split("T")[0],
      endDate: ostermontag.toISOString().split("T")[0],
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Deutschland",
        address: { "@type": "PostalAddress", addressCountry: "DE" },
      },
      organizer: { "@type": "Organization", name: "aktuellekw.de", url: "https://aktuellekw.de" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: osternFAQs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
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
          <Link href="/" className="hover:text-accent transition-colors">Startseite</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <Link href="/feiertage" className="hover:text-accent transition-colors">Feiertage</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Ostern {year}</span>
        </nav>

        {/* ── Year Navigation ─────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          {hasPrev ? (
            <Link href={`/ostern/${prevYear}`} className="text-sm text-accent hover:underline">
              &larr; Ostern {prevYear}
            </Link>
          ) : <span />}
          {hasNext ? (
            <Link href={`/ostern/${nextYear}`} className="text-sm text-accent hover:underline">
              Ostern {nextYear} &rarr;
            </Link>
          ) : <span />}
        </div>

        {/* ── H1 + Intro ──────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Ostern {year} in Deutschland
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            <strong className="text-text-primary">Wann ist Ostern {year}?</strong>{" "}
            Ostersonntag f&auml;llt auf den{" "}
            <strong className="text-text-primary">{easterDateStr}</strong>{" "}
            ({getDayNameDE(easter)}) in{" "}
            <strong className="text-text-primary">KW&nbsp;{easterKW}</strong>.
            Karfreitag ({formatDateDE(karfreitag)}) und Ostermontag ({formatDateDE(ostermontag)})
            sind gesetzliche Feiertage &ndash; zusammen ergibt sich ein{" "}
            <strong className="text-text-primary">langes Wochenende mit 4 freien Tagen</strong>.
          </p>

          {/* [PLACEHOLDER: SEO-Einleitungstext „Ostern {year}"] – 150–200 Wörter
              Keywords: ostern {year}, wann ist ostern, ostersonntag {year}, ostern {year} datum, osterferien
              Inhalt: Kulturelle Bedeutung von Ostern, Ostertraditionen in Deutschland,
              Überleitung zu Feiertagen, Osterferien & Brückentagen */}
        </div>

        {/* ── Hero-Box: Ostersonntag ──────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-secondary p-6 md:p-8 mb-10">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">
              Ostersonntag {year}
            </div>
            <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
              {easterDateStr}
            </div>
            <div className="text-lg text-text-secondary">
              {getDayNameDE(easter)} &middot; Kalenderwoche {easterKW}
            </div>

            {/* Countdown */}
            {year === currentYear && (
              <div className="mt-4 inline-block bg-accent/10 border border-accent/20 rounded-full px-5 py-2 text-sm">
                {easterIsToday ? (
                  <span className="text-accent font-semibold">Heute ist Ostersonntag!</span>
                ) : easterIsPast ? (
                  <span className="text-text-secondary">
                    Ostern {year} war vor{" "}
                    <strong className="text-text-primary">{Math.abs(daysUntilEaster)}</strong> Tagen
                  </span>
                ) : (
                  <span className="text-text-secondary">
                    Noch <strong className="text-accent">{daysUntilEaster}</strong>{" "}
                    {daysUntilEaster === 1 ? "Tag" : "Tage"} bis Ostern
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Ostersonntag", value: easterDateStr },
            { label: "Kalenderwoche", value: `KW ${easterKW}` },
            { label: "Gesetzl. Feiertage", value: "2" },
            { label: "Freie Tage", value: "4" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-secondary border border-border rounded-xl px-4 py-3 text-center"
            >
              <div className="text-lg md:text-xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-text-secondary mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════
            CLUSTER 2: Feiertage (86.300 SV/Mo)
            ══════════════════════════════════════════════════════ */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Oster-Feiertage {year}: Karfreitag, Ostersonntag &amp; Ostermontag
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Von <strong className="text-text-primary">Gr&uuml;ndonnerstag</strong> bis{" "}
            <strong className="text-text-primary">Ostermontag</strong> &ndash; alle
            f&uuml;nf Ostertage {year} im &Uuml;berblick. Karfreitag und Ostermontag
            sind <strong className="text-text-primary">gesetzliche Feiertage</strong>{" "}
            in allen 16 Bundesl&auml;ndern.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Feiertag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Wochentag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">KW</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {osterFeiertage.map((h, i) => {
                  const isPast = year === currentYear && h.date.getTime() < todayUTC.getTime();
                  const isToday = year === currentYear && h.date.getTime() === todayUTC.getTime();
                  return (
                    <tr
                      key={i}
                      className={`border-b border-border last:border-b-0 ${
                        isToday ? "bg-accent/10" : year === currentYear && !isPast && !easterIsPast ? "bg-accent/5" : isPast ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                        {h.name}
                        {isToday && (
                          <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">heute</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateDE(h.date)}</td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{getDayNameDE(h.date)}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        <Link href={`/kw/${getISOWeekNumber(h.date)}-${year}`} className="text-accent hover:underline">
                          KW&nbsp;{getISOWeekNumber(h.date)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-xs">
                        {h.gesetzlich ? (
                          <span className="inline-flex items-center gap-1 text-green-500 font-medium">
                            <span>&#10003;</span> {h.info}
                          </span>
                        ) : (
                          <span className="text-text-secondary">{h.info}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            Feiertage April {year}: Karfreitag ({formatDateDE(karfreitag)}) und
            Ostermontag ({formatDateDE(ostermontag)}) sind bundesweite gesetzliche Feiertage.
          </p>
        </div>

        {/* ── Bewegliche Feiertage ────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Bewegliche Feiertage {year} &ndash; abh&auml;ngig von Ostern
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Diese Feiertage berechnen sich aus dem Osterdatum. Der Abstand zu
            Ostersonntag ist jedes Jahr gleich, nur das konkrete Datum &auml;ndert sich.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Feiertag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Wochentag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">KW</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Tage</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Bundesl&auml;nder</th>
                </tr>
              </thead>
              <tbody>
                {beweglicheFeiertage.map((h, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{h.name}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateDE(h.date)}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{getDayNameDE(h.date)}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      <Link href={`/kw/${getISOWeekNumber(h.date)}-${year}`} className="text-accent hover:underline">
                        KW&nbsp;{getISOWeekNumber(h.date)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-center">
                      {h.offset > 0 ? `+${h.offset}` : h.offset}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {h.states === "bundesweit" ? (
                        <span className="font-medium text-text-primary">alle</span>
                      ) : h.states}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            CLUSTER 3: Osterferien (345.080 SV/Mo)
            ══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Osterferien {year} &ndash; alle Bundesl&auml;nder im &Uuml;berblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            <strong className="text-text-primary">Wann sind Osterferien {year}?</strong>{" "}
            Die Schulferien rund um Ostern variieren je nach Bundesland.
            Hier die Termine f&uuml;r alle 16 Bundesl&auml;nder:
          </p>

          {osterferienData.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Bundesland</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Beginn</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Ende</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Dauer</th>
                  </tr>
                </thead>
                <tbody>
                  {osterferienData.map((d) => (
                    <tr key={d.code} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                        <Link
                          href={`/schulferien/${year}/${d.slug}`}
                          className="text-accent hover:underline"
                        >
                          {d.bundesland}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatDateShort(d.start)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatDateShort(d.end)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {d.dauer} Tage
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary">
              F&uuml;r {year} liegen noch keine Osterferien-Termine vor.
            </div>
          )}

          {osterferienData.length > 0 && (
            <p className="text-text-secondary text-xs mt-2">
              Alle Angaben ohne Gew&auml;hr. Quelle: Kultusministerkonferenz.
              Detaillierte Ferienkalender unter{" "}
              <Link href={`/schulferien/${year}`} className="text-accent hover:underline">
                Schulferien {year}
              </Link>.
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════
            CLUSTER 4: Brückentage & Urlaub (900 SV/Mo)
            ══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Br&uuml;ckentage Ostern {year}: So planst du freie Tage
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mit <strong className="text-text-primary">wenig Urlaubstagen</strong>{" "}
            das Maximum an Freizeit herausholen &ndash; so nutzt du die Feiertage rund
            um Ostern und die Folge-Feiertage optimal:
          </p>

          {/* Immer: Oster-Grundinfo */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mb-4">
            <strong className="text-text-primary">Basispaket Ostern:</strong>{" "}
            Karfreitag + Wochenende + Ostermontag = <strong className="text-accent">4 freie Tage</strong>{" "}
            ohne einen einzigen Urlaubstag.
          </div>

          {osterBrueckentage.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Feiertag</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Wochentag</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Br&uuml;ckentag-Tipp</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Urlaub</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Frei</th>
                  </tr>
                </thead>
                <tbody>
                  {osterBrueckentage.map((b, i) => (
                    <tr key={i} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{b.feiertag}</td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateDE(b.feiertagDate)}</td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{b.wochentag}</td>
                      <td className="px-4 py-3 text-text-secondary">{b.tipp}</td>
                      <td className="px-4 py-3 text-accent font-semibold text-center">{b.urlaubstage}</td>
                      <td className="px-4 py-3 text-text-primary font-semibold text-center">{b.freieTage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary">
              Rund um Ostern {year} ergeben sich keine zus&auml;tzlichen Br&uuml;ckentage
              bei den Folge-Feiertagen. Das Oster-Wochenende selbst bringt aber immer 4 freie Tage.
            </div>
          )}
        </div>

        {/* ── Warum ändert sich Ostern? ───────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Warum f&auml;llt Ostern jedes Jahr auf ein anderes Datum?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            {/* [PLACEHOLDER: SEO-Erklärtext „Warum ändert sich Ostern?"] – 100–150 Wörter
                Keywords: osterdatum berechnung, bewegliche feiertage, frühlingsvollmond, computus
                Inhalt: Erklärung Computus, Konzil von Nicäa 325, Frühlingsvollmond-Regel,
                frühestes/spätestes Osterdatum (22. März – 25. April),
                Bezug zu kirchlichen Feiertagen, Gauß'sche Osterformel */}
            <p>
              Ostern ist ein <strong className="text-text-primary">beweglicher Feiertag</strong>,
              dessen Datum sich nach dem Mondkalender richtet. Die Regel lautet:
              Ostersonntag ist der erste Sonntag nach dem ersten Vollmond im
              Fr&uuml;hling (nach dem 21.&nbsp;M&auml;rz). Dadurch kann Ostern
              fr&uuml;hestens am 22.&nbsp;M&auml;rz und sp&auml;testens am
              25.&nbsp;April liegen.
            </p>
          </div>
        </div>

        {/* ── Ostern-Vergleichstabelle ────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Ostersonntag im Jahresvergleich
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            So &auml;ndert sich das Osterdatum in den Jahren rund um {year}:
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Jahr</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Ostersonntag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Wochentag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">KW</th>
                </tr>
              </thead>
              <tbody>
                {osterVergleich.map((entry) => (
                  <tr
                    key={entry.year}
                    className={`border-b border-border last:border-b-0 ${entry.isCurrent ? "bg-accent/10 font-semibold" : ""}`}
                  >
                    <td className="px-4 py-3 text-text-primary">
                      {entry.isCurrent ? (
                        <span className="text-accent">{entry.year}</span>
                      ) : OSTERN_YEARS.includes(entry.year) ? (
                        <Link href={`/ostern/${entry.year}`} className="text-accent hover:underline">{entry.year}</Link>
                      ) : entry.year}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{formatDateDE(entry.date)}</td>
                    <td className="px-4 py-3 text-text-secondary">{getDayNameDE(entry.date)}</td>
                    <td className="px-4 py-3 text-text-secondary">KW&nbsp;{entry.kw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Orthodoxes Ostern ────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Orthodoxes Ostern {year}
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              <strong className="text-text-primary">Orthodoxes Ostern {year}</strong>{" "}
              f&auml;llt auf den{" "}
              <strong className="text-text-primary">{formatDateDE(orthodoxEaster)}</strong>{" "}
              ({getDayNameDE(orthodoxEaster)}, KW&nbsp;{getISOWeekNumber(orthodoxEaster)}).
              {sameDate ? (
                <> In {year} fallen westliches und orthodoxes Ostern auf dasselbe Datum.</>
              ) : (
                <>
                  {" "}Das sind{" "}
                  <strong className="text-text-primary">
                    {Math.round((orthodoxEaster.getTime() - easter.getTime()) / 86400000)} Tage
                  </strong>{" "}
                  nach dem westlichen Ostersonntag ({easterDateStr}).
                </>
              )}
            </p>
            <p>
              Der Unterschied entsteht, weil die orthodoxen Kirchen das Osterdatum
              nach dem julianischen Kalender berechnen, w&auml;hrend die westlichen
              Kirchen den gregorianischen Kalender verwenden. Im 21.&nbsp;Jahrhundert
              betr&auml;gt die Differenz 13&nbsp;Tage.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            CLUSTER 5: Tradition & Bräuche (12.890 SV/Mo)
            ══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Osterbr&auml;uche &amp; Traditionen in Deutschland
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            {/* [PLACEHOLDER: SEO-Text „Osterbräuche & Traditionen"] – 150–200 Wörter
                Keywords: osterbräuche deutschland, ostereier bemalen, ostertraditionen
                Inhalt: Ostereier suchen & bemalen, Osterfeuer, Osterlamm, Osterhase-Brauch,
                regionale Besonderheiten (Osterreiten in der Lausitz, Eierlaufen etc.),
                kirchliche Traditionen (Karfreitags-Prozessionen, Osternacht),
                Verlinkung zu weiterführenden Inhalten */}
            <p>
              Ostern ist nach Weihnachten das zweitwichtigste Fest in Deutschland
              und wird mit vielf&auml;ltigen Br&auml;uchen gefeiert. Vom{" "}
              <strong className="text-text-primary">Ostereier bemalen</strong> und
              Verstecken &uuml;ber Osterlammessen bis hin zu regionalen Besonderheiten
              wie dem Osterfeuer &ndash; die Traditionen variieren je nach Region und
              Konfession.
            </p>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zu Ostern {year}
          </h2>
          <div className="space-y-2.5">
            {osternFAQs.map((faq, i) => (
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

        {/* ── SEO-Abschlusstext Placeholder ───────────────────── */}
        <div className="mt-14">
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            {/* [PLACEHOLDER: SEO-Abschlusstext] – 60–80 Wörter
                Keywords: ostern {year} deutschland, osterfeiertage, osterferien {year}
                Inhalt: Zusammenfassung, Verweis auf Feiertage-Übersicht, KW-Seiten & Schulferien */}
          </div>
        </div>

        {/* ── Year Navigation (bottom) ─────────────────────────── */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Link href={`/ostern/${prevYear}`} className="text-sm text-accent hover:underline">
              &larr; Ostern {prevYear}
            </Link>
          ) : <span />}
          {hasNext ? (
            <Link href={`/ostern/${nextYear}`} className="text-sm text-accent hover:underline">
              Ostern {nextYear} &rarr;
            </Link>
          ) : <span />}
        </div>

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">&larr; Aktuelle KW</Link>
          <Link href="/feiertage" className="text-accent hover:underline">Feiertage &Uuml;bersicht &rarr;</Link>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">Feiertage {year} &rarr;</Link>
          <Link href={`/schulferien/${year}`} className="text-accent hover:underline">Schulferien {year} &rarr;</Link>
          <Link href="/faq" className="text-accent hover:underline">FAQ &rarr;</Link>
          <Link href="/kalenderwoche" className="text-accent hover:underline">Kalenderwochen {year} &rarr;</Link>
        </div>
      </section>
    </>
  );
}
