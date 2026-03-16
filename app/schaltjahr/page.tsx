import type { Metadata } from "next";
import Link from "next/link";
import { isLeapYear, getCurrentKW } from "@/lib/kw";
import LastUpdated from "@/components/LastUpdated";

export const revalidate = 86400; // daily ISR (content changes only yearly)

/* ── Helpers ──────────────────────────────────────────────────── */

/** Find the next leap year strictly after `fromYear`. */
function nextLeapYear(fromYear: number): number {
  let y = fromYear + 1;
  while (!isLeapYear(y)) y++;
  return y;
}

/** Find the previous leap year strictly before `fromYear`. */
function prevLeapYear(fromYear: number): number {
  let y = fromYear - 1;
  while (!isLeapYear(y)) y--;
  return y;
}

/** Generate a list of leap years in a range [start, end]. */
function leapYearsInRange(start: number, end: number): number[] {
  const years: number[] = [];
  for (let y = start; y <= end; y++) {
    if (isLeapYear(y)) years.push(y);
  }
  return years;
}

/** Days until Feb 29 of the next leap year. */
function daysUntilNextLeapDay(today: Date, nextLY: number): number {
  const feb29 = new Date(Date.UTC(nextLY, 1, 29));
  return Math.ceil((feb29.getTime() - today.getTime()) / 86_400_000);
}

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const nextLY = isLeapYear(currentYear)
    ? currentYear
    : nextLeapYear(currentYear);

  const title = `Schaltjahr ${nextLY} ▷ Wann ist das nächste Schaltjahr?`;
  const description = `Schaltjahr kurz erklärt: Nächstes Schaltjahr ist ${nextLY}. Prüfe jedes Jahr in Sekunden mit der 4/100/400-Regel + Liste früherer & kommender Schaltjahre.`;
  const url = "https://aktuellekw.de/schaltjahr";

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

/* ── FAQ data (10 Fragen) ─────────────────────────────────────── */
const pageFAQs = [
  {
    question: "Wann ist das nächste Schaltjahr?",
    answer:
      "Das nächste Schaltjahr ist 2028. In einem Schaltjahr hat der Februar 29 Tage und das Jahr insgesamt 366 Tage. Nach 2024 folgt damit 2028 als nächstes Jahr mit 29. Februar.",
  },
  {
    question: "Ist 2026 ein Schaltjahr?",
    answer:
      "Nein, 2026 ist kein Schaltjahr. Ein Schaltjahr ist durch 4 teilbar (mit Ausnahmen bei Jahrhunderten), und 2026 ist nicht durch 4 teilbar. Der Februar hat 2026 deshalb nur 28 Tage.",
  },
  {
    question: "Ist 2025 ein Schaltjahr?",
    answer:
      "Nein, 2025 ist kein Schaltjahr. 2025 ist nicht durch 4 teilbar und erfüllt damit nicht die Schaltjahr-Regel. Der 29. Februar kommt 2025 nicht vor.",
  },
  {
    question: "Wann war das letzte Schaltjahr?",
    answer:
      "Das letzte Schaltjahr war 2024. In diesem Schaltjahr gab es den 29. Februar und insgesamt 366 Tage. Das nächste Schaltjahr danach ist 2028.",
  },
  {
    question: "Wann hat der Februar wieder 29 Tage?",
    answer:
      "Der Februar hat wieder 29 Tage im nächsten Schaltjahr, also 2028. Dann gibt es den 29. Februar und das Jahr hat 366 Tage. Davor hat der Februar in normalen Jahren nur 28 Tage.",
  },
  {
    question: "Warum gibt es Schaltjahre?",
    answer:
      "Schaltjahre gibt es, damit unser Kalender mit dem Sonnenjahr im Takt bleibt. Ohne den zusätzlichen Tag würde sich der Kalender im Laufe der Zeit gegenüber den Jahreszeiten verschieben. Darum wird im Schaltjahr der 29. Februar eingefügt.",
  },
  {
    question: "Wie erkenne ich, ob ein Jahr ein Schaltjahr ist?",
    answer:
      "Du erkennst ein Schaltjahr mit der 4/100/400-Regel: Durch 4 teilbar = Schaltjahr. Durch 100 teilbar = kein Schaltjahr, außer es ist durch 400 teilbar, dann doch Schaltjahr. So kannst du jedes Jahr schnell prüfen.",
  },
  {
    question: "Warum ist 2100 kein Schaltjahr?",
    answer:
      "2100 ist kein Schaltjahr, weil es zwar durch 100 teilbar ist, aber nicht durch 400. Nach der 4/100/400-Regel sind solche Jahrhundertjahre keine Schaltjahre. Deshalb hat der Februar 2100 nur 28 Tage.",
  },
  {
    question: "Gibt es einen 30. Februar?",
    answer:
      'Im normalen Kalender gibt es keinen 30. Februar. Selbst im Schaltjahr hat der Februar nur 29 Tage. Ein \u201E30. Februar\u201C taucht höchstens in Sonderfällen historischer Kalenderreformen auf, aber nicht im heutigen Gregorianischen Kalender.',
  },
  {
    question: "Wie oft kommt der 29. Februar vor?",
    answer:
      "Der 29. Februar kommt in jedem Schaltjahr vor. Meist passiert das alle 4 Jahre, aber Jahrhundertjahre sind nur dann Schaltjahr, wenn sie durch 400 teilbar sind. Darum ist der 29. Februar insgesamt etwas unregelmäßiger als ein strikter 4-Jahres-Rhythmus.",
  },
];

/* ── Page Component ────────────────────────────────────────────── */
export default function SchaltjahrPage() {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const currentYear = todayUTC.getUTCFullYear();
  const kw = getCurrentKW();

  const currentIsLeap = isLeapYear(currentYear);
  const nextLY = currentIsLeap ? currentYear : nextLeapYear(currentYear);
  const prevLY = currentIsLeap
    ? prevLeapYear(currentYear)
    : prevLeapYear(currentYear + 1);
  const daysUntilLeap = currentIsLeap
    ? 0
    : daysUntilNextLeapDay(todayUTC, nextLY);

  // Leap years lists
  const futureLeapYears = leapYearsInRange(currentYear + 1, 2100);
  const allLeapYears21st = leapYearsInRange(2000, 2100);

  // JSON-LD
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://aktuellekw.de/schaltjahr#breadcrumb",
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
          name: "Schaltjahr",
          item: "https://aktuellekw.de/schaltjahr",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://aktuellekw.de/schaltjahr#faqpage",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: "2026-01-01",
      dateModified: "2026-01-01",
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
          <span className="text-text-primary">Schaltjahr</span>
        </nav>

        {/* ═════════════════════════════════════════════════════════
            SECTION 1: Hero – Nächstes Schaltjahr
            ═════════════════════════════════════════════════════════ */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          N&auml;chstes Schaltjahr: Wann ist das n&auml;chste Schaltjahr ({nextLY})?
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Das n&auml;chste <strong className="text-text-primary">Schaltjahr</strong> ist{" "}
            <strong className="text-text-primary">{nextLY}</strong> &ndash;
            dann hat der Februar{" "}
            <strong className="text-text-primary">29 Tage</strong>. Ein Schaltjahr
            bedeutet: <strong className="text-text-primary">366 statt 365 Tage</strong>,
            damit unser Kalender mit dem Sonnenjahr Schritt h&auml;lt und die
            Jahreszeiten nicht &bdquo;wandern&ldquo;.
            {!currentIsLeap && (
              <>
                {" "}Das letzte Schaltjahr war{" "}
                <strong className="text-text-primary">{prevLY}</strong>.
                Die Jahre {prevLY + 1}, {prevLY + 2} und {prevLY + 3} sind
                normale Jahre ohne zus&auml;tzlichen Tag.
              </>
            )}
          </p>
          <p>
            Mit der <strong className="text-text-primary">4/100/400-Regel</strong> pr&uuml;fst
            du in unter 10 Sekunden, ob ein Jahr ein Schaltjahr ist: durch 4
            teilbar = meist Schaltjahr, durch 100 = meist nicht, durch 400 =
            doch wieder. Au&szlig;erdem findest du hier eine kompakte{" "}
            <strong className="text-text-primary">Liste der n&auml;chsten Schaltjahre</strong>{" "}
            &ndash; ideal f&uuml;r Urlaubsplanung, Fristen und{" "}
            <Link href="/datum-heute" className="text-accent hover:underline">
              Kalender-Checks
            </Link>.
          </p>
          <p>
            Heute ist KW&nbsp;{kw.weekNumber}/{currentYear}.{" "}
            {!currentIsLeap && daysUntilLeap > 0 && (
              <>
                Noch <strong className="text-text-primary">{daysUntilLeap} Tage</strong> bis
                zum n&auml;chsten Schalttag (29.02.{nextLY}).
              </>
            )}
          </p>
        </div>

        {/* ── InfoBox ─────────────────────────────────────────── */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
            Kurzantwort
          </p>
          <div className="text-sm text-text-secondary space-y-1">
            <p>
              <strong className="text-text-primary">N&auml;chstes Schaltjahr:</strong> {nextLY}
            </p>
            <p>
              <strong className="text-text-primary">Letztes Schaltjahr:</strong> {prevLY}
            </p>
            <p>
              <strong className="text-text-primary">Kommende Schaltjahre:</strong>{" "}
              {futureLeapYears.slice(0, 4).join(", ")} &hellip;
            </p>
            <p>
              <strong className="text-text-primary">Merksatz:</strong> Ein Jahr ist
              ein Schaltjahr, wenn es durch 4 teilbar ist &ndash; au&szlig;er
              Jahrhundertjahre, die nicht durch 400 teilbar sind.
            </p>
          </div>
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            {
              label: currentIsLeap ? "Aktuelles Schaltjahr" : "Nächstes Schaltjahr",
              value: currentIsLeap ? String(currentYear) : String(nextLY),
            },
            {
              label: "Letztes Schaltjahr",
              value: currentIsLeap
                ? String(prevLY)
                : String(prevLeapYear(nextLY)),
            },
            {
              label: currentIsLeap ? "Tage in " + currentYear : "Bis 29.02." + nextLY,
              value: currentIsLeap ? "366" : `${daysUntilLeap} Tage`,
            },
            {
              label: currentYear + " ist",
              value: currentIsLeap ? "Schaltjahr ✓" : "Kein Schaltjahr",
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
            SECTION 2: Was ist ein Schaltjahr? (Definition)
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Was ist ein Schaltjahr? (Definition: 366 Tage und 29.&nbsp;Februar)
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Schaltjahr</strong> ist ein
              Kalenderjahr mit <strong className="text-text-primary">366 Tagen</strong> statt
              365. Der zus&auml;tzliche Tag liegt im Februar und ist der{" "}
              <strong className="text-text-primary">29. Februar</strong>.
              Dadurch hat der Februar nicht 28, sondern 29 Tage. Diese Regel
              gibt es, weil das tropische Sonnenjahr nicht exakt 365 Tage
              dauert, sondern rund <strong className="text-text-primary">365,2422 Tage</strong>.
              Ohne diese Korrektur w&uuml;rden sich die Jahreszeiten mit der
              Zeit im Kalender verschieben.
            </p>
            <p>
              In der Praxis beeinflusst ein <strong className="text-text-primary">Schaltjahr</strong>{" "}
              Kalender, Urlaubsplanung und Fristen. Ein Jahr mit 366 Tagen
              ver&auml;ndert die Verteilung der Wochentage in den
              Folgemonaten. Und wenn du am 29.&nbsp;Februar Geburtstag hast,
              feierst du offiziell nur in Schaltjahren.
            </p>
            <p>
              Ohne <strong className="text-text-primary">Schaltjahre</strong> w&uuml;rde sich
              der Kalender pro Jahr um knapp 6 Stunden verschieben. Nach
              100&nbsp;Jahren w&auml;ren die Jahreszeiten um rund 24&nbsp;Tage
              verschoben &ndash; Weihnachten f&auml;nde irgendwann im Herbst statt.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 3: Schaltjahr-Regel (4/100/400)
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Schaltjahr-Regel: So erkennst du in Sekunden, ob ein Jahr ein Schaltjahr ist
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Mit der <strong className="text-text-primary">Schaltjahr-Regel</strong> erkennst
              du in wenigen Sekunden, ob ein Jahr einen 29.&nbsp;Februar hat.
              Im <strong className="text-text-primary">Gregorianischen Kalender</strong> gilt
              eine einfache Reihenfolge: Ist ein Jahr durch{" "}
              <strong className="text-text-primary">4</strong> teilbar, kommt es
              grunds&auml;tzlich als Schaltjahr infrage. Ist es zus&auml;tzlich
              durch <strong className="text-text-primary">100</strong> teilbar,
              entf&auml;llt der Schalttag wieder. Nur wenn es au&szlig;erdem
              durch <strong className="text-text-primary">400</strong> teilbar
              ist, bleibt es dennoch ein Schaltjahr (z.&nbsp;B.{" "}
              <strong className="text-text-primary">2000</strong>). So bleibt der
              Kalender n&auml;her am Sonnenjahr (ca.&nbsp;365,2422 Tage) und
              driftet nicht.
            </p>
          </div>

          {/* 3-Punkte-Checkliste */}
          <h3 className="text-lg font-semibold mt-6 mb-3 text-text-primary">
            Schaltjahr berechnen: 3-Punkte-Checkliste
          </h3>
          <div className="space-y-3">
            {[
              {
                rule: "Durch 4 teilbar?",
                yes: "→ weiter prüfen",
                no: "→ Kein Schaltjahr",
                example: "z. B. 2024, 2028, 2032",
                color: "text-green-400",
                icon: "✓",
              },
              {
                rule: "Durch 100 teilbar?",
                yes: "→ weiter prüfen",
                no: "→ Schaltjahr",
                example: "z. B. 1900, 2100, 2200 → kein Schaltjahr",
                color: "text-red-400",
                icon: "✗",
              },
              {
                rule: "Durch 400 teilbar?",
                yes: "→ Doch Schaltjahr",
                no: "→ Kein Schaltjahr",
                example: "z. B. 1600, 2000, 2400 → Schaltjahr",
                color: "text-green-400",
                icon: "✓",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="bg-surface-secondary border border-border rounded-xl p-4 flex items-start gap-3"
              >
                <span
                  className={`text-xl font-bold ${r.color} shrink-0 mt-0.5`}
                >
                  {r.icon}
                </span>
                <div>
                  <p className="font-medium text-text-primary text-sm">
                    {r.rule}
                  </p>
                  <p className="text-text-secondary text-xs mt-0.5">
                    Ja {r.yes} &middot; Nein {r.no}
                  </p>
                  <p className="text-text-secondary text-xs mt-0.5">
                    {r.example}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Kurz-Check */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 mt-4">
            <p className="text-sm text-text-secondary">
              <strong className="text-text-primary">Kurz-Check:</strong>{" "}
              <strong className="text-green-400">2024</strong> ja,{" "}
              <strong className="text-red-400">2026</strong> nein,{" "}
              <strong className="text-red-400">2100</strong> nein,{" "}
              <strong className="text-green-400">2400</strong> ja.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 4: Ist 2026 ein Schaltjahr?
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Ist {currentYear} ein Schaltjahr? (Antworten f&uuml;r {currentYear - 1}, {currentYear}, {currentYear + 1} und {currentYear + 2})
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              {currentYear} ist{" "}
              {currentIsLeap ? (
                <>
                  ein <strong className="text-text-primary">Schaltjahr</strong>.
                  Der <strong className="text-text-primary">Februar hat 29 Tage</strong>,
                  weil {currentYear}{" "}
                  <strong className="text-text-primary">durch 4 teilbar</strong> ist.
                </>
              ) : (
                <>
                  <strong className="text-text-primary">kein Schaltjahr</strong>.
                  Der <strong className="text-text-primary">Februar hat 28 Tage</strong>,
                  weil {currentYear}{" "}
                  <strong className="text-text-primary">nicht durch 4 teilbar</strong> ist.
                  Erst <strong className="text-text-primary">{nextLY}</strong> bringt
                  wieder den <strong className="text-text-primary">29.&nbsp;Februar</strong>,
                  denn dieses Jahr ist durch 4 teilbar.
                </>
              )}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">
                    Jahr
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">
                    Schaltjahr?
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">
                    Begr&uuml;ndung
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">
                    Februar-Tage
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  currentYear - 2,
                  currentYear - 1,
                  currentYear,
                  currentYear + 1,
                  currentYear + 2,
                  currentYear + 3,
                  currentYear + 4,
                  currentYear + 5,
                ].map((y) => {
                  const leap = isLeapYear(y);
                  const isCurrent = y === currentYear;
                  return (
                    <tr
                      key={y}
                      className={`border-b border-border last:border-b-0 ${
                        isCurrent ? "bg-accent/5" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 font-medium text-text-primary">
                        {y}
                        {isCurrent && (
                          <span className="ml-2 text-xs text-accent font-semibold">
                            aktuell
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {leap ? (
                          <span className="text-green-400 font-semibold">
                            Ja ✓
                          </span>
                        ) : (
                          <span className="text-text-secondary">Nein</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-text-secondary text-xs">
                        {leap
                          ? y % 400 === 0
                            ? "durch 400 teilbar"
                            : "durch 4 teilbar"
                          : y % 100 === 0
                          ? "durch 100 teilbar"
                          : "nicht durch 4 teilbar"}
                      </td>
                      <td className="px-4 py-2.5 text-text-secondary font-medium">
                        {leap ? "29" : "28"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-3">
            Zur Einordnung: <strong className="text-text-primary">{prevLY}</strong> hatte
            bereits 29&nbsp;Tage im Februar. Von {prevLY + 1} bis {nextLY - 1} bleibt es
            beim normalen Februar mit 28&nbsp;Tagen &ndash; praktisch f&uuml;r Kalender,
            Urlaubsplanung und Terminabsprachen.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 5: Liste aller Schaltjahre
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Liste der Schaltjahre: letzte und n&auml;chste Schaltjahre auf einen Blick
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              In der Regel f&auml;llt ein <strong className="text-text-primary">Schaltjahr</strong>{" "}
              <strong className="text-text-primary">alle vier Jahre</strong> an. Es gibt
              jedoch Ausnahmen bei vollen Jahrhunderten:{" "}
              <strong className="text-text-primary">2100, 2200 und 2300</strong> z&auml;hlen
              nicht dazu, <strong className="text-text-primary">2400</strong> dagegen schon.
              Im 21.&nbsp;Jahrhundert (2000&ndash;2100) gibt es insgesamt{" "}
              <strong className="text-text-primary">{allLeapYears21st.length} Schaltjahre</strong>.
            </p>
          </div>

          {/* Letzte / Nächste Tabelle */}
          <div className="overflow-x-auto rounded-xl border border-border mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">
                    Letzte Schaltjahre
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">
                    N&auml;chste Schaltjahre
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { past: 2012, future: 2028 },
                  { past: 2016, future: 2032 },
                  { past: 2020, future: 2036 },
                  { past: 2024, future: 2040 },
                ].map((row) => (
                  <tr
                    key={row.past}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-2.5 text-text-secondary">{row.past}</td>
                    <td className="px-4 py-2.5 font-medium text-text-primary">
                      {row.future}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vollständiges Grid 2000–2100 */}
          <h3 className="text-lg font-semibold mb-3 text-text-primary">
            Alle Schaltjahre von 2000 bis 2100
          </h3>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {allLeapYears21st.map((y) => {
              const isPast = y < currentYear;
              const isCurrent = y === currentYear;
              return (
                <div
                  key={y}
                  className={`rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-accent/15 border-accent/40 text-accent"
                      : isPast
                      ? "bg-surface-secondary border-border text-text-secondary"
                      : "bg-surface-secondary border-border text-text-primary"
                  }`}
                >
                  {y}
                </div>
              );
            })}
          </div>

          <p className="text-text-secondary text-xs mt-3">
            <strong className="text-text-primary">Merksatz:</strong> Jahre,
            die durch 4 teilbar sind, sind meist Schaltjahre. Jahrhundertjahre
            gelten nur dann, wenn sie zus&auml;tzlich durch 400 teilbar sind
            (z.&nbsp;B. 2400).
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 6: Wann ist das nächste Schaltjahr?
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wann ist das n&auml;chste Schaltjahr?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Das <strong className="text-text-primary">n&auml;chste Schaltjahr</strong> ist{" "}
              <strong className="text-text-primary">{nextLY}</strong>. Dann gibt
              es den <strong className="text-text-primary">29.&nbsp;Februar {nextLY}</strong>{" "}
              &ndash; der Februar hat in diesem Jahr also{" "}
              <strong className="text-text-primary">29 Tage</strong>. Das hilft
              beim Planen von Terminen oder wenn du einen Geburtstag am
              29.&nbsp;Februar im Blick behalten m&ouml;chtest.
            </p>
            <p>
              Zur Orientierung: Das letzte Schaltjahr war{" "}
              <strong className="text-text-primary">{prevLY}</strong>.
              {!currentIsLeap && (
                <>
                  {" "}Die Jahre {prevLY + 1}, {prevLY + 2} und {prevLY + 3} sind
                  normale Jahre ohne zus&auml;tzlichen Tag.
                </>
              )}
              {" "}Den n&auml;chsten Zusatztag bekommst du{" "}
              {currentIsLeap ? "im nächsten Schaltjahr" : `erst wieder ${nextLY}`}.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {futureLeapYears.slice(0, 8).map((y) => (
              <div
                key={y}
                className="bg-surface-secondary border border-border rounded-xl px-4 py-3 text-center"
              >
                <p className="text-2xl font-bold text-accent">{y}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  29.02.{y}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 7: Wann hat der Februar wieder 29 Tage?
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wann hat der Februar wieder 29 Tage?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Das konkrete Datum lautet{" "}
              <strong className="text-text-primary">29.&nbsp;Februar {nextLY}</strong>.
              In allen Nicht-Schaltjahren endet der Februar dagegen am
              28.&nbsp;Februar. Der 29.&nbsp;Februar taucht nicht jedes Jahr
              auf, sondern nur dann, wenn ein Jahr als{" "}
              <strong className="text-text-primary">Schaltjahr</strong> z&auml;hlt.
              Schaltjahre sorgen daf&uuml;r, dass der Kalender mit dem Sonnenjahr
              im Takt bleibt.
            </p>
            <p>
              Wenn du ein Event am 29.&nbsp;Februar planst, setze dir am besten
              einen Kalender-Hinweis. Lege den Termin direkt auf den{" "}
              <strong className="text-text-primary">29.&nbsp;Februar {nextLY}</strong> und
              erg&auml;nze einen Reminder f&uuml;r die Jahre dazwischen. So
              vergisst du Geburtstage, Jubil&auml;en oder Aktionen nicht, auch
              wenn der Tag im normalen Kalender fehlt.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 8: Gibt es einen 30. Februar?
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Gibt es einen 30. Februar? (Mythos und seltene Kalender-Ausnahme)
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Im heutigen <strong className="text-text-primary">Gregorianischen Kalender</strong>{" "}
              gibt es keinen <strong className="text-text-primary">30.&nbsp;Februar</strong>.
              Der Februar hat 28&nbsp;Tage, in einem Schaltjahr 29&nbsp;Tage.
              Ein Datum wie &bdquo;30.&nbsp;Februar&ldquo; ist daher kein
              g&uuml;ltiges Kalenderdatum f&uuml;r deine Planung.
            </p>
            <p>
              Der Mythos h&auml;lt sich, weil es historische Sonderf&auml;lle gab.
              In einzelnen Regionen wurden Kalendertage verschoben oder
              ausgelassen. Dadurch tauchte der 30.&nbsp;Februar vereinzelt
              in Dokumenten auf, etwa durch Umstellungen zwischen
              Kalenderreformen. F&uuml;r heutige Terminkalender, Beh&ouml;rden
              und digitale Systeme hat das keine praktische Relevanz.
            </p>
            <p>
              {currentYear} ist {currentIsLeap ? "zwar ein Schaltjahr" : "kein Schaltjahr"} &ndash;{" "}
              {currentIsLeap
                ? "aber selbst dann hat der Februar nur 29 Tage"
                : `also gibt es nicht einmal einen 29. Februar. Und wenn schon
                  der 29. fehlt, kann ein 30. Februar erst recht nicht vorkommen`}.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 9: Schaltjahr und Alltag
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Schaltjahr und Alltag: Was &auml;ndert sich wirklich?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Im <strong className="text-text-primary">Schaltjahr-Kalender</strong>{" "}
              verschieben sich viele Termine um{" "}
              <strong className="text-text-primary">einen Wochentag</strong>.
              Der 29.&nbsp;Februar sorgt daf&uuml;r, dass Wochentage in den
              folgenden Monaten anders liegen als im Nicht-Schaltjahr. Das
              merkst du besonders bei Dienstpl&auml;nen, Kursen oder festen
              Wochenterminen. Den Zusammenhang mit Kalenderwochen kannst du
              in der{" "}
              <Link href="/wie-viele-wochen-hat-ein-jahr" className="text-accent hover:underline">
                &Uuml;bersicht &bdquo;Wochen im Jahr&ldquo;
              </Link>{" "}
              pr&uuml;fen.
            </p>
            <p>
              Bei <strong className="text-text-primary">Lohn, Monatsmiete und Abos</strong>{" "}
              bleibt meist alles gleich, weil Anbieter nach Monaten abrechnen.
              Entscheidend wird das Schaltjahr aber bei{" "}
              <strong className="text-text-primary">Fristen und Laufzeiten</strong>,
              die am exakten Datum h&auml;ngen &ndash; zum Beispiel bei
              K&uuml;ndigungen, Zahlungen oder Abgaben.
            </p>
            <p>
              Ein <strong className="text-text-primary">29.&nbsp;Februar Geburtstag</strong>{" "}
              wird im Alltag h&auml;ufig am 28.02. oder 01.03. gefeiert. In
              Formularen und Portalen l&auml;sst sich der 29.&nbsp;Februar
              au&szlig;erdem nicht immer sauber ausw&auml;hlen, was bei
              Registrierung, Buchungen oder Stammdaten schnell nervt.
            </p>
          </div>

          {/* Schaltjahr-Check Checkliste */}
          <h3 className="text-lg font-semibold mt-6 mb-3 text-text-primary">
            Schaltjahr-Check: Termine im Schaltjahr pr&uuml;fen
          </h3>
          <div className="space-y-2">
            {[
              "Wiederkehrende Events prüfen: Was passiert mit Terminen am 29.02. – auf 28.02. oder 01.03. verschieben?",
              'Fristen kontrollieren: Kündigung, Zahlung, Abgabe \u2013 zählt ein fixes Datum oder \u201Ezum Monatsende\u201C?',
              "Abos & Vertragslaufzeiten abgleichen: Start- und Enddatum vergleichen, Sonderfälle dokumentieren.",
              "IT & Tools testen: Kalender-Apps, CRM, Buchhaltung – stimmt die Datumslogik?",
              "Excel-Formeln prüfen: Datumsfunktionen, Monatswechsel und automatische Serien.",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-text-secondary text-sm"
              >
                <span className="text-accent shrink-0 mt-0.5">&#9745;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 10: Schaltjahr schnell berechnen
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Schaltjahr schnell berechnen (Formel, Beispiele und Tools)
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Du erkennst ein <strong className="text-text-primary">Schaltjahr</strong> im
              Gregorianischen Kalender mit drei kurzen Pr&uuml;fungen.
              Pr&uuml;fe der Reihe nach{" "}
              <strong className="text-text-primary">400 &rarr; 100 &rarr; 4</strong>.
              So bekommst du schnell ein klares Ergebnis:
            </p>
          </div>

          {/* Pseudocode */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 mt-4 font-mono text-xs text-text-secondary space-y-1">
            <p>
              <span className="text-accent">if</span> (jahr % 400 == 0) &rarr;{" "}
              <span className="text-green-400">Schaltjahr</span>
            </p>
            <p>
              <span className="text-accent">else if</span> (jahr % 100 == 0) &rarr;{" "}
              <span className="text-red-400">kein Schaltjahr</span>
            </p>
            <p>
              <span className="text-accent">else if</span> (jahr % 4 == 0) &rarr;{" "}
              <span className="text-green-400">Schaltjahr</span>
            </p>
            <p>
              <span className="text-accent">else</span> &rarr;{" "}
              <span className="text-red-400">kein Schaltjahr</span>
            </p>
          </div>

          {/* Beispiele-Tabelle */}
          <div className="overflow-x-auto rounded-xl border border-border mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-right font-semibold text-text-primary">
                    Jahr
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-text-primary">
                    &divide;&nbsp;4
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-text-primary">
                    &divide;&nbsp;100
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-text-primary">
                    &divide;&nbsp;400
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">
                    Ergebnis
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { year: 1900, d4: true, d100: true, d400: false, leap: false },
                  { year: 2000, d4: true, d100: true, d400: true, leap: true },
                  { year: 2028, d4: true, d100: false, d400: false, leap: true },
                  { year: 2100, d4: true, d100: true, d400: false, leap: false },
                ].map((row) => (
                  <tr
                    key={row.year}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-2.5 text-right font-medium text-text-primary">
                      {row.year}
                    </td>
                    <td className="px-4 py-2.5 text-center text-text-secondary">
                      {row.d4 ? "ja" : "nein"}
                    </td>
                    <td className="px-4 py-2.5 text-center text-text-secondary">
                      {row.d100 ? "ja" : "nein"}
                    </td>
                    <td className="px-4 py-2.5 text-center text-text-secondary">
                      {row.d400 ? "ja" : "nein"}
                    </td>
                    <td className="px-4 py-2.5 font-medium">
                      {row.leap ? (
                        <span className="text-green-400">Schaltjahr</span>
                      ) : (
                        <span className="text-red-400">kein Schaltjahr</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-text-secondary text-sm mt-3">
            Wenn du anschlie&szlig;end Zeitr&auml;ume z&auml;hlen willst,
            hilft dir der{" "}
            <Link href="/tagerechner" className="text-accent hover:underline">
              Tagerechner &ndash; Tage zwischen zwei Daten berechnen
            </Link>.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 11: Geburtstag am 29. Februar / Schalttag
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Geburtstag am 29. Februar &ndash; der Schalttag
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Wer am <strong className="text-text-primary">29.&nbsp;Februar</strong> geboren
              wird, hat nur alle vier Jahre an seinem &bdquo;echten&ldquo;
              Geburtstag Grund zu feiern. In Deutschland gilt: In
              Nicht-Schaltjahren endet die Frist f&uuml;r die
              Vollj&auml;hrigkeit am{" "}
              <strong className="text-text-primary">1.&nbsp;M&auml;rz</strong>{" "}
              (&sect;&nbsp;188 Abs.&nbsp;3 BGB analog). Im Alltag wird der
              29.&nbsp;Februar-Geburtstag h&auml;ufig am 28.02. oder 01.03.
              gefeiert.
            </p>
            <p>
              Weltweit werden nur rund 0,07&nbsp;% aller Menschen an einem
              Schalttag geboren &ndash; statistisch etwa{" "}
              <strong className="text-text-primary">5&nbsp;Millionen</strong> Menschen.
              In Formularen und Portalen l&auml;sst sich der
              29.&nbsp;Februar nicht immer sauber ausw&auml;hlen, was bei
              Registrierung, Buchungen oder Stammdaten ein bekanntes Problem ist.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 12: CTA – Nächstes Schaltjahr merken
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            N&auml;chstes Schaltjahr merken: 29.&nbsp;Februar {nextLY}
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Trage dir den <strong className="text-text-primary">29.&nbsp;Februar {nextLY}</strong>{" "}
              am besten direkt als Termin ein, wenn du an diesem Datum etwas
              verbindlich planen willst (z.&nbsp;B. Fristen, Reisen oder
              Geburtstage). So vergisst du wichtige Termine nicht, auch wenn der
              Tag im normalen Kalender fehlt. Den Tag findest du auch schnell
              im{" "}
              <Link href="/kalender-mit-wochen" className="text-accent hover:underline">
                Kalender mit Wochen
              </Link>.
            </p>
          </div>

          {/* Kalender-Anleitungen */}
          <h3 className="text-lg font-semibold mt-6 mb-3 text-text-primary">
            Termin am 29.02.{nextLY} anlegen
          </h3>
          <div className="space-y-2">
            {[
              { app: "Google Kalender", steps: `„Erstellen" → Datum 29.02.${nextLY} → Erinnerung wählen → Speichern` },
              { app: "iOS Kalender", steps: `„+" → „Ereignis" → 29.02.${nextLY} → Erinnerung setzen → Hinzufügen` },
              { app: "Outlook", steps: `„Neuer Termin" → Datum 29.02.${nextLY} → Erinnerung aktivieren → Speichern` },
            ].map((cal) => (
              <div
                key={cal.app}
                className="bg-surface-secondary border border-border rounded-xl p-3 flex items-start gap-3"
              >
                <span className="text-accent shrink-0 text-sm font-semibold mt-0.5">
                  {cal.app}:
                </span>
                <span className="text-text-secondary text-sm">{cal.steps}</span>
              </div>
            ))}
          </div>

          <p className="text-text-secondary text-sm mt-4">
            Wenn du zus&auml;tzlich fr&uuml;h planen willst, schau dir die{" "}
            <Link href={`/feiertage/${currentYear}`} className="text-accent hover:underline">
              Feiertage {currentYear}
            </Link>{" "}
            an. So beh&auml;ltst du wichtige Termine im Blick und verpasst
            keine Fristen, Reisen oder Geburtstage.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 13: FAQ (10 Fragen)
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufig gestellte Fragen zum Schaltjahr
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

        {/* ── Abschluss / Fazit ──────────────────────────────────── */}
        <div className="mt-14 bg-surface-secondary border border-border rounded-xl p-5">
          <p className="text-text-secondary text-sm leading-relaxed">
            Das n&auml;chste <strong className="text-text-primary">Schaltjahr</strong> ist{" "}
            <strong className="text-text-primary">{nextLY}</strong> &ndash; und{" "}
            {currentYear} ist {currentIsLeap ? "eins" : "keins"}.
            Wenn du schnell pr&uuml;fen willst, ob ein Jahr ein Schaltjahr ist,
            merk dir die <strong className="text-text-primary">4/100/400-Regel</strong>:
            durch 4 teilbar = ja, durch 100 = nein, durch 400 = wieder ja. So
            hast du die Antwort in Sekunden (und der 30.&nbsp;Februar bleibt ein
            Mythos). Speichere dir die Schaltjahr-Liste oder setze dir jetzt
            einen Reminder f&uuml;r {nextLY}.
          </p>
        </div>

        <LastUpdated date="2026-01-01" />
        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/datum-heute" className="text-accent hover:underline">
            Datum heute &rarr;
          </Link>
          <Link href="/tagerechner" className="text-accent hover:underline">
            Tagerechner &rarr;
          </Link>
          <Link href="/kalender-mit-wochen" className="text-accent hover:underline">
            Kalender mit Wochen &rarr;
          </Link>
          <Link href="/wie-viele-wochen-hat-ein-jahr" className="text-accent hover:underline">
            Wochen im Jahr &rarr;
          </Link>
          <Link href={`/feiertage/${currentYear}`} className="text-accent hover:underline">
            Feiertage {currentYear} &rarr;
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
 * SEO Audit Checklist – app/schaltjahr/page.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Schaltjahr 2028 ▷ Wann ist das nächste Schaltjahr?"
 * [x] Meta Description: dynamisch mit nächstem Schaltjahr (MD-optimiert)
 * [x] Canonical URL: https://aktuellekw.de/schaltjahr
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Nächstes Schaltjahr: Wann ist das nächste Schaltjahr (2028)?"
 * [x] Schema.org: BreadcrumbList (2 Ebenen)
 * [x] Schema.org: FAQPage (10 Fragen)
 * [x] Cluster Keywords: schaltjahr, schaltjahre, nächstes schaltjahr
 * [x] InfoBox mit Kurzantwort
 * [x] Stats Row (nächstes/letztes Schaltjahr, Tage bis Schalttag)
 * [x] Was ist ein Schaltjahr? (Definition, 365,2422 Tage)
 * [x] Schaltjahr-Regel (4/100/400-Checkliste + Kurz-Check)
 * [x] Ist [Jahr] ein Schaltjahr? (Tabelle 8 Jahre + Februar-Tage)
 * [x] Liste Schaltjahre (Letzte/Nächste Tabelle + Grid 2000–2100)
 * [x] Wann ist das nächste Schaltjahr? (8 Cards)
 * [x] Wann hat der Februar wieder 29 Tage?
 * [x] Gibt es einen 30. Februar? (Mythos)
 * [x] Schaltjahr und Alltag (Checkliste 5 Punkte)
 * [x] Schaltjahr berechnen (Pseudocode + Tabelle 4 Beispiele)
 * [x] Geburtstag am 29. Februar / Schalttag
 * [x] CTA: Nächstes Schaltjahr merken (3 Kalender-Anleitungen)
 * [x] Fazit-Box
 * [x] FAQ (10 Fragen) mit allen Cluster-Keywords
 * [x] Cross-Links: Datum heute, Tagerechner, Kalender mit Wochen,
 *     Wochen im Jahr, Feiertage, FAQ
 * [x] revalidate = 86400 (tägliche ISR)
 * [x] Interne Verlinkung: datum-heute, tagerechner,
 *     wie-viele-wochen-hat-ein-jahr, kalender-mit-wochen, feiertage
 * [x] Content aus schaltjahr.md vollständig integriert
 */
