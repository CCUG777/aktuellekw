# aktuellekw.de

German-language website showing the current calendar week (Kalenderwoche/KW).
Domain: aktuellekw.de

## Tech Stack
- Next.js 16 (App Router) with TypeScript
- Tailwind CSS v4 (dark mode, Apple-style design)
- No additional runtime dependencies

## Architecture
- Server Components by default (minimal client JS)
- ISO 8601 calendar week calculation in lib/kw.ts
- SEO optimized for "aktuelle KW" keyword cluster
- ISR: revalidate = 3600 (homepage + KW pages), 86400 (year pages)

## Commands
- `npm run dev` – Start development server
- `npm run build` – Production build
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

## Pages

| Route | Description | SEO Cluster |
|-------|-------------|-------------|
| `/` | Home: aktuelle KW, WeekdayTable, Stats, KWRechner, FAQ, KW-Jahresübersicht | Cluster 1 + 3 + 4 |
| `/kalenderwoche` | Alle KWs aktuelles Jahr + Jahresnavigation + KWRechner | Cluster 2 |
| `/faq` | 13 FAQs zur Kalenderwoche | Cluster 3 + 4 |
| `/kw/[slug]` | Einzelseite pro KW (z.B. /kw/9-2026) | Cluster 5 |
| `/kalenderwochen/[year]` | Jahresübersicht mit Navigation (z.B. /kalenderwochen/2025) | Cluster 2 |

## Key Files

### Core Logic
- `lib/kw.ts` – ISO 8601 week calculation utilities
  - `getISOWeekNumber`, `getISOWeekYear`, `getWeekStart`, `getWeekEnd`
  - `getKWInfo`, `getCurrentKW`, `getAllKWsForYear`
  - `formatDateDE`, `getWeeksInYear`
  - `getDayOfYear`, `isLeapYear`, `getDayNameDE`

### App Router
- `app/layout.tsx` – Root layout with metadata, fonts, dark theme, WebSite JSON-LD
- `app/page.tsx` – Homepage (Server Component, ISR 3600s)
- `app/faq/page.tsx` – FAQ page (13 questions, FAQPage schema)
- `app/kalenderwoche/page.tsx` – Current-year KW overview
- `app/kw/[slug]/page.tsx` – Individual KW pages (e.g. /kw/9-2026)
- `app/kalenderwochen/[year]/page.tsx` – Year-specific KW overview
- `app/robots.ts` – robots.txt (AI crawlers explicitly allowed)
- `app/sitemap.ts` – sitemap.xml (core + year + all KW pages)

### Components
- `components/KWDisplay.tsx` – Large KW number with ambient glow (Server)
- `components/KWTable.tsx` – Grid of all KWs (past/current/future styling) (Server)
- `components/WeekdayTable.tsx` – 7-day week view with today highlight (Server)
- `components/KWRechner.tsx` – Date → KW calculator ("use client")
- `components/LiveDate.tsx` – Real-time date display ("use client")
- `components/Header.tsx` – Site header with logo
- `components/Footer.tsx` – Site footer with links

---

## SEO Strategy

### Keyword Clusters

| Cluster | Seite | Hauptkeyword | Volumen/Monat | Status |
|---------|-------|--------------|---------------|--------|
| 1: Aktuelle KW | `/` | aktuelle kw | ~141.000 | ✅ live |
| 2: Jahresübersicht | `/kalenderwoche` + `/kalenderwochen/[year]` | kalenderwochen 2026 | ~256.000 | ✅ live |
| 3: Fragen-Keywords | `/faq` + `/` | welche kalenderwoche haben wir | ~32.000 | ✅ live |
| 4: Wissen & Erklärung | `/faq` + `/` | wie viele wochen hat ein jahr | ~45.000 | ✅ live |
| 5: Spezifische KW | `/kw/[n]-[year]` | kw 15 2025 | ~50.000+ | ✅ live |
| 6: Kalender-Download | geplant: `/kalender-download/` | wochenkalender | ~6.000 | ⏳ geplant |

### Implemented SEO Measures

#### Meta Tags & Metadata (alle Seiten)
- `metadataBase`: https://aktuellekw.de
- Default Title: `Aktuelle KW 2026 – Welche Kalenderwoche haben wir heute?`
- Title-Template: `%s | aktuellekw.de`
- Meta-Description: 140–160 Zeichen mit Cluster-Keywords
- `alternates.canonical`: pro Seite gesetzt
- OpenGraph (vollständig, alle 5 Seiten + Layout-Default):
  - `og:title` – dynamisch pro Seite
  - `og:description` – dynamisch pro Seite
  - `og:image` – seitenspezifisch (`/og/og-*.png`, 1200×630 px)
  - `og:image:width` / `og:image:height` / `og:image:alt` / `og:image:type`
  - `og:url` – kanonische URL pro Seite
  - `og:type` – `website`
  - `og:locale` – `de_DE`
  - `og:site_name` – `aktuellekw.de`
- Twitter Card (alle 5 Seiten + Layout-Default):
  - `twitter:card` – `summary_large_image`
  - `twitter:title` / `twitter:description`
  - `twitter:image` + `twitter:image:alt`

#### OG-Image Platzhalter (`/public/og/`)
Alle Dateien sind valide PNG-Platzhalter (1×1 px) – müssen vor Launch durch echte 1200×630 px Bilder ersetzt werden.

| Datei | Seite | Alt-Text |
|-------|-------|----------|
| `og-default.png` | Layout-Fallback (alle Seiten) | „aktuellekw.de – Aktuelle Kalenderwoche nach ISO 8601" |
| `og-home.png` | `/` | „Aktuelle KW [Nr] [Jahr] – aktuellekw.de" |
| `og-faq.png` | `/faq` | „FAQ zur Kalenderwoche – aktuellekw.de" |
| `og-kalenderwoche.png` | `/kalenderwoche` | „Kalenderwochen [Jahr] – alle [N] KW im Überblick" |
| `og-kw.png` | `/kw/[slug]` | „KW [Nr] [Jahr] – [Start] bis [Ende]" |
| `og-kalenderwochen.png` | `/kalenderwochen/[year]` | „Kalenderwochen [Jahr] – alle [N] KW im Überblick" |

Specs: 1200×630 px · PNG oder JPG · ≤300 KB · Hintergrund `#000000` · Akzent `#0a84ff`
Dokumentation: `public/og/REPLACE_WITH_REAL_IMAGES.md`

#### Dynamische Metadata (generateMetadata)
- `/`: „KW 9 2026 – Aktuelle Kalenderwoche heute"
- `/kalenderwoche`: „Kalenderwochen 2026 – Alle 52 KW im Jahresüberblick"
- `/kw/[slug]`: „KW 9 2026 – 23.02.2026 bis 01.03.2026"
- `/kalenderwochen/[year]`: „Kalenderwochen 2025 – Alle 52 KW im Überblick"

#### Schema.org JSON-LD

| Seite | Schema-Typen |
|-------|-------------|
| Alle Seiten (layout) | `WebSite` mit publisher |
| `/` | `WebApplication`, `BreadcrumbList`, `FAQPage` (8 Fragen) |
| `/faq` | `FAQPage` (13 Fragen), `BreadcrumbList` |
| `/kalenderwoche` | `Dataset`, `BreadcrumbList` |
| `/kw/[slug]` | `Event` (Wochenzeitraum), `BreadcrumbList` (3 Ebenen) |
| `/kalenderwochen/[year]` | `Dataset`, `BreadcrumbList` |

#### robots.txt – KI-Crawler explizit erlaubt
- `GPTBot` (ChatGPT), `ChatGPT-User`
- `PerplexityBot` (Perplexity AI)
- `Google-Extended` (Google SGE / Gemini)
- `ClaudeBot`, `anthropic-ai`

#### KI-Suche Optimierung (ChatGPT, Google SGE, Perplexity)
- FAQPage Schema mit 13 + 8 strukturierten Q&A
- Klare Frage-Antwort-Struktur im HTML
- Faktische, präzise Antworten auf User-Intent-Fragen
- Alle AI-Crawler in robots.txt explizit erlaubt
- WebSite Schema mit `inLanguage: "de-DE"`

#### Interne Verlinkungsstruktur
- Startseite → prev/next KW (`/kw/[n]-[year]`)
- Startseite → `/kw/[aktuell]-[year]` (Details-Link)
- Startseite → `/kalenderwoche`, `/faq`
- `/kw/[slug]` → prev/next KW, `/kalenderwochen/[year]`, `/`
- `/kalenderwochen/[year]` → prev/next Jahr, `/`, `/faq`
- `/kalenderwoche` → `/kalenderwochen/[year]` (Jahresnavigation)
- FAQ → Startseite, `/kalenderwoche`

#### Sitemap (app/sitemap.ts)
- `/`: priority 1.0, changeFrequency "daily"
- `/kalenderwoche`: priority 0.9, changeFrequency "yearly"
- `/faq`: priority 0.7, changeFrequency "monthly"
- `/kalenderwochen/[year]` (±1 Jahr): priority 0.6–0.85
- `/kw/[n]-[year]` (±1 Jahr, alle KWs):
  - Aktuelle KW: priority 0.8, changeFrequency "weekly"
  - Andere KWs aktuelles Jahr: priority 0.5
  - Andere Jahre: priority 0.3

### Competitor-Derived Features (implemented)

From analysis of aktuelle-kalenderwoche.org, finanz-tools.de, kwheute.de:

| Feature | Component | Seiten | Verbesserung gegenüber Original |
|---------|-----------|--------|---------------------------------|
| 7-Tage Wochenansicht | `WeekdayTable` | `/`, `/kw/[slug]` | Heute-Highlight, Apple-Design |
| Datum → KW Rechner | `KWRechner` | `/`, `/kalenderwoche` | ISO 8601, Link zu Detail-Seite |
| KW-Einzelseiten | `/kw/[slug]` | — | Schema.org Event, prev/next Nav |
| Jahres-URLs | `/kalenderwochen/[year]` | — | Stats-Row, Jahresnavigation |
| Prev/Next Navigation | inline in pages | `/`, `/kw/[slug]` | Jahr-Rollover, clean URL |

### SEO-Text Placeholders (noch zu befüllen)

| Seite | Placeholder | Keywords | Wörter |
|-------|-------------|----------|--------|
| `/` | Erklärtext „Aktuelle KW" | aktuelle KW, KW aktuell, heutige Kalenderwoche | 150–200 |
| `/` | Erklärtext „Wie viele Wochen" | wie viele Wochen hat ein Jahr (3 Varianten) | 80–120 |
| `/faq` | Einleitungstext | welche KW, Kalenderwoche berechnen, ISO 8601 | 60–80 |
| `/kalenderwoche` | Einleitungstext | kalenderwochen 2026, kw 2026, KW Kalender | 100–150 |
| `/kalenderwoche` | Abschlusstext | wie viele Kalenderwochen, KW Wochen, Wochenkalender | 60–80 |

### Geplante SEO-Seiten (nicht implementiert)
- `/wie-viele-wochen-hat-ein-jahr/` – Cluster 4: Ratgeber-Seite
- `/kalender-download/` – Cluster 6: PDF-Downloads

### SEO Audit Checklists
Jede Seite enthält einen `/* SEO Audit Checklist */`-Kommentar am Ende der Datei mit erledigten und offenen Punkten.

---

## Finaler SEO-Check (Stand: 2026-02-26)

> Geprüft: Build ✅ clean (TypeScript, 168 statische Seiten), Schema.org ✅ alle gültig,
> Performance ✅ SSG/ISR korrekt, Placeholders ✅ alle markiert und auffindbar,
> Open Graph ✅ 16 Tags pro Seite live verifiziert, Twitter Card ✅ 5 Tags pro Seite.

### 1. Technische Basis

| Prüfpunkt | Status | Details |
|-----------|--------|---------|
| TypeScript-Fehler | ✅ | `npm run build` ohne Fehler |
| Statische Seiten generiert | ✅ | 168 Seiten (3 core + 3 year + 157 KW + /_not-found + robots + sitemap) |
| ISR konfiguriert | ✅ | revalidate 3600s (Homepage, KW-Seiten), 86400s (Jahresseiten) |
| `generateStaticParams` | ✅ | `/kw/[slug]`: Jahr ±1; `/kalenderwochen/[year]`: Jahr ±1 |
| `notFound()` bei ungültigen Slugs | ✅ | Beide dynamischen Routen abgesichert |
| Hydration-Warnung unterdrückt | ✅ | LiveDate: `suppressHydrationWarning` |
| Keine Runtime-Fehler | ✅ | Konsole sauber auf allen 5 Routen |
| Jahresgrenze prev/next KW | ✅ | KW 1 → letzte KW Vorjahr; letzte KW → KW 1 Folgejahr |

### 2. Meta Tags & Canonical

| Seite | Title | Description | Canonical | OG (16 Tags) | Twitter (5 Tags) | Status |
|-------|-------|-------------|-----------|--------------|------------------|--------|
| `/` | dynamisch (KW + Jahr) | dynamisch | ✅ | ✅ | ✅ | ✅ |
| `/kalenderwoche` | dynamisch (Jahr + Anzahl) | dynamisch | ✅ | ✅ | ✅ | ✅ |
| `/faq` | statisch | statisch | ✅ | ✅ | ✅ | ✅ |
| `/kw/[slug]` | dynamisch (KW + Datum) | dynamisch | ✅ | ✅ | ✅ | ✅ |
| `/kalenderwochen/[year]` | dynamisch (Jahr + Anzahl) | dynamisch | ✅ | ✅ | ✅ | ✅ |
| `layout.tsx` (default) | ✅ template `%s \| aktuellekw.de` | ✅ | ✅ | ✅ | ✅ | ✅ |

### 3. Schema.org JSON-LD (alle JSON-parse-validiert)

| Seite | Schemas | Validierung |
|-------|---------|-------------|
| Alle Seiten (layout) | `WebSite` (name, url, inLanguage, publisher) | ✅ gültig |
| `/` | `WebApplication`, `BreadcrumbList` (1 Ebene), `FAQPage` (8 Fragen) | ✅ gültig |
| `/faq` | `FAQPage` (13 Fragen), `BreadcrumbList` (2 Ebenen) | ✅ gültig |
| `/kalenderwoche` | `Dataset`, `BreadcrumbList` (2 Ebenen) | ✅ gültig |
| `/kw/[slug]` | `Event` (startDate/endDate ISO), `BreadcrumbList` (3 Ebenen) | ✅ gültig |
| `/kalenderwochen/[year]` | `Dataset` (temporalCoverage), `BreadcrumbList` (2 Ebenen) | ✅ gültig |

### 4. Interne Verlinkung

| Von | Nach | Status |
|-----|------|--------|
| `/` Hero | `/kw/[prev]-[year]`, `/kw/[next]-[year]`, `/kw/[aktuell]-[year]` | ✅ |
| `/` Sektionen | `/kalenderwoche`, `/faq` | ✅ |
| `/kw/[slug]` | `/kw/[prev]`, `/kw/[next]`, `/kalenderwochen/[year]`, `/`, `/faq` | ✅ |
| `/kalenderwochen/[year]` | `/kalenderwochen/[year-1]`, `/kalenderwochen/[year+1]`, `/`, `/faq` | ✅ |
| `/kalenderwoche` | `/kalenderwochen/[year-1]`, `/kalenderwochen/[year+1]`, `/`, `/faq` | ✅ |
| `/faq` | `/`, `/kalenderwoche` | ✅ |
| KWTable-Zellen → `/kw/[n]-[year]` | – | ⚠️ offen (TODO) |

### 5. KI-Suche Optimierung

| Maßnahme | Status |
|----------|--------|
| GPTBot in robots.txt erlaubt | ✅ |
| ChatGPT-User in robots.txt erlaubt | ✅ |
| PerplexityBot in robots.txt erlaubt | ✅ |
| Google-Extended (Gemini/SGE) in robots.txt erlaubt | ✅ |
| ClaudeBot + anthropic-ai in robots.txt erlaubt | ✅ |
| FAQPage Schema mit direkten Antworten (21 Q&A gesamt) | ✅ |
| `inLanguage: "de-DE"` im WebSite Schema | ✅ |
| Speakable Schema | ⚠️ offen |

### 6. Sitemap

| Prüfpunkt | Status |
|-----------|--------|
| `/sitemap.xml` erreichbar | ✅ |
| Startseite: priority 1.0, daily | ✅ |
| /kalenderwoche: priority 0.9, yearly | ✅ |
| /faq: priority 0.7, monthly | ✅ |
| /kalenderwochen/[year] (3 Jahre): priority 0.6–0.85 | ✅ |
| /kw/[n]-[year] (157 Seiten): priority 0.3–0.8 | ✅ |
| Aktuelle KW-Seite: priority 0.8, weekly | ✅ |
| lastModified: endDate der KW für vergangene Wochen | ✅ |
| Gesamtzahl URLs in Sitemap | ✅ ~165 URLs |

### 7. SEO-Texte & Placeholders

Alle Placeholders sind mit `[PLACEHOLDER: ...]` markiert und per Suche auffindbar (`grep -r "PLACEHOLDER" app/`).

| Datei | Placeholder | Wörter | Status |
|-------|------------|--------|--------|
| `app/page.tsx` L310 | FAQ Einleitungstext | 40–60 | ⚠️ offen |
| `app/page.tsx` L358 | Kurztext Jahresübersicht | 30–50 | ⚠️ offen |
| `app/faq/page.tsx` L143 | FAQ Einleitungstext | 60–80 | ⚠️ offen |
| `app/kalenderwoche/page.tsx` L128 | Einleitungstext Jahresübersicht | 100–150 | ⚠️ offen |
| `app/kalenderwoche/page.tsx` L151 | Abschlusstext Jahresübersicht | 60–80 | ⚠️ offen |

### 8. Performance & Build

| Prüfpunkt | Status | Details |
|-----------|--------|---------|
| Build-Zeit (Compile) | ✅ | 2.4s (Turbopack) |
| Statische Generierung | ✅ | 168 Seiten in 3.5s (7 Worker) |
| Client-JS minimiert | ✅ | Nur 2 Client Components: `LiveDate`, `KWRechner` |
| Server Components überall sonst | ✅ | KWDisplay, KWTable, WeekdayTable, Header, Footer |
| CSS-Animationen (kein JS) | ✅ | progressFill, detailsOpen, fadeIn via `@keyframes` |
| Inter Font: `display: swap` | ✅ | Kein FOUT |
| OG-Image Platzhalter | ✅ | /public/og/ mit 6 PNG-Platzhaltern (1×1 px, valide PNG) |
| OG-Image echte Bilder | ⚠️ offen | Platzhalter durch 1200×630 px Bilder ersetzen |
| favicon + apple-touch-icon | ⚠️ prüfen | favicon.ico vorhanden? |

### 9. Verbleibende TODOs (priorisiert)

| Priorität | Aufgabe | Cluster / Impact |
|-----------|---------|-----------------|
| 🔴 Hoch | SEO-Texte für alle 5 Placeholders schreiben | Cluster 1–4, Ranking |
| 🔴 Hoch | OG-Images erstellen (1200×630px, 6 Dateien in /public/og/) | Social Sharing CTR |
| 🟡 Mittel | KWTable-Zellen auf `/kw/[n]-[year]` verlinken | Interne Verlinkung, Cluster 5 |
| 🟡 Mittel | `/wie-viele-wochen-hat-ein-jahr/` Ratgeber-Seite | Cluster 4, ~45.000/Monat |
| 🟢 Niedrig | Speakable Schema für KI-Sprachsuche | KI-Suche |
| 🟢 Niedrig | `/kalender-download/` (PDF-Download) | Cluster 6, ~6.000/Monat |
| 🟢 Niedrig | hreflang AT/CH wenn mehrsprachig ausgebaut | International |
