/**
 * Schulferien-Datentypen und Utility-Funktionen.
 * Liest die via scripts/import-schulferien-api.js generierten JSON-Dateien.
 */
import { BUNDESLAENDER, FERIEN_SORT_ORDER, type Bundesland } from "./constants";

/* ── Typen ──────────────────────────────────────────────────── */

export interface Ferienzeit {
  name: string;
  typeId: number;
  starts_on: string; // YYYY-MM-DD
  ends_on: string;   // YYYY-MM-DD
}

export interface SchulferienData {
  bundesland: string;
  code: string;
  slug: string;
  year: number;
  ferien: Ferienzeit[];
  lastUpdated: string;
}

/* ── Daten laden ────────────────────────────────────────────── */

/**
 * Lädt die Schulferien-Daten für ein Bundesland und Jahr.
 * Gibt null zurück, wenn keine Daten vorhanden sind.
 */
export async function getSchulferien(
  slug: string,
  year: number
): Promise<SchulferienData | null> {
  try {
    const data = await import(`@/data/schulferien/${year}/${slug}.json`);
    return data.default as SchulferienData;
  } catch {
    return null;
  }
}

/**
 * Lädt alle Bundesländer-Daten für ein Jahr.
 */
export async function getAllSchulferienForYear(
  year: number
): Promise<SchulferienData[]> {
  const results: SchulferienData[] = [];
  for (const bl of BUNDESLAENDER) {
    const data = await getSchulferien(bl.slug, year);
    if (data) results.push(data);
  }
  return results;
}

/* ── Hilfsfunktionen ────────────────────────────────────────── */

/**
 * Bundesland-Objekt anhand des Slugs finden.
 */
export function getBundeslandBySlug(slug: string): Bundesland | undefined {
  return BUNDESLAENDER.find((bl) => bl.slug === slug);
}

/**
 * Ferienzeiten chronologisch sortieren (nach Ferienart-Reihenfolge, dann Startdatum).
 */
export function sortFerien(ferien: Ferienzeit[]): Ferienzeit[] {
  return [...ferien].sort((a, b) => {
    const orderA = FERIEN_SORT_ORDER[a.typeId] ?? 99;
    const orderB = FERIEN_SORT_ORDER[b.typeId] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.starts_on.localeCompare(b.starts_on);
  });
}

/**
 * Datum im deutschen Format anzeigen (z.B. "16.02.2026").
 */
export function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

/**
 * Dauer der Ferien in Tagen berechnen.
 */
export function ferienDauer(starts_on: string, ends_on: string): number {
  const start = new Date(starts_on);
  const end = new Date(ends_on);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
}

/**
 * Gesamtanzahl der Ferientage eines Bundeslandes berechnen.
 */
export function gesamtFerientage(ferien: Ferienzeit[]): number {
  return ferien.reduce((sum, f) => sum + ferienDauer(f.starts_on, f.ends_on), 0);
}
