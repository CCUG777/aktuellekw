# Jahresaktuelle Content Pages - Strategie & Umsetzung

> Dieses Dokument beschreibt, wie aktuelle-kw.de jaehrlich frischen Content generiert
> und welche Schritte noetig sind, um jedes Jahr neue Seiten bereitzustellen.

---

## 1. Ueberblick: Welche Content Pages werden pro Jahr generiert?

| Content-Typ | URL-Schema | Seiten pro Jahr | Beispiel |
|---|---|---|---|
| **Kalenderwochen-Uebersicht** | `/kalenderwochen-{jahr}/` | 1 | `/kalenderwochen-2028/` |
| **Einzelne KW-Seiten** | `/kw-{nummer}-{jahr}/` | 52-53 | `/kw-15-2028/` |
| **Feiertage-Hub** | `/feiertage-{jahr}/` | 1 | `/feiertage-2028/` |
| **Einzelne Feiertag-Seiten** | `/feiertage-{jahr}/{feiertag}/` | ~19 | `/feiertage-2028/karfreitag/` |
| **Feiertage nach KW** | `/feiertage-{jahr}/alle-feiertage-nach-kw/` | 1 | `/feiertage-2028/alle-feiertage-nach-kw/` |
| **Schulferien-Hub** | `/schulferien-{jahr}/` | 1 | `/schulferien-2028/` |
| **Schulferien pro Bundesland** | `/schulferien-{jahr}/{bundesland}/` | 16 | `/schulferien-2028/bayern/` |
| **Magazin Monatsvorschauen** | `/magazin/{monat}-{jahr}-kalenderwochen/` | 12 | `/magazin/januar-2028-kalenderwochen/` |
| **Kalender-Downloads (PDF/ICS)** | `/kalender-download/` | Dateien pro Jahr | PDF + ICS fuer 2028 |

**Gesamt pro Jahr: ca. 105+ neue Seiten** (53 KW + 19 Feiertage + 16 Schulferien + 3 Hubs + 12 Magazin + Downloads)

---

## 2. Aktuelle Jahres-Konfiguration

### Zentrale Steuerung: `src/lib/constants.ts`

```typescript
export const CONTENT_YEARS = [2025, 2026, 2027];
```

Diese eine Zeile steuert, fuer welche Jahre Seiten generiert werden.
Alle dynamischen Routen, die Sitemap und die Datengenerierung basieren darauf.

### Weitere Stellen mit hartcodierten Jahren

| Datei | Variable | Aktueller Wert |
|---|---|---|
| `src/lib/constants.ts` | `CONTENT_YEARS` | `[2025, 2026, 2027]` |
| `scripts/generate-feiertage.js` | `years` (Zeile 4) | `[2025, 2026, 2027]` |
| `scripts/import-schulferien-api.js` | `YEARS` (Zeile 5) | `[2025, 2026, 2027]` |
| `scripts/generate-ics.js` | Jahres-Array | `[2025, 2026, 2027]` |
| `scripts/generate-pdf.js` | Jahres-Array | `[2025, 2026, 2027]` |
| `src/content/magazin/index.ts` | `MAGAZIN_YEAR` (Zeile 19) | `2026` |

---

## 3. Schritt-fuer-Schritt: Neues Jahr hinzufuegen

### Phase 1: Daten generieren

**Schritt 1 - CONTENT_YEARS aktualisieren**
```typescript
// src/lib/constants.ts
export const CONTENT_YEARS = [2026, 2027, 2028]; // aeltestes Jahr entfernen, neues hinzufuegen
```

**Schritt 2 - Script-Jahre aktualisieren**
```javascript
// scripts/generate-feiertage.js (Zeile 4)
const years = [2026, 2027, 2028];

// scripts/import-schulferien-api.js (Zeile 5)
const YEARS = [2026, 2027, 2028];
```

**Schritt 3 - Feiertage generieren**
```bash
node scripts/generate-feiertage.js
```
Erzeugt: `data/feiertage/2028.json` (automatisch via Computus-Algorithmus fuer Ostern + feste Feiertage)

**Schritt 4 - Schulferien importieren**
```bash
node scripts/import-schulferien-api.js
```
Erzeugt: `data/schulferien/2028/*.json` (16 Bundeslaender, Daten von mehr-schulferien.de API)

**Schritt 5 - Downloads generieren**
```bash
node scripts/generate-ics.js
node scripts/generate-pdf.js
```
Erzeugt: PDF-Kalender und ICS-Dateien fuer das neue Jahr unter `public/downloads/`

**Oder alles auf einmal:**
```bash
npm run generate:all
```

### Phase 2: Magazin-Content aktualisieren

**Schritt 6 - Magazin-Jahr anpassen**
```typescript
// src/content/magazin/index.ts (Zeile 19)
const MAGAZIN_YEAR = 2028;
```
Dies generiert automatisch 12 Monatsvorschauen fuer das neue Jahr.

**Schritt 7 (Optional) - Spezielle Magazin-Artikel**
Neue MDX-Dateien in `src/content/magazin/` erstellen, z.B.:
- `jahresplanung-2029.mdx`
- `kw-1-2028-vorschau.mdx`

### Phase 3: Build & Deploy

**Schritt 8 - Build ausfuehren**
```bash
npm run build
```
Next.js generiert automatisch alle neuen Seiten via `generateStaticParams()`.

**Schritt 9 - Deployment**
Push nach Git → Vercel deployed automatisch.

---

## 4. Was wird automatisch generiert (kein manueller Content noetig)?

### Feiertage (vollautomatisch)
Das Script `generate-feiertage.js` berechnet alle deutschen Feiertage algorithmisch:
- **Feste Feiertage**: Neujahr, Tag der Arbeit, Tag der Deutschen Einheit, Weihnachten etc.
- **Bewegliche Feiertage**: Ostern (Computus), Christi Himmelfahrt, Pfingsten, Fronleichnam
- **Regionale Feiertage**: Heilige Drei Koenige, Frauentag, Reformationstag etc.
- Korrekte Zuordnung zu allen 16 Bundeslaendern

→ **Keine manuelle Pflege noetig** - funktioniert fuer jedes beliebige Jahr.

### Kalenderwochen (vollautomatisch)
Die Funktionen in `src/lib/kw-utils.ts` berechnen ISO-8601-konforme Kalenderwochen:
- `getWeeksInYear(year)` → Ermittelt ob 52 oder 53 Wochen
- `getAllWeeksForYear(year)` → Alle Wochendaten mit Tagen
- `buildKWData(week, year)` → Detaildaten pro Woche inkl. zugehoeriger Feiertage

→ **Keine manuelle Pflege noetig** - rein algorithmisch.

### Magazin-Monatsvorschauen (vollautomatisch)
Die Funktion `buildMonthPreview()` in `src/content/magazin/index.ts` generiert fuer jeden Monat:
- KW-Bereich des Monats
- Feiertage im Monat
- SEO-optimierte Titel und Beschreibungen

→ **Nur `MAGAZIN_YEAR` anpassen** - Content wird dynamisch erzeugt.

### Sitemap (vollautomatisch)
`src/app/sitemap.ts` iteriert ueber `CONTENT_YEARS` und erzeugt alle URLs.

→ **Passt sich automatisch an CONTENT_YEARS an.**

---

## 5. Was manuell gepflegt werden muss

### Schulferien-Daten
- **Quelle**: mehr-schulferien.de API
- **Problem**: API muss Daten fuer das neue Jahr bereitstellen
- **Timing**: Schulferien werden oft erst 1-2 Jahre im Voraus festgelegt
- **Fallback**: Wenn API keine Daten liefert, manuell recherchieren und JSON erstellen

### Spezial-Magazin-Artikel
- Jahresplanung-Artikel (z.B. `jahresplanung-2029.mdx`)
- Spezielle KW-Vorschauen
- Neue Ratgeber-Artikel

### MDX-Content-Seiten
Die Textinhalte in `src/content/pages/` verwenden teilweise Jahresangaben im Fliesstext,
die bei Bedarf aktualisiert werden sollten (z.B. `feiertage-jahr.mdx`, `schulferien-bundesland.mdx`).

---

## 6. Jahreswechsel-Checkliste

```
[ ] CONTENT_YEARS in constants.ts aktualisieren (neues Jahr rein, aeltestes raus)
[ ] Jahre in allen 4 Scripts aktualisieren
[ ] npm run generate:all ausfuehren
[ ] Pruefen ob Schulferien-API Daten fuer neues Jahr hat
[ ] MAGAZIN_YEAR in src/content/magazin/index.ts anpassen
[ ] Optional: Spezial-Magazin-Artikel fuer neues Jahr erstellen
[ ] Optional: MDX-Fliesstext in src/content/pages/ pruefen
[ ] npm run build → Seitenanzahl pruefen
[ ] Deploy auf Vercel
[ ] Sitemap pruefen (alle neuen URLs vorhanden?)
[ ] Stichproben: KW-Seiten, Feiertage, Schulferien aufrufen
```

---

## 7. Empfehlung: Automatisierung

### Kurzfristig: NPM-Script fuer Jahreswechsel
Ein einzelnes Script das alle Jahre-Referenzen zentral aktualisiert:

```javascript
// scripts/update-year.js
// Liest CONTENT_YEARS, verschiebt das Fenster um +1
// Aktualisiert constants.ts + alle Script-Dateien
// Fuehrt generate:all aus
```

### Mittelfristig: CONTENT_YEARS dynamisch berechnen
Statt hartcodierter Jahre:
```typescript
const currentYear = new Date().getFullYear();
export const CONTENT_YEARS = [currentYear - 1, currentYear, currentYear + 1];
```
→ Dann muesste nur noch `generate:all` jaehrlich ausgefuehrt werden.

### Langfristig: CI/CD Cronjob
- GitHub Action oder Vercel Cron die jaehrlich (z.B. 1. November) automatisch:
  1. CONTENT_YEARS aktualisiert
  2. Daten generiert
  3. Build + Deploy ausloest

---

## 8. Content-Typen im Detail

### 8.1 Feiertage

**Nationale Feiertage (gelten bundesweit):**
- Neujahr (1. Januar)
- Karfreitag (beweglich)
- Ostermontag (beweglich)
- Tag der Arbeit (1. Mai)
- Christi Himmelfahrt (beweglich)
- Pfingstmontag (beweglich)
- Tag der Deutschen Einheit (3. Oktober)
- 1. Weihnachtstag (25. Dezember)
- 2. Weihnachtstag (26. Dezember)

**Regionale Feiertage (bundeslandspezifisch):**
- Heilige Drei Koenige (BW, BY, ST)
- Internationaler Frauentag (BE, MV)
- Ostersonntag (BB)
- Pfingstsonntag (BB)
- Fronleichnam (BW, BY, HE, NW, RP, SL)
- Mariae Himmelfahrt (BY, SL)
- Reformationstag (BB, MV, SN, ST, TH, HB, HH, NI, SH)
- Allerheiligen (BW, BY, NW, RP, SL)
- Buss- und Bettag (SN)

**Generierung**: Vollautomatisch via Computus-Algorithmus → Funktioniert fuer jedes Jahr.

### 8.2 Schulferien

**Ferienarten:**
- Winterferien
- Osterferien
- Pfingstferien
- Sommerferien
- Herbstferien
- Weihnachtsferien

**Abdeckung**: Alle 16 Bundeslaender
**Datenquelle**: mehr-schulferien.de API
**Hinweis**: Termine werden von den Kultusministerien festgelegt und koennen sich aendern.

### 8.3 Kalenderwochen

**Pro KW-Seite enthalten:**
- Wochennummer nach ISO 8601
- Start- und Enddatum (Mo-So)
- Zugehoeriger Monat und Quartal
- Feiertage in dieser Woche
- Navigation zur vorherigen/naechsten KW
- Mini-Kalender

### 8.4 Magazin-Content

**Automatisch generiert (12 pro Jahr):**
- Monatsvorschauen mit KW-Bereichen und Feiertagen
- Template-basiert via `monat-preview.mdx`

**Manuell erstellbar:**
- Spezielle KW-Vorschauen
- Jahresplanung-Leitfaeden
- Saisonale Planungstipps

---

## 9. SEO-Relevanz der jaehrlichen Aktualisierung

- **Frische Signale**: Google bevorzugt aktuellen Content fuer zeitbezogene Suchanfragen
- **Suchvolumen**: Queries wie "Feiertage 2028" oder "Schulferien Bayern 2028" starten ab Herbst des Vorjahres
- **Empfohlener Zeitplan**: Neues Jahr bereits im Oktober/November des Vorjahres anlegen
- **URL-Struktur**: Jahresbasierte URLs (`/feiertage-2028/`) ranken gezielt fuer Jahres-Keywords
- **Interne Verlinkung**: Neue Jahresseiten werden automatisch in Navigation und Sitemap eingebunden

---

## 10. Seiten-Generierung auf einen Blick

```
CONTENT_YEARS = [2026, 2027, 2028]
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
  2026            2027            2028
    │               │               │
    ├─ 53 KW-Seiten ├─ 52 KW-Seiten ├─ 52 KW-Seiten
    ├─ 1 KW-Hub     ├─ 1 KW-Hub     ├─ 1 KW-Hub
    ├─ ~19 Feiertage├─ ~19 Feiertage├─ ~19 Feiertage
    ├─ 1 FT-Hub     ├─ 1 FT-Hub     ├─ 1 FT-Hub
    ├─ 16 Schulfer. ├─ 16 Schulfer. ├─ 16 Schulfer.
    ├─ 1 SF-Hub     ├─ 1 SF-Hub     ├─ 1 SF-Hub
    └─ 12 Magazin   └─ 12 Magazin   └─ 12 Magazin

    = ~300+ Seiten gesamt fuer 3 Jahre
```
