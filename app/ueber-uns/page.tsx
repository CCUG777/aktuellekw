import type { Metadata } from "next";
import Link from "next/link";
import LastUpdated from "@/components/LastUpdated";

export const metadata: Metadata = {
  title: {
    absolute: "Über uns | aktuellekw.de – Planung & Termine",
  },
  description:
    "aktuellekw.de – Deine Anlaufstelle für Kalenderwoche, Feiertage, Schulferien & Zeitplanungs-Tools. ✓ Tagesaktuell ✓ ISO 8601.",
  alternates: {
    canonical: "https://aktuellekw.de/ueber-uns",
  },
  openGraph: {
    title: "Über uns | aktuellekw.de – Planung & Termine",
    description:
      "Erfahre mehr über aktuellekw.de: Deine Anlaufstelle für die aktuelle Kalenderwoche, Feiertage, Schulferien und nützliche Zeitplanungs-Tools.",
    url: "https://aktuellekw.de/ueber-uns",
    type: "website",
    locale: "de_DE",
    siteName: "aktuellekw.de",
  },
  twitter: {
    card: "summary_large_image",
    title: "Über uns | aktuellekw.de – Planung & Termine",
    description:
      "Erfahre mehr über aktuellekw.de: Deine Anlaufstelle für die aktuelle Kalenderwoche, Feiertage, Schulferien und Zeitplanungs-Tools.",
  },
};

function PageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://aktuellekw.de/ueber-uns#aboutpage",
        name: "Über aktuellekw.de",
        description:
          "Informationen über aktuellekw.de – die zuverlässige Anlaufstelle für Kalenderwochen, Feiertage und Zeitplanung.",
        url: "https://aktuellekw.de/ueber-uns",
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        datePublished: "2026-03-16",
        dateModified: "2026-03-16",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://aktuellekw.de/ueber-uns#breadcrumb",
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
            name: "Über uns",
            item: "https://aktuellekw.de/ueber-uns",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function UeberUnsPage() {
  return (
    <>
      <PageJsonLd />

      <section className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            Startseite
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-text-primary">Über uns</span>
        </nav>

        {/* ── H1 ──────────────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Über aktuellekw.de – Dein Zeit-Kompass im Alltag
        </h1>

        <p className="text-text-secondary mb-8 leading-relaxed">
          Hast du dich heute auch schon gefragt: „Welche Kalenderwoche haben wir
          eigentlich gerade?" In einer Welt, die immer schneller wird, ist eine
          gute Zeitplanung das A und O. Egal ob im Job, bei der Urlaubsplanung
          oder im Schulalltag – wir von aktuellekw.de sind deine zuverlässige
          Anlaufstelle für alles rund um das Datum und die Zeitrechnung.
        </p>

        {/* ── Wer wir sind ────────────────────────────────────── */}
        <h2 id="wer-wir-sind-und-was-wir-dir-bieten" className="text-2xl font-semibold mb-4">
          Wer wir sind und was wir dir bieten
        </h2>

        <p className="text-text-secondary mb-6 leading-relaxed">
          Unsere Mission ist simpel: Wir möchten dir die Suche nach
          zeitrelevanten Informationen so einfach wie möglich machen. Wir wissen,
          dass Details wie die{" "}
          <Link href="/" className="text-accent hover:underline">
            aktuelle KW
          </Link>{" "}
          oder der nächste Brückentag oft entscheidend für deine Organisation
          sind. Deshalb bündeln wir alle wichtigen Daten übersichtlich auf einer
          Plattform.
        </p>

        <div className="space-y-3 mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
            Was du bei uns findest
          </h3>

          <div className="bg-surface-secondary border border-border rounded-2xl p-6 space-y-4">
            <div>
              <p className="font-medium text-text-primary mb-1">
                Die{" "}
                <Link href="/" className="text-accent hover:underline">
                  aktuelle Kalenderwoche
                </Link>
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Sofort im Blick, damit du bei deiner Terminplanung nie
                danebenliegst.
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium text-text-primary mb-1">
                <Link
                  href="/feiertage/2026"
                  className="text-accent hover:underline"
                >
                  Feiertage
                </Link>
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Verpasse keinen freien Tag! Wir listen dir alle gesetzlichen und
                regionalen Feiertage in Deutschland detailliert auf.
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium text-text-primary mb-1">
                <Link
                  href="/schulferien/2026"
                  className="text-accent hover:underline"
                >
                  Schulferien
                </Link>
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Plane deinen nächsten Urlaub stressfrei mit unserer Übersicht der
                Ferientermine aller Bundesländer.
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium text-text-primary mb-1">
                <Link
                  href="/datum-heute"
                  className="text-accent hover:underline"
                >
                  Aktuelles Datum &amp; Uhrzeit
                </Link>
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Präzise und sekundengenau – ideal für den schnellen Check
                zwischendurch.
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium text-text-primary mb-1">
                Nützliche Tools
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Von der Berechnung von{" "}
                <Link
                  href="/arbeitstage/2026"
                  className="text-accent hover:underline"
                >
                  Arbeitstagen
                </Link>{" "}
                bis hin zu Infos über die{" "}
                <Link
                  href="/zeitumstellung/2026"
                  className="text-accent hover:underline"
                >
                  Zeitumstellung
                </Link>{" "}
                – wir liefern dir die Fakten, die du brauchst.
              </p>
            </div>
          </div>
        </div>

        {/* ── Warum aktuellekw.de ─────────────────────────────── */}
        <h2 id="warum-aktuellekwde" className="text-2xl font-semibold mb-4">Warum aktuellekw.de?</h2>

        <p className="text-text-secondary mb-6 leading-relaxed">
          Wir legen großen Wert auf Aktualität und Übersichtlichkeit. Anstatt
          dich durch komplizierte Kalender-Apps zu wühlen, erhältst du bei uns
          mit nur einem Klick die Antwort auf deine Frage. Unsere Daten werden
          regelmäßig gepflegt und für das Jahr 2026 sowie darüber hinaus auf dem
          neuesten Stand gehalten.
        </p>

        <p className="text-text-secondary mb-6 leading-relaxed">
          Wir freuen uns, dass du den Weg zu uns gefunden hast und hoffen, dir
          die Planung deines Alltags ein Stück weit zu erleichtern!
        </p>

        <div className="bg-surface-secondary border border-border rounded-2xl p-6 mb-10">
          <p className="font-medium text-text-primary mb-1">
            Dein Feedback zählt
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Hast du Anregungen oder vermisst du eine bestimmte Information?
            Schreib uns gerne! Wir arbeiten ständig daran, aktuellekw.de noch
            hilfreicher für dich zu gestalten.
          </p>
        </div>

        <LastUpdated date="2026-03-16" />
        {/* ── Querlinks ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-8 border-t border-border text-sm">
          <Link
            href="/"
            className="text-accent hover:underline"
          >
            ← Startseite
          </Link>
          <Link
            href="/faq"
            className="text-accent hover:underline"
          >
            FAQ zur Kalenderwoche
          </Link>
          <Link
            href="/kalenderwoche"
            className="text-accent hover:underline"
          >
            Alle Kalenderwochen
          </Link>
        </div>
      </section>
    </>
  );
}
