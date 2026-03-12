import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_YEARS } from "@/lib/constants";
import {
  getFeiertageFuerJahr,
  getHolidaysPerState,
  getBrueckentage,
  getNextFeiertag,
  getISOWeekNumber,
  formatDateDE,
  getDayNameDE,
  FEIERTAGE_FAQS,
} from "@/lib/feiertage";

export const revalidate = 3600;

/* ── Valid years ───────────────────────────────────────────────── */
const FEIERTAGE_YEARS = CONTENT_YEARS;

/* ── Static Params ─────────────────────────────────────────────── */
export function generateStaticParams() {
  return FEIERTAGE_YEARS.map((y) => ({ year: String(y) }));
}

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (isNaN(year) || year < 2020 || year > 2100) {
    return { title: "Nicht gefunden" };
  }

  const holidays = getFeiertageFuerJahr(year);
  const nationwide = holidays.filter((h) => h.isNationwide).length;
  const regional = holidays.filter((h) => !h.isNationwide).length;

  const title = `Feiertage ${year} Deutschland – Alle ${nationwide + regional} Feiertage`;
  const description = `Gesetzliche Feiertage ${year} in Deutschland: ${nationwide} bundesweite + ${regional} regionale Feiertage. Datum, KW & Bundesland. Br\u00fcckentage ${year} clever planen.`;
  const url = `https://aktuellekw.de/feiertage/${year}`;

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

/* ── Page Component ────────────────────────────────────────────── */
export default async function FeiertageYearPage({
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
  const isCurrentYear = year === currentYear;

  const holidays = getFeiertageFuerJahr(year);
  const nationwideCount = holidays.filter((h) => h.isNationwide).length;
  const regionalCount = holidays.filter((h) => !h.isNationwide).length;
  const stateHolidayCounts = getHolidaysPerState(holidays);
  const brueckentage = getBrueckentage(year);
  const nextHoliday = getNextFeiertag();

  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = FEIERTAGE_YEARS.includes(prevYear);
  const hasNext = FEIERTAGE_YEARS.includes(nextYear);

  /* ── JSON-LD ───────────────────────────────────────────────── */
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
          name: "Feiertage",
          item: "https://aktuellekw.de/feiertage",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Feiertage ${year}`,
          item: `https://aktuellekw.de/feiertage/${year}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Gesetzliche Feiertage ${year} in Deutschland`,
      description: `Alle ${nationwideCount + regionalCount} gesetzlichen Feiertage in Deutschland f\u00fcr das Jahr ${year} mit Datum, Wochentag und Kalenderwoche.`,
      temporalCoverage: `${year}`,
      url: `https://aktuellekw.de/feiertage/${year}`,
      inLanguage: "de-DE",
      publisher: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FEIERTAGE_FAQS.map((faq) => ({
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
          <Link href="/feiertage" className="hover:text-accent transition-colors">
            Feiertage
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Feiertage {year}</span>
        </nav>

        {/* ── Year Navigation ─────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          {hasPrev ? (
            <Link
              href={`/feiertage/${prevYear}`}
              className="text-sm text-accent hover:underline"
            >
              &larr; {prevYear}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/feiertage/${nextYear}`}
              className="text-sm text-accent hover:underline"
            >
              {nextYear} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── H1 + Intro ──────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Feiertage {year} in Deutschland
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Alle <strong className="text-text-primary">{nationwideCount + regionalCount} gesetzlichen Feiertage {year}</strong> in
            Deutschland auf einen Blick: {nationwideCount} bundesweite und {regionalCount} regionale
            Feiertage mit Datum, Wochentag und{" "}
            <strong className="text-text-primary">Kalenderwoche</strong>.
            {brueckentage.length > 0 && (
              <> Nutzen Sie {brueckentage.length} Br&uuml;ckentage f&uuml;r maximale Freizeit.</>
            )}
          </p>

          {/* Schnell-Info box – nur im aktuellen Jahr */}
          {isCurrentYear && (
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
          )}
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Bundesweit", value: String(nationwideCount) },
            { label: "Regional", value: String(regionalCount) },
            { label: "Gesamt", value: String(nationwideCount + regionalCount) },
            { label: "Br\u00fcckentage", value: String(brueckentage.length) },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-secondary border border-border rounded-xl px-4 py-3 text-center"
            >
              <div className="text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-text-secondary mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Feiertage table ─────────────────────────────────── */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Alle gesetzlichen Feiertage {year}
          </h2>
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
                    isCurrentYear && h.date.getTime() < todayUTC.getTime();
                  const isToday =
                    isCurrentYear && h.date.getTime() === todayUTC.getTime();

                  return (
                    <tr
                      key={i}
                      className={`border-b border-border last:border-b-0 ${
                        isToday
                          ? "bg-accent/10"
                          : isCurrentYear && !isPast
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
            {nationwideCount} bundesweite + {regionalCount} regionale
            Feiertage = {nationwideCount + regionalCount} gesamt
          </p>
        </div>

        {/* ── Feiertage nach Bundesland ────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Feiertage {year} nach Bundesland
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die Anzahl der gesetzlichen Feiertage variiert je nach Bundesland
            zwischen 10 und 13 Tagen. Hier die &Uuml;bersicht f&uuml;r {year}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stateHolidayCounts.map((s) => {
              const slug = s.name
                .toLowerCase()
                .replace(/ä/g, "ae")
                .replace(/ö/g, "oe")
                .replace(/ü/g, "ue")
                .replace(/ß/g, "ss")
                .replace(/\s+/g, "-");
              return (
                <Link
                  key={s.code}
                  href={`/feiertage/${year}/${slug}`}
                  className="flex items-center justify-between bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-secondary/80 transition-colors"
                >
                  <span className="text-text-primary font-medium">
                    {s.name}
                  </span>
                  <span className="text-text-secondary">
                    <span className="text-accent font-semibold">{s.count}</span>{" "}
                    Feiertage →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Brückentage ──────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Br&uuml;ckentage {year}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mit <strong className="text-text-primary">Br&uuml;ckentagen</strong>{" "}
            holen Sie das Maximum aus Ihrem Urlaub heraus. Wenn ein Feiertag auf
            Donnerstag oder Dienstag f&auml;llt, gen&uuml;gt oft ein einziger
            Urlaubstag f&uuml;r ein verl&auml;ngertes Wochenende.
          </p>
          {brueckentage.length > 0 ? (
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
                      Br&uuml;ckentag-Tipp
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">
                      Urlaub
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">
                      Frei
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {brueckentage.map((b, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                        {b.feiertag}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {formatDateDE(b.feiertagDate)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {b.wochentag}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {b.tipp}
                      </td>
                      <td className="px-4 py-3 text-accent font-semibold text-center">
                        {b.urlaubstage}
                      </td>
                      <td className="px-4 py-3 text-text-primary font-semibold text-center">
                        {b.freieTage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm text-text-secondary">
              {year} bieten die bundesweiten Feiertage leider keine
              klassischen Br&uuml;ckentage, da keiner g&uuml;nstig auf Dienstag,
              Mittwoch oder Donnerstag f&auml;llt. Pr&uuml;fen Sie die regionalen
              Feiertage Ihres Bundeslandes f&uuml;r zus&auml;tzliche
              M&ouml;glichkeiten.
            </div>
          )}
        </div>

        {/* ── SEO Erklärtext ──────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Gesetzliche Feiertage {year} erkl&auml;rt
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

        {/* ── FAQ ──────────────────────────────────────────────── */}
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

        {/* ── Year Navigation (bottom) ─────────────────────────── */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Link
              href={`/feiertage/${prevYear}`}
              className="text-sm text-accent hover:underline"
            >
              &larr; Feiertage {prevYear}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/feiertage/${nextYear}`}
              className="text-sm text-accent hover:underline"
            >
              Feiertage {nextYear} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/feiertage" className="text-accent hover:underline">
            Feiertage &Uuml;bersicht &rarr;
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche &rarr;
          </Link>
          <Link href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {year} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
