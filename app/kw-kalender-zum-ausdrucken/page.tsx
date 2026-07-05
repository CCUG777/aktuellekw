import type { Metadata } from "next";
import { getCurrentKW } from "@/lib/kw";
import CalendarPrintSection from "@/components/CalendarPrintSection";
import AuthorByline from "@/components/AuthorByline";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const year = getCurrentKW().year;
  const title = `KW-Kalender ${year} zum Ausdrucken (PDF & Excel)`;
  const description = `Jahreskalender ${year} mit Kalenderwochen und Feiertagen – kostenlos als PDF oder Excel. DIN A4/A3, Quer- oder Hochformat, ein Blatt, sofort druckbereit.`;
  return {
    title,
    description,
    alternates: {
      canonical: "https://aktuellekw.de/kw-kalender-zum-ausdrucken",
    },
    openGraph: {
      title,
      description,
      url: "https://aktuellekw.de/kw-kalender-zum-ausdrucken",
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

export default function KwKalenderAusdruckenPage() {
  const year = getCurrentKW().year;

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "https://aktuellekw.de/kw-kalender-zum-ausdrucken#breadcrumb",
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
            name: `KW-Kalender ${year} zum Ausdrucken`,
            item: "https://aktuellekw.de/kw-kalender-zum-ausdrucken",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* ── Breadcrumb ───────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">›</span>
          <span className="text-text-primary">
            KW-Kalender {year} zum Ausdrucken
          </span>
        </nav>

        {/* ── H1 + Intro ───────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          KW-Kalender {year} zum Ausdrucken
        </h1>
        <p className="text-text-secondary leading-relaxed mb-2">
          Das ganze Jahr {year} auf einem Blatt: Jahreskalender mit allen{" "}
          <strong className="text-text-primary">Kalenderwochen nach ISO&nbsp;8601</strong>{" "}
          und den bundesweiten Feiertagen – kostenlos als PDF oder Excel. Wähle
          Format, Ausrichtung und Papiergröße und drucke ihn direkt aus.
        </p>

        {/* ── Konfigurator + Download (bestehende Komponente) ──── */}
        <CalendarPrintSection year={year} />

        {/* ── Ergänzender Nutzwert-Text ────────────────────────── */}
        <div className="mt-12 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-2xl font-semibold text-text-primary">
            Was der KW-Kalender {year} enthält
          </h2>
          <p>
            Der Kalender listet jeden Monat als kompakte Wochentabelle (Mo–So)
            mit vorangestellter <strong className="text-text-primary">KW-Nummer</strong>.
            Feiertage sind optional farblich markiert und in einer Legende
            aufgeführt. Wochenenden sind dezent hervorgehoben. So siehst Du auf
            einen Blick, in welcher Kalenderwoche ein Termin liegt – ideal für
            Projektplanung, Schichtdienst oder Urlaubsabsprachen.
          </p>
          <p>
            Für einzelne Wochen findest Du zusätzliche Details – inklusive
            Feiertagen, Arbeitstagen und Schulferien – auf den{" "}
            <a
              href={`/kalenderwochen/${year}`}
              className="text-accent hover:underline"
            >
              KW-Seiten {year}
            </a>
            . Wie die Wochenzählung funktioniert, erklärt die Seite{" "}
            <a href="/kalenderwoche" className="text-accent hover:underline">
              Kalenderwoche: Definition &amp; Berechnung
            </a>
            .
          </p>
        </div>

        {/* ── Author ───────────────────────────────────────────── */}
        <div className="mt-10">
          <AuthorByline date={new Date()} />
        </div>

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-6 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href={`/kalenderwochen/${year}`} className="text-accent hover:underline">
            Alle Kalenderwochen {year}
          </a>
        </div>
      </section>
    </>
  );
}
