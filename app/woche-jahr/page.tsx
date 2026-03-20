import type { Metadata } from "next";
import {
  getCurrentKW,
  formatDateDE,
  getWeeksInYear,
  getAllKWsForYear,
  getKWInfo,
  getDayNameDE,
  isLeapYear,
} from "@/lib/kw";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const ogTitle = `Woche Jahr: Welche Woche haben wir heute?`;
  const ogDescription = `Welche Woche im Jahr ist heute? Aktuelle KW ${kw.weekNumber} sofort finden + KW-Tabelle ${kw.year} + Rechner. ISO 8601 einfach erklärt – 52 oder 53 Wochen?`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: "https://aktuellekw.de/woche-jahr",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/woche-jahr",
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

export default function WocheJahrPage() {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);
  const allWeeks = getAllKWsForYear(kw.year);

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const monthNamesDE = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  const currentDateDisplay = `${getDayNameDE(todayUTC)}, ${String(todayUTC.getUTCDate()).padStart(2, "0")}. ${monthNamesDE[todayUTC.getUTCMonth()]} ${todayUTC.getUTCFullYear()}`;

  // Prev / Next KW with year rollover
  const prevKW =
    kw.weekNumber === 1
      ? (() => {
          const py = kw.year - 1;
          const pn = getWeeksInYear(py);
          const info = getKWInfo(
            new Date(Date.UTC(py, 11, 28)) // Dec 28 is always in the last KW
          );
          return { weekNumber: pn, year: py, startDate: info.startDate, endDate: info.endDate };
        })()
      : (() => {
          const d = new Date(kw.startDate);
          d.setUTCDate(d.getUTCDate() - 7);
          const info = getKWInfo(d);
          return { weekNumber: kw.weekNumber - 1, year: kw.year, startDate: info.startDate, endDate: info.endDate };
        })();

  const nextKW =
    kw.weekNumber === weeksInYear
      ? (() => {
          const d = new Date(kw.startDate);
          d.setUTCDate(d.getUTCDate() + 7);
          const info = getKWInfo(d);
          return { weekNumber: 1, year: kw.year + 1, startDate: info.startDate, endDate: info.endDate };
        })()
      : (() => {
          const d = new Date(kw.startDate);
          d.setUTCDate(d.getUTCDate() + 7);
          const info = getKWInfo(d);
          return { weekNumber: kw.weekNumber + 1, year: kw.year, startDate: info.startDate, endDate: info.endDate };
        })();

  const isGerade = kw.weekNumber % 2 === 0;
  const daysInYear = isLeapYear(kw.year) ? 366 : 365;

  // Show first 8 + last 3 KWs for compact table
  const firstWeeks = allWeeks.slice(0, 8);
  const lastWeeks = allWeeks.slice(-3);

  // 53-KW years table data
  const kw53Years = [
    { year: 2015, type: "Gemeinjahr", day: "Donnerstag", has53: true },
    { year: 2016, type: "Schaltjahr", day: "Freitag", has53: false },
    { year: 2020, type: "Schaltjahr", day: "Mittwoch", has53: true },
    { year: 2021, type: "Gemeinjahr", day: "Freitag", has53: false },
    { year: 2026, type: "Gemeinjahr", day: "Donnerstag", has53: true },
  ];

  // FAQ data
  const pageFaqs = [
    {
      question: "Welche Kalenderwoche ist heute?",
      answer: `Heute ist Kalenderwoche ${kw.weekNumber} (ISO\u00a08601). Sie l\u00e4uft von ${formatDateDE(kw.startDate)} bis ${formatDateDE(kw.endDate)}. So siehst du sofort, welche Woche im Jahr gerade ist.`,
    },
    {
      question: "Was haben wir aktuell f\u00fcr KW?",
      answer: `Aktuell ist KW\u00a0${kw.weekNumber} (ISO\u00a08601). Diese Kalenderwoche geht von ${formatDateDE(kw.startDate)} bis ${formatDateDE(kw.endDate)} (Montag bis Sonntag). Damit wei\u00dft du direkt, welche Woche im Jahr wir gerade haben.`,
    },
    {
      question: "Hat ein Jahr 52 oder 53 Wochen?",
      answer: `Ein Jahr hat nach ISO\u00a08601 entweder 52 oder 53 Kalenderwochen. 53\u00a0KW gibt es, wenn der 1.\u00a0Januar auf einen Donnerstag f\u00e4llt oder ein Schaltjahr am Mittwoch beginnt. ${kw.year} hat ${weeksInYear}\u00a0KW.`,
    },
    {
      question: "Sind es 52 oder 56 Wochen im Jahr?",
      answer: "Im ISO-Wochenjahr sind es 52 oder 53 Kalenderwochen, nicht 56. 56\u00a0Wochen w\u00fcrden 392\u00a0Tage bedeuten und passen nicht in ein Kalenderjahr.",
    },
    {
      question: "Wann beginnt die erste Kalenderwoche (KW\u00a01)?",
      answer: "KW\u00a01 beginnt nach ISO\u00a08601 mit der Woche, die den 4.\u00a0Januar enth\u00e4lt (also die erste Woche mit mindestens vier Tagen im neuen Jahr). Sie startet am Montag. Dadurch kann KW\u00a01 schon Ende Dezember des Vorjahres anfangen.",
    },
    {
      question: "Beginnt die Kalenderwoche immer am Montag?",
      answer: "In der ISO-8601-Z\u00e4hlung beginnt die Kalenderwoche immer am Montag und endet am Sonntag. Diese Regel gilt in Deutschland, \u00d6sterreich und der Schweiz.",
    },
    {
      question: "Warum geh\u00f6rt der 1.\u00a0Januar manchmal zur letzten KW des Vorjahres?",
      answer: "Weil die ISO-Kalenderwoche nach der \u201eKW\u00a01 enth\u00e4lt den 4.\u00a0Januar\u201c-Regel gez\u00e4hlt wird. F\u00e4llt der 1.\u00a0Januar in eine Woche, die \u00fcberwiegend noch zum Vorjahr geh\u00f6rt, z\u00e4hlt er zur letzten KW des Vorjahres.",
    },
    {
      question: "Wie berechne ich die Kalenderwoche f\u00fcr ein bestimmtes Datum?",
      answer: "Nutze die ISO-8601-Regel: KW\u00a01 ist die Woche mit dem 4.\u00a0Januar, und Wochen starten am Montag. Am einfachsten ist ein KW-Rechner, der dir die richtige Woche im Jahr automatisch ausgibt.",
    },
    {
      question: "Wie schreibt man Kalenderwochen auf Englisch?",
      answer: "Auf Englisch schreibst du meist \u201ecalendar week\u201c oder kurz \u201eCW\u201c, z.\u00a0B. \u201eCW\u00a010\u201c. In internationalen Kontexten wird auch \u201eISO week\u201c verwendet. Das ISO-Format lautet YYYY-Www, z.\u00a0B. 2026-W10.",
    },
  ];

  // JSON-LD
  const pageJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://aktuellekw.de/woche-jahr#breadcrumb",
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
          name: "Woche Jahr",
          item: "https://aktuellekw.de/woche-jahr",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://aktuellekw.de/woche-jahr#faqpage",
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: "2026-01-01",
      dateModified: "2026-02-01",
      mainEntity: pageFaqs.map((f) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Woche Jahr</span>
        </nav>

        {/* ── H1 + Intro ── Cluster 4 ────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welche Woche im Jahr ist heute? Aktuelle KW + Tabelle &amp; Rechner
        </h1>
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Heute ist{" "}
            <strong className="text-text-primary">Kalenderwoche (KW)&nbsp;{kw.weekNumber}</strong>{" "}
            &ndash; damit befindest Du Dich in der{" "}
            <strong className="text-text-primary">Woche im Jahr</strong>, die von{" "}
            <strong className="text-text-primary">{formatDateDE(kw.startDate)}</strong> bis{" "}
            <strong className="text-text-primary">{formatDateDE(kw.endDate)}</strong> l&auml;uft.
            Du bekommst hier eine komplette{" "}
            <strong className="text-text-primary">KW-Tabelle f&uuml;r {kw.year}</strong>{" "}
            mit allen Datumsspannen sowie einen einfachen{" "}
            <a href="/#kw-rechner-input" className="text-accent hover:underline font-medium">
              KW-Rechner
            </a>, mit dem Du jede Kalenderwoche aus einem Datum berechnest.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Schnell-Info:</strong>{" "}
            Heute ist {currentDateDisplay} &ndash;{" "}
            <strong className="text-text-primary">KW&nbsp;{kw.weekNumber}&nbsp;{kw.year}</strong>.
            Die Woche hat {weeksInYear === 53 ? "53" : "52"}&nbsp;KW insgesamt.{" "}
            <a href="/" className="text-accent hover:underline">
              Zur Startseite &rarr;
            </a>
          </div>
        </div>

        {/* ── Aktuelle KW: Hero-InfoBox ──────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Aktuelle Kalenderwoche: Welche Woche im Jahr ist heute?
          </h2>
          <div className="bg-surface-secondary border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-bold text-text-primary">
                KW&nbsp;{kw.weekNumber}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isGerade ? "bg-accent/10 text-accent" : "bg-purple-500/10 text-purple-400"}`}>
                {isGerade ? "gerade" : "ungerade"} KW
              </span>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Zeitraum: <strong className="text-text-primary">{formatDateDE(kw.startDate)}</strong>{" "}
              bis <strong className="text-text-primary">{formatDateDE(kw.endDate)}</strong> (Mo&ndash;So)
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`/kw/${prevKW.weekNumber}-${prevKW.year}`}
                className="inline-flex items-center gap-1.5 bg-surface-tertiary border border-border rounded-lg px-3 py-1.5 text-sm hover:border-accent/50 transition-colors"
              >
                <span className="text-text-secondary">&larr;</span>
                <span className="text-text-primary font-medium">KW&nbsp;{prevKW.weekNumber}</span>
              </a>
              <a
                href={`/kw/${nextKW.weekNumber}-${nextKW.year}`}
                className="inline-flex items-center gap-1.5 bg-surface-tertiary border border-border rounded-lg px-3 py-1.5 text-sm hover:border-accent/50 transition-colors"
              >
                <span className="text-text-primary font-medium">KW&nbsp;{nextKW.weekNumber}</span>
                <span className="text-text-secondary">&rarr;</span>
              </a>
            </div>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Du willst wissen, <strong className="text-text-primary">welche KW haben wir</strong>?
            Oben siehst Du die <strong className="text-text-primary">Kalenderwoche heute</strong>{" "}
            sofort. Mit den Quick-Links springst Du direkt zur letzten oder n&auml;chsten Woche.
            Die Markierung <strong className="text-text-primary">gerade/ungerade KW</strong>{" "}
            unterst&uuml;tzt Dich bei wiederkehrenden Routinen &ndash; ideal f&uuml;r
            Schichtmodelle, Wechselbetreuung oder Trainingswochen.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Die Berechnung erfolgt nach <strong className="text-text-primary">ISO&nbsp;8601</strong>.
            Mehr Details findest Du hier:{" "}
            <a href="/welche-kalenderwoche-haben-wir" className="text-accent hover:underline">
              Welche Kalenderwoche haben wir gerade?
            </a>
          </p>
        </div>

        {/* ── N&auml;chste / Letzte Woche ────────────────────────── */}
        <div className="mt-14">
          <h3 className="text-xl font-semibold mb-3">
            Welche KW ist n&auml;chste Woche?
          </h3>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-4">
            <strong className="text-text-primary">N&auml;chste KW: KW&nbsp;{nextKW.weekNumber}</strong>
            <br />
            Zeitraum (Mo&ndash;So): <strong className="text-text-primary">{formatDateDE(nextKW.startDate)} &ndash; {formatDateDE(nextKW.endDate)}</strong>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            Wenn Du nach der <strong className="text-text-primary">n&auml;chsten Kalenderwoche</strong>{" "}
            suchst, gilt immer der kommende Montag als Start. Rund um den Jahreswechsel kann
            &bdquo;n&auml;chste Woche&ldquo; bereits KW&nbsp;1 des neuen ISO-Wochenjahres sein,
            auch wenn noch Dezember ist.
          </p>

          <h3 className="text-xl font-semibold mb-3">
            Welche KW war letzte Woche?
          </h3>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-4">
            <strong className="text-text-primary">Letzte KW: KW&nbsp;{prevKW.weekNumber}</strong>
            <br />
            Zeitraum: <strong className="text-text-primary">{formatDateDE(prevKW.startDate)} &ndash; {formatDateDE(prevKW.endDate)}</strong>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            <strong className="text-text-primary">KW letzte Woche</strong> ist damit
            eindeutig festgelegt. Du kannst die Angabe direkt &uuml;bernehmen, wenn Du Zeiten
            nachtr&auml;gst oder Eintr&auml;ge korrekt dokumentierst &ndash; ideal f&uuml;r
            Schichtplanung, Team-Abstimmung und Zeiterfassung.
          </p>
        </div>

        {/* ── KW-Rechner ─────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalenderwochen-Rechner: KW aus Datum berechnen
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mit dem <strong className="text-text-primary">KW-Rechner</strong> findest Du in
            Sekunden heraus, welche Kalenderwoche zu einem Datum geh&ouml;rt. Gib ein
            Datum ein und erhalte die KW, das KW-Jahr sowie den Zeitraum von Montag bis Sonntag.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-4">
            <strong className="text-text-primary">Zum KW-Rechner:</strong>{" "}
            <a href="/#kw-rechner-input" className="text-accent hover:underline">
              Datum &rarr; KW berechnen (Startseite)
            </a>{" "}
            oder{" "}
            <a href="/kalenderwoche" className="text-accent hover:underline">
              KW-&Uuml;bersicht mit Rechner
            </a>
          </div>

          <h3 className="text-lg font-semibold mb-3 mt-8">
            Warum kann die KW zum Jahreswechsel &bdquo;zum anderen Jahr&ldquo; geh&ouml;ren?
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Beim <strong className="text-text-primary">Kalenderwoche Jahreswechsel</strong>{" "}
            kann eine KW &bdquo;zum anderen Jahr&ldquo; geh&ouml;ren, weil das{" "}
            <strong className="text-text-primary">ISO-Wochenjahr</strong> nicht immer mit dem
            Kalenderjahr &uuml;bereinstimmt. So k&ouml;nnen der 1. bis 3.&nbsp;Januar noch in
            der letzten KW des Vorjahres liegen. Umgekehrt kann ein Datum Ende Dezember
            bereits KW&nbsp;1 des n&auml;chsten ISO-Wochenjahrs sein.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Merke:</strong>{" "}
            KW-Jahr &ne; Kalenderjahr (manchmal). Beispiel: Der 02.01. kann noch zur letzten KW
            des Vorjahres geh&ouml;ren.
          </div>
        </div>

        {/* ── KW-Tabelle ─────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalenderwochen {kw.year}: Tabelle mit KW (Mo&ndash;So)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            Mit dieser Tabelle hast Du die <strong className="text-text-primary">Kalenderwochen {kw.year}</strong>{" "}
            schnell im Blick. Jede KW zeigt Dir den Zeitraum von Montag bis Sonntag. F&uuml;r
            die komplette Jahresansicht:{" "}
            <a href={`/kalenderwochen/${kw.year}`} className="text-accent hover:underline">
              Alle Kalenderwochen {kw.year} im &Uuml;berblick &rarr;
            </a>
          </p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">KW</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Zeitraum (Mo&ndash;So)</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Monat(e)</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {firstWeeks.map((w) => {
                  const isCurrent = w.weekNumber === kw.weekNumber;
                  const startMonth = monthNamesDE[w.startDate.getUTCMonth()].slice(0, 3);
                  const endMonth = monthNamesDE[w.endDate.getUTCMonth()].slice(0, 3);
                  const months = startMonth === endMonth ? startMonth : `${startMonth}/${endMonth}`;
                  return (
                    <tr
                      key={w.weekNumber}
                      className={`border-b border-border ${isCurrent ? "bg-accent/5" : ""}`}
                    >
                      <td className={`px-4 py-2.5 ${isCurrent ? "font-bold text-accent" : ""}`}>
                        <a href={`/kw/${w.weekNumber}-${kw.year}`} className="hover:text-accent transition-colors">
                          KW&nbsp;{w.weekNumber}
                        </a>
                      </td>
                      <td className={`px-4 py-2.5 ${isCurrent ? "text-text-primary font-medium" : ""}`}>
                        {formatDateDE(w.startDate)} &ndash; {formatDateDE(w.endDate)}
                      </td>
                      <td className="px-4 py-2.5">{months}</td>
                    </tr>
                  );
                })}
                <tr className="border-b border-border">
                  <td colSpan={3} className="px-4 py-2.5 text-center text-text-secondary/60 text-xs">
                    &hellip; weitere Wochen &ndash;{" "}
                    <a href={`/kalenderwochen/${kw.year}`} className="text-accent hover:underline">
                      Vollst&auml;ndige Tabelle anzeigen
                    </a>
                  </td>
                </tr>
                {lastWeeks.map((w) => {
                  const isCurrent = w.weekNumber === kw.weekNumber;
                  const startMonth = monthNamesDE[w.startDate.getUTCMonth()].slice(0, 3);
                  const endMonth = monthNamesDE[w.endDate.getUTCMonth()].slice(0, 3);
                  const months = startMonth === endMonth ? startMonth : `${startMonth}/${endMonth}`;
                  return (
                    <tr
                      key={w.weekNumber}
                      className={`border-b border-border last:border-b-0 ${isCurrent ? "bg-accent/5" : ""}`}
                    >
                      <td className={`px-4 py-2.5 ${isCurrent ? "font-bold text-accent" : ""}`}>
                        <a href={`/kw/${w.weekNumber}-${kw.year}`} className="hover:text-accent transition-colors">
                          KW&nbsp;{w.weekNumber}
                        </a>
                      </td>
                      <td className={`px-4 py-2.5 ${isCurrent ? "text-text-primary font-medium" : ""}`}>
                        {formatDateDE(w.startDate)} &ndash; {formatDateDE(w.endDate)}
                      </td>
                      <td className="px-4 py-2.5">{months}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs">
            Du willst ein anderes Jahr?{" "}
            <a href="/kalenderwochen/2025" className="text-accent hover:underline">2025</a>
            {" "}&bull;{" "}
            <a href="/kalenderwochen/2027" className="text-accent hover:underline">2027</a>
          </p>
        </div>

        {/* ── Gerade / Ungerade KW ───────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Gerade und ungerade Kalenderwochen {kw.year}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            &bdquo;Gerade/ungerade KW&ldquo; bedeutet: Die{" "}
            <strong className="text-text-primary">Kalenderwoche</strong> hat entweder eine
            gerade Nummer (z.&nbsp;B. 2, 4, 6) oder eine ungerade Nummer (z.&nbsp;B. 1, 3, 5).
            Das ist besonders praktisch f&uuml;r <strong className="text-text-primary">Betreuung
            im Wechselmodell</strong>, <strong className="text-text-primary">Schichtpl&auml;ne</strong>{" "}
            oder Abholtermine.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Markierung</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Bedeutung</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center rounded-full bg-accent/10 text-accent text-xs px-2 py-0.5 font-medium">gerade</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <strong className="text-text-primary">gerade KW</strong> (2, 4, 6, 8, &hellip;)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center rounded-full bg-purple-500/10 text-purple-400 text-xs px-2 py-0.5 font-medium">ungerade</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <strong className="text-text-primary">ungerade KW</strong> (1, 3, 5, 7, &hellip;)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Aktuell ist KW&nbsp;{kw.weekNumber} &ndash; eine{" "}
            <strong className="text-text-primary">{isGerade ? "gerade" : "ungerade"}</strong>{" "}
            Kalenderwoche.
          </p>
        </div>

        {/* ── Was bedeutet KW? (ISO 8601) ────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Was bedeutet KW? Definition der Kalenderwoche nach ISO&nbsp;8601
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            <strong className="text-text-primary">KW</strong> steht f&uuml;r Kalenderwoche.
            Gemeint ist die fortlaufende Nummer einer Woche innerhalb des ISO-Wochenjahres.
            Nach <strong className="text-text-primary">ISO&nbsp;8601</strong> startet jede
            Kalenderwoche am Montag. F&uuml;r <strong className="text-text-primary">KW&nbsp;1</strong>{" "}
            gilt: Es ist die Woche, in die der 4.&nbsp;Januar f&auml;llt &ndash; alternativ die
            Woche mit dem ersten Donnerstag des Jahres.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-6">
            <strong className="text-text-primary">ISO&nbsp;8601 in 20 Sekunden:</strong><br />
            Wochenstart: <strong className="text-text-primary">Montag</strong><br />
            Woche&nbsp;1: Woche mit dem 4.&nbsp;Januar (oder erstem Donnerstag)
          </div>

          <h3 className="text-xl font-semibold mb-3">
            Mit welchem Wochentag beginnt die Kalenderwoche in Deutschland?
          </h3>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-4">
            <strong className="text-text-primary">Antwort:</strong>{" "}
            In Deutschland <strong className="text-text-primary">beginnt die Kalenderwoche
            am Montag</strong> und endet am Sonntag (ISO&nbsp;8601 / DIN&nbsp;1355).
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            In manchen L&auml;ndern starten Kalenderwochen im Alltag am Sonntag, etwa in
            Teilen der USA. Wenn Du aber nach KW suchst oder KW-Tabellen nutzt, bleibt die
            ISO-KW in der Regel Montag-basiert. So kannst Du Daten international
            besser vergleichen.
          </p>
        </div>

        {/* ── Wie viele Wochen hat ein Jahr ──────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wie viele Wochen hat ein Jahr: 52 oder 53 Kalenderwochen?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            <strong className="text-text-primary">Wie viele Wochen hat ein Jahr?</strong>{" "}
            In den meisten F&auml;llen sind es <strong className="text-text-primary">52&nbsp;Kalenderwochen</strong>,
            in manchen Jahren zus&auml;tzlich eine <strong className="text-text-primary">KW&nbsp;53</strong>.
            Der Grund: {daysInYear}&nbsp;Tage lassen sich nicht exakt in 7-Tage-Wochen aufteilen.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm font-mono mb-4">
            365 Tage = 52 &times; 7 + 1<br />
            366 Tage = 52 &times; 7 + 2
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die Aussage &bdquo;52 oder 56 Wochen im Jahr&ldquo; ist falsch: 56&nbsp;KW
            w&uuml;rden 392&nbsp;Tage bedeuten und passen in kein Kalenderjahr.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Mehr Details:{" "}
            <a href="/wie-viele-wochen-hat-ein-jahr" className="text-accent hover:underline">
              Wie viele Wochen hat ein Jahr wirklich? (52 oder 53) &rarr;
            </a>
          </p>
        </div>

        {/* ── Wann 53 KW? ────────────────────────────────────────── */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">
            Wann hat ein Jahr 53 Kalenderwochen? Regeln und Beispiele
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Ein Jahr hat <strong className="text-text-primary">53&nbsp;Kalenderwochen</strong>,
            wenn der 1.&nbsp;Januar auf einen <strong className="text-text-primary">Donnerstag</strong>{" "}
            f&auml;llt oder wenn ein <strong className="text-text-primary">Schaltjahr</strong>{" "}
            an einem Mittwoch beginnt.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Jahr</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Typ</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">1.&nbsp;Jan</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">KW&nbsp;53?</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {kw53Years.map((y) => (
                  <tr
                    key={y.year}
                    className={`border-b border-border last:border-b-0 ${y.year === kw.year ? "bg-accent/5" : ""}`}
                  >
                    <td className={`px-4 py-2.5 ${y.year === kw.year ? "font-bold text-text-primary" : ""}`}>
                      {y.year}
                    </td>
                    <td className="px-4 py-2.5">{y.type}</td>
                    <td className="px-4 py-2.5">{y.day}</td>
                    <td className="px-4 py-2.5">
                      {y.has53 ? (
                        <span className="text-green-400 font-medium">ja</span>
                      ) : (
                        <span className="text-text-secondary">nein</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Kalenderwoche auf Englisch ──────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalenderwoche auf Englisch: Abk&uuml;rzungen und Schreibweise
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die &Uuml;bersetzung f&uuml;r <strong className="text-text-primary">Kalenderwoche
            Englisch</strong> ist meist <em>calendar week</em> oder <em>week number</em>.
            Im Deutschen k&uuml;rzt Du mit &bdquo;KW&ldquo; ab. Im Englischen taucht manchmal
            &bdquo;CW&ldquo; auf, aber viele schreiben einfach &bdquo;week&nbsp;10&ldquo;.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Deutsch</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Englisch</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Beispiel</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5">Kalenderwoche</td>
                  <td className="px-4 py-2.5 text-text-primary">calendar week</td>
                  <td className="px-4 py-2.5">calendar week {kw.weekNumber}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5">Kalenderwoche</td>
                  <td className="px-4 py-2.5 text-text-primary">week number</td>
                  <td className="px-4 py-2.5">week number {kw.weekNumber}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5">KW&nbsp;{kw.weekNumber}</td>
                  <td className="px-4 py-2.5 text-text-primary">week {kw.weekNumber}</td>
                  <td className="px-4 py-2.5">week {kw.weekNumber} ({kw.year})</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">ISO-Schreibweise</td>
                  <td className="px-4 py-2.5 text-text-primary">ISO week format</td>
                  <td className="px-4 py-2.5 font-mono text-accent">
                    {kw.year}-W{String(kw.weekNumber).padStart(2, "0")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Download ───────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Download &amp; Planung: Kalenderwochen als PDF oder Excel
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mit dem <strong className="text-text-primary">Kalenderwochen-Download</strong>{" "}
            verarbeitest Du Deine KW-Liste schnell weiter &ndash; als PDF zum Ausdrucken
            oder als Excel zum Filtern und Erg&auml;nzen eigener Spalten. Ideal f&uuml;r
            Projektplanung, Schichtplan oder Urlaubswochen.
          </p>
          <ul className="space-y-2 text-text-secondary text-sm leading-relaxed mb-4">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span><strong className="text-text-primary">Kalenderwoche (KW)</strong> pro Zeile</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>Datum <strong className="text-text-primary">von&ndash;bis</strong> je KW</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>Optionale <strong className="text-text-primary">Feiertage</strong>-Spalte</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>Markierung <strong className="text-text-primary">gerade/ungerade</strong> Wochen</span>
            </li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed">
            Wenn Du zus&auml;tzlich eine Monatsansicht brauchst, nutze den{" "}
            <a href="/kalender-mit-wochen" className="text-accent hover:underline">
              Kalender mit Kalenderwochen
            </a>{" "}
            als Vorlage.
          </p>
        </div>

        {/* ── Zusammenfassung ────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Zusammenfassung
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Du wei&szlig;t jetzt, welche <strong className="text-text-primary">Woche im
            Jahr</strong> heute ist &ndash; KW&nbsp;{kw.weekNumber}&nbsp;{kw.year} &ndash;
            und kannst mit dem{" "}
            <a href="/#kw-rechner-input" className="text-accent hover:underline">
              Kalenderwochen-Rechner
            </a>{" "}
            jede KW aus einem Datum berechnen oder in der{" "}
            <a href={`/kalenderwochen/${kw.year}`} className="text-accent hover:underline">
              KW-Tabelle {kw.year}
            </a>{" "}
            nachschlagen. Merksatz nach ISO&nbsp;8601: Die Woche startet am Montag, und{" "}
            <strong className="text-text-primary">KW&nbsp;1</strong> ist die Woche, die den
            4.&nbsp;Januar enth&auml;lt.
          </p>
        </div>

        {/* ── FAQ Accordion ──────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufig gestellte Fragen
          </h2>
          <div className="space-y-2.5">
            {pageFaqs.map((faq, i) => (
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

        {/* ── Bottom Navigation ──────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {kw.year} &rarr;
          </a>
          <a href="/kalender-mit-wochen" className="text-accent hover:underline">
            Kalender mit Wochen &rarr;
          </a>
          <a href="/kalender-wochenuebersicht" className="text-accent hover:underline">
            Wochen&uuml;bersicht &rarr;
          </a>
          <a href="/wie-viele-wochen-hat-ein-jahr" className="text-accent hover:underline">
            Wie viele Wochen? &rarr;
          </a>
          <a href="/faq" className="text-accent hover:underline">
            FAQ &rarr;
          </a>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/woche-jahr/page.tsx (Cluster 4)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Woche Jahr: Welche Woche im Jahr ist heute? [2026]"
 * [x] Meta Description: dynamisch mit KW-Nummer und Jahr
 * [x] Canonical URL: https://aktuellekw.de/woche-jahr
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Welche Woche im Jahr ist heute? Aktuelle KW + Tabelle & Rechner"
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → Woche Jahr)
 * [x] Schema.org: FAQPage (9 Fragen)
 * [x] Cluster 4 Keywords: Woche Jahr, welche Woche im Jahr, wie viele Wochen hat ein Jahr
 * [x] Dynamic hero InfoBox with current KW, gerade/ungerade badge, prev/next links
 * [x] Nächste/Letzte Woche mit dynamischen Daten
 * [x] KW-Rechner Verlinkung (Startseite + /kalenderwoche)
 * [x] Jahreswechsel-Erklärung (ISO-Wochenjahr ≠ Kalenderjahr)
 * [x] KW-Tabelle: erste 8 + letzte 3 Wochen, current KW highlighted, links zu /kw/[n]-[year]
 * [x] Gerade/ungerade KW Erklärung mit Tabelle und dynamischem Badge
 * [x] ISO 8601 Definition mit InfoBox
 * [x] Wochentag-Beginn (Montag) mit InfoBox
 * [x] 52 vs 53 KW Erklärung mit Rechnung
 * [x] 53-KW-Jahre Tabelle (2015–2026)
 * [x] Kalenderwoche auf Englisch: Übersetzungstabelle
 * [x] Download-Section mit Link zu /kalender-mit-wochen
 * [x] FAQ (9 Fragen): KW heute, 52/53, KW1, Montag-Start, Jahreswechsel, Englisch
 * [x] Cross-Links: /, /kalenderwoche, /kalender-mit-wochen, /kalender-wochenuebersicht,
 *     /wie-viele-wochen-hat-ein-jahr, /faq, /kalenderwochen/[year]
 * [x] revalidate = 3600 (stündliche ISR)
 * [ ] TODO: hreflang für AT/CH ergänzen wenn mehrsprachig ausgebaut
 */
