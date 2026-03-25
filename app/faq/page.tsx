import type { Metadata } from "next";
import AuthorByline from "@/components/AuthorByline";

export const metadata: Metadata = {
  title: "FAQ – Häufige Fragen zur Kalenderwoche (KW)",
  description:
    "Antworten auf die häufigsten Fragen zur Kalenderwoche: Welche KW haben wir? Wie viele Wochen hat ein Jahr? ISO 8601 einfach erklärt.",
  alternates: {
    canonical: "https://aktuellekw.de/faq",
  },
  openGraph: {
    title: "FAQ – Häufige Fragen zur Kalenderwoche (KW)",
    description:
      "Welche KW haben wir? Wie viele Wochen hat ein Jahr? Alle Antworten rund um die Kalenderwoche nach ISO 8601.",
    url: "https://aktuellekw.de/faq",
    type: "website",
    locale: "de_DE",
    siteName: "aktuellekw.de",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ – Häufige Fragen zur Kalenderwoche (KW)",
    description:
      "Welche KW haben wir? Wie viele Wochen hat ein Jahr? Alle Antworten rund um die Kalenderwoche nach ISO 8601.",
  },
};

const faqs = [
  // Cluster 3: welche KW haben wir (konsolidiert aus 3 Near-Duplicates)
  {
    question: "Welche Kalenderwoche haben wir heute?",
    answer:
      "Die aktuelle Kalenderwoche siehst du auf unserer Startseite live – mit KW-Nummer, Jahr sowie exaktem Start- und Enddatum von Montag bis Sonntag nach ISO 8601. Die Seite aktualisiert sich stündlich automatisch, sodass du immer den richtigen Wert siehst, ohne selbst rechnen zu müssen. Als schnelle Faustregel: Suche den Donnerstag der aktuellen Woche und zähle, die wievielte Woche des Jahres das ist.\n\nNach ISO 8601 beginnt jede Woche am Montag und endet am Sonntag. Die KW-Nummer richtet sich nach dem Donnerstag der jeweiligen Woche – welchem Jahr dieser Donnerstag angehört, in dem Jahr wird die Woche gezählt. Das bedeutet: Die ersten Januartage können noch zur letzten KW des Vorjahres gehören, und KW 1 kann bereits Ende Dezember beginnen. Unser kostenloser KW-Rechner wandelt jedes beliebige Datum sofort in die zugehörige KW um.",
  },
  // Cluster 1: Was ist eine KW
  {
    question: "Was ist eine Kalenderwoche?",
    answer:
      "Eine Kalenderwoche (KW) ist ein Zeitraum von sieben Tagen, der nach ISO 8601 (Abschnitt 3.2.2) stets am Montag beginnt und am Sonntag endet. In Deutschland, Österreich und der Schweiz ist dieser Standard nach DIN EN 28601 verbindlich und bildet die Grundlage für Geschäftstermine, Lieferzeitfenster und Projektpläne.\n\nDie Nummerierung beginnt mit KW 1 und endet je nach Jahr mit KW 52 oder KW 53. KW 1 ist immer die Woche, die den ersten Donnerstag des Jahres enthält. Liegt Ende Dezember noch kein neuer Donnerstag im kommenden Jahr, gehört diese Woche noch zur letzten KW des laufenden Jahres.\n\nIm Alltag begegnen uns Kalenderwochen in Projektplänen, Redaktionsterminen, Schichtplänen und bei Lieferankündigungen. Das US-amerikanische System startet die Woche am Sonntag und definiert KW 1 anders – daher weichen internationale Kalenderanwendungen gelegentlich vom deutschen Standard ab.",
  },
  {
    question: "Wann beginnt die Kalenderwoche 1?",
    answer:
      "Die KW 1 ist nach ISO 8601 (§ 2.2.10) immer die Woche, die den ersten Donnerstag des Jahres enthält. Daraus folgt: Der 4. Januar liegt stets in KW 1, egal auf welchen Wochentag er fällt. KW 1 kann daher bereits am letzten Montag des Dezembers des Vorjahres beginnen, und die ersten Januartage können noch zur letzten KW des Vorjahres gehören.\n\nDiese Regelung ist in Deutschland seit DIN EN 28601 verbindlich. Der Donnerstag wurde als Bezugstag gewählt, weil er genau in der Mitte einer Montag-bis-Sonntag-Woche liegt (Tag 4 von 7). Enthält eine Dezemberwoche noch keinen Donnerstag des neuen Jahres, zählt sie zum alten Jahr.\n\nPraktisches Beispiel: KW 1 des Jahres 2026 beginnt am Montag, dem 29. Dezember 2025, weil der erste Donnerstag 2026 auf den 1. Januar fällt.",
  },
  // Cluster 4: wie viele Wochen hat ein Jahr (konsolidiert aus 4 Near-Duplicates)
  {
    question: "Wie viele Wochen hat ein Jahr?",
    answer:
      "Nach ISO 8601 hat ein Kalenderjahr entweder 52 oder 53 Kalenderwochen. Die meisten Jahre haben 52 KW. In einem 400-Jahres-Zyklus gibt es genau 71 sogenannte lange Jahre mit 53 Wochen – das sind 17,75 % aller Jahre (Quelle: ISO 8601 Annex B).\n\nEin Jahr erhält eine 53. Kalenderwoche, wenn der 1. Januar auf einen Donnerstag fällt oder – bei einem Schaltjahr – auf einen Mittwoch. Der Grund: Ein normales Jahr hat 365 Tage, also 52 vollständige Wochen und einen Überhang von einem Tag. Bei einem Schaltjahr entstehen zwei Überhang-Tage. Fallen diese Tage auf einen Donnerstag, entsteht eine 53. KW.\n\nAktuelle Beispiele für Jahre mit 53 KW sind 2015, 2020, 2026 und 2032. Das Jahr 2026 hat 53 Kalenderwochen, da der 1. Januar 2026 auf einen Donnerstag fällt – KW 53 läuft vom 28. Dezember 2026 bis zum 3. Januar 2027.",
  },
  {
    question: "Hat ein Jahr immer 52 Kalenderwochen?",
    answer:
      "Nein, ein Jahr hat nicht immer 52 Kalenderwochen. Ein Jahr erhält genau dann 53 Kalenderwochen, wenn der 1. Januar auf einen Donnerstag fällt – oder in einem Schaltjahr auf einen Mittwoch (ISO 8601, § 2.2.10). Das Jahr 2026 ist ein solches langes Jahr mit 53 Kalenderwochen (KW 1 bis KW 53).\n\nDer Hintergrund liegt in der ISO-8601-Regel: Eine Woche wird dem Jahr zugeordnet, in dem ihr Donnerstag liegt. Ein reguläres Jahr umfasst 365 Tage, also 52 vollständige Wochen und einen Rest von einem Tag. Fällt dieser Resttag auf einen Donnerstag, entsteht eine zusätzliche 53. KW.\n\nIn einem 400-Jahres-Zyklus gibt es genau 71 lange Jahre – das sind 17,75 % aller Jahre (Quelle: ISO 8601 Annex B). Für Projektplaner bedeutet das: Ungefähr jedes fünfte bis sechste Jahr erscheint eine KW 53 im Jahreskalender. Die nächsten Jahre mit 53 KW nach 2026 sind 2032 und 2037.",
  },
  // Cluster 5: spezifische KW
  {
    question: "Wann beginnt KW 1 2026?",
    answer:
      "Kalenderwoche 1 des Jahres 2026 beginnt am Montag, dem 29. Dezember 2025, und endet am Sonntag, dem 4. Januar 2026. Der 1. Januar 2026 fällt auf einen Donnerstag und liegt damit in KW 1 – denn nach ISO 8601 bestimmt stets der Donnerstag, welchem Jahr eine Woche zugeordnet wird.\n\nDer 29. Dezember 2025 gehört damit offiziell zum Kalenderjahr 2026, obwohl er ein Datum im Dezember 2025 trägt. Für Projektpläne, Rechnungen oder Liefertermine, die auf KW 1 2026 referenzieren, beginnt die Woche also bereits im Jahr 2025.\n\nDa 2026 insgesamt 53 Kalenderwochen hat, läuft die letzte Woche – KW 53 2026 – vom 28. Dezember 2026 bis zum 3. Januar 2027. Eine vollständige Übersicht aller 53 Kalenderwochen 2026 mit exakten Daten findest du in unserer Jahresübersicht.",
  },
  {
    question: "Wie viele Kalenderwochen hat 2026?",
    answer:
      "Das Jahr 2026 hat 53 Kalenderwochen – von KW 1 bis KW 53. Der Grund: Der 1. Januar 2026 fällt auf einen Donnerstag. Nach ISO 8601 ist KW 1 immer die Woche, die den ersten Donnerstag des Jahres enthält. Fällt Neujahr selbst auf einen Donnerstag, beginnt KW 1 bereits am 29. Dezember des Vorjahres und das Jahr erhält eine zusätzliche 53. Woche.\n\nKW 1 2026 läuft vom 29. Dezember 2025 bis zum 4. Januar 2026. KW 53 2026 läuft vom 28. Dezember 2026 bis zum 3. Januar 2027. Das bedeutet: Die letzten Tage des Jahres 2026 fallen bereits in KW 1 des Jahres 2027.\n\nFür Jahresplanung, Schichtpläne oder Projektmanagement ist es wichtig zu wissen, dass 2026 mit 53 KW ein selteneres langes Jahr ist – vergleichbar mit 2015 und 2020. Die nächsten langen Jahre folgen 2032 und 2037.",
  },
  // Wissen & Erklärung
  {
    question: "Was bedeutet ISO 8601?",
    answer:
      "ISO 8601 ist ein internationaler Standard der Organisation ISO (International Organization for Standardization, Genf), erstmals veröffentlicht 1988 und zuletzt aktualisiert 2019 (ISO 8601-1:2019). Er legt fest, dass Wochen am Montag beginnen (§ 2.2.8) und KW 1 die Woche mit dem ersten Donnerstag des Jahres ist (§ 2.2.10). In Deutschland ist dieser Standard nach DIN EN 28601 verbindlich.\n\nDas abweichende US-amerikanische System startet die Woche am Sonntag und definiert KW 1 als die Woche mit dem 1. Januar – unabhängig vom Wochentag. Das führt dazu, dass ein und dasselbe Datum in Europa und den USA unterschiedlichen KW-Nummern zugeordnet sein kann.\n\nDie wichtigsten ISO-8601-Regeln: Wochenbeginn ist Montag, Wochenende ist Sonntag, die KW-Nummer richtet sich nach dem Donnerstag der Woche. In Microsoft Outlook, Google Kalender und Apple Kalender lässt sich die KW-Anzeige auf den ISO-Standard umstellen, indem du die Region auf Deutschland oder Europa setzt.",
  },
  {
    question: "Wie wird die aktuelle KW berechnet?",
    answer:
      "Die Kalenderwoche wird nach ISO 8601 (Abschnitt 3.2.2) berechnet: Man bestimmt den Donnerstag der betreffenden Woche und zählt, die wievielte Woche des Jahres dieser Donnerstag angehört. Jede Woche beginnt am Montag (§ 2.2.8). Unser KW-Rechner auf der Startseite wandelt jedes beliebige Datum sofort in die zugehörige KW um.\n\nDie Berechnungslogik in drei Schritten: Erstens finde den Montag der gesuchten Woche. Zweitens finde den Donnerstag derselben Woche (Montag plus drei Tage). Drittens zähle, der wievielte Donnerstag des Jahres das ist – diese Zahl ist die KW-Nummer.\n\nAls einfache Faustregel: Suche im Kalender den Donnerstag der aktuellen Woche und zähle die Wochen seit Jahresbeginn. In Excel und Google Tabellen steht die Funktion ISOKALENDERWOCHE() bereit, die diese Berechnung automatisch nach ISO 8601 durchführt. Smartphone-Kalender und Apps nutzen dieselbe Logik, sofern die Region auf Deutschland eingestellt ist.",
  },
];

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://aktuellekw.de/faq#faqpage",
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        datePublished: "2026-01-01",
        dateModified: "2026-02-01",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".text-text-secondary.mb-8"],
        },
        citation: [
          {
            "@type": "CreativeWork",
            name: "ISO 8601:2004 – Date and time format",
            url: "https://www.iso.org/iso-8601-date-and-time-format.html",
          },
          {
            "@type": "CreativeWork",
            name: "ISO 8601 – Wikipedia",
            url: "https://de.wikipedia.org/wiki/ISO_8601",
          },
          {
            "@type": "CreativeWork",
            name: "Woche – Wikipedia",
            url: "https://de.wikipedia.org/wiki/Woche",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://aktuellekw.de/faq#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Startseite",
            item: "https://aktuellekw.de",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQ",
            item: "https://aktuellekw.de/faq",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />
      <section className="max-w-2xl mx-auto px-4 py-12 md:py-16">

        {/* ── Sichtbare Breadcrumb-Navigation ──────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">›</span>
          <span className="text-text-primary">FAQ</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Häufige Fragen zur Kalenderwoche
        </h1>

        <p className="text-text-secondary mb-8 leading-relaxed">
          Welche Kalenderwoche haben wir heute? Wie wird die Kalenderwoche
          berechnet? Und wie viele Wochen hat ein Jahr eigentlich? Auf dieser
          Seite beantworten wir die häufigsten Fragen rund um die
          Kalenderwoche (KW) nach dem internationalen Standard ISO&nbsp;8601.
          Hier erfährst du, wann KW&nbsp;1 beginnt, warum manche Jahre
          53&nbsp;Kalenderwochen haben und wie du jedes beliebige Datum einer
          KW zuordnest. Die{" "}
          <a href="/" className="text-accent hover:underline">
            aktuelle KW
          </a>{" "}
          findest du jederzeit auf unserer Startseite.
        </p>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <details
              key={i}
              open={i < 3 ? true : undefined}
              className="group border border-border rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium hover:bg-surface-secondary transition-colors list-none">
                <span>{faq.question}</span>
                <span className="text-text-secondary text-xl leading-none ml-4 shrink-0 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="details-content px-5 pb-5 pt-2 text-text-secondary text-sm leading-relaxed border-t border-border">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* ── Author Byline ─────────────────────────── */}
        <AuthorByline date="2026-02-01" />

        {/* ── Quellen & Weiterführendes ─────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border">
          <h2 id="quellen" className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Quellen &amp; Weiterführendes
          </h2>
          <ul className="text-sm text-text-secondary space-y-1.5">
            <li>
              <a
                href="https://www.iso.org/iso-8601-date-and-time-format.html"
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="text-accent hover:underline"
              >
                ISO 8601 – Internationaler Standard für Datum und Uhrzeit
              </a>{" "}
              (iso.org)
            </li>
            <li>
              <a
                href="https://de.wikipedia.org/wiki/ISO_8601"
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="text-accent hover:underline"
              >
                ISO 8601 – Erklärung und Hintergrund
              </a>{" "}
              (Wikipedia)
            </li>
            <li>
              <a
                href="https://de.wikipedia.org/wiki/Woche"
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="text-accent hover:underline"
              >
                Woche – Definition und Kalenderwochen-System
              </a>{" "}
              (Wikipedia)
            </li>
          </ul>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-text-secondary text-sm flex flex-wrap gap-x-6 gap-y-2">
            <a href="/" className="text-accent hover:underline">
              ← Aktuelle KW
            </a>
            <a href="/kalenderwoche" className="text-accent hover:underline">
              Alle Kalenderwochen im Überblick
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/faq/page.tsx (Cluster 3 + 4)
 * ──────────────────────────────────────────────────────────────
 * [x] Title: „FAQ – Häufige Fragen zur Kalenderwoche (KW)" (Cluster 3)
 * [x] Meta Description: Keywords Cluster 3+4, ~140 Zeichen
 * [x] Canonical URL: https://aktuellekw.de/faq
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: „Häufige Fragen zur Kalenderwoche" (Cluster 3 Hauptkeyword)
 * [x] Schema.org: FAQPage mit 9 Fragen (Cluster 1, 3, 4, 5 abgedeckt)
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → FAQ)
 * [x] Cluster 3 Keywords: „Welche Kalenderwoche haben wir heute?" (konsolidiert aus 3 Varianten)
 * [x] Cluster 4 Keywords: „Wie viele Wochen hat ein Jahr?" + „Hat ein Jahr immer 52 KW?"
 *     (konsolidiert aus 4 Near-Duplicates – eindeutige Fragen, keine Duplicate-Content-Gefahr)
 * [x] Cluster 5: wann beginnt KW 1 2026, wie viele Kalenderwochen hat 2026
 * [x] Einleitungstext mit Keywords (kurz, informativ)
 * [x] Einleitungstext (60–80 Wörter) ✅ befüllt
 * [x] Interne Links zurück zur Startseite und Jahresübersicht
 * [x] Speakable Schema für KI-Sprachsuche
 * [ ] TODO: „Wann ist KW X 2026?" Fragen dynamisch pro aktuelle KW generieren
 */
