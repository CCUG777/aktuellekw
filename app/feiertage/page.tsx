import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentKW } from "@/lib/kw";
import { CONTENT_YEARS } from "@/lib/constants";
import {
  getFeiertageFuerJahr,
  getHolidaysPerState,
  getNextFeiertag,
  getISOWeekNumber,
  formatDateDE,
  getDayNameDE,
  FEIERTAGE_FAQS,
} from "@/lib/feiertage";

export const revalidate = 3600;

/* ── Metadata ────────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const ogTitle = `Feiertage 2025, 2026 & 2027 Deutschland`;
  const ogDescription = `Gesetzliche Feiertage 2025, 2026 & 2027 im Überblick. Datum, Wochentag & KW pro Bundesland. Nächster Feiertag + Brückentage.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: { canonical: "https://aktuellekw.de/feiertage" },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/feiertage",
      type: "website",
      locale: "de_DE",
      siteName: "aktuellekw.de",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

/* ── Page Component ──────────────────────────────────────────────── */
export default function FeiertagePage() {
  const currentKW = getCurrentKW();
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const currentYear = todayUTC.getUTCFullYear();

  const years = CONTENT_YEARS;
  const holidaysByYear = Object.fromEntries(
    years.map((y) => [y, getFeiertageFuerJahr(y)])
  );

  const nextHoliday = getNextFeiertag();
  const stateHolidayCounts = getHolidaysPerState(
    getFeiertageFuerJahr(currentYear)
  );

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
          name: "Feiertage Deutschland",
          item: "https://aktuellekw.de/feiertage",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "de-DE",
      mainEntity: FEIERTAGE_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".next-holiday-box"],
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

        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            Startseite
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Feiertage Deutschland</span>
        </nav>

        {/* ── H1 + Intro ─────────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Feiertage 2025, 2026 &amp; 2027 in Deutschland
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Alle <strong className="text-text-primary">gesetzlichen Feiertage in Deutschland</strong> auf
            einen Blick: Wir zeigen Ihnen Datum, Wochentag und{" "}
            <strong className="text-text-primary">Kalenderwoche</strong> jedes
            Feiertags f&uuml;r die Jahre 2025, 2026 und 2027. Erfahren Sie, welche
            Feiertage in Ihrem Bundesland gelten und wie Sie{" "}
            <strong className="text-text-primary">Br&uuml;ckentage</strong> optimal
            nutzen k&ouml;nnen.
          </p>

          {/* Schnell-Info box */}
          <div className="next-holiday-box bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">
              N&auml;chster Feiertag:
            </strong>{" "}
            <span className="text-accent font-semibold">
              {nextHoliday.feiertag.name}
            </span>{" "}
            am {getDayNameDE(nextHoliday.feiertag.date)},{" "}
            {formatDateDE(nextHoliday.feiertag.date)} (KW&nbsp;
            {getISOWeekNumber(nextHoliday.feiertag.date)})
            {nextHoliday.daysUntil === 0
              ? " \u2013 heute!"
              : nextHoliday.daysUntil === 1
              ? " \u2013 morgen!"
              : ` \u2013 in ${nextHoliday.daysUntil} Tagen`}
          </div>
        </div>

        {/* ── Jahr-Schnelllinks ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {years.map((year) => {
            const holidays = holidaysByYear[year];
            const count = holidays.length;
            const isActive = year === currentYear;
            return (
              <Link
                key={year}
                href={`/feiertage/${year}`}
                className={`
                  flex flex-col items-center bg-surface-secondary border rounded-xl px-4 py-4
                  hover:border-accent/50 transition-all
                  ${isActive ? "border-accent/40 ring-1 ring-accent/20" : "border-border"}
                `}
              >
                <span className="text-2xl font-bold text-accent">{year}</span>
                <span className="text-xs text-text-secondary mt-1">
                  {count} Feiertage
                </span>
                <span className="text-xs text-accent mt-2 font-medium">
                  Details &rarr;
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Nächster Feiertag Detail ────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            N&auml;chster Feiertag in Deutschland
          </h2>
          <div className="bg-surface-secondary border border-border rounded-2xl p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 shrink-0">
                <span className="text-2xl font-bold text-accent">
                  {nextHoliday.feiertag.date.getUTCDate()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {nextHoliday.feiertag.name}
                </h3>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                  <dt className="text-text-secondary">Datum</dt>
                  <dd className="text-text-primary font-medium">
                    {formatDateDE(nextHoliday.feiertag.date)}
                  </dd>
                  <dt className="text-text-secondary">Wochentag</dt>
                  <dd className="text-text-primary font-medium">
                    {getDayNameDE(nextHoliday.feiertag.date)}
                  </dd>
                  <dt className="text-text-secondary">Kalenderwoche</dt>
                  <dd className="text-text-primary font-medium">
                    KW {getISOWeekNumber(nextHoliday.feiertag.date)}
                  </dd>
                  <dt className="text-text-secondary">Noch</dt>
                  <dd className="text-accent font-semibold">
                    {nextHoliday.daysUntil === 0
                      ? "Heute!"
                      : nextHoliday.daysUntil === 1
                      ? "1 Tag"
                      : `${nextHoliday.daysUntil} Tage`}
                  </dd>
                  <dt className="text-text-secondary">Gilt in</dt>
                  <dd className="text-text-primary font-medium">
                    {nextHoliday.feiertag.isNationwide
                      ? "allen Bundesl\u00e4ndern"
                      : nextHoliday.feiertag.states.join(", ")}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* ── Kompakte Tabellen pro Jahr ──────────────────────────── */}
        {years.map((year) => {
          const holidays = holidaysByYear[year];
          const isCurrentTableYear = year === currentYear;

          return (
            <div key={year} className="mt-14">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  Gesetzliche Feiertage {year}
                </h2>
                <Link
                  href={`/feiertage/${year}`}
                  className="text-sm text-accent hover:underline"
                >
                  Alle Details &rarr;
                </Link>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-secondary">
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">
                        Feiertag
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">
                        Datum
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">
                        Wochentag
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">
                        KW
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">
                        Bundesl&auml;nder
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {holidays.map((h, i) => {
                      const isPast =
                        isCurrentTableYear &&
                        h.date.getTime() < todayUTC.getTime();
                      const isToday =
                        isCurrentTableYear &&
                        h.date.getTime() === todayUTC.getTime();

                      return (
                        <tr
                          key={`${year}-${i}`}
                          className={`border-b border-border last:border-b-0 ${
                            isToday
                              ? "bg-accent/10"
                              : isCurrentTableYear && !isPast
                              ? "bg-accent/5"
                              : isPast
                              ? "opacity-60"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                            {h.name}
                            {isToday && (
                              <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                                heute
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                            {formatDateDE(h.date)}
                          </td>
                          <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                            {getDayNameDE(h.date)}
                          </td>
                          <td className="px-4 py-3 text-text-secondary">
                            <Link
                              href={`/kw/${getISOWeekNumber(h.date)}-${year}`}
                              className="text-accent hover:underline"
                            >
                              KW&nbsp;{getISOWeekNumber(h.date)}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-text-secondary text-xs">
                            {h.isNationwide ? (
                              <span className="font-medium text-text-primary">
                                alle
                              </span>
                            ) : (
                              h.states.join(", ")
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-text-secondary text-xs mt-2">
                {holidays.filter((h) => h.isNationwide).length} bundesweite +{" "}
                {holidays.filter((h) => !h.isNationwide).length} regionale
                Feiertage = {holidays.length} gesamt
              </p>
            </div>
          );
        })}

        {/* ── Feiertage nach Bundesland ──────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Feiertage {currentYear} nach Bundesland
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die Anzahl der gesetzlichen Feiertage variiert je nach Bundesland
            zwischen 10 und 13 Tagen. Hier die &Uuml;bersicht f&uuml;r{" "}
            {currentYear}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stateHolidayCounts.map((s) => (
              <div
                key={s.code}
                className="flex items-center justify-between bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm"
              >
                <span className="text-text-primary font-medium">
                  {s.name}
                </span>
                <span className="text-text-secondary">
                  <span className="text-accent font-semibold">{s.count}</span>{" "}
                  Feiertage
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEO Erklärtext ──────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Gesetzliche Feiertage in Deutschland erkl&auml;rt
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Deutschland hat <strong className="text-text-primary">9 bundeseinheitliche
              Feiertage</strong>, die in allen 16 Bundesl&auml;ndern gelten. Dazu
              kommen je nach Region weitere Feiertage, sodass die Gesamtzahl
              zwischen 10 und 13 pro Jahr schwankt.
            </p>
            <p>
              Einige Feiertage haben ein{" "}
              <strong className="text-text-primary">festes Datum</strong> (z.&thinsp;B.
              Neujahr am 1.&nbsp;Januar oder der Tag der Deutschen Einheit am
              3.&nbsp;Oktober), w&auml;hrend andere{" "}
              <strong className="text-text-primary">bewegliche Feiertage</strong>{" "}
              sind und sich nach dem Osterdatum richten. Karfreitag,
              Ostermontag, Christi Himmelfahrt und Pfingstmontag &auml;ndern ihr
              Datum jedes Jahr.
            </p>
            <p>
              F&uuml;r die Planung ist es hilfreich, die{" "}
              <strong className="text-text-primary">Kalenderwoche</strong> jedes
              Feiertags zu kennen. Die KW-Angabe in unserer Tabelle ist nach dem
              internationalen Standard ISO&nbsp;8601 berechnet und verlinkt
              direkt zur entsprechenden{" "}
              <Link href="/kalenderwoche" className="text-accent hover:underline">
                KW-&Uuml;bersicht
              </Link>
              .
            </p>
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zu Feiertagen
          </h2>
          <div className="space-y-2.5">
            {FEIERTAGE_FAQS.map((faq, i) => (
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

        {/* ── Abschluss-Links ─────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche &rarr;
          </Link>
          <Link href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {currentYear} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
