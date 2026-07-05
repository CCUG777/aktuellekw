# SEO-Audit aktuellekw.de – Phase 1 (read-only)

Stand: 2026-07-05 · Aktuelles ISO-Jahr im Code = `getCurrentKW().year`
Nur Analyse, keine Änderungen vorgenommen.

## 1. Routen-Inventar: Indexierung / Canonical / Keyword / Problem

Legende Status: **INDEX** = indexierbar (kein `robots`-Override, erbt `index,follow` aus `layout.tsx`) · **NOINDEX** = `robots: { index:false, follow:true }`.

| Route | Status | Canonical | Ziel-Keyword | Problem |
|-------|--------|-----------|--------------|---------|
| `/` | INDEX | self (`/`) | aktuelle kw, welche kalenderwoche haben wir | **Keyword-Stuffing** (s. §2); **FAQPage-Schema doppelt** (auch auf /faq) |
| `/kalenderwoche` | INDEX | self | kalenderwochen 2026 / KW-Übersicht | **Kannibalisierung** mit `/` und `/kalenderwochen/2026` – inhaltlich fast Duplikat der Jahresübersicht; FAQPage-Schema |
| `/kalenderwochen/[year]` | INDEX (nur akt. Jahr) / NOINDEX (andere) | self (akt.) / `/kalenderwochen/{aktJahr}` (andere) | kalenderwochen 2026 | **Kannibalisierung** mit `/kalenderwoche`; Cross-Canonical 2025→2026 zeigt auf Nicht-Duplikat (wird von Google ignoriert – nur `noindex` greift) |
| `/kw/[slug]` (≈157 Seiten) | **NOINDEX (alle)** | **`/kalenderwoche`** | kw 15 2025 etc. | **Widersprüchlich:** `noindex` + Canonical auf fremde URL. Doorway-Muster, kein Mehrwert. Aus Sitemap entfernt. → Phase 4 |
| `/faq` | INDEX | self | welche kalenderwoche / wie viele wochen | FAQPage-Schema (korrekt hier) |
| `/wie-viele-wochen-hat-ein-jahr` | INDEX | self | wie viele wochen hat ein jahr | FAQPage-Schema zusätzlich zu /faq (Duplikat-Risiko) |
| `/datum-heute` | INDEX | self | datum heute / welcher tag ist heute | FAQPage-Schema |
| `/tagerechner` | INDEX | self | tage berechnen / tagerechner | FAQPage-Schema; Tool → besser `WebApplication`-Schema |
| `/arbeitstage-berechnen` | INDEX | self | arbeitstage berechnen | Tool → `WebApplication`-Schema fehlt/prüfen |
| `/schaltjahr` | INDEX | self | schaltjahr | FAQPage-Schema |
| `/feiertage` (Hub) | INDEX | self | feiertage deutschland | – |
| `/feiertage/[year]` | INDEX (akt.) / NOINDEX (andere) | self / akt. Jahr | feiertage 2026 | Canonical anderer Jahre zeigt auf Nicht-Duplikat |
| `/feiertage/[year]/[bundesland]` | **NOINDEX (alle)** | `/feiertage/{aktJahr}` | feiertage bayern 2026 | Komplett deindexiert; Canonical auf fremde URL |
| `/schulferien/[jahr]` | INDEX (akt.) / NOINDEX (andere) | self / akt. Jahr | schulferien 2026 | wie feiertage/[year] |
| `/schulferien/[jahr]/[bundesland]` | **NOINDEX (alle)** | `/schulferien/{aktJahr}` | schulferien bayern | Komplett deindexiert; Canonical auf fremde URL |
| `/ostern/[year]` | INDEX (akt.) / NOINDEX | self / akt. Jahr | ostern 2026 | – |
| `/ostermontag/[year]` | INDEX (akt.) / NOINDEX | self / akt. Jahr | ostermontag 2026 | – |
| `/osterferien/[year]` | INDEX (akt.) / NOINDEX | self / akt. Jahr | osterferien 2026 | – |
| `/arbeitstage/[year]` | INDEX (akt.) / NOINDEX | self / akt. Jahr | arbeitstage 2026 | – |
| `/zeitumstellung/[year]` | INDEX (akt.) / NOINDEX | self / akt. Jahr | zeitumstellung 2026 | – |
| `/ueber-uns` | INDEX | self | über aktuellekw.de | E-E-A-T ausbaufähig (Phase 5) |
| `/impressum` | NOINDEX | self | – | korrekt |
| `/datenschutz` | NOINDEX | self | – | korrekt |

## 2. Sitemap-Prüfung (`app/sitemap.ts`)

- Enthält **nur indexierbare URLs** – gut. KW-Einzelseiten und Bundesland-Seiten wurden bereits entfernt (leere Arrays).
- **Problem `lastmod`:** Die meisten Einträge setzen `lastModified: now` (jeder Build = neues Datum, auch ohne inhaltliche Änderung). Das entwertet das Signal → sollte echtes Änderungsdatum sein (Phase 2.3).
- Keine `noindex`-Seite in der Sitemap gefunden. ✔
- Kommentar-Checkliste am Dateiende ist **veraltet** (behauptet KW-Seiten & 3 Jahre in Sitemap – stimmt nicht mehr).

## 3. robots.txt (`public/robots.txt`)

- `Allow: /` für alle + KI-Crawler explizit erlaubt. ✔
- Keine Blockade von CSS/JS. ✔
- Sitemap-Verweis vorhanden. ✔
- Kein Handlungsbedarf.

## 4. Keyword-Stuffing / künstliche Varianten (Fundstellen)

| Datei:Zeile | Fundstelle | Maßnahme (Phase 3) |
|-------------|-----------|--------------------|
| `app/page.tsx:202` | „Die KW Woche heute …" | umschreiben |
| `app/page.tsx:266` | „… oder der **KW Woche heute** …" | streichen |
| `app/page.tsx:454` | „(auch oft als *aktuelle Kalender&shy;Woche* gesucht)" – **Soft Hyphen `&shy;` im Keyword** | streichen |
| `app/page.tsx` (mehrfach) | 29× `&nbsp;`; gehäufte Nennung „aktuelle KW / KW heute / heutige Kalenderwoche" im selben Absatz | entstuffen |
| `app/impressum/page.tsx:215-216` | `&shy;` in „Verbraucher&shy;streit&shy;beilegung" | **unkritisch** (Silbentrennung, kein Keyword) – bleibt |

Weitere Soft-Hyphen-Vorkommen in Keywords: nur `page.tsx:454`. Rechtstexte sind sauber.

## 5. FAQPage-Schema-Verteilung (Duplikat-Risiko)

`FAQPage` JSON-LD liegt auf **7 Seiten**: `/`, `/faq`, `/wie-viele-wochen-hat-ein-jahr`, `/kalenderwoche`, `/schaltjahr`, `/datum-heute`, `/tagerechner`.
→ Phase 5: FAQPage nur auf `/faq` behalten; auf den übrigen entfernen (sichtbare FAQ-Texte dürfen bleiben, nur das Schema-Markup raus, um Duplikate/Spam-Signal zu vermeiden).

## 6. Kernbefund – die drei Ursachen im Code

1. **Kannibalisierung** `/kalenderwoche` ⇄ `/kalenderwochen/{aktJahr}`: zwei fast identische Jahresübersichten, beide `index`, beide auf „Kalenderwochen [Jahr]" optimiert. → Phase 2.2 (Entscheidung nötig).
2. **`/kw/[slug]` widersprüchlich**: `noindex` + Canonical auf `/kalenderwoche` (fremde URL). ≈157 Doorway-artige Seiten ohne Mehrwert. → Phase 2.1 + Phase 4.1.
3. **Keyword-Stuffing** auf der Startseite (§4) + **Schema-Duplikate** (§5).

## 7. Nebenbefunde

- Cross-Canonicals „Jahr X → aktuelles Jahr" (feiertage/schulferien/ostern/…): technisch wirkungslos (Google ignoriert Canonical auf Nicht-Duplikat), aber durch `noindex` unschädlich. Kein akuter Handlungsbedarf.
- Bundesland-Seiten (`feiertage/…/[bundesland]`, `schulferien/…/[bundesland]`) sind komplett deindexiert – ungenutztes Potenzial, aber bewusst so gesetzt. Nicht Teil dieser Sanierung.
- `sitemap.ts` Checklisten-Kommentar veraltet – beim Bearbeiten mitkorrigieren.
