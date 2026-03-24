import type { Metadata } from "next";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWTable from "@/components/KWTable";
import KWRechner from "@/components/KWRechner";
import CalendarPrintSection from "@/components/CalendarPrintSection";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const ogTitle = `Kalender mit Kalenderwochen ${kw.year} – KW Übersicht`;
  const ogDescription = `Kalender ${kw.year} mit Kalenderwochen: Alle ${getWeeksInYear(kw.year)} KW auf einen Blick – Nummern, Start- & Enddatum. ✓ ISO 8601 ✓ Übersichtlich.`;
  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: "https://aktuellekw.de/kalender-mit-kalenderwochen",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://aktuellekw.de/kalender-mit-kalenderwochen",
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

export default function KalenderMitKalenderwochenPage() {
  const currentKW = getCurrentKW();
  const allWeeks = getAllKWsForYear(currentKW.year);
  const weeksInYear = getWeeksInYear(currentKW.year);
  const prevYear = currentKW.year - 1;
  const nextYear = currentKW.year + 1;

  const pageJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://aktuellekw.de/kalender-mit-kalenderwochen#breadcrumb",
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
          name: `Kalender mit Kalenderwochen ${currentKW.year}`,
          item: "https://aktuellekw.de/kalender-mit-kalenderwochen",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": "https://aktuellekw.de/kalender-mit-kalenderwochen#dataset",
      isPartOf: { "@id": "https://aktuellekw.de/#website" },
      datePublished: "2026-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      name: `Kalender mit Kalenderwochen ${currentKW.year}`,
      description: `Kalender mit allen ${weeksInYear} Kalenderwochen des Jahres ${currentKW.year} nach ISO 8601. Aktuelle Woche: KW ${currentKW.weekNumber}.`,
      url: "https://aktuellekw.de/kalender-mit-kalenderwochen",
      inLanguage: "de-DE",
      temporalCoverage: `${currentKW.year}`,
      creator: { "@id": "https://aktuellekw.de/#organization" },
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden="true">›</span>
          <span className="text-text-primary">
            Kalender mit Kalenderwochen {currentKW.year}
          </span>
        </nav>

        {/* ── H1 + Intro ── Cluster 2 ─────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Kalender mit Wochen {currentKW.year}
        </h1>
        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Unser <strong className="text-text-primary">Kalender mit Kalenderwochen</strong>{" "}
            zeigt Dir alle {weeksInYear}&nbsp;<strong className="text-text-primary">Kalenderwochen</strong>{" "}
            des Jahres {currentKW.year} auf einen Blick. Die aktuelle Woche ist
            die <strong className="text-text-primary">KW&nbsp;{currentKW.weekNumber}</strong>{" "}
            ({formatDateDE(currentKW.startDate)} – {formatDateDE(currentKW.endDate)}).
          </p>
          <p>
            Der <strong className="text-text-primary">Kalender mit KW</strong>-Nummern hilft
            Dir bei der Planung von Projekten, Urlauben und Terminen. Alle{" "}
            <strong className="text-text-primary">KW im Kalender</strong> sind
            nach ISO&nbsp;8601 berechnet – Wochen beginnen am Montag.
          </p>
        </div>

        {/* ── H2: Kalenderwochen ──────────────────────────────── */}
        <h2 id="kalenderwochen-im-ueberblick" className="text-2xl font-semibold mb-4">
          Kalenderwochen {currentKW.year} im Überblick
        </h2>
        <p className="text-text-secondary text-sm mb-5 leading-relaxed">
          Der <strong className="text-text-primary">KW Kalender</strong> zeigt alle{" "}
          {weeksInYear}&nbsp;Wochen mit Start- und Enddatum. Die aktuelle
          KW&nbsp;{currentKW.weekNumber} ist blau hervorgehoben. Klicke auf eine
          beliebige Woche, um Start- und Enddatum sowie weitere Details zu sehen.
        </p>

        {/* Year navigation */}
        <nav
          aria-label="Jahresnavigation"
          className="flex items-center gap-2 mb-8"
        >
          <a
            href={`/kalenderwochen/${prevYear}`}
            className="flex items-center gap-1.5 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
          >
            <span className="text-text-secondary">←</span>
            <span className="text-text-primary font-medium">{prevYear}</span>
            <span className="text-text-secondary text-xs">
              ({getWeeksInYear(prevYear)}&nbsp;KW)
            </span>
          </a>
          <span className="flex-1 text-center text-sm font-semibold text-accent">
            {currentKW.year}
          </span>
          <a
            href={`/kalenderwochen/${nextYear}`}
            className="flex items-center gap-1.5 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
          >
            <span className="text-text-secondary text-xs">
              ({getWeeksInYear(nextYear)}&nbsp;KW)
            </span>
            <span className="text-text-primary font-medium">{nextYear}</span>
            <span className="text-text-secondary">→</span>
          </a>
        </nav>

        {/* ── KW-Tabelle ──────────────────────────────────────── */}
        <KWTable weeks={allWeeks} currentWeek={currentKW.weekNumber} />

        {/* ── KW Rechner ──────────────────────────────────────── */}
        <div className="mt-10">
          <KWRechner />
        </div>

        {/* ── Kalender zum Ausdrucken ── Cluster C1 ─────────── */}
        <CalendarPrintSection year={currentKW.year} />

        {/* ── KW in Kalender-Apps aktivieren ── einzigartig ──── */}
        <div className="mt-14">
          <h2 id="kw-in-kalender-apps-aktivieren" className="text-2xl font-semibold mb-4">
            KW im Kalender aktivieren – App-Vergleich
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            Viele <strong className="text-text-primary">Kalender</strong> zeigen
            Kalenderwochen nicht automatisch an. So aktivierst Du die{" "}
            <strong className="text-text-primary">KW im Kalender</strong> in den
            gängigsten Apps:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">App</th>
                  <th className="text-left py-2 pr-4">Pfad</th>
                  <th className="text-left py-2">ISO 8601</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">iPhone / iPad</td>
                  <td className="py-2.5 pr-4">Einstellungen → Kalender → Wochennummern</td>
                  <td className="py-2.5 text-green-500">✓ Standard</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Google Kalender</td>
                  <td className="py-2.5 pr-4">Einstellungen → Ansicht → Wochennummern anzeigen</td>
                  <td className="py-2.5 text-green-500">✓ Standard</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Outlook (Desktop)</td>
                  <td className="py-2.5 pr-4">Datei → Optionen → Kalender → Wochennummern</td>
                  <td className="py-2.5 text-yellow-500">⚠ Einstellung prüfen</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Outlook 365 (Web)</td>
                  <td className="py-2.5 pr-4">Zahnrad → Kalender → Wochennummern anzeigen</td>
                  <td className="py-2.5 text-yellow-500">⚠ Einstellung prüfen</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Samsung Kalender</td>
                  <td className="py-2.5 pr-4">Menü → Einstellungen → Wochennummern anzeigen</td>
                  <td className="py-2.5 text-green-500">✓ Standard</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-text-primary">Thunderbird</td>
                  <td className="py-2.5 pr-4">Einstellungen → Kalender → Wochennummern in Monatsansicht</td>
                  <td className="py-2.5 text-green-500">✓ Standard</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-3">
            ⚠ = Outlook nutzt je nach Regioneinstellung das US-System (Woche beginnt
            am Sonntag). Stelle unter „Erste Woche des Jahres" → „Erste 4-Tage-Woche"
            ein, um ISO&nbsp;8601 zu erhalten.
          </p>
        </div>

        {/* ── Kalender mit vs. ohne KW ────────────────────────── */}
        <section className="mt-12 space-y-4">
          <h2 id="kalender-mit-oder-ohne-kw" className="text-2xl font-semibold mb-4">
            Kalender mit oder ohne Kalenderwochen – was ist besser?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Kalender mit Kalenderwochen</strong>{" "}
              lohnt sich besonders, wenn Du beruflich mit Lieferfristen, Sprint-Zyklen
              oder Gehaltsabrechnungen arbeitest. In Deutschland, Österreich und der
              Schweiz sind KW-Angaben im Geschäftsverkehr üblich – Formulierungen
              wie „Lieferung KW&nbsp;15" oder „Fertigstellung bis KW&nbsp;22"
              setzen voraus, dass alle Beteiligten die gleiche Wochennummerierung nutzen.
            </p>
            <p>
              Ohne <strong className="text-text-primary">KW im Kalender</strong> müsstest
              Du jedes Mal manuell zählen oder nachschlagen, in welche Woche ein
              bestimmtes Datum fällt. Das kostet Zeit und ist fehleranfällig – besonders
              bei Jahresübergängen, wenn KW&nbsp;1 bereits im Dezember des Vorjahres
              beginnen kann (wie {currentKW.year}: KW&nbsp;1 startet am{" "}
              {formatDateDE(allWeeks[0].startDate)}).
            </p>
            <p>
              Unser <strong className="text-text-primary">Kalender mit KW</strong> zeigt
              Dir alle {weeksInYear}&nbsp;Wochen des Jahres {currentKW.year} auf einen
              Blick. Die aktuelle KW&nbsp;{currentKW.weekNumber} ist blau markiert,
              sodass Du sofort erkennst, wo im Jahr Du Dich befindest. Für die genaue
              Zuordnung eines beliebigen Datums nutze den{" "}
              <a href="#kw-rechner-input" className="text-accent hover:underline">
                KW-Rechner
              </a>{" "}
              oben.
            </p>
          </div>
        </section>

        {/* ── Abschluss-Links ────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {currentKW.year}
          </a>
          <a href="/kalenderwochen-uebersicht" className="text-accent hover:underline">
            KW-Übersicht →
          </a>
          <a href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche →
          </a>
        </div>
      </section>
    </>
  );
}
