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
  const sz = getSommerzeitDatum(2026);
  const title = "Sommerzeit 2026: Wann wird die Uhr vorgestellt?";
  const description = `Sommerzeit 2026 auf einen Blick: Start am ${sz.dateFormatted}, Ende am 25.10.2026. Merkhilfe vor/zur\u00FCck, Tabelle 2026\u20132027 und EU-Update zur Abschaffung.`;

  return {
    title,
    description,
    alternates: { canonical: "https://aktuellekw.de/sommerzeit" },
    openGraph: {
      title,
      description,
      url: "https://aktuellekw.de/sommerzeit",
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

export default function SommerzeitPage() {
  const year = 2026;
  const today = new Date();
  const sz = getSommerzeitDatum(year);
  const wz = getWinterzeitDatum(year);
  const sz27 = getSommerzeitDatum(2027);
  const wz27 = getWinterzeitDatum(2027);
  const multiYear = getZeitumstellungenMultiYear(2024, 2030);
  const daysLeft = daysUntil(sz.date, today);
  const kwNr = getISOWeekNumber(sz.date);

  /* ── JSON-LD ── */
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://aktuellekw.de/sommerzeit#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://aktuellekw.de" },
      { "@type": "ListItem", position: 2, name: "Zeitumstellung 2026", item: "https://aktuellekw.de/zeitumstellung-2026" },
      { "@type": "ListItem", position: 3, name: "Sommerzeit 2026", item: "https://aktuellekw.de/sommerzeit" },
    ],
  };

  const faqItems = [
    {
      q: "Wann beginnt die Sommerzeit 2026 in Deutschland?",
      a: `Die Sommerzeit 2026 beginnt in Deutschland am Sonntag, ${sz.dateFormatted}. In der Nacht wird die Uhr von ${sz.timeBefore} auf ${sz.timeAfter} Uhr vorgestellt (MEZ \u2192 MESZ). Damit startet die Zeitumstellung auf Sommerzeit bundesweit gleichzeitig.`,
    },
    {
      q: "Wird im M\u00E4rz die Uhr vor oder zur\u00FCckgestellt?",
      a: "Im M\u00E4rz wird die Uhr auf Sommerzeit immer vorgestellt. Merkhilfe: \u201EIm Fr\u00FChling vor, im Herbst zur\u00FCck\u201C. Konkret springt die Zeit bei der Umstellung von 02:00 auf 03:00 Uhr (MEZ \u2192 MESZ).",
    },
    {
      q: "Wann endet die Sommerzeit 2026 (Umstellung auf Winterzeit/Normalzeit)?",
      a: `Die Sommerzeit 2026 endet in Deutschland am Sonntag, ${wz.dateFormatted}. In der Nacht wird die Uhr von ${wz.timeBefore} auf ${wz.timeAfter} Uhr zur\u00FCckgestellt (MESZ \u2192 MEZ). Das ist die Umstellung zur\u00FCck auf Normalzeit (\u201EWinterzeit\u201C).`,
    },
    {
      q: "Wird die Uhr im Oktober vor oder zur\u00FCckgestellt?",
      a: "Im Oktober wird die Uhr bei der Zeitumstellung auf Winterzeit/Normalzeit zur\u00FCckgestellt. Merkhilfe: \u201EIm Herbst zur\u00FCck\u201C. Dabei geht es von 03:00 auf 02:00 Uhr (MESZ \u2192 MEZ).",
    },
    {
      q: "Warum gibt es die Sommerzeit \u00FCberhaupt?",
      a: "Die Sommerzeit wurde eingef\u00FChrt, um das Tageslicht abends l\u00E4nger zu nutzen. Dadurch soll sich der Alltag st\u00E4rker nach den hellen Stunden richten, zum Beispiel bei Freizeit und Aktivit\u00E4ten am Abend. In Deutschland gilt daf\u00FCr im Sommer die MESZ statt der MEZ.",
    },
    {
      q: "Wann wird die Sommerzeit abgeschafft?",
      a: "Aktuell gibt es keinen feststehenden Termin zur Abschaffung der Sommerzeit in Deutschland. Auf EU-Ebene wird das Thema seit Jahren diskutiert, aber ohne verbindliche Umsetzung und ohne einheitliche Entscheidung f\u00FCr alle Mitgliedstaaten. Bis dahin bleibt die Zeitumstellung (MEZ/MESZ) bestehen.",
    },
    {
      q: "Gilt die Zeitumstellung in ganz Deutschland gleichzeitig?",
      a: "Ja, die Zeitumstellung gilt in ganz Deutschland gleichzeitig. Deutschland liegt vollst\u00E4ndig in derselben Zeitzone (MEZ/MESZ), deshalb wird die Sommerzeit bundesweit zur gleichen Uhrzeit umgestellt. Das gilt auch f\u00FCr alle Regionen und Bundesl\u00E4nder.",
    },
    {
      q: "Welche Uhren stellen sich automatisch um und welche nicht?",
      a: "Automatisch stellen sich meist Smartphones, Tablets, Computer und Funkuhren um, weil sie die Sommerzeit-Regelung aus dem Netz oder per Zeitsignal beziehen. H\u00E4ufig musst du analoge Uhren, viele Wanduhren, Backofen- und Mikrowellenuhren sowie manche Autos manuell umstellen.",
    },
    {
      q: "Wann ist die Sommerzeit 2027?",
      a: `Die Sommerzeit 2027 beginnt in Deutschland am Sonntag, ${sz27.dateFormatted} und endet am Sonntag, ${wz27.dateFormatted}. Im M\u00E4rz wird die Uhr von 02:00 auf 03:00 Uhr vorgestellt (MEZ \u2192 MESZ). Im Oktober wird sie von 03:00 auf 02:00 Uhr zur\u00FCckgestellt (MESZ \u2192 MEZ).`,
    },
  ];

  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://aktuellekw.de/sommerzeit#faqpage",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://aktuellekw.de/#website" },
    datePublished: "2026-01-01",
    dateModified: "2026-01-01",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const eventLD = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": "https://aktuellekw.de/sommerzeit#event",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://aktuellekw.de/#website" },
    name: "Sommerzeit 2026 \u2013 Uhren vorstellen",
    startDate: `${sz.dateISO}T02:00:00+01:00`,
    endDate: `${sz.dateISO}T03:00:00+02:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Deutschland",
      address: { "@type": "PostalAddress", addressCountry: "DE" },
    },
    description: `Uhren werden am ${sz.dateFormatted} von ${sz.timeBefore} auf ${sz.timeAfter} Uhr vorgestellt (MESZ).`,
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
              Sommerzeit 2026
            </li>
          </ol>
        </nav>

        {/* ── Hero ── */}
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-accent mb-3">
            Uhren vorstellen
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Sommerzeit 2026
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Beginn, Uhr umstellen (vor oder zur&uuml;ck) und Ende der Zeitumstellung in Deutschland.
          </p>

          {/* Hero Card */}
          <div className="bg-card-bg border border-border rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-xs uppercase tracking-widest text-accent mb-2">Beginn Sommerzeit</p>
            <p className="text-3xl font-bold mb-1">{formatDateLongDE(sz.date)}</p>
            <p className="text-lg text-text-secondary">
              {sz.timeBefore} &rarr; {sz.timeAfter} Uhr <span className="text-accent font-medium">(Uhr vor)</span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-text-secondary">
              <span>KW&nbsp;{kwNr}</span>
              <span>&middot;</span>
              <span>{sz.timezone} ({sz.utcOffset})</span>
              <span>&middot;</span>
              <span>{sz.dayName}</span>
            </div>
            {daysLeft > 0 && (
              <p className="mt-3 text-sm text-text-secondary">
                Noch <strong className="text-text-primary">{daysLeft} Tage</strong> bis zur Sommerzeit
              </p>
            )}
          </div>
        </header>

        {/* ── Einleitungstext Sommerzeit ── */}
        <section className="mb-12 text-sm text-text-secondary leading-relaxed space-y-4">
          <p>
            Die <strong className="text-text-primary">Sommerzeit 2026</strong> startet in Deutschland in der Nacht
            von Samstag, 28.03. auf Sonntag, 29.03.2026: Um <strong className="text-text-primary">02:00&nbsp;Uhr</strong> wird
            die Uhr <strong className="text-text-primary">auf 03:00&nbsp;Uhr vorgestellt</strong> (du verlierst eine Stunde
            Schlaf). Merkhilfe: <strong className="text-text-primary">M&auml;rz&nbsp;=&nbsp;vor</strong>,{" "}
            <strong className="text-text-primary">Oktober&nbsp;=&nbsp;zur&uuml;ck</strong> &ndash; im Herbst bekommst du die Stunde wieder.
          </p>
          <p>
            Damit du sofort planen kannst, findest du auf dieser Seite eine kompakte <strong className="text-text-primary">Termin-Tabelle
            f&uuml;r 2026&ndash;2027</strong> mit Beginn und Ende der Zeitumstellung, die klare Einordnung
            von <strong className="text-text-primary">MEZ, MESZ, Sommerzeit und &bdquo;Winterzeit&ldquo;</strong>,
            ein faktenbasiertes <strong className="text-text-primary">EU-Update zur m&ouml;glichen Abschaffung</strong> und
            praktische Hinweise, damit du beim Umstellen (Handy, Wecker, Kalender) nichts verpasst.
          </p>
        </section>

        {/* ── Start Sommerzeit 2026 ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sommerzeit 2026: Wann beginnt die Zeitumstellung in Deutschland?</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Die <strong className="text-text-primary">Sommerzeit 2026</strong> beginnt in Deutschland
              am letzten Sonntag im M&auml;rz. In der Nacht von Samstag auf Sonntag wird die Uhr
              umgestellt: Um <strong className="text-text-primary">2:00&nbsp;Uhr</strong> springt sie direkt
              auf <strong className="text-text-primary">3:00&nbsp;Uhr</strong>. Dadurch entf&auml;llt eine
              Stunde Schlaf &ndash; der Morgen f&uuml;hlt sich entsprechend fr&uuml;her an.
            </p>
            <p>
              Mit der Umstellung wechselt Deutschland von der Normalzeit <strong className="text-text-primary">MEZ</strong> zur{" "}
              <strong className="text-text-primary">MESZ</strong>. Die Zeitumstellung erfolgt wie gewohnt nachts
              und gilt bundesweit. Viele Smartphones, Computer und Funkuhren stellen die Zeit automatisch um.
              Analoge Uhren musst du in der Regel selbst eine Stunde vorstellen.
            </p>
          </div>

          {/* Fact-Box */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-6">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Sommerzeit 2026 auf einen Blick</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-text-secondary">Datum:</span> <span className="text-text-primary font-medium">Sonntag, {sz.dateFormatted}</span></div>
              <div><span className="text-text-secondary">Uhrzeit:</span> <span className="text-text-primary font-medium">{sz.timeBefore} &rarr; {sz.timeAfter} Uhr</span></div>
              <div><span className="text-text-secondary">Merkhilfe:</span> <span className="text-text-primary font-medium">M&auml;rz = vor</span></div>
              <div><span className="text-text-secondary">Zeitzone:</span> <span className="text-text-primary font-medium">MEZ &rarr; MESZ</span></div>
            </div>
          </div>

          {/* Vor oder zurück */}
          <h3 className="text-xl font-semibold mb-3">Wird im M&auml;rz die Uhr vor oder zur&uuml;ckgestellt?</h3>
          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-4">
            <p>
              Wenn du dich fragst, ob du im M&auml;rz die Uhr vor oder zur&uuml;ckstellst: Im M&auml;rz wird
              die Uhr <strong className="text-text-primary">eine Stunde vorgestellt</strong>. Merkhilfe:
              &bdquo;Sommer&nbsp;=&nbsp;vor&ldquo; oder &bdquo;Spring forward&ldquo; &ndash; im Fr&uuml;hling
              geht&rsquo;s nach vorn. Um <strong className="text-text-primary">2:00&nbsp;Uhr</strong> springt
              die Zeit auf <strong className="text-text-primary">3:00&nbsp;Uhr</strong>. Dadurch fehlt dir eine
              Stunde Schlaf.
            </p>
          </div>

          {/* Checkliste Vor oder zurück */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Checkliste &bdquo;Vor oder zur&uuml;ck?&ldquo;</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">M&auml;rz:</strong> vor (+1&nbsp;Stunde)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Oktober:</strong> zur&uuml;ck (-1&nbsp;Stunde)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Uhrzeit:</strong> 2:00 &rarr; 3:00 (Sprung nach vorn)</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Ende der Sommerzeit ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sommerzeit 2026: Wann endet die Sommerzeit (Umstellung auf Winterzeit)?</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Die Zeitumstellung im Oktober 2026 erfolgt in Deutschland am letzten Sonntag im
              Oktober, also am <strong className="text-text-primary">25.&nbsp;Oktober&nbsp;2026</strong>. In der Nacht
              wird die Uhr um 3:00&nbsp;Uhr auf 2:00&nbsp;Uhr zur&uuml;ckgestellt &ndash; damit endet die Sommerzeit.
            </p>
            <p>
              Der Begriff &bdquo;Winterzeit&ldquo; ist umgangssprachlich. Offiziell gilt danach die
              Normalzeit (MEZ). Im Alltag bleibt es jedoch die bekannte Umstellung von Sommerzeit auf Winterzeit.
            </p>
            <p>
              Durch das Zur&uuml;ckstellen gewinnst du eine Stunde. Gleichzeitig kommt die Zeit
              zwischen 2:00 und 3:00&nbsp;Uhr zweimal vor &ndash; wichtig, wenn du Termine planst
              oder Tickets mit genauer Uhrzeit hast.
              Mehr Details findest du auf der Seite{" "}
              <Link href="/winterzeit" className="text-accent hover:underline">Winterzeit 2026</Link>.
            </p>
          </div>

          {/* Fact-Box Ende */}
          <div className="bg-card-bg border border-border rounded-2xl p-5 mb-6">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Ende Sommerzeit 2026</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-text-secondary">Datum:</span> <span className="text-text-primary font-medium">Sonntag, {wz.dateFormatted}</span></div>
              <div><span className="text-text-secondary">Uhrzeit:</span> <span className="text-text-primary font-medium">{wz.timeBefore} &rarr; {wz.timeAfter} Uhr</span></div>
              <div className="col-span-2"><span className="text-text-secondary">Hinweis:</span> <span className="text-text-primary font-medium">Die 2-Uhr-Stunde kommt zweimal vor.</span></div>
            </div>
          </div>

          {/* Oktober vor oder zurück */}
          <h3 className="text-xl font-semibold mb-3">Wird die Uhr im Oktober vor oder zur&uuml;ckgestellt?</h3>
          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-4">
            <p>
              Im <strong className="text-text-primary">Oktober</strong> musst du die Uhr{" "}
              <strong className="text-text-primary">eine Stunde zur&uuml;ckstellen</strong>. Das ist die
              Umstellung von Sommerzeit auf Winterzeit. Merksatz: &bdquo;Im Herbst stellst du die Uhr
              zur&uuml;ck&ldquo;. Pr&uuml;fe in der Umstellungsnacht deine Zeitangaben und Wecker, damit nichts schiefgeht.
            </p>
          </div>

          {/* Kurz-Check Oktober */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Kurz-Check &bdquo;Oktober&ldquo;</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Analoge Uhren, Auto-Uhr, Backofen pr&uuml;fen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Termine und Schichten in der Nacht doppelt abgleichen</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Was passiert bei der Umstellung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Was passiert bei der Umstellung auf Sommerzeit?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">-1h</p>
              <p className="text-sm font-medium">K&uuml;rzere Nacht</p>
              <p className="text-xs text-text-secondary mt-1">Die Nacht vom 28. auf 29.&nbsp;M&auml;rz 2026 ist eine Stunde k&uuml;rzer</p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">MESZ</p>
              <p className="text-sm font-medium">Neue Zeitzone</p>
              <p className="text-xs text-text-secondary mt-1">MEZ (UTC+1) wechselt zu MESZ (UTC+2)</p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">+1h</p>
              <p className="text-sm font-medium">L&auml;nger hell</p>
              <p className="text-xs text-text-secondary mt-1">Abends bleibt es eine Stunde l&auml;nger hell</p>
            </div>
          </div>
        </section>

        {/* ── Zeitumstellung Tabelle 2026–2027 ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Zeitumstellung 2026 im &Uuml;berblick: Tabelle f&uuml;r Sommerzeit und Winterzeit</h2>

          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            Hier findest du eine kompakte Tabelle zur Zeitumstellung <strong className="text-text-primary">2026</strong> in
            Deutschland. Als Extra sind die Termine f&uuml;r <strong className="text-text-primary">2027</strong> ebenfalls
            dabei. Die Umstellung erfolgt jeweils am letzten Sonntag im M&auml;rz und am letzten Sonntag im Oktober.
            Mehr Details gibt es unter{" "}
            <Link href="/zeitumstellung-2026" className="text-accent hover:underline">Zeitumstellung 2026 im &Uuml;berblick</Link>.
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Jahr</th>
                  <th className="py-3 pr-4 font-semibold">Ereignis</th>
                  <th className="py-3 pr-4 font-semibold">Datum</th>
                  <th className="py-3 pr-4 font-semibold">Umstellung</th>
                  <th className="py-3 font-semibold">Zeitzone</th>
                </tr>
              </thead>
              <tbody>
                {/* 2026 */}
                <tr className="border-b border-border/50 bg-accent/5 font-medium">
                  <td className="py-3 pr-4"><span className="text-accent font-bold">2026</span></td>
                  <td className="py-3 pr-4">Sommerzeit beginnt</td>
                  <td className="py-3 pr-4">{sz.dateFormatted}</td>
                  <td className="py-3 pr-4">{sz.timeBefore} &rarr; {sz.timeAfter}</td>
                  <td className="py-3">MEZ &rarr; MESZ</td>
                </tr>
                <tr className="border-b border-border/50 bg-accent/5 font-medium">
                  <td className="py-3 pr-4"><span className="text-accent font-bold">2026</span></td>
                  <td className="py-3 pr-4">Sommerzeit endet</td>
                  <td className="py-3 pr-4">{wz.dateFormatted}</td>
                  <td className="py-3 pr-4">{wz.timeBefore} &rarr; {wz.timeAfter}</td>
                  <td className="py-3">MESZ &rarr; MEZ</td>
                </tr>
                {/* 2027 */}
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4">2027</td>
                  <td className="py-3 pr-4">Sommerzeit beginnt</td>
                  <td className="py-3 pr-4">{sz27.dateFormatted}</td>
                  <td className="py-3 pr-4">02:00 &rarr; 03:00</td>
                  <td className="py-3">MEZ &rarr; MESZ</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4">2027</td>
                  <td className="py-3 pr-4">Sommerzeit endet</td>
                  <td className="py-3 pr-4">{wz27.dateFormatted}</td>
                  <td className="py-3 pr-4">03:00 &rarr; 02:00</td>
                  <td className="py-3">MESZ &rarr; MEZ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── MEZ / MESZ / Sommerzeit / Winterzeit ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sommerzeit in Deutschland: Unterschied zwischen MEZ, MESZ, Sommerzeit und &bdquo;Winterzeit&ldquo;</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              In der <strong className="text-text-primary">Sommerzeit in Deutschland</strong> sorgen die
              Begriffe <strong className="text-text-primary">MEZ</strong> und{" "}
              <strong className="text-text-primary">MESZ</strong> h&auml;ufig f&uuml;r Verwirrung.{" "}
              <strong className="text-text-primary">MEZ (Mitteleurop&auml;ische Zeit)</strong> ist die gesetzliche{" "}
              <strong className="text-text-primary">Normalzeit</strong> und entspricht{" "}
              <strong className="text-text-primary">UTC+1</strong>.{" "}
              <strong className="text-text-primary">MESZ (Mitteleurop&auml;ische Sommerzeit)</strong> ist die{" "}
              <strong className="text-text-primary">Sommerzeit</strong> und entspricht{" "}
              <strong className="text-text-primary">UTC+2</strong>. W&auml;hrend der Sommerzeit liegt die
              Uhrzeit damit eine Stunde vor der MEZ.
            </p>
            <p>
              Den Begriff <strong className="text-text-primary">&bdquo;Winterzeit&ldquo;</strong> nutzt man zwar
              oft im Alltag, rechtlich ist damit fast immer die{" "}
              <strong className="text-text-primary">Normalzeit (MEZ)</strong> gemeint. Eine eigene
              &bdquo;Winterzeit&ldquo;-Regelung gibt es nicht. Offiziell gilt: Im Fr&uuml;hjahr stellt
              Deutschland auf MESZ um, im Herbst geht es zur&uuml;ck zur MEZ.
            </p>
            <p>
              <strong className="text-text-primary">Beispiel:</strong> 12:00&nbsp;Uhr MEZ entspricht
              13:00&nbsp;Uhr MESZ. Dadurch bleibt es abends l&auml;nger hell.
            </p>
          </div>

          {/* MEZ/MESZ Vergleichstabelle */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Begriff</th>
                  <th className="py-3 pr-4 font-semibold">Abk.</th>
                  <th className="py-3 pr-4 font-semibold">UTC</th>
                  <th className="py-3 pr-4 font-semibold">Umgangssprachlich</th>
                  <th className="py-3 font-semibold">G&uuml;ltig</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4">Mitteleurop&auml;ische Zeit</td>
                  <td className="py-3 pr-4 font-semibold">MEZ</td>
                  <td className="py-3 pr-4">UTC+1</td>
                  <td className="py-3 pr-4">&bdquo;Winterzeit&ldquo;</td>
                  <td className="py-3">Herbst bis Fr&uuml;hjahr</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4">Mitteleurop&auml;ische Sommerzeit</td>
                  <td className="py-3 pr-4 font-semibold">MESZ</td>
                  <td className="py-3 pr-4">UTC+2</td>
                  <td className="py-3 pr-4">&bdquo;Sommerzeit&ldquo;</td>
                  <td className="py-3">Fr&uuml;hjahr bis Herbst</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Geschichte der Sommerzeit ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Warum gibt es die Sommerzeit? Ziel und Geschichte in Deutschland</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Die Sommerzeit sollte urspr&uuml;nglich <strong className="text-text-primary">Energie sparen</strong> und
              das <strong className="text-text-primary">Tageslicht besser nutzen</strong>. Die Grundidee ist einfach:
              Wenn die Uhr im Fr&uuml;hjahr vorgestellt wird, bleibt es abends l&auml;nger hell.
            </p>
            <p>
              <strong className="text-text-primary">1916</strong> f&uuml;hrte das Deutsche Reich die Sommerzeit erstmals
              ein, um Ressourcen zu schonen und den Energiebedarf zu senken. Danach gab es in Deutschland
              mehrere Unterbrechungen und sp&auml;tere R&uuml;ckkehrphasen. H&auml;ufig taucht auch die
              Frage &bdquo;Sommerzeit 1964&ldquo; auf &ndash; Fakt ist: In Westdeutschland gab es 1964 keine
              regul&auml;re Sommerzeit. Die dauerhafte Wiedereinf&uuml;hrung kam erst sp&auml;ter:{" "}
              <strong className="text-text-primary">1980</strong> stellte Deutschland erneut um.
              Seit <strong className="text-text-primary">1996</strong> gilt in der EU eine einheitliche Regelung.
            </p>
          </div>

          {/* Zeitleiste */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">Zeitleiste Sommerzeit (DE/EU)</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold min-w-[50px]">1916</span>
                <span className="text-text-secondary">Erste Einf&uuml;hrung im Deutschen Reich</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-text-primary font-bold min-w-[50px]">1918</span>
                <span className="text-text-secondary">Abschaffung nach Ende des Ersten Weltkriegs</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-text-primary font-bold min-w-[50px]">1940er</span>
                <span className="text-text-secondary">Zeitweise Wiedereinf&uuml;hrung w&auml;hrend des Krieges</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-text-primary font-bold min-w-[50px]">1950&ndash;70</span>
                <span className="text-text-secondary">Keine Sommerzeit in Westdeutschland</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold min-w-[50px]">1980</span>
                <span className="text-text-secondary">Wiedereinf&uuml;hrung in Deutschland</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold min-w-[50px]">1996</span>
                <span className="text-text-secondary">EU-weit einheitliche Regelung</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Auswirkungen der Zeitumstellung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Auswirkungen der Zeitumstellung: Schlaf, Gesundheit und Alltag</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Viele sp&uuml;ren die <strong className="text-text-primary">Auswirkungen der Zeitumstellung</strong> direkt
              am Schlaf. Vor allem im Fr&uuml;hjahr fehlt dir gef&uuml;hlt eine Stunde. Du wirst nicht automatisch
              fr&uuml;her m&uuml;de &ndash; deshalb verschiebt sich das Einschlafen oft. Deine{" "}
              <strong className="text-text-primary">innere Uhr</strong> braucht dann ein paar Tage, bis sie sich
              an die Sommerzeit angepasst hat.
            </p>
            <p>
              Im Alltag merkst du das an Konzentration und Stimmung. In Arbeit und Schule bist du anfangs
              schneller ersch&ouml;pft. Plane in den ersten Tagen bewusst mehr Puffer ein, damit Termine nicht stressen.
            </p>
            <p>
              Auch Technik kann kurzzeitig irritieren: Pr&uuml;fe, ob Smartphone, Laptop und Smartwatch die Uhrzeit
              korrekt &uuml;bernommen haben. Im &ouml;ffentlichen Verkehr werden Fahrpl&auml;ne zwar umgestellt, aber
              Umsteigezeiten f&uuml;hlen sich anfangs ungewohnt an. Bei Schichtarbeit trifft dich die Umstellung
              besonders, weil deine Schlafzeiten ohnehin wechseln.
            </p>
          </div>

          {/* Checkliste */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Checkliste: So kommst du besser durch die Zeitumstellung</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Schlaf 3&ndash;5 Tage vorher t&auml;glich um 10&ndash;20 Minuten anpassen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Morgens direkt <strong className="text-text-primary">Tageslicht</strong> tanken, abends <strong className="text-text-primary">Licht reduzieren</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Koffein</strong> nur bis zum fr&uuml;hen Nachmittag, <strong className="text-text-primary">Alkohol</strong> eher meiden</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span><strong className="text-text-primary">Wecker</strong>, <strong className="text-text-primary">Kalender</strong> und wichtige <strong className="text-text-primary">Termine</strong> am Vortag pr&uuml;fen</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Geräte, Kalender und Wecker ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Praktische Tipps: Ger&auml;te, Kalender und Wecker richtig umstellen</h2>

          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            Viele Ger&auml;te &uuml;bernehmen die Uhr-Umstellung automatisch &ndash; zum Beispiel Smartphone, Computer
            oder eine Funkuhr. Manche Uhren musst du aber selbst anpassen. Diese Tipps helfen dir dabei.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-3">Manuell umstellen</p>
              <ul className="text-sm text-text-secondary space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span>Backofen und Mikrowelle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span>Auto-Uhr</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span>Analoge Uhren (Wand- und Armbanduhren)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span>Kamera</span>
                </li>
              </ul>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold mb-3">Termine am Umstellungswochenende</p>
              <ul className="text-sm text-text-secondary space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span>Internationale Calls: <strong className="text-text-primary">Zeitzone</strong> und Startzeit pr&uuml;fen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span>Wiederkehrende Termine: Uhrzeit kontrollieren</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span>Kalender-Apps: <strong className="text-text-primary">Sync</strong> einmal aktualisieren</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── EU Abschaffung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sommerzeit abschaffen: Aktueller Stand in der EU und in Deutschland (Update 2026)</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Aktuell gilt in der EU weiterhin die Regel zur Zeitumstellung. Solange die Mitgliedstaaten keine
              gemeinsame Entscheidung treffen und diese umsetzen, bleibt es beim Wechsel zwischen Sommer- und Winterzeit.
              Wer nach &bdquo;wann wird die Sommerzeit abgeschafft&ldquo; sucht, findet deshalb derzeit{" "}
              <strong className="text-text-primary">kein festes Datum</strong>.
            </p>
            <p>
              Die EU hat die Abschaffung zwar diskutiert. Eine Einigung dar&uuml;ber, welche Zeit dauerhaft
              gelten soll, steht aber noch aus. Deshalb bleibt auch &bdquo;Zeitumstellung abschaffen Deutschland&ldquo;
              politisch offen. Ein konkretes Ende der Zeitumstellung ist bislang nicht beschlossen.
            </p>
            <p>
              F&uuml;r 2026 gelten die Termine wie geplant. Pr&uuml;fe m&ouml;gliche &Auml;nderungen am besten
              kurz vor den Stichtagen &uuml;ber aktuelle Informationen der EU und der zust&auml;ndigen Bundesstellen.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-3">Warum ist die Zeitumstellung noch nicht abgeschafft?</h3>
          <div className="text-sm text-text-secondary leading-relaxed space-y-4">
            <p>
              Es fehlt eine gemeinsame Entscheidung, ob dauerhaft Sommerzeit oder Normalzeit gelten soll. Genau
              daran h&auml;ngt auch die EU-Debatte zur Abschaffung der Sommerzeit. W&uuml;rden L&auml;nder
              unterschiedlich entscheiden, w&uuml;rden Binnenmarkt, Verkehr und Kommunikation deutlich
              komplizierter. Solange es keine abgestimmte L&ouml;sung gibt, bleibt die aktuelle Regelung bestehen.
            </p>
          </div>
        </section>

        {/* ── Kurz-FAQ inline ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Kurz-FAQ zur Sommerzeit (Deutschland, 2026)</h2>

          <div className="bg-card-bg border border-border rounded-2xl p-5 space-y-4 text-sm text-text-secondary leading-relaxed mb-6">
            <div>
              <p className="font-semibold text-text-primary">Wann ist die n&auml;chste Zeitumstellung in Deutschland?</p>
              <p>
                Du stellst die Uhr am letzten Sonntag im M&auml;rz eine Stunde <strong className="text-text-primary">vor</strong> (Start
                der Sommerzeit). Am letzten Sonntag im Oktober stellst du sie wieder{" "}
                <strong className="text-text-primary">zur&uuml;ck</strong> (R&uuml;ckkehr zur Normalzeit/Winterzeit).
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Wird die Sommerzeit 2026 abgeschafft?</p>
              <p>
                Nein. Die Umstellung bleibt vorerst bestehen, weil es in der EU weiterhin keine gemeinsame
                Entscheidung zur Abschaffung gibt.
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Warum wird &uuml;berhaupt umgestellt?</p>
              <p>
                Ziel ist, das Tageslicht st&auml;rker in die Abendstunden zu verlagern.
                Ob das im Alltag Vorteile bringt, ist umstritten.
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Wie merke ich mir &bdquo;vor oder zur&uuml;ck&ldquo;?</p>
              <p>
                Im Fr&uuml;hjahr geht&rsquo;s <strong className="text-text-primary">vor</strong>, im
                Herbst <strong className="text-text-primary">zur&uuml;ck</strong>. Merksatz:
                &bdquo;Im Sommer vor, im Winter zur&uuml;ck&ldquo;.
              </p>
            </div>
          </div>

          <p className="text-sm text-text-secondary">
            Mehr kurze Antworten findest du in unseren{" "}
            <Link href="/faq" className="text-accent hover:underline">FAQ zur Zeitumstellung</Link>.
          </p>
        </section>

        {/* ── 2 Uhr auf 3 Uhr erklärt ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Wann wird die Uhr umgestellt &ndash; nachts um 2 oder 3&nbsp;Uhr?</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4">
            <p>
              Im Fr&uuml;hjahr springt die Zeit nachts von <strong className="text-text-primary">2&nbsp;Uhr
              auf 3&nbsp;Uhr</strong>. Die Stunde zwischen 2:00 und 2:59 entf&auml;llt komplett.
            </p>
            <p>
              Im Herbst l&auml;uft es umgekehrt. Dann wird die Uhr nachts von{" "}
              <strong className="text-text-primary">3&nbsp;Uhr auf 2&nbsp;Uhr</strong> zur&uuml;ckgestellt.
              Dadurch kommt die 2-Uhr-Stunde zweimal vor.
            </p>
            <p>
              Rund um die Zeitumstellung k&ouml;nnen Fahrpl&auml;ne und Schichtpl&auml;ne abweichen.
              Pr&uuml;fe daher bei Nachtfahrten oder Diensten die Hinweise deines Anbieters oder Arbeitgebers.
            </p>
          </div>
        </section>

        {/* ── Bundesweit ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Gilt die Sommerzeit &uuml;berall in Deutschland gleich?</h2>

          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Ja, die Sommerzeit gilt in Deutschland einheitlich: In allen Bundesl&auml;ndern wird gleichzeitig
            zwischen <strong className="text-text-primary">MEZ</strong> und <strong className="text-text-primary">MESZ</strong> umgestellt.
            Es gibt keine regionalen Ausnahmen &ndash; weder nach Stadt noch nach Landkreis.
          </p>

          <div className="bg-card-bg border border-border rounded-2xl p-5 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary mb-1">Hinweis</p>
            <p>
              Wenn dir die Uhrzeit trotzdem &bdquo;falsch&ldquo; vorkommt, liegt das meist an einer falsch
              eingestellten Zeitzone oder an einer fehlerhaft konfigurierten App. Dadurch wirkt es, als
              w&uuml;rde die Umstellung nicht &uuml;berall greifen.
            </p>
          </div>
        </section>

        {/* ── Sommerzeit 2027 ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sommerzeit 2027: Wann wird die Uhr umgestellt?</h2>

          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Die Termine f&uuml;r die <strong className="text-text-primary">Sommerzeit 2027</strong> findest du
            in der Tabelle 2026&ndash;2027 weiter oben. Solange sich die Rechtslage nicht &auml;ndert, gilt
            weiterhin die Regel: Ma&szlig;geblich ist immer der{" "}
            <strong className="text-text-primary">letzte Sonntag</strong> im jeweiligen Monat.
          </p>

          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Merke</p>
            <p className="text-sm text-text-secondary">
              &bdquo;Letzter Sonntag&ldquo; &ndash; damit kannst du die Termine f&uuml;r 2027 auch ohne
              Kalenderliste sicher einordnen.
            </p>
          </div>
        </section>

        {/* ── Sommerzeit-Termine Jahresübersicht 2024–2030 ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Beginn der Sommerzeit 2024&ndash;2030</h2>
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
                    <td className="py-3 pr-4">Sonntag, {row.sommerzeit.dateFormatted}</td>
                    <td className="py-3">{row.sommerzeit.timeBefore} &rarr; {row.sommerzeit.timeAfter} Uhr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-secondary mt-3">
            Regel: Immer am letzten Sonntag im M&auml;rz um 02:00&nbsp;Uhr.
          </p>
        </section>

        {/* ── Nächste Schritte ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">N&auml;chste Schritte: Termine speichern und an Umstellung erinnert werden</h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-4 mb-6">
            <p>
              Damit du die <strong className="text-text-primary">Zeitumstellung 2026</strong> nicht verpasst,
              leg dir jetzt feste Erinnerungen an. Setz einen Kalender-Reminder auf dem Smartphone &ndash;
              zum Beispiel in Google Kalender, Apple Kalender oder Outlook. Plane direkt zwei
              Eintr&auml;ge: <strong className="text-text-primary">M&auml;rz 2026</strong> (Umstellung auf
              Sommerzeit) und <strong className="text-text-primary">Oktober 2026</strong> (R&uuml;ckstellung auf Winterzeit).
            </p>
            <p>
              Reist du oder hast wichtige Calls, lohnt sich ein Extra-Check. Pr&uuml;fe im Kalender
              die <strong className="text-text-primary">Zeitzone</strong> des Termins &ndash; besonders bei
              Einladungen aus dem Ausland. Sonst verschiebt sich ein Meeting schnell um eine Stunde.
              Am Umstellungstag hilft ein kurzer Abgleich:{" "}
              <Link href="/datum-heute" className="text-accent hover:underline">heutiges Datum pr&uuml;fen</Link> und
              mit deinem Kalender vergleichen.
            </p>
          </div>

          {/* Jetzt-erledigen-Checkliste */}
          <div className="bg-card-bg border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">Zeitumstellung 2026: Jetzt erledigen in 2&nbsp;Minuten</p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Reminder f&uuml;r <strong className="text-text-primary">M&auml;rz 2026</strong> und <strong className="text-text-primary">Oktober 2026</strong> setzen (mit Vorwarnung am Vortag)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Liste deiner Uhren erstellen: Auto, Ofen, Armbanduhren, Wecker</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>Wichtige Termine rund um das Umstellungswochenende pr&uuml;fen: Zeitzone, Startzeit, Dauer</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Tipps für die Umstellung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tipps f&uuml;r die Umstellung auf Sommerzeit</h2>
          <div className="space-y-3">
            {[
              { title: "Schrittweise anpassen", text: "Gehe in den Tagen vor der Umstellung jeweils 15\u201320 Minuten fr\u00FCher ins Bett." },
              { title: "Morgens Tageslicht tanken", text: "Tageslicht am Morgen hilft der inneren Uhr, sich schneller anzupassen." },
              { title: "Ger\u00E4te pr\u00FCfen", text: "Smartphones und Computer stellen sich automatisch um. Analoge Uhren, Mikrowelle und Backofen m\u00FCssen manuell umgestellt werden." },
              { title: "Abends wenig blaues Licht", text: "Vermeide in den ersten Tagen helles Bildschirmlicht vor dem Schlafengehen." },
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
              href="/winterzeit"
              className="block bg-card-bg border border-border rounded-2xl p-5 hover:border-accent transition-colors group"
            >
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Winterzeit</p>
              <p className="text-lg font-semibold group-hover:text-accent transition-colors">
                Winterzeit 2026 &rarr;
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Wann wird die Uhr zur&uuml;ckgestellt? Alle Details.
              </p>
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">H&auml;ufig gestellte Fragen zur Sommerzeit 2026</h2>
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
            F&uuml;r die <strong className="text-text-primary">Sommerzeit 2026</strong> gilt die einfache
            Merkhilfe: <strong className="text-text-primary">im M&auml;rz eine Stunde vor</strong>,{" "}
            <strong className="text-text-primary">im Oktober eine Stunde zur&uuml;ck</strong>. Die konkreten
            Termine und die kompakte Tabelle 2026&ndash;2027 geben dir daf&uuml;r eine schnelle, verl&auml;ssliche
            Referenz &ndash; ohne langes Suchen.
          </p>
          <p>
            Zur m&ouml;glichen Abschaffung: Stand heute bleibt die Sommerzeit in Deutschland weiterhin g&uuml;ltig;
            verbindliche &Auml;nderungen kommen nur &uuml;ber offizielle Beschl&uuml;sse. Setz dir jetzt einen
            Reminder f&uuml;r die Zeitumstellung und speichere dir die Termine.
          </p>
        </section>

        <LastUpdated date="2026-01-01" />
        {/* ── Weitere Links ── */}
        <nav className="flex flex-wrap gap-3 text-sm mb-8">
          <Link href="/" className="text-accent hover:underline">Aktuelle KW</Link>
          <span className="text-border">&middot;</span>
          <Link href="/datum-heute" className="text-accent hover:underline">Datum heute</Link>
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
