import type { Metadata } from "next";
import {
  getCurrentKW,
  formatDateDE,
  getWeeksInYear,
  getAllKWsForYear,
} from "@/lib/kw";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const ogTitle =
    "Kalender Wochenübersicht – aktuelle KW";
  const ogDescription = `Kalender Wochenübersicht: aktuelle KW ${kw.weekNumber} sofort finden, Anzeige-Optionen prüfen und das passende Layout wählen (Uhrzeit, To-dos, Team). DIN-A4-PDF & ISO-8601.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: "https://aktuellekw.de/kalender-wochenuebersicht",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/kalender-wochenuebersicht",
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

export default function KalenderWochenuebersichtPage() {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);
  const allKWs = getAllKWsForYear(kw.year);

  // Compact KW table: first 5 + last 3
  const firstKWs = allKWs.slice(0, 5);
  const lastKWs = allKWs.slice(-3);

  // Month names
  const monthNamesDE = [
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
  ];
  function getMonthRange(start: Date, end: Date): string {
    const startMonth = monthNamesDE[start.getUTCMonth()];
    const endMonth = monthNamesDE[end.getUTCMonth()];
    return startMonth === endMonth ? startMonth : `${startMonth}/${endMonth}`;
  }

  // Today display
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const fullMonthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  const dayNames = [
    "Sonntag", "Montag", "Dienstag", "Mittwoch",
    "Donnerstag", "Freitag", "Samstag",
  ];
  const currentDateDisplay = `${dayNames[todayUTC.getUTCDay()]}, ${String(todayUTC.getUTCDate()).padStart(2, "0")}. ${fullMonthNames[todayUTC.getUTCMonth()]} ${todayUTC.getUTCFullYear()}`;

  // FAQ data
  const pageFaqs = [
    {
      question: "In welcher KW sind wir aktuell?",
      answer: `Aktuell sind wir in Kalenderwoche\u00a0${kw.weekNumber} (nach ISO\u00a08601). Du kannst die aktuelle KW schnell prüfen, indem du in deiner Kalender-App die Anzeige „Kalenderwochen" aktivierst oder online nach „aktuelle Kalenderwoche" suchst. Für eine schnelle Orientierung hilft auch eine Kalender Wochenübersicht mit KW-Spalte.`,
    },
    {
      question:
        "Wie kann man Kalenderwochen anzeigen (Google Kalender, Outlook, iPhone, Android)?",
      answer:
        "In Google Kalender aktivierst du Kalenderwochen in den Einstellungen unter Anzeigeoptionen. In Outlook findest du die KW-Anzeige in den Kalender-Optionen. Am iPhone stellst du \u201EKalenderwochen\u201C in den Systemeinstellungen der Kalender-App ein, auf Android je nach Kalender-App in den Anzeige-Einstellungen.",
    },
    {
      question:
        "Was ist der Unterschied zwischen Kalenderwoche und Arbeitswoche?",
      answer:
        "Eine Kalenderwoche (KW) ist eine standardisierte Woche im Kalender, meist nach ISO\u00a08601 gezählt. Eine Arbeitswoche beschreibt dagegen deine tatsächlichen Arbeitstage und kann je nach Job, Schicht oder Land abweichen. In einer Kalender Wochenübersicht ist die KW die feste Orientierung, die Arbeitswoche ist dein individueller Rhythmus.",
    },
    {
      question: "Warum hat ein Jahr manchmal 53 Kalenderwochen?",
      answer:
        "Ein Jahr hat manchmal 53 Kalenderwochen, weil die Wochenzählung nicht exakt in 52 ganze Wochen aufgeht und die ISO-Regeln die erste KW an bestimmte Wochentage koppeln. Dadurch kann am Jahresende eine zusätzliche KW entstehen.",
    },
    {
      question:
        "Welches Layout ist besser: Wochenübersicht horizontal oder vertikal?",
      answer:
        "Horizontal ist oft besser, wenn du pro Tag eher To-dos, Notizen oder kurze Einträge planst. Vertikal passt besser, wenn du Termine über den Tag verteilst und Zeitblöcke vergleichen möchtest. Für Team- und Meeting-Planung ist eine vertikale Kalender Wochenübersicht mit Uhrzeiten meist klarer.",
    },
    {
      question:
        "Welche Wochenübersicht eignet sich als Wochenplaner zum Ausdrucken (DIN\u00a0A4)?",
      answer:
        "Für DIN\u00a0A4 eignet sich eine Kalender Wochenübersicht mit 7 Tagen auf einer Seite, gut lesbarer Schrift und ausreichend Notizfläche. Wenn du viele Termine hast, nimm ein Layout mit Zeitraster; für Aufgaben reicht eine Wochenübersicht mit To-do-Spalte.",
    },
    {
      question:
        "Gibt es eine Kalender Wochenübersicht als PDF mit Uhrzeiten?",
      answer:
        "Ja, es gibt Wochenplaner-PDFs mit Uhrzeiten, meist als Kalender Wochenübersicht mit Zeitraster (z.\u00a0B. für Tageszeiten oder Stundenblöcke). Wichtig ist, dass das Zeitraster zu deinem Alltag passt und die Seite beim Drucken nicht abgeschnitten wird.",
    },
    {
      question: "Was bedeutet ISO-Kalenderwoche (ISO\u00a08601)?",
      answer:
        "ISO-Kalenderwoche bedeutet, dass die KW nach dem Standard ISO\u00a08601 gezählt wird: Die Woche beginnt am Montag und die erste Kalenderwoche ist die Woche mit dem ersten Donnerstag des Jahres. So sind Kalenderwochen international einheitlich vergleichbar.",
    },
  ];

  // JSON-LD structured data
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
          name: "Kalender Wochenübersicht",
          item: "https://aktuellekw.de/kalender-wochenuebersicht",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "de-DE",
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

        {/* -- Sichtbare Breadcrumb-Navigation -- */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">
            Kalender Wochenübersicht
          </span>
        </nav>

        {/* -- H1 + Intro -- Cluster 6 + 2 -- */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Kalender Wochenübersicht: Kalenderwochen im Überblick, Layouts &amp; Vorlagen
        </h1>
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Eine <strong className="text-text-primary">Kalender Wochenübersicht</strong> zeigt
            dir eine ganze Woche auf einen Blick &ndash; inklusive Termine, To-dos und oft
            auch der passenden Kalenderwoche (KW). Genau das macht sie so praktisch: Du
            planst nicht &bdquo;irgendwann&ldquo;, sondern konkret von Montag bis Sonntag und
            behältst Deadlines, Routinen und freie Slots sofort im Griff.
          </p>
          <p>
            Damit du keine Zeit verlierst, bekommst du gleich zu Beginn eine Schnellhilfe
            zur <strong className="text-text-primary">aktuellen Kalenderwoche</strong> &ndash;
            aktuell <strong className="text-text-primary">KW&nbsp;{kw.weekNumber}</strong> ({formatDateDE(kw.startDate)} &ndash; {formatDateDE(kw.endDate)}).
            Danach wählst du das passende Layout, prüfst PDF-Vorlagen und richtest die
            KW-Anzeige in deinen Apps ein.
          </p>
        </div>

        {/* -- Definition: Was ist eine Kalender Wochenübersicht -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender Wochenübersicht: Definition und Unterschied zu Monats- und Tageskalender
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Eine <strong className="text-text-primary">Kalender Wochenübersicht</strong> zeigt{" "}
            <strong className="text-text-primary">sieben Tage</strong> auf einer Seite oder
            als Doppelseite. So planst du Termine und Aufgaben übersichtlich, ohne ständig
            zwischen Ansichten zu wechseln. Du bekommst dieses Layout als Papierkalender
            oder digitaler Planer &ndash; im Hoch- oder Querformat.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Ein Monatskalender hilft dir bei der groben Planung, etwa für Ferien, Abgaben
            oder Schichten. Ein Tagesplaner passt, wenn du viele Details festhalten willst,
            zum Beispiel Zeitblöcke, Notizen und Prioritäten. Der{" "}
            <strong className="text-text-primary">Wochenkalender</strong> liegt genau
            dazwischen: Du siehst die ganze Woche am Stück und planst realistischer, weil
            du Termine, Wegezeiten und To-dos direkt im Zusammenhang erkennst.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Typisch nutzt du eine <strong className="text-text-primary">Wochenübersicht</strong>{" "}
            für Arbeit, Schule oder Haushalt &ndash; inklusive Aufgabenliste, Essensplan
            und Training.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Kurz erklärt:</strong>{" "}
            <strong className="text-text-primary">Wochenübersicht</strong> = <strong className="text-text-primary">7 Tage</strong> in einem Blick.{" "}
            Wann besser als Monats-/Tagesansicht?
            <ul className="mt-2 space-y-1.5">
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>Wenn du Termine und Aufgaben pro Woche koordinieren willst</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>Wenn du wiederkehrende Routinen planst (Essen, Sport, Lernen)</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>Wenn dir Monatsansichten zu grob und Tagesseiten zu voll sind</span>
              </li>
            </ul>
          </div>
        </div>

        {/* -- Aktuelle KW Section -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            In welcher Kalenderwoche sind wir aktuell? (aktuelle KW schnell prüfen)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du wissen willst, <strong className="text-text-primary">welche Kalenderwoche
            wir aktuell haben</strong>, kannst du die{" "}
            <strong className="text-text-primary">aktuelle KW</strong> direkt über das heutige
            Datum bestimmen. Heute ist {currentDateDisplay}. Für den schnellen Check
            schau auch auf{" "}
            <a href="/welche-kalenderwoche-haben-wir" className="text-accent hover:underline">
              Welche Kalenderwoche haben wir aktuell?
            </a>
          </p>

          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-6">
            <strong className="text-text-primary">Heute:</strong> {currentDateDisplay}{" "}
            &rarr; <strong className="text-accent">Kalenderwoche (ISO): KW&nbsp;{kw.weekNumber}</strong>
            <br />
            <span className="text-text-secondary">
              Zeitraum: {formatDateDE(kw.startDate)} &ndash; {formatDateDE(kw.endDate)}
            </span>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Grundlage ist der <strong className="text-text-primary">ISO-8601-Standard</strong>:
            Die <strong className="text-text-primary">aktuelle Kalenderwoche</strong> beginnt
            am <strong className="text-text-primary">Montag</strong>. <strong className="text-text-primary">KW&nbsp;1</strong> ist
            die Woche, die den <strong className="text-text-primary">ersten Donnerstag</strong> des
            Jahres enthält. Ein Überblick über Kalenderwochen erleichtert dir die Planung von
            Projekten, Lieferterminen und die Abstimmung im Team.
          </p>

          {/* ISO 8601 explanation */}
          <h3 className="text-xl font-semibold mb-3">
            So wird die Kalenderwoche (KW) berechnet (ISO-8601 kurz erklärt)
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Wenn du eine <strong className="text-text-primary">Kalenderwoche berechnen</strong> willst,
            hilft dir die <strong className="text-text-primary">ISO Kalenderwoche</strong>: Eine KW
            startet am Montag und endet am Sonntag. KW&nbsp;1 ist die Woche mit dem 4.&nbsp;Januar,
            also der Woche mit dem ersten Donnerstag. Am Jahreswechsel kann der 1.&nbsp;Januar noch
            zur letzten KW des Vorjahres gehören, oder Ende Dezember schon zu KW&nbsp;1 zählen.
          </p>
          <ul className="space-y-2 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>Prüfe: Liegt der 4.&nbsp;Januar in der Woche?</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>Oder: Ist der erste Donnerstag enthalten?</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>Dann ist es KW&nbsp;1.</span>
            </li>
          </ul>
        </div>

        {/* -- Kalenderwochen im Überblick: Jahresübersicht -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalenderwochen im Überblick: Jahresübersicht (KW {kw.year} und andere Jahre)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Eine <strong className="text-text-primary">KW-Jahresübersicht</strong> zeigt dir
            alle <strong className="text-text-primary">Kalenderwochen (KW)</strong> eines Jahres
            auf einen Blick. Du siehst <strong className="text-text-primary">KW&nbsp;1
            bis&nbsp;{weeksInYear}</strong> &ndash; jeweils mit dem Datumsbereich von Montag
            bis Sonntag. So planst du schnell nach Kalenderwoche: Sprints, Redaktionspläne,
            Lieferketten oder Urlaub.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Für den kompletten Überblick nutze die{" "}
            <a href="/kalenderwoche" className="text-accent hover:underline">
              Kalenderwochen-Übersicht auf einen Blick
            </a>. Für das Jahr {kw.year} findest du alle Wochen hier:{" "}
            <a href={`/kalenderwochen/${kw.year}`} className="text-accent hover:underline">
              Kalenderwochen {kw.year} im Detail
            </a>.
          </p>

          {/* Compact KW table */}
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-right px-5 py-3 font-medium text-text-secondary">KW</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Start (Mo)</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Ende (So)</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Monat(e)</th>
                </tr>
              </thead>
              <tbody>
                {firstKWs.map((w) => (
                  <tr
                    key={w.weekNumber}
                    className={`border-b border-border ${w.weekNumber === kw.weekNumber ? "bg-accent/5" : ""}`}
                  >
                    <td className={`px-5 py-2.5 text-right tabular-nums ${w.weekNumber === kw.weekNumber ? "font-semibold text-accent" : "text-text-primary"}`}>
                      {w.weekNumber}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary tabular-nums">
                      {formatDateDE(w.startDate)}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary tabular-nums">
                      {formatDateDE(w.endDate)}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {getMonthRange(w.startDate, w.endDate)}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-border">
                  <td colSpan={4} className="px-5 py-2 text-center text-text-secondary text-xs">
                    &hellip;
                  </td>
                </tr>
                {lastKWs.map((w) => (
                  <tr
                    key={w.weekNumber}
                    className={`border-b border-border last:border-b-0 ${w.weekNumber === kw.weekNumber ? "bg-accent/5" : ""}`}
                  >
                    <td className={`px-5 py-2.5 text-right tabular-nums ${w.weekNumber === kw.weekNumber ? "font-semibold text-accent" : "text-text-primary"}`}>
                      {w.weekNumber}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary tabular-nums">
                      {formatDateDE(w.startDate)}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary tabular-nums">
                      {formatDateDE(w.endDate)}
                    </td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {getMonthRange(w.startDate, w.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mb-6">
            <a href={`/kalenderwochen/${kw.year}`} className="text-accent hover:underline">
              Alle {weeksInYear} Kalenderwochen {kw.year} anzeigen &rarr;
            </a>
          </p>

          {/* Warum 52 oder 53 KW */}
          <h3 className="text-xl font-semibold mb-3">
            Warum es 52 oder 53 Kalenderwochen geben kann
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Ob ein Jahr <strong className="text-text-primary">52 oder 53 Kalenderwochen</strong> hat,
            folgt der ISO-Logik. Eine <strong className="text-text-primary">KW&nbsp;53</strong> gibt
            es, wenn das Jahr an einem Donnerstag beginnt. Oder wenn ein Schaltjahr an einem
            Mittwoch startet. In der Praxis wirkt der Jahreswechsel oft wie eine Verschiebung.
            Dann landet der 1.&nbsp;Januar noch in der letzten KW des Vorjahres.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Merksatz:</strong> KW&nbsp;53, wenn
            1.&nbsp;Januar = Donnerstag (oder Schaltjahr + Mittwoch).{" "}
            <span className="text-text-secondary">Beispiel: 2015 hat 53&nbsp;KW. 2014 hat 52&nbsp;KW.</span>
          </div>
        </div>

        {/* -- Layout-Vergleich: horizontal vs. vertikal -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Welches Layout ist für einen Wochenkalender am besten geeignet? (horizontal vs. vertikal)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du dich fragst, <strong className="text-text-primary">welches Layout
            Wochenkalender</strong> wirklich zu dir passt, entscheide zuerst nach deinem
            Planungsstil. Mit einem <strong className="text-text-primary">vertikalen
            Layout</strong> planst du deinen Tag stundenweise &ndash; ideal für einen{" "}
            <strong className="text-text-primary">Wochenkalender mit Uhrzeit</strong> und feste
            Termine. Ein <strong className="text-text-primary">horizontales Layout</strong>{" "}
            eignet sich besser, wenn du To-dos, Ziele und Notizen im Fokus hast.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Ob <strong className="text-text-primary">1 Woche pro Seite</strong> oder{" "}
            <strong className="text-text-primary">1 Woche auf 2 Seiten</strong> besser ist,
            hängt von deinem Platzbedarf ab. 1 Woche pro Seite bleibt kompakt. 1 Woche auf
            2 Seiten bietet mehr Raum für Notizen, Aufgabenlisten und Prioritäten. Achte
            bei der Auswahl auf konkrete Kriterien: Willst du feste Zeitblöcke, eine große
            Notizfläche oder eine Prioritäten-Spalte?
          </p>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Layout</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">geeignet für</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Vorteile</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Nachteile</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Beispiel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 font-medium text-text-primary">Vertikal</td>
                  <td className="px-5 py-3 text-text-secondary">Termine nach Uhrzeit</td>
                  <td className="px-5 py-3 text-text-secondary">klare Tagesstruktur</td>
                  <td className="px-5 py-3 text-text-secondary">weniger Platz für lange Notizen</td>
                  <td className="px-5 py-3 text-text-secondary">Arbeitstage mit Meetings</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-text-primary">Horizontal</td>
                  <td className="px-5 py-3 text-text-secondary">flexible To-dos</td>
                  <td className="px-5 py-3 text-text-secondary">viel Raum pro Tag</td>
                  <td className="px-5 py-3 text-text-secondary">Uhrzeiten schwerer darstellbar</td>
                  <td className="px-5 py-3 text-text-secondary">Wochenziele, Erledigungen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* -- Wochenübersicht mit Uhrzeiten -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wochenübersicht mit Uhrzeiten: Für Termine und Zeitblöcke
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Eine <strong className="text-text-primary">Wochenübersicht mit Uhrzeit</strong> ist
            ideal bei Schichtarbeit, Unterricht, Meetings und Zeitblocking. Nutze ein 30- oder
            60-Minuten-Raster, meist von 7 bis 22&nbsp;Uhr. Plane Pufferzeiten und feste
            Fokusblöcke ein, damit Termine nicht kollidieren.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Checkliste: Brauche ich eine Wochenübersicht mit Uhrzeit?</strong>
            <ul className="mt-2 space-y-1.5">
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>Habe ich mehrere Termine pro Tag?</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>Wechseln meine Zeiten häufig?</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>Plane ich in Zeitblöcken?</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>Brauche ich Puffer zwischen Terminen?</span>
              </li>
            </ul>
          </div>
        </div>

        {/* -- Wochenübersicht ohne Uhrzeiten -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wochenübersicht ohne Uhrzeiten: Für To-dos, Ziele und Routinen
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Eine Wochenübersicht ohne Uhrzeiten ist ideal für{" "}
            <strong className="text-text-primary">Aufgabenlisten</strong>, Habit-Tracking,
            Essensplan und Wochenziele. Nutze im Wochenplaner{" "}
            <strong className="text-text-primary">Top&nbsp;3</strong>, einen Wochenfokus und
            kurze Notizen. Bündle To-dos nach Kontext wie Zuhause, Büro oder unterwegs. So
            wird jede Wochenkalender Vorlage schnell scanbar.
          </p>
        </div>

        {/* -- PDF zum Ausdrucken -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender Wochenübersicht als PDF zum Ausdrucken: Welche Vorlagen wirklich passen
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du eine <strong className="text-text-primary">Kalender Wochenübersicht
            PDF</strong> suchst, entscheide zuerst, ob du eine undatierte oder datierte
            Vorlage brauchst: Undatiert bleibt flexibel, datiert spart dir Eintragungszeit.
            Achte auf ein <strong className="text-text-primary">KW-Feld</strong>, damit du jede
            Woche sofort zuordnen kannst.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Eine Übersicht und Beispiele findest du im{" "}
            <a href="/kalender-mit-wochen" className="text-accent hover:underline">
              Kalender mit Kalenderwochen zum Planen und Vergleichen
            </a>. Wähle das Layout passend zu deinem Alltag: Mit Uhrzeiten eignet sich die
            Wochenübersicht für Termine, ohne Uhrzeiten eher für To-dos und Prioritäten.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Beim Format zählt vor allem der Druck: <strong className="text-text-primary">DIN&nbsp;A4</strong>{" "}
            bietet mehr Platz, <strong className="text-text-primary">DIN&nbsp;A5</strong> ist
            kompakter. Drucke in Schwarzweiß für gute Lesbarkeit und nutze Farbe nur für
            Markierungen. Prüfe bei &bdquo;kostenlos&ldquo; immer die Lizenzangaben.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-6">
            <strong className="text-text-primary">Checkliste:</strong>{" "}
            <strong className="text-text-primary">Format</strong> (A4/A5) &rarr;{" "}
            <strong className="text-text-primary">Layout</strong> (hoch/quer) &rarr;{" "}
            <strong className="text-text-primary">Uhrzeiten</strong> (ja/nein) &rarr;{" "}
            <strong className="text-text-primary">KW-Feld</strong> (ja/nein) &rarr;{" "}
            <strong className="text-text-primary">Einsatz</strong> (Arbeit/Schule/Familie)
          </div>

          {/* DIN A4 oder A5 */}
          <h3 className="text-xl font-semibold mb-3">
            DIN A4 oder A5: Welches Format für eine Wochenübersicht?
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            DIN&nbsp;A4 bietet viel Platz für Termine, Aufgaben und Notizen. Ein{" "}
            <strong className="text-text-primary">DIN&nbsp;A4 Wochenplaner</strong> passt
            ideal auf den Schreibtisch und in den Haushalt. DIN&nbsp;A5 ist kompakter,
            leichter und praktisch für unterwegs, Ringbuch oder Reise. Querformat wirkt
            breiter, Hochformat eignet sich oft besser für Uhrzeiten.
          </p>
        </div>

        {/* -- KW in Apps anzeigen -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wie kann man Kalenderwochen anzeigen? (Google Kalender, Outlook, iPhone, Android)
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            In fast jedem Kalender ist die KW-Anzeige nur eine Option wie{" "}
            &bdquo;Kalenderwoche anzeigen&ldquo; oder &bdquo;Week numbers&ldquo;. So bekommst
            du schnell einen <strong className="text-text-primary">Kalenderwochen
            Überblick</strong>, auch ohne extra App.
          </p>

          {/* Platform checklists */}
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-6">
            <strong className="text-text-primary">Checklist: KW anzeigen nach Plattform</strong>
            <ul className="mt-2 space-y-2">
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>
                  <strong className="text-text-primary">Google Kalender (Web):</strong>{" "}
                  Einstellungen &rarr; Anzeigeoptionen &rarr; &bdquo;Wochenzahlen anzeigen&ldquo; aktivieren.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>
                  <strong className="text-text-primary">Google Kalender (App):</strong>{" "}
                  Menü &rarr; Einstellungen &rarr; Allgemein &rarr; &bdquo;Wochenzahlen anzeigen&ldquo;.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>
                  <strong className="text-text-primary">Outlook (Desktop):</strong>{" "}
                  Optionen &rarr; Kalender &rarr; Anzeigeoptionen &rarr; &bdquo;Wochennummern anzeigen&ldquo;.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>
                  <strong className="text-text-primary">Outlook (Web):</strong>{" "}
                  Einstellungen &rarr; Kalenderansicht &rarr; &bdquo;Wochennummern&ldquo; einschalten.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>
                  <strong className="text-text-primary">iPhone (iOS Kalender):</strong>{" "}
                  iPhone-Einstellungen &rarr; Kalender &rarr; &bdquo;Kalenderwochen&ldquo; aktivieren.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                <span>
                  <strong className="text-text-primary">Android:</strong>{" "}
                  Kalender-App &rarr; Einstellungen &rarr; &bdquo;Wochennummern&ldquo; aktivieren.
                </span>
              </li>
            </ul>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Achte auf Region und <strong className="text-text-primary">Wochenbeginn
            Montag</strong>. Sonst wirken KW verschoben oder fehlen.
          </p>

          {/* Google Kalender sub-section */}
          <h3 className="text-xl font-semibold mb-3">
            Kalenderwochen in Google Kalender anzeigen (Web und App)
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Im <strong className="text-text-primary">Google Kalender Kalenderwochen
            anzeigen</strong>: Öffne im Web die Einstellungen und aktiviere unter
            Ansicht/Optionen die Funktion &bdquo;Kalenderwochen anzeigen&ldquo;. In der App
            findest du die Option je nach Plattform unter Einstellungen &rarr; Allgemein oder
            Alternative Kalender.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm mb-6">
            <strong className="text-text-primary">Tipp:</strong> Die Oberfläche ändert sich
            häufig. Nutze die Suche in den Einstellungen und gib &bdquo;Woche&ldquo; oder
            &bdquo;week numbers&ldquo; ein.
          </div>

          {/* Outlook sub-section */}
          <h3 className="text-xl font-semibold mb-3">
            Kalenderwochen in Outlook anzeigen (Windows/Mac/Web)
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Aktiviere die Option für <strong className="text-text-primary">Wochennummern
            Outlook</strong> in den Einstellungen. Achte auch auf Arbeitswoche und Wochenbeginn
            (meist Montag), damit alle im Team gleich planen.
          </p>
          <ul className="space-y-2 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Outlook Windows:</strong> Datei &rarr; Optionen &rarr; Kalender &rarr; &bdquo;Wochennummern anzeigen&ldquo; &rarr; OK.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Outlook Mac:</strong> Outlook &rarr; Einstellungen &rarr; Kalender &rarr; &bdquo;Wochennummern anzeigen&ldquo; &rarr; Wochenbeginn Montag.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Outlook Web:</strong> Zahnrad &rarr; Kalender &rarr; Ansicht &rarr; &bdquo;Wochennummern&ldquo; aktivieren &rarr; Wochenbeginn setzen.
              </span>
            </li>
          </ul>
        </div>

        {/* -- App vs. Papier Vergleich -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wochenkalender-App oder Papier: Entscheidungshilfe für die passende Wochenübersicht
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Ein <strong className="text-text-primary">Kalender mit KW App</strong> bringt dir
            Kalenderwochen automatisch ins Blickfeld, synchronisiert Termine über Geräte
            hinweg und erinnert dich zuverlässig. Trotzdem hat Papier einen Vorteil: Es schafft
            Fokus. Du siehst deine Woche auf einen Blick und behältst deine Planung präsent.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Für viele funktioniert <strong className="text-text-primary">Hybrid</strong> am besten:
            Termine bleiben digital, damit Sync und Reminder sitzen. Wochenziele und To-dos
            landen als <strong className="text-text-primary">Kalender mit Wochenübersicht</strong>{" "}
            auf Papier.
          </p>

          {/* App vs. Papier table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Option</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Pro</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Contra</th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">Typischer Use-Case</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 font-medium text-text-primary">Papier</td>
                  <td className="px-5 py-3 text-text-secondary">sichtbar, haptisch, schnell ausgefüllt</td>
                  <td className="px-5 py-3 text-text-secondary">kein Sync, keine Reminder</td>
                  <td className="px-5 py-3 text-text-secondary">Wochenplanung am Schreibtisch</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-5 py-3 font-medium text-text-primary">App</td>
                  <td className="px-5 py-3 text-text-secondary">Sync, Erinnerungen, Teilen, mobil</td>
                  <td className="px-5 py-3 text-text-secondary">Ablenkung, Setup-Aufwand</td>
                  <td className="px-5 py-3 text-text-secondary">Termine, Team-Absprachen, unterwegs</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-text-primary">Hybrid</td>
                  <td className="px-5 py-3 text-text-secondary">Fokus + digitale Automatik</td>
                  <td className="px-5 py-3 text-text-secondary">doppelte Pflege</td>
                  <td className="px-5 py-3 text-text-secondary">Termine digital, Ziele &amp; To-dos analog</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* -- 7 praktische Tipps -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender Wochenübersicht richtig nutzen: 7 praktische Tipps für mehr Überblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du deine <strong className="text-text-primary">Kalender Wochenübersicht
            nutzen</strong> willst, starte jede Woche mit 5 Minuten: Termine prüfen und drei
            Ziele setzen. Plane bewusst Zeitpuffer ein und schätze deine Kapazität
            realistisch. Nutze Farbcodes sparsam, ideal sind 4&ndash;6 Labels. Bündle
            wiederkehrende Aufgaben im Batch und gib ihnen feste Slots.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Checkliste &bdquo;Wochenplanung in 10 Minuten&ldquo;</strong>
            <ol className="mt-2 space-y-1.5 list-none">
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">1.</span>
                <span>Woche öffnen</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">2.</span>
                <span>Termine checken</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">3.</span>
                <span>Top-3-Ziele setzen</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">4.</span>
                <span>Puffer blocken</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">5.</span>
                <span>Farben begrenzen</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">6.</span>
                <span>Batching-Slots setzen</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">7.</span>
                <span>Rückblick &amp; aufräumen</span>
              </li>
            </ol>
          </div>
        </div>

        {/* -- Häufige Fehler -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalenderwochen und Wochenübersicht: Häufige Fehler und wie man sie vermeidet
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mit einem <strong className="text-text-primary">Kalenderwochen Überblick</strong>{" "}
            passieren oft dieselben Fehler &ndash; vor allem, wenn mehrere Personen planen.
            Häufig denkt jemand beim Wochenstart an Sonntag, im Team gilt aber Montag.
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed mb-4">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Wochenstart falsch:</strong>{" "}
                Legt euch auf den ISO-Standard fest und startet eure KW Planung konsequent am Montag.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Zu viele Aufgaben:</strong>{" "}
                Prüfe vorher realistisch, wie viel Kapazität wirklich frei ist &ndash; inklusive
                Meetings, Abstimmungen und Routineaufgaben.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">Kein Puffer:</strong>{" "}
                Definiert feste Standardpuffer (z.&nbsp;B. für Support, Rückfragen oder spontane
                Änderungen) und plant sie von Anfang an mit ein.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">&bull;</span>
              <span>
                <strong className="text-text-primary">KW und Datum gemischt:</strong>{" "}
                Legt eine klare Team-Regel fest, z.&nbsp;B. &bdquo;intern immer KW, extern immer
                Datum&ldquo; &ndash; und bleibt dabei konsequent.
              </span>
            </li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Details findest du bei{" "}
            <a href="/faq" className="text-accent hover:underline">
              Antworten auf häufige Fragen zu Kalenderwochen
            </a>{" "}
            und{" "}
            <a href="/wie-viele-wochen-hat-ein-jahr" className="text-accent hover:underline">
              wie viele Wochen ein Jahr tatsächlich hat (52 oder 53)
            </a>.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Schnell-Fix:</strong>{" "}
            Wochenbeginn falsch &rarr; ISO/Montag festlegen. Zu viele Tasks &rarr; Kapazität
            prüfen. Kein Puffer &rarr; Standardpuffer setzen. KW/Datum gemischt &rarr; eine
            Regel vereinbaren.
          </div>
        </div>

        {/* -- Download/Vorlage erstellen CTA -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Kalender Wochenübersicht downloaden oder Vorlage erstellen: Nächste Schritte
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Wenn du jetzt loslegen willst, wähle zuerst die passende{" "}
            <strong className="text-text-primary">Vorlage Wochenkalender</strong> &ndash; so
            passt deine Planung sofort zu deinem Alltag. Für den Schreibtisch eignet sich
            meist A4, unterwegs funktionieren A5 oder ein Clipboard-Format besser.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Planst du viele Termine, nimm eine Version mit Uhrzeit. Für To-dos reicht eine
            Variante ohne Uhrzeit. Arbeitest du nach Kalenderwochen, wähle unbedingt eine
            Vorlage mit KW-Feld. Nutzt du eine App, aktiviere dort die KW-Anzeige, damit
            jede Woche eindeutig bleibt.
          </p>
          <div className="bg-surface-secondary border border-border rounded-xl p-4 text-sm">
            <strong className="text-text-primary">Vorlage Wochenkalender: Jetzt starten &ndash; Mini-Checkliste</strong>
            <ol className="mt-2 space-y-1.5 list-none">
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">1.</span>
                <span>Layout wählen (A4/A5, mit/ohne Uhrzeit, mit KW-Feld)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">2.</span>
                <span>KW-Anzeige in deiner App aktivieren</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">3.</span>
                <span>Vorlage drucken oder digitales Setup abschließen</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-semibold shrink-0">4.</span>
                <span>Wochenroutine festlegen (z.&nbsp;B. Planung am Sonntagabend)</span>
              </li>
            </ol>
          </div>
        </div>

        {/* -- Abschlusstext -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-3">
            Zusammenfassung &amp; Ausblick
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Mit einer <strong className="text-text-primary">Kalender Wochenübersicht</strong>{" "}
            triffst du bessere Entscheidungen, wenn du in drei Schritten vorgehst: Erst die
            aktuelle KW schnell prüfen (aktuell <strong className="text-text-primary">KW&nbsp;{kw.weekNumber}</strong>)
            und in App oder Kalender die KW-Anzeige nach ISO&nbsp;8601 aktivieren, dann das
            passende Layout wählen und zum Schluss die richtige Vorlage festlegen. Brauchst
            du stundenweise Termine, passt meist eine vertikale Wochenübersicht mit Uhrzeiten;
            für Aufgaben, Familie oder Team sind horizontale Spalten oft übersichtlicher.
          </p>
        </div>

        {/* -- FAQ Accordion -- */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            Häufig gestellte Fragen
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

        {/* -- Abschluss-Links -- */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {kw.year} &rarr;
          </a>
          <a href="/kalender-mit-wochen" className="text-accent hover:underline">
            Kalender mit Kalenderwochen &rarr;
          </a>
          <a href="/woche-jahr" className="text-accent hover:underline">
            Woche &amp; Jahr &rarr;
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
 * SEO Audit Checklist – app/kalender-wochenuebersicht/page.tsx (Cluster 6 + Cluster 2)
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Kalender Wochenübersicht: aktuelle KW & Layout wählen"
 * [x] Meta Description: dynamisch mit KW-Nummer und Jahr
 * [x] Canonical URL: https://aktuellekw.de/kalender-wochenuebersicht
 * [x] OG-Title + OG-Description + OG-URL
 * [x] Twitter Card: summary_large_image
 * [x] H1: "Kalender Wochenübersicht: Kalenderwochen im Überblick, Layouts & Vorlagen"
 * [x] Schema.org: BreadcrumbList (2 Ebenen: Startseite → Kalender Wochenübersicht)
 * [x] Schema.org: FAQPage (8 Fragen)
 * [x] Cluster 6 SEO-Content: Definition, Layout-Vergleich, PDF-Vorlagen, App-Einrichtung
 * [x] Cluster 2 SEO-Content: KW-Jahresübersicht (kompakte Tabelle), 52/53-KW-Erklärung
 * [x] Semantische HTML-Tabellen (Layout-Vergleich, App vs Papier, KW-Übersicht)
 * [x] FAQ (8 Fragen): KW aktuell, KW anzeigen, KW vs Arbeitswoche, 53 KW, Layout,
 *     A4-Druck, PDF mit Uhrzeiten, ISO-8601
 * [x] Cross-Links: Startseite (/), Kalenderwoche (/kalenderwoche),
 *     Kalender mit Wochen (/kalender-mit-wochen), Woche & Jahr (/woche-jahr),
 *     FAQ (/faq), Welche KW (/welche-kalenderwoche-haben-wir),
 *     Kalenderwochen 2026 (/kalenderwochen/2026),
 *     Wie viele Wochen (/wie-viele-wochen-hat-ein-jahr)
 * [x] Cluster 6 Keywords: Kalender Wochenübersicht, Wochenkalender, Wochenplaner,
 *     Wochenübersicht PDF, Vorlage Wochenkalender, DIN A4, Uhrzeiten
 * [x] Cluster 2 Keywords: Kalenderwochen Überblick, KW Jahresübersicht, KW 2026
 * [x] Dynamische Platzhalter: CURRENT_KW, CURRENT_DATE_DISPLAY, KW_START/END, WEEKS_IN_YEAR
 * [x] Compact KW table: first 5 + last 3 rows with link to full year overview
 * [x] revalidate = 3600 (stündliche ISR)
 * [x] Server Component (no "use client")
 * [ ] TODO: OG-Image erstellen (1200×630px) für /kalender-wochenuebersicht
 * [ ] TODO: hreflang für AT/CH ergänzen wenn mehrsprachig ausgebaut
 */
