import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUNDESLAENDER, CONTENT_YEARS } from "@/lib/constants";
import {
  getSchulferien,
  sortFerien,
  formatDateShort,
  ferienDauer,
  gesamtFerientage,
  getBundeslandBySlug,
} from "@/lib/schulferien";
import { getISOWeekNumber } from "@/lib/kw";

export const revalidate = 86400; // 24h

/* ── Static Params ──────────────────────────────────────────── */

export function generateStaticParams() {
  return CONTENT_YEARS.flatMap((year) =>
    BUNDESLAENDER.map((bl) => ({
      jahr: String(year),
      bundesland: bl.slug,
    }))
  );
}

/* ── Metadata ───────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jahr: string; bundesland: string }>;
}): Promise<Metadata> {
  const { jahr, bundesland: slug } = await params;
  const year = parseInt(jahr, 10);
  const bl = getBundeslandBySlug(slug);
  if (!bl) return {};

  const title = `Schulferien ${bl.name} ${year}`;
  const description = `Schulferien ${year} in ${bl.name}: Alle Ferientermine von Winterferien bis Weihnachtsferien. Osterferien, Sommerferien, Herbstferien ${bl.name} ${year} im Überblick.`;
  const url = `https://aktuellekw.de/schulferien/${year}/${slug}`;

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

export default async function SchulferienBundeslandPage({
  params,
}: {
  params: Promise<{ jahr: string; bundesland: string }>;
}) {
  const { jahr, bundesland: slug } = await params;
  const year = parseInt(jahr, 10);

  if (isNaN(year) || year < 2020 || year > 2100) notFound();

  const bl = getBundeslandBySlug(slug);
  if (!bl) notFound();

  const data = await getSchulferien(slug, year);
  if (!data) notFound();

  const ferien = sortFerien(data.ferien);
  const totalTage = gesamtFerientage(data.ferien);
  const today = new Date().toISOString().split("T")[0];

  const prevYear = year - 1;
  const nextYear = year + 1;
  const hasPrev = CONTENT_YEARS.includes(prevYear);
  const hasNext = CONTENT_YEARS.includes(nextYear);

  const TAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  function getWeekday(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00Z");
    return TAGE[d.getUTCDay()];
  }

  return (
    <>
      {/* JSON-LD: Dataset Schema mit Publikationsdaten */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            inLanguage: "de-DE",
            datePublished: `${year}-01-01`,
            dateModified: `${year}-01-01`,
            name: `Schulferien ${bl.name} ${year}`,
            description: `Schulferien ${year} in ${bl.name}: alle Ferientermine nach offiziellen Angaben der Kultusministerien.`,
            temporalCoverage: `${year}`,
            spatial: { "@type": "Place", name: bl.name, address: { "@type": "PostalAddress", addressCountry: "DE", addressRegion: bl.code } },
            creator: { "@type": "Organization", name: "aktuellekw.de", url: "https://aktuellekw.de" },
          }),
        }}
      />

      {/* JSON-LD: Event Schema pro Ferienzeit */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            ferien.map((f) => ({
              "@context": "https://schema.org",
              "@type": "Event",
              name: `${f.name} ${bl.name} ${year}`,
              startDate: f.starts_on,
              endDate: f.ends_on,
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: bl.name,
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "DE",
                  addressRegion: bl.code,
                },
              },
              description: `${f.name} in ${bl.name}: ${formatDateShort(f.starts_on)} bis ${formatDateShort(f.ends_on)} (${ferienDauer(f.starts_on, f.ends_on)} Tage)`,
            }))
          ),
        }}
      />

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "@id": `https://aktuellekw.de/schulferien/${year}/${slug}#breadcrumb`,
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
              {
                "@type": "ListItem",
                position: 3,
                name: bl.name,
                item: `https://aktuellekw.de/schulferien/${year}/${slug}`,
              },
            ],
          }),
        }}
      />

      <main className="min-h-screen pb-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-3xl mx-auto px-4 pt-6 pb-2"
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Startseite
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link
                href={`/schulferien/${year}`}
                className="hover:text-accent transition-colors"
              >
                Schulferien {year}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-text-primary font-medium">{bl.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="pt-4 pb-8 text-center px-4">
          <p className="text-xs uppercase tracking-widest text-text-secondary mb-2">
            Schulferien {bl.code}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Schulferien{" "}
            <span className="text-accent">{bl.name}</span>{" "}
            {year}
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto leading-relaxed text-sm">
            Alle {ferien.length} Ferienzeiten mit insgesamt {totalTage} Ferientagen
            in {bl.name} {year} auf einen Blick.
          </p>

          {/* Jahr-Navigation */}
          <div className="flex items-center justify-center gap-4 mt-5">
            {hasPrev ? (
              <Link
                href={`/schulferien/${prevYear}/${slug}`}
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
                href={`/schulferien/${nextYear}/${slug}`}
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

        {/* Ferien-Tabelle */}
        <section className="max-w-3xl mx-auto px-4 pb-10">
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary">
                  <th className="text-left px-4 py-3 font-semibold">Ferienart</th>
                  <th className="text-left px-3 py-3 font-semibold">Zeitraum</th>
                  <th className="text-center px-3 py-3 font-semibold">Tage</th>
                  <th className="text-center px-3 py-3 font-semibold hidden sm:table-cell">KW</th>
                </tr>
              </thead>
              <tbody>
                {ferien.map((f, i) => {
                  const dauer = ferienDauer(f.starts_on, f.ends_on);
                  const isActive = today >= f.starts_on && today <= f.ends_on;
                  const isPast = today > f.ends_on;
                  const kwStart = getISOWeekNumber(new Date(f.starts_on + "T00:00:00Z"));
                  const kwEnd = getISOWeekNumber(new Date(f.ends_on + "T00:00:00Z"));

                  return (
                    <tr
                      key={i}
                      className={`border-t border-border/50 transition-colors ${
                        isActive
                          ? "bg-accent/10"
                          : isPast
                          ? "opacity-60"
                          : "hover:bg-surface-secondary/30"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                          )}
                          {f.name}
                        </div>
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        <span className="hidden sm:inline">{getWeekday(f.starts_on)}, </span>
                        {formatDateShort(f.starts_on)}
                        <span className="text-text-secondary"> – </span>
                        <span className="hidden sm:inline">{getWeekday(f.ends_on)}, </span>
                        {formatDateShort(f.ends_on)}
                      </td>
                      <td className="text-center px-3 py-3 tabular-nums font-semibold">
                        {dauer}
                      </td>
                      <td className="text-center px-3 py-3 tabular-nums text-text-secondary hidden sm:table-cell">
                        {kwStart === kwEnd ? (
                          <Link href={`/kw/${kwStart}-${year}`} className="hover:text-accent transition-colors">
                            KW {kwStart}
                          </Link>
                        ) : (
                          <>
                            <Link href={`/kw/${kwStart}-${year}`} className="hover:text-accent transition-colors">
                              {kwStart}
                            </Link>
                            –
                            <Link href={`/kw/${kwEnd}-${year}`} className="hover:text-accent transition-colors">
                              {kwEnd}
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-surface-secondary">
                  <td className="px-4 py-3 font-semibold">Gesamt</td>
                  <td className="px-3 py-3 text-text-secondary">{ferien.length} Ferienzeiten</td>
                  <td className="text-center px-3 py-3 font-bold text-accent tabular-nums">{totalTage}</td>
                  <td className="hidden sm:table-cell" />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Ferienbalken-Visualisierung */}
        <section className="max-w-3xl mx-auto px-4 pb-10">
          <h2 className="text-lg font-semibold mb-3">Ferienverteilung {year}</h2>
          <div className="space-y-2">
            {ferien.map((f, i) => {
              const dauer = ferienDauer(f.starts_on, f.ends_on);
              const maxDauer = Math.max(...ferien.map((x) => ferienDauer(x.starts_on, x.ends_on)));
              const pct = Math.round((dauer / maxDauer) * 100);
              const isActive = today >= f.starts_on && today <= f.ends_on;

              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary w-32 sm:w-40 truncate shrink-0">
                    {f.name}
                  </span>
                  <div className="flex-1 h-6 bg-surface-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isActive ? "bg-accent" : "bg-accent/60"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums w-10 text-right shrink-0">
                    {dauer} T.
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Andere Bundesländer */}
        <section className="max-w-3xl mx-auto px-4 pb-10">
          <h2 className="text-lg font-semibold mb-3">
            Schulferien {year} in anderen Bundesländern
          </h2>
          <div className="flex flex-wrap gap-2">
            {BUNDESLAENDER.filter((b) => b.slug !== slug)
              .sort((a, b) => a.name.localeCompare(b.name, "de"))
              .map((b) => (
                <Link
                  key={b.slug}
                  href={`/schulferien/${year}/${b.slug}`}
                  className="rounded-full border border-border bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-accent hover:border-accent transition-all"
                >
                  {b.name}
                </Link>
              ))}
          </div>
        </section>

        {/* Interne Verlinkung */}
        <section className="max-w-2xl mx-auto px-4 pb-8">
          <nav className="flex flex-wrap gap-2 justify-center" aria-label="Weiterführende Links">
            <Link
              href={`/schulferien/${year}`}
              className="rounded-full border border-border bg-surface-secondary px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-accent hover:border-accent transition-all"
            >
              Alle Bundesländer {year}
            </Link>
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
