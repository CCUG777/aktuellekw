import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBundeslaenderArbeitstage,
  getWerktageImJahr,
  getArbeitstageForBundesland,
} from "@/lib/arbeitstage";
import { CONTENT_YEARS } from "@/lib/constants";
import AuthorByline from "@/components/AuthorByline";

export const revalidate = 86400;

export function generateStaticParams() {
  return CONTENT_YEARS.map((year) => ({ year: String(year) }));
}

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  if (isNaN(year)) notFound();

  const title = `Arbeitstage ${year}: Gesamtzahl + Tabellen je Bundesland`;
  const description = `Arbeitstage ${year} sofort: Gesamtzahl (5-Tage-Woche) plus Tabellen nach Monat & Bundesland. Mit Rechenanleitung, Stunden-Umrechnung & Steuer-Kontext.`;
  const url = `https://aktuellekw.de/arbeitstage/${year}`;

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
function getPageFAQs(werktageGesamt: number, year: number) {
  return [
    {
      question: `Wie viele Arbeitstage gibt es im Jahr ${year}?`,
      answer: `Bei einer 5-Tage-Woche hat das Jahr ${year} in Deutschland ${werktageGesamt} Werktage (Mo\u2013Fr, ohne Feiertage). Die genaue Zahl der Arbeitstage kann je Bundesland abweichen, weil gesetzliche Feiertage regional unterschiedlich sind. In den Tabellen nach Monat und Bundesland siehst du die Abweichungen auf einen Blick.`,
    },
    {
      question: `Wie viele Arbeitstage sind bei der 5-Tage-Woche ${year}?`,
      answer: `Bei der 5-Tage-Woche (Montag bis Freitag) kommst du ${year} auf ${werktageGesamt} Werktage, bevor du regionale Feiertage abziehst. Je nach Bundesland sinkt die Zahl, wenn zus\u00E4tzliche Feiertage auf Werktage fallen. F\u00FCr eine exakte Zahl nutze die Tabelle nach Bundesland und Monat.`,
    },
    {
      question: `Warum unterscheiden sich die Arbeitstage ${year} je Bundesland?`,
      answer: `Die Arbeitstage ${year} unterscheiden sich je Bundesland, weil nicht alle gesetzlichen Feiertage bundesweit gelten. Au\u00DFerdem f\u00E4llt ein Feiertag je nach Wochentag mal auf einen Arbeitstag und mal aufs Wochenende, was die Zahl der Arbeitstage ver\u00E4ndert. Deshalb sind Monats- und Bundesland-Tabellen wichtig f\u00FCr die genaue Planung.`,
    },
    {
      question: `Wie berechne ich Arbeitstage ${year} mit Urlaub und Krankheit?`,
      answer: `Du berechnest deine Arbeitstage ${year}, indem du von den Werktagen (Mo\u2013Fr) zuerst die Feiertage in deinem Bundesland abziehst und danach deine Urlaubstage und Kranktage. Wichtig: Z\u00E4hle nur Tage, die sonst Arbeitstage w\u00E4ren. So bekommst du deine tats\u00E4chlichen Anwesenheitstage ${year}.`,
    },
    {
      question: `Wie viele Arbeitstage pro Jahr hat man bei 100% (Vollzeit)?`,
      answer: `Bei 100% (Vollzeit) h\u00E4ngt die Zahl der Arbeitstage pro Jahr von deinem Arbeitsmodell ab, meist 5-Tage-Woche. F\u00FCr ${year} sind das als Basis ${werktageGesamt} Werktage (Mo\u2013Fr), von denen du dann Feiertage (Bundesland), Urlaub und ggf. Krankheit abziehst.`,
    },
    {
      question: `Wie viele Arbeitstage setzt man bei der Steuererkl\u00E4rung an?`,
      answer: `F\u00FCr die Steuererkl\u00E4rung setzt du die Arbeitstage an, an denen du tats\u00E4chlich zur Arbeit gefahren bist (Pendeltage). Zieh also Homeoffice-Tage, Urlaub, Krankheit und Feiertage ab. Viele Finanz\u00E4mter akzeptieren bei Vollzeit h\u00E4ufig rund 230 Tage als plausiblen Richtwert.`,
    },
    {
      question: "Wie rechne ich Stunden in Arbeitstage um?",
      answer: "Um Stunden in Arbeitstage umzurechnen, teilst du die Stunden durch deine t\u00E4gliche Arbeitszeit laut Vertrag (z.\u00A0B. 8 Stunden = 1 Arbeitstag). Bei Teilzeit nimmst du deine individuelle Tagesarbeitszeit, nicht einen Standardwert.",
    },
    {
      question: `Wo finde ich eine Arbeitstage-${year}-Tabelle zum Ausdrucken (PDF/Excel)?`,
      answer: `Eine Arbeitstage-${year}-Tabelle zum Ausdrucken findest du auf dieser Seite als Monats- und Bundesland-\u00DCbersicht. Nutze die Druckfunktion deines Browsers oder exportiere die Daten. Achte darauf, dass die Tabelle Arbeitstage nach Monat und Bundesland ausweist, damit Feiertage korrekt ber\u00FCcksichtigt sind.`,
    },
  ];
}

/* ── Page Component ────────────────────────────────────────────── */
export default async function ArbeitstageYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  if (isNaN(year) || year < 2020 || year > 2035) notFound();

  const allBL = getAllBundeslaenderArbeitstage(year);
  const werktageGesamt = getWerktageImJahr(year);
  const pageFAQs = getPageFAQs(werktageGesamt, year);

  // NRW monthly example (most populous state)
  const nrw = getArbeitstageForBundesland(year, "NW");
  // Hamburg ≈ bundesweit (only nationwide public holidays)
  const hh = getArbeitstageForBundesland(year, "HH");

  // Min/Max Arbeitstage across all BL
  const minAT = allBL[allBL.length - 1];
  const maxAT = allBL[0];

  // JSON-LD @graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://aktuellekw.de/arbeitstage/${year}#breadcrumb`,
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
            name: `Arbeitstage ${year}`,
            item: `https://aktuellekw.de/arbeitstage/${year}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `https://aktuellekw.de/arbeitstage/${year}#faqpage`,
        inLanguage: "de-DE",
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
      {
        "@type": "Dataset",
        "@id": `https://aktuellekw.de/arbeitstage/${year}#dataset`,
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        datePublished: `${year}-01-01`,
        dateModified: year === new Date().getFullYear() ? new Date().toISOString().split("T")[0] : `${year}-01-01`,
        name: `Arbeitstage ${year} Deutschland`,
        description: `Arbeitstage ${year} f\u00fcr alle 16 Bundesl\u00e4nder mit monatlicher Aufschl\u00fcsselung`,
        temporalCoverage: `${year}-01-01/${year}-12-31`,
        creator: {
          "@type": "Organization",
          "@id": "https://aktuellekw.de/#organization",
          name: "aktuellekw.de",
          url: "https://aktuellekw.de",
        },
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
    ],
  };

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
          <span className="text-text-primary">Arbeitstage {year}</span>
        </nav>

        {/* ── H1 + Intro ────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Arbeitstage {year}: Anzahl pro Bundesland und Monat + Rechner &amp; Steuer-Hinweise
        </h1>

        <div className="text-sm text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Die <strong className="text-text-primary">Arbeitstage {year}</strong> liegen in Deutschland
            (bei der typischen 5-Tage-Woche) je nach Bundesland bei{" "}
            <strong className="text-text-primary">rund {minAT.arbeitstageJahr} bis {maxAT.arbeitstageJahr} Arbeitstagen</strong> &ndash;
            denn gesetzliche Feiertage fallen nicht &uuml;berall gleich und wirken sich direkt auf deine
            Jahreszahl aus. Als Arbeitstage z&auml;hlen grunds&auml;tzlich <strong className="text-text-primary">Montag
            bis Freitag</strong>, Wochenenden sind raus, Feiertage werden abgezogen, wenn sie auf einen Werktag fallen.
          </p>
          <p>
            Damit du nicht zwischen Kalendern, Tabellen und Excel hin- und herspringen musst, bekommst du hier
            alles geb&uuml;ndelt: die Gesamtzahl auf einen Blick, <strong className="text-text-primary">Tabellen
            nach Monat</strong> sowie <strong className="text-text-primary">nach Bundesland und Monat</strong>,
            plus eine klare <strong className="text-text-primary">Rechenanleitung</strong> (inkl. Urlaubs- und Krankheitstagen).
            Au&szlig;erdem findest du praktische <strong className="text-text-primary">Umrechnungen von Stunden&nbsp;&harr;&nbsp;Arbeitstagen</strong> und
            hilfreiche <strong className="text-text-primary">Steuer-Hinweise</strong>.
          </p>
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

        {/* ═══ Kurzantwort-Box ═══ */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-10">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Kurzantwort</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Die <strong className="text-text-primary">Arbeitstage {year}</strong> in Deutschland (bei einer 5-Tage-Woche)
            unterscheiden sich je nach Bundesland, weil gesetzliche Feiertage regional variieren.
            Werktage umfassen Montag bis Samstag &ndash; deshalb sind sie nicht identisch mit der 5-Tage-Woche.
          </p>
        </div>

        {/* ═══ SECTION: Warum je Bundesland unterschiedlich ═══ */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4" id="warum-die-arbeitstage-je-bundesland-unterschiedlich-sind">
            Warum die Arbeitstage {year} je Bundesland unterschiedlich sind
          </h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-4">
            <p>
              Die <strong className="text-text-primary">Arbeitstage {year} je Bundesland</strong> unterscheiden sich,
              weil nicht jeder Feiertag &uuml;berall gilt. Einige Termine sind bundesweit, andere nur in einzelnen
              L&auml;ndern. Dazu kommt: Fallen Feiertage auf Samstag oder Sonntag, sinkt ihr Einfluss auf die
              Arbeitstage. Beispiele f&uuml;r landesspezifische Feiertage sind Fronleichnam oder Reformationstag.
            </p>
          </div>

          {/* Mini-Checkliste */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Davon h&auml;ngt deine Arbeitstage-Zahl ab:</p>
            <ul className="text-sm text-text-secondary space-y-2">
              {["Bundesland", "5- oder 6-Tage-Woche", "Feiertage (inkl. Wochenend-Lage)", "Urlaub", "Krankheit", "Teilzeit"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══ SECTION 1: Arbeitstage nach Bundesland ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4" id="arbeitstage-nach-bundesland">
            Arbeitstage {year} nach Bundesland
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Die Zahl der Arbeitstage unterscheidet sich je Bundesland vor allem
            durch <strong className="text-text-primary">landesspezifische Feiertage</strong>. Dazu z&auml;hlen
            etwa <strong className="text-text-primary">Fronleichnam</strong> (u.&nbsp;a. NRW, Bayern, BW),{" "}
            <strong className="text-text-primary">Allerheiligen</strong> (u.&nbsp;a. Bayern, BW) oder
            der <strong className="text-text-primary">Reformationstag</strong> (u.&nbsp;a. Niedersachsen, MV).
            Alle Details findest du auf den jeweiligen Feiertage-Seiten, z.&nbsp;B.:{" "}
            <Link href={`/feiertage/${year}/nordrhein-westfalen`} className="text-accent hover:underline">Feiertage NRW</Link>,{" "}
            <Link href={`/feiertage/${year}/bayern`} className="text-accent hover:underline">Feiertage Bayern</Link>,{" "}
            <Link href={`/feiertage/${year}/baden-wuerttemberg`} className="text-accent hover:underline">Feiertage BW</Link>.
          </p>
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
                        href={`/feiertage/${year}/${bl.name.toLowerCase().replace(/\u00e4/g, "ae").replace(/\u00f6/g, "oe").replace(/\u00fc/g, "ue").replace(/\u00df/g, "ss").replace(/\s+/g, "-")}`}
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

        {/* ═══ SECTION 2: Arbeitstage pro Monat (bundesweit) ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4" id="arbeitstage-pro-monat-deutschland-5-tage-woche">
            Arbeitstage {year} pro Monat (Deutschland, 5-Tage-Woche)
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Diese Monats&uuml;bersicht zeigt dir die <strong className="text-text-primary">Arbeitstage {year} pro
            Monat</strong> in Deutschland. Sie basiert auf einer 5-Tage-Woche (Montag bis Freitag). Die Werte
            gelten bundesweit und ber&uuml;cksichtigen nur bundesweite gesetzliche Feiertage. Unterschiede nach
            Bundesland sind nicht eingerechnet. Nutze die Tabelle f&uuml;r <strong className="text-text-primary">Personalplanung</strong>,{" "}
            <strong className="text-text-primary">Urlaubsplanung</strong> und{" "}
            <strong className="text-text-primary">Projektkalkulation</strong>.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Monat</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Kalendertage</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Wochenendtage</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Feiertage (bundesweit)</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Arbeitstage</th>
                </tr>
              </thead>
              <tbody>
                {hh.monate.map((m, i) => {
                  const kt = new Date(year, i + 1, 0).getDate();
                  const we = kt - m.werktage;
                  return (
                    <tr key={m.monat} className="border-b border-border last:border-b-0">
                      <td className="px-5 py-3 font-medium text-text-primary">{m.monat}</td>
                      <td className="px-5 py-3 text-right text-text-secondary">{kt}</td>
                      <td className="px-5 py-3 text-right text-text-secondary">{we}</td>
                      <td className="px-5 py-3 text-right text-text-secondary">{m.feiertageAnzahl}</td>
                      <td className="px-5 py-3 text-right font-semibold text-accent">{m.arbeitstage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ SECTION 3: Arbeitstage pro Monat (NRW Beispiel) ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4" id="arbeitstage-nach-bundesland-und-monat-beispiel-nrw">
            Arbeitstage {year} nach Bundesland und Monat (Beispiel: NRW)
          </h2>
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
                  <td className="px-5 py-3 text-text-primary">Gesamt {year}</td>
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
            <Link href="/arbeitstage-berechnen" className="text-accent hover:underline">
              berechne deine Arbeitstage individuell
            </Link>
            .
          </p>
        </div>

        {/* ═══ SECTION: Arbeitstage berechnen ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4" id="arbeitstage-berechnen-formel-beispiele-und-typische-sonderfaelle">
            Arbeitstage {year} berechnen: Formel, Beispiele und typische Sonderf&auml;lle
          </h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              Die <strong className="text-text-primary">Ermittlung von Arbeitstagen</strong> folgt einer klaren Rechnung:
              Du nimmst die Kalendertage und ziehst Wochenenden sowie gesetzliche Feiertage im jeweiligen Bundesland ab.
              In der <strong className="text-text-primary">5-Tage-Woche</strong> z&auml;hlen Montag bis Freitag,
              in der 6-Tage-Woche Montag bis Samstag. Arbeitest du in Teilzeit (z.&nbsp;B. 3&nbsp;Tage pro Woche),
              rechnest du ausschlie&szlig;lich mit deinen festen Arbeitstagen.
            </p>
          </div>

          {/* Formel-Box */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-6">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Formel</p>
            <p className="text-sm text-text-primary font-medium mb-2">
              Arbeitstage = Kalendertage &minus; Wochenendtage &minus; Feiertage (Bundesland)
            </p>
            <p className="text-xs text-text-secondary">
              Beispiel (5-Tage-Woche): 31&nbsp;Tage &minus; 8&nbsp;Wochenendtage &minus; 1&nbsp;Feiertag = 22&nbsp;Arbeitstage
            </p>
          </div>

          {/* Sonderfälle */}
          <h3 className="text-lg font-semibold mb-3">Sonderf&auml;lle, die du beachten solltest</h3>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              F&auml;llt ein Feiertag auf <strong className="text-text-primary">Samstag oder Sonntag</strong>, ziehst
              du ihn in der 5-Tage-Woche nicht zus&auml;tzlich ab, weil diese Tage ohnehin nicht als Arbeitstage z&auml;hlen.
            </p>
            <p>
              Bei <strong className="text-text-primary">regionalen Feiertagen</strong> kommt es auf den Zweck an:
              F&uuml;r die Planung ist oft der Arbeitsort entscheidend, w&auml;hrend in anderen F&auml;llen der
              Wohnort relevant sein kann.
            </p>
            <p>
              F&uuml;r die <strong className="text-text-primary">Jahresplanung</strong> nutzt du h&auml;ufig
              Soll-Werte. F&uuml;r Abrechnung oder Steuer z&auml;hlen dagegen die tats&auml;chlichen Arbeitstage
              im konkreten Zeitraum. Pr&uuml;fe dazu die Feiertage unter{" "}
              <Link href={`/feiertage/${year}`} className="text-accent hover:underline">Feiertage {year}</Link> und
              kontrolliere Zeitr&auml;ume direkt mit dem{" "}
              <Link href="/tagerechner" className="text-accent hover:underline">Tagerechner</Link>.
            </p>
          </div>

          {/* 5-Tage-Woche Checkliste */}
          <h3 className="text-lg font-semibold mb-3">5-Tage-Woche {year}: So berechnest du deine pers&ouml;nlichen Arbeitstage</h3>
          <div className="bg-card-bg border border-border rounded-2xl p-5 mb-6">
            <ol className="text-sm text-text-secondary space-y-2 list-decimal list-inside">
              <li>W&auml;hle dein <strong className="text-text-primary">Bundesland</strong>, denn die Feiertage unterscheiden sich je nach Region.</li>
              <li>Streiche alle <strong className="text-text-primary">Wochenenden</strong> (Sa/So) aus dem Kalender.</li>
              <li>Ziehe nur die Feiertage ab, die auf <strong className="text-text-primary">Mo&ndash;Fr</strong> fallen.</li>
              <li>F&uuml;hre <strong className="text-text-primary">Urlaub</strong>, <strong className="text-text-primary">Krankheit</strong> und <strong className="text-text-primary">Weiterbildung</strong> separat auf.</li>
            </ol>
          </div>

          {/* Teilzeit & Schicht */}
          <h3 className="text-lg font-semibold mb-3">Teilzeit und Schicht: Arbeitstage {year} bei 3- oder 4-Tage-Woche</h3>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3">
            <p>
              Bei Teilzeit gilt: Deine Arbeitstage {year} richten sich nach deinen{" "}
              <strong className="text-text-primary">regelm&auml;&szlig;igen Arbeitstagen</strong>, nicht nach
              &bdquo;Werktagen&ldquo;. Grundlage ist die 5-Tage-Woche als 100%-Basis. Daraus leitest du dein
              Teilzeitmodell ab.
            </p>
            <p>
              <strong className="text-text-primary">Beispiel 4-Tage-Woche (Mo&ndash;Do):</strong> Z&auml;hle alle Montage
              bis Donnerstage in {year} und ziehe nur die Feiertage ab, die auf Mo&ndash;Do fallen.
              Bei wechselnden Schichten z&auml;hlt die tats&auml;chliche Einsatzplanung im Kalender oder in der Zeiterfassung.
            </p>
          </div>
        </div>

        {/* ═══ SECTION: Rechner ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4" id="arbeitstage-rechner-jahresarbeitszeit-urlaub-und-feiertage-einbeziehen">
            Arbeitstage {year} Rechner: Jahresarbeitszeit, Urlaub und Feiertage einbeziehen
          </h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              Ein <strong className="text-text-primary">Arbeitstage {year} Rechner</strong> spart dir Zeit, wenn du
              mehr brauchst als reine Tabellenwerte. F&uuml;r ein realistisches Ergebnis gibst du dein{" "}
              <strong className="text-text-primary">Bundesland</strong>, deine{" "}
              <strong className="text-text-primary">Arbeitstage pro Woche</strong>,{" "}
              <strong className="text-text-primary">Start- und Enddatum</strong> sowie individuelle freie Tage ein.
            </p>
            <p>
              Zu den freien Tagen z&auml;hlen zum Beispiel Br&uuml;ckentage, Betriebsferien oder bereits geplante
              Urlaubstage. Ein guter Arbeitstage-Rechner rechnet auf Wunsch auch in{" "}
              <strong className="text-text-primary">Arbeitsstunden</strong> um und weist Urlaub und Krankheit getrennt aus.
            </p>
            <p>
              Typische Einsatzbereiche sind <strong className="text-text-primary">Projektkalkulation</strong>,{" "}
              <strong className="text-text-primary">Kapazit&auml;tsplanung</strong> sowie{" "}
              <strong className="text-text-primary">HR/Payroll</strong>.
            </p>
          </div>

          {/* CTA Box */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 md:p-8 text-center mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3">
              Arbeitstage individuell berechnen
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-lg mx-auto">
              Berechne deine pers&ouml;nlichen Arbeitstage mit Bundesland-Auswahl,
              Urlaubs- und Krankheitstagen. Perfekt f&uuml;r die Steuererkl&auml;rung
              und Pendlerpauschale.
            </p>
            <Link
              href="/arbeitstage-berechnen"
              className="inline-flex items-center gap-2 bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent/90 transition-colors"
            >
              Zum Arbeitstage-Rechner &rarr;
            </Link>
          </div>

          {/* Jahresarbeitszeit */}
          <h3 className="text-lg font-semibold mb-3">Jahresarbeitszeit {year} berechnen (Stunden pro Jahr)</h3>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-4">
            <p>
              Die <strong className="text-text-primary">Jahresarbeitszeit {year}</strong> berechnest du schnell
              mit einem Jahresarbeitszeitrechner: <strong className="text-text-primary">Arbeitstage &times; Stunden
              pro Arbeitstag</strong>.
            </p>
            <p>
              Wenn du nur deine Wochenstunden kennst, wandelst du sie zuerst um:
              Wochenstunden &divide; Arbeitstage pro Woche = Stunden pro Tag.
              Beispiel: <strong className="text-text-primary">40&nbsp;Stunden/Woche</strong> bei 5&nbsp;Arbeitstagen
              ergeben <strong className="text-text-primary">8&nbsp;Stunden/Tag</strong>.
            </p>
            <p>
              <strong className="text-text-primary">Wichtig:</strong> Pausen, &Uuml;berstunden sowie Tarif- oder
              Vertragsregelungen rechnest du separat, weil sie je nach Unternehmen unterschiedlich geregelt sind.
            </p>
          </div>

          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-2">Rechenbeispiel</p>
            <div className="text-sm text-text-secondary space-y-1">
              <p>35&nbsp;h/Woche &divide; 5&nbsp;Tage = <strong className="text-text-primary">7&nbsp;h/Tag</strong> &rarr; Arbeitstage &times; 7</p>
              <p>38,5&nbsp;h/Woche &divide; 5&nbsp;Tage = <strong className="text-text-primary">7,7&nbsp;h/Tag</strong> &rarr; Arbeitstage &times; 7,7</p>
              <p>40&nbsp;h/Woche &divide; 5&nbsp;Tage = <strong className="text-text-primary">8&nbsp;h/Tag</strong> &rarr; Arbeitstage &times; 8</p>
            </div>
          </div>
        </div>

        {/* ═══ SECTION: Stunden → Arbeitstage ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4" id="stunden-in-arbeitstage-umrechnen-rechner-formeln-und-beispiele">
            Stunden in Arbeitstage umrechnen: Rechner-Formeln und Beispiele
          </h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              Wenn du <strong className="text-text-primary">Stunden in Arbeitstage umrechnen</strong> m&ouml;chtest, gilt
              eine einfache Rechnung: <strong className="text-text-primary">Stunden &divide; t&auml;gliche
              Arbeitszeit = Arbeitstage</strong>. So berechnest du deine Arbeitstage schnell und passend zu deinem
              Modell (Vollzeit, Teilzeit oder individuelle Wochenstunden).
            </p>
            <p>
              <strong className="text-text-primary">Wichtig:</strong> Arbeitstage z&auml;hlen nur die Tage, an
              denen du laut deinem Arbeitsplan tats&auml;chlich arbeitest. Kalendertage umfassen jedes Datum
              (inklusive Wochenenden und Feiertagen) und spielen z.&nbsp;B. bei Fristen eine Rolle.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Stunden</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">bei 8&nbsp;h/Tag</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">bei 7,7&nbsp;h/Tag</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">bei 7&nbsp;h/Tag</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { h: 8, a8: "1,00", a77: "1,04", a7: "1,14" },
                  { h: 16, a8: "2,00", a77: "2,08", a7: "2,29" },
                  { h: 24, a8: "3,00", a77: "3,12", a7: "3,43" },
                  { h: 40, a8: "5,00", a77: "5,19", a7: "5,71" },
                  { h: 80, a8: "10,00", a77: "10,39", a7: "11,43" },
                ].map((row) => (
                  <tr key={row.h} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 text-right font-medium text-text-primary">{row.h}</td>
                    <td className="px-5 py-3 text-right text-text-secondary">{row.a8} AT</td>
                    <td className="px-5 py-3 text-right text-text-secondary">{row.a77} AT</td>
                    <td className="px-5 py-3 text-right text-accent font-semibold">{row.a7} AT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            AT = Arbeitstage. Formel: Stunden &divide; t&auml;gliche Arbeitszeit = Arbeitstage.
          </p>
        </div>

        {/* ═══ SECTION: Steuererklärung ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4" id="arbeitstage-fuer-die-steuererklaerung-pendlerpauschale-was-zaehlt">
            Arbeitstage {year} f&uuml;r die Steuererkl&auml;rung (Pendlerpauschale): Was z&auml;hlt?
          </h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              F&uuml;r die <strong className="text-text-primary">Pendlerpauschale</strong> z&auml;hlen in der
              Steuererkl&auml;rung nur die tats&auml;chlichen Tage, an denen du zur ersten T&auml;tigkeitsst&auml;tte
              gefahren bist. Viele Finanz&auml;mter akzeptieren bei Vollzeit h&auml;ufig rund{" "}
              <strong className="text-text-primary">230&nbsp;Tage</strong> als plausiblen Richtwert &ndash; aber nur,
              wenn das zu deinem Jahr passt.
            </p>
            <p>
              Weniger Arbeitstage hast du zum Beispiel durch Homeoffice, Urlaub, Krankheit oder Dienstreisen
              ohne Fahrt ins B&uuml;ro. F&uuml;r R&uuml;ckfragen hilft eine einfache Kalender- oder
              Zeiterfassungs&uuml;bersicht.
            </p>
          </div>

          {/* Steuer-Kurzcheck */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-6">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Steuer-Kurzcheck: Arbeitstage in der Steuererkl&auml;rung</p>
            <div className="text-sm text-text-secondary space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-accent font-semibold min-w-[100px]">Z&auml;hlt:</span>
                <span>Fahrt zur ersten T&auml;tigkeitsst&auml;tte</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-text-primary font-semibold min-w-[100px]">Z&auml;hlt nicht:</span>
                <span>Homeoffice, Urlaub, Krankheit, reine Dienstreise ohne B&uuml;ro-Fahrt</span>
              </div>
              <p className="text-xs mt-2">Ma&szlig;geblich sind immer deine tats&auml;chlichen Verh&auml;ltnisse.</p>
            </div>
          </div>

          {/* Pendlerpauschale Box */}
          <div className="bg-surface-secondary border border-border rounded-xl p-5 mb-6">
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

          {/* Beispielrechnung */}
          <h3 className="text-lg font-semibold mb-3">Beispiel: Arbeitstage f&uuml;r die Steuer berechnen (Vollzeit + Homeoffice + Urlaub)</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Nimm die Gesamt-Arbeitstage aus deiner Jahres&uuml;bersicht. Zieh dann Urlaub, Krankheit und reine
            Homeoffice-Tage ab. Wichtig: Dokumentiere diese Tage getrennt, damit du bei Nachfragen sauber belegen kannst.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">Arbeitstage Kalenderjahr</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">minus Urlaub</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">minus Krankheit</th>
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">minus Homeoffice</th>
                  <th className="text-right px-5 py-3 font-medium text-accent">= Fahrten</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3 text-right font-medium text-text-primary">230</td>
                  <td className="px-5 py-3 text-right text-text-secondary">30</td>
                  <td className="px-5 py-3 text-right text-text-secondary">8</td>
                  <td className="px-5 py-3 text-right text-text-secondary">60</td>
                  <td className="px-5 py-3 text-right font-semibold text-accent">132</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ SECTION: Häufige Fehler ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-4" id="haeufige-fehler-bei-der-ermittlung-der-arbeitstage">
            H&auml;ufige Fehler bei der Ermittlung der Arbeitstage {year}
          </h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-3 mb-6">
            <p>
              Bei der Ermittlung der Arbeitstage passieren oft dieselben Denkfehler. Besonders h&auml;ufig
              werden <strong className="text-text-primary">Werktage und Arbeitstage vermischt</strong>. Werktage
              z&auml;hlen meist Mo&ndash;Sa, Arbeitstage in der 5-Tage-Woche dagegen Mo&ndash;Fr.
            </p>
            <p>
              Ein weiterer Klassiker: <strong className="text-text-primary">Feiertage werden abgezogen, obwohl sie
              auf ein Wochenende fallen</strong>. Das ist bei der 5-Tage-Woche falsch, weil dir dadurch keine
              Arbeitstage verloren gehen.
            </p>
            <p>
              Auch das <strong className="text-text-primary">Bundesland</strong> wird schnell verwechselt. F&uuml;r
              viele Berechnungen z&auml;hlt der Arbeitsort, nicht der Wohnort. Und wichtig: Urlaub und Krankheit
              sind keine &bdquo;Arbeitstage im Jahr&ldquo;. Sie werden separat abgezogen.
            </p>
          </div>

          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Fehler vermeiden &ndash; Kurzcheck</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Unterschied <strong className="text-text-primary">Werktage vs. Arbeitstage</strong> beachten</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Wochenend-Feiertage nur abziehen, wenn sie echte Arbeitstage treffen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Richtiges <strong className="text-text-primary">Bundesland</strong> laut Kontext verwenden</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Urlaub/Krankheit <strong className="text-text-primary">separat</strong> behandeln</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Umrechnung &uuml;ber Formeln kontrollieren</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ═══ FAQ ═══ */}
        <div className="mb-14">
          <h2 className="text-2xl font-semibold mb-5" id="haeufig-gestellte-fragen-zu-arbeitstagen">
            H&auml;ufig gestellte Fragen zu Arbeitstagen {year}
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

        {/* ═══ Abschlusstext ═══ */}
        <div className="mb-10 text-sm text-text-secondary leading-relaxed space-y-3">
          <p>
            Wie viele <strong className="text-text-primary">Arbeitstage {year}</strong> du tats&auml;chlich hast,
            h&auml;ngt vor allem von deinem Bundesland, deinen Feiertagen und deinem Arbeitsmodell ab. Nutze
            daf&uuml;r die Tabellen nach Monat und Bundesland sowie den Abschnitt zum Berechnen (inkl. Urlaub,
            Krankheit und Umrechnung Stunden&nbsp;&harr;&nbsp;Arbeitstage), damit du schnell zu deiner realen Zahl
            kommst &ndash; auch mit Blick auf die Steuer, denn dort z&auml;hlen am Ende die tats&auml;chlich
            angefallenen Fahrten/Arbeitstage.
          </p>
          <p>
            Lade dir jetzt die Tabelle herunter oder nutze
            den <Link href="/arbeitstage-berechnen" className="text-accent hover:underline">Rechner</Link>, um
            deine Jahresarbeitszeit sauber zu planen.
          </p>
        </div>

        {/* ── Author Byline ─────────────────────────── */}
        <AuthorByline date={year === new Date().getFullYear() ? new Date() : new Date(`${year}-01-01`)} />

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/arbeitstage-berechnen" className="text-accent hover:underline">
            Arbeitstage-Rechner &rarr;
          </Link>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
            Feiertage {year} &rarr;
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
