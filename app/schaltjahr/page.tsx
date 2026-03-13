import type { Metadata } from "next";
import Link from "next/link";
import { isLeapYear, getCurrentKW } from "@/lib/kw";

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
  const description = `Wann ist das nächste Schaltjahr? ${nextLY} ist ein Schaltjahr mit 366 Tagen und dem 29. Februar. Alle Schaltjahre von 2000 bis 2100 auf einen Blick – inklusive Regeln und Erklärung.`;
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

/* ── FAQ data ──────────────────────────────────────────────────── */
const pageFAQs = [
  {
    question: "Was ist ein Schaltjahr?",
    answer:
      "Ein Schaltjahr ist ein Kalenderjahr mit 366 statt 365 Tagen. Der zusätzliche Tag – der 29. Februar – gleicht die Differenz zwischen dem Kalenderjahr (365 Tage) und dem astronomischen Sonnenjahr (ca. 365,2422 Tage) aus.",
  },
  {
    question: "Wann ist das nächste Schaltjahr?",
    answer:
      "Das nächste Schaltjahr ist 2028. Danach folgen 2032, 2036 und 2040. Schaltjahre finden in der Regel alle vier Jahre statt.",
  },
  {
    question: "Welche Schaltjahr-Regeln gibt es?",
    answer:
      "Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist – es sei denn, es ist durch 100 teilbar. Ausnahme: Durch 400 teilbare Jahre sind dennoch Schaltjahre. So war 2000 ein Schaltjahr (400er-Regel), aber 1900 nicht (100er-Regel).",
  },
  {
    question: "Warum gibt es Schaltjahre?",
    answer:
      "Die Erde benötigt etwa 365,2422 Tage für eine Umrundung der Sonne. Ohne Schaltjahre würde sich der Kalender jedes Jahr um knapp 6 Stunden verschieben – nach 100 Jahren wären die Jahreszeiten um ca. 24 Tage verschoben.",
  },
  {
    question: "Ist 2026 ein Schaltjahr?",
    answer:
      "Nein, 2026 ist kein Schaltjahr. 2026 hat 365 Tage und keinen 29. Februar. Das nächste Schaltjahr nach 2024 ist 2028.",
  },
  {
    question: "Wie viele Tage hat ein Schaltjahr?",
    answer:
      "Ein Schaltjahr hat 366 Tage statt der üblichen 365. Der zusätzliche Tag ist der 29. Februar (Schalttag).",
  },
  {
    question: "Was passiert, wenn man am 29. Februar Geburtstag hat?",
    answer:
      "Wer am 29. Februar geboren ist, feiert in Nicht-Schaltjahren meist am 28. Februar oder am 1. März. Rechtlich gilt in Deutschland der 1. März als Geburtstag in Nicht-Schaltjahren (§ 188 Abs. 3 BGB analog).",
  },
  {
    question: "Ist 2100 ein Schaltjahr?",
    answer:
      "Nein, 2100 ist kein Schaltjahr. Obwohl 2100 durch 4 teilbar ist, greift die 100er-Regel: Durch 100 teilbare Jahre sind keine Schaltjahre – es sei denn, sie sind auch durch 400 teilbar (wie 2000 oder 2400).",
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
    : prevLeapYear(currentYear + 1); // last leap year before this one
  const daysUntilLeap = currentIsLeap
    ? 0
    : daysUntilNextLeapDay(todayUTC, nextLY);

  // Leap years lists
  const pastLeapYears = leapYearsInRange(2000, currentYear);
  const futureLeapYears = leapYearsInRange(currentYear + 1, 2100);
  const allLeapYears21st = leapYearsInRange(2000, 2100);

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
          name: "Schaltjahr",
          item: "https://aktuellekw.de/schaltjahr",
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
          Schaltjahr {nextLY} &ndash; Wann ist das n&auml;chste Schaltjahr?
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            {currentIsLeap ? (
              <>
                <strong className="text-text-primary">{currentYear}</strong> ist ein{" "}
                <strong className="text-text-primary">Schaltjahr</strong> mit{" "}
                <strong className="text-text-primary">366 Tagen</strong> und
                einem 29.&nbsp;Februar. Das n&auml;chste Schaltjahr nach {currentYear} ist{" "}
                <strong className="text-text-primary">{nextLeapYear(currentYear)}</strong>.
              </>
            ) : (
              <>
                Das n&auml;chste <strong className="text-text-primary">Schaltjahr</strong> ist{" "}
                <strong className="text-text-primary">{nextLY}</strong> &ndash;
                mit <strong className="text-text-primary">366 Tagen</strong> und
                dem zus&auml;tzlichen <strong className="text-text-primary">29.&nbsp;Februar</strong>.
                Das letzte Schaltjahr war{" "}
                <strong className="text-text-primary">{prevLY}</strong>.
              </>
            )}
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
            SECTION 2: SEO-Text Placeholder – Schaltjahr erklärt
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Was ist ein Schaltjahr? &ndash; Einfach erkl&auml;rt
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Schaltjahr erklärt" – 150–200 Wörter.
              Keywords: schaltjahr, schaltjahre, nächstes schaltjahr.
              Themen: Definition Schaltjahr, warum es Schaltjahre gibt
              (astronomisches Sonnenjahr 365,2422 Tage), Gregorianischer
              Kalender, Geschichte (Einführung durch Papst Gregor XIII. 1582),
              Julianischer vs. Gregorianischer Kalender, Schalttag 29. Februar.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Schaltjahr</strong> hat 366 statt
              365 Tage. Der zus&auml;tzliche Tag &ndash; der{" "}
              <strong className="text-text-primary">29. Februar</strong> (Schalttag) &ndash;
              korrigiert die Differenz zwischen unserem Kalender und der
              tats&auml;chlichen Umlaufzeit der Erde um die Sonne
              (ca.&nbsp;365,2422 Tage).
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
            SECTION 3: Schaltjahr-Regeln
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Schaltjahr-Regeln &ndash; Wann ist ein Jahr ein Schaltjahr?
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Schaltjahr-Regeln" – 100–150 Wörter.
              Keywords: schaltjahr, schaltjahre, nächstes schaltjahr.
              Themen: 3 Regeln (durch 4 teilbar, NICHT durch 100,
              AUSSER durch 400), Beispiele (2000 ✓, 1900 ✗, 2100 ✗,
              2400 ✓), Ausnahmen verständlich erklären.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Im Gregorianischen Kalender gelten drei einfache Regeln,
              um zu bestimmen, ob ein Jahr ein{" "}
              <strong className="text-text-primary">Schaltjahr</strong> ist:
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                rule: "Regel 1: Durch 4 teilbar → Schaltjahr",
                example: "z. B. 2024, 2028, 2032",
                color: "text-green-400",
                icon: "✓",
              },
              {
                rule: "Regel 2: Durch 100 teilbar → KEIN Schaltjahr",
                example: "z. B. 1900, 2100, 2200",
                color: "text-red-400",
                icon: "✗",
              },
              {
                rule: "Regel 3: Durch 400 teilbar → Doch Schaltjahr",
                example: "z. B. 1600, 2000, 2400",
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
                    {r.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 4: Jahres-Check – Ist [Jahr] ein Schaltjahr?
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Schaltjahr-Check: Ist ein bestimmtes Jahr ein Schaltjahr?
          </h2>
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
                    Tage
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">
                    Regel
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
                      <td className="px-4 py-2.5 text-text-secondary">
                        {leap ? "366" : "365"}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 5: Liste aller Schaltjahre
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Alle Schaltjahre von 2000 bis 2100
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Schaltjahre Liste" – 60–80 Wörter.
              Keywords: schaltjahre, schaltjahr.
              Themen: Übersicht aller Schaltjahre im 21. Jahrhundert,
              25 Schaltjahre, Ausnahme 2100 (kein Schaltjahr).] */}
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Im 21. Jahrhundert (2000&ndash;2100) gibt es{" "}
            <strong className="text-text-primary">
              {allLeapYears21st.length} Schaltjahre
            </strong>
            . Beachten Sie: <strong className="text-text-primary">2100</strong>{" "}
            ist <em>kein</em> Schaltjahr (100er-Regel).
          </p>

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
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 6: SEO-Text – Nächstes Schaltjahr
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wann ist das n&auml;chste Schaltjahr?
          </h2>
          {/* [PLACEHOLDER: SEO-Text "nächstes Schaltjahr" – 100–150 Wörter.
              Keywords: nächstes schaltjahr, schaltjahr, schaltjahre.
              Themen: Nächstes Schaltjahr nennen, kommende Schaltjahre
              auflisten (2028, 2032, 2036, 2040), was am Schalttag
              passiert, Geburtstag am 29. Februar, kuriose Fakten.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Das <strong className="text-text-primary">n&auml;chste Schaltjahr</strong>{" "}
              {currentIsLeap ? (
                <>
                  ist das aktuelle Jahr <strong className="text-text-primary">{currentYear}</strong>.
                  Danach folgt{" "}
                  <strong className="text-text-primary">{nextLeapYear(currentYear)}</strong>.
                </>
              ) : (
                <>
                  ist <strong className="text-text-primary">{nextLY}</strong>.
                </>
              )}
              {" "}Die kommenden Schaltjahre nach {nextLY} sind:
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
            SECTION 7: SEO-Text – Schalttag & Geburtstag
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Geburtstag am 29. Februar &ndash; der Schalttag
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Schalttag / 29. Februar" – 80–120 Wörter.
              Keywords: schaltjahr, schaltjahre.
              Themen: Was passiert am 29. Februar, Geburtstagskinder
              (sog. "Leapling"), rechtliche Regelung in Deutschland
              (§ 188 BGB), wie oft feiert man, berühmte Persönlichkeiten
              mit Geburtstag am 29.02.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Wer am <strong className="text-text-primary">29. Februar</strong> geboren wird,
              hat nur alle vier Jahre an seinem &bdquo;echten&ldquo; Geburtstag
              Grund zu feiern. In Deutschland gilt: In Nicht-Schaltjahren
              endet die Frist f&uuml;r die Vollj&auml;hrigkeit am{" "}
              <strong className="text-text-primary">1. M&auml;rz</strong>{" "}
              (&sect;&nbsp;188 Abs.&nbsp;3 BGB analog).
            </p>
            <p>
              Weltweit werden nur rund 0,07&nbsp;% aller Menschen an einem
              Schalttag geboren &ndash; statistisch etwa{" "}
              <strong className="text-text-primary">5 Millionen</strong> Menschen.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 8: FAQ
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zum Schaltjahr
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
          <Link href="/datum-heute" className="text-accent hover:underline">
            Datum heute &rarr;
          </Link>
          <Link href="/tage-berechnen" className="text-accent hover:underline">
            Tagerechner &rarr;
          </Link>
          <Link
            href={`/kalenderwoche`}
            className="text-accent hover:underline"
          >
            Kalenderwochen {currentYear} &rarr;
          </Link>
          <Link
            href={`/feiertage/${currentYear}`}
            className="text-accent hover:underline"
          >
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
 * [x] Meta Description: dynamisch mit nächstem Schaltjahr
 * [x] Canonical URL: https://aktuellekw.de/schaltjahr
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Schaltjahr [nextLY] – Wann ist das nächste Schaltjahr?"
 * [x] Schema.org: BreadcrumbList (2 Ebenen)
 * [x] Schema.org: FAQPage (8 Fragen)
 * [x] Cluster Keywords: schaltjahr, schaltjahre, nächstes schaltjahr
 * [x] Stats Row (nächstes/letztes Schaltjahr, Tage bis Schalttag)
 * [x] Schaltjahr-Regeln (3 Regeln visualisiert)
 * [x] Jahres-Check Tabelle (8 Jahre um aktuelles Jahr)
 * [x] Alle Schaltjahre 2000–2100 (Grid)
 * [x] Kommende Schaltjahre (8 nächste, Cards)
 * [x] SEO-Placeholder: 4 Sektionen für zukünftige Texte
 * [x] FAQ (8 Fragen) mit allen Cluster-Keywords
 * [x] Cross-Links: Startseite, Datum heute, Tagerechner, KW, Feiertage, FAQ
 * [x] revalidate = 86400 (tägliche ISR)
 * [ ] TODO: OG-Image erstellen (opengraph-image.tsx)
 * [ ] TODO: SEO-Texte für alle 4 Placeholders schreiben
 */
