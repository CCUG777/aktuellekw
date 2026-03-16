import type { Metadata } from "next";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWTable from "@/components/KWTable";
import KWRechner from "@/components/KWRechner";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const ogTitle = `Kalender mit Kalenderwochen ${kw.year} – KW Übersicht`;
  const ogDescription = `KW Kalender ${kw.year}: Alle ${getWeeksInYear(kw.year)} Kalenderwochen auf einen Blick. Kalender mit KW-Nummern, Start- und Enddatum nach ISO 8601.`;
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
      name: `Kalender mit Kalenderwochen ${currentKW.year}`,
      description: `Kalender mit allen ${weeksInYear} Kalenderwochen des Jahres ${currentKW.year} nach ISO 8601. Aktuelle Woche: KW ${currentKW.weekNumber}.`,
      url: "https://aktuellekw.de/kalender-mit-kalenderwochen",
      inLanguage: "de-DE",
      temporalCoverage: `${currentKW.year}`,
      creator: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
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
        <h2 className="text-2xl font-semibold mb-4">
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

        {/* ── Erklärung: KW im Kalender ── Cluster 2 ─────────── */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            KW im Kalender richtig nutzen
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Die <strong className="text-text-primary">Kalenderwochen</strong> im
            ISO-8601-System starten immer am Montag. Der{" "}
            <strong className="text-text-primary">Kalender mit Wochen</strong> auf
            dieser Seite zeigt Dir für jede KW das exakte Start- und Enddatum:
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-text-primary">KW&nbsp;1 beginnt</strong>{" "}
                am {formatDateDE(allWeeks[0].startDate)}. Die erste Woche enthält
                immer den ersten Donnerstag des Jahres.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-text-primary">KW&nbsp;{weeksInYear} endet</strong>{" "}
                am {formatDateDE(allWeeks[allWeeks.length - 1].endDate)}.
                Das Jahr {currentKW.year} hat insgesamt {weeksInYear}&nbsp;Kalenderwochen.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                Jede <strong className="text-text-primary">KW im Kalender</strong>{" "}
                umfasst exakt 7&nbsp;Tage: Montag bis Sonntag nach DIN&nbsp;1355.
              </span>
            </li>
          </ul>
        </div>

        {/* ── SEO-TEXT – CLUSTER 2 ──────────────────────────────── */}
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">
            Warum ein Kalender mit Kalenderwochen?
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Kalender mit Wochen</strong>{" "}
              erleichtert die Terminplanung im Beruf und Alltag erheblich. Statt
              umständlich Tage zu zählen, genügt ein Blick auf die{" "}
              <strong className="text-text-primary">KW im Kalender</strong>, um
              Deadlines, Urlaubswochen oder Projektmeilensteine sofort einzuordnen.
              Besonders in Deutschland, Österreich und der Schweiz ist die Angabe
              der Kalenderwoche im geschäftlichen Umfeld Standard.
            </p>
            <p>
              Unser <strong className="text-text-primary">Kalender mit KW</strong>{" "}
              zeigt alle {getWeeksInYear(currentKW.year)}&nbsp;Kalenderwochen
              des Jahres {currentKW.year} mit Start- und Enddatum nach ISO&nbsp;8601.
              Die aktuelle Woche (KW&nbsp;{currentKW.weekNumber}) ist farblich
              hervorgehoben, vergangene Wochen sind abgedimmt. Ein Klick auf eine
              beliebige Woche führt zur Detailseite mit allen Informationen.
            </p>
            <p>
              Der <strong className="text-text-primary">KW Kalender</strong> eignet
              sich ideal zum Abgleich mit Outlook, Google Calendar oder gedruckten
              Wandkalendern. Über die Jahresnavigation oben kannst Du bequem
              zwischen {currentKW.year - 1} und {currentKW.year + 1} wechseln –
              so hast Du alle{" "}
              <strong className="text-text-primary">Kalenderwochen</strong> immer
              griffbereit.
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
