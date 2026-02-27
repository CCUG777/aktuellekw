import type { Metadata } from "next";
import { getCurrentKW, getWeeksInYear } from "@/lib/kw";

export const metadata: Metadata = {
  title: "Wie viele Wochen hat ein Jahr? – 52 oder 53 Kalenderwochen",
  description:
    "Wie viele Wochen hat ein Jahr? Die meisten Jahre haben 52 Kalenderwochen, manche 53. Erfahren Sie, wann und warum ein Jahr 53 KW hat – einfach erklärt nach ISO 8601.",
  alternates: {
    canonical: "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr",
  },
  openGraph: {
    title: "Wie viele Wochen hat ein Jahr? – 52 oder 53 Kalenderwochen",
    description:
      "Ein Jahr hat 52 oder 53 Kalenderwochen nach ISO 8601. Erfahren Sie, wann ein langes Jahr mit 53 KW auftritt.",
    url: "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr",
    type: "website",
    locale: "de_DE",
    siteName: "aktuellekw.de",
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "Wie viele Wochen hat ein Jahr? – aktuellekw.de",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wie viele Wochen hat ein Jahr? – 52 oder 53 Kalenderwochen",
    description:
      "Ein Jahr hat 52 oder 53 Kalenderwochen nach ISO 8601. Erfahren Sie, wann ein langes Jahr mit 53 KW auftritt.",
    images: [
      {
        url: "/og/og-default.png",
        alt: "Wie viele Wochen hat ein Jahr? – aktuellekw.de",
      },
    ],
  },
};

function PageJsonLd() {
  const jsonLd = [
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
          name: "Wie viele Wochen hat ein Jahr?",
          item: "https://aktuellekw.de/wie-viele-wochen-hat-ein-jahr",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Wie viele Wochen hat ein Jahr?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ein Jahr hat nach ISO 8601 entweder 52 oder 53 Kalenderwochen. Die meisten Jahre haben 52 KW. Ein Jahr mit 53 Kalenderwochen tritt auf, wenn der 1. Januar auf einen Donnerstag fällt – oder in Schaltjahren auf einen Mittwoch.",
          },
        },
        {
          "@type": "Question",
          name: "Wann hat ein Jahr 53 Kalenderwochen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ein Jahr hat 53 Kalenderwochen, wenn der 1. Januar auf einen Donnerstag fällt. In Schaltjahren reicht es, wenn der 1. Januar auf einen Mittwoch oder Donnerstag fällt. In einem 400-Jahres-Zyklus gibt es genau 71 Jahre mit 53 KW.",
          },
        },
        {
          "@type": "Question",
          name: "Wie viele Kalenderwochen hat 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Das Jahr 2026 hat 53 Kalenderwochen, da der 1. Januar 2026 auf einen Donnerstag fällt.",
          },
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Years with 53 weeks near the current year for the table
function getYearsWith53Weeks(
  startYear: number,
  endYear: number
): number[] {
  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    if (getWeeksInYear(y) === 53) {
      years.push(y);
    }
  }
  return years;
}

export default function WieVieleWochenPage() {
  const currentKW = getCurrentKW();
  const currentYear = currentKW.year;
  const currentYearWeeks = getWeeksInYear(currentYear);
  const yearsWith53 = getYearsWith53Weeks(2020, 2035);

  return (
    <>
      <PageJsonLd />
      <article className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <a href="/" className="hover:text-accent transition-colors">
            Startseite
          </a>
          <span aria-hidden>›</span>
          <span className="text-text-primary">
            Wie viele Wochen hat ein Jahr?
          </span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Wie viele Wochen hat ein Jahr?
        </h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-text-secondary leading-relaxed text-base">
            Ein Jahr hat nach dem internationalen Standard ISO&nbsp;8601
            entweder <strong className="text-text-primary">52</strong> oder{" "}
            <strong className="text-text-primary">53&nbsp;Kalenderwochen</strong>.
            Die meisten Jahre bestehen aus 52&nbsp;KW. In bestimmten
            Jahren kommt jedoch eine zusätzliche 53.&nbsp;Kalenderwoche
            hinzu – man spricht dann von einem <em>langen Jahr</em>.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4">
            Wann hat ein Jahr 53 Kalenderwochen?
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Eine 53.&nbsp;Kalenderwoche entsteht, wenn der
            1.&nbsp;Januar eines Jahres auf einen{" "}
            <strong className="text-text-primary">Donnerstag</strong> fällt.
            In Schaltjahren genügt es, wenn der 1.&nbsp;Januar auf einen
            Mittwoch oder Donnerstag fällt. Nach dieser Regel gibt es in
            einem 400-Jahres-Zyklus genau{" "}
            <strong className="text-text-primary">71&nbsp;Jahre mit
            53&nbsp;Kalenderwochen</strong>.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4">
            Wie viele Kalenderwochen hat {currentYear}?
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Das Jahr {currentYear} hat{" "}
            <strong className="text-text-primary">
              {currentYearWeeks}&nbsp;Kalenderwochen
            </strong>
            .{" "}
            {currentYearWeeks === 53
              ? `Da der 1. Januar ${currentYear} auf einen Donnerstag fällt, gibt es eine 53. KW.`
              : `Der 1. Januar ${currentYear} fällt nicht auf einen Donnerstag, daher hat ${currentYear} reguläre 52 KW.`}{" "}
            Die{" "}
            <a href="/" className="text-accent hover:underline">
              aktuelle Kalenderwoche
            </a>{" "}
            ist KW&nbsp;{currentKW.weekNumber}.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4">
            Jahre mit 53 Kalenderwochen im Überblick
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Die folgende Tabelle zeigt alle Jahre mit 53&nbsp;Kalenderwochen
            im Zeitraum von 2020 bis 2035:
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
            {yearsWith53.map((y) => (
              <a
                key={y}
                href={`/kalenderwochen/${y}`}
                className={`text-center py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                  y === currentYear
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface-secondary text-text-primary hover:bg-surface-tertiary hover:border-border/70"
                }`}
              >
                {y}
                <span className="block text-xs text-text-secondary font-normal">
                  53 KW
                </span>
              </a>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-text-primary pt-4">
            Warum beginnt die Woche am Montag?
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Nach ISO&nbsp;8601 beginnt jede Kalenderwoche am Montag und
            endet am Sonntag. Dieser Standard gilt in Deutschland,
            Österreich und der Schweiz verbindlich. Die KW&nbsp;1 eines
            Jahres ist diejenige Woche, die den ersten Donnerstag des
            Jahres enthält – der 4.&nbsp;Januar liegt daher immer in
            KW&nbsp;1.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4">
            Tage und Wochen im Vergleich
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Ein normales Jahr hat 365&nbsp;Tage, ein Schaltjahr 366.
            Dividiert man 365 durch&nbsp;7, ergibt sich 52&nbsp;Wochen
            und 1&nbsp;Tag. Dieser überschüssige Tag ist der Grund, warum
            sich der Wochentag des 1.&nbsp;Januar jedes Jahr um einen Tag
            verschiebt – und warum in bestimmten Konstellationen eine
            53.&nbsp;Kalenderwoche entsteht.
          </p>
        </div>

        {/* Internal Links */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle Kalenderwoche
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Alle Kalenderwochen {currentYear}
          </a>
          <a href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche
          </a>
        </div>
      </article>
    </>
  );
}
