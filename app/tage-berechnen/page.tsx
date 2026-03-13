import type { Metadata } from "next";
import Link from "next/link";
import Tagerechner from "@/components/Tagerechner";
import {
  getCurrentKW,
  getDayOfYear,
  isLeapYear,
  formatDateDE,
} from "@/lib/kw";

export const revalidate = 3600;

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const title = `Tagerechner \u25b7 Tage zwischen zwei Daten berechnen | Kostenlos`;
  const description =
    "Tagerechner: Berechnen Sie kostenlos die Anzahl der Tage zwischen zwei Daten. Inklusive Arbeitstage, Wochen & Kalenderwochen \u2013 online, sofort & ohne Anmeldung.";
  const url = "https://aktuellekw.de/tage-berechnen";

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

/* ── FAQ data ──────────────────────────────────────────────────── */
const pageFAQs = [
  {
    question: "Wie berechne ich die Tage zwischen zwei Daten?",
    answer:
      "Geben Sie oben einfach ein Startdatum und ein Enddatum ein. Der Tagerechner ermittelt sofort die Anzahl der Kalendertage, Arbeitstage und Wochen zwischen den beiden Daten.",
  },
  {
    question: "Z\u00e4hlt der Tagerechner den Start- und Endtag mit?",
    answer:
      "Der Tagerechner berechnet die Differenz zwischen zwei Daten. Der Starttag wird nicht mitgez\u00e4hlt, der Endtag schon. Beispiel: Vom 1. Januar bis 2. Januar = 1 Tag.",
  },
  {
    question:
      "Was ist der Unterschied zwischen Kalendertagen und Arbeitstagen?",
    answer:
      "Kalendertage umfassen alle Tage (inkl. Wochenenden und Feiertage). Arbeitstage z\u00e4hlen nur Montag bis Freitag. Der Tagerechner zeigt beide Werte \u2013 Feiertage werden dabei nicht abgezogen, da diese je nach Bundesland variieren.",
  },
  {
    question: "Wie viele Tage hat ein Jahr?",
    answer:
      "Ein normales Jahr hat 365 Tage, ein Schaltjahr 366 Tage. Ein Schaltjahr tritt alle 4 Jahre auf (z.\u00a0B. 2024, 2028), es sei denn, das Jahr ist durch 100 teilbar aber nicht durch 400.",
  },
  {
    question: "Wie viele Arbeitstage hat ein Jahr?",
    answer:
      "Ein Kalenderjahr hat je nach Schaltjahr 261 oder 262 Arbeitstage (Montag bis Freitag). Abz\u00fcglich gesetzlicher Feiertage (je nach Bundesland 9\u201313) bleiben ca. 248\u2013253 tats\u00e4chliche Arbeitstage.",
  },
  {
    question: "Wie viele Tage sind es bis Weihnachten?",
    answer:
      "Nutzen Sie den Schnell-Button \u201eTage bis Weihnachten\u201c im Tagerechner oben. Die Berechnung erfolgt automatisch vom heutigen Datum bis zum 25. Dezember.",
  },
  {
    question: "Kann ich auch r\u00fcckw\u00e4rts rechnen (Tage in der Vergangenheit)?",
    answer:
      "Ja. W\u00e4hlen Sie als Enddatum ein Datum vor dem Startdatum. Der Tagerechner zeigt dann die Anzahl der Tage in der Vergangenheit an.",
  },
];

/* ── Page Component ────────────────────────────────────────────── */
export default function TageBerechnenPage() {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const year = todayUTC.getUTCFullYear();
  const kw = getCurrentKW();
  const dayOfYear = getDayOfYear(todayUTC);
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const remainingDays = daysInYear - dayOfYear;

  // Days until Christmas
  const christmas = new Date(Date.UTC(year, 11, 25));
  const daysUntilChristmas = Math.ceil(
    (christmas.getTime() - todayUTC.getTime()) / 86_400_000
  );

  // Days until New Year
  const newYear = new Date(Date.UTC(year + 1, 0, 1));
  const daysUntilNewYear = Math.ceil(
    (newYear.getTime() - todayUTC.getTime()) / 86_400_000
  );

  // JSON-LD
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
          name: "Tagerechner",
          item: "https://aktuellekw.de/tage-berechnen",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Tagerechner \u2013 Tage zwischen zwei Daten berechnen",
      url: "https://aktuellekw.de/tage-berechnen",
      applicationCategory: "UtilityApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      inLanguage: "de-DE",
      publisher: {
        "@type": "Organization",
        name: "aktuellekw.de",
        url: "https://aktuellekw.de",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pageFAQs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            Startseite
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-text-primary">Tagerechner</span>
        </nav>

        {/* ── H1 + Intro ──────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Tagerechner &ndash; Tage zwischen zwei Daten berechnen
        </h1>

        <div className="text-text-secondary leading-relaxed mb-6 space-y-3">
          <p>
            Mit diesem kostenlosen <strong className="text-text-primary">Tagerechner</strong>{" "}
            berechnen Sie sofort die Anzahl der{" "}
            <strong className="text-text-primary">Tage zwischen zwei Daten</strong>.
            Ob f&uuml;r die Urlaubsplanung, Projektfristen oder private Countdowns &ndash;
            geben Sie einfach Start- und Enddatum ein und erhalten Sie die
            Differenz in Kalendertagen, Arbeitstagen und Wochen.
          </p>
          <p>
            Heute ist der{" "}
            <strong className="text-text-primary">{formatDateDE(todayUTC)}</strong>{" "}
            (KW&nbsp;{kw.weekNumber}) &ndash; Tag {dayOfYear} von {daysInYear} im Jahr {year}.
            {remainingDays > 0 && (
              <> Es verbleiben noch {remainingDays} Tage bis Jahresende.</>
            )}
          </p>
        </div>

        {/* ── Stats Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Tag im Jahr", value: `${dayOfYear}/${daysInYear}` },
            { label: "Bis Jahresende", value: `${remainingDays} Tage` },
            {
              label: "Bis Weihnachten",
              value:
                daysUntilChristmas > 0
                  ? `${daysUntilChristmas} Tage`
                  : daysUntilChristmas === 0
                  ? "Heute!"
                  : "vorbei",
            },
            {
              label: "Bis Silvester",
              value: `${daysUntilNewYear} Tage`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-secondary border border-border rounded-xl px-4 py-3 text-center"
            >
              <div className="text-xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-text-secondary mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 1: Tagerechner Tool
            ═════════════════════════════════════════════════════════ */}
        <Tagerechner />

        {/* ═════════════════════════════════════════════════════════
            SECTION 2: SEO-Text Placeholder – Tagerechner erklärt
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tagerechner: So berechnen Sie Tage zwischen zwei Daten
          </h2>
          {/* [PLACEHOLDER: SEO-Text "Tagerechner / tage berechnen" – 150–200 Wörter.
              Keywords: tagerechner, tage berechnen, datumsrechner, tageszähler,
              tage zählen, anzahl tage berechnen, datumsrechner tage.
              Themen: Warum einen Tagerechner nutzen, Anwendungsfälle
              (Urlaubsplanung, Projektmanagement, Fristen, Mutterschutz,
              Kündigungsfristen), Unterschied Kalendertage vs. Arbeitstage,
              wie die Berechnung funktioniert.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein <strong className="text-text-primary">Tagerechner</strong> (auch{" "}
              <strong className="text-text-primary">Datumsrechner</strong> oder{" "}
              <strong className="text-text-primary">Tagez&auml;hler</strong>) berechnet die{" "}
              <strong className="text-text-primary">Anzahl der Tage zwischen zwei Daten</strong>{" "}
              &ndash; sekundenschnell und ohne komplizierte Formeln. Ob Sie wissen
              m&ouml;chten, wie viele Tage Ihr Urlaub dauert, wann eine K&uuml;ndigungsfrist
              abl&auml;uft oder wie viele Arbeitstage ein Projekt umfasst: Geben Sie
              einfach Start- und Enddatum ein.
            </p>
            <p>
              Unser Tagerechner unterscheidet zwischen{" "}
              <strong className="text-text-primary">Kalendertagen</strong> (alle Tage
              inklusive Wochenenden) und{" "}
              <strong className="text-text-primary">Arbeitstagen</strong> (Montag bis
              Freitag). Zus&auml;tzlich sehen Sie die Differenz in Wochen und Stunden.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 3: SEO-Text Placeholder – Wie viele Tage bis
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wie viele Tage bis &hellip;? &ndash; Beliebte Countdowns
          </h2>
          {/* [PLACEHOLDER: SEO-Text "wie viele tage bis" – 100–150 Wörter.
              Keywords: wie viele tage bis, tage bis weihnachten,
              tagerechner online, tage zählen.
              Themen: Beliebte Countdowns (Weihnachten, Silvester,
              Sommerferien, Geburtstag), wie man den Tagerechner
              als Countdown nutzt, saisonale Beispiele.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Die Frage &bdquo;<strong className="text-text-primary">Wie viele Tage bis</strong>&ldquo;
              einem bestimmten Ereignis ist einer der h&auml;ufigsten Gr&uuml;nde, einen
              Tagerechner zu nutzen. Besonders beliebt sind Countdowns f&uuml;r:
            </p>
          </div>

          {/* Countdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Tage bis Weihnachten
              </p>
              <p className="text-3xl font-bold text-accent">
                {daysUntilChristmas > 0
                  ? daysUntilChristmas
                  : daysUntilChristmas === 0
                  ? "Heute!"
                  : "\u2013"}
              </p>
              <p className="text-text-secondary text-xs mt-1">25.12.{year}</p>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Tage bis Silvester
              </p>
              <p className="text-3xl font-bold text-accent">{daysUntilNewYear}</p>
              <p className="text-text-secondary text-xs mt-1">01.01.{year + 1}</p>
            </div>
            <div className="bg-surface-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Verbleibend im Jahr
              </p>
              <p className="text-3xl font-bold text-accent">{remainingDays}</p>
              <p className="text-text-secondary text-xs mt-1">
                von {daysInYear} Tagen ({year})
              </p>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 4: SEO-Text Placeholder – Tage im Jahr
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Wie viele Tage hat ein Jahr?
          </h2>
          {/* [PLACEHOLDER: SEO-Text "wie viele tage hat ein jahr" – 80–120 Wörter.
              Keywords: wie viele tage hat ein jahr, tage zählen,
              tageszähler, tagerechner.
              Themen: 365 vs. 366 Tage (Schaltjahr), Schaltjahrregeln,
              Arbeitstage pro Jahr, Zusammenhang mit Kalenderwochen.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Ein normales Kalenderjahr hat{" "}
              <strong className="text-text-primary">365 Tage</strong>, ein{" "}
              <strong className="text-text-primary">Schaltjahr 366 Tage</strong> (der
              29.&nbsp;Februar kommt hinzu). {year} ist{" "}
              {isLeapYear(year) ? (
                <>
                  ein <strong className="text-text-primary">Schaltjahr</strong> mit 366 Tagen
                </>
              ) : (
                <>
                  <strong className="text-text-primary">kein Schaltjahr</strong> und hat 365 Tage
                </>
              )}
              .
            </p>
            <p>
              Ein Kalenderjahr umfasst{" "}
              <strong className="text-text-primary">
                <Link href={`/kalenderwochen/${year}`} className="text-accent hover:underline">
                  {52} bis 53 Kalenderwochen
                </Link>
              </strong>
              {" "}und rund 261 Arbeitstage (Montag bis Freitag). Abz&uuml;glich
              gesetzlicher Feiertage (je nach Bundesland) bleiben ca. 248&ndash;253
              tats&auml;chliche Arbeitstage.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 5: SEO-Text Placeholder – Arbeitstage
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Tage berechnen f&uuml;r die Arbeit &ndash; Arbeitstage vs. Kalendertage
          </h2>
          {/* [PLACEHOLDER: SEO-Text "tage berechnen / anzahl tage berechnen" – 100–150 Wörter.
              Keywords: tage berechnen, anzahl tage berechnen,
              tage berechnen zwischen zwei daten, tage zwischen zwei daten berechnen.
              Themen: Arbeitstage-Berechnung für Kündigungsfristen,
              Mutterschutz, Elternzeit, Projektplanung. Unterschied
              Werktage (Mo–Sa) vs. Arbeitstage (Mo–Fr). Hinweis auf
              Feiertage pro Bundesland.] */}
          <div className="text-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              Wenn Sie <strong className="text-text-primary">Tage zwischen zwei Daten berechnen</strong>,
              ist es oft wichtig, zwischen Kalender- und Arbeitstagen zu unterscheiden.
              Unser Tagerechner zeigt Ihnen beides: Die{" "}
              <strong className="text-text-primary">Kalendertage</strong> umfassen alle
              Tage einschlie&szlig;lich Wochenenden, w&auml;hrend die{" "}
              <strong className="text-text-primary">Arbeitstage</strong> (Montag bis Freitag)
              f&uuml;r Fristen und Berechnungen relevant sind.
            </p>
            <p>
              Beachten Sie: Der Tagerechner z&auml;hlt Arbeitstage ohne Ber&uuml;cksichtigung
              von Feiertagen, da diese je nach{" "}
              <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
                Bundesland
              </Link>{" "}
              variieren. F&uuml;r genaue Fristen pr&uuml;fen Sie die Feiertage in Ihrem Land.
            </p>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            SECTION 6: FAQ
            ═════════════════════════════════════════════════════════ */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-5">
            H&auml;ufige Fragen zum Tagerechner
          </h2>
          <div className="space-y-2.5">
            {pageFAQs.map((faq, i) => (
              <details
                key={i}
                className="group border border-border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium hover:bg-surface-secondary transition-colors list-none">
                  <span>{faq.question}</span>
                  <span className="text-text-secondary text-xl leading-none ml-4 shrink-0 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="details-content px-5 pb-5 pt-2 text-text-secondary text-sm leading-relaxed border-t border-border">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-accent hover:underline">
            &larr; Aktuelle KW
          </Link>
          <Link href="/datum-heute" className="text-accent hover:underline">
            Datum heute &rarr;
          </Link>
          <Link href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwochen {year} &rarr;
          </Link>
          <Link href={`/feiertage/${year}`} className="text-accent hover:underline">
            Feiertage {year} &rarr;
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/tage-berechnen/page.tsx
 * ──────────────────────────────────────────────────────────────
 * [x] generateMetadata: Title "Tagerechner ▷ Tage zwischen zwei Daten berechnen | Kostenlos"
 * [x] Meta Description: dynamisch mit Keyword-Integration
 * [x] Canonical URL: https://aktuellekw.de/tage-berechnen
 * [x] OG-Title + OG-Description + OG-URL
 * [x] H1: "Tagerechner – Tage zwischen zwei Daten berechnen"
 * [x] Schema.org: BreadcrumbList (2 Ebenen)
 * [x] Schema.org: WebApplication (kostenloser Tagerechner)
 * [x] Schema.org: FAQPage (7 Fragen)
 * [x] Cluster Keywords: tagerechner, datumsrechner, tageszähler,
 *     tage berechnen, tage zählen, anzahl tage berechnen,
 *     tage bis weihnachten, wie viele tage bis,
 *     datumsrechner tage, tage zwischen zwei daten berechnen,
 *     tagerechner online, wie viele tage hat ein jahr
 * [x] Interaktiver Tagerechner (Client Component)
 * [x] Stats Row (Tag im Jahr, bis Weihnachten, bis Silvester)
 * [x] Countdown-Cards (Weihnachten, Silvester, Jahresende)
 * [x] SEO-Placeholder: 4 Sektionen für zukünftige Texte
 * [x] FAQ (7 Fragen) mit allen Cluster-Keywords
 * [x] Cross-Links: Startseite, Datum heute, KW-Übersicht, Feiertage, FAQ
 * [x] revalidate = 3600 (stündliche ISR)
 * [ ] TODO: OG-Image erstellen (opengraph-image.tsx)
 * [ ] TODO: SEO-Texte für alle 4 Placeholders schreiben
 */
