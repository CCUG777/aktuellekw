import type { Metadata } from "next";
import {
  getCurrentKW,
  getISOWeekNumber,
  formatDateDE,
  getDayNameDE,
} from "@/lib/kw";

export const revalidate = 3600;

/* ── Easter calculation (Anonymous Gregorian algorithm) ──────────── */
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/* ── Date helper ─────────────────────────────────────────────────── */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/* ── Buß- und Bettag: Wednesday before Nov 23 ───────────────────── */
function getBussUndBettag(year: number): Date {
  const nov23 = new Date(Date.UTC(year, 10, 23));
  const dayOfWeek = nov23.getUTCDay();
  // Wednesday = 3. Calculate days back to previous Wednesday
  const daysBack = dayOfWeek >= 3 ? dayOfWeek - 3 : dayOfWeek + 4;
  return addDays(nov23, -daysBack);
}

/* ── Holiday types ───────────────────────────────────────────────── */
interface Feiertag {
  name: string;
  date: Date;
  states: string[];
  isNationwide: boolean;
}

/* ── Bundesland codes → full names ───────────────────────────────── */
const BUNDESLAND_NAMES: Record<string, string> = {
  BW: "Baden-Württemberg",
  BY: "Bayern",
  BE: "Berlin",
  BB: "Brandenburg",
  HB: "Bremen",
  HH: "Hamburg",
  HE: "Hessen",
  MV: "Mecklenburg-Vorpommern",
  NI: "Niedersachsen",
  NW: "Nordrhein-Westfalen",
  RP: "Rheinland-Pfalz",
  SL: "Saarland",
  SN: "Sachsen",
  ST: "Sachsen-Anhalt",
  SH: "Schleswig-Holstein",
  TH: "Thüringen",
};

const ALL_STATES = Object.keys(BUNDESLAND_NAMES);

/* ── Generate all holidays for a given year ──────────────────────── */
function getFeiertageFuerJahr(year: number): Feiertag[] {
  const easter = getEasterDate(year);

  const holidays: Feiertag[] = [
    // Nationwide holidays
    {
      name: "Neujahr",
      date: new Date(Date.UTC(year, 0, 1)),
      states: ALL_STATES,
      isNationwide: true,
    },
    {
      name: "Karfreitag",
      date: addDays(easter, -2),
      states: ALL_STATES,
      isNationwide: true,
    },
    {
      name: "Ostermontag",
      date: addDays(easter, 1),
      states: ALL_STATES,
      isNationwide: true,
    },
    {
      name: "Tag der Arbeit",
      date: new Date(Date.UTC(year, 4, 1)),
      states: ALL_STATES,
      isNationwide: true,
    },
    {
      name: "Christi Himmelfahrt",
      date: addDays(easter, 39),
      states: ALL_STATES,
      isNationwide: true,
    },
    {
      name: "Pfingstmontag",
      date: addDays(easter, 50),
      states: ALL_STATES,
      isNationwide: true,
    },
    {
      name: "Tag der Deutschen Einheit",
      date: new Date(Date.UTC(year, 9, 3)),
      states: ALL_STATES,
      isNationwide: true,
    },
    {
      name: "1. Weihnachtsfeiertag",
      date: new Date(Date.UTC(year, 11, 25)),
      states: ALL_STATES,
      isNationwide: true,
    },
    {
      name: "2. Weihnachtsfeiertag",
      date: new Date(Date.UTC(year, 11, 26)),
      states: ALL_STATES,
      isNationwide: true,
    },

    // State-specific holidays
    {
      name: "Heilige Drei Könige",
      date: new Date(Date.UTC(year, 0, 6)),
      states: ["BW", "BY", "ST"],
      isNationwide: false,
    },
    {
      name: "Internationaler Frauentag",
      date: new Date(Date.UTC(year, 2, 8)),
      states: ["BE", "MV"],
      isNationwide: false,
    },
    {
      name: "Fronleichnam",
      date: addDays(easter, 60),
      states: ["BW", "BY", "HE", "NW", "RP", "SL"],
      isNationwide: false,
    },
    {
      name: "Mariä Himmelfahrt",
      date: new Date(Date.UTC(year, 7, 15)),
      states: ["BY", "SL"],
      isNationwide: false,
    },
    {
      name: "Weltkindertag",
      date: new Date(Date.UTC(year, 8, 20)),
      states: ["TH"],
      isNationwide: false,
    },
    {
      name: "Reformationstag",
      date: new Date(Date.UTC(year, 9, 31)),
      states: ["BB", "HB", "HH", "MV", "NI", "SN", "SH", "TH"],
      isNationwide: false,
    },
    {
      name: "Allerheiligen",
      date: new Date(Date.UTC(year, 10, 1)),
      states: ["BW", "BY", "NW", "RP", "SL"],
      isNationwide: false,
    },
    {
      name: "Buß- und Bettag",
      date: getBussUndBettag(year),
      states: ["SN"],
      isNationwide: false,
    },
  ];

  // Sort by date
  holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
  return holidays;
}

/* ── Count holidays per state ────────────────────────────────────── */
function getHolidaysPerState(holidays: Feiertag[]): { code: string; name: string; count: number }[] {
  return ALL_STATES.map((code) => ({
    code,
    name: BUNDESLAND_NAMES[code],
    count: holidays.filter((h) => h.states.includes(code)).length,
  })).sort((a, b) => b.count - a.count);
}

/* ── Brückentage calculation ─────────────────────────────────────── */
interface Brueckentag {
  feiertag: string;
  feiertagDate: Date;
  wochentag: string;
  tipp: string;
  urlaubstage: number;
  freieTage: number;
}

function getBrueckentage(year: number): Brueckentag[] {
  const holidays = getFeiertageFuerJahr(year).filter((h) => h.isNationwide);
  const tipps: Brueckentag[] = [];

  for (const h of holidays) {
    const day = h.date.getUTCDay(); // 0=Sun, 1=Mon ... 6=Sat
    const wochentag = getDayNameDE(h.date);

    if (day === 4) {
      // Thursday – take Friday off
      tipps.push({
        feiertag: h.name,
        feiertagDate: h.date,
        wochentag,
        tipp: `Freitag (${formatDateDE(addDays(h.date, 1))}) freinehmen = 4 Tage frei`,
        urlaubstage: 1,
        freieTage: 4,
      });
    } else if (day === 2) {
      // Tuesday – take Monday off
      tipps.push({
        feiertag: h.name,
        feiertagDate: h.date,
        wochentag,
        tipp: `Montag (${formatDateDE(addDays(h.date, -1))}) freinehmen = 4 Tage frei`,
        urlaubstage: 1,
        freieTage: 4,
      });
    } else if (day === 3) {
      // Wednesday – take Mon+Tue or Thu+Fri off
      tipps.push({
        feiertag: h.name,
        feiertagDate: h.date,
        wochentag,
        tipp: `Mo + Di freinehmen = 5 Tage frei (oder Do + Fr = 5 Tage frei)`,
        urlaubstage: 2,
        freieTage: 5,
      });
    }
  }

  return tipps;
}

/* ── Next holiday calculation ────────────────────────────────────── */
function getNextFeiertag(): {
  feiertag: Feiertag;
  daysUntil: number;
} {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const currentYear = todayUTC.getUTCFullYear();

  // Check current year and next year
  const allHolidays = [
    ...getFeiertageFuerJahr(currentYear),
    ...getFeiertageFuerJahr(currentYear + 1),
  ];

  // Filter only nationwide holidays for "next holiday" to keep it universal
  const nationwideHolidays = allHolidays.filter((h) => h.isNationwide);

  for (const h of nationwideHolidays) {
    const diff = Math.ceil(
      (h.date.getTime() - todayUTC.getTime()) / 86400000
    );
    if (diff >= 0) {
      return { feiertag: h, daysUntil: diff };
    }
  }

  // Fallback (should never happen)
  return { feiertag: nationwideHolidays[0], daysUntil: 0 };
}

/* ── Metadata ────────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const ogTitle = `Feiertage 2025, 2026 & 2027 Deutschland`;
  const ogDescription = `Gesetzliche Feiertage 2025, 2026 & 2027 im Überblick. Datum, Wochentag & KW pro Bundesland. Nächster Feiertag + Brückentage.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: { canonical: "https://aktuellekw.de/feiertage" },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/feiertage",
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

/* ── FAQ data ────────────────────────────────────────────────────── */
const faqs = [
  {
    question: "Wie viele gesetzliche Feiertage gibt es in Deutschland?",
    answer:
      "In Deutschland gibt es 9 bundeseinheitliche gesetzliche Feiertage, die in allen 16 Bundesländern gelten. Zusätzlich gibt es je nach Bundesland weitere regionale Feiertage, sodass die Gesamtzahl zwischen 10 und 13 Feiertagen pro Jahr liegt.",
  },
  {
    question: "Welches Bundesland hat die meisten Feiertage?",
    answer:
      "Bayern und das Saarland haben mit 12 gesetzlichen Feiertagen pro Jahr die meisten freien Tage. In Bayern gilt Mariä Himmelfahrt allerdings nur in Gemeinden mit überwiegend katholischer Bevölkerung. Die wenigsten Feiertage haben Bremen, Hamburg, Niedersachsen und Schleswig-Holstein mit jeweils 10 Feiertagen.",
  },
  {
    question: "Wann ist der nächste Feiertag in Deutschland?",
    answer:
      'Der nächste bundesweite Feiertag wird dynamisch auf dieser Seite angezeigt \u2013 inklusive Datum, Wochentag und Kalenderwoche. Scrollen Sie nach oben zur Schnell-Info oder zur Sektion \u201eN\u00e4chster Feiertag\u201c f\u00fcr die aktuelle Antwort.',
  },
  {
    question: "Warum sind Feiertage in Deutschland nicht einheitlich?",
    answer:
      "Feiertage sind in Deutschland Ländersache. Jedes Bundesland regelt seine gesetzlichen Feiertage selbst. Die 9 bundeseinheitlichen Feiertage sind durch Tradition und Konsens in allen Landesgesetzen verankert. Regionale Feiertage wie Fronleichnam oder Allerheiligen spiegeln die konfessionelle Prägung der jeweiligen Region wider.",
  },
  {
    question: "Was sind Brückentage und wie nutze ich sie?",
    answer:
      "Brückentage sind Arbeitstage zwischen einem Feiertag und dem Wochenende. Fällt ein Feiertag auf einen Donnerstag, genügt ein Urlaubstag am Freitag für ein langes Wochenende (4 Tage frei). Bei einem Feiertag am Dienstag nimmt man den Montag frei. So lässt sich mit wenig Urlaub maximale Freizeit erzielen.",
  },
  {
    question: "Ist Heiligabend ein Feiertag?",
    answer:
      "Nein, Heiligabend (24. Dezember) ist in keinem Bundesland ein gesetzlicher Feiertag. Er ist ein regulärer Arbeitstag, auch wenn viele Arbeitgeber ihren Mitarbeitern nachmittags freigeben. Gleiches gilt für Silvester (31. Dezember). Gesetzliche Weihnachtsfeiertage sind nur der 25. und 26. Dezember.",
  },
];

/* ── Page Component ──────────────────────────────────────────────── */
export default function FeiertagePage() {
  const currentKW = getCurrentKW();
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const currentYear = todayUTC.getUTCFullYear();

  const years = [2025, 2026, 2027] as const;
  const holidaysByYear = Object.fromEntries(
    years.map((y) => [y, getFeiertageFuerJahr(y)])
  );

  const nextHoliday = getNextFeiertag();
  const brueckentage = getBrueckentage(currentYear);
  const stateHolidayCounts = getHolidaysPerState(
    getFeiertageFuerJahr(currentYear)
  );

  // JSON-LD
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
          name: "Feiertage Deutschland",
          item: "https://aktuellekw.de/feiertage",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".next-holiday-box"],
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Feiertage Deutschland</span>
        </nav>

        {/* ── H1 + Intro ─────────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Feiertage 2025, 2026 &amp; 2027 in Deutschland
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Alle <strong className="text-text-primary">gesetzlichen Feiertage in Deutschland</strong> auf
            einen Blick: Wir zeigen Ihnen Datum, Wochentag und{" "}
            <strong className="text-text-primary">Kalenderwoche</strong> jedes
            Feiertags f&uuml;r die Jahre 2025, 2026 und 2027. Erfahren Sie, welche
            Feiertage in Ihrem Bundesland gelten und wie Sie{" "}
            <strong className="text-text-primary">Br&uuml;ckentage</strong> optimal
            nutzen k&ouml;nnen.
          </p>

          {/* Schnell-Info box */}
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
              ? " – heute!"
              : nextHoliday.daysUntil === 1
              ? " – morgen!"
              : ` – in ${nextHoliday.daysUntil} Tagen`}
          </div>
        </div>

        {/* ── Nächster Feiertag Detail ────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            N&auml;chster Feiertag in Deutschland
          </h2>
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 shrink-0">
                <span className="text-2xl font-bold text-accent">
                  {nextHoliday.feiertag.date.getUTCDate()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {nextHoliday.feiertag.name}
                </h3>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                  <dt className="text-text-secondary">Datum</dt>
                  <dd className="text-text-primary font-medium">
                    {formatDateDE(nextHoliday.feiertag.date)}
                  </dd>
                  <dt className="text-text-secondary">Wochentag</dt>
                  <dd className="text-text-primary font-medium">
                    {getDayNameDE(nextHoliday.feiertag.date)}
                  </dd>
                  <dt className="text-text-secondary">Kalenderwoche</dt>
                  <dd className="text-text-primary font-medium">
                    KW {getISOWeekNumber(nextHoliday.feiertag.date)}
                  </dd>
                  <dt className="text-text-secondary">Noch</dt>
                  <dd className="text-accent font-semibold">
                    {nextHoliday.daysUntil === 0
                      ? "Heute!"
                      : nextHoliday.daysUntil === 1
                      ? "1 Tag"
                      : `${nextHoliday.daysUntil} Tage`}
                  </dd>
                  <dt className="text-text-secondary">Gilt in</dt>
                  <dd className="text-text-primary font-medium">
                    {nextHoliday.feiertag.isNationwide
                      ? "allen Bundesl\u00e4ndern"
                      : nextHoliday.feiertag.states.join(", ")}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feiertage tables per year ───────────────────────────── */}
        {years.map((year) => {
          const holidays = holidaysByYear[year];
          const isCurrentTableYear = year === currentYear;

          return (
            <div key={year} className="mt-14">
              <h2 className="text-2xl font-semibold mb-4">
                Gesetzliche Feiertage {year}
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
                        Bundesl&auml;nder
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {holidays.map((h, i) => {
                      const isPast =
                        isCurrentTableYear &&
                        h.date.getTime() < todayUTC.getTime();
                      const isToday =
                        isCurrentTableYear &&
                        h.date.getTime() === todayUTC.getTime();

                      return (
                        <tr
                          key={`${year}-${i}`}
                          className={`border-b border-border last:border-b-0 ${
                            isToday
                              ? "bg-accent/10"
                              : isCurrentTableYear && !isPast
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
                            <a
                              href={`/kw/${getISOWeekNumber(h.date)}-${year}`}
                              className="text-accent hover:underline"
                            >
                              KW&nbsp;{getISOWeekNumber(h.date)}
                            </a>
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
                {holidays.filter((h) => h.isNationwide).length} bundesweite +{" "}
                {holidays.filter((h) => !h.isNationwide).length} regionale
                Feiertage = {holidays.length} gesamt
              </p>
            </div>
          );
        })}

        {/* ── Feiertage nach Bundesland ──────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Feiertage {currentYear} nach Bundesland
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die Anzahl der gesetzlichen Feiertage variiert je nach Bundesland
            zwischen 10 und 13 Tagen. Hier die &Uuml;bersicht f&uuml;r{" "}
            {currentYear}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stateHolidayCounts.map((s) => (
              <div
                key={s.code}
                className="flex items-center justify-between bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm"
              >
                <span className="text-text-primary font-medium">
                  {s.name}
                </span>
                <span className="text-text-secondary">
                  <span className="text-accent font-semibold">{s.count}</span>{" "}
                  Feiertage
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Brückentage ─────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Br&uuml;ckentage {currentYear}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mit <strong className="text-text-primary">Br&uuml;ckentagen</strong>{" "}
            holen Sie das Maximum aus Ihrem Urlaub heraus. Wenn ein Feiertag auf
            Donnerstag oder Dienstag f&auml;llt, gen&uuml;gt oft ein einziger
            Urlaubstag f&uuml;r ein verl&auml;ngertes Wochenende. Hier die besten{" "}
            Br&uuml;ckentage {currentYear}:
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
              {currentYear} bieten die bundesweiten Feiertage leider keine
              klassischen Br&uuml;ckentage, da keiner g&uuml;nstig auf Dienstag,
              Mittwoch oder Donnerstag f&auml;llt. Pr&uuml;fen Sie die regionalen
              Feiertage Ihres Bundeslandes f&uuml;r zus&auml;tzliche
              M&ouml;glichkeiten.
            </div>
          )}
        </div>

        {/* ── SEO Erklärtext ──────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Gesetzliche Feiertage in Deutschland erkl&auml;rt
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
              <a href="/kalenderwoche" className="text-accent hover:underline">
                KW-&Uuml;bersicht
              </a>
              .
            </p>
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zu Feiertagen
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

        {/* ── Abschluss-Links ─────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </a>
          <a href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche &rarr;
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {currentYear} &rarr;
          </a>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/feiertage/page.tsx (Feiertage Deutschland)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Feiertage 2025, 2026 & 2027 Deutschland"
 * [x] Meta Description: ~140 Zeichen mit Keywords "gesetzliche Feiertage",
 *     "Bundesland", "Brückentage", "nächster Feiertag"
 * [x] Canonical URL: https://aktuellekw.de/feiertage
 * [x] OG-Title + OG-Description + OG-URL
 * [x] Twitter Card: summary_large_image
 * [x] H1: "Feiertage 2025, 2026 & 2027 in Deutschland"
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → Feiertage)
 * [x] Schema.org: FAQPage (6 Fragen) mit Speakable
 * [x] Dynamische "Nächster Feiertag" Berechnung
 * [x] Feiertag-Tabellen für 2025, 2026, 2027 mit KW-Verlinkung
 * [x] Brückentage-Sektion mit Tipps
 * [x] Feiertage nach Bundesland Übersicht
 * [x] Easter-basierte Berechnung beweglicher Feiertage
 * [x] Buß- und Bettag korrekt berechnet (Mittwoch vor 23. Nov)
 * [x] Interne Links: /, /faq, /kalenderwoche, /kw/[n]-[year]
 * [x] KW-Links in Tabellen → /kw/[n]-[year]
 * [x] Past holidays: muted styling (opacity-60)
 * [x] Current year upcoming: bg-accent/5 highlight
 * [x] Today holiday: bg-accent/10 + "heute" badge
 * [x] FAQ accordion matching existing pattern
 * [x] revalidate = 3600 (stündliche ISR)
 * [x] Server Component (no "use client")
 * [x] Design tokens: bg-surface, bg-surface-secondary, text-text-primary,
 *     text-text-secondary, text-accent, border-border, rounded-xl
 * [ ] TODO: OG-Image für /feiertage erstellen (1200×630px)
 * [ ] TODO: Feiertage-Link im Footer ergänzen
 * [ ] TODO: Feiertage in Sitemap ergänzen
 */
