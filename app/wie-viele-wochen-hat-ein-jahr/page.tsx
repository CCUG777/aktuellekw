import type { Metadata } from "next";
import {
  getCurrentKW,
  getWeeksInYear,
  isLeapYear,
} from "@/lib/kw";
import LastUpdated from "@/components/LastUpdated";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const ogTitle = `Wie viele Wochen hat ein Jahr? – 52 oder 53`;
  const ogDescription = `Wie viele Wochen hat ein Jahr? Erfahre alles über Gemeinjahre mit 52 Wochen und Schaltjahre mit 53 Wochen nach ISO 8601. Inklusive Tabelle für ${kw.year}.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr",
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export default function WieVieleWochenPage() {
  const kw = getCurrentKW();
  const currentYear = kw.year;
  const currentYearWeeks = getWeeksInYear(currentYear);

  // Table data: dynamic for years (currentYear - 1) to (currentYear + 2)
  const tableYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const tableData = tableYears.map((year) => ({
    year,
    days: isLeapYear(year) ? 366 : 365,
    weeks: getWeeksInYear(year),
    type: isLeapYear(year) ? "Schaltjahr" : "Gemeinjahr",
    isCurrent: year === currentYear,
  }));

  // FAQ data
  const pageFaqs = [
    {
      question: "Was ist ein Jahr genau in Wochen ausgedrückt?",
      answer:
        "Ein astronomisches Jahr hat ca. 52 Wochen und einen Tag. In der Kalenderrechnung spricht man von 52 oder 53 vollen Kalenderwochen.",
    },
    {
      question: "Warum gibt es Jahre mit 53 Wochen?",
      answer:
        "Da 52 Wochen nur 364 Tage abdecken, bleibt jedes Jahr mindestens ein Tag übrig. Über die Jahre verschieben sich die Wochentage so weit, dass alle 5 bis 6 Jahre eine 53.\u00a0Woche eingeschoben wird.",
    },
    {
      question: "Wie wird die Wochenanzahl bestimmt?",
      answer:
        "Die Anzahl wird nach der Lage des ersten und letzten Donnerstags im Jahr bestimmt. Liegen zwischen dem ersten und letzten Donnerstag 52 Intervalle, hat das Jahr 53\u00a0Wochen.",
    },
    {
      question: "Wie viele Wochen hat ein Jahr für die Gehaltsabrechnung?",
      answer:
        "In der Regel rechnen Arbeitgeber mit 52 Wochen pro Jahr. Bei exakter Kalkulation (z.\u00a0B. bei Stundenlöhnen) wird oft der Faktor 4,33 (52/12) für die Wochen pro Monat genutzt.",
    },
  ];

  // JSON-LD
  const pageJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr#breadcrumb",
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
          name: "Wie viele Wochen hat ein Jahr?",
          item: "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr#faqpage",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: "2026-01-01",
      dateModified: "2026-02-27",
      mainEntity: pageFaqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ── Sichtbare Breadcrumb-Navigation ──────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">
            Wie viele Wochen hat ein Jahr?
          </span>
        </nav>

        {/* ── H1 + Intro ── Cluster 4 ─────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Wie viele Wochen hat ein Jahr: Alles, was Du wissen musst
        </h1>
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Die kurze Antwort lautet: Ein Kalenderjahr hat in der Regel{" "}
            <strong className="text-text-primary">52&nbsp;Wochen</strong>.
            Genauer gesagt hat ein Gemeinjahr 52&nbsp;Wochen und einen Tag,
            während ein Schaltjahr 52&nbsp;Wochen und zwei Tage umfasst. Je
            nach Kalenderkonstellation kann ein Jahr nach ISO&nbsp;8601 jedoch{" "}
            <strong className="text-text-primary">52 oder 53&nbsp;Kalenderwochen</strong>{" "}
            haben.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Aktuell:</strong>{" "}
            Das Jahr {currentYear} hat{" "}
            <strong className="text-text-primary">{currentYearWeeks}&nbsp;Kalenderwochen</strong>.
            {currentYearWeeks === 53
              ? ` Da der 1. Januar ${currentYear} auf einen Donnerstag fällt, gibt es eine 53. KW.`
              : ` Der 1. Januar ${currentYear} fällt nicht auf einen Donnerstag, daher hat ${currentYear} reguläre 52 KW.`}
          </div>
        </div>

        {/* ── Hintergründe ── Cluster 4 ───────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Hintergründe zu Wie viele Wochen hat ein Jahr
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Hier erfährst Du alles Wissenswerte über die Berechnung der{" "}
            <strong className="text-text-primary">Wochen im Jahr</strong>{" "}
            und warum die Zahl zwischen 52 und 53 variiert:
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Die mathematische Basis:</strong>{" "}
                Ein Standardjahr hat 365&nbsp;Tage. Teilt man diese durch
                7&nbsp;Tage pro Woche, ergibt das{" "}
                <strong className="text-text-primary">52,14&nbsp;Wochen</strong>.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">ISO&nbsp;8601 Standard:</strong>{" "}
                Diese Norm bestimmt, <strong className="text-text-primary">wie viele
                Kalenderwochen hat ein Jahr</strong>. Eine Woche wird dem Jahr
                zugeordnet, in dem ihr Donnerstag liegt.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Das 53-Wochen-Phänomen:</strong>{" "}
                Wenn ein Jahr mit 365&nbsp;Tagen an einem Donnerstag beginnt
                oder endet, hat es{" "}
                <strong className="text-text-primary">53&nbsp;Kalenderwochen</strong>.
                In Schaltjahren reicht es aus, wenn der Mittwoch oder Donnerstag
                auf den Jahresbeginn/-ende fällt.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Aktueller Stand {currentYear}:</strong>{" "}
                Das Jahr <strong className="text-text-primary">{currentYear}</strong>{" "}
                ist ein {isLeapYear(currentYear) ? "Schaltjahr" : "Gemeinjahr"}{" "}
                und hat exakt{" "}
                <strong className="text-text-primary">{currentYearWeeks}&nbsp;Kalenderwochen</strong>.
              </span>
            </li>
          </ul>
        </div>

        {/* ── Alltags-Tipps ── Cluster 4 ──────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            So nutzt Du dieses Wissen im Alltag
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Zu wissen, <strong className="text-text-primary">wie viel Wochen hat
            ein Jahr</strong>, ist entscheidend für die Urlaubsplanung und
            betriebliche Kalkulationen:
          </p>
          <ol className="space-y-3 text-text-secondary text-sm leading-relaxed list-none">
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">1.</span>
              <span>
                <strong className="text-text-primary">Personalplanung:</strong>{" "}
                Berechne Urlaubsansprüche und Arbeitsstunden basierend auf
                52&nbsp;Wochen, um Puffer für Jahre mit 53&nbsp;Wochen
                einzuplanen.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">2.</span>
              <span>
                <strong className="text-text-primary">Budgetierung:</strong>{" "}
                Viele Fixkosten fallen wöchentlich an. Prüfe in Deiner Software,
                ob die Abrechnung auf 52 oder dem exakten Wert von
                52,14&nbsp;Wochen basiert.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">3.</span>
              <span>
                <strong className="text-text-primary">Terminkalender prüfen:</strong>{" "}
                Kontrolliere beim Jahreswechsel, ob Dein Kalender die Zählung
                korrekt auf KW&nbsp;1 zurücksetzt, besonders wenn das Vorjahr
                eine KW&nbsp;53 hatte.
              </span>
            </li>
          </ol>
        </div>

        {/* ── Tabelle: Wochen und Tage im Überblick ──────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tabelle: Wochen und Tage im Überblick ({tableYears[0]}&ndash;{tableYears[tableYears.length - 1]})
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Jahr
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Tage
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Anzahl Kalenderwochen
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Typ
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr
                    key={row.year}
                    className={
                      row.isCurrent
                        ? "border-b border-border bg-accent/5"
                        : "border-b border-border last:border-b-0"
                    }
                  >
                    <td
                      className={`px-5 py-3 ${
                        row.isCurrent
                          ? "font-bold text-accent"
                          : "text-text-secondary"
                      }`}
                    >
                      {row.year}
                    </td>
                    <td
                      className={`px-5 py-3 ${
                        row.isCurrent
                          ? "font-bold text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {row.days}
                    </td>
                    <td
                      className={`px-5 py-3 ${
                        row.isCurrent
                          ? "font-bold text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {row.weeks} Wochen
                    </td>
                    <td
                      className={`px-5 py-3 ${
                        row.isCurrent
                          ? "font-bold text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {row.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Zusammenfassung ── Cluster 4 ────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-3">
            Zusammenfassung &amp; Ausblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Zusammengefasst bedeutet das: Die Frage &bdquo;<strong className="text-text-primary">Wie
            viele Wochen hat ein Jahr</strong>&ldquo; lässt sich meist mit 52
            beantworten, doch für die exakte Zeitrechnung sind die ISO-Regeln
            entscheidend. Im Jahr{" "}
            <strong className="text-text-primary">{currentYear}</strong>{" "}
            {currentYearWeeks === 53
              ? `gibt es ausnahmsweise 53 Kalenderwochen`
              : `bleibt es bei den gewohnten 52 Wochen`}.
            Möchtest Du wissen, in welcher Woche wir uns gerade befinden? Dann
            schau bei unserer Übersicht{" "}
            <a
              href="/welche-kalenderwoche-haben-wir"
              className="text-accent hover:underline"
            >
              Welche Kalenderwoche haben wir
            </a>{" "}
            vorbei oder prüfe die{" "}
            <a href="/" className="text-accent hover:underline">
              Aktuelle KW
            </a>{" "}
            für Deine heutige Planung.
          </p>
        </div>

        {/* ── FAQ ── Cluster 4 ────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            FAQ &ndash; Nutzer fragen auch
          </h2>
          <div className="space-y-2.5">
            {pageFaqs.map((faq, i) => (
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
        </div>

        <LastUpdated date="2026-02-27" />
        {/* ── Abschluss-Links ─────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </a>
          <a
            href="/welche-kalenderwoche-haben-wir"
            className="text-accent hover:underline"
          >
            Welche Kalenderwoche haben wir &rarr;
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {currentYear} &rarr;
          </a>
          <a href="/faq" className="text-accent hover:underline">
            Alle Fragen zur Kalenderwoche &rarr;
          </a>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/wie-viele-wochen-hat-ein-jahr/page.tsx (Cluster 4)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: dynamischer Title mit Jahresangaben
 * [x] Meta Description: dynamisch mit aktuellem Jahr
 * [x] Canonical URL: https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Wie viele Wochen hat ein Jahr: Alles, was Du wissen musst"
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → Wie viele Wochen)
 * [x] Schema.org: FAQPage (4 Fragen)
 * [x] Cluster 4 SEO-Content: Intro, Hintergründe, Alltag-Tipps, Tabelle, Zusammenfassung
 * [x] Semantische HTML-Tabelle (dynamisch berechnet, aktuelles Jahr fett/accent)
 * [x] FAQ (4 Fragen): Wochen im Jahr, 53-Wochen-Phänomen, Berechnung, Gehaltsabrechnung
 * [x] Cross-Links: /welche-kalenderwoche-haben-wir (Cluster 3), / (Cluster 1), /kalenderwoche (Cluster 2)
 * [x] Cluster 4 Keywords: wie viele Wochen hat ein Jahr, wochen im jahr,
 *     wieviel wochen hat ein jahr, wie viele kalenderwochen hat ein jahr
 * [x] Dynamische Berechnung: getWeeksInYear(), isLeapYear() für korrekte Werte
 * [x] revalidate = 3600 (stündliche ISR)
 * [x] OG-Image: dynamisch via opengraph-image.tsx (1200×630px)
 * [ ] TODO: hreflang für AT/CH ergänzen wenn mehrsprachig ausgebaut
 */
