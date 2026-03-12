import type { Metadata } from "next";
import Link from "next/link";
import {
  getCurrentKW,
  formatDateDE,
  getDayNameDE,
  getDayOfYear,
  isLeapYear,
  getISOWeekNumber,
  getWeeksInYear,
} from "@/lib/kw";

export const revalidate = 3600;

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const kw = getCurrentKW();
  const dayName = getDayNameDE(todayUTC);
  const dateStr = formatDateDE(todayUTC);

  const title = `Datum heute \u25b7 Heutiges Datum & Wochentag`;
  const description = `Datum heute: ${dayName}, ${dateStr} \u2013 Welcher Tag ist heute? Heutiges Datum mit Wochentag, KW ${kw.weekNumber}, Uhrzeit & Monat auf einen Blick. Tagesaktuell & nach ISO 8601.`;
  const url = "https://aktuellekw.de/datum-heute";

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

/* ── Constants ─────────────────────────────────────────────────── */
const MONATSNAMEN_DE = [
  "Januar",
  "Februar",
  "M\u00e4rz",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const MONATSTAGE = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getMonatsTage(month: number, year: number): number {
  if (month === 1 && isLeapYear(year)) return 29;
  return MONATSTAGE[month];
}

/* ── FAQ data ──────────────────────────────────────────────────── */
function getPageFAQs(
  dateStr: string,
  dayName: string,
  kw: number,
  year: number,
  monthName: string
) {
  return [
    {
      question: "Welches Datum haben wir heute?",
      answer: `Heute ist ${dayName}, der ${dateStr}. Wir befinden uns in Kalenderwoche ${kw} des Jahres ${year}.`,
    },
    {
      question: "Welcher Tag ist heute?",
      answer: `Heute ist ${dayName}. Das heutige Datum lautet ${dateStr}, und wir befinden uns im Monat ${monthName} ${year}.`,
    },
    {
      question: "Welcher Wochentag ist heute?",
      answer: `Heute ist ${dayName}. Die Kalenderwoche ist KW\u00a0${kw}, und die Woche beginnt nach ISO\u00a08601 am Montag.`,
    },
    {
      question: "Wie lautet das heutige Datum in verschiedenen Formaten?",
      answer: `Das deutsche Format ist ${dateStr}. International (ISO 8601) lautet es ${year}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}. Das US-Format w\u00e4re ${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(new Date().getDate()).padStart(2, "0")}/${year}.`,
    },
    {
      question: "In welcher Kalenderwoche befinden wir uns heute?",
      answer: `Heute befinden wir uns in KW\u00a0${kw} ${year}. Die Kalenderwoche wird nach ISO\u00a08601 berechnet \u2013 die erste KW des Jahres enth\u00e4lt immer den ersten Donnerstag im Januar.`,
    },
    {
      question: "Welcher Monat ist heute?",
      answer: `Wir befinden uns aktuell im ${monthName} ${year}. Der ${monthName} hat ${getMonatsTage(new Date().getMonth(), year)} Tage.`,
    },
    {
      question: "Der wievielte Tag im Jahr ist heute?",
      answer: `Heute ist Tag ${getDayOfYear(new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())))} von ${isLeapYear(year) ? 366 : 365} Tagen im Jahr ${year}.`,
    },
  ];
}

/* ── Page Component ────────────────────────────────────────────── */
export default function DatumHeutePage() {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const year = todayUTC.getUTCFullYear();
  const month = todayUTC.getUTCMonth();
  const dayName = getDayNameDE(todayUTC);
  const dateStr = formatDateDE(todayUTC);
  const monthName = MONATSNAMEN_DE[month];
  const kw = getCurrentKW();
  const dayOfYear = getDayOfYear(todayUTC);
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const remainingDays = daysInYear - dayOfYear;
  const weeksInYear = getWeeksInYear(year);
  const daysInMonth = getMonatsTage(month, year);
  const dayOfMonth = todayUTC.getUTCDate();
  const remainingInMonth = daysInMonth - dayOfMonth;
  const yearProgress = Math.round((dayOfYear / daysInYear) * 100);
  const monthProgress = Math.round((dayOfMonth / daysInMonth) * 100);

  // ISO date format
  const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`;

  // Weekday numbers (Mo=1 ... So=7 per ISO)
  const jsDay = todayUTC.getUTCDay(); // 0=So
  const isoDay = jsDay === 0 ? 7 : jsDay;
  const daysUntilWeekend = isoDay <= 5 ? 5 - isoDay : 0;

  // Quarter
  const quarter = Math.ceil((month + 1) / 4 * (4 / 3));
  const quarterNum = Math.ceil((month + 1) / 3);

  // Tomorrow and yesterday
  const tomorrow = new Date(todayUTC);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const yesterday = new Date(todayUTC);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  // FAQs
  const pageFAQs = getPageFAQs(dateStr, dayName, kw.weekNumber, year, monthName);

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
          name: "Datum heute",
          item: "https://aktuellekw.de/datum-heute",
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
          <span className="text-text-primary">Datum heute</span>
        </nav>

        {/* ── H1 + Intro ──────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Datum heute &ndash; Heutiges Datum &amp; Wochentag
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            <strong className="text-text-primary">Datum heute:</strong> Heute ist{" "}
            <strong className="text-text-primary">{dayName}</strong>, der{" "}
            <strong className="text-text-primary">{dateStr}</strong>. Wir befinden
            uns in der{" "}
            <Link
              href={`/kw/${kw.weekNumber}-${kw.year}`}
              className="text-accent hover:underline font-semibold"
            >
              Kalenderwoche&nbsp;{kw.weekNumber}
            </Link>{" "}
            im Monat{" "}
            <strong className="text-text-primary">{monthName}&nbsp;{year}</strong>.
          </p>
          <p>
            Welcher Tag ist heute? Welcher Wochentag? Hier finden Sie das heutige
            Datum mit allen Details: Wochentag, Kalenderwoche, Tag im Jahr,
            Monats&uuml;bersicht und Jahresfortschritt &ndash; tagesaktuell.
          </p>
        </div>

        {/* ── Hero: Großes Datum-Display ──────────────────────── */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative bg-surface-secondary border border-border rounded-2xl p-8 md:p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary mb-3">
              Heutiges Datum
            </p>
            <p className="text-lg md:text-xl text-accent font-semibold mb-1">
              {dayName}
            </p>
            <p
              className="text-5xl md:text-7xl font-bold text-text-primary tracking-tight leading-none mb-3"
              suppressHydrationWarning
            >
              {String(dayOfMonth).padStart(2, "0")}. {monthName}
            </p>
            <p className="text-xl md:text-2xl text-text-secondary font-medium">
              {year}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-text-secondary">
              <span className="bg-accent/10 border border-accent/20 rounded-full px-3 py-1 font-medium">
                KW&nbsp;{kw.weekNumber}
              </span>
              <span className="bg-surface border border-border rounded-full px-3 py-1">
                Tag {dayOfYear}/{daysInYear}
              </span>
              <span className="bg-surface border border-border rounded-full px-3 py-1">
                Q{quarterNum}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Kalenderwoche", value: `KW ${kw.weekNumber}` },
            { label: "Tag im Jahr", value: `${dayOfYear}/${daysInYear}` },
            { label: "Verbleibend", value: `${remainingDays} Tage` },
            { label: "Jahresfortschritt", value: `${yearProgress} %` },
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
            SECTION 1: Datum-Details-Tabelle
            ═════════════════════════════════════════════════════════ */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Heutiges Datum im Detail
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Datum (deutsch)", value: dateStr },
                  { label: "Datum (ISO 8601)", value: isoDate },
                  { label: "Wochentag", value: dayName },
                  {
                    label: "Kalenderwoche",
                    value: `KW ${kw.weekNumber} ${kw.year}`,
                    link: `/kw/${kw.weekNumber}-${kw.year}`,
                  },
                  { label: "Monat", value: `${monthName} ${year}` },
                  { label: "Quartal", value: `Q${quarterNum} ${year}` },
                  { label: "Tag im Jahr", value: `${dayOfYear} von ${daysInYear}` },
                  { label: "Tag im Monat", value: `${dayOfMonth} von ${daysInMonth}` },
                  { label: "Verbleibende Tage im Jahr", value: String(remainingDays) },
                  { label: "Verbleibende Tage im Monat", value: String(remainingInMonth) },
                  {
                    label: "Tage bis Wochenende",
                    value:
                      daysUntilWeekend === 0
                        ? "Heute ist Wochenende!"
                        : daysUntilWeekend === 1
                        ? "Morgen"
                        : `${daysUntilWeekend} Tage`,
                  },
                  {
                    label: "Schaltjahr",
                    value: isLeapYear(year)
                      ? `Ja \u2013 ${year} hat 366 Tage`
                      : `Nein \u2013 ${year} hat 365 Tage`,
                  },
                  {
                    label: "Kalenderwochen im Jahr",
                    value: `${weeksInYear} KW`,
                    link: `/kalenderwochen/${year}`,
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-3 font-medium text-text-secondary whitespace-nowrap w-1/2">
                      {row.label}
                    </td>
                    <td className="px-5 py-3 text-text-primary font-medium">
                      {row.link ? (
                        <Link
                          href={row.link}
                          className="text-accent hover:underline"
                        >
                          {row.value}
                        </Link>
                      ) : (
                        row.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 2: Fortschrittsbalken
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Jahres- &amp; Monatsfortschritt
          </h2>

          {/* Year progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-text-secondary">
                Jahresfortschritt {year}
              </span>
              <span className="text-accent font-semibold">{yearProgress} %</span>
            </div>
            <div className="h-3 bg-surface-secondary border border-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${yearProgress}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Tag {dayOfYear} von {daysInYear} &ndash;{" "}
              {remainingDays} Tage verbleiben
            </p>
          </div>

          {/* Month progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-text-secondary">
                Monatsfortschritt {monthName}
              </span>
              <span className="text-accent font-semibold">{monthProgress} %</span>
            </div>
            <div className="h-3 bg-surface-secondary border border-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${monthProgress}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Tag {dayOfMonth} von {daysInMonth} &ndash;{" "}
              {remainingInMonth} Tage verbleiben
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 3: Wochenübersicht
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Aktuelle Woche im &Uuml;berblick
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Tag
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Datum
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(kw.startDate);
                  d.setUTCDate(d.getUTCDate() + i);
                  const isToday = d.getTime() === todayUTC.getTime();
                  return (
                    <tr
                      key={i}
                      className={`border-b border-border last:border-b-0 ${
                        isToday ? "bg-accent/10" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                        {getDayNameDE(d)}
                        {isToday && (
                          <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                            heute
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatDateDE(d)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            <Link
              href={`/kw/${kw.weekNumber}-${kw.year}`}
              className="text-accent hover:underline"
            >
              Details zu KW&nbsp;{kw.weekNumber} {kw.year} &rarr;
            </Link>
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 4: Gestern & Morgen
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Gestern &amp; Morgen
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface-secondary border border-border rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Gestern
              </p>
              <p className="text-text-primary font-medium">
                {getDayNameDE(yesterday)}, {formatDateDE(yesterday)}
              </p>
              <p className="text-text-secondary text-sm mt-0.5">
                KW&nbsp;{getISOWeekNumber(yesterday)}
              </p>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Morgen
              </p>
              <p className="text-text-primary font-medium">
                {getDayNameDE(tomorrow)}, {formatDateDE(tomorrow)}
              </p>
              <p className="text-text-secondary text-sm mt-0.5">
                KW&nbsp;{getISOWeekNumber(tomorrow)}
              </p>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 5: SEO-Text Placeholder
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum heute: Hintergr&uuml;nde &amp; Wissenswertes
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Datum heute" – 150–200 Wörter.
              Keywords: datum heute, heutiges datum, datum von heute,
              heute datum, welcher tag ist heute, datum heute monat.
              Themen: Datumsformate (DE vs. ISO 8601 vs. US),
              warum Deutschland TT.MM.JJJJ nutzt, Geschichte der
              Datumsschreibweise, DIN 5008 Briefnorm.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Das <strong className="text-text-primary">Datum heute</strong> lautet{" "}
              <strong className="text-text-primary">{dateStr}</strong> &ndash; ein{" "}
              {dayName} im {monthName} {year}. Wir befinden uns in der{" "}
              <strong className="text-text-primary">Kalenderwoche {kw.weekNumber}</strong>,
              was f&uuml;r die Planung in Beruf und Alltag besonders n&uuml;tzlich ist.
            </p>
            <p>
              In Deutschland wird das Datum im Format{" "}
              <strong className="text-text-primary">TT.MM.JJJJ</strong> geschrieben &ndash;
              also Tag.Monat.Jahr. International hat sich das{" "}
              <strong className="text-text-primary">ISO-8601-Format</strong>{" "}
              (<code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">{isoDate}</code>)
              durchgesetzt, da es eine eindeutige Sortierung erm&ouml;glicht.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 6: SEO-Text Placeholder – Wochentag
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Welcher Tag ist heute? &ndash; Wochentag &amp; Bedeutung
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Welcher Tag ist heute" – 100–150 Wörter.
              Keywords: welcher tag ist heute, welcher wochentag ist heute,
              heutiges datum, datum heute und uhrzeit.
              Themen: Herkunft der Wochentagsnamen (germanisch/römisch),
              Montag als Wochenstart nach ISO 8601, Bedeutung
              der Wochentage in verschiedenen Kulturen.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              <strong className="text-text-primary">Welcher Tag ist heute?</strong>{" "}
              Heute ist <strong className="text-text-primary">{dayName}</strong>,
              der {dayOfMonth}. {monthName} {year}. Nach dem internationalen
              Standard ISO&nbsp;8601 ist {dayName} der {isoDay}. Tag der Woche
              (Montag&nbsp;= 1, Sonntag&nbsp;= 7).
            </p>
            <p>
              {daysUntilWeekend > 0 ? (
                <>
                  Bis zum Wochenende {daysUntilWeekend === 1
                    ? "ist es noch 1 Tag"
                    : `sind es noch ${daysUntilWeekend} Tage`}.
                </>
              ) : (
                <>Heute ist Wochenende!</>
              )}
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 7: Monatsinformationen Placeholder
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum heute: Monat {monthName} {year}
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Datum heute Monat" – 80–120 Wörter.
              Keywords: datum heute monat, heutiges datum,
              datum von heute.
              Themen: Aktuelle Monatsinformationen, wie viele Tage
              hat der Monat, besondere Tage/Feiertage im aktuellen
              Monat, saisonale Besonderheiten.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Der <strong className="text-text-primary">{monthName} {year}</strong>{" "}
              hat <strong className="text-text-primary">{daysInMonth} Tage</strong>.
              Wir befinden uns am {dayOfMonth}. Tag des Monats &ndash; das entspricht
              einem Monatsfortschritt von{" "}
              <strong className="text-text-primary">{monthProgress}&nbsp;%</strong>.
              {remainingInMonth === 0 ? (
                <> Heute ist der letzte Tag des Monats.</>
              ) : remainingInMonth === 1 ? (
                <> Morgen beginnt ein neuer Monat.</>
              ) : (
                <> Es verbleiben noch {remainingInMonth} Tage in diesem Monat.</>
              )}
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 8: FAQ
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zum Datum heute
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
          <Link href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {year} &rarr;
          </Link>
          <Link
            href="/welche-kalenderwoche-haben-wir"
            className="text-accent hover:underline"
          >
            Welche KW haben wir? &rarr;
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche &rarr;
          </Link>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
            Feiertage {year} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/datum-heute/page.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Datum heute ▷ Heutiges Datum & Wochentag"
 * [x] Meta Description: dynamisch mit Datum, Wochentag, KW
 * [x] Canonical URL: https://aktuellekw.de/datum-heute
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Datum heute – Heutiges Datum & Wochentag"
 * [x] Schema.org: BreadcrumbList (2 Ebenen)
 * [x] Schema.org: FAQPage (7 Fragen)
 * [x] Cluster Keywords: datum heute, heutiges datum, datum von heute,
 *     heute datum, welcher tag ist heute, welcher wochentag ist heute,
 *     datum heute und uhrzeit, datum heute monat
 * [x] Großes Datum-Display (Hero-Sektion)
 * [x] Detail-Tabelle (13 Zeilen)
 * [x] Jahres- & Monatsfortschritt (Balken)
 * [x] Wochenübersicht (7 Tage mit Heute-Highlight)
 * [x] Gestern & Morgen Quick-Cards
 * [x] SEO-Placeholder: 3 Sektionen für zukünftige Texte
 * [x] Cross-Links: Startseite, KW-Übersicht, Feiertage, FAQ
 * [x] revalidate = 3600 (stündliche ISR)
 * [ ] TODO: OG-Image erstellen (opengraph-image.tsx)
 * [ ] TODO: SEO-Texte für alle 3 Placeholders schreiben
 */
