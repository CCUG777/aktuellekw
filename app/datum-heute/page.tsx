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

/* ── Calendar helper ───────────────────────────────────────────── */
function getMonthCalendar(year: number, month: number) {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const daysInMonth = getMonatsTage(month, year);
  // ISO weekday: Mon=1 ... Sun=7
  const jsDay = firstDay.getUTCDay();
  const startOffset = jsDay === 0 ? 6 : jsDay - 1; // slots before day 1

  const weeks: (number | null)[][] = [];
  let current: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) current.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    current.push(d);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length > 0) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }
  return weeks;
}

/* ── Timezone data ─────────────────────────────────────────────── */
const WORLD_TIMEZONES = [
  { city: "Berlin", country: "Deutschland", offset: "UTC+1 / UTC+2" },
  { city: "London", country: "Vereinigtes K\u00f6nigreich", offset: "UTC+0 / UTC+1" },
  { city: "New York", country: "USA", offset: "UTC\u22125 / UTC\u22124" },
  { city: "Los Angeles", country: "USA", offset: "UTC\u22128 / UTC\u22127" },
  { city: "Tokio", country: "Japan", offset: "UTC+9" },
  { city: "Sydney", country: "Australien", offset: "UTC+10 / UTC+11" },
];

/* ── FAQ data ──────────────────────────────────────────────────── */
function getPageFAQs(
  dateStr: string,
  dayName: string,
  kw: number,
  year: number,
  monthName: string,
  isoDate: string
) {
  return [
    {
      question: "Welches Datum ist heute?",
      answer: `Heute ist der ${dateStr}. Achte darauf, dass dein Ger\u00e4t die richtige Zeitzone nutzt, sonst kann das Datum abweichen. In Deutschland, \u00d6sterreich und der Schweiz ist es bei korrekter Zeitzone identisch.`,
    },
    {
      question: "Welcher Wochentag ist heute?",
      answer: `Heute ist ${dayName}. Wenn dir ein anderer Wochentag angezeigt wird, stimmt meist die Zeitzone oder die automatische Uhrzeit/Datum-Einstellung nicht. Pr\u00fcfe daf\u00fcr die Systemzeit auf deinem Handy oder Computer.`,
    },
    {
      question: "Welchen Tag haben wir heute und wie sp\u00e4t ist es?",
      answer: `Heute ist ${dayName}, der ${dateStr}. Die aktuelle Uhrzeit h\u00e4ngt von deinem Standort (Zeitzone) ab und kann je nach Ger\u00e4t unterschiedlich angezeigt werden. Aktiviere am besten die automatische Zeit- und Zeitzonen-Einstellung.`,
    },
    {
      question: "Welcher Tag ist heute wirklich (Deutschland/\u00d6sterreich/Schweiz)?",
      answer: `In Deutschland, \u00d6sterreich und der Schweiz ist heute ${dayName}, der ${dateStr} (bei korrekt eingestellter Zeitzone). Wenn dein Datum abweicht, ist fast immer die Zeitzone falsch oder die automatische Zeit deaktiviert.`,
    },
    {
      question: "Warum zeigt mein Handy das falsche Datum an?",
      answer: 'Meist ist die automatische Uhrzeit/Zeitzone deaktiviert oder falsch eingestellt. Auch ein manueller Kalender- oder Region-Fehler kann das Datum verschieben. Aktiviere \u201eDatum & Uhrzeit automatisch\u201c und pr\u00fcfe die Zeitzone sowie die Regionseinstellungen.',
    },
    {
      question: "Wie bringe ich das Datum auf den Startbildschirm (Android/iPhone)?",
      answer: 'Auf Android f\u00fcgst du das Datum \u00fcber ein Widget hinzu: Startbildschirm lange dr\u00fccken \u2192 \u201eWidgets\u201c \u2192 Uhr/Datum-Widget ausw\u00e4hlen. Auf dem iPhone: Startbildschirm lange dr\u00fccken \u2192 \u201e+\u201c \u2192 \u201eKalender\u201c oder \u201eUhr\u201c hinzuf\u00fcgen.',
    },
    {
      question: "Welches Datum ist morgen?",
      answer: `Morgen ist der ${(() => { const t = new Date(Date.UTC(year, new Date().getMonth(), new Date().getDate() + 1)); return formatDateDE(t); })()}. Wenn das heutige Datum bei dir nicht stimmt, kann auch das morgige Datum falsch wirken. Stelle Datum/Uhrzeit und Zeitzone auf automatisch.`,
    },
    {
      question: "Welche Kalenderwoche ist heute?",
      answer: `Heute ist Kalenderwoche ${kw} (KW\u00a0${kw}). Die Anzeige kann je nach Kalender-App variieren, wenn die Wochenz\u00e4hlung oder Regionseinstellung anders konfiguriert ist. Nutze eine Kalenderansicht, die ISO-Kalenderwochen unterst\u00fctzt.`,
    },
    {
      question: "Wie schreibe ich das heutige Datum richtig (TT.MM.JJJJ vs. ISO 8601)?",
      answer: `Im DACH-Raum ist \u00fcblich: ${dateStr} (TT.MM.JJJJ). Im ISO-Format nach ISO\u00a08601 schreibst du: ${isoDate} (JJJJ-MM-TT). In technischen Kontexten ist ISO\u00a08601 die sicherste Schreibweise.`,
    },
    {
      question: "Welche Excel-Formel zeigt das heutige Datum an?",
      answer: "In Excel zeigt =HEUTE() das heutige Datum an, ohne Uhrzeit. Wenn du zus\u00e4tzlich die aktuelle Uhrzeit brauchst, nutze =JETZT(). Das Anzeigeformat (z.\u00a0B. TT.MM.JJJJ oder ISO) stellst du \u00fcber die Zellformatierung ein.",
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
  const quarterNum = Math.ceil((month + 1) / 3);

  // Tomorrow and yesterday
  const tomorrow = new Date(todayUTC);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const yesterday = new Date(todayUTC);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  // Overmorgen
  const overmorgen = new Date(todayUTC);
  overmorgen.setUTCDate(overmorgen.getUTCDate() + 2);

  // Month calendar
  const calendarWeeks = getMonthCalendar(year, month);

  // FAQs
  const pageFAQs = getPageFAQs(dateStr, dayName, kw.weekNumber, year, monthName, isoDate);

  // JSON-LD
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://aktuellekw.de/datum-heute#breadcrumb",
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
      "@id": "https://aktuellekw.de/datum-heute#faqpage",
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: "2026-01-01",
      dateModified: new Date().toISOString().split("T")[0],
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

        {/* ── H1 + Intro (from MD) ──────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Datum heute: heutiges Datum, Wochentag, Kalenderwoche &amp; Uhrzeit
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            <strong className="text-text-primary">Datum heute:</strong>{" "}
            <strong className="text-text-primary">{dayName}</strong>, {dateStr} &ndash;{" "}
            <Link
              href={`/kw/${kw.weekNumber}-${kw.year}`}
              className="text-accent hover:underline font-semibold"
            >
              KW&nbsp;{kw.weekNumber}
            </Link>
            , <strong className="text-text-primary">{year}</strong> (MEZ, DE/AT/CH).
            Hier bekommst du alles auf einen Blick: Datum, Wochentag, Kalenderwoche
            und die aktuelle Uhrzeit &ndash; zus&auml;tzlich in Kurzform,
            ausgeschrieben und im{" "}
            <strong className="text-text-primary">ISO-Format ({isoDate})</strong>.
          </p>
          <p>
            Datum und Uhrzeit k&ouml;nnen je nach Land, Zeitzone oder Sommerzeit-Regel
            abweichen &ndash; besonders, wenn du mit internationalen Teams arbeitest
            oder Reisen planst.
          </p>
          <p>
            Und damit du nicht st&auml;ndig suchen musst, findest du direkt praktische
            Kurz-Anleitungen f&uuml;r{" "}
            <strong className="text-text-primary">Startbildschirm/Widgets</strong>{" "}
            (Android, iPhone, Windows, Mac), eine kompakte{" "}
            <strong className="text-text-primary">Weltzeit-&Uuml;bersicht</strong>{" "}
            sowie den schnellen Check zu{" "}
            <strong className="text-text-primary">Datum morgen</strong>.
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
            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-text-secondary flex-wrap">
              <span className="bg-accent/10 border border-accent/20 rounded-full px-3 py-1 font-medium">
                KW&nbsp;{kw.weekNumber}
              </span>
              <span className="bg-surface border border-border rounded-full px-3 py-1">
                Tag {dayOfYear}/{daysInYear}
              </span>
              <span className="bg-surface border border-border rounded-full px-3 py-1">
                Q{quarterNum}
              </span>
              <span className="bg-surface border border-border rounded-full px-3 py-1">
                MEZ/MESZ
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
                    link: "/schaltjahr",
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
            SECTION 2: DACH – Welches Datum ist heute wirklich?
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Welches Datum ist heute wirklich? (Deutschland, &Ouml;sterreich, Schweiz)
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Wenn du wissen willst,{" "}
              <strong className="text-text-primary">welcher Tag heute wirklich</strong>{" "}
              ist, kannst du dich im DACH-Raum fast immer auf dasselbe Datum verlassen.
              In <strong className="text-text-primary">Deutschland</strong>,{" "}
              <strong className="text-text-primary">&Ouml;sterreich</strong> und der{" "}
              <strong className="text-text-primary">Schweiz</strong> gilt in der Regel
              das gleiche Tagesdatum, weil diese L&auml;nder in{" "}
              <strong className="text-text-primary">CET/CEST</strong> liegen.
              Unterschiede entstehen vor allem, wenn du reist, eine andere Zeitzone
              nutzt oder dich an einem Grenzfall rund um Mitternacht orientierst.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Land</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Datum</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Zeitzone</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { land: "Deutschland (DE)", tz: "CET (UTC+1)" },
                  { land: "\u00d6sterreich (AT)", tz: "CET (UTC+1)" },
                  { land: "Schweiz (CH)", tz: "CET (UTC+1)" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 font-medium text-text-primary">{row.land}</td>
                    <td className="px-5 py-3 text-text-primary">{dateStr}</td>
                    <td className="px-5 py-3 text-text-secondary">{row.tz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 3: Datumsformate
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum heute in verschiedenen Formaten (kurz, ausgeschrieben, ISO&nbsp;8601)
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Wenn du das heutige Datum notieren willst, nutzt du im Deutschen meist
              das Kurzformat{" "}
              <strong className="text-text-primary">TT.MM.JJJJ</strong>. F&uuml;r den{" "}
              {dateStr} lautet es:{" "}
              <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                {dateStr}
              </code>
              . Dieses Format eignet sich f&uuml;r Formulare, Notizen und viele Schreiben.
            </p>
            <p>
              Ausgeschrieben wirkt das Datum offizieller und l&auml;sst sich schneller
              erfassen:{" "}
              <strong className="text-text-primary">{dayName}, {dayOfMonth}. {monthName} {year}</strong>.
              Das passt gut zu Einladungen, Briefen und Dokumenten, in denen der Monat
              sofort ins Auge fallen soll.
            </p>
            <p>
              F&uuml;r IT, Exporte und internationale Kommunikation ist ISO&nbsp;8601
              die sicherste Wahl:{" "}
              <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                {isoDate}
              </code>
              . So bleibt das Datum eindeutig, auch wenn andere L&auml;nder andere
              Reihenfolgen verwenden.
            </p>
          </div>

          {/* Checkliste: Welches Datumsformat? */}
          <div className="bg-surface-secondary border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Checkliste: Welches Datumsformat brauche ich?
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                { context: "Beh\u00f6rde oder Vertrag", format: "TT.MM.JJJJ" },
                { context: "Rechnung oder Angebot", format: "TT.MM.JJJJ (im Flie\u00dftext ggf. ausgeschrieben)" },
                { context: "Einladung oder Briefkopf", format: "Wochentag, Tag. Monat Jahr" },
                { context: "Programmierung/Dateinamen/Export", format: "JJJJ-MM-TT" },
                { context: 'Internationale E-Mail', format: 'ISO 8601 statt TT/MM/JJJJ' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&bull;</span>
                  <span>
                    <strong className="text-text-primary">{item.context}:</strong>{" "}
                    {item.format}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 4: Fortschrittsbalken
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
            SECTION 5: Wochenübersicht
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
            SECTION 6: Gestern & Morgen (enhanced)
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum morgen: Welches Datum ist morgen?
          </h2>

          {/* InfoBox Morgen/Übermorgen */}
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-5">
            <p className="text-sm text-text-primary font-medium">
              Morgen ist der{" "}
              <strong>{formatDateDE(tomorrow)} ({getDayNameDE(tomorrow)})</strong>.
              &Uuml;bermorgen ist der{" "}
              <strong>{formatDateDE(overmorgen)} ({getDayNameDE(overmorgen)})</strong>.
            </p>
          </div>

          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Wenn du nach dem morgigen Datum suchst, z&auml;hlt immer dein aktueller
              Standort. Das angezeigte Ergebnis richtet sich nach deiner{" "}
              <strong className="text-text-primary">Zeitzone</strong> und den
              Datum-/Uhrzeit-Einstellungen deines Ger&auml;ts. Reist du gerade,
              wechselst die Zeitzone oder nutzt ein VPN, kann das morgige Datum
              abweichen &ndash; besonders rund um Mitternacht.
            </p>
            <p>
              Wenn du wissen willst, wie viele Tage zwischen heute und einem Termin
              liegen, nutze den{" "}
              <Link href="/tagerechner" className="text-accent hover:underline">
                Tagerechner
              </Link>
              . So planst du Fristen und Deadlines schnell und ohne Kopfrechnen.
            </p>
          </div>

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
            SECTION 7: Datum und Uhrzeit / Zeitzonen
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum heute und Uhrzeit: Warum Datum und Zeit abweichen k&ouml;nnen
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Wenn du das heutige Datum und die Uhrzeit pr&uuml;fst, kann das Ergebnis
              je nach Standort unterschiedlich ausfallen. Der Hauptgrund sind{" "}
              <strong className="text-text-primary">Zeitzonen</strong>: W&auml;hrend bei
              dir noch Abend ist, hat in anderen L&auml;ndern bereits ein neuer Tag
              begonnen.
            </p>
            <p>
              Ein Sonderfall ist die{" "}
              <strong className="text-text-primary">Internationale Datumsgrenze</strong>{" "}
              im Pazifik. Dort wechselt das Datum je nach Seite der Grenze. Wenn du dich
              fragst, welchen Tag wir haben und wie sp&auml;t es ist, bestimmt immer
              dein aktueller Standort die richtige Antwort.
            </p>
            <p>
              Zus&auml;tzlich kann die{" "}
              <strong className="text-text-primary">Sommerzeit (MEZ/MESZ)</strong> die
              Uhrzeit um eine Stunde verschieben. Das Datum bleibt meist gleich,
              f&auml;llt aber bei Reisen oder bei Umstellungen rund um Mitternacht
              eher auf. Stelle deshalb sicher, dass deine Ger&auml;te automatische
              Uhrzeit und Zeitzone aktiviert haben.
            </p>
          </div>

          {/* InfoBox: Typische Ursachen */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 mb-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Typische Ursachen f&uuml;r falsches Datum
            </h3>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                <span><strong className="text-text-primary">Falsche Zeitzone</strong> ausgew&auml;hlt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                <span><strong className="text-text-primary">Uhrzeit manuell</strong> ge&auml;ndert</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                <span><strong className="text-text-primary">Sommerzeit</strong> nicht korrekt &uuml;bernommen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                <span><strong className="text-text-primary">Reise, VPN oder Standortwechsel</strong> ohne Zeitzonen-Update</span>
              </li>
            </ul>
          </div>

          {/* Automatische Uhrzeit einstellen */}
          <h3 className="text-lg font-semibold mb-3">
            So stellst du automatische Uhrzeit und Zeitzone ein
          </h3>
          <div className="text-text-secondary text-sm leading-relaxed space-y-2 mb-3">
            <p>
              Wenn Datum und Uhrzeit nicht stimmen, aktiviere die Netzwerkzeit:
            </p>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary mb-3">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">&bull;</span>
              <span>
                <strong className="text-text-primary">Android:</strong>{" "}
                Einstellungen &rarr; System/Allgemeine Verwaltung &rarr;
                Datum &amp; Uhrzeit &rarr; &bdquo;Automatisch&ldquo;/&bdquo;Netzwerkzeit&ldquo; aktivieren.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">&bull;</span>
              <span>
                <strong className="text-text-primary">iPhone (iOS):</strong>{" "}
                Einstellungen &rarr; Allgemein &rarr; Datum &amp; Uhrzeit &rarr;
                &bdquo;Automatisch einstellen&ldquo; aktivieren.
              </span>
            </li>
          </ul>
          <p className="text-text-secondary text-xs">
            Men&uuml;namen variieren je Version. Wenn es weiterhin abweicht, starte
            neu und pr&uuml;fe Mobilfunk/WLAN sowie den Flugmodus.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 8: Datum weltweit
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum heute weltweit: aktuelles Datum in wichtigen Zeitzonen
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Das <strong className="text-text-primary">Datum</strong> ist nicht
              &uuml;berall gleich. Grund daf&uuml;r sind die{" "}
              <strong className="text-text-primary">Zeitzonen</strong>. In Berlin ist
              es am sp&auml;ten Abend, in Tokio beginnt oft schon der n&auml;chste
              Tag. Wenn du wissen willst, welcher Tag heute ist, pr&uuml;fe Datum
              und Uhrzeit direkt in der Region, die dich interessiert.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Stadt</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Land</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">UTC-Offset</th>
                </tr>
              </thead>
              <tbody>
                {WORLD_TIMEZONES.map((tz, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 font-medium text-text-primary">{tz.city}</td>
                    <td className="px-5 py-3 text-text-secondary">{tz.country}</td>
                    <td className="px-5 py-3 text-text-secondary font-mono text-xs">{tz.offset}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 9: Monatskalender
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender zum heutigen Datum: {monthName} {year}
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Du willst wissen, <strong className="text-text-primary">welcher Tag ist heute</strong>?
              Mit dem Monatskalender erkennst du das Datum sofort. So ordnest du
              Termine schnell ein &ndash; auch f&uuml;r den{" "}
              <Link href="/kalender-mit-kalenderwochen" className="text-accent hover:underline">
                Kalender mit Kalenderwochen
              </Link>.
            </p>
          </div>

          {/* Dynamic month calendar */}
          <div className="overflow-x-auto rounded-xl border border-border mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
                    <th
                      key={d}
                      className={`px-2 py-3 text-center font-medium ${
                        d === "Sa" || d === "So" ? "text-text-secondary/60" : "text-text-secondary"
                      }`}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calendarWeeks.map((week, wi) => (
                  <tr key={wi} className="border-b border-border last:border-b-0">
                    {week.map((day, di) => {
                      const isToday = day === dayOfMonth;
                      return (
                        <td
                          key={di}
                          className={`px-2 py-2.5 text-center ${
                            day === null
                              ? ""
                              : isToday
                              ? "bg-accent/15 font-bold text-accent"
                              : di >= 5
                              ? "text-text-secondary/60"
                              : "text-text-primary"
                          }`}
                        >
                          {day ?? ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die{" "}
              <strong className="text-text-primary">Kalenderwoche (KW)</strong> zeigt
              dir, die wievielte Woche im Jahr gerade l&auml;uft. Heute ist{" "}
              <Link
                href={`/kw/${kw.weekNumber}-${kw.year}`}
                className="text-accent hover:underline font-semibold"
              >
                KW&nbsp;{kw.weekNumber}
              </Link>
              . Mehr Infos findest du unter{" "}
              <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
                n&auml;chste Feiertage im &Uuml;berblick
              </Link>
              .
            </p>
          </div>

          {/* Feiertage & Gedenktage */}
          <div className="mt-5 bg-surface-secondary border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Ist das heutige Datum ein besonderer Tag?
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Ob das heutige Datum besonders ist, h&auml;ngt davon ab, ob ein{" "}
              <strong className="text-text-primary">Feiertag</strong>,{" "}
              <strong className="text-text-primary">Gedenktag</strong> oder{" "}
              <strong className="text-text-primary">Aktionstag</strong> ansteht. Solche
              Anl&auml;sse haben je nach Land, Bundesland oder Region eine
              unterschiedliche Bedeutung.
            </p>
            <div className="text-xs text-text-secondary space-y-1">
              <p>
                <strong className="text-text-primary">Tipp:</strong> Pr&uuml;fe immer
                dein Bundesland oder deine Region, wenn du unsicher bist. &rarr;{" "}
                <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
                  Feiertage {year} pr&uuml;fen
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 10: Startbildschirm
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum auf den Startbildschirm bringen: Android, iPhone, Windows &amp; Mac
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Wenn du dich fragst, wie du das Datum auf den Startbildschirm bringst,
              hast du drei schnelle Optionen: Du nutzt ein{" "}
              <strong className="text-text-primary">Widget</strong>, aktivierst die
              Anzeige am <strong className="text-text-primary">Sperrbildschirm</strong>{" "}
              oder legst eine{" "}
              <strong className="text-text-primary">Browser-Verkn&uuml;pfung</strong>{" "}
              an. So siehst du Datum und Uhrzeit dauerhaft, ohne jedes Mal eine App
              zu &ouml;ffnen.
            </p>
          </div>

          {/* Checkliste nach Betriebssystem */}
          <div className="space-y-3 mb-5">
            {[
              {
                os: "Android",
                steps: 'Tippe lange auf den Startbildschirm \u2192 Widgets \u2192 Uhr-/Datum-Widget ausw\u00e4hlen \u2192 platzieren. Wenn dir Widgets fehlen, pr\u00fcfe deinen Launcher.',
              },
              {
                os: "iPhone",
                steps: 'Tippe lange auf den Startbildschirm \u2192 \u201e+\u201c \u2192 Widgets \u2192 \u201eKalender\u201c oder \u201eUhr\u201c hinzuf\u00fcgen. F\u00fcr den Sperrbildschirm: Sperrbildschirm anpassen \u2192 Widgets ausw\u00e4hlen.',
              },
              {
                os: "Windows",
                steps: 'Pr\u00fcfe rechts unten in der Taskleiste Datum und Uhrzeit. Wenn sie fehlen: Taskleisten-Einstellungen \u00f6ffnen und die Anzeige aktivieren. Den Kalender \u00f6ffnest du per Klick auf die Uhr.',
              },
              {
                os: "Mac",
                steps: 'Systemeinstellungen \u2192 Kontrollzentrum oder Men\u00fcleiste \u2192 Uhr \u2192 Datum anzeigen und Format festlegen.',
              },
            ].map((item) => (
              <div
                key={item.os}
                className="bg-surface-secondary border border-border rounded-xl p-4"
              >
                <p className="text-sm">
                  <strong className="text-text-primary">{item.os}:</strong>{" "}
                  <span className="text-text-secondary">{item.steps}</span>
                </p>
              </div>
            ))}
          </div>

          <p className="text-text-secondary text-xs mb-5">
            <strong className="text-text-primary">Troubleshooting:</strong>{" "}
            Findest du kein passendes Widget, suche in der Widget-Liste nach
            &bdquo;Uhr&ldquo; oder &bdquo;Kalender&ldquo; und aktualisiere bei
            Bedarf System oder Launcher.
          </p>

          {/* Verknüpfung speichern */}
          <h3 className="text-lg font-semibold mb-3">
            Datum heute als Verkn&uuml;pfung speichern (Browser/Startbildschirm)
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Speichere diese Seite als Verkn&uuml;pfung auf deinem Startbildschirm.
            So &ouml;ffnest du das aktuelle Datum mit nur einem Tap &ndash; praktisch
            f&uuml;r unterwegs oder im Alltag.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Android (Chrome)</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">iPhone (Safari)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Seite \u00f6ffnen", "Seite \u00f6ffnen"],
                  ["Men\u00fc (\u22ee) antippen", "Teilen-Symbol antippen"],
                  ['\u201eZum Startbildschirm hinzuf\u00fcgen\u201c w\u00e4hlen', '\u201eZum Home-Bildschirm\u201c w\u00e4hlen'],
                  ["Hinzuf\u00fcgen best\u00e4tigen", "Hinzuf\u00fcgen best\u00e4tigen"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 text-text-secondary">
                      <span className="text-accent mr-2">&#9744;</span>{row[0]}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">
                      <span className="text-accent mr-2">&#9744;</span>{row[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 11: Excel & Google Sheets
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Datum heute in Excel und Google Sheets berechnen
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3 mb-5">
            <p>
              Wenn du das heutige Datum in Excel berechnen m&ouml;chtest, verwendest du{" "}
              <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                =HEUTE()
              </code>
              . F&uuml;r das aktuelle Datum inklusive Uhrzeit nimmst du{" "}
              <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                =JETZT()
              </code>
              . In Google Sheets hei&szlig;en die Funktionen{" "}
              <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                =TODAY()
              </code>
              {" "}und{" "}
              <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                =NOW()
              </code>
              . Beide Programme aktualisieren das Datum automatisch, sobald sie
              neu berechnen.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Tool</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Formel</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Ergebnis</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Formatierung</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    tool: "Excel",
                    formel: "=HEUTE()",
                    ergebnis: "Heutiges Datum",
                    format: "TT.MM.JJJJ oder JJJJ-MM-TT",
                  },
                  {
                    tool: "Excel",
                    formel: "=JETZT()",
                    ergebnis: "Datum + Uhrzeit",
                    format: "TT.MM.JJJJ hh:mm",
                  },
                  {
                    tool: "Google Sheets",
                    formel: "=TODAY()",
                    ergebnis: "Heutiges Datum",
                    format: 'Format > Zahl > Datum',
                  },
                  {
                    tool: "Google Sheets",
                    formel: "=NOW()",
                    ergebnis: "Datum + Uhrzeit",
                    format: 'Datum und Uhrzeit oder ISO',
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 font-medium text-text-primary">{row.tool}</td>
                    <td className="px-5 py-3">
                      <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                        {row.formel}
                      </code>
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{row.ergebnis}</td>
                    <td className="px-5 py-3 text-text-secondary">{row.format}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Typische Fehler in Excel &amp; Sheets
            </h3>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                <span>
                  Falsche <strong className="text-text-primary">Regionseinstellungen</strong>{" "}
                  k&ouml;nnen Tag und Monat vertauschen.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                <span>
                  Steht ein Datum als Text in der Zelle, lassen sich Werte oft nicht
                  korrekt sortieren. Stelle das Zellformat auf &bdquo;Datum&ldquo; um.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 12: CTA
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Datum heute immer schnell finden
            </h2>
            <div className="text-text-secondary text-sm leading-relaxed space-y-3">
              <p>
                Speichere diese Seite als Lesezeichen oder f&uuml;ge sie direkt
                zum Startbildschirm hinzu. So &ouml;ffnest du das heutige Datum
                jederzeit mit einem Tipp.
              </p>
              <p>
                Wirkt das heutige Datum falsch? Dann pr&uuml;fe kurz Standort und
                Zeitzone &ndash; besonders nach Reisen oder bei VPN-Nutzung.
              </p>
              <p>
                F&uuml;r Reiseplanung und Remote-Arbeit nutze die Weltzeit-Tabelle.
                Damit vergleichst du Datum und Uhrzeit in anderen L&auml;ndern auf
                einen Blick und vermeidest Missverst&auml;ndnisse bei Terminen.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link
                href="/faq"
                className="bg-accent text-white rounded-lg px-4 py-2 font-medium hover:bg-accent/90 transition-colors"
              >
                H&auml;ufige Fragen &rarr;
              </Link>
              <Link
                href="/tagerechner"
                className="bg-surface border border-border rounded-lg px-4 py-2 font-medium text-text-primary hover:bg-surface-secondary transition-colors"
              >
                Tagerechner &ouml;ffnen &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            Fazit-Box
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-10 bg-surface-secondary border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            Fazit
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Mit dem heutigen Datum hast du alles auf einen Blick: Datum,
            Wochentag, Kalenderwoche und Uhrzeit &ndash; plus praktische Formate
            (kurz, ausgeschrieben, ISO&nbsp;8601) und eine schnelle Orientierung
            f&uuml;r wichtige Zeitzonen. Wenn dir Uhrzeit oder Datum abweichen,
            pr&uuml;fe als Erstes Zeitzone, automatische Uhrzeit und ggf.
            Sommerzeit. Richte dir jetzt eine Startbildschirm-Verkn&uuml;pfung
            oder ein Widget ein &ndash; so siehst du das Datum jederzeit ohne
            Umwege.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 13: FAQ
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
          <Link href="/tagerechner" className="text-accent hover:underline">
            Tagerechner &rarr;
          </Link>
          <Link href="/schaltjahr" className="text-accent hover:underline">
            Schaltjahr &rarr;
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
 * SEO Audit Checklist – app/datum-heute/page.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Datum heute ▷ Heutiges Datum & Wochentag"
 * [x] Meta Description: dynamisch mit Datum, Wochentag, KW
 * [x] Canonical URL: https://aktuellekw.de/datum-heute
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Datum heute: heutiges Datum, Wochentag, Kalenderwoche & Uhrzeit"
 * [x] Schema.org: BreadcrumbList (2 Ebenen)
 * [x] Schema.org: FAQPage (10 Fragen)
 * [x] DACH-Tabelle (DE/AT/CH Datum + Zeitzone)
 * [x] Datumsformate (TT.MM.JJJJ, ausgeschrieben, ISO 8601) + Checkliste
 * [x] Dynamischer Monatskalender mit Heute-Highlight
 * [x] Datum und Uhrzeit / Zeitzonen-Erkl\u00e4rung + InfoBox
 * [x] Automatische Uhrzeit einstellen (Android/iPhone)
 * [x] Datum weltweit: 6-Zeitzonen-Tabelle
 * [x] Datum morgen + Gestern/Morgen Cards
 * [x] Feiertage & Gedenktage Hinweis-Box
 * [x] Startbildschirm-Checkliste (Android/iPhone/Windows/Mac)
 * [x] Browser-Verkn\u00fcpfung speichern (Schritt-Tabelle)
 * [x] Excel/Google Sheets: HEUTE()/JETZT() Tabelle + Fehler-Box
 * [x] CTA-Section + Fazit-Box
 * [x] Cross-Links: Startseite, KW, Tagerechner, Schaltjahr, Feiertage, FAQ
 * [x] revalidate = 3600 (st\u00fcndliche ISR)
 */
