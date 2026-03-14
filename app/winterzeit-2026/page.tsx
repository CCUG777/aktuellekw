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

export const revalidate = 86400;

/* ── Metadata ──────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const wz = getWinterzeitDatum(2026);
  const title = "Winterzeit 2026: Wann wird die Uhr zur\u00FCckgestellt?";
  const description = `Winterzeit 2026: Am ${wz.dateFormatted} werden die Uhren von ${wz.timeBefore} auf ${wz.timeAfter} Uhr zur\u00FCckgestellt. Alle Infos zu MEZ, Normalzeit & Termine.`;

  return {
    title,
    description,
    alternates: { canonical: "https://aktuellekw.de/winterzeit-2026" },
    openGraph: {
      title,
      description,
      url: "https://aktuellekw.de/winterzeit-2026",
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
      { "@type": "ListItem", position: 3, name: "Winterzeit 2026", item: "https://aktuellekw.de/winterzeit-2026" },
    ],
  };

  const faqItems = [
    {
      q: "Wann beginnt die Winterzeit 2026?",
      a: `Die Winterzeit 2026 beginnt am ${formatDateLongDE(wz.date)} um ${wz.timeBefore} Uhr. Die Uhren werden eine Stunde zur\u00FCckgestellt auf ${wz.timeAfter} Uhr.`,
    },
    {
      q: "Wird die Uhr vor oder zur\u00FCck gestellt?",
      a: "Bei der Umstellung auf Winterzeit wird die Uhr eine Stunde ZUR\u00DCCK gestellt. Die Nacht ist eine Stunde l\u00E4nger, daf\u00FCr wird es abends fr\u00FCher dunkel.",
    },
    {
      q: "In welcher Kalenderwoche beginnt die Winterzeit 2026?",
      a: `Die Winterzeit 2026 beginnt in KW ${kwNr} (${formatDateLongDE(wz.date)}).`,
    },
    {
      q: "Was ist MEZ?",
      a: "MEZ steht f\u00FCr Mitteleurop\u00E4ische Zeit (englisch: CET). Sie entspricht UTC+1 und gilt in Deutschland von Ende Oktober bis Ende M\u00E4rz. MEZ ist die \u201ENormalzeit\u201C.",
    },
    {
      q: "Ist Winterzeit die Normalzeit?",
      a: "Ja. Die Winterzeit (MEZ, UTC+1) ist die astronomisch korrekte Normalzeit f\u00FCr Deutschland. Die Sommerzeit (MESZ, UTC+2) ist die k\u00FCnstlich verschobene Zeit.",
    },
    {
      q: "Wann endet die Winterzeit 2026?",
      a: `Die Winterzeit endet mit dem Beginn der Sommerzeit 2027 \u2013 voraussichtlich am letzten Sonntag im M\u00E4rz 2027 um 02:00 Uhr.`,
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
            Wann wird die Uhr zur&uuml;ckgestellt? Alle Infos zur Winterzeit 2026 in Deutschland.
          </p>

          {/* Hero Card */}
          <div className="bg-card-bg border border-border rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-xs uppercase tracking-widest text-accent mb-2">Beginn Winterzeit</p>
            <p className="text-3xl font-bold mb-1">{formatDateLongDE(wz.date)}</p>
            <p className="text-lg text-text-secondary">
              {wz.timeBefore} &rarr; {wz.timeAfter} Uhr <span className="text-accent font-medium">(Uhr zur&uuml;ck)</span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-text-secondary">
              <span>KW {kwNr}</span>
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

        {/* ── [PLACEHOLDER: Einleitungstext Winterzeit] ── */}
        {/* SEO-Text ~150-200 Wörter: winterzeit, winterzeit 2026,
            uhr zurückstellen 2026, normalzeit */}

        {/* ── Was passiert ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Was passiert bei der Umstellung auf Winterzeit?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">+1h</p>
              <p className="text-sm font-medium">L&auml;ngere Nacht</p>
              <p className="text-xs text-text-secondary mt-1">Die Nacht vom 24. auf 25. Oktober 2026 ist eine Stunde l&auml;nger</p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">MEZ</p>
              <p className="text-sm font-medium">Normalzeit</p>
              <p className="text-xs text-text-secondary mt-1">MESZ (UTC+2) wechselt zur&uuml;ck zu MEZ (UTC+1)</p>
            </div>
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">-1h</p>
              <p className="text-sm font-medium">Fr&uuml;her dunkel</p>
              <p className="text-xs text-text-secondary mt-1">Abends wird es eine Stunde fr&uuml;her dunkel</p>
            </div>
          </div>
        </section>

        {/* ── [PLACEHOLDER: Winterzeit = Normalzeit Erklärung] ── */}
        {/* SEO-Text ~80-120 Wörter: Normalzeit, MEZ, astronomische Zeit,
            Sonnenstand, warum Winterzeit normal ist */}

        {/* ── Winterzeit-Termine Jahresübersicht ── */}
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
            Regel: Immer am letzten Sonntag im Oktober um 03:00 Uhr.
          </p>
        </section>

        {/* ── Sommerzeit vs. Winterzeit ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sommerzeit vs. Winterzeit im Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-semibold">Eigenschaft</th>
                  <th className="py-3 pr-4 font-semibold">Winterzeit (MEZ)</th>
                  <th className="py-3 font-semibold">Sommerzeit (MESZ)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">UTC-Offset</td>
                  <td className="py-3 pr-4">UTC+1</td>
                  <td className="py-3">UTC+2</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Status</td>
                  <td className="py-3 pr-4">Normalzeit</td>
                  <td className="py-3">K&uuml;nstlich verschoben</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Beginn 2026</td>
                  <td className="py-3 pr-4">{wz.dateFormatted}</td>
                  <td className="py-3">{sz.dateFormatted}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Uhr wird&#8230;</td>
                  <td className="py-3 pr-4">zur&uuml;ckgestellt (&minus;1h)</td>
                  <td className="py-3">vorgestellt (+1h)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Morgens</td>
                  <td className="py-3 pr-4">Fr&uuml;her hell</td>
                  <td className="py-3">Sp&auml;ter hell</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">Abends</td>
                  <td className="py-3 pr-4">Fr&uuml;her dunkel</td>
                  <td className="py-3">L&auml;nger hell</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Tipps für die Umstellung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tipps f&uuml;r die Umstellung auf Winterzeit</h2>
          <div className="space-y-3">
            {[
              { title: "Gewonnene Stunde nutzen", text: "Die zus\u00E4tzliche Stunde in der Nacht kann f\u00FCr mehr Schlaf genutzt werden \u2013 optimal f\u00FCr alle, die chronisch zu wenig schlafen." },
              { title: "Tageslicht am Nachmittag", text: "Da es abends fr\u00FCher dunkel wird, sollten Sie die Mittagspause f\u00FCr einen Spaziergang nutzen." },
              { title: "Uhren am Abend umstellen", text: "Stellen Sie analoge Uhren bereits am Samstagabend um, damit Sie am Sonntagmorgen nicht durcheinander kommen." },
              { title: "Schlafrhythmus beibehalten", text: "Gehen Sie in der ersten Woche zur gewohnten Zeit ins Bett. Ihr K\u00F6rper passt sich innerhalb weniger Tage an." },
            ].map((tip, i) => (
              <div key={i} className="bg-card-bg border border-border rounded-2xl px-5 py-4">
                <p className="text-sm font-semibold mb-1">{tip.title}</p>
                <p className="text-sm text-text-secondary">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── [PLACEHOLDER: MEZ erklärt / Zeitzone Deutschland] ── */}
        {/* SEO-Text ~60-80 Wörter: MEZ, Mitteleuropäische Zeit, CET,
            UTC+1, Winterzeit Deutschland */}

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
                Beide Termine, Eselsbr&uuml;cken & EU-Abschaffung.
              </p>
            </Link>
            <Link
              href="/sommerzeit-2026"
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
          <h2 className="text-2xl font-bold mb-6">H&auml;ufige Fragen zur Winterzeit 2026</h2>
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

        {/* ── [PLACEHOLDER: Abschlusstext] ── */}
        {/* SEO-Text ~60-80 Wörter: winterzeit 2026, uhren zurückstellen,
            CTA Zeitumstellung / Sommerzeit */}

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
