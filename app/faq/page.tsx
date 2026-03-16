import type { Metadata } from "next";
import LastUpdated from "@/components/LastUpdated";

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
      "Die aktuelle Kalenderwoche wird auf unserer Startseite live angezeigt – mit KW-Nummer, Jahr sowie exaktem Start- und Enddatum (Montag bis Sonntag nach ISO 8601). Die Seite aktualisiert sich stündlich. Als schnelle Faustregel: Such den nächsten Donnerstag und zähl, die wievielte Woche des Jahres das ist.",
  },
  // Cluster 1: Was ist eine KW
  {
    question: "Was ist eine Kalenderwoche?",
    answer:
      "Eine Kalenderwoche (KW) ist ein Zeitraum von sieben Tagen, der nach ISO 8601 am Montag beginnt und am Sonntag endet. In Deutschland, Österreich und der Schweiz ist der ISO-8601-Standard verbindlich. Die Nummerierung beginnt mit KW 1 und endet mit KW 52 oder 53.",
  },
  {
    question: "Wann beginnt die Kalenderwoche 1?",
    answer:
      "Die KW 1 ist die Woche, die den ersten Donnerstag des Jahres enthält – der 4. Januar liegt daher immer in KW 1. Dadurch kann KW 1 bereits Ende Dezember des Vorjahres beginnen, und die ersten Tage im Januar können noch zur letzten KW des Vorjahres gehören.",
  },
  // Cluster 4: wie viele Wochen hat ein Jahr (konsolidiert aus 4 Near-Duplicates)
  {
    question: "Wie viele Wochen hat ein Jahr?",
    answer:
      "Nach ISO 8601 hat ein Kalenderjahr entweder 52 oder 53 Kalenderwochen. Die meisten Jahre haben 52 KW. In einem 400-Jahres-Zyklus gibt es genau 71 sogenannte lange Jahre mit 53 Wochen – das entspricht etwa jedem 5. bis 6. Jahr.",
  },
  {
    question: "Hat ein Jahr immer 52 Kalenderwochen?",
    answer:
      "Nein. Ein Jahr hat 53 Kalenderwochen, wenn der 1. Januar auf einen Donnerstag fällt – oder in Schaltjahren auf einen Mittwoch. Das Jahr 2026 ist ein solches langes Jahr mit 53 Kalenderwochen (KW 1 bis KW 53).",
  },
  // Cluster 5: spezifische KW
  {
    question: "Wann beginnt KW 1 2026?",
    answer:
      "Kalenderwoche 1 des Jahres 2026 beginnt am Montag, dem 29. Dezember 2025, und endet am Sonntag, dem 4. Januar 2026. Der 1. Januar 2026 fällt auf einen Donnerstag und liegt damit in KW 1.",
  },
  {
    question: "Wie viele Kalenderwochen hat 2026?",
    answer:
      "Das Jahr 2026 hat 53 Kalenderwochen (KW 1 bis KW 53). Da der 1. Januar 2026 auf einen Donnerstag fällt, ist 2026 ein langes Jahr nach ISO 8601.",
  },
  // Wissen & Erklärung
  {
    question: "Was bedeutet ISO 8601?",
    answer:
      "ISO 8601 ist ein internationaler Standard zur Darstellung von Datum und Uhrzeit. Er legt fest, dass Wochen am Montag beginnen und KW 1 den ersten Donnerstag des Jahres enthält. In Deutschland ist dieser Standard nach DIN 1355 verbindlich – er weicht vom US-amerikanischen System ab, das Wochen am Sonntag beginnt.",
  },
  {
    question: "Wie wird die aktuelle KW berechnet?",
    answer:
      "Die KW wird nach ISO 8601 berechnet: Man bestimmt den Donnerstag der betreffenden Woche und zählt, die wievielte Woche des Jahres das ist. Jede Woche beginnt am Montag. Unser KW-Rechner auf der Startseite wandelt jedes beliebige Datum sofort in die zugehörige Kalenderwoche um.",
  },
];

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://aktuellekw.de/faq#faqpage",
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

        <LastUpdated date="2026-02-01" />
        <div className="mt-10 pt-8 border-t border-border">
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
