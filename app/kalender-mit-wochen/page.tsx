import type { Metadata } from "next";
import {
  getCurrentKW,
  formatDateDE,
  getWeeksInYear,
  getAllKWsForYear,
  getWeekStart,
  getWeekEnd,
  getDayNameDE,
} from "@/lib/kw";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const ogTitle =
    "Kalender mit Wochen: aktuelle KW + Tabellen (ISO 8601)";
  const ogDescription = `Kalender mit Wochen: aktuelle Kalenderwoche sofort sehen + KW-Tabellen (z.\u00a0B. KW\u00a03/25/26). Auswahlhilfe Print/PDF/Excel/App & Anleitungen iOS/Android/Outlook.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: "https://aktuellekw.de/kalender-mit-wochen",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/kalender-mit-wochen",
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

/* ── helper: short date "DD.MM." ──────────────────────── */
function shortDate(d: Date): string {
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(
    d.getUTCMonth() + 1
  ).padStart(2, "0")}.`;
}

export default function KalenderMitWochenPage() {
  const kw = getCurrentKW();
  const year = kw.year;
  const nextYear = year + 1;
  const weeksInYear = getWeeksInYear(year);
  const weeksInNextYear = getWeeksInYear(nextYear);
  const allWeeks2026 = getAllKWsForYear(year);
  const allWeeks2027 = getAllKWsForYear(nextYear);

  /* Dynamic date display: "Montag, 02. März 2026" */
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const monthNamesDE = [
    "Januar",
    "Februar",
    "März",
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
  const currentDateDisplay = `${getDayNameDE(todayUTC)}, ${String(
    todayUTC.getUTCDate()
  ).padStart(2, "0")}. ${monthNamesDE[todayUTC.getUTCMonth()]} ${todayUTC.getUTCFullYear()}`;

  /* Sliced KW tables: first 8 + last 3 */
  const firstSlice2026 = allWeeks2026.slice(0, 8);
  const lastSlice2026 = allWeeks2026.slice(-3);
  const firstSlice2027 = allWeeks2027.slice(0, 8);
  const lastSlice2027 = allWeeks2027.slice(-3);

  /* Frequently searched KWs */
  const frequentKWs = [3, 25, 26];
  const freqRows = frequentKWs.map((n) => {
    const w2026 = allWeeks2026.find((w) => w.weekNumber === n);
    const w2027 = allWeeks2027.find((w) => w.weekNumber === n);
    return {
      kw: n,
      range2026: w2026
        ? `${shortDate(w2026.startDate)}\u2013${shortDate(w2026.endDate)}`
        : "\u2013",
      range2027: w2027
        ? `${shortDate(w2027.startDate)}\u2013${shortDate(w2027.endDate)}`
        : "\u2013",
    };
  });

  /* FAQ data */
  const pageFaqs = [
    {
      question: "Welche Kalenderwoche ist heute?",
      answer: `Heute ist Kalenderwoche\u00a0${kw.weekNumber} (ISO\u00a08601). Pr\u00fcfe die KW direkt in deinem Kalender mit Wochen (Smartphone, Outlook oder Google Kalender). Achte darauf, dass \u201eISO-Wochen\u201c bzw. \u201eKalenderwochen\u201c aktiviert sind.`,
    },
    {
      question: "Was ist eine Kalenderwoche (KW) nach ISO\u00a08601?",
      answer:
        "Eine Kalenderwoche nach ISO\u00a08601 ist eine standardisierte Wochenz\u00e4hlung, bei der jede Woche von Montag bis Sonntag l\u00e4uft. Die Wochen werden fortlaufend nummeriert (KW\u00a01 bis 52/53) und sind weltweit eindeutig definiert.",
    },
    {
      question:
        "Mit welchem Wochentag beginnt die Kalenderwoche in Deutschland?",
      answer:
        "In Deutschland beginnt die Kalenderwoche am Montag. Das entspricht der ISO-8601-Norm und ist in den meisten Kalendern mit Wochen sowie in Business-Kalendern Standard.",
    },
    {
      question: "Wann beginnt die erste Kalenderwoche (KW\u00a01)?",
      answer:
        "KW\u00a01 ist nach ISO\u00a08601 die Woche, die den ersten Donnerstag des Jahres enth\u00e4lt. Anders gesagt: KW\u00a01 ist die Woche mit dem 4.\u00a0Januar. Dadurch kann KW\u00a01 schon im Dezember des Vorjahres beginnen.",
    },
    {
      question:
        "Wie viele Kalenderwochen hat ein Jahr \u2013 und wann gibt es KW\u00a053?",
      answer:
        "Ein Jahr hat nach ISO\u00a08601 entweder 52 oder 53 Kalenderwochen. KW\u00a053 gibt es, wenn der 1.\u00a0Januar ein Donnerstag ist oder bei einem Schaltjahr, in dem der 1.\u00a0Januar ein Mittwoch ist.",
    },
    {
      question:
        "Warum ist die Kalenderwoche in den USA manchmal anders als in Deutschland?",
      answer:
        "In den USA startet die Woche oft am Sonntag und es wird nicht immer nach ISO\u00a08601 gez\u00e4hlt. Dadurch k\u00f6nnen Wochenanfang und KW-Nummer von der deutschen Kalenderwoche abweichen.",
    },
    {
      question:
        "Wie kann ich Kalenderwochen auf dem iPhone oder in Google Kalender anzeigen?",
      answer:
        "Auf dem iPhone aktivierst du Kalenderwochen unter \u201eEinstellungen\u201c \u2192 \u201eKalender\u201c \u2192 \u201eWochennummern\u201c. In Google Kalender gehst du auf \u201eEinstellungen\u201c \u2192 \u201eAllgemein\u201c und aktivierst \u201eWochennummern anzeigen\u201c.",
    },
    {
      question:
        "Welche Daten hat Kalenderwoche\u00a03 / 25 / 26 (2026 und 2027)?",
      answer: `2026: KW\u00a03\u00a0=\u00a0${freqRows[0].range2026}, KW\u00a025\u00a0=\u00a0${freqRows[1].range2026}, KW\u00a026\u00a0=\u00a0${freqRows[2].range2026}. 2027: KW\u00a03\u00a0=\u00a0${freqRows[0].range2027}, KW\u00a025\u00a0=\u00a0${freqRows[1].range2027}, KW\u00a026\u00a0=\u00a0${freqRows[2].range2027}. Das sind ISO-8601-Spannen (Mo\u2013So).`,
    },
  ];

  /* JSON-LD structured data */
  const pageJsonLd = [
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
          name: "Kalender mit Wochen",
          item: "https://aktuellekw.de/kalender-mit-wochen",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
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
        {/* ── Breadcrumb ────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Kalender mit Wochen</span>
        </nav>

        {/* ── H1 + Intro ── Cluster 2 + 6 ──────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Kalender mit Wochen (Kalenderwochen/KW): Aktuelle KW, Tabellen{" "}
          {year}&ndash;{nextYear}, Berechnung &amp; Vorlagen
        </h1>
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Kalender mit Wochen sind der schnellste Weg, Termine sauber zu
            planen: Heute ist der{" "}
            <strong className="text-text-primary">{currentDateDisplay}</strong>{" "}
            und du bist in{" "}
            <strong className="text-text-primary">
              KW&nbsp;{kw.weekNumber}
            </strong>{" "}
            ({formatDateDE(kw.startDate)} &ndash; {formatDateDE(kw.endDate)}).
          </p>
          <p>
            Ein <strong className="text-text-primary">Kalender mit Wochen</strong>{" "}
            zeigt dir neben Datum und Wochentag auch die{" "}
            <strong className="text-text-primary">Kalenderwoche (KW)</strong> &ndash;
            praktisch f&uuml;r Projektpl&auml;ne, Urlaubsabstimmung,
            Liefertermine und Team-Meetings. In Deutschland gilt dabei{" "}
            <strong className="text-text-primary">ISO&nbsp;8601</strong>: Die
            Woche startet am <strong className="text-text-primary">Montag</strong>,
            und <strong className="text-text-primary">KW&nbsp;1</strong> ist die
            Woche mit dem{" "}
            <strong className="text-text-primary">ersten Donnerstag</strong> des
            Jahres.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Schnell-Info:</strong> Du
            brauchst nur die KW-Nummer? Schau direkt auf unserer{" "}
            <a href="/" className="text-accent hover:underline font-medium">
              Aktuelle KW &ndash; Startseite
            </a>
            . Oder finde heraus,{" "}
            <a
              href="/welche-kalenderwoche-haben-wir"
              className="text-accent hover:underline font-medium"
            >
              welche Kalenderwoche wir heute haben
            </a>
            .
          </div>
        </div>

        {/* ── Welche KW ist heute? ─────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Welche Kalenderwoche ist heute? (aktuelle KW sofort finden)
          </h2>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-4">
            <p className="text-sm leading-relaxed">
              <strong className="text-text-primary">
                Heute ist die Kalenderwoche (KW)&nbsp;{kw.weekNumber}
              </strong>{" "}
              (Stand: {currentDateDisplay}). In Deutschland, &Ouml;sterreich und
              der Schweiz gilt ISO&nbsp;8601 mit{" "}
              <strong className="text-text-primary">Montag als Wochenbeginn</strong>.
              Startet deine Woche am Sonntag (z.&nbsp;B. US-Einstellung), kann
              die angezeigte KW abweichen.
            </p>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du dich fragst,{" "}
            <a
              href="/welche-kalenderwoche-haben-wir"
              className="text-accent hover:underline"
            >
              welche Kalenderwoche heute ist
            </a>
            , pr&uuml;fe zuerst den Wochenstart in deinen Einstellungen.
            Beginnt deine Woche am Montag, stimmt die aktuelle KW in
            DE/AT/CH in der Regel.
          </p>

          {/* iOS Anleitung */}
          <h3 className="text-lg font-semibold mt-8 mb-3">
            Kalenderwoche auf iPhone (iOS) anzeigen
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Wenn du die{" "}
            <strong className="text-text-primary">
              Kalenderwochen am iPhone
            </strong>{" "}
            sehen willst, aktivierst du die Funktion direkt in iOS. Danach zeigt
            dir die Kalender-App die KW in der Wochenansicht automatisch an.
          </p>
          <ol className="space-y-1.5 text-text-secondary text-sm leading-relaxed list-none mb-4">
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">1.</span>
              <span>
                &Ouml;ffne{" "}
                <strong className="text-text-primary">Einstellungen</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">2.</span>
              <span>
                Tippe auf{" "}
                <strong className="text-text-primary">Kalender</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">3.</span>
              <span>
                Aktiviere{" "}
                <strong className="text-text-primary">Kalenderwochen</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">4.</span>
              <span>&Ouml;ffne die Kalender-App</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">5.</span>
              <span>Wechsle zur Wochenansicht</span>
            </li>
          </ol>

          {/* Google Kalender Anleitung */}
          <h3 className="text-lg font-semibold mt-8 mb-3">
            Kalenderwoche in Google Kalender anzeigen
          </h3>
          <ul className="space-y-1.5 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>&Ouml;ffne Google Kalender im Browser.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                Klicke auf das Zahnrad &rarr;{" "}
                <strong className="text-text-primary">Einstellungen</strong>.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                Gehe zu &bdquo;Kalenderansicht&ldquo; oder
                &bdquo;Optionen&ldquo;.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                Aktiviere{" "}
                <strong className="text-text-primary">
                  Wochennummern anzeigen
                </strong>
                .
              </span>
            </li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mt-3">
            So siehst du die Kalenderwochen direkt neben der Wochenansicht und
            hast die KW im Kalender immer im Blick.
          </p>
        </div>

        {/* ── Was bedeutet „Kalender mit Wochen"? ──────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender mit Wochen (Kalenderwochen/KW): Was bedeutet das genau?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Ein{" "}
            <strong className="text-text-primary">Kalender mit Wochen</strong>{" "}
            zeigt neben dem Datum auch die{" "}
            <strong className="text-text-primary">Kalenderwochen (KW)</strong>{" "}
            als Nummern. So siehst du sofort, in welcher KW ein Termin liegt
            &ndash; ideal f&uuml;r Projekt- und Lieferplanung. Einen schnellen
            Einstieg bietet dir der{" "}
            <a
              href="/kalenderwoche"
              className="text-accent hover:underline"
            >
              Kalender mit Kalenderwochen im &Uuml;berblick
            </a>
            .
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-4">
            <strong className="text-text-primary">
              Kalender mit Wochen (KW) &ndash; Kurzdefinition:
            </strong>{" "}
            Ein Kalender mit Wochen erg&auml;nzt die Datumsansicht um die
            KW-Nummer (z.&nbsp;B. KW&nbsp;12).
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-2">
            <strong className="text-text-primary">
              Typische Anwendungsf&auml;lle:
            </strong>
          </p>
          <ul className="space-y-1.5 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Projektplanung</strong>{" "}
                und Meilensteine
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Lieferwochen</strong> und
                Bestellungen
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Urlaubsplanung</strong> im
                Team
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>Schul- und Kita-Planung</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>Schichtmodelle und Dienstpl&auml;ne</span>
            </li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mt-3">
            Wichtig: Die Wochentage laufen von Mo&ndash;So. Die{" "}
            <strong className="text-text-primary">Kalenderwoche (KW)</strong>{" "}
            ist die fortlaufende Wochennummer innerhalb eines Jahres.
          </p>
        </div>

        {/* ── ISO 8601 Regeln ──────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            ISO-8601-Regeln: Wann beginnt eine Kalenderwoche und was ist
            KW&nbsp;1?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mit welchem Wochentag beginnt die Kalenderwoche? Nach ISO&nbsp;8601
            startet sie am{" "}
            <strong className="text-text-primary">Montag</strong>.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            <strong className="text-text-primary">KW&nbsp;1</strong> ist die
            Woche mit dem ersten Donnerstag des Jahres &ndash; oder anders
            gesagt: die Woche, in die der 4.&nbsp;Januar f&auml;llt. Deshalb
            wirkt der Jahreswechsel oft verwirrend: Ende Dezember kann bereits
            KW&nbsp;1 sein, w&auml;hrend Anfang Januar noch zur letzten
            Kalenderwoche des Vorjahres geh&ouml;ren kann.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-3">
            Was bedeutet &bdquo;KW&ldquo; und wof&uuml;r wird es genutzt?
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            <strong className="text-text-primary">KW</strong> ist die
            Abk&uuml;rzung f&uuml;r{" "}
            <strong className="text-text-primary">Kalenderwoche</strong>. Im
            KW&nbsp;Kalender nutzt du Kalenderwochen als kurze, einheitliche
            Terminangabe &ndash; besonders in Unternehmen, in der Projektplanung
            und in der Logistik, zum Beispiel: &bdquo;Lieferung
            KW&nbsp;26&ldquo;.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">
              &bdquo;KW&ldquo; = Kalenderwoche
            </strong>{" "}
            &ndash; ideal f&uuml;r kurze Terminangaben. Z&auml;hlweise vorher
            abstimmen (ISO vs. US).
          </div>
        </div>

        {/* ── KW berechnen ─────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalenderwoche berechnen: So findest du die KW f&uuml;r ein Datum
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Am schnellsten kannst du die Kalenderwoche berechnen, indem du in
            deiner Ger&auml;te- oder Kalender-App die KW-Anzeige aktivierst.
            Alternativ nutzt du einen{" "}
            <a href="/" className="text-accent hover:underline">
              Online-Rechner auf unserer Startseite
            </a>
            .
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du eine Kalenderwoche ermitteln willst, hilft dir die
            ISO-Logik: Eine Woche l&auml;uft von{" "}
            <strong className="text-text-primary">Montag bis Sonntag</strong>.{" "}
            <strong className="text-text-primary">KW&nbsp;1</strong> ist die
            Woche, in der der 4.&nbsp;Januar liegt.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Achte auf typische Stolperfallen: Manche Kalender starten am
            Sonntag. Auch Zeitzonen und Regionseinstellungen k&ouml;nnen den
            Wechsel der Kalenderwoche beeinflussen.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Checkliste:</strong> KW
            f&uuml;r ein Datum bestimmen
            <ol className="mt-2 space-y-1 list-none">
              <li className="flex gap-2">
                <span className="text-accent font-semibold shrink-0">1.</span>
                <span>ISO-Einstellung pr&uuml;fen</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-semibold shrink-0">2.</span>
                <span>Kalenderwochen einblenden</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-semibold shrink-0">3.</span>
                <span>Datum in der Wochenansicht &ouml;ffnen</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-semibold shrink-0">4.</span>
                <span>
                  Alternativ den{" "}
                  <a href="/" className="text-accent hover:underline">
                    KW-Rechner
                  </a>{" "}
                  nutzen
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* ── KW-Tabelle 2026 ──────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender mit Wochen {year}: Tabelle aller Kalenderwochen (KW) mit
            Datumsspannen
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Hier findest du den{" "}
            <strong className="text-text-primary">
              Kalender mit Wochen {year}
            </strong>{" "}
            nach ISO-Norm (Montag bis Sonntag). {year} hat{" "}
            <strong className="text-text-primary">
              {weeksInYear} Kalenderwochen
            </strong>
            . Die vollst&auml;ndige &Uuml;bersicht findest du auf der Seite{" "}
            <a
              href={`/kalenderwochen/${year}`}
              className="text-accent hover:underline"
            >
              Kalenderwochen {year}
            </a>
            .
          </p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    KW
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    von (Mo)
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    bis (So)
                  </th>
                </tr>
              </thead>
              <tbody>
                {firstSlice2026.map((w) => (
                  <tr
                    key={w.weekNumber}
                    className={`border-b border-border ${
                      w.weekNumber === kw.weekNumber && w.year === kw.year
                        ? "bg-accent/5 font-semibold"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-2.5 text-text-primary">
                      <a
                        href={`/kw/${w.weekNumber}-${w.year}`}
                        className="text-accent hover:underline"
                      >
                        KW&nbsp;{w.weekNumber}
                      </a>
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {formatDateDE(w.startDate)}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {formatDateDE(w.endDate)}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-border">
                  <td
                    colSpan={3}
                    className="px-5 py-3 text-center text-text-secondary text-xs"
                  >
                    &hellip; weitere Wochen &hellip;
                  </td>
                </tr>
                {lastSlice2026.map((w) => (
                  <tr
                    key={w.weekNumber}
                    className={`border-b border-border ${
                      w.weekNumber === kw.weekNumber && w.year === kw.year
                        ? "bg-accent/5 font-semibold"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-2.5 text-text-primary">
                      <a
                        href={`/kw/${w.weekNumber}-${w.year}`}
                        className="text-accent hover:underline"
                      >
                        KW&nbsp;{w.weekNumber}
                      </a>
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {formatDateDE(w.startDate)}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {formatDateDE(w.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-sm">
            <a
              href={`/kalenderwochen/${year}`}
              className="text-accent hover:underline font-medium"
            >
              Alle {weeksInYear} Kalenderwochen {year} anzeigen &rarr;
            </a>
          </p>

          {/* Download Hinweis */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mt-6">
            <strong className="text-text-primary">
              Kalenderwochen {year} als PDF/Excel:
            </strong>{" "}
            Du kannst die Kalenderwochen als PDF ausdrucken und an die Wand
            h&auml;ngen. Excel/CSV ist die bessere Wahl, wenn du Termine,
            Projekte oder Schichten planst und die Wochen nach KW filtern oder
            sortieren willst.
          </div>
        </div>

        {/* ── KW-Tabelle 2027 ──────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender mit Wochen {nextYear}: Tabelle aller Kalenderwochen (KW)
            mit Datumsspannen
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Hier findest du den{" "}
            <strong className="text-text-primary">
              Kalenderwochen {nextYear} Kalender
            </strong>{" "}
            als schnelle &Uuml;bersicht. {nextYear} hat{" "}
            <strong className="text-text-primary">
              {weeksInNextYear} Kalenderwochen
            </strong>
            . Die komplette Seitenansicht findest du hier:{" "}
            <a
              href={`/kalenderwochen/${nextYear}`}
              className="text-accent hover:underline"
            >
              Kalenderwochen {nextYear}
            </a>
            .
          </p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    KW
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    von (Mo)
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    bis (So)
                  </th>
                </tr>
              </thead>
              <tbody>
                {firstSlice2027.map((w) => (
                  <tr key={w.weekNumber} className="border-b border-border">
                    <td className="px-5 py-2.5 text-text-primary">
                      <a
                        href={`/kw/${w.weekNumber}-${nextYear}`}
                        className="text-accent hover:underline"
                      >
                        KW&nbsp;{w.weekNumber}
                      </a>
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {formatDateDE(w.startDate)}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {formatDateDE(w.endDate)}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-border">
                  <td
                    colSpan={3}
                    className="px-5 py-3 text-center text-text-secondary text-xs"
                  >
                    &hellip; weitere Wochen &hellip;
                  </td>
                </tr>
                {lastSlice2027.map((w) => (
                  <tr key={w.weekNumber} className="border-b border-border">
                    <td className="px-5 py-2.5 text-text-primary">
                      <a
                        href={`/kw/${w.weekNumber}-${nextYear}`}
                        className="text-accent hover:underline"
                      >
                        KW&nbsp;{w.weekNumber}
                      </a>
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {formatDateDE(w.startDate)}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {formatDateDE(w.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-sm">
            <a
              href={`/kalenderwochen/${nextYear}`}
              className="text-accent hover:underline font-medium"
            >
              Alle {weeksInNextYear} Kalenderwochen {nextYear} anzeigen &rarr;
            </a>
          </p>
        </div>

        {/* ── Wie viele KW hat ein Jahr? ───────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wie viele Kalenderwochen hat ein Jahr? (52 oder 53 KW einfach
            erkl&auml;rt)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Ein Jahr hat meistens{" "}
            <strong className="text-text-primary">52 Kalenderwochen</strong>.
            Der Grund: 52&nbsp;Wochen ergeben 364&nbsp;Tage. Ein normales Jahr
            hat jedoch 365&nbsp;Tage, ein Schaltjahr 366&nbsp;Tage. Diese
            1&ndash;2 zus&auml;tzlichen Tage verschieben den Kalender so, dass
            in manchen Jahren eine{" "}
            <strong className="text-text-primary">53.&nbsp;Kalenderwoche</strong>{" "}
            dazukommt.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-4">
            <strong className="text-text-primary">
              Merksatz: Wann gibt es KW&nbsp;53?
            </strong>
            <br />
            Eine 53.&nbsp;Kalenderwoche entsteht, wenn der Jahresstart nach ISO
            eine zus&auml;tzliche Woche &bdquo;voll&ldquo; macht.
            <br />
            <strong className="text-text-primary">Beispiele:</strong> Der
            1.&nbsp;Januar ist ein Donnerstag. Oder: Schaltjahr und der
            1.&nbsp;Januar ist ein Mittwoch.
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Mehr Details findest du hier:{" "}
            <a
              href="/wie-viele-wochen-hat-ein-jahr"
              className="text-accent hover:underline"
            >
              Warum ein Jahr 52 oder manchmal 53 Kalenderwochen hat
            </a>
            .
          </p>
        </div>

        {/* ── DE vs. USA ───────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Deutschland/Europa vs. USA: Warum Kalenderwochen unterschiedlich
            sein k&ouml;nnen
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Bei Kalenderwochen gibt es zwei zentrale Unterschiede zwischen
            Deutschland und den USA: den{" "}
            <strong className="text-text-primary">Wochenbeginn</strong> und die{" "}
            <strong className="text-text-primary">Z&auml;hlweise</strong>.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Region
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Wochenbeginn
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    KW&nbsp;1-Definition
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Systeme/Tools
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 text-text-primary font-medium">
                    Deutschland/Europa
                  </td>
                  <td className="px-5 py-3 text-text-secondary">Montag</td>
                  <td className="px-5 py-3 text-text-secondary">
                    Erste Woche mit dem ersten Donnerstag
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    ISO-Kalender, EU-Kalender
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-text-primary font-medium">
                    USA (h&auml;ufig)
                  </td>
                  <td className="px-5 py-3 text-text-secondary">Sonntag</td>
                  <td className="px-5 py-3 text-text-secondary">
                    Woche mit dem 1.&nbsp;Januar
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    US-Kalender, manche Apps/Outlook
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Wenn du international planst, sende immer den Kalender mit KW nach{" "}
            <strong className="text-text-primary">ISO-Standard</strong> oder
            erg&auml;nze die konkrete Datumsspanne (Mo&ndash;So). So vermeidest
            du Missverst&auml;ndnisse bei Meetings, Deadlines und
            Lieferterminen.
          </p>
        </div>

        {/* ── KW in Apps einstellen ────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender mit KW in Apps und Programmen einstellen (iOS, Android,
            Outlook, Google Kalender)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Du willst deinen Kalender mit KW nutzen? Die Einstellung findest du
            meist in den Kalender-Optionen unter &bdquo;Ansicht&ldquo;,
            &bdquo;Optionen&ldquo; oder &bdquo;Region/Locale&ldquo;.
          </p>

          {/* Checkliste */}
          <div className="space-y-4">
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
              <strong className="text-text-primary">
                iOS (iPhone/iPad):
              </strong>
              <br />
              Einstellungen &rarr; Kalender &rarr; Wochennummern aktivieren
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
              <strong className="text-text-primary">
                Android (Google Kalender):
              </strong>
              <br />
              Google Kalender &rarr; Einstellungen &rarr; Allgemein &rarr;
              Wochennummern anzeigen
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
              <strong className="text-text-primary">
                Android (Hersteller-Kalender):
              </strong>
              <br />
              In der Kalender-App nach &bdquo;Wochennummern&ldquo; suchen.
              Fehlt die Option? Nutze den Google Kalender als Alternative.
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
              <strong className="text-text-primary">Outlook/Windows:</strong>
              <br />
              Outlook &rarr; Datei &rarr; Optionen &rarr; Kalender &rarr;
              Anzeigeoptionen &rarr; Wochennummern aktivieren
            </div>
          </div>

          {/* Outlook Detail */}
          <h3 className="text-lg font-semibold mt-8 mb-3">
            Outlook: Kalenderwochen/Wochennummern anzeigen (Windows)
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Mit dieser Anleitung blendest du Outlook Kalenderwochen in Windows
            ein. Du siehst die KW vor allem in der Monatsansicht und im
            Datumsnavigator.
          </p>
          <ol className="space-y-1.5 text-text-secondary text-sm leading-relaxed list-none mb-4">
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">1.</span>
              <span>&Ouml;ffne Outlook.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">2.</span>
              <span>
                Klicke auf{" "}
                <strong className="text-text-primary">Datei</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">3.</span>
              <span>
                W&auml;hle{" "}
                <strong className="text-text-primary">Optionen</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">4.</span>
              <span>
                Gehe zu{" "}
                <strong className="text-text-primary">Kalender</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">5.</span>
              <span>
                Aktiviere:{" "}
                <strong className="text-text-primary">
                  &bdquo;Wochennummern in der Monatsansicht und im
                  Datumsnavigator anzeigen&ldquo;
                </strong>
                .
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-semibold shrink-0">6.</span>
              <span>
                Klicke auf{" "}
                <strong className="text-text-primary">OK</strong>.
              </span>
            </li>
          </ol>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Troubleshooting:</strong>{" "}
            Option fehlt oder KW werden nicht angezeigt? Outlook aktualisieren,
            Region/Sprache in Windows pr&uuml;fen (ISO-Kalenderwoche nutzen),
            Outlook komplett neu starten.
          </div>
        </div>

        {/* ── Häufig gesuchte KWs ──────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            H&auml;ufig gesuchte Kalenderwochen schnell nachschlagen (z.&nbsp;B.
            KW&nbsp;3, KW&nbsp;25, KW&nbsp;26)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Bestimmte Kalenderwochen tauchen in der Planung besonders
            h&auml;ufig auf.{" "}
            <strong className="text-text-primary">Kalenderwoche&nbsp;3</strong>{" "}
            liegt oft direkt im Jahresstart &ndash; viele setzen dann neue Ziele
            und planen Projekte.{" "}
            <strong className="text-text-primary">Kalenderwoche&nbsp;25</strong>{" "}
            und{" "}
            <strong className="text-text-primary">Kalenderwoche&nbsp;26</strong>{" "}
            fallen h&auml;ufig in Phasen mit Urlaub, Ferien oder &Uuml;bergaben
            im Team.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    KW
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    {year} (Mo&ndash;So)
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    {nextYear} (Mo&ndash;So)
                  </th>
                </tr>
              </thead>
              <tbody>
                {freqRows.map((row) => (
                  <tr key={row.kw} className="border-b border-border">
                    <td className="px-5 py-3 text-text-primary font-medium">
                      <a
                        href={`/kw/${row.kw}-${year}`}
                        className="text-accent hover:underline"
                      >
                        KW&nbsp;{row.kw}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-text-secondary">
                      {row.range2026}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">
                      {row.range2027}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-sm">
            F&uuml;r alle weiteren Kalenderwochen nutze die{" "}
            <a
              href="/kalenderwochen-uebersicht"
              className="text-accent hover:underline"
            >
              Kalenderwochen-&Uuml;bersicht mit allen Wochen auf einen Blick
            </a>
            .
          </p>
        </div>

        {/* ── Format-Vergleich ─────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender mit Wochen ausw&auml;hlen: Print-Kalender, PDF, Excel oder
            App &ndash; was passt wof&uuml;r?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du einen Kalender mit Wochen suchst, z&auml;hlt vor allem dein
            Alltag: Willst du nur schnell Termine &uuml;berblicken oder
            gemeinsam im Team planen?
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Format
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Vorteile
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Nachteile
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Ideal f&uuml;r
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Aufwand
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-text-primary font-medium">
                    Print (Wand/Planer)
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Sehr gut lesbar, viel Platz f&uuml;r Notizen
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Nicht teilbar, Updates nur manuell
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Privat, Schule, Haushalt
                  </td>
                  <td className="px-4 py-3 text-text-secondary">niedrig</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-text-primary font-medium">
                    PDF
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Schnell erstellt, offline nutzbar
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Kaum anpassbar
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Privat, schnelle &Uuml;bersicht
                  </td>
                  <td className="px-4 py-3 text-text-secondary">niedrig</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-text-primary font-medium">
                    Excel/Sheets
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Stark anpassbar, Filter/Formeln, CSV-Export
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Einrichtung braucht Zeit
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Logistik, Planung, Auswertungen
                  </td>
                  <td className="px-4 py-3 text-text-secondary">mittel</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-text-primary font-medium">
                    Team/App
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Teilen, Wiederholtermine, ICS-Import/Export
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Abh&auml;ngig vom Anbieter/Tool
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    Projektteam, gemeinsame Planung
                  </td>
                  <td className="px-4 py-3 text-text-secondary">mittel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender mit Kalenderwochen nutzen &ndash; jetzt Tabelle speichern
            oder KW-Anzeige aktivieren
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du oft mit Kalenderwochen (KW) planst, speichere dir einen
            Kalender mit KW als Datei oder aktiviere die Anzeige direkt in
            deinem Tool. So findest du Kalenderwochen schneller und vermeidest
            Missverst&auml;ndnisse im Team &ndash; etwa bei Sprint-Planung,
            Urlaubsabsprachen oder Projektmeilensteinen.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Springe direkt zu den Checklisten und aktiviere die KW-Anzeige in
            iOS, Google Kalender oder Outlook. Das lohnt sich besonders, wenn du
            Termine unterwegs pr&uuml;fst und Wochen sauber vergleichen willst
            &ndash; zum Beispiel f&uuml;r Schichtpl&auml;ne oder Reisen.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Tipp:</strong> Stimmst du
            international ab, pr&uuml;fe in den Einstellungen das ISO-Setting.
            Je nach Region starten Kalenderwochen an unterschiedlichen
            Wochentagen oder werden anders gez&auml;hlt.
          </div>
        </div>

        {/* ── Zusammenfassung ──────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-3">
            Zusammenfassung &amp; Ausblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Mit diesem Kalender mit Wochen findest du die{" "}
            <strong className="text-text-primary">
              aktuelle Kalenderwoche KW&nbsp;{kw.weekNumber}
            </strong>{" "}
            sofort, verstehst die ISO-8601-Regeln (Mo&ndash;So, wann KW&nbsp;1
            beginnt) und kannst jede KW f&uuml;r ein Datum schnell berechnen.
            Die Tabellen f&uuml;r{" "}
            <a
              href={`/kalenderwochen/${year}`}
              className="text-accent hover:underline"
            >
              Kalenderwochen {year}
            </a>{" "}
            und{" "}
            <a
              href={`/kalenderwochen/${nextYear}`}
              className="text-accent hover:underline"
            >
              Kalenderwochen {nextYear}
            </a>{" "}
            sowie die kompakten &Uuml;bersichten zu h&auml;ufig gesuchten KWs
            machen das Ganze zum praktischen Nachschlagewerk.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mt-3">
            Wenn du im Team, in der Logistik oder im Projektplan arbeitest,
            kommuniziere am besten immer nach ISO-Standard oder direkt mit
            Datumsspannen. Aktiviere jetzt die KW-Anzeige in
            iOS/Android/Outlook/Google&nbsp;Calendar und speichere dir die
            Tabellen &ndash; so hast du die richtige KW jederzeit parat.
          </p>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
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

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {year} &rarr;
          </a>
          <a
            href="/kalenderwochen-uebersicht"
            className="text-accent hover:underline"
          >
            KW-&Uuml;bersicht &rarr;
          </a>
          <a
            href="/wie-viele-wochen-hat-ein-jahr"
            className="text-accent hover:underline"
          >
            Wie viele Wochen hat ein Jahr? &rarr;
          </a>
          <a href="/faq" className="text-accent hover:underline">
            Alle Fragen zur Kalenderwoche &rarr;
          </a>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/kalender-mit-wochen/page.tsx (Cluster 2 + 6)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Kalender mit Wochen: aktuelle KW + Tabellen (ISO 8601)"
 * [x] Meta Description: statisch mit KW/Tabellen/PDF/Excel/App Keywords
 * [x] Canonical URL: https://aktuellekw.de/kalender-mit-wochen
 * [x] OG-Title + OG-Description + OG-URL
 * [x] Twitter Card: summary_large_image
 * [x] H1: "Kalender mit Wochen (Kalenderwochen/KW): Aktuelle KW, Tabellen 2026–2027, Berechnung & Vorlagen"
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → Kalender mit Wochen)
 * [x] Schema.org: FAQPage (8 Fragen)
 * [x] Cluster 2 + 6 SEO-Content: Intro, ISO-Regeln, KW-Berechnung, Tabellen, Vergleiche, Anleitungen
 * [x] Dynamische KW-Tabellen 2026/2027 via getAllKWsForYear() (erste 8 + letzte 3 KW)
 * [x] Semantische HTML-Tabellen: KW 2026, KW 2027, DE vs USA, Format-Vergleich, häufige KWs
 * [x] FAQ (8 Fragen): KW heute, ISO 8601, Wochenbeginn, KW 1, 52/53, USA, iPhone/Google, KW 3/25/26
 * [x] iOS/Android/Outlook/Google Kalender Setup-Anleitungen
 * [x] Häufig gesuchte KW-Tabelle (KW 3, 25, 26) dynamisch berechnet
 * [x] Format-Vergleichstabelle: Print/PDF/Excel/App
 * [x] Cross-Links: Startseite (/), Kalenderwoche (/kalenderwoche), Kalenderwochen-Übersicht,
 *     Wie viele Wochen (/wie-viele-wochen-hat-ein-jahr), Welche KW (/welche-kalenderwoche-haben-wir),
 *     FAQ (/faq), Kalenderwochen/2026, Kalenderwochen/2027, einzelne KW-Seiten (/kw/[n]-[year])
 * [x] Cluster 2 Keywords: Kalender mit Wochen, KW Kalender, Kalenderwochen 2026, Kalenderwochen 2027
 * [x] Cluster 6 Keywords: Wochenkalender, PDF, Excel, Kalender mit KW App, Print-Kalender
 * [x] Dynamische Platzhalter: CURRENT_KW, CURRENT_DATE, KW_START/END, weeksInYear
 * [x] revalidate = 3600 (stündliche ISR)
 * [x] Server Component (kein "use client")
 * [ ] TODO: OG-Image erstellen (1200×630px)
 * [ ] TODO: hreflang für AT/CH ergänzen wenn mehrsprachig ausgebaut
 */
