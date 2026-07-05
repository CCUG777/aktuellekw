import type { MetadataRoute } from "next";
import { getCurrentKW, getAllKWsForYear } from "@/lib/kw";
// BUNDESLAENDER + CONTENT_YEARS removed after Phase 1.3 consolidation

export default function sitemap(): MetadataRoute.Sitemap {
  // lastmod: fester Inhaltsstand – bewusst NICHT `new Date()` (sonst ändert
  // sich lastmod bei jedem Build/ISR-Revalidate und entwertet das Signal).
  // Bei echten Inhaltsänderungen dieses Datum manuell hochsetzen.
  const now = new Date("2026-07-05");
  const currentKW = getCurrentKW();
  const currentYear = currentKW.year;

  // ── Core pages ────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    // Cluster 1: Startseite – aktuelle KW
    {
      url: "https://aktuellekw.de",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Cluster 2: Kalenderwochen-Jahresübersicht (aktuelles Jahr)
    {
      url: "https://aktuellekw.de/kalenderwoche",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    // Cluster 3 + 4: FAQ-Seite
    {
      url: "https://aktuellekw.de/faq",
      lastModified: new Date("2026-02-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Cluster 4: Ratgeber – Wie viele Wochen hat ein Jahr?
    {
      url: "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr",
      lastModified: new Date("2026-02-27"),
      changeFrequency: "yearly",
      priority: 0.75,
    },
    // Entfernt: /welche-kalenderwoche-haben-wir → 301 auf /
    // Entfernt: /kalender-mit-kalenderwochen → 301 auf /kalenderwoche
    // Entfernt: /kalenderwochen-uebersicht → 301 auf /kalenderwoche
    // Entfernt: /woche-jahr → 301 auf /wie-viele-wochen-hat-ein-jahr
    // Entfernt: /kalender-mit-wochen → 301 auf /kalenderwoche
    // Entfernt: /kalender-wochenuebersicht → 301 auf /kalenderwoche
    // Datum heute
    {
      url: "https://aktuellekw.de/datum-heute",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    // Tagerechner
    {
      url: "https://aktuellekw.de/tagerechner",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    // Schaltjahr
    {
      url: "https://aktuellekw.de/schaltjahr",
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.75,
    },
    // Arbeitstage berechnen
    {
      url: "https://aktuellekw.de/arbeitstage-berechnen",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    // Entfernt: /sommerzeit → 301 auf /zeitumstellung/2026
    // Entfernt: /winterzeit → 301 auf /zeitumstellung/2026
    // Feiertage Deutschland
    {
      url: "https://aktuellekw.de/feiertage",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    // Cluster 6: KW-Kalender zum Ausdrucken (PDF/Excel) – GSC: "kw 2026 pdf" P1
    {
      url: "https://aktuellekw.de/kw-kalender-zum-ausdrucken",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    // Über uns (E-E-A-T)
    {
      url: "https://aktuellekw.de/ueber-uns",
      lastModified: new Date("2026-03-16"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Rechtliches: robots: { index: false } → absichtlich nicht im Sitemap
  ];

  // ── Phase 1.3: Nur aktuelles Jahr in Sitemap ──────────────
  // Feiertage Jahresseite (nur aktuelles Jahr)
  const feiertageYearPages: MetadataRoute.Sitemap = [{
    url: `https://aktuellekw.de/feiertage/${currentYear}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }];

  // Kalenderwochen Jahresübersicht (nur aktuelles Jahr)
  const yearPages: MetadataRoute.Sitemap = [{
    url: `https://aktuellekw.de/kalenderwochen/${currentYear}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.85,
  }];

  // Phase 4.1: KW-Einzelseiten aufgewertet (Feiertage/Ferien/Arbeitstage/ICS)
  // → wieder indexierbar. Aktuelles Jahr in die Sitemap; Nachbarjahre findet
  // Google über die prev/next-Verlinkung selbst.
  const kwPages: MetadataRoute.Sitemap = getAllKWsForYear(currentYear).map(
    (w) => {
      const isCurrent = w.weekNumber === currentKW.weekNumber;
      return {
        url: `https://aktuellekw.de/kw/${w.weekNumber}-${currentYear}`,
        lastModified: w.endDate < now ? w.endDate : now,
        changeFrequency: isCurrent ? ("weekly" as const) : ("monthly" as const),
        priority: isCurrent ? 0.8 : 0.5,
      };
    }
  );

  // Ostern (nur aktuelles Jahr)
  const osternPages: MetadataRoute.Sitemap = [{
    url: `https://aktuellekw.de/ostern/${currentYear}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.75,
  }];

  // Ostermontag (nur aktuelles Jahr)
  const ostermontagPages: MetadataRoute.Sitemap = [{
    url: `https://aktuellekw.de/ostermontag/${currentYear}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }];

  // Osterferien (nur aktuelles Jahr)
  const osterferienPages: MetadataRoute.Sitemap = [{
    url: `https://aktuellekw.de/osterferien/${currentYear}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.75,
  }];

  // Schulferien (nur aktuelles Jahr)
  const schulferienHubPages: MetadataRoute.Sitemap = [{
    url: `https://aktuellekw.de/schulferien/${currentYear}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.85,
  }];

  // Phase 1.4: Bundesland-Feiertage nur noch aktuelles Jahr (werden später zu Filter)
  const feiertageBundeslandPages: MetadataRoute.Sitemap = [];

  // Arbeitstage (nur aktuelles Jahr)
  const arbeitstagePages: MetadataRoute.Sitemap = [{
    url: `https://aktuellekw.de/arbeitstage/${currentYear}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.85,
  }];

  // Zeitumstellung (nur aktuelles Jahr)
  const zeitumstellungPages: MetadataRoute.Sitemap = [{
    url: `https://aktuellekw.de/zeitumstellung/${currentYear}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.85,
  }];

  // Schulferien Bundesland-Seiten: aus Sitemap entfernt (noindex geplant)
  const schulferienBlPages: MetadataRoute.Sitemap = [];

  return [
    ...corePages,
    ...feiertageYearPages,
    ...feiertageBundeslandPages,
    ...osternPages,
    ...ostermontagPages,
    ...osterferienPages,
    ...yearPages,
    ...kwPages,
    ...schulferienHubPages,
    ...schulferienBlPages,
    ...arbeitstagePages,
    ...zeitumstellungPages,
  ];
}

/*
 * SEO Audit Checklist – app/sitemap.ts
 * ──────────────────────────────────────────────────────────────
 * [x] Startseite: priority 1.0, changeFrequency "daily"
 * [x] /kalenderwoche: priority 0.9, changeFrequency "yearly"
 * [x] /faq: priority 0.7, changeFrequency "monthly"
 * [x] /kalenderwochen/[year]: nur aktuelles Jahr (andere = noindex)
 * [x] /kw/[n]-[year]: aktuell NICHT in Sitemap (noindex)
 *     → wird in Phase 4 nach Aufwertung wieder aufgenommen
 * [x] Nur indexierbare URLs in der Sitemap (keine noindex-Seiten)
 * [x] lastModified: fester Inhaltsstand statt `new Date()` (Phase 2.3)
 * [x] /wie-viele-wochen-hat-ein-jahr in Sitemap (Cluster 4)
 * [ ] TODO Phase 4: /kw-kalender-zum-ausdrucken, /kalenderwoche-excel,
 *     /widget, /kalenderwochen-lieferplanung + aufgewertete /kw/[slug]
 */
