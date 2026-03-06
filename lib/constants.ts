/**
 * Zentrale Jahreskonfiguration für alle dynamischen Content-Seiten.
 * Steuert generateStaticParams, Sitemap und Datengenerierung.
 */
const currentYear = new Date().getFullYear();

export const CONTENT_YEARS = [currentYear - 1, currentYear, currentYear + 1];

/**
 * Bundesländer-Konfiguration mit API-IDs (mehr-schulferien.de v2.0)
 */
export interface Bundesland {
  id: number;
  code: string;
  name: string;
  slug: string;
}

export const BUNDESLAENDER: Bundesland[] = [
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

/**
 * Ferienarten-Mapping (holiday_or_vacation_type_id → deutscher Name)
 */
export const FERIEN_TYPEN: Record<number, string> = {
  1: "Herbstferien",
  2: "Weihnachtsferien",
  3: "Winterferien",
  4: "Osterferien",
  5: "Himmelfahrtsferien",
  6: "Sommerferien",
  7: "Beweglicher Ferientag",
  30: "Frühjahrsferien",
  31: "Pfingstferien",
  32: "Himmelfahrt-/Pfingstferien",
  34: "Unterrichtsfreier Tag",
};

/**
 * Sortierreihenfolge der Ferienarten (chronologisch im Schuljahr)
 */
export const FERIEN_SORT_ORDER: Record<number, number> = {
  3: 1,   // Winterferien
  30: 2,  // Frühjahrsferien
  4: 3,   // Osterferien
  5: 4,   // Himmelfahrtsferien
  31: 5,  // Pfingstferien
  32: 6,  // Himmelfahrt-/Pfingstferien
  6: 7,   // Sommerferien
  1: 8,   // Herbstferien
  2: 9,   // Weihnachtsferien
  7: 10,  // Beweglicher Ferientag
  34: 11, // Unterrichtsfreier Tag
};
