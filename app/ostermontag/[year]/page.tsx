import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_YEARS } from "@/lib/constants";
import {
  getEasterDate,
  addDays,
  getISOWeekNumber,
  formatDateDE,
  getDayNameDE,
} from "@/lib/feiertage";

export const revalidate = 86400;

const OSTERMONTAG_YEARS = CONTENT_YEARS;

export function generateStaticParams() {
  return OSTERMONTAG_YEARS.map((y) => ({ year: String(y) }));
}

/* ── FAQs (aus Ostermontag.md, keyword-optimiert) ─────────────── */
const getOstermontagFAQs = (year: number) => {
  const easter = getEasterDate(year);
  const ostermontag = addDays(easter, 1);
  const karfreitag = addDays(easter, -2);
  const gruendonnerstag = addDays(easter, -3);

  return [
    {
      question: `Wann ist Ostermontag ${year}?`,
      answer: `Ostermontag ${year} ist am ${formatDateDE(ostermontag)} (${getDayNameDE(ostermontag)}). Das Datum hängt jedes Jahr vom Ostertermin ab – Ostermontag liegt immer einen Tag nach Ostersonntag.`,
    },
    {
      question: "Ist Ostermontag ein gesetzlicher Feiertag in Deutschland?",
      answer:
        "Ja, Ostermontag ist in Deutschland ein gesetzlicher Feiertag. Er gilt bundesweit in allen 16 Bundesländern. Für Arbeit, Schule und Öffnungszeiten gelten die üblichen Feiertagsregelungen.",
    },
    {
      question: "Was feiern wir am Ostermontag?",
      answer:
        "Am Ostermontag wird im christlichen Kontext die Osterbotschaft weiter gefeiert. Inhaltlich steht die Begegnung des auferstandenen Jesus mit seinen Jüngern im Mittelpunkt (Emmaus-Erzählung). Für viele ist Ostermontag ein Tag für Familie, Ausflüge und Osterbräuche.",
    },
    {
      question: "Was ist der Unterschied zwischen Ostersonntag und Ostermontag?",
      answer:
        "Ostersonntag ist der zentrale Ostertag und steht für die Auferstehung Jesu. Ostermontag setzt die Osterfeier fort – er erinnert an die Emmaus-Erzählung. Praktisch ist Ostermontag in Deutschland ein gesetzlicher Feiertag, während Ostersonntag (außer in Brandenburg) kein zusätzlicher gesetzlicher Feiertag ist.",
    },
    {
      question: `Ist Gründonnerstag ${year} ein Feiertag?`,
      answer: `Gründonnerstag ${year} (${formatDateDE(gruendonnerstag)}) ist in Deutschland in der Regel kein gesetzlicher Feiertag. Je nach Bundesland oder Arbeitgeber kann es Sonderregeln geben, z.\u00a0B. verkürzte Arbeitszeiten.`,
    },
    {
      question: `Ist Karfreitag ${year} ein Feiertag in Deutschland?`,
      answer: `Ja, Karfreitag ${year} (${formatDateDE(karfreitag)}) ist ein gesetzlicher Feiertag in Deutschland. Er gilt bundesweit und ist ein stiller Feiertag, an dem besondere Regeln für Veranstaltungen gelten.`,
    },
    {
      question: "Haben Geschäfte am Ostermontag geöffnet?",
      answer:
        "Meistens sind Geschäfte am Ostermontag geschlossen, weil er ein gesetzlicher Feiertag ist. Ausnahmen gibt es an Bahnhöfen, Flughäfen, bei Tankstellen und Kiosken. Für genaue Infos gelten die lokalen Feiertagsregelungen.",
    },
    {
      question: "Ist Ostermontag in Österreich ein Feiertag?",
      answer:
        "Ja, Ostermontag ist in Österreich ein gesetzlicher Feiertag. In der Schweiz haben viele Kantone frei, allerdings ist die Regelung nicht einheitlich.",
    },
  ];
};

/* ── Metadata (Cluster 2: Feiertage, SISTRIX 441px ✅) ────────── */
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
  const ostermontag = addDays(easter, 1);

  const title = `Ostermontag ${year}: Datum, Feiertag & Bedeutung`;
  const description = `Ostermontag ${year} am ${formatDateDE(ostermontag)} – gesetzlicher Feiertag in ganz Deutschland. Bedeutung, Bräuche, Öffnungszeiten & alle Osterfeiertage im Überblick.`;
  const url = `https://aktuellekw.de/ostermontag/${year}`;

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
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ── Page Component ────────────────────────────────────────────── */
export default async function OstermontagPage({
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

  /* ── Dates ──────────────────────────────────────────────────── */
  const easter = getEasterDate(year);
  const gruendonnerstag = addDays(easter, -3);
  const karfreitag = addDays(easter, -2);
  const ostersamstag = addDays(easter, -1);
  const ostermontag = addDays(easter, 1);
  const himmelfahrt = addDays(easter, 39);
  const pfingstmontag = addDays(easter, 50);
  const fronleichnam = addDays(easter, 60);

  const ostermontagKW = getISOWeekNumber(ostermontag);

  /* ── Countdown ──────────────────────────────────────────────── */
  const daysUntil = Math.ceil(
    (ostermontag.getTime() - todayUTC.getTime()) / 86400000
  );
  const isPast = daysUntil < 0;
  const isToday = daysUntil === 0;

  /* ── Karwoche + Osterfeiertage Tabelle ──────────────────────── */
  const karwocheRows = [
    {
      name: "Gründonnerstag",
      date: gruendonnerstag,
      status: "kein Feiertag",
      gesetzlich: false,
    },
    {
      name: "Karfreitag",
      date: karfreitag,
      status: "gesetzlicher Feiertag",
      gesetzlich: true,
    },
    {
      name: "Ostersamstag",
      date: ostersamstag,
      status: "kein Feiertag",
      gesetzlich: false,
    },
    {
      name: "Ostersonntag",
      date: easter,
      status: "nur in Brandenburg",
      gesetzlich: false,
    },
    {
      name: "Ostermontag",
      date: ostermontag,
      status: "gesetzlicher Feiertag",
      gesetzlich: true,
      highlight: true,
    },
  ];

  /* ── Feiertage im April ─────────────────────────────────────── */
  const aprilFeiertage = [
    { name: "Karfreitag", date: karfreitag, status: "bundesweit" },
    { name: "Ostersonntag", date: easter, status: "Sonntag (nur Brandenburg gesetzl.)" },
    { name: "Ostermontag", date: ostermontag, status: "bundesweit" },
  ];

  /* ── Year navigation ────────────────────────────────────────── */
  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = OSTERMONTAG_YEARS.includes(prevYear);
  const hasNext = OSTERMONTAG_YEARS.includes(nextYear);

  /* ── FAQs ───────────────────────────────────────────────────── */
  const faqs = getOstermontagFAQs(year);

  /* ── JSON-LD ────────────────────────────────────────────────── */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://aktuellekw.de" },
        { "@type": "ListItem", position: 2, name: "Feiertage", item: "https://aktuellekw.de/feiertage" },
        { "@type": "ListItem", position: 3, name: `Ostern ${year}`, item: `https://aktuellekw.de/ostern/${year}` },
        { "@type": "ListItem", position: 4, name: `Ostermontag ${year}`, item: `https://aktuellekw.de/ostermontag/${year}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      inLanguage: "de-DE",
      name: `Ostermontag ${year}`,
      description: `Ostermontag ${year} – gesetzlicher Feiertag am ${formatDateDE(ostermontag)} in Deutschland.`,
      startDate: ostermontag.toISOString().split("T")[0],
      endDate: ostermontag.toISOString().split("T")[0],
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Deutschland",
        address: { "@type": "PostalAddress", addressCountry: "DE" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "de-DE",
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
          <Link href="/feiertage" className="hover:text-accent transition-colors">Feiertage</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <Link href={`/ostern/${year}`} className="hover:text-accent transition-colors">Ostern {year}</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Ostermontag {year}</span>
        </nav>

        {/* ── Year Navigation ─────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          {hasPrev ? (
            <Link href={`/ostermontag/${prevYear}`} className="text-sm text-accent hover:underline">
              &larr; Ostermontag {prevYear}
            </Link>
          ) : <span />}
          {hasNext ? (
            <Link href={`/ostermontag/${nextYear}`} className="text-sm text-accent hover:underline">
              Ostermontag {nextYear} &rarr;
            </Link>
          ) : <span />}
        </div>

        {/* ── H1 ──────────────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Ostermontag {year}: Datum, Feiertag &amp; Bedeutung
        </h1>

        {/* ── Intro ───────────────────────────────────────────── */}
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Ostermontag {year} f&auml;llt auf{" "}
            <strong className="text-text-primary">{getDayNameDE(ostermontag)}, den {formatDateDE(ostermontag)}</strong> &ndash;
            und ist in <strong className="text-text-primary">ganz Deutschland ein gesetzlicher Feiertag</strong>.
            Zusammen mit Karfreitag ergibt sich ein langes Osterwochenende mit mindestens 4 freien Tagen.
            Inhaltlich geh&ouml;rt der Ostermontag zur Osterzeit: Christlich erinnert er an die
            Begegnungen mit dem auferstandenen Jesus, besonders an die Emmausgeschichte.
          </p>
          <p>
            Hier findest du alles Wichtige: <strong className="text-text-primary">Datum und Kalenderwoche</strong>,
            den Feiertagsstatus in allen Bundesl&auml;ndern, die{" "}
            <Link href={`/ostern/${year}`} className="text-accent hover:underline">Osterfeiertage {year}</Link>{" "}
            im &Uuml;berblick, typische <strong className="text-text-primary">Ostermontag-Br&auml;uche</strong> sowie
            die wichtigsten Alltagsfragen zu Arbeit, Schule und &Ouml;ffnungszeiten.
          </p>
        </div>

        {/* ── Hero-Box ────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-secondary p-6 md:p-8 mb-10">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">
              Ostermontag {year}
            </div>
            <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
              {formatDateDE(ostermontag)}
            </div>
            <div className="text-lg text-text-secondary">
              {getDayNameDE(ostermontag)} &middot; Kalenderwoche {ostermontagKW}
            </div>
            <div className="text-sm text-green-500 font-medium mt-2">
              &#10003; Gesetzlicher Feiertag &ndash; bundesweit
            </div>

            {year === currentYear && (
              <div className="mt-4 inline-block bg-accent/10 border border-accent/20 rounded-full px-5 py-2 text-sm">
                {isToday ? (
                  <span className="text-accent font-semibold">Heute ist Ostermontag!</span>
                ) : isPast ? (
                  <span className="text-text-secondary">
                    Ostermontag {year} war vor{" "}
                    <strong className="text-text-primary">{Math.abs(daysUntil)}</strong> Tagen
                  </span>
                ) : (
                  <span className="text-text-secondary">
                    Noch <strong className="text-accent">{daysUntil}</strong>{" "}
                    {daysUntil === 1 ? "Tag" : "Tage"} bis Ostermontag
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Datum", value: formatDateDE(ostermontag) },
            { label: "Wochentag", value: getDayNameDE(ostermontag) },
            { label: "Kalenderwoche", value: `KW ${ostermontagKW}` },
            { label: "Status", value: "Feiertag" },
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

        {/* ── Warum wechselt das Datum? ───────────────────────── */}
        <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mb-10">
          <strong className="text-text-primary">Warum wechselt das Datum jedes Jahr?</strong>{" "}
          Ostern ist ein beweglicher Feiertag. Das Datum richtet sich nach dem
          ersten Vollmond nach Fr&uuml;hlingsanfang (21.&nbsp;M&auml;rz).
          Der darauffolgende Sonntag ist Ostersonntag &ndash; und der Montag danach
          ist Ostermontag. Dadurch kann Ostern zwischen Ende M&auml;rz und Ende April liegen.
          Alle Daten findest du in der{" "}
          <Link href={`/ostern/${year}`} className="text-accent hover:underline">&Uuml;bersicht Ostern {year}</Link>.
        </div>

        {/* ── Karwoche & Osterfeiertage Tabelle ───────────────── */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Karwoche &amp; Osterfeiertage {year} im &Uuml;berblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Von <strong className="text-text-primary">Gr&uuml;ndonnerstag</strong> bis{" "}
            <strong className="text-text-primary">Ostermontag</strong>: Welche Tage sind {year} gesetzliche
            Feiertage? Karfreitag und Ostermontag gelten bundesweit, Ostersonntag nur in Brandenburg.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Tag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Wochentag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">KW</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {karwocheRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border last:border-b-0 ${
                      row.highlight ? "bg-accent/10 font-semibold" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-text-primary whitespace-nowrap">{row.name}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateDE(row.date)}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{getDayNameDE(row.date)}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      <Link href={`/kw/${getISOWeekNumber(row.date)}-${year}`} className="text-accent hover:underline">
                        KW&nbsp;{getISOWeekNumber(row.date)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {row.gesetzlich ? (
                        <span className="text-green-500 font-medium">&#10003; {row.status}</span>
                      ) : (
                        <span className="text-text-secondary">{row.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Gesetzlicher Feiertag ───────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Ist Ostermontag ein gesetzlicher Feiertag in Deutschland?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              <strong className="text-text-primary">Ja</strong> &ndash; Ostermontag ist in{" "}
              <strong className="text-text-primary">allen 16 Bundesl&auml;ndern</strong> ein
              gesetzlicher Feiertag. Die rechtliche Grundlage bilden die Sonn- und
              Feiertagsgesetze der L&auml;nder. Im Unterschied zu regionalen Feiertagen wie
              Fronleichnam oder dem Reformationstag gilt Ostermontag &uuml;berall.
            </p>
            <p>
              In der Praxis bedeutet das: Schulen haben frei, die meisten Gesch&auml;fte bleiben
              geschlossen und Arbeitnehmer sind in der Regel freigestellt. Ausnahmen gelten f&uuml;r
              Gastronomie, Pflege, Notdienste und Teile der Versorgung. Dort greifen
              h&auml;ufig Sonderregelungen mit Zuschl&auml;gen.
            </p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mt-4">
            <strong className="text-text-primary">Checkliste: Gilt der Feiertag f&uuml;r mich?</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong className="text-text-primary">Arbeitnehmer:</strong> meist frei, au&szlig;er bei Schichtbetrieb</li>
              <li><strong className="text-text-primary">Sch&uuml;ler:</strong> schulfrei</li>
              <li><strong className="text-text-primary">Selbstst&auml;ndige:</strong> keine Pflichtpause, aber Vorgaben beachten</li>
              <li><strong className="text-text-primary">Gastronomie/Notdienste:</strong> Betrieb m&ouml;glich, h&auml;ufig Zuschl&auml;ge</li>
              <li><strong className="text-text-primary">&Ouml;PNV:</strong> Feiertagsfahrplan, oft reduzierte Frequenzen</li>
            </ul>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            Alle gesetzlichen Feiertage {year} findest du in der{" "}
            <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
              &Uuml;bersicht Feiertage {year}
            </Link>.
          </p>
        </div>

        {/* ── AT/CH Vergleich ─────────────────────────────────── */}
        <div className="mt-10 bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary">
          <strong className="text-text-primary">Ostermontag in &Ouml;sterreich &amp; der Schweiz</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li><strong className="text-text-primary">Deutschland:</strong> bundesweit gesetzlicher Feiertag</li>
            <li><strong className="text-text-primary">&Ouml;sterreich:</strong> gesetzlicher Feiertag</li>
            <li><strong className="text-text-primary">Schweiz:</strong> oft frei, aber kantonal unterschiedlich</li>
          </ul>
        </div>

        {/* ── Bedeutung & Hintergrund ─────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Was wird am Ostermontag gefeiert? Bedeutung &amp; Hintergrund
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die Bedeutung des Ostermontags h&auml;ngt direkt mit Ostern zusammen: Das Fest
              erinnert an die Auferstehung Jesu. Ostermontag geh&ouml;rt zur Osterzeit und
              verl&auml;ngert die Feier &uuml;ber mehrere Tage. Historisch waren christliche
              Hochfeste oft mehrt&auml;gig, und auch liturgisch wird die Osterfreude weitergetragen.
            </p>
            <p>
              In der Bibel ist ein wichtiger Bezugspunkt die{" "}
              <strong className="text-text-primary">Emmausgeschichte</strong>: Zwei J&uuml;nger
              erkennen Jesus erst unterwegs und beim Brotbrechen. Daraus leiten sich auch
              die traditionellen Emmausg&auml;nge ab, die in manchen Gemeinden heute noch
              durchgef&uuml;hrt werden.
            </p>
          </div>
        </div>

        {/* ── Unterschied Ostersonntag vs Ostermontag ──────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Unterschied Ostersonntag &amp; Ostermontag
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Tag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Bedeutung</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Aktivit&auml;ten</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-medium text-text-primary">Ostersonntag</td>
                  <td className="px-4 py-3 text-text-secondary">Auferstehung Jesu</td>
                  <td className="px-4 py-3 text-text-secondary">Gottesdienst, Feiern, Traditionen</td>
                  <td className="px-4 py-3 text-text-secondary text-xs">Sonntag (nur in BB Feiertag)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-text-primary">Ostermontag</td>
                  <td className="px-4 py-3 text-text-secondary">Emmaus-Tradition, Fortsetzung</td>
                  <td className="px-4 py-3 text-text-secondary">Familientreffen, Ausflug, Erholung</td>
                  <td className="px-4 py-3 text-xs text-green-500 font-medium">gesetzl. Feiertag</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            Mehr zu den{" "}
            <Link href={`/ostern/${year}`} className="text-accent hover:underline">
              Osterfeiertagen {year}
            </Link>{" "}
            und den{" "}
            <Link href={`/osterferien/${year}`} className="text-accent hover:underline">
              Osterferien {year}
            </Link>.
          </p>
        </div>

        {/* ── Bräuche ─────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Br&auml;uche am Ostermontag: Traditionen in Deutschland
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die Ostermontag-Br&auml;uche unterscheiden sich je nach Region und Familie.
              Ein Klassiker ist der{" "}
              <strong className="text-text-primary">Osterspaziergang</strong>: Der Feiertag wird
              f&uuml;r eine Runde im Park, Wald oder am Fluss genutzt. In einigen Gegenden
              geh&ouml;rt auch ein <strong className="text-text-primary">Osterfeuer</strong> dazu.
            </p>
            <p>
              Verbreitet sind au&szlig;erdem Eierspiele wie{" "}
              <strong className="text-text-primary">Eierrollen</strong> am Hang oder{" "}
              <strong className="text-text-primary">Eierpecken</strong> am Tisch. Viele Familien
              besuchen sich, essen zusammen und lassen das Osterwochenende entspannt ausklingen.
              Wer den Tag religi&ouml;s gestalten m&ouml;chte, kann einen Gottesdienst oder
              einen <strong className="text-text-primary">Emmausgang</strong> einplanen.
            </p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mt-4">
            <strong className="text-text-primary">Ostermontag-Ideen:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Spaziergang oder kleine Wanderung</li>
              <li>Familienessen oder Osterbrunch</li>
              <li>Eierpecken, Eierrollen oder Eiersuche</li>
              <li>Museum oder Zoo besuchen (Feiertagszeiten pr&uuml;fen)</li>
              <li>Gottesdienst, Andacht oder Emmausgang</li>
            </ul>
          </div>
        </div>

        {/* ── Öffnungszeiten / Arbeit / Schule ────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Ostermontag {year}: &Ouml;ffnungszeiten, Arbeit &amp; Schule
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Als gesetzlicher Feiertag bedeutet Ostermontag: Viele L&auml;den bleiben
              geschlossen und &Ouml;ffnungszeiten sind eingeschr&auml;nkt. Typische Ausnahmen
              gibt es an Bahnh&ouml;fen, bei Tankstellen, Kiosken und in der Gastronomie.
            </p>
            <p>
              Schule und Kita sind frei &ndash; die Ferienregelungen unterscheiden sich aber
              je nach Bundesland. Alle Termine findest du in der{" "}
              <Link href={`/osterferien/${year}`} className="text-accent hover:underline">
                Osterferien-&Uuml;bersicht {year}
              </Link>.
              Arbeitnehmer haben in der Regel frei, Schichtarbeit und Zuschl&auml;ge h&auml;ngen
              vom jeweiligen Tarif- bzw. Arbeitsvertrag ab.
            </p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary mt-4">
            <strong className="text-text-primary">Feiertags-Check: &Ouml;ffnungszeiten</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong className="text-text-primary">Meist geschlossen:</strong> Superm&auml;rkte, M&ouml;belh&auml;user, Baum&auml;rkte</li>
              <li><strong className="text-text-primary">Oft offen:</strong> Tankstellen, Bahnhofsshops, Kioske, Restaurants</li>
              <li><strong className="text-text-primary">Tipp:</strong> Lokale Regelungen rechtzeitig pr&uuml;fen</li>
            </ul>
          </div>
        </div>

        {/* ── Feiertage im April ───────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Feiertage im April {year}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Der April {year} wird klar von Ostern gepr&auml;gt. F&uuml;r die Planung sind
            vor allem Karfreitag und Ostermontag wichtig, weil beide gesetzliche Feiertage sind.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Feiertag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Wochentag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Geltung</th>
                </tr>
              </thead>
              <tbody>
                {aprilFeiertage.map((f, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{f.name}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateDE(f.date)}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{getDayNameDE(f.date)}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            Alle Feiertage im &Uuml;berblick:{" "}
            <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
              Feiertage {year}
            </Link>{" "}
            &middot;{" "}
            <Link href="/feiertage" className="text-accent hover:underline">
              Feiertage Deutschland
            </Link>
          </p>
        </div>

        {/* ── Weitere Feiertage nach Ostern ────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Bewegliche Feiertage nach Ostern {year}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Vom Osterdatum h&auml;ngen weitere Feiertage ab. Mit Br&uuml;ckentagen lassen sich
            mehrere lange Wochenenden planen:
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Feiertag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Datum</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Wochentag</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Bundesweit?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Christi Himmelfahrt", date: himmelfahrt, states: "ja" },
                  { name: "Pfingstmontag", date: pfingstmontag, states: "ja" },
                  { name: "Fronleichnam", date: fronleichnam, states: "nur 6 Bundesländer" },
                ].map((f, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{f.name}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateDE(f.date)}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{getDayNameDE(f.date)}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{f.states}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Debatte: Ostermontag abschaffen ──────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Debatte: &bdquo;Ostermontag abschaffen&ldquo; &ndash; was steckt dahinter?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die Debatte kommt in Deutschland regelm&auml;&szlig;ig auf. Meist geht es nicht um
              einen konkreten Gesetzentwurf, sondern um eine grunds&auml;tzliche Abw&auml;gung:
              Welche Feiertage tragen das gesellschaftliche Leben &ndash; und wo sehen manche
              eine wirtschaftliche Belastung?
            </p>
            <p>
              Bef&uuml;rworter einer Abschaffung verweisen auf Produktivit&auml;t und
              Wettbewerbsf&auml;higkeit. Kritiker betonen Kultur, Religion, Erholung und
              Familienzeit. F&uuml;r die aktuelle Lage gilt: Der Ostermontag ist und bleibt
              in Deutschland ein gesetzlicher Feiertag.
            </p>
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zum Ostermontag {year}
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

        {/* ── Year Navigation (bottom) ────────────────────────── */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Link href={`/ostermontag/${prevYear}`} className="text-sm text-accent hover:underline">
              &larr; Ostermontag {prevYear}
            </Link>
          ) : <span />}
          {hasNext ? (
            <Link href={`/ostermontag/${nextYear}`} className="text-sm text-accent hover:underline">
              Ostermontag {nextYear} &rarr;
            </Link>
          ) : <span />}
        </div>

        {/* ── Abschluss-Links ─────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">&larr; Aktuelle KW</Link>
          <Link href={`/ostern/${year}`} className="text-accent hover:underline">Ostern {year} &rarr;</Link>
          <Link href={`/osterferien/${year}`} className="text-accent hover:underline">Osterferien {year} &rarr;</Link>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">Feiertage {year} &rarr;</Link>
          <Link href="/feiertage" className="text-accent hover:underline">Feiertage &Uuml;bersicht &rarr;</Link>
          <Link href={`/kalenderwochen/${year}`} className="text-accent hover:underline">Kalenderwochen {year} &rarr;</Link>
          <Link href="/faq" className="text-accent hover:underline">FAQ &rarr;</Link>
        </div>
      </section>
    </>
  );
}
