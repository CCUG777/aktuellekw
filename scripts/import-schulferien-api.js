#!/usr/bin/env node
/**
 * import-schulferien-api.js
 *
 * Importiert Schulferien-Daten von der mehr-schulferien.de API (v2.0)
 * und speichert sie als JSON-Dateien unter data/schulferien/{year}/{bundesland}.json.
 *
 * Verwendung:
 *   node scripts/import-schulferien-api.js              # Standard: aktuellesJahr ± 1
 *   node scripts/import-schulferien-api.js 2026 2027    # Bestimmte Jahre
 *
 * API-Dokumentation: https://www.mehr-schulferien.de/developers/api
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "schulferien");

/* ── Konfiguration ──────────────────────────────────────────── */

const API_BASE = "https://www.mehr-schulferien.de/api/v2.0";

/** Bundesländer mit API-Location-IDs */
const BUNDESLAENDER = [
  { id: 2, code: "BW", name: "Baden-Württemberg", slug: "baden-wuerttemberg" },
  { id: 3, code: "BY", name: "Bayern", slug: "bayern" },
  { id: 4, code: "BE", name: "Berlin", slug: "berlin" },
  { id: 5, code: "BB", name: "Brandenburg", slug: "brandenburg" },
  { id: 6, code: "HB", name: "Bremen", slug: "bremen" },
  { id: 7, code: "HH", name: "Hamburg", slug: "hamburg" },
  { id: 8, code: "HE", name: "Hessen", slug: "hessen" },
  { id: 9, code: "MV", name: "Mecklenburg-Vorpommern", slug: "mecklenburg-vorpommern" },
  { id: 10, code: "NI", name: "Niedersachsen", slug: "niedersachsen" },
  { id: 11, code: "NW", name: "Nordrhein-Westfalen", slug: "nordrhein-westfalen" },
  { id: 12, code: "RP", name: "Rheinland-Pfalz", slug: "rheinland-pfalz" },
  { id: 13, code: "SL", name: "Saarland", slug: "saarland" },
  { id: 14, code: "SN", name: "Sachsen", slug: "sachsen" },
  { id: 15, code: "ST", name: "Sachsen-Anhalt", slug: "sachsen-anhalt" },
  { id: 16, code: "SH", name: "Schleswig-Holstein", slug: "schleswig-holstein" },
  { id: 17, code: "TH", name: "Thüringen", slug: "thueringen" },
];

/** Ferienarten (nur echte Schulferien, keine Feiertage) */
const SCHULFERIEN_TYPE_IDS = new Set([1, 2, 3, 4, 5, 6, 30, 31, 32]);

const FERIEN_NAMEN = {
  1: "Herbstferien",
  2: "Weihnachtsferien",
  3: "Winterferien",
  4: "Osterferien",
  5: "Himmelfahrtsferien",
  6: "Sommerferien",
  30: "Frühjahrsferien",
  31: "Pfingstferien",
  32: "Himmelfahrt-/Pfingstferien",
};

/** Sortierreihenfolge (chronologisch im Kalenderjahr) */
const SORT_ORDER = { 3: 1, 30: 2, 4: 3, 5: 4, 31: 5, 32: 6, 6: 7, 1: 8, 2: 9 };

/* ── API-Abruf ──────────────────────────────────────────────── */

async function fetchAllPeriods() {
  console.log("📡 Rufe alle Perioden von mehr-schulferien.de ab...");
  const url = `${API_BASE}/periods`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`API-Fehler: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  console.log(`   ✅ ${json.data.length} Perioden empfangen`);
  return json.data;
}

async function fetchVacationTypes() {
  console.log("📡 Rufe Ferienarten ab...");
  const url = `${API_BASE}/holiday_or_vacation_types`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`API-Fehler: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  console.log(`   ✅ ${json.data.length} Ferienarten empfangen`);
  return json.data;
}

/* ── Datenverarbeitung ──────────────────────────────────────── */

function filterAndOrganize(allPeriods, years) {
  const result = {};

  // Bundesland-ID → Bundesland-Objekt Lookup
  const blMap = new Map();
  for (const bl of BUNDESLAENDER) {
    blMap.set(bl.id, bl);
  }

  for (const period of allPeriods) {
    // Nur echte Schulferien (keine Feiertage, keine Beweglichen Ferientage)
    if (!SCHULFERIEN_TYPE_IDS.has(period.holiday_or_vacation_type_id)) continue;
    if (!period.is_school_vacation) continue;

    // Nur Bundesländer (keine Städte/Schulen)
    const bl = blMap.get(period.location_id);
    if (!bl) continue;

    // Jahr-Zuordnung: Eine Ferienzeit gehört zum Jahr, in dem sie beginnt
    // Weihnachtsferien, die im Dezember starten, gehören zum Startjahr
    const startYear = parseInt(period.starts_on.substring(0, 4), 10);
    const endYear = parseInt(period.ends_on.substring(0, 4), 10);

    // Zu allen betroffenen Jahren hinzufügen
    const relevantYears = new Set();
    if (years.includes(startYear)) relevantYears.add(startYear);
    if (years.includes(endYear)) relevantYears.add(endYear);

    // Weihnachtsferien: immer dem Startjahr zuordnen
    if (period.holiday_or_vacation_type_id === 2 && relevantYears.size === 0) {
      if (years.includes(startYear)) relevantYears.add(startYear);
    }

    // Fallback: Zum Startjahr hinzufügen
    if (relevantYears.size === 0) continue;

    // Dem Startjahr zuordnen (Hauptzuordnung)
    const assignYear = startYear;
    if (!years.includes(assignYear) && !years.includes(endYear)) continue;

    const targetYear = years.includes(assignYear) ? assignYear : endYear;

    const key = `${targetYear}/${bl.slug}`;
    if (!result[key]) {
      result[key] = {
        bundesland: bl.name,
        code: bl.code,
        slug: bl.slug,
        year: targetYear,
        ferien: [],
        lastUpdated: new Date().toISOString().split("T")[0],
      };
    }

    // Duplikat-Check (gleiche Ferienart + gleiches Startdatum)
    const isDuplicate = result[key].ferien.some(
      (f) =>
        f.typeId === period.holiday_or_vacation_type_id &&
        f.starts_on === period.starts_on
    );
    if (isDuplicate) continue;

    result[key].ferien.push({
      name: FERIEN_NAMEN[period.holiday_or_vacation_type_id] || `Ferien (Typ ${period.holiday_or_vacation_type_id})`,
      typeId: period.holiday_or_vacation_type_id,
      starts_on: period.starts_on,
      ends_on: period.ends_on,
    });
  }

  // Ferien sortieren
  for (const key of Object.keys(result)) {
    result[key].ferien.sort((a, b) => {
      const orderA = SORT_ORDER[a.typeId] ?? 99;
      const orderB = SORT_ORDER[b.typeId] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.starts_on.localeCompare(b.starts_on);
    });
  }

  return result;
}

/* ── Dateien schreiben ──────────────────────────────────────── */

function writeDataFiles(organized) {
  let fileCount = 0;
  let ferienCount = 0;

  for (const [key, data] of Object.entries(organized)) {
    const [year, slug] = key.split("/");
    const dir = join(DATA_DIR, year);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const filePath = join(dir, `${slug}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    fileCount++;
    ferienCount += data.ferien.length;
  }

  return { fileCount, ferienCount };
}

/* ── Hauptprogramm ──────────────────────────────────────────── */

async function main() {
  console.log("🏫 Schulferien-Import von mehr-schulferien.de API v2.0\n");

  // Jahre bestimmen
  let years;
  if (process.argv.length > 2) {
    years = process.argv.slice(2).map(Number).filter((y) => y > 2000 && y < 2100);
  } else {
    const current = new Date().getFullYear();
    years = [current - 1, current, current + 1];
  }
  console.log(`📅 Jahre: ${years.join(", ")}\n`);

  // API-Daten abrufen
  const allPeriods = await fetchAllPeriods();

  // Filtern und organisieren
  console.log("\n🔧 Filtere und organisiere Schulferien...");
  const organized = filterAndOrganize(allPeriods, years);

  // Dateien schreiben
  console.log("💾 Schreibe JSON-Dateien...\n");
  const { fileCount, ferienCount } = writeDataFiles(organized);

  // Zusammenfassung
  console.log("─".repeat(50));
  console.log(`✅ Import abgeschlossen!`);
  console.log(`   📁 ${fileCount} Dateien geschrieben`);
  console.log(`   📊 ${ferienCount} Ferienzeiten gesamt`);
  console.log(`   📂 Verzeichnis: data/schulferien/\n`);

  // Detailausgabe pro Jahr
  for (const year of years) {
    const yearEntries = Object.entries(organized).filter(
      ([k]) => k.startsWith(`${year}/`)
    );
    if (yearEntries.length === 0) {
      console.log(`   ⚠️  ${year}: Keine Schulferien-Daten gefunden`);
      continue;
    }
    console.log(`   ${year}:`);
    for (const [, data] of yearEntries) {
      const tage = data.ferien.reduce((sum, f) => {
        const start = new Date(f.starts_on);
        const end = new Date(f.ends_on);
        return sum + Math.round((end - start) / 86400000) + 1;
      }, 0);
      console.log(
        `     ${data.bundesland.padEnd(28)} ${data.ferien.length} Ferienzeiten, ${tage} Tage`
      );
    }
    console.log();
  }
}

main().catch((err) => {
  console.error("❌ Fehler:", err.message);
  process.exit(1);
});
