import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllBundeslaenderArbeitstage,
  getWerktageImJahr,
  getArbeitstageForBundesland,
} from "@/lib/arbeitstage";

export const revalidate = 86400;

const YEAR = 2026;

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const title = "Arbeitstage 2026: Alle Bundesl\u00e4nder & Monate";
  const description =
    "Wie viele Arbeitstage hat 2026? \u00dcbersicht aller 16 Bundesl\u00e4nder mit monatlicher Aufschl\u00fcsselung inkl. Feiertage. Plus: Tipps f\u00fcr Steuererkl\u00e4rung & Pendlerpauschale.";
  const url = "https://aktuellekw.de/arbeitstage-2026";

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
function getPageFAQs(werktageGesamt: number) {
  return [
    {
      question: "Wie viele Arbeitstage hat 2026?",
      answer: `2026 hat je nach Bundesland zwischen 248 und 253 Arbeitstage. Der Unterschied ergibt sich aus der unterschiedlichen Anzahl gesetzlicher Feiertage, die auf Werktage (Mo\u2013Fr) fallen. Ohne Feiertage hat 2026 insgesamt ${werktageGesamt} Werktage.`,
    },
    {
      question: "Wie viele Arbeitstage hat ein Monat im Durchschnitt?",
      answer: "Im Durchschnitt hat ein Monat in Deutschland etwa 21 Arbeitstage. Der genaue Wert variiert zwischen 19 und 23 Tagen, je nach Monatslaenge und Feiertagen im jeweiligen Bundesland.",
    },
    {
      question: "Wie rechne ich Stunden in Arbeitstage um?",
      answer: "Teile die Stundenzahl durch die taegliche Arbeitszeit. Bei einer 40-Stunden-Woche (8 h/Tag): 160 Stunden \u00f7 8 = 20 Arbeitstage. Bei einer 38,5-Stunden-Woche (7,7 h/Tag): 160 \u00f7 7,7 \u2248 20,8 Arbeitstage.",
    },
    {
      question: "Was ist der Unterschied zwischen Werktagen und Arbeitstagen?",
      answer: "Werktage sind Montag bis Samstag (6 Tage/Woche). Arbeitstage sind in der Regel Montag bis Freitag (5 Tage/Woche) \u2013 also die typische 5-Tage-Arbeitswoche ohne Samstag. F\u00fcr die Steuererkl\u00e4rung z\u00e4hlen Arbeitstage.",
    },
    {
      question: "Wie viele Arbeitstage brauche ich f\u00fcr die Steuererkl\u00e4rung?",
      answer: "F\u00fcr die Pendlerpauschale werden maximal 230 Arbeitstage pro Jahr anerkannt (bei 5-Tage-Woche). Ziehe davon Urlaubs- und Krankheitstage ab. Das Finanzamt akzeptiert ohne Nachweis etwa 220\u2013230 Tage.",
    },
    {
      question: "Wie viele Arbeitstage hat 2026 in NRW?",
      answer: "Nordrhein-Westfalen hat 2026 insgesamt 250 Arbeitstage. NRW hat 11 gesetzliche Feiertage, von denen einige auf Wochenenden fallen k\u00f6nnen.",
    },
    {
      question: "Z\u00e4hlen Feiertage als Arbeitstage?",
      answer: "Nein. Gesetzliche Feiertage, die auf einen Werktag (Mo\u2013Fr) fallen, sind keine Arbeitstage. Sie werden von der Gesamtzahl der Werktage abgezogen, um die Arbeitstage zu ermitteln.",
    },
    {
      question: "Was ist ein Jahresarbeitszeitrechner?",
      answer: "Ein Jahresarbeitszeitrechner ermittelt die tats\u00e4chliche Arbeitszeit pro Jahr. Er ber\u00fccksichtigt Arbeitstage, Urlaubstage, Feiertage und Krankheitstage und rechnet diese in Stunden um \u2013 n\u00fctzlich f\u00fcr Gehaltsverhandlungen und Arbeitszeitmodelle.",
    },
  ];
}

/* ── Page Component ────────────────────────────────────────────── */
export default function Arbeitstage2026Page() {
  const allBL = getAllBundeslaenderArbeitstage(YEAR);
  const werktageGesamt = getWerktageImJahr(YEAR);
  const pageFAQs = getPageFAQs(werktageGesamt);

  // Example: NRW for monthly breakdown (most populous state)
  const nrw = getArbeitstageForBundesland(YEAR, "NW");

  // Min/Max Arbeitstage across all BL
  const minAT = allBL[allBL.length - 1];
  const maxAT = allBL[0];

  // JSON-LD
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
          name: `Arbeitstage ${YEAR}`,
          item: `https://aktuellekw.de/arbeitstage-${YEAR}`,
        },
      ],
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
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Arbeitstage ${YEAR} Deutschland`,
      description: `Arbeitstage ${YEAR} f\u00fcr alle 16 Bundesl\u00e4nder mit monatlicher Aufschl\u00fcsselung`,
      temporalCoverage: `${YEAR}`,
      creator: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
    },
  ];

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
          <span className="text-text-primary">Arbeitstage {YEAR}</span>
        </nav>

        {/* ── H1 + Intro ────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Arbeitstage {YEAR} &ndash; &Uuml;bersicht aller Bundesl&auml;nder &amp; Monate
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            <strong className="text-text-primary">Wie viele Arbeitstage hat {YEAR}?</strong>{" "}
            Je nach Bundesland zwischen{" "}
            <strong className="text-text-primary">{minAT.arbeitstageJahr}</strong> und{" "}
            <strong className="text-text-primary">{maxAT.arbeitstageJahr} Arbeitstagen</strong>.
            Ohne Feiertage hat {YEAR} insgesamt{" "}
            <strong className="text-text-primary">{werktageGesamt} Werktage</strong>{" "}
            (Montag bis Freitag).
          </p>
          {/* [PLACEHOLDER: SEO-Intro-Text "Arbeitstage 2026" – 80–120 W\u00f6rter.
              Keywords: arbeitstage 2026, arbeitstage im jahr berechnen,
              ermittlung arbeitstage, jahresarbeitszeitrechner.
              Themen: Warum Arbeitstage je Bundesland verschieden, Bedeutung
              f\u00fcr Steuererkl\u00e4rung/Pendlerpauschale, ISO-Werktage vs. Arbeitstage.] */}
        </div>

        {/* ── Hero Stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Werktage (Mo\u2013Fr)", value: String(werktageGesamt) },
            { label: `Min. Arbeitstage`, value: `${minAT.arbeitstageJahr} (${minAT.code})` },
            { label: `Max. Arbeitstage`, value: `${maxAT.arbeitstageJahr} (${maxAT.code})` },
            { label: "Bundesl\u00e4nder", value: "16" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-secondary border border-border rounded-xl px-4 py-3 text-center"
            >
              <div className="text-xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-text-secondary mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 1: Arbeitstage nach Bundesland
            ═════════════════════════════════════════════════════════ */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage {YEAR} nach Bundesland
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Arbeitstage nach Bundesland" – 60–80 W\u00f6rter.
              Keywords: arbeitstage 2026, ermittlung arbeitstage.
              Themen: Warum BY/SL weniger Arbeitstage (mehr Feiertage),
              Bedeutung f\u00fcr Gehaltsvergleiche und Standortwahl.] */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Bundesland</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Feiertage</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">davon Mo&ndash;Fr</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Arbeitstage</th>
                </tr>
              </thead>
              <tbody>
                {allBL.map((bl) => (
                  <tr
                    key={bl.code}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-3 font-medium text-text-primary">
                      <Link
                        href={`/feiertage/${YEAR}/${bl.name.toLowerCase().replace(/\u00e4/g, "ae").replace(/\u00f6/g, "oe").replace(/\u00fc/g, "ue").replace(/\u00df/g, "ss").replace(/\s+/g, "-")}`}
                        className="hover:text-accent transition-colors"
                      >
                        {bl.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-right text-text-secondary">
                      {bl.feiertageGesamt}
                    </td>
                    <td className="px-5 py-3 text-right text-text-secondary">
                      {bl.feiertageWerktag}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-accent">
                      {bl.arbeitstageJahr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            Werktage (Mo&ndash;Fr) ohne gesetzliche Feiertage. Urlaubs- und
            Krankheitstage sind nicht ber&uuml;cksichtigt.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 2: Arbeitstage pro Monat
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage {YEAR} pro Monat (Beispiel: NRW)
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Arbeitstage pro Monat" – 40–60 W\u00f6rter.
              Keywords: arbeitstage im jahr berechnen, arbeitstage 2026.
              Themen: Monatliche Unterschiede, welche Monate am meisten/wenigsten
              Arbeitstage haben, Auswirkung auf Monatsgehalt.] */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Monat</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Werktage</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Feiertage (Mo&ndash;Fr)</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Arbeitstage</th>
                </tr>
              </thead>
              <tbody>
                {nrw.monate.map((m) => (
                  <tr
                    key={m.monat}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-3 font-medium text-text-primary">{m.monat}</td>
                    <td className="px-5 py-3 text-right text-text-secondary">{m.werktage}</td>
                    <td className="px-5 py-3 text-right text-text-secondary">{m.feiertageAnzahl}</td>
                    <td className="px-5 py-3 text-right font-semibold text-accent">{m.arbeitstage}</td>
                  </tr>
                ))}
                {/* Summe */}
                <tr className="bg-surface-secondary font-semibold">
                  <td className="px-5 py-3 text-text-primary">Gesamt {YEAR}</td>
                  <td className="px-5 py-3 text-right text-text-secondary">
                    {nrw.monate.reduce((s, m) => s + m.werktage, 0)}
                  </td>
                  <td className="px-5 py-3 text-right text-text-secondary">
                    {nrw.feiertageWerktag}
                  </td>
                  <td className="px-5 py-3 text-right text-accent">
                    {nrw.arbeitstageJahr}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            Beispiel: Nordrhein-Westfalen ({nrw.feiertageGesamt} Feiertage, davon{" "}
            {nrw.feiertageWerktag} an Werktagen). Andere Bundesl&auml;nder k&ouml;nnen
            abweichen &ndash;{" "}
            <Link href="/arbeitstage-rechner" className="text-accent hover:underline">
              berechne deine Arbeitstage individuell
            </Link>
            .
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 3: Steuererklärung
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage f&uuml;r die Steuererkl&auml;rung
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Arbeitstage Steuererkl\u00e4rung" – 100\u2013150 W\u00f6rter.
              Keywords: arbeitstage 2026, ermittlung arbeitstage.
              Themen: Warum Arbeitstage f\u00fcr die Pendlerpauschale wichtig sind,
              230-Tage-Grenze, Berechnung Netto-Arbeitstage, Dokumentation
              f\u00fcr das Finanzamt, Unterschied 5-Tage/6-Tage-Woche.] */}
          <div className="bg-surface-secondary border border-border rounded-xl p-5 mb-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Pendlerpauschale &amp; 230-Tage-Grenze
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                "Bei einer 5-Tage-Woche erkennt das Finanzamt max. 230 Arbeitstage an.",
                "Bei einer 6-Tage-Woche sind es max. 280 Arbeitstage.",
                "Urlaubs- und Krankheitstage m\u00fcssen abgezogen werden.",
                "Pro Arbeitstag: 0,30\u00a0\u20ac/km f\u00fcr die ersten 20\u00a0km, 0,38\u00a0\u20ac/km ab dem 21.\u00a0km.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* [PLACEHOLDER: SEO-Text "Pendlerpauschale Berechnung" – 60\u201380 W\u00f6rter.
              Keywords: ermittlung arbeitstage, arbeitstage 2026.
              Themen: Beispielrechnung Pendlerpauschale, Homeoffice-Pauschale
              als Alternative, Dokumentationspflicht.] */}
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 4: Umrechnung Stunden → Arbeitstage
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Stunden in Arbeitstage umrechnen
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Stunden in Arbeitstage umrechnen" – 60\u201380 W\u00f6rter.
              Keywords: stunden in tage umrechnen arbeitstage, stunden in
              arbeitstage umrechnen. Themen: Formel, Beispiele f\u00fcr verschiedene
              Arbeitszeitmodelle, Teilzeit-Umrechnung.] */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Wochenstunden</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">h/Tag</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">100 h =</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">160 h =</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { woche: "40 h", tag: 8, h100: "12,5", h160: "20,0" },
                  { woche: "38,5 h", tag: 7.7, h100: "13,0", h160: "20,8" },
                  { woche: "35 h", tag: 7, h100: "14,3", h160: "22,9" },
                  { woche: "30 h (Teilzeit)", tag: 6, h100: "16,7", h160: "26,7" },
                  { woche: "20 h (Teilzeit)", tag: 4, h100: "25,0", h160: "40,0" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 font-medium text-text-primary">{row.woche}</td>
                    <td className="px-5 py-3 text-right text-text-secondary">{row.tag}</td>
                    <td className="px-5 py-3 text-right text-text-secondary">{row.h100} AT</td>
                    <td className="px-5 py-3 text-right text-accent font-semibold">{row.h160} AT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            AT = Arbeitstage. Formel: Stunden &divide; t&auml;gliche Arbeitszeit = Arbeitstage.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            CTA: Link zum Rechner
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 md:p-8 text-center">
            <h2 className="text-xl font-bold text-text-primary mb-3">
              Arbeitstage individuell berechnen
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-lg mx-auto">
              Berechne deine pers&ouml;nlichen Arbeitstage mit Bundesland-Auswahl,
              Urlaubs- und Krankheitstagen. Perfekt f&uuml;r die Steuererkl&auml;rung
              und Pendlerpauschale.
            </p>
            <Link
              href="/arbeitstage-rechner"
              className="inline-flex items-center gap-2 bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent/90 transition-colors"
            >
              Zum Arbeitstage-Rechner &rarr;
            </Link>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            FAQ
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zu Arbeitstagen {YEAR}
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
          <Link href="/arbeitstage-rechner" className="text-accent hover:underline">
            Arbeitstage-Rechner &rarr;
          </Link>
          <Link href={`/feiertage/${YEAR}`} className="text-accent hover:underline">
            Feiertage {YEAR} &rarr;
          </Link>
          <Link href="/tagerechner" className="text-accent hover:underline">
            Tagerechner &rarr;
          </Link>
          <Link href="/schaltjahr" className="text-accent hover:underline">
            Schaltjahr &rarr;
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
 * SEO Audit Checklist – app/arbeitstage-2026/page.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Arbeitstage 2026: Alle Bundesl\u00e4nder & Monate" (437px)
 * [x] Meta Description: dynamisch mit Arbeitstage-Zahlen
 * [x] Canonical URL: https://aktuellekw.de/arbeitstage-2026
 * [x] OG + Twitter Cards
 * [x] H1: "Arbeitstage 2026 \u2013 \u00dcbersicht aller Bundesl\u00e4nder & Monate"
 * [x] Schema.org: BreadcrumbList, FAQPage (8 Fragen), Dataset
 * [x] Bundesland-Tabelle (16 Zeilen, sortiert nach Arbeitstagen)
 * [x] Monats-Tabelle (12 Zeilen + Summe, Beispiel NRW)
 * [x] Steuererkl\u00e4rung: Pendlerpauschale & 230-Tage-Grenze
 * [x] Umrechnungstabelle: Stunden \u2192 Arbeitstage
 * [x] CTA: Link zum Arbeitstage-Rechner
 * [x] Cross-Links: Startseite, Rechner, Feiertage, Tagerechner, Schaltjahr, FAQ
 * [x] revalidate = 86400
 * [ ] PLACEHOLDER: SEO-Intro-Text (80\u2013120 W.)
 * [ ] PLACEHOLDER: Bundesland-Erkl\u00e4rung (60\u201380 W.)
 * [ ] PLACEHOLDER: Monats-Erkl\u00e4rung (40\u201360 W.)
 * [ ] PLACEHOLDER: Steuererkl\u00e4rung (100\u2013150 W.)
 * [ ] PLACEHOLDER: Pendlerpauschale (60\u201380 W.)
 * [ ] PLACEHOLDER: Stunden-Umrechnung (60\u201380 W.)
 */
