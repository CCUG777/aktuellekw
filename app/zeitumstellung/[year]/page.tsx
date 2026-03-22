import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getZeitumstellungen,
  getZeitumstellungenMultiYear,
  formatDateLongDE,
  daysUntil,
} from "@/lib/zeitumstellung";
import { getISOWeekNumber } from "@/lib/kw";
import { CONTENT_YEARS } from "@/lib/constants";
import LastUpdated from "@/components/LastUpdated";

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

  const { sommerzeit, winterzeit } = getZeitumstellungen(year);
  const title = `Zeitumstellung ${year}: Termine, Datum & alle Infos`;
  const description = `Zeitumstellung ${year}: Sommerzeit am ${sommerzeit.dateFormatted} & Winterzeit am ${winterzeit.dateFormatted}. ✓ Alle Termine & Regeln für Deutschland.`;

  return {
    title,
    description,
    alternates: { canonical: `https://aktuellekw.de/zeitumstellung/${year}` },
    openGraph: {
      title,
      description,
      url: `https://aktuellekw.de/zeitumstellung/${year}`,
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

/* ── Page ──────────────────────────────────────────────────────── */
export default async function ZeitumstellungYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  if (isNaN(year) || year < 2020 || year > 2035) notFound();

  const today = new Date();
  const { sommerzeit, winterzeit } = getZeitumstellungen(year);
  const multiYear = getZeitumstellungenMultiYear(year - 2, year + 4);

  // Determine next Zeitumstellung
  const daysSommerzeit = daysUntil(sommerzeit.date, today);
  const daysWinterzeit = daysUntil(winterzeit.date, today);
  const nextSwitch =
    daysSommerzeit > 0
      ? { ...sommerzeit, daysUntil: daysSommerzeit }
      : daysWinterzeit > 0
      ? { ...winterzeit, daysUntil: daysWinterzeit }
      : null;

  const sommerzeitKW = getISOWeekNumber(sommerzeit.date);
  const winterzeitKW = getISOWeekNumber(winterzeit.date);

  // US DST: 2nd Sunday in March
  const march1 = new Date(year, 2, 1);
  const dw = march1.getDay();
  const firstSun = dw === 0 ? 1 : 8 - dw;
  const usDSTDay = firstSun + 7;
  const usDST = {
    formatted: `${usDSTDay}. M\u00E4rz ${year}`,
    numeric: `${String(usDSTDay).padStart(2, "0")}.03.${year}`,
  };

  const faqItems = [
    {
      q: `Wann werden die Uhren ${year} umgestellt?`,
      a: `Die Uhren werden zur Zeitumstellung ${year} in Deutschland zweimal umgestellt: im M\u00E4rz auf Sommerzeit und im Oktober zur\u00FCck auf Winterzeit (Normalzeit). Die Umstellung passiert jeweils in der Nacht von Samstag auf Sonntag.`,
    },
    {
      q: `Wann ist die Zeitumstellung ${year} in Deutschland genau (Datum und Uhrzeit)?`,
      a: `Die Zeitumstellung ${year} in Deutschland ist am Sonntag, ${sommerzeit.dateFormatted}: um ${sommerzeit.timeBefore} Uhr wird auf ${sommerzeit.timeAfter} Uhr vorgestellt (Sommerzeit). Zur\u00FCck geht es am Sonntag, ${winterzeit.dateFormatted}: um ${winterzeit.timeBefore} Uhr wird auf ${winterzeit.timeAfter} Uhr zur\u00FCckgestellt (Winterzeit/Normalzeit). Beide Termine liegen in der Nacht von Samstag auf Sonntag.`,
    },
    {
      q: `Wird die Uhr im M\u00E4rz ${year} vor oder zur\u00FCck gestellt?`,
      a: `Im M\u00E4rz ${year} wird die Uhr in Deutschland vorgestellt, weil dann die Sommerzeit beginnt. Bei der Zeitumstellung ${year} springt die Uhr von ${sommerzeit.timeBefore} auf ${sommerzeit.timeAfter} Uhr. Du verlierst dadurch eine Stunde Schlaf.`,
    },
    {
      q: `Wird die Uhr im Oktober ${year} vor oder zur\u00FCck gestellt?`,
      a: `Im Oktober ${year} wird die Uhr in Deutschland zur\u00FCckgestellt, weil dann die Winterzeit (Normalzeit) beginnt. Bei der Zeitumstellung ${year} geht es von ${winterzeit.timeBefore} auf ${winterzeit.timeAfter} Uhr zur\u00FCck. Du bekommst dadurch eine Stunde dazu.`,
    },
    {
      q: `Warum finde ich online auch den ${usDST.formatted} als Termin?`,
      a: `Der ${usDST.formatted} wird oft genannt, weil in den USA die Sommerzeit (Daylight Saving Time) an einem anderen Datum startet als in Deutschland. F\u00FCr die Zeitumstellung ${year} in Deutschland gilt der letzte Sonntag im M\u00E4rz, nicht der ${usDST.formatted}. Viele Suchtreffer vermischen die US-Regel mit der EU-Regel.`,
    },
    {
      q: `Stellen Smartphones und Funkuhren die Zeitumstellung ${year} automatisch um?`,
      a: `Smartphones stellen die Zeitumstellung ${year} meist automatisch um, wenn \u201EDatum/Uhrzeit automatisch\u201C aktiviert ist und die richtige Zeitzone eingestellt ist. Funkuhren stellen sich ebenfalls automatisch um. Manuell pr\u00FCfen musst du oft Ger\u00E4te wie Auto-Uhren, Backofen/Mikrowelle und manche Smart-Home-Komponenten.`,
    },
    {
      q: `Ist die Zeitumstellung ${year} abgeschafft oder gilt sie noch?`,
      a: `Die Zeitumstellung ${year} ist in Deutschland nicht abgeschafft und gilt weiterhin. Eine EU-weite Abschaffung wurde diskutiert, ist aber bisher nicht umgesetzt. Deshalb werden die Uhren auch ${year} wie gewohnt im M\u00E4rz und Oktober umgestellt.`,
    },
    {
      q: "Welche Zeit gilt in Deutschland dauerhaft: Sommerzeit oder Winterzeit?",
      a: `In Deutschland gilt keine Zeit dauerhaft: Es gibt weiterhin Sommerzeit und Winterzeit (Normalzeit) im Wechsel. Welche Zeit dauerhaft gelten soll, ist politisch noch nicht entschieden. Bis dahin bleibt es auch zur Zeitumstellung ${year} beim bisherigen System.`,
    },
  ];

  /* ── JSON-LD @graph ── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://aktuellekw.de/zeitumstellung/${year}#breadcrumb`,
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
            name: `Zeitumstellung ${year}`,
            item: `https://aktuellekw.de/zeitumstellung/${year}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `https://aktuellekw.de/zeitumstellung/${year}#faqpage`,
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        datePublished: `${year}-01-01`,
        dateModified: year === new Date().getFullYear() ? new Date().toISOString().split("T")[0] : `${year}-01-01`,
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "Event",
        "@id": `https://aktuellekw.de/zeitumstellung/${year}#event`,
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        name: `Zeitumstellung ${year} \u2013 Sommerzeit`,
        startDate: `${sommerzeit.dateISO}T02:00:00+01:00`,
        endDate: `${sommerzeit.dateISO}T03:00:00+02:00`,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: "Deutschland",
          address: { "@type": "PostalAddress", addressCountry: "DE" },
        },
        description: `Uhren werden am ${sommerzeit.dateFormatted} von ${sommerzeit.timeBefore} auf ${sommerzeit.timeAfter} Uhr vorgestellt (Sommerzeit/MESZ).`,
        organizer: {
          "@type": "Organization",
          name: "Europ\u00E4ische Union",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-secondary">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link href="/" className="hover:text-text-primary transition-colors">
                Startseite
              </Link>
              <span className="mx-1" aria-hidden="true">/</span>
            </li>
            <li aria-current="page" className="text-text-primary font-medium">
              Zeitumstellung {year}
            </li>
          </ol>
        </nav>

        {/* ── Hero ── */}
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-accent mb-3">
            Zeitumstellung Deutschland
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Zeitumstellung {year}
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Alle Termine, Datum und Infos zur Zeitumstellung {year} in Deutschland &ndash; wann werden die Uhren umgestellt?
          </p>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Sommerzeit</p>
              <p className="text-2xl font-bold">{formatDateLongDE(sommerzeit.date)}</p>
              <p className="text-sm text-text-secondary mt-1">
                Uhr von {sommerzeit.timeBefore} auf {sommerzeit.timeAfter} Uhr <span className="text-accent font-medium">vor</span>
              </p>
              <p className="text-xs text-text-secondary mt-1">KW {sommerzeitKW} &middot; {sommerzeit.timezone} ({sommerzeit.utcOffset})</p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Winterzeit</p>
              <p className="text-2xl font-bold">{formatDateLongDE(winterzeit.date)}</p>
              <p className="text-sm text-text-secondary mt-1">
                Uhr von {winterzeit.timeBefore} auf {winterzeit.timeAfter} Uhr <span className="text-accent font-medium">zur&uuml;ck</span>
              </p>
              <p className="text-xs text-text-secondary mt-1">KW {winterzeitKW} &middot; {winterzeit.timezone} ({winterzeit.utcOffset})</p>
            </div>
          </div>

          {nextSwitch && nextSwitch.daysUntil > 0 && (
            <p className="mt-4 text-sm text-text-secondary">
              N&auml;chste Zeitumstellung ({nextSwitch.label}) in <strong className="text-text-primary">{nextSwitch.daysUntil} Tagen</strong>
            </p>
          )}
        </header>

        {/* ── Einleitungstext ── */}
        <section className="mb-12 text-sm text-text-secondary leading-relaxed space-y-4 max-w-3xl mx-auto">
          <p>
            Die <strong className="text-text-primary">Zeitumstellung {year}</strong> in Deutschland passiert an zwei Sonntagen: Am <strong className="text-text-primary">{formatDateLongDE(sommerzeit.date)}</strong> beginnt die Sommerzeit &ndash; um {sommerzeit.timeBefore} Uhr springt die Uhr auf {sommerzeit.timeAfter} Uhr (eine Stunde weniger Schlaf). Am <strong className="text-text-primary">{formatDateLongDE(winterzeit.date)}</strong> endet die Sommerzeit &ndash; um {winterzeit.timeBefore} Uhr geht&apos;s zur&uuml;ck auf {winterzeit.timeAfter} Uhr (eine Stunde mehr). Damit wechselst du zwischen <strong className="text-text-primary">MEZ</strong> (Winterzeit/Normalzeit) und <strong className="text-text-primary">MESZ</strong> (Sommerzeit) &ndash; und wei&szlig;t sofort, ob die Uhr vor oder zur&uuml;ck muss.
          </p>
          <p>
            Viele Ger&auml;te machen das automatisch, aber bei Auto-Uhr, Backofen, Mikrowelle oder Smart-Home-Hubs musst du oft nachhelfen &ndash; weiter unten kommt ein schneller Ger&auml;te-Check. Falls du &bdquo;{usDST.formatted}&ldquo; gelesen hast: Das ist die <strong className="text-text-primary">US-Umstellung</strong>, nicht Deutschland. Die EU-Debatte zur Abschaffung l&auml;uft zwar weiter, umgesetzt ist sie f&uuml;r {year} aber nicht.
          </p>
        </section>

        {/* ── Termine Detail ── */}
        <section className="mb-12">
          <h2 id="termine-der-zeitumstellung" className="text-2xl font-bold mb-6">Termine der Zeitumstellung {year}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Umstellung</th>
                  <th className="py-3 pr-4 font-semibold">Datum</th>
                  <th className="py-3 pr-4 font-semibold">Uhrzeit</th>
                  <th className="py-3 pr-4 font-semibold">Richtung</th>
                  <th className="py-3 font-semibold">Zeitzone</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Sommerzeit</td>
                  <td className="py-3 pr-4">{sommerzeit.dayName}, {sommerzeit.dateFormatted}</td>
                  <td className="py-3 pr-4">{sommerzeit.timeBefore} &rarr; {sommerzeit.timeAfter} Uhr</td>
                  <td className="py-3 pr-4 text-accent font-medium">Uhr vor (+1h)</td>
                  <td className="py-3">MEZ &rarr; MESZ</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Winterzeit</td>
                  <td className="py-3 pr-4">{winterzeit.dayName}, {winterzeit.dateFormatted}</td>
                  <td className="py-3 pr-4">{winterzeit.timeBefore} &rarr; {winterzeit.timeAfter} Uhr</td>
                  <td className="py-3 pr-4 text-accent font-medium">Uhr zur&uuml;ck (&minus;1h)</td>
                  <td className="py-3">MESZ &rarr; MEZ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Zeitumstellung März ── */}
        <section className="mb-12">
          <h2 id="zeitumstellung-maerz" className="text-2xl font-bold mb-4">Zeitumstellung M&auml;rz {year}: Uhr vorstellen am {sommerzeit.dateFormatted}</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl">
            <p>
              Bei der <strong className="text-text-primary">Zeitumstellung im M&auml;rz {year}</strong> wechselst du am {sommerzeit.dateFormatted} auf die Sommerzeit (MESZ). In der Nacht springt die Uhr von {sommerzeit.timeBefore} auf {sommerzeit.timeAfter} Uhr &ndash; du stellst die Uhr also eine Stunde vor.
            </p>
            <p>
              Dadurch ist die Nacht eine Stunde k&uuml;rzer. Kontrolliere Wecker, Uhren und Ger&auml;te ohne Funkabgleich und passe bei Bedarf deine Termin- und Schichtplanung an, damit nichts verrutscht. Mehr Hintergr&uuml;nde findest du unter <Link href="/sommerzeit" className="text-accent hover:underline">alle Details zur Sommerzeit {year}</Link>.
            </p>
            <div className="bg-card-bg border border-border rounded-2xl px-5 py-4 mt-4">
              <p className="text-sm"><strong className="text-text-primary">Merke:</strong> Letzter Sonntag im M&auml;rz: {sommerzeit.timeBefore} wird {sommerzeit.timeAfter} (Uhr vorstellen).</p>
            </div>
          </div>
        </section>

        {/* ── Zeitumstellung Oktober ── */}
        <section className="mb-12">
          <h2 id="zeitumstellung-oktober" className="text-2xl font-bold mb-4">Zeitumstellung Oktober {year}: Uhr zur&uuml;ckstellen am {winterzeit.dateFormatted}</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl">
            <p>
              Die <strong className="text-text-primary">Zeitumstellung Oktober {year}</strong> f&auml;llt auf den {winterzeit.dateFormatted}. In dieser Nacht beginnt die Normalzeit: Um {winterzeit.timeBefore} Uhr wird die Uhr auf {winterzeit.timeAfter} Uhr gestellt. Du musst also die <strong className="text-text-primary">Uhr zur&uuml;ckstellen</strong> &ndash; und gewinnst eine Stunde Schlaf.
            </p>
            <p>
              Praktisch hei&szlig;t das: Die Stunde zwischen {winterzeit.timeAfter} und {winterzeit.timeBefore} Uhr passiert zweimal. Das ist wichtig, wenn du Nachtschicht hast oder Termine in der Nacht planst. Alle Details findest du unter <Link href="/winterzeit" className="text-accent hover:underline">Infos zur Winterzeit {year}</Link>.
            </p>
            <div className="bg-card-bg border border-border rounded-2xl px-5 py-4 mt-4">
              <p className="text-sm"><strong className="text-text-primary">Merke:</strong> Am letzten Sonntag im Oktober wird auf Normalzeit (MEZ) umgestellt: {winterzeit.timeBefore} Uhr wird {winterzeit.timeAfter} Uhr (zur&uuml;ckstellen).</p>
            </div>
          </div>
        </section>

        {/* ── Eselsbrücken ── */}
        <section className="mb-12">
          <h2 id="zeitumstellung-vor-oder-zurueck" className="text-2xl font-bold mb-4">Zeitumstellung {year}: vor oder zur&uuml;ck?</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl mb-6">
            <p>
              Im <strong className="text-text-primary">M&auml;rz</strong> stellst du die Uhr <strong className="text-text-primary">vor</strong>, im <strong className="text-text-primary">Oktober</strong> stellst du sie <strong className="text-text-primary">zur&uuml;ck</strong>. Im M&auml;rz springt die Uhr nachts von {sommerzeit.timeBefore} auf {sommerzeit.timeAfter}. Du verlierst eine Stunde Schlaf, daf&uuml;r bleibt es abends l&auml;nger hell. Im Oktober l&auml;uft es umgekehrt: von {winterzeit.timeBefore} auf {winterzeit.timeAfter}. Du bekommst eine Stunde zur&uuml;ck und der Morgen wirkt fr&uuml;her hell.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm text-accent font-medium mb-2">Gartenm&ouml;bel-Regel</p>
              <p className="text-text-secondary text-sm">
                Im Fr&uuml;hling stellt man die Gartenm&ouml;bel <strong className="text-text-primary">VOR</strong> das Haus, im Herbst stellt man sie <strong className="text-text-primary">ZUR&Uuml;CK</strong> in den Schuppen.
              </p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm text-accent font-medium mb-2">Temperatur-Regel</p>
              <p className="text-text-secondary text-sm">
                Im Fr&uuml;hling werden die Temperaturen <strong className="text-text-primary">plus</strong> (Uhr vor), im Herbst werden sie <strong className="text-text-primary">minus</strong> (Uhr zur&uuml;ck).
              </p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm text-accent font-medium mb-2">Englische Regel</p>
              <p className="text-text-secondary text-sm">
                <strong className="text-text-primary">&ldquo;Spring forward, fall back&rdquo;</strong> &ndash; Im Fr&uuml;hling (spring) vor, im Herbst (fall) zur&uuml;ck.
              </p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm text-accent font-medium mb-2">Zeitzone merken</p>
              <p className="text-text-secondary text-sm">
                <strong className="text-text-primary">MEZ</strong> = Mitteleurop&auml;ische Zeit (Winter, UTC+1). <strong className="text-text-primary">MESZ</strong> = Mitteleurop&auml;ische <em>Sommer</em>zeit (UTC+2).
              </p>
            </div>
          </div>
          {/* Schnell-merken Checkliste */}
          <div className="bg-card-bg border border-border rounded-2xl p-5 mt-4">
            <p className="text-sm font-semibold mb-2">Checkliste (schnell merken)</p>
            <ul className="text-sm text-text-secondary space-y-1.5 list-none">
              <li>&#10003; M&auml;rz: Uhr <strong className="text-text-primary">vor</strong> ({sommerzeit.timeBefore} &rarr; {sommerzeit.timeAfter})</li>
              <li>&#10003; Oktober: Uhr <strong className="text-text-primary">zur&uuml;ck</strong> ({winterzeit.timeBefore} &rarr; {winterzeit.timeAfter})</li>
              <li>&#10003; Merksatz: Gartenm&ouml;bel VOR / ZUR&Uuml;CK</li>
              <li>&#10003; Merkhilfe: Sommerzeit = abends l&auml;nger hell &rarr; vorstellen</li>
            </ul>
          </div>
        </section>

        {/* ── Zeitumstellung Jahresübersicht ── */}
        <section className="mb-12">
          <h2 id="zeitumstellung-mehrjahres-ueberblick" className="text-2xl font-bold mb-6">Zeitumstellung {year - 2}&ndash;{year + 4}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Jahr</th>
                  <th className="py-3 pr-4 font-semibold">Sommerzeit (Uhr vor)</th>
                  <th className="py-3 font-semibold">Winterzeit (Uhr zur&uuml;ck)</th>
                </tr>
              </thead>
              <tbody>
                {multiYear.map((row) => (
                  <tr
                    key={row.year}
                    className={`border-b border-border/50 ${
                      row.year === year ? "bg-accent/5 font-medium" : ""
                    }`}
                  >
                    <td className="py-3 pr-4">
                      {row.year === year ? (
                        <span className="text-accent font-bold">{row.year}</span>
                      ) : (
                        row.year
                      )}
                    </td>
                    <td className="py-3 pr-4">So. {row.sommerzeit.dateFormatted}</td>
                    <td className="py-3">So. {row.winterzeit.dateFormatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Geräte-Check ── */}
        <section className="mb-12">
          <h2 id="welche-geraete-stellen-automatisch-um" className="text-2xl font-bold mb-4">Welche Ger&auml;te stellen die Zeitumstellung {year} automatisch um?</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl mb-6">
            <p>
              Die meisten Ger&auml;te stellen sich bei der <strong className="text-text-primary">Zeitumstellung {year} in Deutschland</strong> automatisch um &ndash; vorausgesetzt, die automatische Uhrzeit ist aktiviert. Das gilt f&uuml;r Smartphones, Tablets und Computer. Auch Smartwatches und viele Funkuhren &uuml;bernehmen die neue Zeit selbstst&auml;ndig. Trotzdem lohnt sich ein kurzer Check, besonders bei Arbeitsger&auml;ten, Zweitprofilen oder Ger&auml;ten, die selten online sind.
            </p>
            <p>
              Manuell wird es h&auml;ufig bei <strong className="text-text-primary">Backofen</strong> und <strong className="text-text-primary">Mikrowelle</strong>. Auch einige <strong className="text-text-primary">Auto-Uhren</strong> und Infotainment-Systeme brauchen eine kurze Anpassung. Klassische Armbanduhren ohne Funk sowie viele Wanduhren stellst du ebenfalls selbst um.
            </p>
            <p>
              Wenn nach der Zeitumstellung eine Uhr eine Stunde danebenliegt, hilft meist: <strong className="text-text-primary">Automatik aktivieren</strong>, Ger&auml;t <strong className="text-text-primary">neu starten</strong> und die Zeitzone auf <strong className="text-text-primary">Europa/Berlin</strong> setzen.
            </p>
          </div>
          {/* Checkliste */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Checkliste: Vor der Zeitumstellung {year}</p>
            <ul className="text-sm text-text-secondary space-y-2 list-none">
              <li>&#10003; <strong className="text-text-primary">Automatische Uhrzeit</strong> am Smartphone aktivieren</li>
              <li>&#10003; <strong className="text-text-primary">Zeitzone Europa/Berlin</strong> pr&uuml;fen</li>
              <li>&#10003; <strong className="text-text-primary">Wecker</strong> und Kalender-Termine kontrollieren</li>
              <li>&#10003; Smartwatch-Synchronisation kurz ansto&szlig;en</li>
              <li>&#10003; <strong className="text-text-primary">Auto-Uhr</strong> und Bordcomputer checken</li>
              <li>&#10003; <strong className="text-text-primary">Backofen</strong> und <strong className="text-text-primary">Mikrowelle</strong> manuell anpassen</li>
              <li>&#10003; <strong className="text-text-primary">Smart-Home-Zeitpl&auml;ne</strong> und Routinen pr&uuml;fen</li>
            </ul>
          </div>
        </section>

        {/* ── Probleme nach der Zeitumstellung ── */}
        <section className="mb-12">
          <h2 id="probleme-nach-der-zeitumstellung" className="text-2xl font-bold mb-4">Probleme nach der Zeitumstellung: Wecker, Kalender und Smart Home</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl mb-4">
            <p>
              Nach der Zeitumstellung {year} lohnt sich am Abend davor ein kurzer Check. Pr&uuml;fe Wecker und Schichtzeiten, damit am n&auml;chsten Morgen alles stimmt. In Kalendern mit Zeitzonen (z.&nbsp;B. Teams oder Zoom) bleiben Termine korrekt, wenn in deinem Profil die richtige Zeitzone hinterlegt ist.
            </p>
            <p>
              Auch Smart-Home-Ger&auml;te und Heizungen k&ouml;nnen Zeitpl&auml;ne verschieben, wenn sie l&auml;nger offline waren. Verbinde die Ger&auml;te wieder mit dem Internet und synchronisiere sie manuell oder starte sie neu.
            </p>
          </div>
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Schnellhilfe</p>
            <div className="text-sm text-text-secondary space-y-2">
              <p><strong className="text-text-primary">Zeitzone falsch:</strong> W&auml;hle die richtige Region, dann passen Termine und Uhrzeit.</p>
              <p><strong className="text-text-primary">Sommerzeit deaktiviert:</strong> Aktiviere die automatische Sommerzeit, damit die Umstellung greift.</p>
              <p><strong className="text-text-primary">Ger&auml;t lange offline:</strong> Stelle die Internetverbindung her und starte das Ger&auml;t neu, damit es synchronisiert.</p>
            </div>
          </div>
        </section>

        {/* ── Abschaffung der Zeitumstellung ── */}
        <section className="mb-12">
          <h2 id="zeitumstellung-abgeschafft-aktueller-stand" className="text-2xl font-bold mb-4">Zeitumstellung {year} abgeschafft? Aktueller Stand in der EU</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl mb-4">
            <p>
              Stand heute ist die Frage &bdquo;Zeitumstellung {year} abgeschafft?&ldquo; klar zu beantworten: <strong className="text-text-primary">Nein</strong>. In Deutschland wird {year} weiterhin wie gewohnt zwischen Sommerzeit und Normalzeit umgestellt. Es gibt keine beschlossene Regel&auml;nderung, die das Ende verbindlich festlegt.
            </p>
            <p>
              Der Hauptgrund ist die <strong className="text-text-primary">fehlende EU-Einigung</strong>. Es muss EU-weit abgestimmt werden, ob dauerhaft Sommerzeit oder Normalzeit gelten soll. Staaten wollen keine Zeitinseln nebenan. 2019 hat das EU-Parlament zwar grunds&auml;tzlich f&uuml;r ein Ende der Umstellung gestimmt. Die Umsetzung blieb aber aus, weil es keine einheitliche Entscheidung der Mitgliedstaaten gab.
            </p>
          </div>
          <div className="bg-card-bg border border-border rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" role="img" aria-label="Info">&#9432;</span>
              <div className="text-sm text-text-secondary">
                <p className="font-semibold text-text-primary mb-2">Faktenbox</p>
                <p>Kein festes Enddatum beschlossen. EU-weite Koordination n&ouml;tig. Termine gelten weiterhin. Bis eine formale Regel&auml;nderung beschlossen ist, gelten die bekannten Umstellungstermine.</p>
              </div>
            </div>
          </div>

          {/* Wer blockiert */}
          <h3 className="text-xl font-bold mt-8 mb-3">Wer &bdquo;blockiert&ldquo; die Abschaffung der Zeitumstellung?</h3>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl">
            <p>
              Der Engpass ist die fehlende Einigung der EU-Mitgliedstaaten, welche Zeit dauerhaft gelten soll. Strittig sind Folgen f&uuml;r <strong className="text-text-primary">Handel und Verkehr</strong>, die geografische Lage (Ost/West) und die Abstimmung mit Nachbarl&auml;ndern. Ohne gemeinsame Linie droht ein Flickenteppich aus unterschiedlichen Regeln &ndash; selbst wenn die Abschaffung politisch grunds&auml;tzlich m&ouml;glich w&auml;re.
            </p>
            <div className="bg-card-bg border border-border rounded-2xl px-5 py-4 mt-3">
              <p className="text-sm"><strong className="text-text-primary">Kurz erkl&auml;rt:</strong> In der EU macht die Kommission einen Vorschlag und koordiniert. Entscheidend ist aber die Einigung der Mitgliedstaaten auf eine dauerhaft g&uuml;ltige Zeit.</p>
            </div>
          </div>
        </section>

        {/* ── Auswirkungen ── */}
        <section className="mb-12">
          <h2 id="auswirkungen-der-zeitumstellung-schlaf-gesundheit" className="text-2xl font-bold mb-4">Auswirkungen der Zeitumstellung: Schlaf, Gesundheit und Alltag</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl mb-6">
            <p>
              Die <strong className="text-text-primary">Auswirkungen auf den K&ouml;rper</strong> sp&uuml;rst du oft sofort: Nach der Umstellung im M&auml;rz fehlt vielen eine Stunde Schlaf. Du bist m&uuml;de, unkonzentriert und wirst abends sp&auml;ter richtig schl&auml;frig. Im Oktober f&auml;llt die Anpassung h&auml;ufig leichter, weil du eine Stunde dazugewinnst.
            </p>
            <p>
              F&uuml;r die Gesundheit hilft ein klarer Plan: Behandle die Umstellung wie einen kleinen Jetlag. Verschiebe deine Schlafenszeit 2&ndash;3 Tage vorher jeden Abend um 15&ndash;20 Minuten nach vorn. Geh morgens direkt ins Tageslicht und beweg dich kurz, damit dein K&ouml;rper schneller auf Tag schaltet. Lass Koffein am sp&auml;ten Nachmittag weg.
            </p>
            <p>
              Bei Kindern und Schichtarbeit zahlt sich Vorbereitung besonders aus. Stell Wecker, Essenszeiten und Abl&auml;ufe Schritt f&uuml;r Schritt um.
            </p>
          </div>
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">So kommst du besser durch die Zeitumstellung</p>
            <ul className="text-sm text-text-secondary space-y-2 list-none">
              <li>&#10003; Schlaf schrittweise anpassen (2&ndash;3 Tage vorher)</li>
              <li>&#10003; Morgens <strong className="text-text-primary">Tageslicht</strong> nutzen</li>
              <li>&#10003; Tags&uuml;ber <strong className="text-text-primary">Bewegung</strong> einbauen</li>
              <li>&#10003; Abendroutine fr&uuml;her starten, Screens reduzieren</li>
              <li>&#10003; Wecker doppelt pr&uuml;fen</li>
              <li>&#10003; Termine am Montag nach der Umstellung bewusst <strong className="text-text-primary">lockerer planen</strong></li>
            </ul>
          </div>
        </section>

        {/* ── MEZ vs MESZ ── */}
        <section className="mb-12">
          <h2 id="mez-und-mesz-zeitzonen-in-deutschland" className="text-2xl font-bold mb-4">MEZ und MESZ &ndash; Zeitzonen in Deutschland</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Eigenschaft</th>
                  <th className="py-3 pr-4 font-semibold">MEZ (Winterzeit)</th>
                  <th className="py-3 font-semibold">MESZ (Sommerzeit)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Abk&uuml;rzung</td>
                  <td className="py-3 pr-4">MEZ (CET)</td>
                  <td className="py-3">MESZ (CEST)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">UTC-Offset</td>
                  <td className="py-3 pr-4">UTC+1</td>
                  <td className="py-3">UTC+2</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Zeitraum {year}</td>
                  <td className="py-3 pr-4">01.01. &ndash; {sommerzeit.dateFormatted} &amp; {winterzeit.dateFormatted} &ndash; 31.12.</td>
                  <td className="py-3">{sommerzeit.dateFormatted} &ndash; {winterzeit.dateFormatted}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Bezeichnung</td>
                  <td className="py-3 pr-4">Normalzeit</td>
                  <td className="py-3">Sommerzeit</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Tageslicht abends</td>
                  <td className="py-3 pr-4">Fr&uuml;her dunkel</td>
                  <td className="py-3">L&auml;nger hell</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── USA vs. Deutschland ── */}
        <section className="mb-12">
          <h2 id="warum-suchen-viele-nach-zeitumstellung" className="text-2xl font-bold mb-4">Warum suchen viele nach &bdquo;Zeitumstellung {year} am {usDST.formatted}&ldquo;?</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl mb-6">
            <p>
              Viele suchen nach &bdquo;Zeitumstellung {year} {usDST.formatted}&ldquo;, weil sich Termine aus den USA und Europa im Netz vermischen. In <strong className="text-text-primary">Deutschland</strong> und der <strong className="text-text-primary">EU</strong> findet die Umstellung im Fr&uuml;hjahr jedoch <strong className="text-text-primary">nicht</strong> am {usDST.formatted} statt. Hier gilt weiterhin die Regel: <strong className="text-text-primary">letzter Sonntag im M&auml;rz</strong>.
            </p>
            <p>
              In den <strong className="text-text-primary">USA</strong> startet die Sommerzeit meist fr&uuml;her. Dort beginnt die Daylight Saving Time am <strong className="text-text-primary">zweiten Sonntag im M&auml;rz</strong>. Deshalb taucht der {usDST.formatted} h&auml;ufig als Datum auf. Planst du internationale Calls, Reisen oder Livestreams, pr&uuml;fe immer Region und Zeitzone.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Region</th>
                  <th className="py-3 pr-4 font-semibold">Regel im Fr&uuml;hjahr</th>
                  <th className="py-3 font-semibold">Regel im Herbst</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Deutschland / EU</td>
                  <td className="py-3 pr-4">Letzter Sonntag im M&auml;rz ({year}: <strong className="text-accent">{sommerzeit.dateFormatted}</strong>)</td>
                  <td className="py-3">Letzter Sonntag im Oktober</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">USA</td>
                  <td className="py-3 pr-4">Zweiter Sonntag im M&auml;rz ({year}: <strong>{usDST.numeric}</strong>)</td>
                  <td className="py-3">Erster Sonntag im November</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Kalender-Reminder ── */}
        <section className="mb-12">
          <h2 id="kalender-reminder-termine-speichern" className="text-2xl font-bold mb-4">Kalender-Reminder: Termine speichern und nichts verpassen</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl">
            <p>
              Am einfachsten merkst du dir das Datum der Zeitumstellung {year}, wenn du dir zwei j&auml;hrliche Erinnerungen im Kalender speicherst. Lege je einen Termin Ende M&auml;rz und Ende Oktober an. Nenne die Termine direkt &bdquo;Uhr vor&ldquo; und &bdquo;Uhr zur&uuml;ck&ldquo;. So siehst du sofort, wann die Uhren umgestellt werden.
            </p>
            <p>
              Wenn deine Kalender-App es unterst&uuml;tzt, nutze eine ICS-Datei. Das spart Tipparbeit und verhindert typische Fehler beim Eintragen.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            <Link href="/datum-heute" className="text-accent hover:underline">Heutiges Datum pr&uuml;fen &rarr;</Link>
            <span className="text-border">&middot;</span>
            <Link href="/kalender-mit-wochen" className="text-accent hover:underline">Kalender {year} in Wochenansicht &rarr;</Link>
            <span className="text-border">&middot;</span>
            <Link href="/tagerechner" className="text-accent hover:underline">Tage bis zur Umstellung z&auml;hlen &rarr;</Link>
          </div>
        </section>

        {/* ── Cross-links ── */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/sommerzeit"
              className="block bg-card-bg border border-border rounded-2xl p-5 hover:border-accent transition-colors group"
            >
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Sommerzeit</p>
              <p className="text-lg font-semibold group-hover:text-accent transition-colors">
                Sommerzeit {year} &rarr;
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Wann beginnt die Sommerzeit? Alle Details zum {formatDateLongDE(sommerzeit.date)}.
              </p>
            </Link>
            <Link
              href="/winterzeit"
              className="block bg-card-bg border border-border rounded-2xl p-5 hover:border-accent transition-colors group"
            >
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Winterzeit</p>
              <p className="text-lg font-semibold group-hover:text-accent transition-colors">
                Winterzeit {year} &rarr;
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Wann beginnt die Winterzeit? Alle Details zum {formatDateLongDE(winterzeit.date)}.
              </p>
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-12">
          <h2 id="haeufige-fragen-zur-zeitumstellung" className="text-2xl font-bold mb-6">H&auml;ufige Fragen zur Zeitumstellung {year}</h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <details
                key={i}
                className="group bg-card-bg border border-border rounded-2xl overflow-hidden"
              >
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold flex items-center justify-between gap-4">
                  {faq.q}
                  <span className="text-text-secondary text-lg leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Abschlusstext ── */}
        <section className="mb-12 text-sm text-text-secondary leading-relaxed space-y-3 max-w-3xl mx-auto">
          <p>
            Merke dir f&uuml;r die <strong className="text-text-primary">Zeitumstellung {year}</strong> in Deutschland: Am <strong className="text-text-primary">{sommerzeit.dateFormatted}</strong> springt die Uhr von {sommerzeit.timeBefore} auf {sommerzeit.timeAfter} (Sommerzeit), am <strong className="text-text-primary">{winterzeit.dateFormatted}</strong> geht&apos;s von {winterzeit.timeBefore} auf {winterzeit.timeAfter} zur&uuml;ck (Winterzeit). Die oft gesuchte Angabe &bdquo;{usDST.formatted}&ldquo; bezieht sich auf die Umstellung in den USA, nicht auf Deutschland &ndash; und eine Abschaffung in der EU ist weiterhin nicht umgesetzt.
          </p>
          <p>
            Mach jetzt den Praxis-Check: Smartphone &amp; Computer stellen meist automatisch um, aber <strong className="text-text-primary">Auto, Backofen, Mikrowelle und manche Smart-Home-Setups</strong> brauchen oft Handarbeit. Trag dir die Termine direkt in den Kalender ein.
          </p>
        </section>

        <LastUpdated date={year === new Date().getFullYear() ? new Date() : new Date(`${year}-01-01`)} />
        {/* ── Weitere Links ── */}
        <nav className="flex flex-wrap gap-3 text-sm mb-8">
          <Link href="/" className="text-accent hover:underline">Aktuelle KW</Link>
          <span className="text-border">&middot;</span>
          <Link href="/datum-heute" className="text-accent hover:underline">Datum heute</Link>
          <span className="text-border">&middot;</span>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">Feiertage {year}</Link>
          <span className="text-border">&middot;</span>
          <Link href="/schaltjahr" className="text-accent hover:underline">Schaltjahr</Link>
          <span className="text-border">&middot;</span>
          <Link href="/faq" className="text-accent hover:underline">FAQ</Link>
        </nav>
      </div>
    </>
  );
}
