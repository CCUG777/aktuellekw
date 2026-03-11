import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_YEARS } from "@/lib/constants";
import {
  getEasterDate,
  addDays,
  getFeiertageFuerJahr,
  getBrueckentage,
  getISOWeekNumber,
  formatDateDE,
  getDayNameDE,
} from "@/lib/feiertage";

export const revalidate = 86400;

/* ── Valid years ───────────────────────────────────────────────── */
const OSTERN_YEARS = CONTENT_YEARS;

/* ── Static Params ─────────────────────────────────────────────── */
export function generateStaticParams() {
  return OSTERN_YEARS.map((y) => ({ year: String(y) }));
}

/* ── Ostern-spezifische FAQ ────────────────────────────────────── */
const OSTERN_FAQS = [
  {
    question: "Wann ist Ostern 2026?",
    answer:
      "Ostersonntag f\u00e4llt 2026 auf den 5. April. Karfreitag ist am 3. April und Ostermontag am 6. April 2026. Ostern liegt damit in Kalenderwoche 14.",
  },
  {
    question: "Ist Ostersonntag ein gesetzlicher Feiertag?",
    answer:
      "Nein, Ostersonntag ist in Deutschland kein gesetzlicher Feiertag. Gesetzliche Feiertage rund um Ostern sind nur Karfreitag und Ostermontag. Ostersonntag ist allerdings ein Sonntag und damit in der Regel ohnehin arbeitsfrei.",
  },
  {
    question: "Warum \u00e4ndert sich das Osterdatum jedes Jahr?",
    answer:
      'Ostern ist ein beweglicher Feiertag, der nach einer astronomischen Regel bestimmt wird: Ostersonntag ist der erste Sonntag nach dem ersten Fr\u00fchlingsvollmond. Dadurch kann Ostern fr\u00fchestens am 22. M\u00e4rz und sp\u00e4testens am 25. April stattfinden. Diese Regel wurde 325 n. Chr. auf dem Konzil von Nic\u00e4a festgelegt.',
  },
  {
    question: "Welche Feiertage h\u00e4ngen vom Osterdatum ab?",
    answer:
      "Insgesamt richten sich 6 Feiertage nach dem Osterdatum: Karfreitag (2 Tage vor Ostern), Ostermontag (1 Tag nach Ostern), Christi Himmelfahrt (39 Tage nach Ostern), Pfingstsonntag (49 Tage) und Pfingstmontag (50 Tage nach Ostern) sowie Fronleichnam (60 Tage nach Ostern, nur in 6 Bundesl\u00e4ndern).",
  },
  {
    question: "Wie wird das Osterdatum berechnet?",
    answer:
      'Die Berechnung des Osterdatums (lat. "Computus") basiert auf dem Mondkalender. Zuerst wird der Fr\u00fchlingsvollmond bestimmt \u2013 der erste Vollmond am oder nach dem 21. M\u00e4rz. Der darauffolgende Sonntag ist Ostersonntag. Moderne Algorithmen wie die Gau\u00df\u2019sche Osterformel oder der anonyme gregorianische Algorithmus berechnen das Datum rein rechnerisch.',
  },
  {
    question: "Wie viele freie Tage gibt es an Ostern?",
    answer:
      "Durch Karfreitag (Freitag) und Ostermontag (Montag) ergibt sich jedes Jahr automatisch ein langes Wochenende mit 4 freien Tagen \u2013 ganz ohne Urlaubstage. Das macht Ostern zu einem der beliebtesten Reisezeitr\u00e4ume in Deutschland.",
  },
];

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

  const easter = getEasterDate(year);
  const easterDateStr = formatDateDE(easter);

  const title = `Ostern ${year} \u2013 Datum, Feiertage & Br\u00fcckentage`;
  const description = `Ostern ${year}: Ostersonntag am ${easterDateStr}. Karfreitag, Ostermontag & alle beweglichen Feiertage mit KW & Br\u00fcckentage-Tipps.`;
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
  const karfreitag = addDays(easter, -2);
  const ostermontag = addDays(easter, 1);
  const himmelfahrt = addDays(easter, 39);
  const pfingstsonntag = addDays(easter, 49);
  const pfingstmontag = addDays(easter, 50);
  const fronleichnam = addDays(easter, 60);

  const easterKW = getISOWeekNumber(easter);

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
      name: "Karfreitag",
      date: karfreitag,
      gesetzlich: true,
      info: "bundesweit",
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
    {
      name: "Karfreitag",
      date: karfreitag,
      offset: -2,
      states: "bundesweit",
    },
    {
      name: "Ostermontag",
      date: ostermontag,
      offset: 1,
      states: "bundesweit",
    },
    {
      name: "Christi Himmelfahrt",
      date: himmelfahrt,
      offset: 39,
      states: "bundesweit",
    },
    {
      name: "Pfingstsonntag",
      date: pfingstsonntag,
      offset: 49,
      states: "kein Feiertag",
    },
    {
      name: "Pfingstmontag",
      date: pfingstmontag,
      offset: 50,
      states: "bundesweit",
    },
    {
      name: "Fronleichnam",
      date: fronleichnam,
      offset: 60,
      states: "BW, BY, HE, NW, RP, SL",
    },
  ];

  /* ── Ostern-Vergleich (5 Jahre) ────────────────────────────── */
  const comparisonYears = [year - 2, year - 1, year, year + 1, year + 2];
  const osterVergleich = comparisonYears.map((y) => {
    const e = getEasterDate(y);
    return {
      year: y,
      date: e,
      kw: getISOWeekNumber(e),
      isCurrent: y === year,
    };
  });

  /* ── Year navigation ───────────────────────────────────────── */
  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = OSTERN_YEARS.includes(prevYear);
  const hasNext = OSTERN_YEARS.includes(nextYear);

  /* ── JSON-LD ───────────────────────────────────────────────── */
  const jsonLd = [
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
          name: "Feiertage",
          item: "https://aktuellekw.de/feiertage",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Ostern ${year}`,
          item: `https://aktuellekw.de/ostern/${year}`,
        },
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
        address: {
          "@type": "PostalAddress",
          addressCountry: "DE",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: OSTERN_FAQS.map((faq) => ({
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
          <span className="text-text-primary">Ostern {year}</span>
        </nav>

        {/* ── Year Navigation ─────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          {hasPrev ? (
            <Link
              href={`/ostern/${prevYear}`}
              className="text-sm text-accent hover:underline"
            >
              &larr; Ostern {prevYear}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/ostern/${nextYear}`}
              className="text-sm text-accent hover:underline"
            >
              Ostern {nextYear} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── H1 + Intro ──────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Ostern {year} in Deutschland
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            <strong className="text-text-primary">Ostersonntag {year}</strong>{" "}
            f&auml;llt auf den{" "}
            <strong className="text-text-primary">
              {formatDateDE(easter)}
            </strong>{" "}
            ({getDayNameDE(easter)}) in{" "}
            <strong className="text-text-primary">KW&nbsp;{easterKW}</strong>.
            Karfreitag und Ostermontag sind gesetzliche Feiertage &ndash;
            zusammen ergibt sich ein langes Wochenende mit 4 freien Tagen.
          </p>

          {/* [PLACEHOLDER: SEO-Einleitungstext „Ostern {year}"] – 150–200 Wörter
              Keywords: ostern {year}, wann ist ostern, ostersonntag {year}, osterferien
              Inhalt: Kulturelle Bedeutung von Ostern, Ostertraditionen in Deutschland,
              Überleitung zu Daten & Brückentagen */}
        </div>

        {/* ── Hero-Box: Ostersonntag ──────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-secondary p-6 md:p-8 mb-10">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">
              Ostersonntag {year}
            </div>
            <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
              {formatDateDE(easter)}
            </div>
            <div className="text-lg text-text-secondary">
              {getDayNameDE(easter)} &middot; Kalenderwoche {easterKW}
            </div>

            {/* Countdown */}
            {year === currentYear && (
              <div className="mt-4 inline-block bg-accent/10 border border-accent/20 rounded-full px-5 py-2 text-sm">
                {easterIsToday ? (
                  <span className="text-accent font-semibold">
                    🥚 Heute ist Ostersonntag!
                  </span>
                ) : easterIsPast ? (
                  <span className="text-text-secondary">
                    Ostern {year} war vor{" "}
                    <strong className="text-text-primary">
                      {Math.abs(daysUntilEaster)}
                    </strong>{" "}
                    Tagen
                  </span>
                ) : (
                  <span className="text-text-secondary">
                    Noch{" "}
                    <strong className="text-accent">
                      {daysUntilEaster}
                    </strong>{" "}
                    {daysUntilEaster === 1 ? "Tag" : "Tage"} bis Ostern
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Oster-Feiertage Tabelle ─────────────────────────── */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Oster-Feiertage {year}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die drei Ostertage {year} im &Uuml;berblick &ndash; Karfreitag und
            Ostermontag sind <strong className="text-text-primary">gesetzliche Feiertage</strong>{" "}
            in allen 16 Bundesl&auml;ndern.
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {osterFeiertage.map((h, i) => {
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
                          : year === currentYear && !isPast && !easterIsPast
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
        </div>

        {/* ── Bewegliche Feiertage ────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Bewegliche Feiertage {year} (abh&auml;ngig von Ostern)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Diese Feiertage berechnen sich aus dem Osterdatum. Der Abstand zu
            Ostersonntag ist jedes Jahr gleich, nur das Datum &auml;ndert sich.
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
                    Tage ab Ostern
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Bundesl&auml;nder
                  </th>
                </tr>
              </thead>
              <tbody>
                {beweglicheFeiertage.map((h, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                      {h.name}
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
                    <td className="px-4 py-3 text-text-secondary text-center">
                      {h.offset > 0 ? `+${h.offset}` : h.offset}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {h.states === "bundesweit" ? (
                        <span className="font-medium text-text-primary">
                          alle
                        </span>
                      ) : (
                        h.states
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Brückentage rund um Ostern ──────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Br&uuml;ckentage rund um Ostern {year}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            So holen Sie mit <strong className="text-text-primary">wenig Urlaubstagen</strong>{" "}
            das Maximum an freien Tagen rund um Ostern und die Folge-Feiertage heraus:
          </p>
          {osterBrueckentage.length > 0 ? (
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
                  {osterBrueckentage.map((b, i) => (
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
              Rund um Ostern {year} ergeben sich keine klassischen
              Br&uuml;ckentage bei den bundesweiten Feiertagen. Karfreitag und
              Ostermontag bilden jedoch immer ein langes Wochenende (4 Tage
              frei).
            </div>
          )}
        </div>

        {/* ── SEO-Erklärtext Placeholder ──────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Warum f&auml;llt Ostern jedes Jahr auf ein anderes Datum?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            {/* [PLACEHOLDER: SEO-Erklärtext „Warum ändert sich Ostern?"] – 100–150 Wörter
                Keywords: osterdatum berechnung, bewegliche feiertage, frühlingsvollmond
                Inhalt: Erklärung Computus, Konzil von Nicäa, Frühlingsvollmond-Regel,
                frühestes/spätestes Osterdatum, Bezug zu kirchlichen Feiertagen */}
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
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Jahr
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Ostersonntag
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Wochentag
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    KW
                  </th>
                </tr>
              </thead>
              <tbody>
                {osterVergleich.map((entry) => (
                  <tr
                    key={entry.year}
                    className={`border-b border-border last:border-b-0 ${
                      entry.isCurrent ? "bg-accent/10 font-semibold" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-text-primary">
                      {entry.isCurrent ? (
                        <span className="text-accent">{entry.year}</span>
                      ) : OSTERN_YEARS.includes(entry.year) ? (
                        <Link
                          href={`/ostern/${entry.year}`}
                          className="text-accent hover:underline"
                        >
                          {entry.year}
                        </Link>
                      ) : (
                        entry.year
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {formatDateDE(entry.date)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {getDayNameDE(entry.date)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      KW&nbsp;{entry.kw}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zu Ostern
          </h2>
          <div className="space-y-2.5">
            {OSTERN_FAQS.map((faq, i) => (
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
                Keywords: ostern {year} deutschland, osterfeiertage, osterferien
                Inhalt: Zusammenfassung, Verweis auf Feiertage-Übersicht & KW-Seiten */}
          </div>
        </div>

        {/* ── Year Navigation (bottom) ─────────────────────────── */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Link
              href={`/ostern/${prevYear}`}
              className="text-sm text-accent hover:underline"
            >
              &larr; Ostern {prevYear}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/ostern/${nextYear}`}
              className="text-sm text-accent hover:underline"
            >
              Ostern {nextYear} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/feiertage" className="text-accent hover:underline">
            Feiertage &Uuml;bersicht &rarr;
          </Link>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
            Feiertage {year} &rarr;
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ &rarr;
          </Link>
          <Link href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {year} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
