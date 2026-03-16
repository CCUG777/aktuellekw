import type { Metadata } from "next";
import Link from "next/link";
import Tagerechner from "@/components/Tagerechner";
import {
  getCurrentKW,
  getDayOfYear,
  isLeapYear,
  formatDateDE,
} from "@/lib/kw";

export const revalidate = 3600;

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const title = "Tagerechner \u25b7 Tage zwischen zwei Daten berechnen | Kostenlos";
  const description =
    "Tagerechner von aktuellekw.de: Tage zwischen 2 Daten inkl./exkl. Start/Ende, Werktage vs. Kalendertage, +/\u2212 Tage & Countdown. Mit Fehler-Check.";
  const url = "https://aktuellekw.de/tagerechner";

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

/* ── FAQ data (8 Fragen aus MD) ────────────────────────────────── */
const pageFAQs = [
  {
    question: "Wie viele Tage sind zwischen zwei Daten?",
    answer:
      "Mit einem Tagerechner gibst du Startdatum und Enddatum ein und erh\u00e4ltst die Anzahl der Tage zwischen zwei Daten. Je nach Einstellung wird der Zeitraum inklusiv (Start- und Endtag z\u00e4hlen mit) oder exklusiv (nur die Tage dazwischen) berechnet. Achte darauf, ob du Kalendertage oder Werktage ausw\u00e4hlen willst.",
  },
  {
    question: "Z\u00e4hlt der Tagerechner den Starttag und Endtag mit?",
    answer:
      'Das h\u00e4ngt von der Z\u00e4hlweise im Tagerechner ab: inklusiv z\u00e4hlt Starttag und Endtag mit, exklusiv nicht. Viele Tagerechner online zeigen beide Varianten oder bieten einen Schalter f\u00fcr \u201EStart/Ende mitz\u00e4hlen\u201C. Pr\u00fcfe die Ergebnis-Logik, damit dein Ergebnis zu deinem Anwendungsfall passt.',
  },
  {
    question: "Wie berechne ich Werktage zwischen zwei Daten?",
    answer:
      'F\u00fcr Werktage zwischen zwei Daten nutzt du im Tagerechner die Option \u201EWerktage\u201C statt \u201EKalendertage\u201C. Dann werden in der Regel nur Montag bis Freitag gez\u00e4hlt, Wochenenden werden ausgeschlossen. Wenn du Feiertage ber\u00fccksichtigen willst, brauchst du zus\u00e4tzlich eine Feiertagsauswahl.',
  },
  {
    question: "Was ist der Unterschied zwischen Werktagen und Arbeitstagen?",
    answer:
      "Werktage sind meist Montag bis Samstag, also ohne Sonntag und oft ohne gesetzliche Feiertage. Arbeitstage sind die Tage, an denen du tats\u00e4chlich arbeitest, typischerweise Montag bis Freitag. Im Tagerechner kann das zu unterschiedlichen Ergebnissen f\u00fchren, je nachdem welche Definition genutzt wird.",
  },
  {
    question: "Kann ich Feiertage beim Tagerechner ber\u00fccksichtigen?",
    answer:
      "Ja, viele Tagerechner bieten eine Option, Feiertage in die Berechnung von Werktagen einzubeziehen. Daf\u00fcr w\u00e4hlst du meist ein Land oder Bundesland, damit die passenden Feiertage abgezogen werden. Ohne diese Auswahl z\u00e4hlt der Tagerechner oft nur Wochenenden heraus.",
  },
  {
    question: "Wie berechne ich ein Datum plus 30 Tage?",
    answer:
      'Im Tagerechner w\u00e4hlst du \u201EDatum plus Tage\u201C und gibst dein Startdatum sowie \u201E+30\u201C ein. Das Tool addiert 30 Kalendertage und zeigt dir das Zieldatum an. Achte darauf, ob der Starttag mitgez\u00e4hlt wird, falls der Rechner eine inkl./exkl.-Option anbietet.',
  },
  {
    question: "Wie viele Tage hat ein Jahr (Schaltjahr)?",
    answer:
      "Ein normales Jahr hat 365 Tage, ein Schaltjahr hat 366 Tage. Schaltjahre sorgen daf\u00fcr, dass der Kalender mit dem Sonnenjahr im Takt bleibt. Ein Tagerechner ber\u00fccksichtigt das automatisch, wenn du Tage zwischen zwei Daten berechnest.",
  },
  {
    question:
      'Warum zeigt Google bei \u201EAnzahl Tage berechnen\u201C manchmal ein anderes Ergebnis?',
    answer:
      "Unterschiede entstehen meist durch eine andere Z\u00e4hlweise: Google kann Start- und Enddatum anders ein- oder ausschlie\u00dfen als dein Tagerechner. Auch Zeitzonen, Uhrzeiten oder die Umrechnung von Tagen k\u00f6nnen abweichen. Vergleiche deshalb immer, ob inkl./exkl. Start-/Endtag und Kalendertage vs. Werktage gemeint sind.",
  },
];

/* ── Page Component ────────────────────────────────────────────── */
export default function TageBerechnenPage() {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const year = todayUTC.getUTCFullYear();
  const kw = getCurrentKW();
  const dayOfYear = getDayOfYear(todayUTC);
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const remainingDays = daysInYear - dayOfYear;

  // Days until Christmas
  const christmas = new Date(Date.UTC(year, 11, 25));
  const daysUntilChristmas = Math.ceil(
    (christmas.getTime() - todayUTC.getTime()) / 86_400_000
  );

  // Days until New Year
  const newYear = new Date(Date.UTC(year + 1, 0, 1));
  const daysUntilNewYear = Math.ceil(
    (newYear.getTime() - todayUTC.getTime()) / 86_400_000
  );

  // JSON-LD
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://aktuellekw.de/tagerechner#breadcrumb",
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
          name: "Tagerechner",
          item: "https://aktuellekw.de/tagerechner",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": "https://aktuellekw.de/tagerechner#webapp",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      publisher: { "@id": "https://aktuellekw.de/#organization" },
      datePublished: "2026-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      name: "Tagerechner \u2013 Tage zwischen zwei Daten berechnen",
      url: "https://aktuellekw.de/tagerechner",
      applicationCategory: "UtilityApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      inLanguage: "de-DE",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://aktuellekw.de/tagerechner#faqpage",
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
          <span className="text-text-primary">Tagerechner</span>
        </nav>

        {/* ═════════════════════════════════════════════════════════
            HERO: H1 + Intro
            ═════════════════════════════════════════════════════════ */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Tagerechner online: Tage zwischen zwei Daten berechnen (inkl. Werktage &amp; Datum plus Tage)
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Mit einem <strong className="text-text-primary">Tagerechner</strong>{" "}
            findest du in Sekunden heraus, wie viele{" "}
            <strong className="text-text-primary">Tage zwischen zwei Daten</strong>{" "}
            liegen &ndash; oder welches Datum du erreichst, wenn du X Tage
            addierst bzw. abziehst. Besonders praktisch: Du kannst zwischen{" "}
            <strong className="text-text-primary">Kalendertagen</strong> (alle Tage)
            und <strong className="text-text-primary">Werktagen</strong> (Mo&ndash;Fr)
            w&auml;hlen.
          </p>
          <p>
            Heute ist der{" "}
            <strong className="text-text-primary">{formatDateDE(todayUTC)}</strong>{" "}
            (KW&nbsp;{kw.weekNumber}) &ndash; Tag {dayOfYear} von {daysInYear} im
            Jahr {year}.
            {remainingDays > 0 && (
              <> Es verbleiben noch {remainingDays} Tage bis Jahresende.</>
            )}
          </p>
        </div>

        {/* ── InfoBox: Schnellstart ───────────────────────────── */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
            Schnellstart
          </p>
          <div className="text-sm text-text-secondary space-y-1">
            <p>1) Startdatum und Enddatum eingeben.</p>
            <p>
              2) Z&auml;hlweise w&auml;hlen: Start-/Enddatum{" "}
              <strong className="text-text-primary">inklusive oder exklusive</strong>.
            </p>
            <p>
              3) Optional auf{" "}
              <strong className="text-text-primary">Werktage</strong> umstellen
              (Feiertage ggf. separat beachten).
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Tipp: Wenn du erst pr&uuml;fen willst, welches Datum heute ist &rarr;{" "}
              <Link href="/datum-heute" className="text-accent hover:underline">
                Datum heute
              </Link>
            </p>
          </div>
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Tag im Jahr", value: `${dayOfYear}/${daysInYear}` },
            { label: "Bis Jahresende", value: `${remainingDays} Tage` },
            {
              label: "Bis Weihnachten",
              value:
                daysUntilChristmas > 0
                  ? `${daysUntilChristmas} Tage`
                  : daysUntilChristmas === 0
                  ? "Heute!"
                  : "vorbei",
            },
            {
              label: "Bis Silvester",
              value: `${daysUntilNewYear} Tage`,
            },
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
            SECTION 1: Tagerechner Tool
            ═════════════════════════════════════════════════════════ */}
        <Tagerechner />

        {/* ═════════════════════════════════════════════════════════
            SECTION 2: Tagerechner – so funktioniert es
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tagerechner: Tage zwischen zwei Daten berechnen (so funktioniert es)
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Tagerechner</strong> (auch{" "}
              <strong className="text-text-primary">Datumsrechner</strong> oder{" "}
              <strong className="text-text-primary">Tagez&auml;hler</strong>) ist
              ein Tool, mit dem du Zeitspannen schnell bestimmen kannst. Du
              kannst damit <strong className="text-text-primary">Tage berechnen</strong>,
              ohne selbst im Kalender zu springen. Das ist praktisch f&uuml;r
              Urlaube, Fristen oder Projektlaufzeiten.
            </p>
            <p>
              Du gibst ein <strong className="text-text-primary">Startdatum</strong> und
              ein Enddatum ein. Danach w&auml;hlst du die Z&auml;hlweise: Soll
              der Starttag mitz&auml;hlen, der Endtag oder beide? Als Ergebnis
              bekommst du die <strong className="text-text-primary">Anzahl Kalendertage</strong>.
              Viele Tools zeigen zus&auml;tzlich Wochen oder Monate als
              Orientierung.
            </p>
          </div>

          {/* Inklusive vs. Exklusive Zählung */}
          <h3 className="text-lg font-semibold mt-6 mb-3 text-text-primary">
            Z&auml;hlt der Tagerechner Start- und Enddatum mit? (inklusive vs. exklusive Z&auml;hlung)
          </h3>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Beim <strong className="text-text-primary">Anzahl Tage berechnen</strong> gibt
              es zwei g&auml;ngige Z&auml;hlweisen: Exklusiv z&auml;hlt nur die
              Differenz der Kalendertage. Inklusiv z&auml;hlt Start- und
              Enddatum mit. Beispiel: 01.03. bis 02.03. sind{" "}
              <strong className="text-text-primary">1 Tag</strong> (exklusiv),
              aber <strong className="text-text-primary">2 Tage</strong> (inklusiv).
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Datum A</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Datum B</th>
                  <th className="px-4 py-3 text-right font-semibold text-text-primary">Exklusiv</th>
                  <th className="px-4 py-3 text-right font-semibold text-text-primary">Inklusiv</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { a: "01.03.", b: "02.03.", ex: 1, inc: 2 },
                  { a: "10.04.", b: "10.04.", ex: 0, inc: 1 },
                  { a: "28.02.", b: "01.03.", ex: 2, inc: 3 },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-2.5 text-text-secondary">{row.a}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{row.b}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-text-primary">{row.ex}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-accent">{row.inc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 3: Typische Anwendungsfälle
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tage zwischen zwei Daten berechnen: Beispiele f&uuml;r typische Anwendungsf&auml;lle
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Bei <strong className="text-text-primary">Projektlaufzeiten</strong> legst
              du Start und Ende fest und l&auml;sst dir die{" "}
              <strong className="text-text-primary">Anzahl Tage berechnen</strong>. Das ist
              praktisch f&uuml;r Meilensteine, K&uuml;ndigungsfristen oder
              Lieferzeiten. F&uuml;r eine saubere Wochenplanung kannst du
              parallel{" "}
              <Link href="/kalender-mit-wochen" className="text-accent hover:underline">
                im Kalender mit Wochen planen
              </Link>.
            </p>
            <p>
              Bei der <strong className="text-text-primary">Reiseplanung</strong> z&auml;hlt
              oft nicht nur der Zeitraum von Abreise bis R&uuml;ckreise.{" "}
              <strong className="text-text-primary">Tage z&auml;hlen</strong> meint
              meist Kalendertage, w&auml;hrend N&auml;chte etwas anderes sind.
              Beispiel: Abreise Montag, R&uuml;ckreise Mittwoch = 3 Tage,
              aber nur 2 N&auml;chte.
            </p>
            <p>
              Bei <strong className="text-text-primary">beh&ouml;rdlichen Fristen</strong> gilt:
              Das Tool liefert rechnerische Tage. Gesetzliche Fristenregeln
              (z.&nbsp;B. BGB oder Verwaltungsrecht) k&ouml;nnen abweichen,
              etwa bei Fristbeginn nach Zustellung.
            </p>
          </div>

          {/* Checkliste */}
          <h3 className="text-lg font-semibold mt-6 mb-3 text-text-primary">
            Vor dem Rechnen pr&uuml;fen
          </h3>
          <div className="space-y-2">
            {[
              "Zählweise: Start/Ende inklusiv oder exklusiv?",
              "Zeitzone/Ort bei internationalen Fällen?",
              "Fristregel relevant (Werktage, Zustellung, Ablauf)?",
              "Wochenende/Feiertage berücksichtigen?",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                <span className="text-accent shrink-0 mt-0.5">&#9745;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 4: Werktage statt Kalendertage
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tagerechner Werktage: Werktage statt Kalendertage berechnen
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Mit einem <strong className="text-text-primary">Tagerechner Werktage</strong>{" "}
              z&auml;hlst du nicht einfach Kalendertage, sondern nur Tage, die
              als <strong className="text-text-primary">Werktage</strong> gelten.
              In Deutschland sind das in der Regel{" "}
              <strong className="text-text-primary">Montag bis Samstag</strong>. Das
              unterscheidet sich von{" "}
              <strong className="text-text-primary">Arbeitstagen</strong>, die in
              vielen Unternehmen nur von{" "}
              <strong className="text-text-primary">Montag bis Freitag</strong> z&auml;hlen.
            </p>
          </div>

          {/* Zählarten-Tabelle */}
          <div className="overflow-x-auto rounded-xl border border-border mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Z&auml;hlart</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Was wird gez&auml;hlt?</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Kurz erkl&auml;rt</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Kalendertage", what: "Mo\u2013So", desc: "Jeder Tag z\u00e4hlt, auch Sonntag." },
                  { type: "Arbeitstage", what: "Mo\u2013Fr", desc: "Wochenenden fallen weg, passend f\u00fcr typische B\u00fcrozeiten." },
                  { type: "Werktage", what: "Mo\u2013Sa", desc: "Samstag z\u00e4hlt mit, Sonntag nicht." },
                  { type: "Mit Feiertagen", what: "je nach Auswahl", desc: "Feiertage werden zus\u00e4tzlich abgezogen, abh\u00e4ngig vom Bundesland." },
                ].map((row) => (
                  <tr key={row.type} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-2.5 font-medium text-text-primary">{row.type}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{row.what}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Feiertage Subsection */}
          <h3 className="text-lg font-semibold mt-6 mb-3 text-text-primary">
            Feiertage ber&uuml;cksichtigen: Warum das Ergebnis je nach Bundesland variiert
          </h3>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Feiertage sind regional verschieden. Darum kann sich das Ergebnis
              beim <strong className="text-text-primary">Werktage berechnen</strong> je
              nach Bundesland &auml;ndern. Unterst&uuml;tzt das Tool keine
              Feiertage, werden meist nur Wochenenden abgezogen. F&uuml;r eine
              &Uuml;bersicht der gesetzlichen Feiertage schau dir die{" "}
              <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
                Feiertage {year}
              </Link>{" "}
              an.
            </p>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mt-3">
            <p className="text-sm text-text-secondary">
              <strong className="text-accent">Tipp:</strong> Feiertage sind je nach
              Bundesland unterschiedlich &ndash; w&auml;hle dein Bundesland,
              wenn du Werktage exakt brauchst.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 5: Datum plus/minus Tage
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum plus/minus Tage: Tagerechner f&uuml;r ein Zieldatum berechnen
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Wenn du ein <strong className="text-text-primary">Zieldatum</strong> brauchst,
              hilft dir ein <strong className="text-text-primary">Datum plus Tage</strong>-Rechner
              sofort weiter. Typische Beispiele sind{" "}
              <strong className="text-text-primary">Datum + 30 Tage</strong> f&uuml;r
              Zahlungsfristen oder{" "}
              <strong className="text-text-primary">Datum &minus; 14 Tage</strong> f&uuml;r
              die R&uuml;ckw&auml;rtsplanung.
            </p>
            <p>
              Auch Monatswechsel und{" "}
              <Link href="/schaltjahr" className="text-accent hover:underline">
                Schaltjahre
              </Link>{" "}
              erledigt der Rechner automatisch: unterschiedliche
              Monatsl&auml;ngen und der 29.&nbsp;Februar werden korrekt
              mitgerechnet.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Startdatum</th>
                  <th className="px-4 py-3 text-right font-semibold text-text-primary">&plusmn; Tage</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Ergebnisdatum</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { start: "10.03.2026", delta: "+ 30", result: "09.04.2026" },
                  { start: "01.02.2024", delta: "+ 30", result: "02.03.2024" },
                  { start: "20.12.2026", delta: "+ 20", result: "09.01.2027" },
                  { start: "15.01.2026", delta: "\u2212 14", result: "01.01.2026" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-2.5 text-text-secondary">{row.start}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-accent">{row.delta}</td>
                    <td className="px-4 py-2.5 font-medium text-text-primary">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 6: Countdown – Wie viele Tage bis ...
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Countdown: Wie viele Tage bis Weihnachten, Urlaub oder Rente?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              &bdquo;<strong className="text-text-primary">Wie viele Tage bis</strong> &hellip;?&ldquo;
              ist eine der h&auml;ufigsten Fragen rund um Datumsrechner. Du
              w&auml;hlst einfach ein Ziel-Datum aus und l&auml;sst die
              Differenz ab heute berechnen. So siehst du sofort, wie viele{" "}
              <strong className="text-text-primary">Tage bis Weihnachten</strong> noch
              bleiben oder wie lange es bis zum Jahreswechsel dauert.
            </p>
            <p>
              Auch ein <strong className="text-text-primary">Tagerechner bis zur Rente</strong>{" "}
              ist praktisch, wenn du deinen Rentenbeginn als Datum kennst. Du
              kannst dir das Ergebnis nicht nur in Tagen, sondern auch in Wochen
              anzeigen lassen.
            </p>
          </div>

          {/* Countdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Tage bis Weihnachten
              </p>
              <p className="text-3xl font-bold text-accent">
                {daysUntilChristmas > 0
                  ? daysUntilChristmas
                  : daysUntilChristmas === 0
                  ? "Heute!"
                  : "\u2013"}
              </p>
              <p className="text-text-secondary text-xs mt-1">25.12.{year}</p>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Tage bis Silvester
              </p>
              <p className="text-3xl font-bold text-accent">{daysUntilNewYear}</p>
              <p className="text-text-secondary text-xs mt-1">01.01.{year + 1}</p>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Verbleibend im Jahr
              </p>
              <p className="text-3xl font-bold text-accent">{remainingDays}</p>
              <p className="text-text-secondary text-xs mt-1">
                von {daysInYear} Tagen ({year})
              </p>
            </div>
          </div>

          {/* Schaltjahr-Hinweis */}
          <h3 className="text-lg font-semibold mt-6 mb-3 text-text-primary">
            Tagerechner {year} und andere Jahre: Schaltjahr pr&uuml;fen (365 oder 366 Tage)
          </h3>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Wenn du mit dem <strong className="text-text-primary">Tagerechner {year}</strong>{" "}
              rechnest, pr&uuml;fe kurz, ob das Jahr ein{" "}
              <Link href="/schaltjahr" className="text-accent hover:underline">
                Schaltjahr
              </Link>{" "}
              ist. {year} ist{" "}
              {isLeapYear(year) ? (
                <>
                  ein <strong className="text-text-primary">Schaltjahr</strong> mit 366 Tagen
                </>
              ) : (
                <>
                  <strong className="text-text-primary">kein Schaltjahr</strong> und hat 365 Tage
                </>
              )}
              . Das kann dein Ergebnis um einen Tag verschieben,
              besonders wenn der Zeitraum &uuml;ber den Februar l&auml;uft.
            </p>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mt-3">
            <p className="text-sm text-text-secondary">
              <strong className="text-accent">Schaltjahr-Regel:</strong> Ein Jahr
              ist Schaltjahr, wenn es durch 4 teilbar ist. Ausnahme:
              Jahrhundertjahre z&auml;hlen nur dann, wenn sie durch 400 teilbar
              sind. Beispiele: 2024 = Schaltjahr, 1900 = kein Schaltjahr.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 7: Tagerechner mit Stunden
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tagerechner mit Stunden: Wann reicht &bdquo;Tage z&auml;hlen&ldquo; nicht aus?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Wenn du <strong className="text-text-primary">Tage berechnen</strong> m&ouml;chtest,
              reichen oft ganze Kalendertage. Sobald jedoch Uhrzeiten eine Rolle
              spielen, wird das reine Tagez&auml;hlen schnell ungenau. Dann hilft
              ein <strong className="text-text-primary">Tagerechner Stunden</strong> oder
              Zeitrechner, der auch Minuten sauber ber&uuml;cksichtigt.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Zeitraum</th>
                  <th className="px-4 py-3 text-right font-semibold text-text-primary">Kalendertage</th>
                  <th className="px-4 py-3 text-right font-semibold text-text-primary">Dauer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: "23:00 bis 01:00 (\u00fcber Mitternacht)", days: "2", dur: "2 Stunden" },
                  { range: "08:30 bis 17:15 (gleicher Tag)", days: "1", dur: "8:45 Stunden" },
                  { range: "Fr 22:00 bis Sa 06:00", days: "2", dur: "8 Stunden" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-2.5 text-text-secondary">{row.range}</td>
                    <td className="px-4 py-2.5 text-right text-text-primary font-medium">{row.days}</td>
                    <td className="px-4 py-2.5 text-right text-accent font-medium">{row.dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-3">
            Wenn die Uhrzeit relevant ist, nutze einen Zeitrechner. So
            bekommst du die echte Dauer statt nur betroffene Kalendertage.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 8: Online vs. App
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tagerechner online kostenlos vs. App: Was ist besser?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Tagerechner online</strong> ist
              ideal, wenn du sofort starten willst. Du brauchst keine
              Installation und kannst den{" "}
              <strong className="text-text-primary">Tagerechner kostenlos</strong> im
              Browser nutzen. Eine Tagerechner App passt besser, wenn du oft
              rechnest, unterwegs bist oder offline bleiben willst.
            </p>
          </div>

          <div className="space-y-2 mt-4">
            {[
              "Online reicht, wenn: du selten rechnest, schnell am PC bist, nichts installieren willst.",
              "App lohnt sich, wenn: du häufig rechnest, offline arbeiten willst, Widgets brauchst.",
              "Datenschutz: prüfe Tracker, App-Berechtigungen, Analytics und ob Daten lokal bleiben.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                <span className="text-accent shrink-0 mt-0.5">&#9745;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 9: Häufige Fehler
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            H&auml;ufige Fehler beim Tage berechnen (und wie du sie vermeidest)
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Der h&auml;ufigste Fehler ist die{" "}
              <strong className="text-text-primary">inklusive vs. exklusive Z&auml;hlung</strong>.
              Frag dich klar: Z&auml;hlst du Start- und Enddatum mit, oder nur
              die Tage dazwischen? Ebenso typisch: Werktage, Arbeitstage und
              Wochenenden werden verwechselt.
            </p>
            <p>
              Wenn Uhrzeiten wichtig sind, reichen reine Tage nicht. Bei Fristen,
              Reisen oder internationalen Terminen k&ouml;nnen Uhrzeit und
              Zeitzone einen Tag Unterschied machen. Mehr Klarheit bekommst du in
              den{" "}
              <Link href="/faq" className="text-accent hover:underline">
                Antworten auf h&auml;ufige Fragen
              </Link>.
            </p>
          </div>

          {/* Fehler-Quickfix Box */}
          <div className="bg-surface-secondary border border-border rounded-xl p-5 mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Fehler-Quickfix
            </p>
            <div className="space-y-2">
              {[
                "Inklusiv/Exklusiv verwechselt: Lege fest, ob Start- und Enddatum mitgezählt werden.",
                "Werktage vs. Kalendertage: Entscheide, ob Wochenenden mit drin sind.",
                "Feiertage ignoriert: Wähle das richtige Bundesland und rechne Feiertage ein.",
                "Uhrzeit/Zeitzone vergessen: Nutze Stundenangaben, wenn ein Tageswechsel relevant ist.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                  <span className="text-red-400 shrink-0 mt-0.5">&bull;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 10: CTA – Jetzt Tage berechnen
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tagerechner nutzen: Jetzt Tage berechnen und Ergebnis speichern
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Nutze unseren <strong className="text-text-primary">Tagerechner</strong>{" "}
              direkt oben im Browser: Setze{" "}
              <strong className="text-text-primary">Startdatum</strong> und{" "}
              <strong className="text-text-primary">Enddatum</strong> und w&auml;hle die
              passenden Optionen. So berechnest du Zeitr&auml;ume schnell und
              nachvollziehbar &ndash; z.&nbsp;B. f&uuml;r Urlaubsplanung,
              K&uuml;ndigungsfristen, Liefertermine oder interne
              Projektfristen.
            </p>
            <p>
              F&uuml;r rechtliche Fristen gilt: Ein Tool liefert dir die
              rechnerische Basis, ma&szlig;geblich sind aber immer die jeweiligen
              Regelungen. Probier den <strong className="text-text-primary">Tagerechner</strong>{" "}
              jetzt aus und pr&uuml;fe dein Ergebnis direkt mit einem zweiten
              Szenario (Kalendertage vs. Werktage).
            </p>
          </div>

          {/* Nach dem Rechnen Checkliste */}
          <h3 className="text-lg font-semibold mt-6 mb-3 text-text-primary">
            Nach dem Rechnen
          </h3>
          <div className="space-y-2">
            {[
              "Ergebnis kurz prüfen und den Zeitraum im Kalender gegenchecken.",
              "Zählweise festhalten: inkl. oder exkl. Start-/Enddatum.",
              "Werktage aktivieren, wenn nur Arbeitstage zählen sollen.",
              "Screenshot, Kopie oder Ausdruck fürs Archiv sichern.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                <span className="text-accent shrink-0 mt-0.5">&#9745;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 11: FAQ (8 Fragen)
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufig gestellte Fragen zum Tagerechner
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

        {/* ── Fazit-Box ───────────────────────────────────────── */}
        <div className="mt-14 bg-surface-secondary border border-border rounded-xl p-5">
          <p className="text-text-secondary text-sm leading-relaxed">
            Mit einem <strong className="text-text-primary">Tagerechner</strong> berechnest
            du schnell die Tage zwischen zwei Daten &ndash; wahlweise als
            Kalendertage oder als Werktage. Ebenso praktisch:{" "}
            <strong className="text-text-primary">Datum plus/minus Tage</strong> f&uuml;r
            ein Zieldatum und ein Countdown bis Weihnachten, Urlaub oder
            Rente. Achte dabei auf die Z&auml;hlweise (Start-/Enddatum inkl.
            oder exkl.), denn genau hier passieren die h&auml;ufigsten Fehler.
          </p>
        </div>

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/datum-heute" className="text-accent hover:underline">
            Datum heute &rarr;
          </Link>
          <Link href="/kalender-mit-wochen" className="text-accent hover:underline">
            Kalender mit Wochen &rarr;
          </Link>
          <Link href="/schaltjahr" className="text-accent hover:underline">
            Schaltjahr &rarr;
          </Link>
          <Link href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {year} &rarr;
          </Link>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
            Feiertage {year} &rarr;
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
 * SEO Audit Checklist – app/tagerechner/page.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Tagerechner ▷ Tage zwischen zwei Daten berechnen | Kostenlos"
 * [x] Meta Description: aus tagerechner.md übernommen
 * [x] Canonical URL: https://aktuellekw.de/tagerechner
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Tagerechner online: Tage zwischen zwei Daten berechnen"
 * [x] Schema.org: BreadcrumbList (2 Ebenen)
 * [x] Schema.org: WebApplication (kostenloser Tagerechner)
 * [x] Schema.org: FAQPage (8 Fragen)
 * [x] InfoBox Schnellstart
 * [x] Stats Row (Tag im Jahr, bis Weihnachten, bis Silvester)
 * [x] Interaktiver Tagerechner (Client Component)
 * [x] So funktioniert es + inkl./exkl. Tabelle
 * [x] Typische Anwendungsfälle + Checkliste
 * [x] Werktage vs. Kalendertage + Zählarten-Tabelle
 * [x] Feiertage berücksichtigen (Bundesland-Hinweis)
 * [x] Datum plus/minus Tage + Beispiel-Tabelle
 * [x] Countdown (Weihnachten, Silvester, Jahresende) + Schaltjahr
 * [x] Tagerechner mit Stunden + Tabelle
 * [x] Online vs. App + Checkliste
 * [x] Häufige Fehler + Fehler-Quickfix Box
 * [x] CTA: Jetzt Tage berechnen + Nach-dem-Rechnen Checkliste
 * [x] Fazit-Box
 * [x] FAQ (8 Fragen) aus tagerechner.md
 * [x] Cross-Links: datum-heute, kalender-mit-wochen, schaltjahr,
 *     kalenderwoche, feiertage, faq
 * [x] Content aus tagerechner.md vollständig integriert
 */
