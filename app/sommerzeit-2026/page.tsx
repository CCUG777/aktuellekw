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
  const sz = getSommerzeitDatum(2026);
  const title = "Sommerzeit 2026: Wann wird die Uhr vorgestellt?";
  const description = `Sommerzeit 2026: Am ${sz.dateFormatted} werden die Uhren von ${sz.timeBefore} auf ${sz.timeAfter} Uhr vorgestellt. Alle Infos zu MESZ, Termine & Eselsbr\u00FCcken.`;

  return {
    title,
    description,
    alternates: { canonical: "https://aktuellekw.de/sommerzeit-2026" },
    openGraph: {
      title,
      description,
      url: "https://aktuellekw.de/sommerzeit-2026",
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
  const multiYear = getZeitumstellungenMultiYear(2024, 2030);
  const daysLeft = daysUntil(sz.date, today);
  const kwNr = getISOWeekNumber(sz.date);

  /* ── JSON-LD ── */
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://aktuellekw.de" },
      { "@type": "ListItem", position: 2, name: "Zeitumstellung 2026", item: "https://aktuellekw.de/zeitumstellung-2026" },
      { "@type": "ListItem", position: 3, name: "Sommerzeit 2026", item: "https://aktuellekw.de/sommerzeit-2026" },
    ],
  };

  const faqItems = [
    {
      q: "Wann beginnt die Sommerzeit 2026?",
      a: `Die Sommerzeit 2026 beginnt am ${formatDateLongDE(sz.date)} um ${sz.timeBefore} Uhr. Die Uhren werden eine Stunde vorgestellt auf ${sz.timeAfter} Uhr.`,
    },
    {
      q: "Wird die Uhr vor oder zur\u00FCck gestellt?",
      a: "Bei der Umstellung auf Sommerzeit wird die Uhr eine Stunde VOR gestellt. Die Nacht ist eine Stunde k\u00FCrzer, daf\u00FCr bleibt es abends l\u00E4nger hell.",
    },
    {
      q: "In welcher Kalenderwoche beginnt die Sommerzeit 2026?",
      a: `Die Sommerzeit 2026 beginnt in KW ${kwNr} (${formatDateLongDE(sz.date)}).`,
    },
    {
      q: "Was ist MESZ?",
      a: "MESZ steht f\u00FCr Mitteleurop\u00E4ische Sommerzeit (englisch: CEST). Sie entspricht UTC+2 und gilt in Deutschland von Ende M\u00E4rz bis Ende Oktober.",
    },
    {
      q: "Wann endet die Sommerzeit 2026?",
      a: `Die Sommerzeit 2026 endet am ${formatDateLongDE(wz.date)} um ${wz.timeBefore} Uhr, wenn die Uhren auf ${wz.timeAfter} Uhr zur\u00FCckgestellt werden (Winterzeit/MEZ).`,
    },
    {
      q: "Warum wird die Uhr im Fr\u00FChling vorgestellt?",
      a: "Durch das Vorstellen der Uhr um eine Stunde wird abends das Tageslicht besser genutzt. Die l\u00E4ngere Helligkeit am Abend soll Energie sparen und Freizeitaktivit\u00E4ten f\u00F6rdern.",
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
            Wann wird die Uhr vorgestellt? Alle Infos zur Sommerzeit 2026 in Deutschland.
          </p>

          {/* Hero Card */}
          <div className="bg-card-bg border border-border rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-xs uppercase tracking-widest text-accent mb-2">Beginn Sommerzeit</p>
            <p className="text-3xl font-bold mb-1">{formatDateLongDE(sz.date)}</p>
            <p className="text-lg text-text-secondary">
              {sz.timeBefore} &rarr; {sz.timeAfter} Uhr <span className="text-accent font-medium">(Uhr vor)</span>
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-text-secondary">
              <span>KW {kwNr}</span>
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

        {/* ── [PLACEHOLDER: Einleitungstext Sommerzeit] ── */}
        {/* SEO-Text ~150-200 Wörter: sommerzeit, sommerzeit 2026,
            wann beginnt sommerzeit 2026, sommerzeit beginn 2026 */}

        {/* ── Was passiert ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Was passiert bei der Umstellung auf Sommerzeit?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card-bg border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-accent mb-2">-1h</p>
              <p className="text-sm font-medium">K&uuml;rzere Nacht</p>
              <p className="text-xs text-text-secondary mt-1">Die Nacht vom 28. auf 29. M&auml;rz 2026 ist eine Stunde k&uuml;rzer</p>
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

        {/* ── [PLACEHOLDER: Sommerzeit in Europa] ── */}
        {/* SEO-Text ~80-120 Wörter: EU-Länder, Schweiz, Richtlinie 2000/84/EG,
            einheitliche Regelung */}

        {/* ── Sommerzeit-Termine Jahresübersicht ── */}
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
            Regel: Immer am letzten Sonntag im M&auml;rz um 02:00 Uhr.
          </p>
        </section>

        {/* ── Tipps für die Umstellung ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tipps f&uuml;r die Umstellung auf Sommerzeit</h2>
          <div className="space-y-3">
            {[
              { title: "Schrittweise anpassen", text: "Gehen Sie in den Tagen vor der Umstellung jeweils 15\u201320 Minuten fr\u00FCher ins Bett." },
              { title: "Morgens Tageslicht tanken", text: "Tageslicht am Morgen hilft der inneren Uhr, sich schneller anzupassen." },
              { title: "Ger\u00E4te pr\u00FCfen", text: "Smartphones und Computer stellen sich automatisch um. Analoge Uhren, Mikrowelle und Backofen m\u00FCssen manuell umgestellt werden." },
              { title: "Abends wenig blaues Licht", text: "Vermeiden Sie in den ersten Tagen helles Bildschirmlicht vor dem Schlafengehen." },
            ].map((tip, i) => (
              <div key={i} className="bg-card-bg border border-border rounded-2xl px-5 py-4">
                <p className="text-sm font-semibold mb-1">{tip.title}</p>
                <p className="text-sm text-text-secondary">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── [PLACEHOLDER: MESZ erkl\u00E4rt] ── */}
        {/* SEO-Text ~60-80 Wörter: MESZ, Mitteleuropäische Sommerzeit, CEST,
            UTC+2, Unterschied MEZ MESZ */}

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
              href="/winterzeit-2026"
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
          <h2 className="text-2xl font-bold mb-6">H&auml;ufige Fragen zur Sommerzeit 2026</h2>
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
        {/* SEO-Text ~60-80 Wörter: sommerzeit 2026, uhren vorstellen,
            CTA Zeitumstellung / Winterzeit */}

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
