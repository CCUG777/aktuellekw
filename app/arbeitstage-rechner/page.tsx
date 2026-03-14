import type { Metadata } from "next";
import Link from "next/link";
import ArbeitstageRechner from "@/components/ArbeitstageRechner";

export const revalidate = 3600;

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const title = "Arbeitstage berechnen 2026: Kostenloser Rechner";
  const description =
    "Arbeitstage & Werktage online berechnen. Alle Bundesl\u00e4nder, Feiertage automatisch, Urlaub & Krankheit abziehen. Perfekt f\u00fcr Steuererkl\u00e4rung & Pendlerpauschale.";
  const url = "https://aktuellekw.de/arbeitstage-rechner";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ── FAQ data ──────────────────────────────────────────────────── */
const pageFAQs = [
  {
    question: "Wie berechne ich Arbeitstage zwischen zwei Daten?",
    answer: "W\u00e4hle Start- und Enddatum sowie dein Bundesland aus. Der Rechner z\u00e4hlt automatisch alle Montag\u2013Freitag-Tage und zieht gesetzliche Feiertage ab. Optional kannst du Urlaubs- und Krankheitstage abziehen.",
  },
  {
    question: "Was ist der Unterschied zwischen Arbeitstagen und Werktagen?",
    answer: "Arbeitstage = Montag bis Freitag (5-Tage-Woche). Werktage = Montag bis Samstag (6-Tage-Woche). F\u00fcr die Steuererkl\u00e4rung und Pendlerpauschale z\u00e4hlen Arbeitstage (Mo\u2013Fr).",
  },
  {
    question: "Werden Feiertage automatisch ber\u00fccksichtigt?",
    answer: "Ja. Der Rechner kennt alle gesetzlichen Feiertage f\u00fcr alle 16 Bundesl\u00e4nder. W\u00e4hle dein Bundesland aus, und die regionalen Feiertage werden automatisch abgezogen.",
  },
  {
    question: "Wie berechne ich Netto-Arbeitstage?",
    answer: "Netto-Arbeitstage = Arbeitstage \u2212 Urlaubstage \u2212 Krankheitstage. Gib im Rechner deine Urlaubs- und Krankheitstage ein, um deine tats\u00e4chlichen Arbeitstage zu erhalten.",
  },
  {
    question: "Kann ich Arbeitstage f\u00fcr die Rentenberechnung nutzen?",
    answer: "Ja. Die Rentenversicherung nutzt Arbeitstage zur Berechnung von Beitragszeiten. Der Rechner zeigt dir die Brutto-Arbeitstage \u2013 ziehe Fehlzeiten ab, um die Netto-Beitragszeit zu erhalten.",
  },
  {
    question: "Wie berechne ich Arbeitstage in Excel?",
    answer: "Nutze die Formel =NETTOARBEITSTAGE(Startdatum;Enddatum;Feiertage). Die Funktion z\u00e4hlt Montag\u2013Freitag-Tage und zieht eine Liste von Feiertagen ab. In der englischen Version: =NETWORKDAYS().",
  },
  {
    question: "Welches Bundesland hat die meisten Arbeitstage?",
    answer: "Bundesl\u00e4nder mit weniger Feiertagen haben mehr Arbeitstage. Bremen, Hamburg, Niedersachsen und Schleswig-Holstein haben mit je 10 Feiertagen die meisten Arbeitstage, w\u00e4hrend Bayern und Saarland mit 12\u201313 Feiertagen weniger haben.",
  },
  {
    question: "Wie genau ist der Arbeitstage-Rechner?",
    answer: "Der Rechner ber\u00fccksichtigt alle gesetzlichen Feiertage nach den aktuellen Feiertagsgesetzen der Bundesl\u00e4nder. Er berechnet Arbeitstage (Mo\u2013Fr) und Werktage (Mo\u2013Sa) exakt. Betriebsurlaub oder individuelle freie Tage musst du manuell \u00fcber die Urlaubs-/Krankheitsfelder abziehen.",
  },
];

/* ── JSON-LD ──────────────────────────────────────────────────── */
const jsonLd = [
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
        name: "Arbeitstage berechnen",
        item: "https://aktuellekw.de/arbeitstage-rechner",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Arbeitstage-Rechner",
    url: "https://aktuellekw.de/arbeitstage-rechner",
    description:
      "Arbeitstage & Werktage online berechnen. Alle Bundesl\u00e4nder, Feiertage automatisch, Urlaub & Krankheit abziehen.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    inLanguage: "de-DE",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pageFAQs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
];

/* ── Page Component ────────────────────────────────────────────── */
export default function ArbeitstageRechnerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            Startseite
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Arbeitstage berechnen</span>
        </nav>

        {/* ── H1 + Intro ────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Arbeitstage berechnen &ndash; Kostenloser Rechner {new Date().getFullYear()}
        </h1>

        <div className="text-text-secondary leading-relaxed mb-8 space-y-3">
          <p>
            <strong className="text-text-primary">Arbeitstage &amp; Werktage online berechnen:</strong>{" "}
            W&auml;hle Zeitraum und Bundesland &ndash; Feiertage werden automatisch
            ber&uuml;cksichtigt. Ziehe Urlaubs- und Krankheitstage ab, um deine{" "}
            <strong className="text-text-primary">Netto-Arbeitstage</strong> zu erhalten.
            Perfekt f&uuml;r{" "}
            <strong className="text-text-primary">Steuererkl&auml;rung</strong>,{" "}
            <strong className="text-text-primary">Pendlerpauschale</strong> und Arbeitszeitplanung.
          </p>
          {/* [PLACEHOLDER: SEO-Intro-Text "Arbeitstage berechnen" – 80–120 W\u00f6rter.
              Keywords: arbeitstage berechnen, werktage berechnen, berechnung werktage,
              tagerechner werktage, arbeitstage berechnen zeitraum, arbeitstage zaehlen.
              Themen: Wof\u00fcr Arbeitstage-Berechnung wichtig ist, Toggle-Erkl\u00e4rung
              Arbeitstage vs. Werktage, Bundesland-Unterschiede.] */}
        </div>

        {/* ── Rechner-Widget ──────────────────────────────────── */}
        <ArbeitstageRechner />

        {/* ═════════════════════════════════════════════════════════
            SECTION 1: So funktioniert der Rechner
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            So funktioniert der Arbeitstage-Rechner
          </h2>
          {/* [PLACEHOLDER: SEO-Text "So funktioniert der Rechner" – 100–150 W\u00f6rter.
              Keywords: arbeitstage berechnen, arbeitstage berechnen zeitraum,
              berechnung werktage.
              Themen: Schritt-f\u00fcr-Schritt Anleitung (Datum w\u00e4hlen, BL w\u00e4hlen,
              Abz\u00fcge eingeben), Erkl\u00e4rung Brutto vs. Netto-Arbeitstage,
              wann Toggle auf Werktage sinnvoll ist.] */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                step: "1",
                title: "Zeitraum w\u00e4hlen",
                desc: "W\u00e4hle Start- und Enddatum. Der Rechner z\u00e4hlt alle Tage im gew\u00e4hlten Zeitraum.",
              },
              {
                step: "2",
                title: "Bundesland ausw\u00e4hlen",
                desc: "Gesetzliche Feiertage variieren je Bundesland. W\u00e4hle deins f\u00fcr korrekte Ergebnisse.",
              },
              {
                step: "3",
                title: "Abz\u00fcge eingeben",
                desc: "Ziehe Urlaubs- und Krankheitstage ab, um deine tats\u00e4chlichen Netto-Arbeitstage zu erhalten.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-surface-secondary border border-border rounded-xl p-4"
              >
                <span className="text-accent font-bold text-lg">{item.step}</span>
                <h3 className="font-medium text-text-primary text-sm mt-1 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 2: Arbeitstage vs. Werktage
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage vs. Werktage &ndash; Was ist der Unterschied?
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Arbeitstage vs. Werktage" – 60–80 W\u00f6rter.
              Keywords: berechnung werktage, werktage berechnen, arbeitstage berechnen.
              Themen: Definition Werktag (Mo-Sa) vs. Arbeitstag (Mo-Fr), wann welcher
              Begriff relevant ist, Steuerrecht vs. Arbeitsrecht.] */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">&nbsp;</th>
                  <th className="text-center px-5 py-3 font-medium text-text-secondary">Arbeitstage</th>
                  <th className="text-center px-5 py-3 font-medium text-text-secondary">Werktage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Umfasst", at: "Mo \u2013 Fr", wt: "Mo \u2013 Sa" },
                  { label: "Tage/Woche", at: "5", wt: "6" },
                  { label: "Steuererkl\u00e4rung", at: "\u2713 (Pendlerpauschale)", wt: "\u2013" },
                  { label: "Mietrecht", at: "\u2013", wt: "\u2713 (Fristen)" },
                  { label: "Max. Tage/Jahr", at: "~250\u2013253", wt: "~300\u2013304" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 font-medium text-text-primary">{row.label}</td>
                    <td className="px-5 py-3 text-center text-text-secondary">{row.at}</td>
                    <td className="px-5 py-3 text-center text-text-secondary">{row.wt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 3: Arbeitstage in Excel
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage in Excel berechnen
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Arbeitstage in Excel" – 60–80 W\u00f6rter.
              Keywords: arbeitstage berechnen, berechnung werktage.
              Themen: NETTOARBEITSTAGE()-Formel, NETWORKDAYS(),
              Feiertage-Liste als Parameter, Google-Sheets-Alternative.] */}
          <div className="bg-surface-secondary border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Excel-Formeln f&uuml;r Arbeitstage
            </h3>
            <div className="space-y-3 text-sm text-text-secondary">
              <div>
                <code className="bg-surface border border-border rounded px-2 py-1 text-xs text-accent font-mono">
                  =NETTOARBEITSTAGE(A1;B1;Feiertage)
                </code>
                <p className="mt-1 text-xs">
                  Z&auml;hlt Arbeitstage (Mo&ndash;Fr) zwischen zwei Daten, minus Feiertage.
                </p>
              </div>
              <div>
                <code className="bg-surface border border-border rounded px-2 py-1 text-xs text-accent font-mono">
                  =NETTOARBEITSTAGE.INTL(A1;B1;1;Feiertage)
                </code>
                <p className="mt-1 text-xs">
                  Erweiterte Version mit konfigurierbarem Wochenende (Parameter 1 = Sa+So).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            CTA: Link zur Pillar Page
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 md:p-8 text-center">
            <h2 className="text-xl font-bold text-text-primary mb-3">
              Alle Arbeitstage {new Date().getFullYear()} im &Uuml;berblick
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-lg mx-auto">
              Vergleiche Arbeitstage aller 16 Bundesl&auml;nder und sieh die
              monatliche Aufschl&uuml;sselung inkl. Feiertage &ndash; n&uuml;tzlich
              f&uuml;r Gehaltsvergleiche und Standortwahl.
            </p>
            <Link
              href="/arbeitstage-2026"
              className="inline-flex items-center gap-2 bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent/90 transition-colors"
            >
              Arbeitstage 2026 &ndash; &Uuml;bersicht &rarr;
            </Link>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            FAQ
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zum Arbeitstage-Rechner
          </h2>
          <div className="space-y-2.5">
            {pageFAQs.map((faq, i) => (
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

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/arbeitstage-2026" className="text-accent hover:underline">
            Arbeitstage 2026 &rarr;
          </Link>
          <Link href={`/feiertage/${new Date().getFullYear()}`} className="text-accent hover:underline">
            Feiertage {new Date().getFullYear()} &rarr;
          </Link>
          <Link href="/tagerechner" className="text-accent hover:underline">
            Tagerechner &rarr;
          </Link>
          <Link href="/datum-heute" className="text-accent hover:underline">
            Datum heute &rarr;
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/arbeitstage-rechner/page.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Arbeitstage berechnen 2026: Kostenloser Rechner" (456px)
 * [x] Meta Description: Transactional, mit Features
 * [x] Canonical URL: https://aktuellekw.de/arbeitstage-rechner
 * [x] OG + Twitter Cards
 * [x] H1: "Arbeitstage berechnen \u2013 Kostenloser Rechner"
 * [x] Schema.org: BreadcrumbList, WebApplication, FAQPage (8 Fragen)
 * [x] Interaktiver Rechner (Client Component):
 *     - Zeitraum (Von/Bis), Bundesland, Urlaub, Krankheit
 *     - Toggle: Arbeitstage (Mo\u2013Fr) / Werktage (Mo\u2013Sa)
 *     - Ergebnis: Brutto-AT, Netto-AT, Feiertage, Kalendertage, Wochen
 * [x] 3-Schritte-Anleitung
 * [x] Vergleichstabelle: Arbeitstage vs. Werktage
 * [x] Excel-Formeln: NETTOARBEITSTAGE()
 * [x] CTA: Link zur Pillar Page /arbeitstage-2026
 * [x] Cross-Links: Startseite, Arbeitstage 2026, Feiertage, Tagerechner, FAQ
 * [x] revalidate = 3600
 * [ ] PLACEHOLDER: SEO-Intro-Text (80\u2013120 W.)
 * [ ] PLACEHOLDER: Rechner-Erkl\u00e4rung (100\u2013150 W.)
 * [ ] PLACEHOLDER: Arbeitstage vs. Werktage (60\u201380 W.)
 * [ ] PLACEHOLDER: Excel-Formeln (60\u201380 W.)
 */
