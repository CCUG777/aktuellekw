# Claude Code Prompt: SEO Keyword Cluster Integration – aktuellekw.de

## Kontext

Du arbeitest an **aktuellekw.de**, einer deutschen Kalenderwoche-Website gebaut mit Next.js 14. Die Website hat bereits eine Grundstruktur. Deine Aufgabe ist es, fünf Keyword-Cluster SEO-optimiert zu integrieren – exakt nach den Zuordnungen unten.

---

## Aufgabe 1: Cluster 1 – Startseite optimieren

**Meta-Titel (statisch):**
```
Aktuelle KW – Welche Kalenderwoche ist heute?
```

**Keywords & Platzierung:**
- `Aktuelle KW` → H1 der Startseite + Title Tag
- `KW aktuell` → Hero-Text & Meta-Description (als Synonym)
- `Aktuelle Kalenderwoche` → H2 oder Subheadline im Hero-Bereich
- `Kalenderwoche aktuell` → Fließtext / FAQ-Bereich
- `Heutige Kalenderwoche` → Dynamischer Text: `"Heute ist KW {aktuelleKW}"`
- `Kalenderwoche heute` → Alt-Tag des Hero-Icons und Breadcrumb
- `KW heute` → Snippet-optimierter Kurztext (1–2 Sätze, für Featured Snippet geeignet)
- `KW Woche heute` → Ergänzend im Fließtext

**Umsetzung:**
- Alle dynamischen Texte (aktuelle KW-Nummer, Datum) weiterhin serverseitig berechnet lassen
- Für den noch fehlenden SEO-Fließtext einen klar markierten **Platzhalter** einfügen:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 1
    H2: "Was ist die aktuelle Kalenderwoche?"
    Ca. 150–200 Wörter, Keywords: aktuelle KW, Kalenderwoche heute, KW aktuell
    TODO: SEO-Text hier einfügen
*/}
```

---

## Aufgabe 2: Cluster 2 – Seite `/kalender-mit-kalenderwochen`

**Meta-Titel:**
```
Kalender mit Kalenderwochen 2026 – KW Übersicht
```

**Keywords & Platzierung:**
- `Kalender mit Wochen` → H1 der Seite
- `Kalenderwochen` → Title Tag / H2
- `Kalender mit KW` → Unterüberschrift des Kalender-Widgets
- `KW Kalender` → Meta-Description der Seite
- `KW im Kalender` → Fließtext / Erklärabschnitt
- `Kalender Woch` (Tippfehler-Variante) → wird automatisch durch die anderen Keywords mit abgedeckt, keine explizite Erwähnung nötig

**Umsetzung:**
- Prüfe, ob diese Route bereits existiert
- Falls ja: Meta-Titel + Keywords gemäß Zuordnung einbauen
- Falls nein: Neue Seite `app/kalender-mit-kalenderwochen/page.tsx` anlegen mit korrekter Struktur (H1, H2, Kalender-Widget-Einbindung)
- SEO-Fließtext-Platzhalter:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 2
    H2: "Kalender mit Kalenderwochen 2026"
    Ca. 120–150 Wörter, Keywords: Kalender mit Wochen, Kalenderwochen, KW im Kalender
    TODO: SEO-Text hier einfügen
*/}
```

---

## Aufgabe 3: Cluster 3 – Seite `/kalenderwochen-uebersicht`

**Meta-Titel:**
```
Kalenderwochen 2026 – Alle KW auf einen Blick
```

**Keywords & Platzierung:**
- `Kalender Wochenübersicht` → H1 oder H2 der Seite
- `Kalender mit Wochenübersicht` → Meta-Description
- `Kalenderwochen im Überblick` → H2 / Intro-Text
- `Kalenderwochen Überblick` + `Überblick Kalenderwochen` → Fließtext & Alt-Tags / Tabellen-Caption

**Umsetzung:**
- Prüfe, ob diese Route bereits existiert
- Falls ja: Meta-Titel + Keywords einbauen
- Falls nein: Neue Seite `app/kalenderwochen-uebersicht/page.tsx` anlegen mit Tabellen-/Listenstruktur aller 52 KWs
- SEO-Fließtext-Platzhalter:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 3
    H2: "Alle Kalenderwochen 2026 im Überblick"
    Ca. 100–130 Wörter, Keywords: Kalenderwochen Überblick, Wochenübersicht
    TODO: SEO-Text hier einfügen
*/}
```

---

## Aufgabe 4: Cluster 4 – Info-Section auf der Startseite

**Meta-Titel (falls eigene Seite sinnvoll):**
```
Welche Woche im Jahr ist heute? – KW aktuell
```

**Keywords & Platzierung:**
- `Woche Jahr` → Eigener Absatz mit Dynamik: `"Wir befinden uns in Woche {aktuelleKW} von 52"`
- `KW Wochen` → Ergänzend im Fließtext / FAQ der Startseite

**Umsetzung:**
- Cluster 4 auf der **Startseite** als eigene Info-Section integrieren (kein eigene Unterseite nötig, außer du hältst das für sinnvoll)
- Dynamischen Satz einbauen: `"Heute ist Woche {X} von 52 im Jahr {YYYY}"`
- SEO-Fließtext-Platzhalter:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 4
    Abschnitt: "Die wievielte Woche im Jahr ist heute?"
    Ca. 80–100 Wörter, Keywords: Woche Jahr, KW Wochen
    TODO: SEO-Text hier einfügen
*/}
```

---

## Aufgabe 5: Cluster 5 – 52 Unterseiten `/kw-1` bis `/kw-52`

**Meta-Titel (dynamisch, pro Seite):**
```
Kalenderwoche {X} – Datum & Infos zur KW {X}
```

**Keywords & Platzierung:**
- `Kalenderwoche {X}` (z.B. „Kalenderwoche 10") → H1 der jeweiligen Unterseite
- Datum der KW (Montag–Sonntag) → direkt unter H1, dynamisch berechnet
- Strukturierte Daten (JSON-LD) für jede KW-Seite

**Empfehlung zur Implementierung:**
Verwende **Dynamic Routing** in Next.js 14:
```
app/kw/[nummer]/page.tsx
```
mit `generateStaticParams()` für alle KW 1–52 (Static Site Generation).

**Anforderungen je Unterseite:**
- H1: `Kalenderwoche {X} {YYYY}`
- Dynamisch berechnetes Start- und Enddatum (ISO 8601 konform)
- Hinweis auf Feiertage (Platzhalter-Logik reicht zunächst)
- Link zur vorherigen und nächsten KW (interne Verlinkung!)
- JSON-LD strukturierte Daten
- SEO-Fließtext-Platzhalter:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 5
    H2: "Infos zur Kalenderwoche {X}"
    Ca. 80–100 Wörter pro Seite (kann template-basiert generiert werden)
    TODO: SEO-Text-Template hier einfügen
*/}
```

**Wichtig:** Prüfe zuerst, ob `/kw/[nummer]` oder eine ähnliche Struktur bereits existiert. Falls ja, passe sie an. Falls nein, lege die Struktur neu an.

---

## Allgemeine Anforderungen für alle Änderungen

1. **Keine bestehende Funktionalität brechen** – alle bestehenden Routen und Komponenten bleiben funktionsfähig
2. **Next.js 14 App Router** – alle neuen Seiten als Server Components, dynamische Werte serverseitig berechnen
3. **generateMetadata()** für jede Seite korrekt implementieren (Title, Description, OpenGraph)
4. **Interne Verlinkung** zwischen allen neuen Seiten sicherstellen (Navigation / Footer)
5. **Platzhalter-Kommentare** für SEO-Texte exakt wie oben gezeigt formatieren – sie werden später durch echte Texte ersetzt
6. **ISO 8601** für alle KW-Berechnungen (Woche beginnt Montag, erste KW = erste Woche mit Donnerstag)

---

## Reihenfolge der Umsetzung

1. Zuerst Projektstruktur analysieren (`tree` oder Dateiliste)
2. Cluster 1 (Startseite) – Meta + Keywords + Platzhalter
3. Cluster 5 (Dynamic Route `/kw/[nummer]`) – wegen hohem SEO-Impact prioritär
4. Cluster 2 (`/kalender-mit-kalenderwochen`)
5. Cluster 3 (`/kalenderwochen-uebersicht`)
6. Cluster 4 (Info-Section Startseite)
7. Abschließend: Interne Verlinkung und Navigation prüfen
