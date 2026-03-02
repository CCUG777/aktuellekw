import type { Metadata } from "next";
import {
  getCurrentKW,
  formatDateDE,
  getWeeksInYear,
  getDayNameDE,
  getKWInfo,
} from "@/lib/kw";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const ogTitle = "Welche Kalenderwoche haben wir? – KW heute schnell finden";
  const ogDescription = `Du möchtest wissen: Welche Kalenderwoche haben wir heute? Hier findest Du die Antwort sofort – aktuell KW ${kw.weekNumber} ${kw.year}, inklusive Datum, ISO-Standard und praktischen Excel-Tipps.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: "https://aktuellekw.de/welche-kalenderwoche-haben-wir",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/welche-kalenderwoche-haben-wir",
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

export default function WelcheKalenderwochePage() {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);

  // Dynamic date display: "Montag, 02. März 2026"
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const monthNamesDE = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  const currentDateDisplay = `${getDayNameDE(todayUTC)}, ${String(todayUTC.getUTCDate()).padStart(2, "0")}. ${monthNamesDE[todayUTC.getUTCMonth()]} ${todayUTC.getUTCFullYear()}`;

  // Next KW dates
  const nextKWDate = new Date(kw.startDate);
  nextKWDate.setUTCDate(nextKWDate.getUTCDate() + 7);
  const nextKWInfo = getKWInfo(nextKWDate);

  // Year type
  const yearType = weeksInYear === 53 ? "Langjahr (53 KW)" : "Gemeinjahr";

  // FAQ data
  const pageFaqs = [
    {
      question: "Was ist die Kalenderwoche genau?",
      answer:
        "Die Kalenderwoche ist ein Zeitraum von sieben Tagen, der zur eindeutigen Zeitrechnung innerhalb eines Kalenderjahres dient, beginnend mit Montag.",
    },
    {
      question: "Warum ist heute nicht KW\u00a01?",
      answer:
        "Die KW\u00a01 beginnt immer erst mit der Woche, die den ersten Donnerstag im Januar enthält. Je nach aktuellem Datum befinden wir uns in der fortlaufenden Zählung bis Woche 52 oder 53.",
    },
    {
      question: "Wie wird die Kalenderwoche heute berechnet?",
      answer:
        "Die Berechnung erfolgt nach der DIN\u00a01355-1 bzw. ISO\u00a08601. Man zählt die Donnerstage des Jahres, um die Wochennummer zu bestimmen.",
    },
    {
      question: "Welche KW haben wir jetzt in den USA?",
      answer:
        "Achtung: In den USA beginnt die Woche oft am Sonntag, und die KW\u00a01 ist immer die Woche, in der der 1.\u00a0Januar liegt. Das weicht von unserer ISO-Norm ab.",
    },
    {
      question: "Welche KW haben wir heute in Excel?",
      answer:
        "In Excel liefert die Standardformel oft falsche Werte für Europa. Nutze zwingend den Rückgabetyp\u00a021: =KALENDERWOCHE(HEUTE();21).",
    },
  ];

  // JSON-LD structured data
  const pageJsonLd = [
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
          name: "Welche Kalenderwoche haben wir",
          item: "https://aktuellekw.de/welche-kalenderwoche-haben-wir",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
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
            Welche Kalenderwoche haben wir
          </span>
        </nav>

        {/* ── H1 + Intro ── Cluster 3 ─────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welche Kalenderwoche haben wir: Alles, was Du wissen musst
        </h1>
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Die kurze Antwort lautet: <strong className="text-text-primary">Welche Kalenderwoche haben wir heute?</strong>{" "}
            Wir befinden uns aktuell in der{" "}
            <strong className="text-text-primary">Kalenderwoche&nbsp;{kw.weekNumber}</strong>.
            Heute ist {currentDateDisplay}, und diese Woche läuft vom{" "}
            {formatDateDE(kw.startDate)} bis zum {formatDateDE(kw.endDate)}.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Schnell-Info:</strong>{" "}
            Du brauchst nur die KW-Nummer? Schau direkt auf unserer{" "}
            <a href="/" className="text-accent hover:underline font-medium">
              Aktuelle KW &ndash; Startseite
            </a>.
          </div>
        </div>

        {/* ── Hintergründe ── Cluster 3 ───────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Hintergründe zu &bdquo;Welche Kalenderwoche haben wir&ldquo;
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Hier erfährst Du alles Wissenswerte über die Zeitrechnung und warum
            die Frage &bdquo;<strong className="text-text-primary">Welche Kalenderwoche</strong>{" "}
            haben wir jetzt?&ldquo; in Europa immer nach dem gleichen Schema
            beantwortet wird:
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">ISO&nbsp;8601 Standard:</strong>{" "}
                In Deutschland ist die Zählweise durch die ISO&nbsp;8601 genormt.
                Eine Woche beginnt immer am{" "}
                <strong className="text-text-primary">Montag</strong>.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Der Donnerstag-Faktor:</strong>{" "}
                Die erste Kalenderwoche eines Jahres ist diejenige, die den{" "}
                <strong className="text-text-primary">ersten Donnerstag</strong>{" "}
                im Januar enthält.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Jahreswechsel:</strong>{" "}
                Die Frage &bdquo;<strong className="text-text-primary">Welche KW haben wir heute</strong>&ldquo;{" "}
                kann Ende Dezember dazu führen, dass wir uns bereits in der
                KW&nbsp;1 des Folgejahres befinden, falls der Donnerstag bereits
                im neuen Jahr liegt.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Zeitrechnung:</strong>{" "}
                Das System der Kalenderwochen hilft in der Wirtschaft, Termine
                unabhängig von monatlichen Verschiebungen präzise zu koordinieren.
              </span>
            </li>
          </ul>
        </div>

        {/* ── Alltags-Tipps ── Cluster 3 ──────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            So nutzt Du die Kalenderwoche im Alltag
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die Antwort auf die Frage &bdquo;<strong className="text-text-primary">Welche KW ist heute</strong>&ldquo;{" "}
            ist besonders für die digitale Organisation wichtig. So wendest Du
            das Wissen an:
          </p>
          <ol className="space-y-3 text-text-secondary text-sm leading-relaxed list-none">
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">1.</span>
              <span>
                <strong className="text-text-primary">Smartphone &amp; Outlook:</strong>{" "}
                Aktiviere in den Einstellungen Deines Kalenders die Option
                &bdquo;Wochennummern anzeigen&ldquo;, um sofort zu sehen,{" "}
                <strong className="text-text-primary">welche KW wir haben</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">2.</span>
              <span>
                <strong className="text-text-primary">Excel-Abfrage:</strong>{" "}
                Nutze die Formel{" "}
                <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                  =KALENDERWOCHE(HEUTE();21)
                </code>, um in Deinen Tabellen immer die korrekte, aktuelle Woche
                auszugeben.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">3.</span>
              <span>
                <strong className="text-text-primary">Projektmanagement:</strong>{" "}
                Plane Meilensteine in Wochen (z.&nbsp;B. &bdquo;Release in
                KW&nbsp;{nextKWInfo.weekNumber}&ldquo;), um Monatsüberschneidungen
                zu umgehen.
              </span>
            </li>
          </ol>
        </div>

        {/* ── Übersichts-Tabelle ── Cluster 3 ─────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Übersicht: Aktueller Zeitraum &amp; Ausblick {kw.year}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Frage
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Antwort / Zeitraum
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border bg-accent/5">
                  <td className="px-5 py-3 font-semibold text-text-primary">
                    Welche KW haben wir heute?
                  </td>
                  <td className="px-5 py-3 font-semibold text-accent">
                    KW&nbsp;{kw.weekNumber} ({formatDateDE(kw.startDate)} &ndash; {formatDateDE(kw.endDate)})
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 text-text-secondary">
                    Welche KW haben wir nächste Woche?
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    KW&nbsp;{nextKWInfo.weekNumber} ({formatDateDE(nextKWInfo.startDate)} &ndash; {formatDateDE(nextKWInfo.endDate)})
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-text-secondary">
                    In welchem Jahr befinden wir uns?
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {kw.year} ({yearType})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Zusammenfassung ── Cluster 3 ────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-3">
            Zusammenfassung &amp; Ausblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Zusammengefasst bedeutet das: Wenn Du wissen willst,{" "}
            <strong className="text-text-primary">welche Kalenderwoche haben wir</strong>,
            ist die Antwort für heute die{" "}
            <strong className="text-text-primary">KW&nbsp;{kw.weekNumber}</strong>.
            Dies ist die Basis für Deine gesamte Jahresplanung {kw.year}.
            Hintergrundinfos zur gesamten Jahresplanung findest Du in unserem{" "}
            <a href="/kalenderwoche" className="text-accent hover:underline">
              Kalenderwochen {kw.year} Jahresüberblick
            </a>{" "}
            oder erfahre mehr über die{" "}
            <a href="/" className="text-accent hover:underline">
              Aktuelle KW
            </a>{" "}
            in unserem Detail-Ratgeber.
          </p>
        </div>

        {/* ── FAQ ── Cluster 3 ────────────────────────────────────── */}
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

        {/* ── Abschluss-Links ─────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {kw.year} &rarr;
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
 * SEO Audit Checklist – app/welche-kalenderwoche-haben-wir/page.tsx (Cluster 3)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Welche Kalenderwoche haben wir? – KW heute schnell finden"
 * [x] Meta Description: dynamisch mit KW-Nummer und Jahr
 * [x] Canonical URL: https://aktuellekw.de/welche-kalenderwoche-haben-wir
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Welche Kalenderwoche haben wir: Alles, was Du wissen musst"
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → Welche KW)
 * [x] Schema.org: FAQPage (5 Fragen)
 * [x] Cluster 3 SEO-Content: Intro, Hintergründe, Alltag-Tipps, Übersichtstabelle, Zusammenfassung
 * [x] Semantische HTML-Tabelle (Google Featured Snippets)
 * [x] FAQ (5 Fragen): KW Definition, Warum nicht KW 1, Berechnung, USA-KW, Excel
 * [x] Cross-Links: Startseite (Cluster 1), Kalenderwoche (Cluster 2), FAQ
 * [x] Cluster 3 Keywords: welche Kalenderwoche haben wir, welche KW ist heute,
 *     welche KW haben wir heute, welche KW haben wir jetzt
 * [x] Dynamische Platzhalter: CURRENT_KW, CURRENT_DATE_DISPLAY, KW_START/END, NEXT_KW
 * [x] revalidate = 3600 (stündliche ISR)
 * [x] OG-Image: dynamisch via opengraph-image.tsx (1200×630px)
 * [ ] TODO: hreflang für AT/CH ergänzen wenn mehrsprachig ausgebaut
 */
