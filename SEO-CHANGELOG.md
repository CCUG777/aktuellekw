# SEO-Changelog aktuellekw.de – Sanierung (Stand 2026-07-05)

Ausgangslage: Absturz ab ~7. März 2026 (Position 11–13 → 40–55), 5 Klicks bei
10.945 Impressionen in 4 Monaten. Ursachen laut Audit + GSC: widersprüchliche
Indexierungssignale, Keyword-Stuffing, Kannibalisierung, fehlender
Informationsgewinn, dünnes E-E-A-T. Details: [SEO-AUDIT.md](SEO-AUDIT.md),
[GSC-ANALYSE.md](GSC-ANALYSE.md).

## Umgesetzte Änderungen (nach Phase)

### Phase 1 – Audit (read-only)
- `SEO-AUDIT.md`: vollständige Routen-/Indexierungstabelle, 3 Kernursachen im Code lokalisiert.

### Phase 2 – Indexierungssignale
- **`/kalenderwoche` → Ratgeber-Hub** „Kalenderwoche: Definition, Berechnung & ISO 8601" (war jahres-spezifisches Duplikat zu `/kalenderwochen/2026`, GSC Pos 39,5 vs 16). Kannibalisierung aufgelöst; Jahres-Intent explizit an `/kalenderwochen/[year]` verlinkt.
- **`sitemap.ts`**: `lastModified` auf festen Inhaltsstand statt `new Date()` (kein lastmod-Churn pro Build); nur indexierbare URLs; veraltete Kommentare korrigiert.

### Phase 3 – Entstuffing Startseite
- Entfernt: „KW Woche heute", Soft-Hyphen-Keyword `aktuelle Kalender&shy;Woche`, Füllsätze („wirst Du fündig", „Was Du wissen musst", „alles Wissenswerte").
- Texte präzisiert (kurze Antwort zuerst), H2s entstuffed.

### Phase 4 – Informationsgewinn (datenbasiert priorisiert)
- **4.1 KW-Detailseiten aufgewertet + indexierbar** (`/kw/[slug]`): pro Woche Feiertage (bundesweit/regional), Arbeitstage, Brückentag-Tipp, Schulferien je Bundesland; **ICS-Download** (`/kw/[slug]/ics`). `noindex→/kalenderwoche` ersetzt durch `index,follow` + Self-Canonical; aktuelle Jahres-KWs zurück in die Sitemap.
- **4.2 `/kw-kalender-zum-ausdrucken`**: neue Landingpage, mountet die vorhandene (bisher ungenutzte) `CalendarPrintSection` (PDF/Excel, A4/A3, Quer/Hoch). GSC-Beleg: „kw 2026 pdf" Pos 1.
- **NEU `/gerade-ungerade-woche`**: GSC-Nachfrage ohne Zielseite („ist diese woche eine gerade woche" u.a.). Direkte Antwort + Anwendungsfälle + Jahreswechsel-Hinweis.
- **Zurückgestellt** (kein GSC-Beleg): `/kalenderwoche-excel`, `/kalenderwochen-lieferplanung`. Excel-Intent wird knapp im Hub `/kalenderwoche` bedient (KALENDERWOCHE Typ 1 vs 21).

### Phase 5 – E-E-A-T & strukturierte Daten
- **Autor**: „aktuellekw.de Redaktion" → **Marc Friedrich** (AuthorByline + Person-JSON-LD).
- **`/ueber-uns`**: fiktives „Team"/„Vier-Augen-Prinzip" durch faktische Autor-Box (Marc Friedrich, Mathematik) + Betreiber (Common Consulting UG) ersetzt; unbelegte Prozessaussagen entschärft; Meta-Description gekürzt/aktualisiert.
- **FAQPage-Schema entdoppelt**: von der Startseite entfernt; lebt nur noch auf `/faq` (sichtbare FAQ-Texte bleiben).

### Phase 6 – QA
- Build clean (Turbopack, ~420 statische Seiten/Routen).
- Pro Seite geprüft: genau 1×H1, `index,follow` + Self-Canonical, Meta-Description 133–156 Zeichen.
- Kein indexierbarer Canonical zeigt mehr auf eine noindex-URL.
- Nav-Label `/kalenderwoche` → „Kalenderwoche" (statt „Kalenderwochen").

## Commits (lokal – siehe „Offen")
`bf1148c` Phase 1–3 · `c908686` Phase 5-Autor + GSC · `08eaabd` Phase 4.1 ·
`41319d9` Phase 5.3 + 2.2 · `9a13cc0` Phase 4.2 · `865d1ad` gerade/ungerade ·
+ Phase-6-Commit.

## ⚠️ Offen / Blocker
- **Git-Push scheitert**: gespeicherte Credentials authentifizieren als `CCUG77`,
  Repo gehört `CCUG777` (403). Alle Commits liegen lokal. → Credential/Token für
  `CCUG777` hinterlegen, dann `git push origin main`.
- **Optional, noch nicht gebaut**: Embed-Widget `/widget` (Linkmagnet, außenwirksam;
  GSC ohne direkten Query-Beleg → bewusst als letzter, optionaler Schritt offen).

## Checkliste für Dich (nach Deploy)
- [ ] Git-Push-Credentials fixen und pushen (siehe oben).
- [ ] GSC: neue **Sitemap** einreichen (`/sitemap.xml`).
- [ ] GSC: **Indexierung beantragen** für die aufgewerteten KW-Seiten – nur aktuelle ±4 Wochen; Rest findet Google selbst.
- [ ] GSC: Indexierung beantragen für `/kalenderwoche` (Hub), `/kw-kalender-zum-ausdrucken`, `/gerade-ungerade-woche`.
- [ ] GSC → **Manuelle Maßnahmen** prüfen (zur Dokumentation; Absturz wirkte algorithmisch, nicht manuell).
- [ ] Echte **OG-Images** ergänzen (aktuell Platzhalter).
- [ ] Nach 4 Wochen: Impressionen/Position der neuen Seiten prüfen (`/kw-kalender-zum-ausdrucken`, `/gerade-ungerade-woche`) und der aufgewerteten `/kw/*`.

## Erwartung
Substanzielle Effekte meist erst mit dem nächsten Core Update (2–4 Monate).
Schnellster Hebel: die neuen Seiten mit echter Klick-Intention (PDF-Kalender,
gerade/ungerade) sowie die entstufte, klarere Startseite.
