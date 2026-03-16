# SEO Keyword Cluster Integration – aktuellekw.de

Baue die folgenden 5 Keyword-Cluster SEO-optimiert in das bestehende Projekt ein. Du kennst die Projektstruktur bereits.

---

## Cluster 1 – Startseite

**Meta-Titel:** `Aktuelle KW – Welche Kalenderwoche ist heute?`

| Keyword | Platzierung |
|---|---|
| Aktuelle KW | H1 + Title Tag |
| KW aktuell | Hero-Text & Meta-Description |
| Aktuelle Kalenderwoche | H2 / Subheadline Hero |
| Kalenderwoche aktuell | Fließtext / FAQ |
| Heutige Kalenderwoche | Dynamischer Text: „Heute ist KW {X}" |
| Kalenderwoche heute | Alt-Tag Hero-Icon + Breadcrumb |
| KW heute | Snippet-optimierter Kurztext (1–2 Sätze) |
| KW Woche heute | Ergänzend im Fließtext |

SEO-Text-Platzhalter einfügen:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 1
    H2: "Was ist die aktuelle Kalenderwoche?"
    Ca. 150–200 Wörter | Keywords: aktuelle KW, Kalenderwoche heute, KW aktuell
    TODO: SEO-Text hier einfügen */}
```

---

## Cluster 2 – `/kalender-mit-kalenderwochen`

**Meta-Titel:** `Kalender mit Kalenderwochen 2026 – KW Übersicht`

| Keyword | Platzierung |
|---|---|
| Kalender mit Wochen | H1 |
| Kalenderwochen | Title Tag / H2 |
| Kalender mit KW | Unterüberschrift Kalender-Widget |
| KW Kalender | Meta-Description |
| KW im Kalender | Fließtext / Erklärabschnitt |

SEO-Text-Platzhalter einfügen:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 2
    H2: "Kalender mit Kalenderwochen 2026"
    Ca. 120–150 Wörter | Keywords: Kalender mit Wochen, Kalenderwochen, KW im Kalender
    TODO: SEO-Text hier einfügen */}
```

---

## Cluster 3 – `/kalenderwochen-uebersicht`

**Meta-Titel:** `Kalenderwochen 2026 – Alle KW auf einen Blick`

| Keyword | Platzierung |
|---|---|
| Kalender Wochenübersicht | H1 / H2 |
| Kalender mit Wochenübersicht | Meta-Description |
| Kalenderwochen im Überblick | H2 / Intro-Text |
| Kalenderwochen Überblick | Fließtext |
| Überblick Kalenderwochen | Alt-Tags / Tabellen-Caption |

SEO-Text-Platzhalter einfügen:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 3
    H2: "Alle Kalenderwochen 2026 im Überblick"
    Ca. 100–130 Wörter | Keywords: Kalenderwochen Überblick, Wochenübersicht
    TODO: SEO-Text hier einfügen */}
```

---

## Cluster 4 – Info-Section auf der Startseite

**Meta-Titel (falls eigene Seite):** `Welche Woche im Jahr ist heute? – KW aktuell`

| Keyword | Platzierung |
|---|---|
| Woche Jahr | Dynamischer Satz: „Wir befinden uns in Woche {X} von 52" |
| KW Wochen | Fließtext / FAQ Startseite |

Cluster 4 auf der Startseite als eigene Info-Section einbauen – eigene Unterseite nur wenn du es für SEO sinnvoll hältst.

SEO-Text-Platzhalter einfügen:
```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 4
    Abschnitt: "Die wievielte Woche im Jahr ist heute?"
    Ca. 80–100 Wörter | Keywords: Woche Jahr, KW Wochen
    TODO: SEO-Text hier einfügen */}
```

---

## Cluster 5 – 52 Unterseiten `/kw-1` bis `/kw-52`

**Meta-Titel (dynamisch):** `Kalenderwoche {X} – Datum & Infos zur KW {X}`

Implementiere als Dynamic Route mit `generateStaticParams()` (SSG für alle KW 1–52).

Jede Unterseite enthält:
- H1: `Kalenderwoche {X} {YYYY}`
- Start- und Enddatum der KW (ISO 8601, Woche beginnt Montag)
- Navigation zur vorherigen / nächsten KW (interne Verlinkung)
- JSON-LD strukturierte Daten
- SEO-Text-Platzhalter:

```tsx
{/* SEO-TEXT PLATZHALTER – CLUSTER 5
    H2: "Infos zur Kalenderwoche {X}"
    Ca. 80–100 Wörter (template-basiert)
    TODO: SEO-Text-Template hier einfügen */}
```

---

## Allgemein

- `generateMetadata()` für jede Seite (Title, Description, OpenGraph)
- Interne Verlinkung zwischen allen Seiten in Navigation / Footer sicherstellen
- Keine bestehende Funktionalität brechen
- Reihenfolge: Cluster 1 → Cluster 5 → Cluster 2 → Cluster 3 → Cluster 4
