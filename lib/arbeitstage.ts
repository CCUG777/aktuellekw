/**
 * Arbeitstage-Utilities – Berechnung von Arbeitstagen pro Bundesland/Monat/Jahr
 *
 * Nutzt die Feiertage-Logik aus lib/feiertage.ts für korrekte
 * bundeslandspezifische Berechnungen.
 */

import {
  getFeiertageFuerJahr,
  BUNDESLAND_NAMES,
  ALL_STATES,
  type Feiertag,
} from "@/lib/feiertage";

/* ── Types ─────────────────────────────────────────────────────── */
export interface MonatsArbeitstage {
  monat: string; // "Januar", "Februar", ...
  monatIdx: number; // 0-11
  werktage: number; // Mo-Fr (ohne Feiertage)
  feiertageAnzahl: number; // Feiertage an Werktagen
  arbeitstage: number; // werktage - feiertageAnzahl
}

export interface BundeslandArbeitstage {
  code: string;
  name: string;
  arbeitstageJahr: number;
  feiertageWerktag: number; // Feiertage, die auf Mo-Fr fallen
  feiertageGesamt: number; // Gesamt-Feiertage (inkl. Wochenende)
  monate: MonatsArbeitstage[];
}

/* ── Constants ─────────────────────────────────────────────────── */
const MONATSNAMEN = [
  "Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

/* ── Helper: Count weekdays (Mo-Fr) in a month ────────────────── */
function countWeekdaysInMonth(year: number, month: number): number {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  let count = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(Date.UTC(year, month, d)).getUTCDay();
    if (day >= 1 && day <= 5) count++;
  }
  return count;
}

/* ── Helper: Count weekdays (Mo-Fr) in a year ─────────────────── */
function countWeekdaysInYear(year: number): number {
  let count = 0;
  for (let m = 0; m < 12; m++) {
    count += countWeekdaysInMonth(year, m);
  }
  return count;
}

/* ── Get Feiertage for a state that fall on weekdays per month ── */
function getFeiertagePerMonthForState(
  holidays: Feiertag[],
  stateCode: string,
  year: number
): Map<number, number> {
  const map = new Map<number, number>();
  for (let m = 0; m < 12; m++) map.set(m, 0);

  for (const h of holidays) {
    if (!h.states.includes(stateCode)) continue;
    const day = h.date.getUTCDay();
    if (day >= 1 && day <= 5) {
      // Only count if on a weekday
      const m = h.date.getUTCMonth();
      map.set(m, (map.get(m) ?? 0) + 1);
    }
  }
  return map;
}

/* ── Main: Get Arbeitstage for a specific Bundesland ──────────── */
export function getArbeitstageForBundesland(
  year: number,
  stateCode: string
): BundeslandArbeitstage {
  const holidays = getFeiertageFuerJahr(year);
  const feiertagePerMonth = getFeiertagePerMonthForState(holidays, stateCode, year);

  const monate: MonatsArbeitstage[] = [];
  let totalArbeitstage = 0;
  let totalFeiertageWerktag = 0;

  for (let m = 0; m < 12; m++) {
    const werktage = countWeekdaysInMonth(year, m);
    const feiertageAnzahl = feiertagePerMonth.get(m) ?? 0;
    const arbeitstage = werktage - feiertageAnzahl;

    monate.push({
      monat: MONATSNAMEN[m],
      monatIdx: m,
      werktage,
      feiertageAnzahl,
      arbeitstage,
    });

    totalArbeitstage += arbeitstage;
    totalFeiertageWerktag += feiertageAnzahl;
  }

  const feiertageGesamt = holidays.filter((h) =>
    h.states.includes(stateCode)
  ).length;

  return {
    code: stateCode,
    name: BUNDESLAND_NAMES[stateCode],
    arbeitstageJahr: totalArbeitstage,
    feiertageWerktag: totalFeiertageWerktag,
    feiertageGesamt,
    monate,
  };
}

/* ── Get Arbeitstage for all 16 Bundesländer ─────────────────── */
export function getAllBundeslaenderArbeitstage(
  year: number
): BundeslandArbeitstage[] {
  return ALL_STATES.map((code) => getArbeitstageForBundesland(year, code)).sort(
    (a, b) => b.arbeitstageJahr - a.arbeitstageJahr
  );
}

/* ── Total weekdays in the year (without any Feiertage) ───────── */
export function getWerktageImJahr(year: number): number {
  return countWeekdaysInYear(year);
}

/* ── Get Arbeitstage for a date range and state ──────────────── */
export function getArbeitstageInZeitraum(
  startDate: Date,
  endDate: Date,
  stateCode: string,
  abzugUrlaub: number = 0,
  abzugKrankheit: number = 0
): {
  arbeitstage: number;
  werktage: number;
  feiertage: number;
  kalendertage: number;
  nettoArbeitstage: number;
} {
  const year = startDate.getUTCFullYear();
  const holidays = getFeiertageFuerJahr(year);
  // Also get holidays from next year in case range spans year boundary
  const holidaysNext = getFeiertageFuerJahr(year + 1);
  const allHolidays = [...holidays, ...holidaysNext];

  const stateHolidayDates = new Set(
    allHolidays
      .filter((h) => h.states.includes(stateCode))
      .map((h) => h.date.getTime())
  );

  let werktage = 0;
  let feiertage = 0;
  let kalendertage = 0;

  const current = new Date(startDate);
  while (current <= endDate) {
    kalendertage++;
    const day = current.getUTCDay();
    if (day >= 1 && day <= 5) {
      if (stateHolidayDates.has(current.getTime())) {
        feiertage++;
      } else {
        werktage++;
      }
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  const arbeitstage = werktage;
  const nettoArbeitstage = Math.max(0, arbeitstage - abzugUrlaub - abzugKrankheit);

  return { arbeitstage, werktage, feiertage, kalendertage, nettoArbeitstage };
}

/* ── Export constants ─────────────────────────────────────────── */
export { MONATSNAMEN, BUNDESLAND_NAMES, ALL_STATES };
