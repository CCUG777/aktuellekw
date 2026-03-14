/**
 * Zeitumstellung (DST) helper utilities for Germany/EU.
 *
 * EU rule (since 1996):
 *   Sommerzeit  → last Sunday of March,  02:00 → 03:00 (clocks forward)
 *   Winterzeit  → last Sunday of October, 03:00 → 02:00 (clocks back)
 */

/* ── Core date calculation ─────────────────────────────────────── */

/** Last Sunday of a given month in a given year (UTC date). */
function lastSundayOf(year: number, month: number): Date {
  // month is 0-indexed: 2 = March, 9 = October
  const lastDay = new Date(Date.UTC(year, month + 1, 0)); // last day of month
  const dayOfWeek = lastDay.getUTCDay(); // 0 = Sunday
  const offset = dayOfWeek; // days to subtract to get to Sunday
  return new Date(Date.UTC(year, month, lastDay.getUTCDate() - offset));
}

export interface ZeitumstellungDatum {
  /** Full date of the switch */
  date: Date;
  /** German day name */
  dayName: string;
  /** Formatted "DD.MM.YYYY" */
  dateFormatted: string;
  /** ISO date string "YYYY-MM-DD" */
  dateISO: string;
  /** Time before switch, e.g. "02:00" */
  timeBefore: string;
  /** Time after switch, e.g. "03:00" */
  timeAfter: string;
  /** Direction: "vor" (forward) or "zurück" (back) */
  direction: "vor" | "zurück";
  /** Human label: "Sommerzeit" or "Winterzeit" */
  label: string;
  /** Timezone abbreviation after switch */
  timezone: string;
  /** UTC offset after switch */
  utcOffset: string;
}

/** Get the Sommerzeit (spring forward) date for a year. */
export function getSommerzeitDatum(year: number): ZeitumstellungDatum {
  const d = lastSundayOf(year, 2); // March
  return {
    date: d,
    dayName: "Sonntag",
    dateFormatted: formatDateDE(d),
    dateISO: d.toISOString().slice(0, 10),
    timeBefore: "02:00",
    timeAfter: "03:00",
    direction: "vor",
    label: "Sommerzeit",
    timezone: "MESZ",
    utcOffset: "UTC+2",
  };
}

/** Get the Winterzeit (fall back) date for a year. */
export function getWinterzeitDatum(year: number): ZeitumstellungDatum {
  const d = lastSundayOf(year, 9); // October
  return {
    date: d,
    dayName: "Sonntag",
    dateFormatted: formatDateDE(d),
    dateISO: d.toISOString().slice(0, 10),
    timeBefore: "03:00",
    timeAfter: "02:00",
    direction: "zurück",
    label: "Winterzeit",
    timezone: "MEZ",
    utcOffset: "UTC+1",
  };
}

/** Get both Zeitumstellung dates for a year. */
export function getZeitumstellungen(year: number) {
  return {
    sommerzeit: getSommerzeitDatum(year),
    winterzeit: getWinterzeitDatum(year),
  };
}

/* ── Formatting helpers ────────────────────────────────────────── */

function formatDateDE(d: Date): string {
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${d.getUTCFullYear()}`;
}

const MONTH_NAMES_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

/** Format as "29. März 2026" */
export function formatDateLongDE(d: Date): string {
  return `${d.getUTCDate()}. ${MONTH_NAMES_DE[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Days between now and a target date (positive = future). */
export function daysUntil(target: Date, from: Date = new Date()): number {
  return Math.ceil((target.getTime() - from.getTime()) / 86_400_000);
}

/** Get Zeitumstellung data for multiple years. */
export function getZeitumstellungenMultiYear(startYear: number, endYear: number) {
  const result: Array<{
    year: number;
    sommerzeit: ZeitumstellungDatum;
    winterzeit: ZeitumstellungDatum;
  }> = [];
  for (let y = startYear; y <= endYear; y++) {
    result.push({ year: y, ...getZeitumstellungen(y) });
  }
  return result;
}
