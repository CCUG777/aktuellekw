import type { Metadata } from "next";

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
    // OG-Image: 1200×630 px – Platzhalter, bitte durch echtes Bild ersetzen
    images: [
      {
        url: "/og/og-faq.png",
        width: 1200,
        height: 630,
        alt: "FAQ zur Kalenderwoche – aktuellekw.de",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ – Häufige Fragen zur Kalenderwoche (KW)",
    description:
      "Welche KW haben wir? Wie viele Wochen hat ein Jahr? Alle Antworten rund um die Kalenderwoche nach ISO 8601.",
    // Twitter Card Image: 1200×630 px – Platzhalter, bitte durch echtes Bild ersetzen
    images: [{ url: "/og/og-faq.png", alt: "FAQ zur Kalenderwoche – aktuellekw.de" }],
  },
};

const faqs = [
  // Cluster 3: welche KW haben wir, welche Kalenderwoche
  {
    question: "Welche Kalenderwoche haben wir aktuell?",
    answer:
      "Die aktuelle Kalenderwoche wird auf unserer Startseite live angezeigt – mit genauer KW-Nummer, Jahr sowie Start- und Enddatum (Montag bis Sonntag nach ISO 8601). Die Seite aktualisiert sich stündlich automatisch.",
  },
  {
    question: "Welche KW ist heute?",
    answer:
      "Die heutige Kalenderwoche finden Sie direkt auf aktuellekw.de. Die Anzeige zeigt KW-Nummer, Jahr sowie exakte Datumsgrenzen der laufenden Woche nach ISO 8601.",
  },
  {
    question: "Welche KW haben wir heute?",
    answer:
      "Die aktuelle KW können Sie jederzeit auf unserer Startseite ablesen. Alternativ gilt die Faustregel: Suchen Sie den nächsten Donnerstag und zählen Sie, die wievielte Woche des Jahres das ist.",
  },
  // Cluster 1: Was ist eine KW
  {
    question: "Was ist eine Kalenderwoche?",
    answer:
      "Eine Kalenderwoche (KW) ist ein Zeitraum von sieben Tagen, der nach ISO 8601 am Montag beginnt und am Sonntag endet. In Deutschland, Österreich und der Schweiz ist der ISO-8601-Standard verbindlich.",
  },
  {
    question: "Wann beginnt die Kalenderwoche 1?",
    answer:
      "Die KW 1 ist die Woche, die den ersten Donnerstag des Jahres enthält. Das bedeutet: Der 4. Januar liegt immer in KW 1. Dadurch kann KW 1 bereits Ende Dezember des Vorjahres beginnen.",
  },
  // Cluster 4: wie viele Wochen hat ein Jahr
  {
    question: "Wie viele Wochen hat ein Jahr?",
    answer:
      "Die meisten Jahre haben 52 Kalenderwochen. Manche Jahre haben jedoch 53 Kalenderwochen – das tritt auf, wenn der 1. Januar auf einen Donnerstag fällt oder in Schaltjahren auf einen Mittwoch.",
  },
  {
    question: "Wie viel Wochen hat ein Jahr?",
    answer:
      "Ein Jahr hat entweder 52 oder 53 Kalenderwochen nach ISO 8601. Die meisten Jahre bestehen aus 52 KW. In seltenen Jahren (ca. alle 5–6 Jahre) gibt es eine 53. Kalenderwoche.",
  },
  {
    question: "Wie viele Kalenderwochen hat ein Jahr genau?",
    answer:
      "Nach ISO 8601 hat ein Jahr exakt 52 oder 53 Kalenderwochen. Ein Jahr mit 53 Wochen bezeichnet man auch als langes Jahr. In einem 400-Jahres-Zyklus gibt es genau 71 lange Jahre.",
  },
  {
    question: "Hat ein Jahr immer 52 Kalenderwochen?",
    answer:
      "Nein. Die meisten Jahre haben 52 Kalenderwochen, aber manche Jahre haben 53 KWs. Das passiert, wenn der 1. Januar auf einen Donnerstag fällt – oder auf einen Mittwoch in Schaltjahren.",
  },
  // Cluster 5: spezifische KW
  {
    question: "Wann beginnt KW 1 2026?",
    answer:
      "Kalenderwoche 1 des Jahres 2026 beginnt am Montag, dem 29. Dezember 2025, und endet am Sonntag, dem 4. Januar 2026. Der 1. Januar 2026 (Donnerstag) liegt damit in KW 1.",
  },
  {
    question: "Wie viele Kalenderwochen hat 2026?",
    answer:
      "Das Jahr 2026 hat 53 Kalenderwochen (KW 1 bis KW 53). Da der 1. Januar 2026 auf einen Donnerstag fällt, gilt ISO-8601-Regel für lange Jahre.",
  },
  // Wissen & Erklärung
  {
    question: "Was bedeutet ISO 8601?",
    answer:
      "ISO 8601 ist ein internationaler Standard zur Darstellung von Datum und Uhrzeit. Er legt fest, dass Wochen am Montag beginnen und KW 1 den ersten Donnerstag des Jahres enthält. In Deutschland gilt dieser Standard verbindlich.",
  },
  {
    question: "Wie wird die aktuelle Kalenderwoche berechnet?",
    answer:
      "Die KW wird nach ISO 8601 berechnet: Man sucht den nächsten Donnerstag zum aktuellen Datum und bestimmt, die wievielte Woche des Jahres dieser Donnerstag angehört. Jede Woche beginnt am Montag.",
  },
];

function FaqJsonLd() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
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
  ];

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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Häufige Fragen zur Kalenderwoche
        </h1>

        <p className="text-text-secondary mb-8 leading-relaxed">
          Welche Kalenderwoche haben wir heute? Wie wird die Kalenderwoche
          berechnet? Und wie viele Wochen hat ein Jahr eigentlich? Auf dieser
          Seite beantworten wir die häufigsten Fragen rund um die
          Kalenderwoche (KW) nach dem internationalen Standard ISO&nbsp;8601.
          Erfahren Sie, wann KW&nbsp;1 beginnt, warum manche Jahre
          53&nbsp;Kalenderwochen haben und wie Sie jedes beliebige Datum einer
          KW zuordnen. Die{" "}
          <a href="/" className="text-accent hover:underline">
            aktuelle Kalenderwoche
          </a>{" "}
          finden Sie jederzeit auf unserer Startseite.
        </p>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <details
              key={i}
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

        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-text-secondary text-sm flex flex-wrap gap-x-6 gap-y-2">
            <a href="/" className="text-accent hover:underline">
              ← Aktuelle Kalenderwoche
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
 * [x] Schema.org: FAQPage mit 13 Fragen (Cluster 1, 3, 4, 5 abgedeckt)
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → FAQ)
 * [x] Cluster 3 Keywords: welche KW haben wir, welche Kalenderwoche haben wir aktuell,
 *     welche KW ist heute, welche KW haben wir heute (3 Varianten)
 * [x] Cluster 4 Keywords: wie viele Wochen hat ein Jahr (3 Varianten),
 *     wie viel Wochen hat ein Jahr, wie viele Kalenderwochen hat ein Jahr
 * [x] Cluster 5: wann beginnt KW 1 2026, wie viele Kalenderwochen hat 2026
 * [x] Einleitungstext mit Keywords (kurz, informativ)
 * [x] PLACEHOLDER: ausführlicher Einleitungstext (60–80 Wörter)
 * [x] Interne Links zurück zur Startseite und Jahresübersicht
 * [ ] TODO: „Wann ist KW X 2026?" Fragen dynamisch pro aktuelle KW generieren
 * [ ] TODO: Speakable Schema für KI-Sprachsuche ergänzen
 * [ ] TODO: Verlinkung zur Kalenderwochen-Übersicht über Frage #11 einbauen
 */
