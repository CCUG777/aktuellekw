import type { Metadata } from "next";
import Link from "next/link";
import {
  getSommerzeitDatum,
  getWinterzeitDatum,
  getZeitumstellungenMultiYear,
  formatDateLongDE,
  daysUntil,
} from "@/lib/zeitumstellung";
import { getISOWeekNumber } from "@/lib/kw";
import LastUpdated from "@/components/LastUpdated";

export const revalidate = 86400;

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const wz = getWinterzeitDatum(2026);
  const title = "Winterzeit 2026: Wann wird die Uhr zur\u00FCckgestellt?";
  const description = `Winterzeit 2026: Am ${wz.dateFormatted} wird die Uhr von ${wz.timeBefore} auf ${wz.timeAfter} Uhr zur\u00FCckgestellt. Datum, Uhr umstellen (vor oder zur\u00FCck), Ger\u00E4te-Anleitung & EU-Update.`;

  return {
    title,
    description,
    alternates: { canonical: "https://aktuellekw.de/winterzeit" },
    openGraph: {
      title,
      description,
      url: "https://aktuellekw.de/winterzeit",
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

/* ── Page ──────────────────────────────────────────────────────── */

export default function WinterzeitPage() {
  const year = 2026;
  const today = new Date();
  const wz = getWinterzeitDatum(year);
  const sz = getSommerzeitDatum(year);
  const wz25 = getWinterzeitDatum(2025);
  const sz25 = getSommerzeitDatum(2025);
  const wz27 = getWinterzeitDatum(2027);
  const sz27 = getSommerzeitDatum(2027);
  const multiYear = getZeitumstellungenMultiYear(2024, 2030);
  const daysLeft = daysUntil(wz.date, today);
  const kwNr = getISOWeekNumber(wz.date);

  /* ── JSON-LD ── */
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://aktuellekw.de" },
      { "@type": "ListItem", position: 2, name: "Zeitumstellung 2026", item: "https://aktuellekw.de/zeitumstellung-2026" },
      { "@type": "ListItem", position: 3, name: "Winterzeit 2026", item: "https://aktuellekw.de/winterzeit" },
    ],
  };

  const faqItems = [
    {
      q: "Wann wird 2026 auf Winterzeit umgestellt?",
      a: `Die Umstellung auf Winterzeit 2026 ist in Deutschland in der Nacht von Samstag auf Sonntag, dem ${wz.dateFormatted}. Dann endet die Sommerzeit (MESZ) und es gilt wieder die Winterzeit (MEZ). Merke: Winterzeit-Umstellung ist immer am letzten Sonntag im Oktober.`,
    },
    {
      q: "Wird die Uhr zur Winterzeit 2026 vor oder zur\u00FCckgestellt?",
      a: "Zur Winterzeit 2026 stellst du die Uhr zur\u00FCck. Konkret wechselst du von Sommerzeit (MESZ) auf Winterzeit (MEZ). Eselsbr\u00FCcke: Im Herbst stellst du die Zeit zur\u00FCck, im Fr\u00FChjahr vor.",
    },
    {
      q: "Um wie viel Uhr wird die Zeit umgestellt (Winterzeit 2026)?",
      a: `Die Zeitumstellung auf Winterzeit 2026 passiert am ${wz.dateFormatted} um 03:00 Uhr (MESZ). Dann wird die Uhr um eine Stunde zur\u00FCckgestellt auf 02:00 Uhr (MEZ). Dadurch gibt es die Stunde zwischen 02:00 und 03:00 Uhr zweimal.`,
    },
    {
      q: "Warum hei\u00DFt die normale Zeit \u201EWinterzeit\u201C (MEZ)?",
      a: "\u201EWinterzeit\u201C meint die Normalzeit, also die Mitteleurop\u00E4ische Zeit (MEZ), die ohne Sommerzeit gilt. Der Begriff ist vor allem eine Abgrenzung zur Sommerzeit (MESZ), bei der die Uhr im Fr\u00FChjahr vorgestellt wird. Im Winterhalbjahr bleibt es bei der MEZ, deshalb hat sich \u201EWinterzeit\u201C eingeb\u00FCrgert.",
    },
    {
      q: "Stellen Smartphones und Funkuhren automatisch auf Winterzeit um?",
      a: "Meist ja: Smartphones stellen die Winterzeit automatisch um, wenn \u201EAutomatische Zeit/Zeitzone\u201C aktiviert ist und das Ger\u00E4t die korrekten Zeitzonen-Regeln nutzt. Funkuhren stellen sich in der Regel ebenfalls automatisch um, sobald sie das Funksignal empfangen. Wenn es nicht klappt, pr\u00FCfe Zeitzone, Automatik-Einstellung und starte das Ger\u00E4t neu.",
    },
    {
      q: "Gibt es in der Winterzeit wirklich eine Stunde mehr Schlaf?",
      a: "Du bekommst durch die Umstellung auf Winterzeit eine Stunde \u201Egeschenkt\u201C, weil die Uhr zur\u00FCckgestellt wird. Ob du wirklich eine Stunde mehr Schlaf hast, h\u00E4ngt davon ab, ob du deinen Schlafrhythmus beibehalten oder fr\u00FCher aufstehen willst. Plane am Umstellungssonntag etwas Puffer, besonders bei Terminen am Morgen.",
    },
    {
      q: "Wird die Zeitumstellung in Deutschland 2026 abgeschafft?",
      a: "F\u00FCr 2026 ist in Deutschland keine fest beschlossene Abschaffung der Zeitumstellung umgesetzt. Solange es keine verbindliche gesetzliche Regelung gibt, gilt weiterhin der Wechsel zwischen Sommerzeit und Winterzeit. Pr\u00FCfe kurz vor Herbst 2026 aktuelle Infos von offiziellen Stellen (EU/Deutschland).",
    },
    {
      q: "Gilt die Winterzeit-Umstellung in ganz Europa?",
      a: "Die Winterzeit-Umstellung gilt in vielen europ\u00E4ischen L\u00E4ndern, besonders in der EU, meist nach dem gleichen Terminprinzip (letzter Sonntag im Oktober). Trotzdem ist nicht jedes Land in Europa dabei, und manche haben eigene Regeln. Wenn du reist, pr\u00FCfe die Zeitumstellung f\u00FCr dein Zielland und die jeweilige Zeitzone.",
    },
  ];

  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const eventLD = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Winterzeit 2026 \u2013 Uhren zur\u00FCckstellen",
    startDate: `${wz.dateISO}T03:00:00+02:00`,
    endDate: `${wz.dateISO}T02:00:00+01:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Deutschland",
      address: { "@type": "PostalAddress", addressCountry: "DE" },
    },
    description: `Uhren werden am ${wz.dateFormatted} von ${wz.timeBefore} auf ${wz.timeAfter} Uhr zur\u00FCckgestellt (MEZ).`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLD) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-secondary">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link href="/" className="hover:text-text-primary transition-colors">Startseite</Link>
              <span className="mx-1" aria-hidden="true">/</span>
            </li>
            <li>
              <Link href="/zeitumstellung-2026" className="hover:text-text-primary transition-colors">Zeitumstellung 2026</Link>
              <span className="mx-1" aria-hidden="true">/</span>
            </li>
            <li aria-current="page" className="text-text-primary font-medium">
              Winterzeit 2026
            </li>
          </ol>
        </nav>

        {/* ── Hero ── */}
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-accent mb-3">
            Uhren zur&uuml;ckstellen
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Winterzeit 2026
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Datum, Uhr umstellen (vor oder zur&uuml;ck) und alle Regeln zur Zeitumstellung.
          </p>

          {/* Hero Card */}
          <div className="bg-card-bg border border-border rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-xs uppercase tracking-widest text-accent mb-2">Beginn Winterzeit</p>
            <p className="text-3xl font-bold mb-1">{formatDateLongDE(wz.date)}</p>
            <p className="text-lg text-text-secondary">
              {wz.timeBefore} &rarr; {wz.timeAfter} Uhr <span className="text-accent font-medium">(Uhr zur&uuml;ck)</span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-text-secondary">
              <span>KW&nbsp;{kwNr}</span>
              <span>&middot;</span>
              <span>{wz.timezone} ({wz.utcOffset})</span>
              <span>&middot;</span>
              <span>{wz.dayName}</span>
            </div>
            {daysLeft > 0 && (
              <p className="mt-3 text-sm text-text-secondary">
                Noch <strong className="text-text-primary">{daysLeft} Tage</strong> bis zur Winterzeit
              </p>
            )}
          </div>
        </header>

        {/* ── Einleitungstext ── */}
        <section className="mb-12 text-sm text-text-secondary leading-relaxed space-y-4">
          <p>
            <strong className="text-text-primary">Winterzeit 2026</strong> beginnt in Deutschland in der
            Nacht von Samstag, 24.10.2026, auf Sonntag, {wz.dateFormatted}: Du stellst die
            Uhr <strong className="text-text-primary">eine Stunde zur&uuml;ck</strong> &ndash;{" "}
            <strong className="text-text-primary">3:00 wird 2:00&nbsp;Uhr</strong>. Damit wechselst du von
            der Sommerzeit (MESZ) zur&uuml;ck zur <strong className="text-text-primary">Normalzeit MEZ</strong>,
            die viele im Alltag einfach &bdquo;Winterzeit&ldquo; nennen.
          </p>
          <p>
            Du bekommst hier eine kompakte Entscheidungs-Infobox &bdquo;Vor oder zur&uuml;ck?&ldquo;,
            plus Schritt-f&uuml;r-Schritt-Anleitungen f&uuml;rs Umstellen auf Smartphone, Funkuhr, im Auto und
            am Backofen. Au&szlig;erdem kl&auml;ren wir kurz, was Winterzeit genau bedeutet, welche Folgen
            die Umstellung f&uuml;r Schlaf, Gesundheit, Tageslicht und Arbeit haben kann und wie der
            aktuelle Stand zur m&ouml;glichen Abschaffung der Zeitumstellung in EU/Deutschland aussieht.
          </p>
        </section>

        {/* ── Winterzeit 2026: Wann ist die Zeitumstellung? ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Winterzeit 2026: Wann ist die Zeitumstellung in Deutschland?</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Die Zeitumstellung auf <strong className="text-text-primary">Winterzeit 2026</strong> in
              Deutschland findet am Sonntag, <strong className="text-text-primary">{wz.dateFormatted}</strong>,
              statt. In der Nacht von Samstag auf Sonntag stellst du die Uhr um:
              Um <strong className="text-text-primary">3:00&nbsp;Uhr</strong> springt die Zeit zur&uuml;ck
              auf <strong className="text-text-primary">2:00&nbsp;Uhr</strong>. Dadurch gewinnst du eine Stunde.
            </p>
            <p>
              Die Umstellung gilt bundesweit. Viele Smartphones und Funkuhren passen sich automatisch
              an, analoge Uhren stellst du manuell nach.
            </p>
          </div>

          {/* Fact-Box */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-6">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Winterzeit 2026 auf einen Blick</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-text-secondary">Datum:</span> <span className="text-text-primary font-medium">Sonntag, {wz.dateFormatted}</span></div>
              <div><span className="text-text-secondary">Nacht:</span> <span className="text-text-primary font-medium">Samstag &rarr; Sonntag</span></div>
              <div><span className="text-text-secondary">Uhrzeit:</span> <span className="text-text-primary font-medium">{wz.timeBefore} &rarr; {wz.timeAfter} Uhr (1h zur&uuml;ck)</span></div>
              <div><span className="text-text-secondary">Zeitzone:</span> <span className="text-text-primary font-medium">MEZ statt MESZ</span></div>
              <div className="col-span-2"><span className="text-text-secondary">Merksatz:</span> <span className="text-text-primary font-medium">Im Oktober stellst du die Uhr zur&uuml;ck.</span></div>
            </div>
          </div>

          <p className="text-sm text-text-secondary">
            Alle Termine f&uuml;r das Jahr findest du hier:{" "}
            <Link href="/zeitumstellung-2026" className="text-accent hover:underline">Zeitumstellung 2026 &ndash; alle Termine im &Uuml;berblick</Link>.
          </p>
        </section>

        {/* ── Vor oder zurück ── */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-3">Uhr zur&uuml;ckstellen 2026: Wird die Zeit vor oder zur&uuml;ckgestellt?</h3>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-4">
            <p>
              Zur <strong className="text-text-primary">Winterzeit</strong> stellst du die
              Uhr <strong className="text-text-primary">eine Stunde zur&uuml;ck</strong>. Im Oktober 2026
              wird also aus <strong className="text-text-primary">3:00&nbsp;Uhr</strong> wieder{" "}
              <strong className="text-text-primary">2:00&nbsp;Uhr</strong> &ndash; du gewinnst eine Stunde und
              kannst l&auml;nger schlafen.
            </p>
          </div>

          {/* Mini-Check */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Mini-Check: &bdquo;Vor oder zur&uuml;ck?&ldquo;</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Herbst:</strong> zur&uuml;ck (&minus;1&nbsp;Stunde)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Fr&uuml;hling:</strong> vor (+1&nbsp;Stunde)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Oktober:</strong> 3:00 &rarr; 2:00</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Was passiert bei der Umstellung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Was passiert bei der Umstellung auf Winterzeit?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">+1h</p>
              <p className="text-sm font-medium">L&auml;ngere Nacht</p>
              <p className="text-xs text-text-secondary mt-1">Die Nacht vom 24. auf 25.&nbsp;Oktober 2026 ist eine Stunde l&auml;nger</p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">MEZ</p>
              <p className="text-sm font-medium">Normalzeit</p>
              <p className="text-xs text-text-secondary mt-1">MESZ (UTC+2) wechselt zur&uuml;ck zu MEZ (UTC+1)</p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">&minus;1h</p>
              <p className="text-sm font-medium">Fr&uuml;her dunkel</p>
              <p className="text-xs text-text-secondary mt-1">Abends wird es eine Stunde fr&uuml;her dunkel</p>
            </div>
          </div>
        </section>

        {/* ── Was bedeutet Winterzeit? MEZ vs. MESZ ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Was bedeutet &bdquo;Winterzeit&ldquo; genau? Unterschied zwischen Winterzeit (MEZ) und Sommerzeit (MESZ)</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Mit &bdquo;<strong className="text-text-primary">Winterzeit</strong>&ldquo; meinen viele in
              Deutschland die <strong className="text-text-primary">Normalzeit</strong>: die Mitteleurop&auml;ische
              Zeit (<strong className="text-text-primary">MEZ</strong>,{" "}
              <strong className="text-text-primary">UTC+1</strong>). Streng genommen beschreibt
              &bdquo;Winterzeit&ldquo; nicht die Jahreszeit, sondern die Standardzeit ohne Sommerzeit.
              Der Begriff ist trotzdem verbreitet, weil im Herbst die Uhr von der Sommerzeit wieder auf MEZ
              zur&uuml;ckgestellt wird.
            </p>
            <p>
              Die Sommerzeit hei&szlig;t Mitteleurop&auml;ische Sommerzeit (<strong className="text-text-primary">MESZ</strong>,{" "}
              <strong className="text-text-primary">UTC+2</strong>). Der Unterschied zwischen MEZ und
              MESZ betr&auml;gt <strong className="text-text-primary">eine Stunde</strong>. Wann 2026 auf
              Sommerzeit (MESZ) umgestellt wird, erf&auml;hrst du unter{" "}
              <Link href="/sommerzeit" className="text-accent hover:underline">Sommerzeit 2026</Link>.
            </p>
          </div>

          {/* Vergleichstabelle */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Vergleich</th>
                  <th className="py-3 pr-4 font-semibold">MEZ (Normalzeit/Winterzeit)</th>
                  <th className="py-3 font-semibold">MESZ (Sommerzeit)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">UTC-Offset</td>
                  <td className="py-3 pr-4 font-semibold">UTC+1</td>
                  <td className="py-3 font-semibold">UTC+2</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Zeitraum (grob)</td>
                  <td className="py-3 pr-4">Herbst bis Fr&uuml;hjahr</td>
                  <td className="py-3">Fr&uuml;hjahr bis Herbst</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Umstellung</td>
                  <td className="py-3 pr-4">Uhr zur&uuml;ck (&minus;1&nbsp;h)</td>
                  <td className="py-3">Uhr vor (+1&nbsp;h)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Typische Auswirkungen</td>
                  <td className="py-3 pr-4">Morgens fr&uuml;her hell, abends fr&uuml;her dunkel</td>
                  <td className="py-3">Morgens sp&auml;ter hell, abends l&auml;nger hell</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Uhr richtig umstellen: Anleitung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">So stellst du die Uhr richtig um: Anleitung f&uuml;r Smartphone, Funkuhr, Auto, Backofen</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Viele Ger&auml;te erledigen die <strong className="text-text-primary">Zeitumstellung automatisch</strong>:{" "}
              <strong className="text-text-primary">Smartphones</strong>,{" "}
              <strong className="text-text-primary">Smartwatches</strong>,{" "}
              <strong className="text-text-primary">PCs</strong> und viele{" "}
              <strong className="text-text-primary">Funkuhren</strong> beziehen die Uhrzeit &uuml;ber Internet,
              Mobilfunk oder Funksignal. Du musst dann nichts tun.
            </p>
            <p>
              Pr&uuml;fe nach dem Wechsel kurz, ob Datum und Uhrzeit stimmen &ndash; zum Beispiel
              hier: <Link href="/datum-heute" className="text-accent hover:underline">heutiges Datum und aktuelle Uhrzeit pr&uuml;fen</Link>.
              So siehst du sofort, ob ein Ger&auml;t nachgeht oder vorgeht.
            </p>
          </div>

          {/* Manuelle Anleitung */}
          <h3 className="text-xl font-semibold mb-3">Manuell umstellen: Schritt-f&uuml;r-Schritt</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Manche Ger&auml;te stellen nicht automatisch um &ndash; etwa Auto, Backofen, Mikrowelle oder einfache Wecker.
          </p>

          <div className="bg-card-bg border border-border rounded-2xl p-5 mb-6">
            <p className="text-sm font-semibold mb-3">Anleitung: Uhr auf Winterzeit umstellen</p>
            <ol className="text-sm text-text-secondary space-y-2 list-decimal list-inside">
              <li>&Ouml;ffne die <strong className="text-text-primary">Uhrzeit-Einstellungen</strong> am Ger&auml;t.</li>
              <li>Deaktiviere <strong className="text-text-primary">&bdquo;Automatisch&ldquo;</strong> (falls aktiviert).</li>
              <li>Stelle die Uhr <strong className="text-text-primary">eine Stunde zur&uuml;ck</strong> und best&auml;tige.</li>
              <li>Aktiviere <strong className="text-text-primary">&bdquo;Automatisch&ldquo;</strong> wieder, wenn du es sonst nutzt.</li>
            </ol>
            <p className="text-xs text-text-secondary mt-3">Merksatz: Winterzeit = eine Stunde zur&uuml;ck, dann speichern.</p>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            Kontrolliere besonders <strong className="text-text-primary">Wecker</strong>,{" "}
            <strong className="text-text-primary">Terminkalender</strong> und{" "}
            <strong className="text-text-primary">Erinnerungen</strong>. Vergleiche anschlie&szlig;end die
            Uhrzeit auf mehreren Ger&auml;ten, damit im Alltag &uuml;berall dieselbe Zeit angezeigt wird.
          </p>

          {/* Geräte-Checkliste */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-3">Ger&auml;te-Check nach der Zeitumstellung</p>
              <ul className="text-sm text-text-secondary space-y-2">
                {["Smartphone", "Smartwatch", "PC/Laptop", "Auto", "Backofen/Mikrowelle", "Wanduhr", "Wecker", "Kamera"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-3">Automatisch umstellen: So klappt&rsquo;s</p>
              <div className="text-sm text-text-secondary space-y-3">
                <p>
                  Smartphones und Computer stellen die Zeitumstellung automatisch um, sobald
                  du <strong className="text-text-primary">&bdquo;Uhrzeit automatisch einstellen&ldquo;</strong> aktiviert
                  hast und die Zeitzone stimmt.
                </p>
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 text-xs">
                  <p className="font-semibold text-text-primary mb-1">Wenn die Uhr nicht umstellt:</p>
                  <p>Pr&uuml;fe Zeitzone, aktiviere &bdquo;Datum/Uhrzeit automatisch&ldquo;, kontrolliere Standort bzw. Funkempfang und starte das Ger&auml;t neu.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Analoge/Digitale Uhr umstellen ── */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-3">Manuelle Zeitumstellung: Schritt-f&uuml;r-Schritt (analog &amp; digital)</h3>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-4">
            <p>
              Im Oktober gilt bei der Winterzeit-Umstellung die einfache Regel:{" "}
              <strong className="text-text-primary">Uhr zur&uuml;ckstellen</strong> &ndash; von{" "}
              <strong className="text-text-primary">3:00 auf 2:00</strong>. So bekommst du eine Stunde
              extra Schlaf oder mehr Freizeit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-2">Analoge Uhr umstellen</p>
              <p className="text-sm text-text-secondary">
                Zieh die Krone heraus und dreh die Zeiger kontrolliert <strong className="text-text-primary">eine Stunde zur&uuml;ck</strong>.
                Behalte das Datum im Blick, falls es beim Zur&uuml;ckdrehen umspringt.
              </p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-2">Digitale Uhr umstellen</p>
              <p className="text-sm text-text-secondary">
                &Ouml;ffne im Men&uuml; &bdquo;Zeit/Clock&ldquo; die Uhrzeit, stell die
                Stunde auf <strong className="text-text-primary">&minus;1</strong> und speichere.
                Kontrolliere danach Wecker und Timer.
              </p>
            </div>
          </div>
        </section>

        {/* ── Eselsbrücke ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Eselsbr&uuml;cke: Winterzeit vor oder zur&uuml;ck?</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Wenn du jedes Jahr wieder gr&uuml;belst, hilft dir eine einfache Eselsbr&uuml;cke.
              Der Merksatz lautet: <strong className="text-text-primary">&bdquo;Im Herbst stellt man die
              Gartenst&uuml;hle zur&uuml;ck&ldquo;</strong>. Damit merkst du dir sofort, dass du zur
              Winterzeit die Uhr <strong className="text-text-primary">zur&uuml;ckstellen</strong> musst.
            </p>
            <p>
              F&uuml;r alle mit Englischbezug passt auch: <strong className="text-text-primary">&bdquo;Spring
              forward, fall back&ldquo;</strong>. Im Fr&uuml;hling geht es vor, im Herbst zur&uuml;ck.
              So vermeidest du Verwechslungen, wenn du beide Begriffe im Kopf hast.
            </p>
            <p>
              Praktisch bedeutet das: Du bekommst eine Stunde geschenkt. Viele empfinden die Winterzeit
              deshalb als &bdquo;l&auml;nger schlafen&ldquo;, weil du am Umstellungstag morgens eine Stunde mehr hast.
            </p>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5">
            <p className="text-sm text-text-primary font-medium text-center">
              &bdquo;Im Herbst stellt man die Gartenst&uuml;hle zur&uuml;ck&ldquo; &ndash; Beispiel: 03:00 &rarr; 02:00
            </p>
          </div>
        </section>

        {/* ── Auswirkungen ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Auswirkungen der Winterzeit: Schlaf, Gesundheit, Tageslicht und Arbeit</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Viele merken nach der Umstellung sofort, was bei der Winterzeit passiert: Du bist
              m&uuml;der, obwohl du &bdquo;eine Stunde geschenkt&ldquo; bekommst. Deine{" "}
              <strong className="text-text-primary">innere Uhr</strong> stellt sich nicht sofort um.
              Deshalb schl&auml;fst du oft leichter oder wachst fr&uuml;her auf. Auch ein sp&auml;terer
              Einschlafzeitpunkt ist typisch.
            </p>
            <p>
              Der Effekt beim Tageslicht ist klar: Morgens wird es fr&uuml;her hell, abends daf&uuml;r
              schneller dunkel. Das kann sich gut anf&uuml;hlen. Es kann aber auch deine Gesundheit in
              der Winterzeit beeinflussen, wenn dir abends Licht und Bewegung fehlen.
            </p>
          </div>

          {/* Checkliste */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Checkliste: Gut durch die Zeitumstellung</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Schlaf:</strong> 2&ndash;3 Tage vorher 15&ndash;20 Minuten fr&uuml;her ins Bett</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Licht:</strong> Morgens direkt ans Tageslicht, Vorh&auml;nge auf</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Bewegung:</strong> Kurze Runde drau&szlig;en, besonders am Vormittag</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Bildschirmzeit:</strong> Abends reduzieren, Nachtmodus nutzen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Kinder:</strong> Rhythmus schrittweise anpassen, feste Abendroutine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Schichtarbeit:</strong> Schlafzeiten planen, Koffein und Alkohol am Abend reduzieren</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Sommerzeit Umstellung: 2 auf 3 ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Warum wird bei der Zeitumstellung von 2 auf 3&nbsp;Uhr umgestellt?</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4">
            <p>
              Bei der <strong className="text-text-primary">Sommerzeit-Umstellung</strong> im Fr&uuml;hling
              springt die Uhr nachts von 2:00&nbsp;Uhr direkt auf 3:00&nbsp;Uhr. Deshalb fehlt diese Stunde
              im Kalender &ndash; sie wird praktisch &bdquo;&uuml;bersprungen&ldquo;.
            </p>
            <p>
              Der Hintergrund: Die Regelung sollte daf&uuml;r sorgen, dass abends l&auml;nger Tageslicht zur
              Verf&uuml;gung steht. Im Herbst l&auml;uft es umgekehrt: Dann wird die Uhr von 3:00&nbsp;Uhr
              wieder auf 2:00&nbsp;Uhr zur&uuml;ckgestellt.
            </p>
          </div>
        </section>

        {/* ── Abschaffung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Zeitumstellung abschaffen? Stand in Deutschland und der EU (Update 2026)</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Wird die <strong className="text-text-primary">Zeitumstellung 2026</strong> abgeschafft? Politisch
              ist das weiter offen. In der EU gab es wiederholt Initiativen, die Umstellung zu beenden. Damit
              sich tats&auml;chlich etwas &auml;ndert, m&uuml;ssen sich die Mitgliedstaaten auf eine dauerhafte
              Regel einigen &ndash; also auf Sommerzeit oder Winterzeit. Solange diese Entscheidung ausbleibt,
              bleibt auch die Umsetzung in Europa blockiert.
            </p>
          </div>

          {/* Faktenbox */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Kurzstatus Abschaffung (Stand: 15.03.2026)</p>
            <div className="text-sm text-text-secondary space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-text-primary font-semibold min-w-[90px]">Beschlossen:</span>
                <span>Keine EU-weit wirksame Abschaffung in Kraft.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-text-primary font-semibold min-w-[90px]">Offen:</span>
                <span>Einigung der Staaten auf eine dauerhafte Zeit (Sommer- oder Winterzeit).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-text-primary font-semibold min-w-[90px]">F&uuml;r 2026:</span>
                <span>Die bisherigen Umstellungstermine gelten weiter, bis eine Regel offiziell ge&auml;ndert wird.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Termine 2025–2027 ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Winterzeit-Termine im &Uuml;berblick: Zeitumstellung 2025 bis 2027</h2>

          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            Wenn du die Termine fr&uuml;h planen m&ouml;chtest, findest du hier die Zeitumstellung f&uuml;r
            Deutschland im &Uuml;berblick. Merksatz: Im M&auml;rz wird die Uhr{" "}
            <strong className="text-text-primary">vorgestellt</strong> (2&rarr;3), im
            Oktober <strong className="text-text-primary">zur&uuml;ckgestellt</strong> (3&rarr;2).
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Jahr</th>
                  <th className="py-3 pr-4 font-semibold">Fr&uuml;hjahr (Sommerzeit)</th>
                  <th className="py-3 font-semibold">Herbst (Winterzeit)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4">2025</td>
                  <td className="py-3 pr-4">{sz25.dateFormatted} (2&rarr;3)</td>
                  <td className="py-3">{wz25.dateFormatted} (3&rarr;2)</td>
                </tr>
                <tr className="border-b border-border/50 bg-accent/5 font-medium">
                  <td className="py-3 pr-4"><span className="text-accent font-bold">2026</span></td>
                  <td className="py-3 pr-4">{sz.dateFormatted} (2&rarr;3)</td>
                  <td className="py-3">{wz.dateFormatted} (3&rarr;2)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4">2027</td>
                  <td className="py-3 pr-4">{sz27.dateFormatted} (2&rarr;3)</td>
                  <td className="py-3">{wz27.dateFormatted} (3&rarr;2)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Beginn der Winterzeit 2024–2030 ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Beginn der Winterzeit 2024&ndash;2030</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Jahr</th>
                  <th className="py-3 pr-4 font-semibold">Datum</th>
                  <th className="py-3 font-semibold">Uhrzeit</th>
                </tr>
              </thead>
              <tbody>
                {multiYear.map((row) => (
                  <tr
                    key={row.year}
                    className={`border-b border-border/50 ${
                      row.year === year ? "bg-accent/5 font-medium" : ""
                    }`}
                  >
                    <td className="py-3 pr-4">
                      {row.year === year ? (
                        <span className="text-accent font-bold">{row.year}</span>
                      ) : (
                        row.year
                      )}
                    </td>
                    <td className="py-3 pr-4">Sonntag, {row.winterzeit.dateFormatted}</td>
                    <td className="py-3">{row.winterzeit.timeBefore} &rarr; {row.winterzeit.timeAfter} Uhr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-secondary mt-3">
            Regel: Immer am letzten Sonntag im Oktober um 03:00&nbsp;Uhr.
          </p>
        </section>

        {/* ── Häufige Probleme ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">H&auml;ufige Probleme rund um die Winterzeit: Termine, Tickets, Schichtarbeit, Technik</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Rund um die Zeitumstellung entstehen oft ganz praktische Herausforderungen. Beim Reisen lohnt
              sich ein zweiter Blick auf jede Abfahrts- und Ankunftszeit. Pr&uuml;fe besonders Nachtverbindungen:
              Ein Zug um 2:30 kann in der Umstellungsnacht pl&ouml;tzlich zweimal &bdquo;existieren&ldquo;.
              Das betrifft auch Fl&uuml;ge, Umstiege und Hotel-Check-ins.
            </p>
            <p>
              Bei <strong className="text-text-primary">Schichtarbeit in der Winterzeit</strong> kl&auml;rst du
              am besten vorab, wie die zus&auml;tzliche Stunde erfasst wird. Abrechnung und Zuschl&auml;ge
              richten sich nach Arbeitsvertrag, Tarif und Betriebsregelung.
            </p>
            <p>
              Auch Technik liegt nicht immer richtig. In der <strong className="text-text-primary">doppelten
              Stunde der Winterzeit</strong> zwischen 2 und 3&nbsp;Uhr gibt es zweimal 2:30. Kontrolliere
              Kalender, Wecker und Smart-Home-Routinen, damit Termine nicht verrutschen und Automationen
              nicht zu fr&uuml;h starten.
            </p>
          </div>

          {/* Checkliste */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Checkliste: Vor der Zeitumstellung erledigen</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Wecker</strong> und <strong className="text-text-primary">Kalender</strong> pr&uuml;fen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Termine</strong> gegenchecken (besonders morgens nach der Umstellung)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Reisebuchungen</strong> und <strong className="text-text-primary">Tickets</strong> kontrollieren</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Medizinische Ger&auml;te</strong> (z.&nbsp;B. Messger&auml;te) einstellen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Smart-Home-Routinen</strong> testen</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-text-secondary mt-4">
            Mehr dazu findest du in den{" "}
            <Link href="/faq" className="text-accent hover:underline">h&auml;ufigen Fragen zur Zeitumstellung</Link>.
          </p>
        </section>

        {/* ── Erinnerung aktivieren (CTA) ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Winterzeit 2026: Erinnerung einrichten und Zeitumstellung nicht verpassen</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Damit du das Uhr-Zur&uuml;ckstellen nicht verpasst, richte dir am besten sofort eine Erinnerung
              ein. Das klappt schnell per Kalender-Erinnerung in <strong className="text-text-primary">Google Kalender</strong>,{" "}
              <strong className="text-text-primary">Apple Kalender</strong> oder{" "}
              <strong className="text-text-primary">Outlook</strong>. Setze Erinnerungen f&uuml;r Samstagabend
              und Sonntagmorgen.
            </p>
            <p>
              Nutze zus&auml;tzlich einen Countdown f&uuml;r deine Planung: Mit
              dem <Link href="/tagerechner" className="text-accent hover:underline">Tagerechner</Link> siehst
              du sofort, wie viele Tage noch bleiben.
            </p>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Jetzt erledigen in 2&nbsp;Minuten</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Reminder f&uuml;r <strong className="text-text-primary">Samstagabend</strong> und <strong className="text-text-primary">Sonntagmorgen</strong> setzen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Liste deiner Uhren erstellen: Auto, Ofen, Armbanduhren, Wecker</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Termine rund um das Umstellungswochenende pr&uuml;fen</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Tipps für die Umstellung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tipps f&uuml;r die Umstellung auf Winterzeit</h2>
          <div className="space-y-3">
            {[
              { title: "Gewonnene Stunde nutzen", text: "Die zus\u00E4tzliche Stunde in der Nacht kann f\u00FCr mehr Schlaf genutzt werden \u2013 optimal f\u00FCr alle, die chronisch zu wenig schlafen." },
              { title: "Tageslicht am Nachmittag", text: "Da es abends fr\u00FCher dunkel wird, nutze die Mittagspause f\u00FCr einen Spaziergang." },
              { title: "Uhren am Abend umstellen", text: "Stelle analoge Uhren bereits am Samstagabend um, damit du am Sonntagmorgen nicht durcheinander kommst." },
              { title: "Schlafrhythmus beibehalten", text: "Gehe in der ersten Woche zur gewohnten Zeit ins Bett. Dein K\u00F6rper passt sich innerhalb weniger Tage an." },
            ].map((tip, i) => (
              <div key={i} className="bg-card-bg border border-border rounded-2xl px-5 py-4">
                <p className="text-sm font-semibold mb-1">{tip.title}</p>
                <p className="text-sm text-text-secondary">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cross-links ── */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/zeitumstellung-2026"
              className="block bg-card-bg border border-border rounded-2xl p-5 hover:border-accent transition-colors group"
            >
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Alle Termine</p>
              <p className="text-lg font-semibold group-hover:text-accent transition-colors">
                Zeitumstellung 2026 &rarr;
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Beide Termine, Eselsbr&uuml;cken &amp; EU-Abschaffung.
              </p>
            </Link>
            <Link
              href="/sommerzeit"
              className="block bg-card-bg border border-border rounded-2xl p-5 hover:border-accent transition-colors group"
            >
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Sommerzeit</p>
              <p className="text-lg font-semibold group-hover:text-accent transition-colors">
                Sommerzeit 2026 &rarr;
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Wann wird die Uhr vorgestellt? Alle Details.
              </p>
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">H&auml;ufig gestellte Fragen zur Winterzeit 2026</h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <details
                key={i}
                className="group bg-card-bg border border-border rounded-2xl overflow-hidden"
              >
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold flex items-center justify-between gap-4">
                  {faq.q}
                  <span className="text-text-secondary text-lg leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Abschlusstext ── */}
        <section className="mb-12 text-sm text-text-secondary leading-relaxed space-y-4">
          <p>
            Die <strong className="text-text-primary">Winterzeit 2026</strong> startet am{" "}
            <strong className="text-text-primary">{wz.dateFormatted}</strong>: In der Nacht wird die
            Uhr <strong className="text-text-primary">eine Stunde zur&uuml;ckgestellt (3:00 &rarr; 2:00&nbsp;Uhr)</strong>.
            Damit du am Montag nicht &uuml;berrascht wirst, checke rechtzeitig Wecker, Kalender-Termine sowie
            Auto-, Backofen- und Mikrowellen-Uhren &ndash; Smartphones und Funkuhren stellen sich meist automatisch um.
          </p>
          <p>
            Aktiviere am besten jetzt eine Erinnerung &ndash; und lies als N&auml;chstes weiter, wann genau
            die <Link href="/sommerzeit" className="text-accent hover:underline">Sommerzeit 2026</Link> beginnt.
          </p>
        </section>

        <LastUpdated date="2026-01-01" />
        {/* ── Weitere Links ── */}
        <nav className="flex flex-wrap gap-3 text-sm mb-8">
          <Link href="/" className="text-accent hover:underline">Aktuelle KW</Link>
          <span className="text-border">&middot;</span>
          <Link href="/datum-heute" className="text-accent hover:underline">Datum heute</Link>
          <span className="text-border">&middot;</span>
          <Link href="/tagerechner" className="text-accent hover:underline">Tagerechner</Link>
          <span className="text-border">&middot;</span>
          <Link href="/feiertage/2026" className="text-accent hover:underline">Feiertage 2026</Link>
          <span className="text-border">&middot;</span>
          <Link href="/schaltjahr" className="text-accent hover:underline">Schaltjahr</Link>
          <span className="text-border">&middot;</span>
          <Link href="/faq" className="text-accent hover:underline">FAQ</Link>
        </nav>
      </div>
    </>
  );
}
