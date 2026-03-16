import type { Metadata } from "next";
import Link from "next/link";
import ArbeitstageRechner from "@/components/ArbeitstageRechner";

export const revalidate = 86400;

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const title =
    "Arbeitstage berechnen: Anleitung + Checkliste (2026)";
  const description =
    "Arbeitstage berechnen in 5 Schritten: Unterschied zu Werktagen, Feiertage je Bundesland, Samstage & Teilzeit. Mit Fehler-Checkliste + Rechner-Start.";
  const url = "https://aktuellekw.de/arbeitstage-berechnen";

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
    question: "Wie viele Arbeitstage hat ein Jahr in Deutschland?",
    answer:
      "Das h\u00e4ngt davon ab, wie du \u201eArbeitstage\u201c definierst (z.\u00a0B. Mo\u2013Fr) und welche Feiertage in deinem Bundesland gelten. F\u00fcrs Arbeitstage berechnen brauchst du daher immer: Jahr, Bundesland, Zeitraum und ob Samstag als Arbeitstag z\u00e4hlt. Ohne diese Angaben gibt es keine einheitliche Zahl f\u00fcr ganz Deutschland.",
  },
  {
    question:
      "Was ist der Unterschied zwischen Arbeitstagen und Werktagen?",
    answer:
      "Werktage sind in der Regel Montag bis Samstag, also alle Tage au\u00dfer Sonntag und gesetzlichen Feiertagen. Arbeitstage sind die Tage, an denen du tats\u00e4chlich arbeiten musst \u2013 meist Montag bis Freitag, je nach Vertrag/Branche auch Samstag. Beim Arbeitstage berechnen ist diese Unterscheidung entscheidend, weil sie das Ergebnis im Zeitraum stark ver\u00e4ndert.",
  },
  {
    question: "Z\u00e4hlen Feiertage als Arbeitstage?",
    answer:
      "Gesetzliche Feiertage z\u00e4hlen normalerweise nicht als Arbeitstage, wenn sie auf einen Tag fallen, an dem du sonst arbeiten w\u00fcrdest. F\u00fcrs Arbeitstage berechnen musst du die Feiertage im jeweiligen Bundesland pr\u00fcfen, weil es regionale Feiertage gibt. F\u00e4llt ein Feiertag auf Sonntag, \u00e4ndert sich an deinen Arbeitstagen meist nichts.",
  },
  {
    question:
      "Welche Rolle spielt das Bundesland bei der Arbeitstage-Berechnung?",
    answer:
      "Das Bundesland ist wichtig, weil die gesetzlichen Feiertage je nach Bundesland unterschiedlich sind. Beim Arbeitstage berechnen im Zeitraum musst du deshalb immer das Bundesland ausw\u00e4hlen, sonst werden regionale Feiertage falsch ber\u00fccksichtigt. Das kann die Anzahl der Arbeitstage sp\u00fcrbar ver\u00e4ndern.",
  },
  {
    question:
      "Ist Samstag ein Werktag und ist Samstag ein Arbeitstag?",
    answer:
      "Samstag ist in Deutschland in der Regel ein Werktag, weil Werktage meist Montag bis Samstag sind. Ob Samstag auch ein Arbeitstag ist, h\u00e4ngt von deinem Arbeitsvertrag, deiner Branche und deinem Arbeitszeitmodell ab. Beim Arbeitstage berechnen solltest du deshalb klar festlegen, ob du Mo\u2013Fr oder Mo\u2013Sa z\u00e4hlst.",
  },
  {
    question:
      "Wie berechne ich Arbeitstage zwischen zwei Daten inklusive Start- und Enddatum?",
    answer:
      "Z\u00e4hle alle Kalendertage von Start- bis Enddatum (inklusive), streiche dann Sonntage und \u2013 je nach Definition \u2013 Samstage. Ziehe anschlie\u00dfend die gesetzlichen Feiertage deines Bundeslands ab, die auf potenzielle Arbeitstage fallen. Genau so kannst du Arbeitstage berechnen, auch ohne Tool, solange du Feiertage und Wochenenden sauber pr\u00fcfst.",
  },
  {
    question:
      "Wie werden Teilzeit-Arbeitsmodelle (z.\u00a0B. 4-Tage-Woche) bei Arbeitstagen ber\u00fccksichtigt?",
    answer:
      "Bei Teilzeit z\u00e4hlen als Arbeitstage nur die Wochentage, an denen du laut Plan tats\u00e4chlich arbeitest. Beim Arbeitstage berechnen im Zeitraum nimmst du daher zuerst die \u201enormalen\u201c Arbeitstage und filterst dann auf deine festen Arbeitstage (z.\u00a0B. Mo\u2013Do). Bei wechselnden Pl\u00e4nen brauchst du den konkreten Dienstplan, sonst wird die Berechnung ungenau.",
  },
  {
    question:
      "Z\u00e4hlen Br\u00fcckentage als Werktage oder Arbeitstage?",
    answer:
      "Br\u00fcckentage sind keine gesetzlichen Feiertage und z\u00e4hlen daher grunds\u00e4tzlich als Werktage. Ob sie auch Arbeitstage sind, h\u00e4ngt davon ab, ob du an dem Tag arbeiten musst oder z.\u00a0B. Urlaub/Freizeitausgleich hast. Beim Arbeitstage berechnen solltest du Br\u00fcckentage nur dann abziehen, wenn sie bei dir tats\u00e4chlich arbeitsfrei sind.",
  },
  {
    question:
      "Wie kann ich Arbeitstage ohne Rechner schnell \u00fcberschlagen?",
    answer:
      "\u00dcberschlage zuerst Wochen: pro voller Woche rechnest du meist mit 5 Arbeitstagen (Mo\u2013Fr) oder 6 Werktagen (Mo\u2013Sa). Dann korrigierst du f\u00fcr angefangene Wochen am Anfang/Ende und ziehst Feiertage im Bundesland ab, die auf Arbeitstage fallen. So kannst du Arbeitstage berechnen, ohne jeden Tag einzeln zu z\u00e4hlen.",
  },
];

/* ── JSON-LD ──────────────────────────────────────────────────── */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://aktuellekw.de/arbeitstage-berechnen#breadcrumb",
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
        item: "https://aktuellekw.de/arbeitstage-berechnen",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://aktuellekw.de/arbeitstage-berechnen#webapp",
    isPartOf: { "@id": "https://aktuellekw.de/#website" },
    publisher: { "@id": "https://aktuellekw.de/#organization" },
    datePublished: "2026-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    name: "Arbeitstage-Rechner",
    url: "https://aktuellekw.de/arbeitstage-berechnen",
    description:
      "Arbeitstage berechnen in 5 Schritten: Unterschied zu Werktagen, Feiertage je Bundesland, Samstage & Teilzeit. Mit Fehler-Checkliste + Rechner-Start.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    inLanguage: "de-DE",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://aktuellekw.de/arbeitstage-berechnen#faqpage",
    isPartOf: { "@id": "https://aktuellekw.de/#website" },
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
export default function ArbeitstageBerechnenPage() {
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
          Arbeitstage berechnen: Werktage z&auml;hlen im Zeitraum (inkl.&nbsp;Feiertage)
        </h1>

        <div className="text-text-secondary leading-relaxed mb-8 space-y-3">
          <p>
            <strong className="text-text-primary">Arbeitstage berechnen</strong> hei&szlig;t:
            Du nimmst die Kalendertage im Zeitraum und ziehst Wochenenden ab &ndash; und je
            nach Zweck auch die Feiertage. Genau hier passieren die meisten Fehler, weil
            &bdquo;Arbeitstage&ldquo; nicht dasselbe sind wie &bdquo;Werktage&ldquo;: Werktage
            z&auml;hlen oft Montag bis Samstag, Arbeitstage meist nur die Tage, an denen du
            tats&auml;chlich arbeitest (typisch Montag bis Freitag). Dazu kommt: Feiertage sind
            bundeslandspezifisch &ndash; ein Tag kann in Bayern frei sein, in Berlin aber nicht,
            und dein Ergebnis kippt sofort.
          </p>
          <p>
            Damit du schnell zu einer verl&auml;sslichen Zahl kommst, bekommst du gleich eine
            klare <strong className="text-text-primary">Schritt-f&uuml;r-Schritt-Methode</strong>,
            mit der du Arbeitstage auch ohne Tool sauber nachrechnest, plus eine kurze Checkliste
            f&uuml;r typische Stolperfallen (Feiertage/Bundesland, Samstage, Teilzeit). Wenn du es
            noch schneller willst: Mit dem <strong className="text-text-primary">Arbeitstage-Rechner</strong>{" "}
            weiter unten dauert die Berechnung Sekunden &ndash; und du wei&szlig;t trotzdem, wie du
            das Ergebnis pr&uuml;fst.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 1: Definition und Unterschied zu Werktagen
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage berechnen: Definition und Unterschied zu Werktagen
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              Wenn du <strong className="text-text-primary">Arbeitstage berechnen</strong> willst,
              brauchst du zuerst eine klare Definition: Arbeitstage sind die Tage, an denen in
              deinem Betrieb tats&auml;chlich gearbeitet wird. Meist sind das Montag bis Freitag.
              In einigen Branchen z&auml;hlt auch der Samstag dazu, zum Beispiel im Handel oder in
              der Logistik. Entscheidend ist deine reale Arbeitswoche &ndash; nicht nur der Kalender.
            </p>
            <p>
              Bei <strong className="text-text-primary">Werktage berechnen</strong> gilt dagegen
              eine feste Grundregel: Werktage sind in der Regel Montag bis Samstag. Der Sonntag
              z&auml;hlt nicht als Werktag. Genau hier entsteht oft Verwirrung, weil viele
              &bdquo;Werktage&ldquo; sagen, aber <strong className="text-text-primary">Arbeitstage</strong> meinen
              &ndash; oder umgekehrt. Deshalb kann das Ergebnis bei Werktagen h&ouml;her ausfallen
              als bei Arbeitstagen.
            </p>
          </div>

          {/* Vergleichstabelle Arbeitstage vs. Werktage */}
          <div className="overflow-x-auto rounded-xl border border-border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Kriterium</th>
                  <th className="text-center px-5 py-3 font-medium text-text-secondary">Arbeitstage</th>
                  <th className="text-center px-5 py-3 font-medium text-text-secondary">Werktage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Definition", at: "Tats\u00e4chliche Arbeitstage im Betrieb", wt: "Kalendertage Mo\u2013Sa (So ausgeschlossen)" },
                  { label: "Typische Woche", at: "Mo\u2013Fr (manchmal inkl. Sa)", wt: "Mo\u2013Sa" },
                  { label: "Branchenbeispiele", at: "B\u00fcro, Verwaltung, Services", wt: "Handwerk, Handel, Zustellung, Bau" },
                  { label: "Relevanz", at: "Arbeitszeiten, Planung, Steuererkl\u00e4rung", wt: "Fristen, Lieferangaben, Mietrecht" },
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

          <p className="text-text-secondary text-sm leading-relaxed">
            Kurzbeispiel: Bei einer Arbeitswoche von Montag bis Freitag sind es{" "}
            <strong className="text-text-primary">5&nbsp;Arbeitstage</strong>. Nach Werktagen
            sind es <strong className="text-text-primary">6&nbsp;Tage</strong>, weil der Samstag
            mitz&auml;hlt. In zwei Kalenderwochen ohne Feiertage ergibt das{" "}
            <strong className="text-text-primary">10&nbsp;Arbeitstage</strong> vs.{" "}
            <strong className="text-text-primary">12&nbsp;Werktage</strong>.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 1b: Samstag als Arbeitstag
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Ist Samstag ein Arbeitstag? (Werktag vs. Arbeitstag)
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-5">
            <p>
              Ist <strong className="text-text-primary">Samstag ein Arbeitstag</strong>? In
              Deutschland z&auml;hlt der Samstag meist als <strong className="text-text-primary">Werktag</strong>,
              aber nicht automatisch als Arbeitstag. Ob du ihn beim Arbeitstage z&auml;hlen oder
              Werktage berechnen ber&uuml;cksichtigen musst, h&auml;ngt von deiner pers&ouml;nlichen
              Arbeitswoche ab.
            </p>
            <p>
              Samstagsarbeit ist vor allem im <strong className="text-text-primary">Einzelhandel</strong>,
              in der <strong className="text-text-primary">Gastronomie</strong>, in der{" "}
              <strong className="text-text-primary">Pflege</strong> und im{" "}
              <strong className="text-text-primary">Schichtbetrieb</strong> &uuml;blich. Pr&uuml;fe
              daf&uuml;r deinen Arbeitsvertrag oder eine Betriebsvereinbarung. Entscheidend ist, ob
              dein Arbeitgeber den Samstag regelm&auml;&szlig;ig in deinem Dienstplan einsetzt.
            </p>
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Merke:</strong> Samstag = <strong className="text-text-primary">Werktag</strong>,
            aber nur <strong className="text-text-primary">Arbeitstag</strong>, wenn er Teil deiner Arbeitswoche ist.
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2: Schritt-für-Schritt-Berechnung
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            So berechnest du Arbeitstage im Zeitraum (Schritt-f&uuml;r-Schritt)
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              Wenn du <strong className="text-text-primary">Arbeitstage im Zeitraum</strong> berechnen
              willst, starte mit einer klaren Z&auml;hlregel: Lege{" "}
              <strong className="text-text-primary">Startdatum</strong> und{" "}
              <strong className="text-text-primary">Enddatum</strong> fest und entscheide, ob du beide
              Tage <strong className="text-text-primary">inklusive</strong> z&auml;hlst oder einen Randtag{" "}
              <strong className="text-text-primary">ausschlie&szlig;t</strong>. F&uuml;r die reine
              Differenz in Tagen hilft dir dieser{" "}
              <Link href="/tagerechner" className="text-accent hover:underline">
                Tagerechner
              </Link>.
            </p>
            <p>
              Als N&auml;chstes definierst du dein Wochenmodell. In der{" "}
              <strong className="text-text-primary">5-Tage-Woche</strong> sind Samstag und Sonntag
              frei, in der <strong className="text-text-primary">6-Tage-Woche</strong> meist nur der
              Sonntag. Danach ziehst du alle Wochenendtage ab, die in deinen Zeitraum fallen.
            </p>
            <p>
              Im dritten Schritt ber&uuml;cksichtigst du{" "}
              <strong className="text-text-primary">Feiertage</strong>. Ziehe nur die Feiertage ab,
              die auf einen Arbeitstag fallen. Entscheidend ist au&szlig;erdem das{" "}
              <strong className="text-text-primary">Bundesland</strong>, weil sich die gesetzlichen
              Feiertage je nach Region unterscheiden. Liegt ein Feiertag auf Samstag oder Sonntag,
              ver&auml;ndert er dein Ergebnis in der Regel nicht.
            </p>
            <p>
              Zum Schluss pr&uuml;fst du das Ergebnis: Rechne zuerst in{" "}
              <strong className="text-text-primary">vollen Wochen</strong> (z.&nbsp;B. 2&nbsp;Wochen
              = 10&nbsp;Arbeitstage bei 5-Tage-Woche) und erg&auml;nze dann die{" "}
              <strong className="text-text-primary">Resttage</strong>. So erkennst du schnell, ob die
              Berechnung logisch ist.
            </p>
          </div>

          {/* Mini-Beispiel */}
          <div className="bg-surface-secondary border border-border rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Mini-Beispiel: Arbeitstage im Zeitraum
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Du z&auml;hlst <strong className="text-text-primary">15&nbsp;Kalendertage</strong>{" "}
              (inklusive), ziehst <strong className="text-text-primary">4&nbsp;Wochenendtage</strong>{" "}
              ab und anschlie&szlig;end <strong className="text-text-primary">1&nbsp;Feiertag</strong>{" "}
              auf einem Werktag. Ergebnis: <strong className="text-accent">10&nbsp;Arbeitstage</strong>.
            </p>
          </div>

          {/* Checkliste */}
          <div className="bg-surface-secondary border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Checkliste: Arbeitstage im Zeitraum berechnen
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                "Zeitraum festlegen (Start/Ende)",
                "Z\u00e4hlregel kl\u00e4ren (inklusive/exklusive)",
                "Wochenenden definieren (Sa/So oder nur So)",
                "Arbeitswoche festlegen (5 oder 6 Tage)",
                "Feiertage ber\u00fccksichtigen (nur wenn sie auf Arbeitstage fallen)",
                "Bundesland w\u00e4hlen",
                "Ergebnischeck: volle Wochen + Resttage",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2b: Zählregeln
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage z&auml;hlen: Z&auml;hlregeln (inkl./exkl. Start- und Enddatum)
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-5">
            <p>
              Beim <strong className="text-text-primary">Arbeitstage z&auml;hlen</strong> ist die
              h&auml;ufigste Fehlerquelle die Z&auml;hlregel: Z&auml;hlst du den Starttag mit,
              den Endtag, oder beide? Wenn du Arbeitstage im Zeitraum berechnen willst, gilt in
              Projekten oft inkl./inkl., weil die Laufzeit &bdquo;von&ndash;bis&ldquo; gemeint ist.
              Bei Fristen wird teils abweichend gez&auml;hlt, etwa exkl./inkl. Wichtig: Weise die
              Z&auml;hlregel im Ergebnis immer aus. Das schafft Transparenz und verhindert Missverst&auml;ndnisse.
            </p>
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Z&auml;hlregeln &ndash; 2&nbsp;Beispiele:</strong>
            <ul className="mt-2 space-y-1">
              <li><strong className="text-text-primary">inkl./inkl.:</strong> Starttag z&auml;hlt mit, Endtag z&auml;hlt mit.</li>
              <li><strong className="text-text-primary">exkl./inkl.:</strong> Starttag z&auml;hlt nicht, Endtag z&auml;hlt mit.</li>
            </ul>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2c: Modelle Mo–Fr vs. Mo–Sa
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Berechnung Werktage: Mo&ndash;Fr vs. Mo&ndash;Sa
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              Bei der <strong className="text-text-primary">Berechnung von Werktagen</strong> nutzen
              Unternehmen und Beh&ouml;rden meist zwei Modelle.{" "}
              <strong className="text-text-primary">Modell&nbsp;A</strong> z&auml;hlt Montag bis
              Freitag. Das eignet sich f&uuml;r viele B&uuml;rojobs, interne Planungen und
              Projektzeitpl&auml;ne. <strong className="text-text-primary">Modell&nbsp;B</strong>{" "}
              z&auml;hlt Montag bis Samstag. Das spielt vor allem bei Fristen in Vertr&auml;gen oder
              in rechtlichen Kontexten eine Rolle.
            </p>
            <p>
              Wenn du Werktage berechnen m&ouml;chtest, wirkt sich die Wahl direkt auf das Ergebnis
              aus: Mit Samstag kommt <strong className="text-text-primary">pro Woche ein
              zus&auml;tzlicher Werktag</strong> hinzu. Ein Tagerechner f&uuml;r Werktage sollte
              daher beide Varianten anbieten, damit du Fristen und Zeitpl&auml;ne passend zum
              Anwendungsfall berechnest.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Modell</th>
                  <th className="text-center px-5 py-3 font-medium text-text-secondary">Tage/Woche</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Typische Nutzung</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Vorteil</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Nachteil</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 font-medium text-text-primary">A: Mo&ndash;Fr</td>
                  <td className="px-5 py-3 text-center text-text-secondary">5</td>
                  <td className="px-5 py-3 text-text-secondary">B&uuml;ro, Planung, Projekte</td>
                  <td className="px-5 py-3 text-text-secondary">Alltagstauglich</td>
                  <td className="px-5 py-3 text-text-secondary">Kann Fristen abweichen lassen, wenn Sa als Werktag z&auml;hlt</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-text-primary">B: Mo&ndash;Sa</td>
                  <td className="px-5 py-3 text-center text-text-secondary">6</td>
                  <td className="px-5 py-3 text-text-secondary">Vertrag, Recht, Fristen</td>
                  <td className="px-5 py-3 text-text-secondary">Fristnah</td>
                  <td className="px-5 py-3 text-text-secondary">Weniger passend f&uuml;r reine B&uuml;roplanung</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3: Feiertage richtig berücksichtigen
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Feiertage richtig ber&uuml;cksichtigen: Bundesland, regionale Feiertage und Sonderf&auml;lle
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-5">
            <p>
              Wenn du <strong className="text-text-primary">Arbeitstage berechnen</strong> willst,
              musst du Feiertage je Bundesland einplanen: In Deutschland sind Feiertage{" "}
              <strong className="text-text-primary">bundeslandspezifisch</strong>. Dadurch kann sich
              das Ergebnis je nach Standort unterscheiden &ndash; selbst bei identischem Zeitraum.
              W&auml;hle deshalb immer das passende Bundesland aus, zum Beispiel &uuml;ber die{" "}
              <Link href={`/feiertage/${new Date().getFullYear()}`} className="text-accent hover:underline">
                Feiertags&uuml;bersicht
              </Link>.
            </p>
            <p>
              Zieh nur die Feiertage ab, die in deinem Modell &uuml;berhaupt als Arbeitstag gelten:
            </p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-accent shrink-0">&bull;</span>
                <span><strong className="text-text-primary">Mo&ndash;Fr:</strong> Du ziehst nur Feiertage ab, die auf Montag bis Freitag fallen.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent shrink-0">&bull;</span>
                <span><strong className="text-text-primary">Mo&ndash;Sa:</strong> Zus&auml;tzlich k&ouml;nnen Feiertage am Samstag relevant sein.</span>
              </li>
            </ul>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-sm text-text-secondary leading-relaxed mb-5">
            <strong className="text-text-primary">Merke:</strong> Feiertage z&auml;hlen nur, wenn
            sie auf einen gez&auml;hlten Arbeitstag fallen. Bundesland ausw&auml;hlen &ndash; sonst
            stimmt das Ergebnis nicht.
          </div>

          <div className="text-text-secondary text-sm leading-relaxed space-y-2">
            <p><strong className="text-text-primary">Sonderf&auml;lle:</strong></p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-accent shrink-0">&bull;</span>
                <span>F&auml;llt ein Feiertag auf einen <strong className="text-text-primary">Sonntag</strong>, ziehst du nichts extra ab, weil der Tag ohnehin nicht z&auml;hlt.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent shrink-0">&bull;</span>
                <span>F&auml;llt ein Feiertag auf einen <strong className="text-text-primary">Samstag</strong>, wirkt er sich nur aus, wenn der Samstag in deinem Modell als Arbeitstag z&auml;hlt.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent shrink-0">&bull;</span>
                <span><strong className="text-text-primary">Br&uuml;ckentage</strong> sind keine Feiertage. Sie z&auml;hlen nur, wenn du sie separat als frei oder Urlaub eintr&auml;gst.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3b: Brückentage und Betriebsferien
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Br&uuml;ckentage und Betriebsferien: Z&auml;hlen sie als Arbeitstage?
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-5">
            <p>
              Ein <strong className="text-text-primary">Br&uuml;ckentag</strong> ist kein gesetzlicher
              Feiertag. Beim Arbeitstage berechnen im Zeitraum z&auml;hlt er daher zun&auml;chst als
              normaler Arbeitstag. Wird der Betrieb an diesem Tag geschlossen oder nimmst du Urlaub,
              wird der Tag f&uuml;r dich individuell zu &bdquo;frei&ldquo;. Dann solltest du ihn
              separat kennzeichnen, damit die Berechnung stimmt. F&uuml;r Rechner ist das am
              einfachsten, wenn du die Option <strong className="text-text-primary">zus&auml;tzliche
              freie Tage</strong> manuell abziehst.
            </p>
          </div>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Kurzcheck:</strong>
            <ul className="mt-2 space-y-1">
              <li>&bull; Br&uuml;ckentage/Betriebsferien im Ergebnis enthalten?</li>
              <li>&bull; Wenn nein: zus&auml;tzliche freie Tage abziehen</li>
              <li>&bull; Wenn ja: nichts &auml;ndern</li>
            </ul>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 4: Arbeitstage-Rechner (Widget + Anleitung)
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage-Rechner: Welche Eingaben du brauchst und wie du das Ergebnis pr&uuml;fst
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              Wenn du <strong className="text-text-primary">Arbeitstage berechnen</strong> m&ouml;chtest,
              brauchst du vier Angaben: <strong className="text-text-primary">Startdatum</strong>,{" "}
              <strong className="text-text-primary">Enddatum</strong>, ein{" "}
              <strong className="text-text-primary">Modell</strong> (Arbeitstage Mo&ndash;Fr oder
              Werktage Mo&ndash;Sa) und die passende{" "}
              <strong className="text-text-primary">Feiertagsregel</strong> nach Bundesland. W&auml;hle
              diese Optionen im Rechner klar aus &ndash; sonst stimmt das Ergebnis schnell nicht.
            </p>
          </div>

          {/* Eingabe-Tabelle */}
          <div className="overflow-x-auto rounded-xl border border-border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Eingabe</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Warum wichtig</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Typischer Fehler</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { eingabe: "Start- und Enddatum", warum: "Legt den Zeitraum fest", fehler: "Daten vertauscht oder falsche Z\u00e4hlweise" },
                  { eingabe: "Modell (Mo\u2013Fr / Mo\u2013Sa)", warum: "Bestimmt, welche Tage z\u00e4hlen", fehler: "Werktage gew\u00e4hlt, aber Mo\u2013Fr erwartet" },
                  { eingabe: "Bundesland / Feiertage", warum: "Zieht Feiertage korrekt ab", fehler: "Falsches Bundesland, regionale Feiertage fehlen" },
                  { eingabe: "Zus\u00e4tzliche freie Tage", warum: "Ber\u00fccksichtigt Teilzeit und Abwesenheiten", fehler: "Teilzeit-Tage nicht korrekt hinterlegt" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 font-medium text-text-primary">{row.eingabe}</td>
                    <td className="px-5 py-3 text-text-secondary">{row.warum}</td>
                    <td className="px-5 py-3 text-text-secondary">{row.fehler}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Optional kannst du eigene Arbeitstage festlegen, zum Beispiel Teilzeit Mo&ndash;Do.
            Dazu kommen zus&auml;tzliche freie Tage wie Betriebsferien oder Urlaub. Ein guter
            Rechner zeigt dir die Anzahl der Arbeitstage, die Wochenenden, die abgezogenen Feiertage
            und eine Feiertagsliste. F&uuml;r den schnellen Check hilft eine einfache Rechnung:{" "}
            <strong className="text-text-primary">volle Wochen &times; Arbeitstage pro Woche + Resttage</strong>.
          </p>

          {/* Rechner-Widget */}
          <ArbeitstageRechner />
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 4b: Typische Fehler
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Typische Fehler beim Arbeitstage berechnen (und wie du sie vermeidest)
          </h2>
          <p className="text-text-secondary leading-relaxed mb-5">
            Wenn du Arbeitstage berechnen willst, passieren oft dieselben Patzer. Nutze diese
            Checkliste, bevor du das Ergebnis &uuml;bernimmst:
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-5">
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                "Bundesland ausgew\u00e4hlt? Sonst stimmen die Feiertage nicht.",
                "Samstag korrekt behandelt? Werktag ist nicht immer Arbeitstag.",
                "Fallen Feiertage aufs Wochenende? Dann nicht zus\u00e4tzlich abziehen.",
                "Start- und Enddatum gepr\u00fcft? Z\u00e4hlst du inklusiv oder exklusiv, z.\u00a0B. bei Fristen.",
                "Teilzeit oder Schichtmodell ber\u00fccksichtigt? Sonst passt das Arbeitstage z\u00e4hlen nicht zur Praxis.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 5: Anwendungsfälle
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Anwendungsf&auml;lle: Wann du Arbeitstage oder Werktage brauchst
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-5">
            <p>
              In der <strong className="text-text-primary">Projektplanung</strong> rechnest du
              meist in Arbeitstagen. So planst du Kapazit&auml;ten realistisch und verteilst Aufgaben
              passend zu den Team-Schichten. Wenn du Arbeitstage berechnen willst, kl&auml;re vorher,
              ob Teilzeit, Schichtbetrieb oder feste freie Tage gelten. Sonst wirkt der Zeitplan
              schnell zu optimistisch.
            </p>
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-sm text-text-secondary leading-relaxed mb-5">
            <strong className="text-text-primary">Tipp:</strong> Vor der Berechnung immer kl&auml;ren,
            ob Arbeitstage oder Werktage gemeint sind.
          </div>
          <div className="text-text-secondary leading-relaxed space-y-3">
            <p>
              Bei <strong className="text-text-primary">Lieferzeiten</strong> und Service-Leveln steht
              oft &bdquo;Werktage&ldquo;. F&uuml;r die Berechnung von Werktagen musst du pr&uuml;fen,
              ob das Modell Mo&ndash;Fr oder Mo&ndash;Sa gemeint ist. Achte auch darauf, ob Feiertage
              am Lieferort z&auml;hlen oder ausgenommen sind.
            </p>
            <p>
              <strong className="text-text-primary">Urlaub und Abwesenheit</strong> h&auml;ngen von
              deiner Arbeitswoche und internen Regeln ab. Entscheidend ist, an welchen Tagen du laut
              Plan arbeiten w&uuml;rdest. So vermeidest du, dass ein Antrag zu viele oder zu wenige
              Tage abzieht.
            </p>
            <p>
              Bei <strong className="text-text-primary">Vertr&auml;gen und Fristen</strong> z&auml;hlt
              nur der Begriff im Dokument. Pr&uuml;fe &bdquo;Arbeitstage&ldquo; vs.
              &bdquo;Werktage&ldquo; und gleiche das mit deinem Kalender ab. F&uuml;r die Planung
              hilft dir auch der &Uuml;berblick zu{" "}
              <Link href="/arbeitstage-2026" className="text-accent hover:underline">
                Arbeitstage im Jahr 2026
              </Link>.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 6: Schnell-Anleitung zum Loslegen
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Arbeitstage berechnen: Schnell im Rechner ermitteln
          </h2>
          <div className="text-text-secondary leading-relaxed space-y-3 mb-5">
            <p>
              Wenn du <strong className="text-text-primary">Arbeitstage berechnen</strong> willst,
              klappt das in der Praxis in unter 30&nbsp;Sekunden. W&auml;hle zuerst den Zeitraum,
              entscheide dich dann f&uuml;r ein Arbeitszeitmodell und gib anschlie&szlig;end dein
              Bundesland an. Zum Schluss pr&uuml;fst du das Ergebnis und passt es bei Bedarf an.
              So berechnest du die Arbeitstage zeitraumgenau, ohne lange zu suchen.
            </p>
            <p>
              Wichtig: Der Rechner nutzt Standard-Annahmen wie die klassische 5-Tage-Woche. Arbeitest
              du in <strong className="text-text-primary">Teilzeit</strong> oder im{" "}
              <strong className="text-text-primary">Schichtbetrieb</strong>, stell deine Arbeitstage
              pro Woche einfach selbst ein. Du kannst au&szlig;erdem zus&auml;tzliche freie Tage
              abziehen, zum Beispiel feste Ruhetage oder geplante Ausgleichstage.
            </p>
            <p>
              Auch <strong className="text-text-primary">Urlaubstage</strong> und{" "}
              <strong className="text-text-primary">Br&uuml;ckentage</strong> lassen sich realistisch
              ber&uuml;cksichtigen, wenn du sie bereits kennst. So bleibt das Ergebnis nah an deinem
              tats&auml;chlichen Kalender. Wenn du direkt starten willst, kannst du auch{" "}
              <Link href="/datum-heute" className="text-accent hover:underline">
                vom heutigen Datum aus beginnen
              </Link>. Das spart Zeit, wenn du schnell &bdquo;ab heute bis &hellip;&ldquo; rechnen
              m&ouml;chtest.
            </p>
          </div>

          {/* 3-Schritte-Box */}
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              3&nbsp;Schritte im Rechner
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { step: "1", title: "Zeitraum w\u00e4hlen", desc: "Start- und Enddatum festlegen." },
                { step: "2", title: "Modell w\u00e4hlen", desc: "5-Tage, 6-Tage oder eigene Woche einstellen." },
                { step: "3", title: "Bundesland w\u00e4hlen", desc: "Feiertage automatisch ber\u00fccksichtigen und Ergebnis pr\u00fcfen." },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-surface-secondary border border-border rounded-xl p-4"
                >
                  <span className="text-accent font-bold text-lg">{item.step}</span>
                  <h4 className="font-medium text-text-primary text-sm mt-1 mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed">
            Jetzt fehlt nur noch ein Klick: Nutze den Arbeitstage-Rechner weiter oben, gib deine
            Daten ein und kontrolliere kurz, ob Teilzeit, Schichttage oder Sonderfrei korrekt
            abgebildet sind. Danach hast du sofort die Arbeitstage f&uuml;r deinen Zeitraum.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            CTA: Link zur Pillar Page
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 md:p-8 text-center">
            <h2 className="text-xl font-bold text-text-primary mb-3">
              Alle Arbeitstage {new Date().getFullYear()} im &Uuml;berblick
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-lg mx-auto">
              Vergleiche Arbeitstage aller 16 Bundesl&auml;nder und sieh die
              monatliche Aufschl&uuml;sselung inkl.&nbsp;Feiertage &ndash; n&uuml;tzlich
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

        {/* ═══════════════════════════════════════════════════════
            Abschlusstext
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <div className="text-text-secondary leading-relaxed space-y-3">
            <p>
              Wenn du <strong className="text-text-primary">Arbeitstage berechnen</strong> willst,
              entscheide zuerst sauber zwischen Arbeitstagen und Werktagen &ndash; und pr&uuml;fe
              dann konsequent <strong className="text-text-primary">Bundesland, Feiertage
              (inkl.&nbsp;regionaler Sonderf&auml;lle), Samstage und Teilzeit</strong>. Genau
              diese Stellschrauben machen am Ende den Unterschied zwischen &bdquo;passt
              ungef&auml;hr&ldquo; und &bdquo;stimmt wirklich&ldquo;.
            </p>
            <p>
              F&uuml;r schnelle, verl&auml;ssliche Ergebnisse nutz am besten den{" "}
              <strong className="text-text-primary">Arbeitstage-Rechner</strong> oben: Zeitraum
              eingeben, Einstellungen (Bundesland/Feiertage) kontrollieren und das Resultat kurz gegen
              deine Checkliste pr&uuml;fen. Starte jetzt mit deinem Zeitraum &ndash; und schau dir
              danach die passende{" "}
              <Link href={`/feiertage/${new Date().getFullYear()}`} className="text-accent hover:underline">
                Feiertags&uuml;bersicht
              </Link>{" "}
              sowie Tipps zur Urlaubs- oder Projektplanung an.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            FAQ
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufig gestellte Fragen
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
