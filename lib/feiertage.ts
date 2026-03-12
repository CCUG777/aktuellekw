/**
 * Feiertage-Utilities – Gesetzliche Feiertage in Deutschland
 *
 * Shared logic for holiday calculations used by:
 * - app/feiertage/page.tsx (hub page)
 * - app/feiertage/[year]/page.tsx (year pages)
 */

import { getISOWeekNumber, formatDateDE, getDayNameDE } from "@/lib/kw";

/* ── Easter calculation (Anonymous Gregorian algorithm) ──────────── */
export function getEasterDate(year: number): Date {
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
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/* ── Buß- und Bettag: Wednesday before Nov 23 ───────────────────── */
export function getBussUndBettag(year: number): Date {
  const nov23 = new Date(Date.UTC(year, 10, 23));
  const dayOfWeek = nov23.getUTCDay();
  const daysBack = dayOfWeek >= 3 ? dayOfWeek - 3 : dayOfWeek + 4;
  return addDays(nov23, -daysBack);
}

/* ── Holiday types ───────────────────────────────────────────────── */
export interface Feiertag {
  name: string;
  date: Date;
  states: string[];
  isNationwide: boolean;
}

/* ── Bundesland codes → full names ───────────────────────────────── */
export const BUNDESLAND_NAMES: Record<string, string> = {
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

export const ALL_STATES = Object.keys(BUNDESLAND_NAMES);

/* ── Generate all holidays for a given year ──────────────────────── */
export function getFeiertageFuerJahr(year: number): Feiertag[] {
  const easter = getEasterDate(year);

  const holidays: Feiertag[] = [
    // Nationwide holidays
    { name: "Neujahr", date: new Date(Date.UTC(year, 0, 1)), states: ALL_STATES, isNationwide: true },
    { name: "Karfreitag", date: addDays(easter, -2), states: ALL_STATES, isNationwide: true },
    { name: "Ostermontag", date: addDays(easter, 1), states: ALL_STATES, isNationwide: true },
    { name: "Tag der Arbeit", date: new Date(Date.UTC(year, 4, 1)), states: ALL_STATES, isNationwide: true },
    { name: "Christi Himmelfahrt", date: addDays(easter, 39), states: ALL_STATES, isNationwide: true },
    { name: "Pfingstmontag", date: addDays(easter, 50), states: ALL_STATES, isNationwide: true },
    { name: "Tag der Deutschen Einheit", date: new Date(Date.UTC(year, 9, 3)), states: ALL_STATES, isNationwide: true },
    { name: "1. Weihnachtsfeiertag", date: new Date(Date.UTC(year, 11, 25)), states: ALL_STATES, isNationwide: true },
    { name: "2. Weihnachtsfeiertag", date: new Date(Date.UTC(year, 11, 26)), states: ALL_STATES, isNationwide: true },

    // State-specific holidays
    { name: "Heilige Drei Könige", date: new Date(Date.UTC(year, 0, 6)), states: ["BW", "BY", "ST"], isNationwide: false },
    { name: "Internationaler Frauentag", date: new Date(Date.UTC(year, 2, 8)), states: ["BE", "MV"], isNationwide: false },
    { name: "Fronleichnam", date: addDays(easter, 60), states: ["BW", "BY", "HE", "NW", "RP", "SL"], isNationwide: false },
    { name: "Mariä Himmelfahrt", date: new Date(Date.UTC(year, 7, 15)), states: ["BY", "SL"], isNationwide: false },
    { name: "Weltkindertag", date: new Date(Date.UTC(year, 8, 20)), states: ["TH"], isNationwide: false },
    { name: "Reformationstag", date: new Date(Date.UTC(year, 9, 31)), states: ["BB", "HB", "HH", "MV", "NI", "SN", "SH", "TH"], isNationwide: false },
    { name: "Allerheiligen", date: new Date(Date.UTC(year, 10, 1)), states: ["BW", "BY", "NW", "RP", "SL"], isNationwide: false },
    { name: "Buß- und Bettag", date: getBussUndBettag(year), states: ["SN"], isNationwide: false },
  ];

  holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
  return holidays;
}

/* ── Count holidays per state ────────────────────────────────────── */
export function getHolidaysPerState(holidays: Feiertag[]): { code: string; name: string; count: number }[] {
  return ALL_STATES.map((code) => ({
    code,
    name: BUNDESLAND_NAMES[code],
    count: holidays.filter((h) => h.states.includes(code)).length,
  })).sort((a, b) => b.count - a.count);
}

/* ── Brückentage calculation ─────────────────────────────────────── */
export interface Brueckentag {
  feiertag: string;
  feiertagDate: Date;
  wochentag: string;
  tipp: string;
  urlaubstage: number;
  freieTage: number;
}

export function getBrueckentage(year: number): Brueckentag[] {
  const holidays = getFeiertageFuerJahr(year).filter((h) => h.isNationwide);
  const tipps: Brueckentag[] = [];

  for (const h of holidays) {
    const day = h.date.getUTCDay();
    const wochentag = getDayNameDE(h.date);

    if (day === 4) {
      tipps.push({
        feiertag: h.name,
        feiertagDate: h.date,
        wochentag,
        tipp: `Freitag (${formatDateDE(addDays(h.date, 1))}) freinehmen = 4 Tage frei`,
        urlaubstage: 1,
        freieTage: 4,
      });
    } else if (day === 2) {
      tipps.push({
        feiertag: h.name,
        feiertagDate: h.date,
        wochentag,
        tipp: `Montag (${formatDateDE(addDays(h.date, -1))}) freinehmen = 4 Tage frei`,
        urlaubstage: 1,
        freieTage: 4,
      });
    } else if (day === 3) {
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
export function getNextFeiertag(): { feiertag: Feiertag; daysUntil: number } {
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const currentYear = todayUTC.getUTCFullYear();

  const allHolidays = [
    ...getFeiertageFuerJahr(currentYear),
    ...getFeiertageFuerJahr(currentYear + 1),
  ];

  const nationwideHolidays = allHolidays.filter((h) => h.isNationwide);

  for (const h of nationwideHolidays) {
    const diff = Math.ceil((h.date.getTime() - todayUTC.getTime()) / 86400000);
    if (diff >= 0) {
      return { feiertag: h, daysUntil: diff };
    }
  }

  return { feiertag: nationwideHolidays[0], daysUntil: 0 };
}

/* ── FAQ data ────────────────────────────────────────────────────── */
export const FEIERTAGE_FAQS = [
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
      'Der nächste bundesweite Feiertag wird dynamisch auf dieser Seite angezeigt \u2013 inklusive Datum, Wochentag und Kalenderwoche. Scrollen Sie nach oben zur Schnell-Info oder zur Sektion \u201eNächster Feiertag\u201c für die aktuelle Antwort.',
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

/* ── State-specific holiday helpers ─────────────────────────────── */

/** Get all holidays valid for a specific Bundesland */
export function getFeiertageFuerBundesland(
  year: number,
  stateCode: string
): Feiertag[] {
  return getFeiertageFuerJahr(year).filter((h) =>
    h.states.includes(stateCode)
  );
}

/** Brückentage INCLUDING regional holidays (state-specific) */
export function getBrueckentageForState(
  year: number,
  stateCode: string
): Brueckentag[] {
  const holidays = getFeiertageFuerJahr(year).filter((h) =>
    h.states.includes(stateCode)
  );
  const tipps: Brueckentag[] = [];

  for (const h of holidays) {
    const day = h.date.getUTCDay();
    const wochentag = getDayNameDE(h.date);

    if (day === 4) {
      tipps.push({
        feiertag: h.name,
        feiertagDate: h.date,
        wochentag,
        tipp: `Freitag (${formatDateDE(addDays(h.date, 1))}) freinehmen = 4 Tage frei`,
        urlaubstage: 1,
        freieTage: 4,
      });
    } else if (day === 2) {
      tipps.push({
        feiertag: h.name,
        feiertagDate: h.date,
        wochentag,
        tipp: `Montag (${formatDateDE(addDays(h.date, -1))}) freinehmen = 4 Tage frei`,
        urlaubstage: 1,
        freieTage: 4,
      });
    } else if (day === 3) {
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

/** Next upcoming holiday for a specific Bundesland */
export function getNextFeiertagForState(
  stateCode: string
): { feiertag: Feiertag; daysUntil: number } {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const currentYear = todayUTC.getUTCFullYear();

  const allHolidays = [
    ...getFeiertageFuerJahr(currentYear),
    ...getFeiertageFuerJahr(currentYear + 1),
  ].filter((h) => h.states.includes(stateCode));

  for (const h of allHolidays) {
    const diff = Math.ceil(
      (h.date.getTime() - todayUTC.getTime()) / 86400000
    );
    if (diff >= 0) {
      return { feiertag: h, daysUntil: diff };
    }
  }

  return { feiertag: allHolidays[0], daysUntil: 0 };
}

/* Re-export for convenience */
export { getISOWeekNumber, formatDateDE, getDayNameDE };
