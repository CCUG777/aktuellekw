# OG Images – Placeholder-Dateien

Alle `.png`-Dateien in diesem Ordner sind **Platzhalter** (1×1 px, valide PNG-Struktur).
Sie müssen durch echte Open-Graph-Bilder ersetzt werden, bevor die Website live geht.

## Spezifikationen

| Eigenschaft | Wert |
|-------------|------|
| Größe | **1200 × 630 px** |
| Format | PNG oder JPG |
| Dateigröße | ≤ 300 KB empfohlen |
| Hintergrundfarbe | `#000000` (surface) |
| Akzentfarbe | `#0a84ff` (accent) |
| Schriftfarbe | `#f5f5f7` (text-primary) |

## Dateien

| Datei | Seite | Empfohlener Inhalt |
|-------|-------|-------------------|
| `og-default.png` | Fallback (alle Seiten) | Logo + „aktuellekw.de" + Tagline |
| `og-home.png` | `/` (Startseite) | Große KW-Nummer + „Aktuelle Kalenderwoche" + Datum |
| `og-faq.png` | `/faq` | „FAQ – Häufige Fragen zur Kalenderwoche" + Logo |
| `og-kw.png` | `/kw/[slug]` | „KW 9 · 2026" + Datumszeitraum + Logo |
| `og-kalenderwoche.png` | `/kalenderwoche` | „Kalenderwochen 2026" + KW-Raster + Logo |
| `og-kalenderwochen.png` | `/kalenderwochen/[year]` | „Kalenderwochen [Jahr]" + KW-Raster + Logo |

## Hinweise

- Das Bild wird von sozialen Netzwerken (Facebook, LinkedIn, Twitter/X, WhatsApp) beim Teilen geladen
- **Twitter/X** nutzt das gleiche Bild, bevorzugt 2:1-Format (also 1200×600 oder 1200×630 px)
- Facebook empfiehlt mindestens **600×315 px**, ideal **1200×630 px**
- Alt-Text ist im Code gesetzt, muss aber zum Bildinhalt passen
- OG-Bilder werden von Crawlern gecacht – nach Änderung URL-Parameter hinzufügen (z.B. `?v=2`)
