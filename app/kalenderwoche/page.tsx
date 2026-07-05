import type { Metadata } from "next";
import {
  getAllKWsForYear,
  getCurrentKW,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import KWRechner from "@/components/KWRechner";
import AuthorByline from "@/components/AuthorByline";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Kalenderwoche: Definition, Berechnung & ISO 8601";
  const description =
    "Was ist eine Kalenderwoche? Definition, Berechnung nach ISO 8601, warum ein Jahr 52 oder 53 KW hat und wie Du jede Kalenderwoche selbst bestimmst.";
  return {
    title,
    description,
    alternates: {
      canonical: "https://aktuellekw.de/kalenderwoche",
    },
    openGraph: {
      title,
      description,
      url: "https://aktuellekw.de/kalenderwoche",
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

/** Erster Donnerstag des Jahres – bestimmt KW 1 nach ISO 8601. */
function getFirstThursday(year: number): string {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const day = jan1.getUTCDay(); // 0 = Sonntag
  const offset = (4 - day + 7) % 7;
  return formatDateDE(new Date(Date.UTC(year, 0, 1 + offset)));
}

export default function KalenderwocheHubPage() {
  const currentKW = getCurrentKW();
  const year = currentKW.year;
  const weeksInYear = getWeeksInYear(year);
  const allWeeks = getAllKWsForYear(year);
  const kw1Start = formatDateDE(allWeeks[0].startDate);

  const kwFaqs = [
    {
      question: "Was bedeutet Kalenderwoche (KW)?",
      answer:
        "Die Kalenderwoche ist eine fortlaufende Nummerierung der Wochen eines Jahres von 1 bis 52 oder 53. Sie dient dazu, Zeiträume eindeutig zu benennen – etwa in Beruf, Logistik und Schule. In Deutschland und Europa gilt die Zählung nach ISO 8601.",
    },
    {
      question: "Wie berechne ich die Kalenderwoche?",
      answer:
        "Nach ISO 8601 ist die KW 1 die Woche, die den ersten Donnerstag des Jahres enthält. Jede Woche läuft von Montag bis Sonntag. Für die Nummer einer Woche ist der Donnerstag maßgeblich: In welchem Jahr dieser Donnerstag liegt, zu diesem Jahr gehört die Woche. Mit dem Rechner oben wandelst Du jedes Datum sofort in die zugehörige KW um.",
    },
    {
      question: "Warum hat ein Jahr 52 oder 53 Kalenderwochen?",
      answer:
        "Ein normales Jahr hat 365 Tage – also 52 volle Wochen und einen Resttag. Fällt der erste Januar auf einen Donnerstag (oder in Schaltjahren auf einen Mittwoch), entsteht eine zusätzliche KW 53. In einem 400-Jahres-Zyklus haben genau 71 Jahre 53 Wochen (17,75 %, Quelle: ISO 8601 Annex B).",
    },
    {
      question: "Beginnt die Woche am Montag oder am Sonntag?",
      answer:
        "Nach ISO 8601 und DIN EN 28601 beginnt die Woche am Montag und endet am Sonntag. In den USA ist dagegen der Sonntag der erste Wochentag – deshalb liefern manche Programme abweichende Wochennummern, wenn der US-Modus aktiv ist.",
    },
  ];

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "https://aktuellekw.de/kalenderwoche#breadcrumb",
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
            name: "Kalenderwoche",
            item: "https://aktuellekw.de/kalenderwoche",
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
          <span className="text-text-primary">Kalenderwoche</span>
        </nav>

        {/* ── H1 + Intro ───────────────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Kalenderwoche: Definition, Berechnung &amp; ISO 8601
        </h1>
        <div className="text-text-secondary leading-relaxed mb-8 space-y-3">
          <p>
            Eine <strong className="text-text-primary">Kalenderwoche</strong>{" "}
            (KW) nummeriert die Wochen eines Jahres fortlaufend durch. Nach{" "}
            <strong className="text-text-primary">ISO&nbsp;8601</strong> läuft
            jede Woche von Montag bis Sonntag, und die KW&nbsp;1 ist die Woche
            mit dem ersten Donnerstag des Jahres. Diese Seite erklärt Definition,
            Berechnung und Sonderfälle.
          </p>
          <p>
            Du willst nur schnell die{" "}
            <a href="/" className="text-accent hover:underline font-medium">
              aktuelle Kalenderwoche
            </a>{" "}
            wissen oder die{" "}
            <a
              href={`/kalenderwochen/${year}`}
              className="text-accent hover:underline font-medium"
            >
              vollständige Übersicht aller Kalenderwochen&nbsp;{year}
            </a>{" "}
            sehen? Beides findest Du mit einem Klick.
          </p>
        </div>

        {/* ── Hub-Karten ───────────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-3 mb-12">
          <a
            href="/"
            className="bg-surface-secondary border border-border rounded-2xl p-5 hover:border-accent/50 transition-all"
          >
            <p className="font-medium text-text-primary mb-1">Aktuelle KW</p>
            <p className="text-text-secondary text-sm">
              Heute ist KW&nbsp;{currentKW.weekNumber} {year}.
            </p>
          </a>
          <a
            href={`/kalenderwochen/${year}`}
            className="bg-surface-secondary border border-border rounded-2xl p-5 hover:border-accent/50 transition-all"
          >
            <p className="font-medium text-text-primary mb-1">
              Alle KW&nbsp;{year}
            </p>
            <p className="text-text-secondary text-sm">
              {weeksInYear} Kalenderwochen mit Datum.
            </p>
          </a>
          <a
            href="/faq"
            className="bg-surface-secondary border border-border rounded-2xl p-5 hover:border-accent/50 transition-all"
          >
            <p className="font-medium text-text-primary mb-1">Fragen &amp; Antworten</p>
            <p className="text-text-secondary text-sm">
              Die häufigsten Fragen zur KW.
            </p>
          </a>
        </div>

        {/* ── Rechner ──────────────────────────────────────────── */}
        <div className="mb-14">
          <h2 id="kalenderwoche-berechnen" className="text-2xl font-semibold mb-4">
            Kalenderwoche berechnen
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            Gib ein beliebiges Datum ein – der Rechner zeigt Dir die zugehörige
            Kalenderwoche nach ISO&nbsp;8601 und verlinkt direkt auf die
            Detailseite der Woche.
          </p>
          <KWRechner />
        </div>

        {/* ── Was ist eine Kalenderwoche ───────────────────────── */}
        <div className="mb-14">
          <h2 id="was-ist-eine-kalenderwoche" className="text-2xl font-semibold mb-4">
            Was ist eine Kalenderwoche?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Die Kalenderwoche ist eine international standardisierte Nummerierung
            der Wochen eines Jahres. Sie macht Zeiträume eindeutig benennbar:
            „Lieferung in KW&nbsp;20" ist präziser als „Mitte Mai". Grundlage ist
            die Norm <strong className="text-text-primary">ISO&nbsp;8601</strong>{" "}
            (§&nbsp;2.2.8), in Deutschland als{" "}
            <strong className="text-text-primary">DIN&nbsp;EN&nbsp;28601</strong>{" "}
            übernommen. Danach beginnt jede Woche am Montag und endet am Sonntag.
          </p>
        </div>

        {/* ── Wie berechnet ────────────────────────────────────── */}
        <div className="mb-14">
          <h2 id="wie-wird-die-kalenderwoche-berechnet" className="text-2xl font-semibold mb-4">
            Wie wird die Kalenderwoche berechnet?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Maßgeblich ist der <strong className="text-text-primary">Donnerstag</strong>:
            Eine Woche gehört zu dem Jahr, in dem ihr Donnerstag liegt. Daraus
            folgt die Regel für die erste Woche:
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-text-primary">KW&nbsp;1</strong> ist die
                Woche, die den ersten Donnerstag des Jahres enthält – gleichbedeutend
                mit der Woche, die den 4.&nbsp;Januar einschließt.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                Beispiel {year}: Der erste Donnerstag fällt auf den{" "}
                {getFirstThursday(year)}. Deshalb begann die KW&nbsp;1&nbsp;{year}{" "}
                am Montag, {kw1Start}.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                Die ersten Januartage können deshalb noch zur letzten KW des
                Vorjahres gehören – und KW&nbsp;1 kann bereits Ende Dezember
                beginnen.
              </span>
            </li>
          </ul>
        </div>

        {/* ── 52 oder 53 ───────────────────────────────────────── */}
        <div className="mb-14">
          <h2 id="52-oder-53-kalenderwochen" className="text-2xl font-semibold mb-4">
            52 oder 53 Kalenderwochen?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Die meisten Jahre haben 52&nbsp;Kalenderwochen. Ein normales Jahr hat
            365&nbsp;Tage – also 52&nbsp;volle Wochen und einen Resttag. Fällt der
            1.&nbsp;Januar auf einen Donnerstag (oder in Schaltjahren auf einen
            Mittwoch), entsteht eine zusätzliche{" "}
            <strong className="text-text-primary">KW&nbsp;53</strong>. In einem
            400-Jahres-Zyklus trifft das auf genau 71&nbsp;Jahre zu – rund
            17,75&nbsp;% (Quelle: ISO&nbsp;8601 Annex&nbsp;B).{" "}
            {weeksInYear === 53
              ? `${year} ist ein solches langes Jahr mit 53 Wochen.`
              : `${year} hat 52 Wochen.`}{" "}
            Mehr dazu auf{" "}
            <a
              href="/wie-viele-wochen-hat-ein-jahr"
              className="text-accent hover:underline"
            >
              „Wie viele Wochen hat ein Jahr?"
            </a>
          </p>
        </div>

        {/* ── Excel & Software ─────────────────────────────────── */}
        <div className="mb-14">
          <h2 id="kalenderwoche-in-excel" className="text-2xl font-semibold mb-4">
            Kalenderwoche in Excel &amp; Software
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            In Tabellenkalkulationen ist der häufigste Fehler die falsche
            Zählweise. Für die ISO-Woche (Montag als Wochenstart) brauchst Du den
            richtigen Parameter:
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                Excel:{" "}
                <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                  =KALENDERWOCHE(HEUTE();21)
                </code>{" "}
                oder{" "}
                <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                  =ISOKALENDERWOCHE(HEUTE())
                </code>
                . Der Typ&nbsp;<strong className="text-text-primary">21</strong>{" "}
                liefert die ISO-Woche; der Standard-Typ&nbsp;
                <strong className="text-text-primary">1</strong> zählt US-typisch
                ab Sonntag und weicht ab.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                Google Sheets:{" "}
                <code className="bg-surface-secondary border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono">
                  =ISOWEEKNUM(HEUTE())
                </code>{" "}
                entspricht der ISO-Zählung.
              </span>
            </li>
          </ul>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <div className="mb-14">
          <h2 id="faq" className="text-2xl font-semibold mb-5">
            Häufige Fragen zur Kalenderwoche
          </h2>
          <div className="space-y-2.5">
            {kwFaqs.map((faq, i) => (
              <details
                key={i}
                open={i < 2 ? true : undefined}
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

        {/* ── Author ───────────────────────────────────────────── */}
        <AuthorByline date={new Date()} />

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href={`/kalenderwochen/${year}`} className="text-accent hover:underline">
            Alle Kalenderwochen {year}
          </a>
          <a href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche →
          </a>
        </div>
      </section>
    </>
  );
}

/*
 * SEO Audit Checklist – app/kalenderwoche/page.tsx
 * ──────────────────────────────────────────────────────────────
 * Phase 2.2: Umbau von Jahresübersicht (Duplikat zu /kalenderwochen/[year])
 * zum informationalen Ratgeber-Hub „Kalenderwoche: Definition, Berechnung".
 * [x] H1 informational, nicht jahres-spezifisch (keine Kannibalisierung)
 * [x] Ziel-Keywords: kalenderwoche, kalenderwoche berechnen, kalenderwoche
 *     definition, was ist eine kalenderwoche, kalenderwoche iso 8601
 * [x] Jahres-Intent explizit an /kalenderwochen/[year] verlinkt
 * [x] KWRechner (Tool) für „kalenderwoche berechnen"
 * [x] Kein FAQPage-Schema (lebt nur auf /faq – Phase 5.3)
 * [x] Self-Canonical, BreadcrumbList (2 Ebenen)
 * [x] AuthorByline (E-E-A-T)
 */
