import type { MetadataRoute } from "next";
import { getAllKWsForYear, getCurrentKW, getWeeksInYear } from "@/lib/kw";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
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
  ];

  // ── Cluster 2: Year overview pages (/kalenderwochen/[year]) ───
  const yearPages: MetadataRoute.Sitemap = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ].map((year) => ({
    url: `https://aktuellekw.de/kalenderwochen/${year}`,
    lastModified: year === currentYear ? now : new Date(`${year}-12-28`),
    changeFrequency: year === currentYear ? ("yearly" as const) : ("never" as const),
    priority: year === currentYear ? 0.85 : 0.6,
  }));

  // ── Cluster 5: Individual KW pages (/kw/[n]-[year]) ──────────
  // Include current year ± 1 to cover searches for past/future KWs
  const kwPages: MetadataRoute.Sitemap = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ].flatMap((year) => {
    const weeks = getAllKWsForYear(year);
    return weeks.map((week) => ({
      url: `https://aktuellekw.de/kw/${week.weekNumber}-${year}`,
      lastModified:
        week.weekNumber === currentKW.weekNumber && year === currentYear
          ? now
          : week.endDate,
      changeFrequency: (
        week.weekNumber === currentKW.weekNumber && year === currentYear
          ? "weekly"
          : "never"
      ) as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority:
        week.weekNumber === currentKW.weekNumber && year === currentYear
          ? 0.8
          : year === currentYear
          ? 0.5
          : 0.3,
    }));
  });

  return [...corePages, ...yearPages, ...kwPages];
}

/*
 * SEO Audit Checklist – app/sitemap.ts
 * ──────────────────────────────────────────────────────────────
 * [x] Startseite: priority 1.0, changeFrequency "daily"
 * [x] /kalenderwoche: priority 0.9, changeFrequency "yearly"
 * [x] /faq: priority 0.7, changeFrequency "monthly"
 * [x] /kalenderwochen/[year]: 3 Jahre (aktuell ± 1), priority 0.6–0.85
 * [x] /kw/[n]-[year]: alle KWs für aktuelles Jahr ± 1
 *     – Aktuelle KW: priority 0.8, changeFrequency "weekly"
 *     – Restliche im aktuellen Jahr: priority 0.5, changeFrequency "never"
 *     – Andere Jahre: priority 0.3, changeFrequency "never"
 * [x] lastModified: endDate der KW für vergangene Wochen
 * [ ] TODO: /wie-viele-wochen-hat-ein-jahr ergänzen (Cluster 4)
 * [ ] TODO: /kalender-download ergänzen (Cluster 6)
 */
