import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUNDESLAENDER, CONTENT_YEARS } from "@/lib/constants";
import {
  getAllSchulferienForYear,
  sortFerien,
  formatDateShort,
  gesamtFerientage,
} from "@/lib/schulferien";
import LastUpdated from "@/components/LastUpdated";

export const revalidate = 86400; // 24h

/* ── Static Params ──────────────────────────────────────────── */

export function generateStaticParams() {
  return CONTENT_YEARS.map((y) => ({ jahr: String(y) }));
}

/* ── Metadata ───────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jahr: string }>;
}): Promise<Metadata> {
  const { jahr } = await params;
  const year = parseInt(jahr, 10);

  const title = `Schulferien ${year} – Alle Bundesländer`;
  const description = `Schulferien ${year} für alle 16 Bundesländer: Termine, Dauer und Ferienkalender. Osterferien, Sommerferien, Herbstferien & Weihnachtsferien ${year}.`;
  const url = `https://aktuellekw.de/schulferien/${year}`;

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

/* ── Page ───────────────────────────────────────────────────── */

export default async function SchulferienJahrPage({
  params,
}: {
  params: Promise<{ jahr: string }>;
}) {
  const { jahr } = await params;
  const year = parseInt(jahr, 10);

  if (isNaN(year) || year < 2020 || year > 2100) notFound();

  const allData = await getAllSchulferienForYear(year);
  if (allData.length === 0) notFound();

  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = CONTENT_YEARS.includes(prevYear);
  const hasNext = CONTENT_YEARS.includes(nextYear);

  return (
    <>
      {/* JSON-LD: Dataset Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            inLanguage: "de-DE",
            name: `Schulferien ${year} Deutschland`,
            description: `Schulferien-Termine ${year} für alle 16 deutschen Bundesländer nach offiziellen Angaben der Kultusministerien.`,
            temporalCoverage: `${year}`,
            spatial: {
              "@type": "Place",
              name: "Deutschland",
            },
            creator: {
              "@type": "Organization",
              name: "aktuellekw.de",
              url: "https://aktuellekw.de",
            },
            license: "https://creativecommons.org/licenses/by/4.0/",
          }),
        }}
      />

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "@id": `https://aktuellekw.de/schulferien/${year}#breadcrumb`,
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
                name: `Schulferien ${year}`,
                item: `https://aktuellekw.de/schulferien/${year}`,
              },
            ],
          }),
        }}
      />

      <main className="min-h-screen pb-16">
        {/* Hero */}
        <section className="pt-12 pb-10 text-center px-4">
          <p className="text-xs uppercase tracking-widest text-text-secondary mb-3">
            Schulferien Deutschland
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Schulferien{" "}
            <span className="text-accent">{year}</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto leading-relaxed">
            Alle Schulferien-Termine {year} für die 16 deutschen Bundesländer
            im Überblick – von den Winterferien bis zu den Weihnachtsferien.
          </p>

          {/* Jahr-Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {hasPrev ? (
              <Link
                href={`/schulferien/${prevYear}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:border-accent transition-all"
              >
                ← {prevYear}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-surface-secondary/40 px-4 py-2 text-sm font-medium text-text-secondary/40 cursor-not-allowed">
                ← {prevYear}
              </span>
            )}
            <span className="text-sm font-semibold text-accent">{year}</span>
            {hasNext ? (
              <Link
                href={`/schulferien/${nextYear}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:border-accent transition-all"
              >
                {nextYear} →
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-surface-secondary/40 px-4 py-2 text-sm font-medium text-text-secondary/40 cursor-not-allowed">
                {nextYear} →
              </span>
            )}
          </div>
        </section>

        {/* Bundesländer-Karten */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="grid gap-4 sm:grid-cols-2">
            {allData
              .sort((a, b) => a.bundesland.localeCompare(b.bundesland, "de"))
              .map((bl) => {
                const ferien = sortFerien(bl.ferien);
                const totalTage = gesamtFerientage(bl.ferien);
                return (
                  <Link
                    key={bl.slug}
                    href={`/schulferien/${year}/${bl.slug}`}
                    className="block rounded-2xl border border-border bg-surface-secondary/50 p-5 hover:border-accent/50 hover:bg-surface-secondary transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">
                        {bl.bundesland}
                      </h2>
                      <span className="text-xs text-text-secondary bg-surface-secondary rounded-full px-2.5 py-1 font-medium">
                        {bl.code}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {ferien.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-text-secondary">
                            {f.name}
                          </span>
                          <span className="text-text-primary font-medium tabular-nums">
                            {formatDateShort(f.starts_on)} – {formatDateShort(f.ends_on)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="text-xs text-text-secondary">
                        {ferien.length} Ferienzeiten · {totalTage} Tage
                      </span>
                      <span className="text-xs text-accent font-medium group-hover:translate-x-0.5 transition-transform">
                        Details →
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>

        {/* Vergleichstabelle */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-semibold mb-4">
            Ferienvergleich {year} – Alle Bundesländer
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-semibold text-text-primary sticky left-0 bg-surface-secondary z-10">
                    Bundesland
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-text-primary">
                    Ferienzeiten
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-text-primary">
                    Tage gesamt
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-text-primary whitespace-nowrap">
                    Nächste Ferien
                  </th>
                </tr>
              </thead>
              <tbody>
                {allData
                  .sort((a, b) => a.bundesland.localeCompare(b.bundesland, "de"))
                  .map((bl) => {
                    const ferien = sortFerien(bl.ferien);
                    const totalTage = gesamtFerientage(bl.ferien);
                    const today = new Date().toISOString().split("T")[0];
                    const naechste = ferien.find((f) => f.ends_on >= today);
                    return (
                      <tr
                        key={bl.slug}
                        className="border-t border-border/50 hover:bg-surface-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium sticky left-0 bg-surface z-10">
                          <Link
                            href={`/schulferien/${year}/${bl.slug}`}
                            className="hover:text-accent transition-colors"
                          >
                            {bl.bundesland}
                          </Link>
                        </td>
                        <td className="text-center px-3 py-3 tabular-nums">
                          {ferien.length}
                        </td>
                        <td className="text-center px-3 py-3 tabular-nums font-medium">
                          {totalTage}
                        </td>
                        <td className="text-center px-3 py-3 text-text-secondary whitespace-nowrap">
                          {naechste
                            ? `${naechste.name} (${formatDateShort(naechste.starts_on)})`
                            : "–"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Info-Bereich */}
        <section className="max-w-2xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-semibold mb-3">
            Schulferien {year} in Deutschland
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die Schulferien in Deutschland werden von den Kultusministerien der
              einzelnen Bundesländer festgelegt. Daher unterscheiden sich die
              Ferientermine von Bundesland zu Bundesland teilweise erheblich.
            </p>
            <p>
              Die Sommerferien werden durch das Hamburger Abkommen koordiniert,
              um eine bundesweite Entzerrung zu erreichen. Alle anderen
              Ferienzeiten (Herbst-, Weihnachts-, Winter-, Oster- und
              Pfingstferien) legen die Länder eigenständig fest.
            </p>
            <p>
              Datenquelle: Die Ferientermine werden automatisch über die API von{" "}
              <a
                href="https://www.mehr-schulferien.de"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-accent hover:underline"
              >
                mehr-schulferien.de
              </a>{" "}
              bezogen und regelmäßig aktualisiert (Stand: {allData[0]?.lastUpdated || "–"}).
            </p>
          </div>
        </section>

        <LastUpdated date={year === new Date().getFullYear() ? new Date() : new Date(`${year}-01-01`)} />
        {/* Interne Verlinkung */}
        <section className="max-w-2xl mx-auto px-4 pb-8">
          <nav className="flex flex-wrap gap-2 justify-center" aria-label="Weiterführende Links">
            <Link
              href="/"
              className="rounded-full border border-border bg-surface-secondary px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-accent hover:border-accent transition-all"
            >
              Aktuelle KW
            </Link>
            <Link
              href="/kalenderwoche"
              className="rounded-full border border-border bg-surface-secondary px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-accent hover:border-accent transition-all"
            >
              Kalenderwochen {year}
            </Link>
            <Link
              href="/faq"
              className="rounded-full border border-border bg-surface-secondary px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-accent hover:border-accent transition-all"
            >
              FAQ
            </Link>
          </nav>
        </section>
      </main>
    </>
  );
}
