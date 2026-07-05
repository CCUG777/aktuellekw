# GSC-Analyse aktuellekw.de (Export 2026-07-05, letzte 12 Monate)

## Gesamtbild
- **10.945 Impressionen, 5 Klicks, CTR 0,05 %, Ø-Position ~26.**
- **Absturz datierbar auf ~7. März 2026:** Position 1.–6. März noch **11–13**, ab 7. März sprunghaft auf **40–55**. Klassisches Muster eines algorithmischen Spam-/Helpful-Content-Signals, nicht eines langsamen Verfalls.
- Diagnose deckt sich mit Audit: Keyword-Stuffing + Doorway-KW-Seiten + FAQ-Schema-Streuung als wahrscheinliche Auslöser. → Phase 2/3/5 adressieren genau das.

## Seiten (die wichtigsten)
| URL | Impr. | Klicks | Position | Erkenntnis |
|-----|------:|-------:|--------:|-----------|
| `/` | 9.636 | 2 | 26,2 | Trägt fast alle Impressionen, rankt aber nur ~26 für Kern-Keywords |
| `/kalenderwoche` | 876 | 1 | 39,5 | Schwächer als die Jahres-URL |
| `/kalenderwochen/2026` | 63 | 0 | **16,0** | **Rankt deutlich besser** als /kalenderwoche → soll „kalenderwochen 2026" besitzen |
| `/kalender-mit-kalenderwochen` (301) | 96 | 0 | **4,8** | Alt-URL rankt Top-5 – Autorität geht durch 301 teils verloren |
| `/kalenderwochen-uebersicht` (301) | 54 | 0 | 17,2 | dito |
| `/kw/21-2026` | 14 | 0 | **3,5** | **KW-Detailseiten ranken Top-5**, wenn sie auftauchen |
| `/kw/11-2027` | 4 | 0 | 6,3 | dito |
| `/kw/1-2025` | 1 | 0 | 4,0 | dito |
| `/datum-heute` | 17 | 1 | 22,5 | solide Tool-Seite |

## Suchanfragen – Nachfrage-Cluster
**A. Transaktional „aktuelle KW" (Startseite) – höchstes Volumen, Position 12–36:**
- welche kw haben wir (885, P19,6) · aktuelle kw (658, P26,4) · kw heute (404, P18,1) · aktuelle kalenderwoche (358, P36,4) · welche kw haben wir gerade (322, P11,7) · kw aktuell (156) · aktuelle kw 2026 (119, P8,9)
- → **Größter Hebel:** Startseite von P26 in Top-5 bringen (Entstuffing + E-E-A-T + Snippet-Klarheit).

**B. „kalenderwochen 2026 / Jahresübersicht":**
- kalenderwochen 2026 (59, **P5,25**) · kalender mit wochen 2026 (97, **P1,03**) · kalender 2026 mit kw (**P1,29**) · kalenderwochen 2026 übersicht (P12,7)
- → **/kalenderwochen/2026** soll dieses Cluster besitzen; **/kalenderwoche** wird informationaler Hub (Entscheidung bestätigt).

**C. „wann ist KW XX" + „KW XX 2026" – starke KW-Detailseiten-Nachfrage, Position 8–11:**
- wann ist kw13 (58, P8,7) · wann ist kw12 (50, P9,3) · wann ist kw16 (24, P7,9) · wann ist kw18 (23, P9,3) · wann ist kw21 (15, P8,6) · kw 9 2026 (57, P10,5) · kw 10 2026 (19) · viele „kw XX 2026 datum"
- → **Validiert Phase 4.1 stark:** KW-Seiten aufwerten + indexieren.

**D. PDF-/Druck-Kalender – echte Klick-Intention, kaum bedient:**
- kw 2026 pdf (P1) · kalenderwochen 2018 pdf (P60,8) · wochenkalender 2026 (P71) · kalender 2026 mit kw (P1,3)
- → **Validiert Phase 4.2** (PDF-Kalender-Landingpage).

**E. Gerade/ungerade Wochen – Cluster OHNE eigene Seite (neu, nicht im Ausgangsplan):**
- ist diese woche eine gerade woche (P55) · gerade und ungerade wochen 2026 (P10,7) · gerade wochen 2026 · ungerade kalenderwochen 2026 (P1) · ist diese woche eine gerade kalenderwoche
- → **Neue Chance:** kleine Seite/Feature „Gerade oder ungerade Woche?" – günstig, klare Intention, kein Wettbewerber-Fokus.

**F. Historische Jahre:** kalenderwochen 2016/2017/2018/2019, „kw wochen 2018" etc. – konstante Nachfrage nach Vorjahren (aktuell noindex).

## Repriorisierung Phase 4 (datenbasiert)
| Prio | Maßnahme | Beleg im GSC | Aufwand |
|------|----------|--------------|---------|
| 🔴 1 | **KW-Detailseiten aufwerten + indexieren** (4.1) | Cluster C, KW-Seiten P3,5–9 | hoch |
| 🔴 2 | **Startseite als sauberer „aktuelle KW"-Treffer** (Phase 3 ✅ + E-E-A-T) | Cluster A, 9.636 Impr | mittel |
| 🔴 3 | **/kalenderwoche → Ratgeber-Hub, /kalenderwochen/2026 stärken** (2.2) | Cluster B, Kannibalisierung | mittel |
| 🟡 4 | **PDF-Kalender-Landingpage** (4.2) | Cluster D | hoch |
| 🟢 5 | **Gerade/ungerade-Woche-Feature** (neu) | Cluster E | niedrig |
| 🟢 6 | **Widget** (4.3) | Linkmagnet, kein direkter Query-Beleg | mittel |
| ⚪ 7 | **Excel-Guide (4.4), B2B-Lieferplanung (4.5)** | **kein Query-Beleg im Export** – zurückstellen | hoch |

**Fazit:** Excel-Guide und B2B-Seite (4.4/4.5) zeigen im aktuellen GSC-Export **keine Nachfrage** – ich würde sie zugunsten von KW-Seiten, PDF-Kalender und dem günstigen Gerade/Ungerade-Feature zurückstellen.
