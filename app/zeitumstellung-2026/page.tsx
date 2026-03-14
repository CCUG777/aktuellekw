import type { Metadata } from "next";
import Link from "next/link";
import {
  getZeitumstellungen,
  getZeitumstellungenMultiYear,
  formatDateLongDE,
  daysUntil,
} from "@/lib/zeitumstellung";
import { getISOWeekNumber } from "@/lib/kw";

export const revalidate = 86400;

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const { sommerzeit, winterzeit } = getZeitumstellungen(2026);
  const title = "Zeitumstellung 2026: Termine, Datum & alle Infos";
  const description = `Zeitumstellung 2026 in Deutschland: Sommerzeit am ${sommerzeit.dateFormatted} (Uhr vor) & Winterzeit am ${winterzeit.dateFormatted} (Uhr zur\u00FCck). Alle Termine, Regeln & FAQ.`;

  return {
    title,
    description,
    alternates: { canonical: "https://aktuellekw.de/zeitumstellung-2026" },
    openGraph: {
      title,
      description,
      url: "https://aktuellekw.de/zeitumstellung-2026",
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

export default function ZeitumstellungPage() {
  const year = 2026;
  const today = new Date();
  const { sommerzeit, winterzeit } = getZeitumstellungen(year);
  const multiYear = getZeitumstellungenMultiYear(2024, 2030);

  // Determine next Zeitumstellung
  const daysSommerzeit = daysUntil(sommerzeit.date, today);
  const daysWinterzeit = daysUntil(winterzeit.date, today);
  const nextSwitch =
    daysSommerzeit > 0
      ? { ...sommerzeit, daysUntil: daysSommerzeit }
      : daysWinterzeit > 0
      ? { ...winterzeit, daysUntil: daysWinterzeit }
      : null;

  const sommerzeitKW = getISOWeekNumber(sommerzeit.date);
  const winterzeitKW = getISOWeekNumber(winterzeit.date);

  /* ── JSON-LD ── */
  const breadcrumbLD = {
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
        name: "Zeitumstellung 2026",
        item: "https://aktuellekw.de/zeitumstellung-2026",
      },
    ],
  };

  const faqItems = [
    {
      q: "Wann ist die Zeitumstellung 2026?",
      a: `Die Zeitumstellung auf Sommerzeit erfolgt am ${sommerzeit.dateFormatted} (Uhr von ${sommerzeit.timeBefore} auf ${sommerzeit.timeAfter} Uhr vor). Die Umstellung auf Winterzeit erfolgt am ${winterzeit.dateFormatted} (Uhr von ${winterzeit.timeBefore} auf ${winterzeit.timeAfter} Uhr zur\u00FCck).`,
    },
    {
      q: "Wann werden die Uhren 2026 vorgestellt?",
      a: `Am ${formatDateLongDE(sommerzeit.date)} werden die Uhren um ${sommerzeit.timeBefore} Uhr auf ${sommerzeit.timeAfter} Uhr vorgestellt. Die Nacht ist eine Stunde k\u00FCrzer.`,
    },
    {
      q: "Wann werden die Uhren 2026 zur\u00FCckgestellt?",
      a: `Am ${formatDateLongDE(winterzeit.date)} werden die Uhren um ${winterzeit.timeBefore} Uhr auf ${winterzeit.timeAfter} Uhr zur\u00FCckgestellt. Die Nacht ist eine Stunde l\u00E4nger.`,
    },
    {
      q: "Wird die Zeitumstellung 2026 abgeschafft?",
      a: "Nein. Das EU-Parlament hat 2019 die Abschaffung der Zeitumstellung beschlossen, jedoch konnten sich die Mitgliedsstaaten nicht auf eine einheitliche Zeit einigen. Stand M\u00E4rz 2026 ist die Abschaffung weiterhin nicht umgesetzt.",
    },
    {
      q: "In welche Richtung wird die Uhr gestellt?",
      a: "Im Fr\u00FChling wird die Uhr eine Stunde VOR gestellt (wir verlieren eine Stunde Schlaf). Im Herbst wird die Uhr eine Stunde ZUR\u00DCCK gestellt (wir gewinnen eine Stunde Schlaf).",
    },
    {
      q: "Welche Eselsbr\u00FCcke gibt es f\u00FCr die Zeitumstellung?",
      a: "\u201EIm Fr\u00FChling stellt man die Gartenm\u00F6bel VOR das Haus, im Herbst stellt man sie ZUR\u00DCCK.\u201C Alternativ: \u201ESpring forward, fall back\u201C (englisch).",
    },
    {
      q: "Gilt die Zeitumstellung in ganz Deutschland?",
      a: "Ja. Die Zeitumstellung gilt einheitlich in ganz Deutschland sowie in allen EU-Mitgliedsstaaten nach der EU-Richtlinie 2000/84/EG. Deutschland wechselt zwischen MEZ (UTC+1) und MESZ (UTC+2).",
    },
    {
      q: "Warum gibt es die Zeitumstellung?",
      a: "Die Zeitumstellung wurde eingef\u00FChrt, um das Tageslicht besser zu nutzen und Energie zu sparen. In Deutschland gilt sie seit 1980, EU-weit einheitlich seit 1996. Der tats\u00E4chliche Energiespareffekt ist laut Studien gering.",
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
    name: "Zeitumstellung 2026 \u2013 Sommerzeit",
    startDate: `${sommerzeit.dateISO}T02:00:00+01:00`,
    endDate: `${sommerzeit.dateISO}T03:00:00+02:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Deutschland",
      address: { "@type": "PostalAddress", addressCountry: "DE" },
    },
    description: `Uhren werden am ${sommerzeit.dateFormatted} von ${sommerzeit.timeBefore} auf ${sommerzeit.timeAfter} Uhr vorgestellt (Sommerzeit/MESZ).`,
    organizer: {
      "@type": "Organization",
      name: "Europ\u00E4ische Union",
    },
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
              <Link href="/" className="hover:text-text-primary transition-colors">
                Startseite
              </Link>
              <span className="mx-1" aria-hidden="true">/</span>
            </li>
            <li aria-current="page" className="text-text-primary font-medium">
              Zeitumstellung 2026
            </li>
          </ol>
        </nav>

        {/* ── Hero ── */}
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-accent mb-3">
            Zeitumstellung Deutschland
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Zeitumstellung 2026
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Alle Termine, Datum und Infos zur Zeitumstellung 2026 in Deutschland &ndash; wann werden die Uhren umgestellt?
          </p>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Sommerzeit</p>
              <p className="text-2xl font-bold">{formatDateLongDE(sommerzeit.date)}</p>
              <p className="text-sm text-text-secondary mt-1">
                Uhr von {sommerzeit.timeBefore} auf {sommerzeit.timeAfter} Uhr <span className="text-accent font-medium">vor</span>
              </p>
              <p className="text-xs text-text-secondary mt-1">KW {sommerzeitKW} &middot; {sommerzeit.timezone} ({sommerzeit.utcOffset})</p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Winterzeit</p>
              <p className="text-2xl font-bold">{formatDateLongDE(winterzeit.date)}</p>
              <p className="text-sm text-text-secondary mt-1">
                Uhr von {winterzeit.timeBefore} auf {winterzeit.timeAfter} Uhr <span className="text-accent font-medium">zur&uuml;ck</span>
              </p>
              <p className="text-xs text-text-secondary mt-1">KW {winterzeitKW} &middot; {winterzeit.timezone} ({winterzeit.utcOffset})</p>
            </div>
          </div>

          {nextSwitch && nextSwitch.daysUntil > 0 && (
            <p className="mt-4 text-sm text-text-secondary">
              N&auml;chste Zeitumstellung ({nextSwitch.label}) in <strong className="text-text-primary">{nextSwitch.daysUntil} Tagen</strong>
            </p>
          )}
        </header>

        {/* ── [PLACEHOLDER: Einleitungstext Zeitumstellung] ── */}
        {/* SEO-Text ~150-200 Wörter: zeitumstellung 2026, wann ist zeitumstellung 2026,
            uhren umstellen 2026, zeitumstellung 2026 deutschland */}

        {/* ── Termine 2026 Detail ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Termine der Zeitumstellung 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Umstellung</th>
                  <th className="py-3 pr-4 font-semibold">Datum</th>
                  <th className="py-3 pr-4 font-semibold">Uhrzeit</th>
                  <th className="py-3 pr-4 font-semibold">Richtung</th>
                  <th className="py-3 font-semibold">Zeitzone</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Sommerzeit</td>
                  <td className="py-3 pr-4">{sommerzeit.dayName}, {sommerzeit.dateFormatted}</td>
                  <td className="py-3 pr-4">{sommerzeit.timeBefore} &rarr; {sommerzeit.timeAfter} Uhr</td>
                  <td className="py-3 pr-4 text-accent font-medium">Uhr vor (+1h)</td>
                  <td className="py-3">MEZ &rarr; MESZ</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Winterzeit</td>
                  <td className="py-3 pr-4">{winterzeit.dayName}, {winterzeit.dateFormatted}</td>
                  <td className="py-3 pr-4">{winterzeit.timeBefore} &rarr; {winterzeit.timeAfter} Uhr</td>
                  <td className="py-3 pr-4 text-accent font-medium">Uhr zur&uuml;ck (&minus;1h)</td>
                  <td className="py-3">MESZ &rarr; MEZ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── [PLACEHOLDER: Erkl\u00E4rtext Was passiert bei der Zeitumstellung] ── */}
        {/* SEO-Text ~100-150 Wörter: zeitumstellung 2026 datum, uhren umstellen 2026,
            zeitumstellung märz 2026, zeitumstellung oktober 2026 */}

        {/* ── Eselsbrücken ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Eselsbr&uuml;cken zur Zeitumstellung</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm text-accent font-medium mb-2">Gartenm&ouml;bel-Regel</p>
              <p className="text-text-secondary text-sm">
                Im Fr&uuml;hling stellt man die Gartenm&ouml;bel <strong className="text-text-primary">VOR</strong> das Haus, im Herbst stellt man sie <strong className="text-text-primary">ZUR&Uuml;CK</strong> in den Schuppen.
              </p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm text-accent font-medium mb-2">Temperatur-Regel</p>
              <p className="text-text-secondary text-sm">
                Im Fr&uuml;hling werden die Temperaturen <strong className="text-text-primary">plus</strong> (Uhr vor), im Herbst werden sie <strong className="text-text-primary">minus</strong> (Uhr zur&uuml;ck).
              </p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm text-accent font-medium mb-2">Englische Regel</p>
              <p className="text-text-secondary text-sm">
                <strong className="text-text-primary">&ldquo;Spring forward, fall back&rdquo;</strong> &ndash; Im Fr&uuml;hling (spring) vor, im Herbst (fall) zur&uuml;ck.
              </p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5">
              <p className="text-sm text-accent font-medium mb-2">Zeitzone merken</p>
              <p className="text-text-secondary text-sm">
                <strong className="text-text-primary">MEZ</strong> = Mitteleurop&auml;ische Zeit (Winter, UTC+1). <strong className="text-text-primary">MESZ</strong> = Mitteleurop&auml;ische <em>Sommer</em>zeit (UTC+2).
              </p>
            </div>
          </div>
        </section>

        {/* ── Zeitumstellung Jahresübersicht ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Zeitumstellung 2024&ndash;2030</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Jahr</th>
                  <th className="py-3 pr-4 font-semibold">Sommerzeit (Uhr vor)</th>
                  <th className="py-3 font-semibold">Winterzeit (Uhr zur&uuml;ck)</th>
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
                    <td className="py-3 pr-4">So. {row.sommerzeit.dateFormatted}</td>
                    <td className="py-3">So. {row.winterzeit.dateFormatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── [PLACEHOLDER: Zeitumstellung Deutschland / EU-Kontext] ── */}
        {/* SEO-Text ~100-150 Wörter: zeitumstellung 2026 deutschland,
            zeitumstellung abschaffen, EU-Richtlinie 2000/84/EG */}

        {/* ── Abschaffung der Zeitumstellung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Wird die Zeitumstellung abgeschafft?</h2>
          <div className="bg-card-bg border border-border rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" role="img" aria-label="Info">&#9432;</span>
              <div>
                <p className="text-text-secondary text-sm mb-3">
                  Das <strong className="text-text-primary">EU-Parlament</strong> hat im M&auml;rz 2019 mit gro&szlig;er Mehrheit f&uuml;r die Abschaffung der Zeitumstellung gestimmt. Urspr&uuml;nglich sollte die letzte Umstellung 2021 stattfinden.
                </p>
                <p className="text-text-secondary text-sm mb-3">
                  Allerdings konnten sich die <strong className="text-text-primary">EU-Mitgliedsstaaten im Rat</strong> nicht einigen, ob dauerhaft Sommer- oder Winterzeit gelten soll. Eine l&auml;nder&uuml;bergreifende Koordination ist n&ouml;tig, um einen Flickenteppich unterschiedlicher Zeitzonen zu vermeiden.
                </p>
                <p className="text-text-secondary text-sm">
                  <strong className="text-text-primary">Stand M&auml;rz 2026:</strong> Die Abschaffung ist weiterhin nicht umgesetzt. Die Zeitumstellung findet 2026 wie gewohnt zweimal statt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── [PLACEHOLDER: Auswirkungen der Zeitumstellung] ── */}
        {/* SEO-Text ~80-120 Wörter: Gesundheit, Schlafrhythmus, Biorhythmus,
            Energieeinsparung, Mini-Jetlag */}

        {/* ── MEZ vs MESZ ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">MEZ und MESZ &ndash; Zeitzonen in Deutschland</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Eigenschaft</th>
                  <th className="py-3 pr-4 font-semibold">MEZ (Winterzeit)</th>
                  <th className="py-3 font-semibold">MESZ (Sommerzeit)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Abk&uuml;rzung</td>
                  <td className="py-3 pr-4">MEZ (CET)</td>
                  <td className="py-3">MESZ (CEST)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">UTC-Offset</td>
                  <td className="py-3 pr-4">UTC+1</td>
                  <td className="py-3">UTC+2</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Zeitraum 2026</td>
                  <td className="py-3 pr-4">01.01. &ndash; {sommerzeit.dateFormatted} &amp; {winterzeit.dateFormatted} &ndash; 31.12.</td>
                  <td className="py-3">{sommerzeit.dateFormatted} &ndash; {winterzeit.dateFormatted}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Bezeichnung</td>
                  <td className="py-3 pr-4">Normalzeit</td>
                  <td className="py-3">Sommerzeit</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Tageslicht abends</td>
                  <td className="py-3 pr-4">Fr&uuml;her dunkel</td>
                  <td className="py-3">L&auml;nger hell</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── [PLACEHOLDER: Zeitumstellung in Europa & weltweit] ── */}
        {/* SEO-Text ~80-100 Wörter: EU-Länder, Schweiz, Türkei, USA,
            Länder ohne Zeitumstellung */}

        {/* ── Cross-links ── */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/sommerzeit-2026"
              className="block bg-card-bg border border-border rounded-2xl p-5 hover:border-accent transition-colors group"
            >
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Sommerzeit</p>
              <p className="text-lg font-semibold group-hover:text-accent transition-colors">
                Sommerzeit 2026 &rarr;
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Wann beginnt die Sommerzeit? Alle Details zum {formatDateLongDE(sommerzeit.date)}.
              </p>
            </Link>
            <Link
              href="/winterzeit-2026"
              className="block bg-card-bg border border-border rounded-2xl p-5 hover:border-accent transition-colors group"
            >
              <p className="text-xs uppercase tracking-widest text-accent mb-1">Winterzeit</p>
              <p className="text-lg font-semibold group-hover:text-accent transition-colors">
                Winterzeit 2026 &rarr;
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Wann beginnt die Winterzeit? Alle Details zum {formatDateLongDE(winterzeit.date)}.
              </p>
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">H&auml;ufige Fragen zur Zeitumstellung 2026</h2>
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

        {/* ── [PLACEHOLDER: Abschlusstext / Zusammenfassung] ── */}
        {/* SEO-Text ~60-80 Wörter: zeitumstellung 2026, uhren umstellen 2026,
            wann ist zeitumstellung 2026, CTA zu Sommerzeit/Winterzeit */}

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
