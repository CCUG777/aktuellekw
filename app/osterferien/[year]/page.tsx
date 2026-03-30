import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_YEARS } from "@/lib/constants";
import AuthorByline from "@/components/AuthorByline";
import {
  getEasterDate,
  addDays,
  getISOWeekNumber,
  formatDateDE,
  getDayNameDE,
  getBrueckentage,
} from "@/lib/feiertage";
import {
  getAllSchulferienForYear,
  formatDateShort,
  ferienDauer,
} from "@/lib/schulferien";

export const revalidate = 86400;

const OSTERFERIEN_YEARS = CONTENT_YEARS;

export function generateStaticParams() {
  return OSTERFERIEN_YEARS.map((y) => ({ year: String(y) }));
}

/* ── FAQs (aus Osterferien-2026.md, keyword-optimiert) ────────── */
const getOsterferienFAQs = (year: number) => [
  {
    question: `Wann sind die Osterferien ${year} in Deutschland?`,
    answer: `Die Osterferien ${year} liegen je nach Bundesland an unterschiedlichen Terminen. Es gibt keinen einheitlichen Zeitraum. Die genauen Daten für alle 16 Bundesländer finden Sie in der Tabelle auf dieser Seite.`,
  },
  {
    question: `Wann sind die Osterferien ${year} in NRW?`,
    answer: `Die Osterferien ${year} in Nordrhein-Westfalen werden vom Schulministerium NRW festgelegt. Den genauen Start- und Endtermin finden Sie in der Osterferien-Tabelle. Zusätzlich können Schulen einzelne bewegliche Ferientage festlegen.`,
  },
  {
    question: `Wann sind die Osterferien ${year} in Bayern?`,
    answer: `Die Osterferien ${year} in Bayern werden vom Bayerischen Kultusministerium festgelegt und können zeitlich von anderen Bundesländern abweichen. Den exakten Zeitraum finden Sie in der Bayern-Zeile der Tabelle.`,
  },
  {
    question: `Warum sind die Osterferien ${year} je Bundesland unterschiedlich?`,
    answer: `Die Osterferien sind Ländersache – jedes Bundesland legt seine Schulferien eigenständig fest. Dabei werden regionale Besonderheiten berücksichtigt und die Termine über die KMK abgestimmt, damit nicht alle Ferien gleichzeitig stattfinden.`,
  },
  {
    question: `Gibt es ${year} bewegliche Ferientage zusätzlich zu den Osterferien?`,
    answer: `Ja, in vielen Bundesländern gibt es zusätzlich bewegliche Ferientage, die unabhängig von den Osterferien liegen können. Ob und wie viele, hängt vom Bundesland und teils auch von der einzelnen Schule ab.`,
  },
  {
    question: "Wo finde ich die offiziellen Schulferientermine?",
    answer:
      "Die offiziellen Schulferientermine finden Sie auf den Websites der Kultus- oder Schulministerien Ihres Bundeslands. Alternativ bieten amtliche Ferientabellen die Termine nach Bundesland gebündelt an.",
  },
  {
    question: `Können Schulen in den Osterferien ${year} eigene freie Tage festlegen?`,
    answer: `Schulen können in der Regel nicht zusätzliche Osterferien festlegen, da die Ferientermine landesweit geregelt sind. Möglich sind aber schulinterne freie Tage im Rahmen der Vorgaben, z.\u00a0B. über bewegliche Ferientage oder pädagogische Tage.`,
  },
];

/* ── Metadata (Cluster 3: Osterferien, SISTRIX 449px ✅) ────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  if (isNaN(year) || year < 2020 || year > 2100)
    return { title: "Nicht gefunden" };

  const easter = getEasterDate(year);
  const easterDateStr = formatDateDE(easter);

  const title = `Osterferien ${year} – Alle Bundesländer im Überblick`;
  const description = `Osterferien ${year}: Termine für alle 16 Bundesländer auf einen Blick. Wann sind Osterferien in NRW, Bayern & Co.? Plus Brückentage, Planungstipps & FAQ.`;
  const url = `https://aktuellekw.de/osterferien/${year}`;
  const currentYear = new Date().getFullYear();
  const isCurrentYear = year === currentYear;

  return {
    title,
    description,
    ...(!isCurrentYear && {
      robots: { index: false, follow: true },
    }),
    alternates: { canonical: isCurrentYear ? url : `https://aktuellekw.de/osterferien/${currentYear}` },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ── Page Component ────────────────────────────────────────────── */
export default async function OsterferienPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  if (isNaN(year) || year < 2020 || year > 2100) notFound();

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const currentYear = todayUTC.getUTCFullYear();

  /* ── Easter dates ──────────────────────────────────────────── */
  const easter = getEasterDate(year);
  const karfreitag = addDays(easter, -2);
  const ostermontag = addDays(easter, 1);
  const easterKW = getISOWeekNumber(easter);

  /* ── Osterferien aus Schulferien-Daten ──────────────────────── */
  const allSchulferien = await getAllSchulferienForYear(year);
  const osterferienData = allSchulferien
    .map((sf) => {
      const osterferien = sf.ferien.find((f) => f.typeId === 4);
      return osterferien
        ? {
            bundesland: sf.bundesland,
            code: sf.code,
            slug: sf.slug,
            start: osterferien.starts_on,
            end: osterferien.ends_on,
            dauer: ferienDauer(osterferien.starts_on, osterferien.ends_on),
          }
        : null;
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .sort((a, b) => a.start.localeCompare(b.start));

  /* ── NRW & Bayern highlight ─────────────────────────────────── */
  const nrwData = osterferienData.find((d) => d.code === "NW");
  const bayernData = osterferienData.find((d) => d.code === "BY");

  /* ── Brückentage rund um Ostern ──────────────────────────────── */
  const allBrueckentage = getBrueckentage(year);
  const osterBrueckentage = allBrueckentage.filter(
    (b) =>
      b.feiertag === "Karfreitag" ||
      b.feiertag === "Ostermontag" ||
      b.feiertag === "Christi Himmelfahrt"
  );

  /* ── Year navigation ────────────────────────────────────────── */
  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = OSTERFERIEN_YEARS.includes(prevYear);
  const hasNext = OSTERFERIEN_YEARS.includes(nextYear);

  /* ── FAQs ───────────────────────────────────────────────────── */
  const faqs = getOsterferienFAQs(year);

  /* ── JSON-LD ────────────────────────────────────────────────── */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `https://aktuellekw.de/osterferien/${year}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://aktuellekw.de" },
        { "@type": "ListItem", position: 2, name: `Schulferien ${year}`, item: `https://aktuellekw.de/schulferien/${year}` },
        { "@type": "ListItem", position: 3, name: `Osterferien ${year}`, item: `https://aktuellekw.de/osterferien/${year}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `https://aktuellekw.de/osterferien/${year}#dataset`,
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: `${year}-01-01`,
      dateModified: year === new Date().getFullYear() ? new Date().toISOString().split("T")[0] : `${year}-01-01`,
      name: `Osterferien ${year} – Termine nach Bundesland`,
      description: `Schulferien rund um Ostern ${year} für alle 16 Bundesländer in Deutschland.`,
      temporalCoverage: `${year}-01-01/${year}-12-31`,
      creator: { "@id": "https://aktuellekw.de/#organization" },
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `https://aktuellekw.de/osterferien/${year}#faqpage`,
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      mainEntity: faqs.map((f) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-accent transition-colors">Startseite</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <Link href={`/schulferien/${year}`} className="hover:text-accent transition-colors">Schulferien {year}</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Osterferien {year}</span>
        </nav>

        {/* ── Year Navigation ─────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          {hasPrev ? (
            <Link href={`/osterferien/${prevYear}`} className="text-sm text-accent hover:underline">
              &larr; Osterferien {prevYear}
            </Link>
          ) : <span />}
          {hasNext ? (
            <Link href={`/osterferien/${nextYear}`} className="text-sm text-accent hover:underline">
              Osterferien {nextYear} &rarr;
            </Link>
          ) : <span />}
        </div>

        {/* ── H1 + Intro ──────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Osterferien {year}: Alle Bundesl&auml;nder im &Uuml;berblick
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Die <strong className="text-text-primary">Osterferien {year}</strong> liegen je
            nach Bundesland an unterschiedlichen Terminen. Hier findest du den
            schnellen Komplett-&Uuml;berblick: eine Tabelle mit allen 16 L&auml;ndern auf
            einen Blick. Gemeint sind die Schulferien rund um{" "}
            <Link href={`/ostern/${year}`} className="text-accent hover:underline">Ostern {year}</Link>{" "}
            (Ostersonntag am {formatDateDE(easter)}, KW&nbsp;{easterKW}), oft erg&auml;nzt
            durch bewegliche Ferientage oder regionale Abweichungen.
          </p>
          <p>
            Zus&auml;tzlich findest du kompakte Detailboxen zu{" "}
            <strong className="text-text-primary">Osterferien NRW {year}</strong> und{" "}
            <strong className="text-text-primary">Osterferien Bayern {year}</strong>,
            erf&auml;hrst, wie die Termine zustande kommen, und bekommst Tipps
            f&uuml;r <strong className="text-text-primary">Br&uuml;ckentage</strong> rund
            um die Osterferien.
          </p>
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Ostersonntag", value: formatDateDE(easter) },
            { label: "Kalenderwoche", value: `KW ${easterKW}` },
            { label: "Bundesländer", value: String(osterferienData.length) },
            { label: "Ges. Feiertage", value: "2" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-secondary border border-border rounded-xl px-4 py-3 text-center"
            >
              <div className="text-lg md:text-xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-text-secondary mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Osterferien-Tabelle ──────────────────────────────── */}
        <div>
          <h2 className="text-2xl font-semibold mb-4" id="osterferien-termine-nach-bundesland">
            Osterferien {year}: Termine nach Bundesland
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            <strong className="text-text-primary">Wann sind Osterferien {year}?</strong>{" "}
            Die Tabelle zeigt dir schnell, wann die Ferien in deinem Bundesland
            starten und enden. NRW und Bayern sind hervorgehoben.
          </p>

          {osterferienData.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Bundesland</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Beginn</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Ende</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Dauer</th>
                  </tr>
                </thead>
                <tbody>
                  {osterferienData.map((d) => {
                    const isHighlight = d.code === "NW" || d.code === "BY";
                    return (
                      <tr
                        key={d.code}
                        className={`border-b border-border last:border-b-0 ${isHighlight ? "bg-accent/5" : ""}`}
                      >
                        <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                          <Link
                            href={`/schulferien/${year}/${d.slug}`}
                            className="text-accent hover:underline"
                          >
                            {d.bundesland}
                          </Link>
                          {isHighlight && (
                            <span className="ml-1.5 text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                              Top
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {formatDateShort(d.start)}
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {formatDateShort(d.end)}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{d.dauer} Tage</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary">
              F&uuml;r {year} liegen noch keine Osterferien-Termine vor.
            </div>
          )}

          <p className="text-text-secondary text-xs mt-2">
            Stand: offizielle Ferientermine der Bundesl&auml;nder (KMK/Schulministerien).
            Einige Bundesl&auml;nder erg&auml;nzen die Osterzeit durch bewegliche Ferientage.
            Alle Schulferien:{" "}
            <Link href={`/schulferien/${year}`} className="text-accent hover:underline">
              Schulferien {year}
            </Link>
          </p>
        </div>

        {/* ── NRW Detail ──────────────────────────────────────── */}
        {nrwData && (
          <div className="mt-14">
            <h2 className="text-2xl font-semibold mb-4" id="osterferien-nrw-termin-und-dauer">
              Osterferien NRW {year}: Termin &amp; Dauer
            </h2>
            <div className="bg-surface-secondary border border-border rounded-xl p-5 text-sm text-text-secondary">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-text-secondary">Beginn</div>
                  <div className="text-text-primary font-medium">{formatDateShort(nrwData.start)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Ende</div>
                  <div className="text-text-primary font-medium">{formatDateShort(nrwData.end)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Dauer</div>
                  <div className="text-text-primary font-medium">{nrwData.dauer} Tage</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Quelle</div>
                  <div className="text-text-primary font-medium">Schulministerium NRW</div>
                </div>
              </div>
              <p>
                Zus&auml;tzlich k&ouml;nnen Schulen in NRW einzelne freie Tage &uuml;ber{" "}
                <strong className="text-text-primary">bewegliche Ferientage</strong> festlegen.
                Plane Urlaub und Betreuung fr&uuml;hzeitig &ndash; Ferienprogramme sind
                h&auml;ufig schnell ausgebucht.
              </p>
              <p className="mt-2">
                Details:{" "}
                <Link href={`/schulferien/${year}/nordrhein-westfalen`} className="text-accent hover:underline">
                  Schulferien NRW {year}
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* ── Bayern Detail ───────────────────────────────────── */}
        {bayernData && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4" id="osterferien-bayern-termin-und-dauer">
              Osterferien Bayern {year}: Termin &amp; Dauer
            </h2>
            <div className="bg-surface-secondary border border-border rounded-xl p-5 text-sm text-text-secondary">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-text-secondary">Beginn</div>
                  <div className="text-text-primary font-medium">{formatDateShort(bayernData.start)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Ende</div>
                  <div className="text-text-primary font-medium">{formatDateShort(bayernData.end)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Dauer</div>
                  <div className="text-text-primary font-medium">{bayernData.dauer} Tage</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Quelle</div>
                  <div className="text-text-primary font-medium">Bay. Kultusministerium</div>
                </div>
              </div>
              <p>
                Bayern hat teilweise andere Ferienzeitr&auml;ume als andere Bundesl&auml;nder,
                weil die Schulferien in Deutschland L&auml;ndersache sind. Die L&auml;nder
                stimmen sich &uuml;ber die KMK ab, damit nicht alle Ferien gleichzeitig
                stattfinden.
              </p>
              <p className="mt-2">
                Details:{" "}
                <Link href={`/schulferien/${year}/bayern`} className="text-accent hover:underline">
                  Schulferien Bayern {year}
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* ── Wie kommen die Termine zustande? ─────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="wann-sind-die-osterferien-so-kommen-die-termine-zustande">
            Wann sind die Osterferien {year}? So kommen die Termine zustande
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              In Deutschland sind die Osterferien L&auml;ndersache. Jedes Bundesland legt
              seine Ferientermine selbst fest. Damit sich die Ferienzeiten nicht zu stark
              &uuml;berschneiden, stimmen sich die L&auml;nder &uuml;ber die{" "}
              <strong className="text-text-primary">KMK-Rahmenplanung</strong> ab.
            </p>
            <p>
              Die Termine liegen in der Regel rund um das{" "}
              <Link href={`/ostern/${year}`} className="text-accent hover:underline">
                Osterwochenende {year}
              </Link>{" "}
              (Karfreitag {formatDateDE(karfreitag)} bis Ostermontag {formatDateDE(ostermontag)}),
              k&ouml;nnen sich aber je nach Bundesland sp&uuml;rbar unterscheiden. Entscheidend
              ist, in welchem Bundesland das Kind zur Schule geht.
            </p>
            <p>
              Neben den offiziellen Ferientagen verl&auml;ngern oft{" "}
              <strong className="text-text-primary">bewegliche Ferientage</strong> oder
              schulinterne unterrichtsfreie Tage die freie Zeit.
            </p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mt-4">
            <strong className="text-text-primary">Checkliste: Osterferien {year} sicher pr&uuml;fen</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Termin f&uuml;r dein Bundesland im offiziellen Ferienkalender pr&uuml;fen</li>
              <li>Schulinterne Regelungen direkt bei der Schule nachsehen</li>
              <li>Bewegliche Ferientage und m&ouml;gliche Br&uuml;ckentage einplanen</li>
              <li>Lokale Feiertage am Wohnort ber&uuml;cksichtigen</li>
              <li>Betreuung und eigenen Urlaub fr&uuml;hzeitig abstimmen</li>
            </ul>
          </div>
        </div>

        {/* ── Osterferien vs. bewegliche Ferientage ────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="osterferien-und-bewegliche-ferientage-was-ist-der-unterschied">
            Osterferien und bewegliche Ferientage: Was ist der Unterschied?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              <strong className="text-text-primary">Osterferien</strong> sind der zusammenh&auml;ngende
              Ferienzeitraum, den das Bundesland festlegt (z.&nbsp;B. zwei Wochen am St&uuml;ck).{" "}
              <strong className="text-text-primary">Bewegliche Ferientage</strong> sind einzelne
              freie Schultage, die vor, nach oder zwischen Ferientagen liegen k&ouml;nnen.
            </p>
            <p>
              In manchen Bundesl&auml;ndern gibt es keine zusammenh&auml;ngenden Osterferien,
              sondern nur einzelne Ferientage rund um Ostern. Ma&szlig;geblich sind immer die
              aktuellen Ver&ouml;ffentlichungen des zust&auml;ndigen Schulministeriums.
            </p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <strong className="text-text-primary">Osterferien</strong>
                <p className="mt-1">Zusammenh&auml;ngender Ferienzeitraum (z.&nbsp;B. 1&ndash;2 Wochen)</p>
              </div>
              <div>
                <strong className="text-text-primary">Bewegliche Ferientage</strong>
                <p className="mt-1">Einzelne freie Schultage, flexibel von Schulen festgelegt</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Brückentage rund um Osterferien ──────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="brueckentage-rund-um-die-osterferien">
            Br&uuml;ckentage rund um die Osterferien {year}
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-4">
            <p>
              Mit <strong className="text-text-primary">Br&uuml;ckentagen</strong> kombinierst du
              Feiertage, Wochenenden und Osterferien mit wenigen Urlaubstagen. So wird aus dem
              normalen Ferienblock eine l&auml;ngere Auszeit. Die gesetzlichen Feiertage rund
              um Ostern findest du auf der{" "}
              <Link href={`/ostern/${year}`} className="text-accent hover:underline">
                Ostern-&Uuml;bersicht {year}
              </Link>.
            </p>
          </div>

          {/* Basispaket */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mb-4">
            <strong className="text-text-primary">Basispaket Ostern:</strong>{" "}
            Karfreitag ({formatDateDE(karfreitag)}) + Wochenende + Ostermontag ({formatDateDE(ostermontag)})
            = <strong className="text-accent">4 freie Tage</strong> ohne einen einzigen Urlaubstag.
          </div>

          {osterBrueckentage.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Feiertag</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Tipp</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Urlaub</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Frei</th>
                  </tr>
                </thead>
                <tbody>
                  {osterBrueckentage.map((b, i) => (
                    <tr key={i} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{b.feiertag}</td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateDE(b.feiertagDate)}</td>
                      <td className="px-4 py-3 text-text-secondary">{b.tipp}</td>
                      <td className="px-4 py-3 text-accent font-semibold text-center">{b.urlaubstage}</td>
                      <td className="px-4 py-3 text-text-primary font-semibold text-center">{b.freieTage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-text-secondary text-xs mt-2">
            Mehr Br&uuml;ckentage f&uuml;r das ganze Jahr:{" "}
            <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
              Feiertage {year}
            </Link>
          </p>
        </div>

        {/* ── Tipps für Eltern ─────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="praktische-tipps-fuer-eltern-osterferien-planen">
            Praktische Tipps f&uuml;r Eltern: Osterferien {year} planen
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Kl&auml;re zuerst die Betreuung &ndash; viele Programme sind schnell ausgebucht.
              Frage fr&uuml;hzeitig im Hort, bei Sportvereinen oder &uuml;ber Familienhilfe
              nach freien Pl&auml;tzen.
            </p>
            <p>
              F&uuml;r Reisen: Plane an typischen Sto&szlig;zeiten mehr Verkehr ein und w&auml;hle
              wenn m&ouml;glich flexible An- und Abreise. Denke an &Ouml;ffnungszeiten von
              Museen, Schwimmb&auml;dern und Arztpraxen &ndash; besonders an Feiertagen.
            </p>
            <p>
              In der Schule lohnt sich ein kurzer Check: Notiere Hausaufgaben, Projekte
              und m&ouml;gliche Pr&uuml;fungstermine. Es gilt Schulpflicht &ndash; Beurlaubungen
              nur nach den Regeln der Schule beantragen.
            </p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mt-4">
            <strong className="text-text-primary">Checkliste: Osterferien-Planung</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Betreuung anfragen und Termine fixieren</li>
              <li>Fahrten und Unterk&uuml;nfte verbindlich buchen</li>
              <li>Ausweise, Krankenkassenkarte und Impfpass pr&uuml;fen</li>
              <li>Lernplan: kurze Lerneinheiten festlegen</li>
              <li>&Ouml;ffnungszeiten und wichtige Kontakte notieren</li>
            </ul>
          </div>
        </div>

        {/* ── Ostern-Feiertage Kurzübersicht ───────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4" id="osterfeiertage-und-ndash-fuer-die-ferienplanung">
            Osterfeiertage {year} &ndash; f&uuml;r die Ferienplanung
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Diese gesetzlichen Feiertage liegen in oder direkt neben den Osterferien {year}:
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Feiertag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Wochentag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">KW</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Karfreitag", date: karfreitag },
                  { name: "Ostersonntag", date: easter },
                  { name: "Ostermontag", date: ostermontag },
                ].map((f, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                      {f.name === "Ostermontag" ? (
                        <Link href={`/ostermontag/${year}`} className="text-accent hover:underline">{f.name}</Link>
                      ) : f.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateDE(f.date)}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{getDayNameDE(f.date)}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      <Link href={`/kw/${getISOWeekNumber(f.date)}-${year}`} className="text-accent hover:underline">
                        KW&nbsp;{getISOWeekNumber(f.date)}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            Alle Feiertage:{" "}
            <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
              Feiertage {year}
            </Link>{" "}
            &middot; Details:{" "}
            <Link href={`/ostermontag/${year}`} className="text-accent hover:underline">
              Ostermontag {year}
            </Link>
          </p>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5" id="haeufige-fragen-zu-den-osterferien">
            H&auml;ufige Fragen zu den Osterferien {year}
          </h2>
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
        </div>

        {/* ── Author Byline ─────────────────────────── */}
        <AuthorByline date={year === new Date().getFullYear() ? new Date() : new Date(`${year}-01-01`)} />

        {/* ── Year Navigation (bottom) ────────────────────────── */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Link href={`/osterferien/${prevYear}`} className="text-sm text-accent hover:underline">
              &larr; Osterferien {prevYear}
            </Link>
          ) : <span />}
          {hasNext ? (
            <Link href={`/osterferien/${nextYear}`} className="text-sm text-accent hover:underline">
              Osterferien {nextYear} &rarr;
            </Link>
          ) : <span />}
        </div>

        {/* ── Abschluss-Links ─────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">&larr; Aktuelle KW</Link>
          <Link href={`/ostern/${year}`} className="text-accent hover:underline">Ostern {year} &rarr;</Link>
          <Link href={`/ostermontag/${year}`} className="text-accent hover:underline">Ostermontag {year} &rarr;</Link>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">Feiertage {year} &rarr;</Link>
          <Link href={`/schulferien/${year}`} className="text-accent hover:underline">Schulferien {year} &rarr;</Link>
          <Link href="/faq" className="text-accent hover:underline">FAQ &rarr;</Link>
        </div>
      </section>
    </>
  );
}
