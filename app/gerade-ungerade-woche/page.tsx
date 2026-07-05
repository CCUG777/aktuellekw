import type { Metadata } from "next";
import {
  getCurrentKW,
  getAllKWsForYear,
  getWeeksInYear,
  formatDateDE,
} from "@/lib/kw";
import AuthorByline from "@/components/AuthorByline";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const kw = getCurrentKW();
  const even = kw.weekNumber % 2 === 0;
  const title = "Gerade oder ungerade Woche? Aktuelle Kalenderwoche";
  const description = `Haben wir gerade eine gerade oder ungerade Woche? Aktuell ist KW ${kw.weekNumber} – eine ${even ? "gerade" : "ungerade"} Woche. Plus Erklärung, Nutzung im Wechselmodell & Schichtplan.`;
  return {
    title,
    description,
    alternates: {
      canonical: "https://aktuellekw.de/gerade-ungerade-woche",
    },
    openGraph: {
      title,
      description,
      url: "https://aktuellekw.de/gerade-ungerade-woche",
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

export default function GeradeUngeradeWochePage() {
  const kw = getCurrentKW();
  const year = kw.year;
  const weeksInYear = getWeeksInYear(year);
  const allWeeks = getAllKWsForYear(year);
  const even = kw.weekNumber % 2 === 0;

  // Nächste 6 Wochen ab der aktuellen KW für die Vorschau
  const startIdx = allWeeks.findIndex((w) => w.weekNumber === kw.weekNumber);
  const upcoming = allWeeks.slice(
    Math.max(0, startIdx),
    Math.max(0, startIdx) + 6
  );

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "https://aktuellekw.de/gerade-ungerade-woche#breadcrumb",
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
            name: "Gerade oder ungerade Woche",
            item: "https://aktuellekw.de/gerade-ungerade-woche",
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
          <span className="text-text-primary">Gerade oder ungerade Woche</span>
        </nav>

        {/* ── H1 + direkte Antwort ─────────────────────────────── */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Gerade oder ungerade Woche?
        </h1>

        <div className="bg-surface-secondary border border-border rounded-2xl p-6 mb-8 text-center">
          <p className="text-text-secondary text-sm mb-1">
            Aktuell ist KW&nbsp;{kw.weekNumber} ({formatDateDE(kw.startDate)} –{" "}
            {formatDateDE(kw.endDate)})
          </p>
          <p className="text-3xl font-bold text-accent">
            {even ? "Gerade Woche" : "Ungerade Woche"}
          </p>
          <p className="text-text-secondary text-sm mt-2">
            Die Kalenderwoche&nbsp;{kw.weekNumber} ist eine{" "}
            {even ? "gerade" : "ungerade"} Zahl.
          </p>
        </div>

        {/* ── Vorschau nächste Wochen ──────────────────────────── */}
        <div className="mb-12">
          <h2 id="naechste-wochen" className="text-2xl font-semibold mb-4">
            Die nächsten Wochen
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    KW
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Zeitraum
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-text-secondary">
                    Gerade/Ungerade
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((w) => {
                  const isEven = w.weekNumber % 2 === 0;
                  const isNow = w.weekNumber === kw.weekNumber;
                  return (
                    <tr key={w.weekNumber} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-semibold text-text-primary">
                        <a
                          href={`/kw/${w.weekNumber}-${year}`}
                          className="hover:text-accent"
                        >
                          KW&nbsp;{w.weekNumber}
                        </a>
                        {isNow && (
                          <span className="ml-2 text-xs text-accent">(jetzt)</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {formatDateDE(w.startDate)} – {formatDateDE(w.endDate)}
                      </td>
                      <td className="px-5 py-3 text-text-primary">
                        {isEven ? "gerade" : "ungerade"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Erklärung ────────────────────────────────────────── */}
        <div className="mb-12">
          <h2 id="was-bedeutet-das" className="text-2xl font-semibold mb-4">
            Was heißt „gerade" bzw. „ungerade Woche"?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Gemeint ist die <strong className="text-text-primary">Nummer der
            Kalenderwoche</strong>: Ist die KW-Nummer durch 2 teilbar, spricht man
            von einer geraden Woche (KW&nbsp;2, 4, 6&nbsp;…), andernfalls von einer
            ungeraden Woche (KW&nbsp;1, 3, 5&nbsp;…). Die Zählung folgt ISO&nbsp;8601,
            also der offiziellen deutschen Kalenderwoche. So bestimmst Du es selbst:
          </p>
          <ul className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                Aktuelle KW-Nummer ansehen (aktuell KW&nbsp;{kw.weekNumber}).
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>
                Ist die Zahl gerade (Rest 0 bei Teilung durch 2), ist es eine
                gerade Woche – sonst eine ungerade.
              </span>
            </li>
          </ul>
        </div>

        {/* ── Anwendungsfälle ──────────────────────────────────── */}
        <div className="mb-12">
          <h2 id="wofuer-wichtig" className="text-2xl font-semibold mb-4">
            Wofür ist das wichtig?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                t: "Wechselmodell (Sorgerecht)",
                d: "Getrennt lebende Eltern regeln die Betreuung oft im Wochenwechsel – „gerade Wochen bei Elternteil A, ungerade bei B\".",
              },
              {
                t: "Schicht- & Dienstpläne",
                d: "Wechselschichten und Bereitschaftsdienste laufen häufig im geraden/ungeraden Wochenrhythmus.",
              },
              {
                t: "Müllabfuhr & Turnus",
                d: "Abfuhrkalender für Bio-, Rest- oder Gelbe Tonne sind vielerorts nach geraden/ungeraden Wochen getaktet.",
              },
              {
                t: "Vereine & Kurse",
                d: "Trainings, Proben oder Kurse finden oft nur in geraden oder nur in ungeraden Wochen statt.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="bg-surface-secondary border border-border rounded-2xl p-5"
              >
                <p className="font-medium text-text-primary mb-1">{x.t}</p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hinweis 53 Wochen ────────────────────────────────── */}
        <div className="mb-12">
          <h2 id="jahreswechsel" className="text-2xl font-semibold mb-4">
            Achtung beim Jahreswechsel
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Der gerade/ungerade Rhythmus ist nicht über Jahre hinweg konstant.
            Hat ein Jahr <strong className="text-text-primary">53&nbsp;Kalenderwochen</strong>{" "}
            {weeksInYear === 53 ? `(wie ${year})` : ""}, folgt auf die ungerade
            KW&nbsp;53 wieder die ungerade KW&nbsp;1 des Folgejahres – der Wechsel
            „springt" also. Für feste Wochenmodelle lohnt daher ein Blick auf die{" "}
            <a
              href={`/kalenderwochen/${year}`}
              className="text-accent hover:underline"
            >
              vollständige Kalenderwochen-Übersicht {year}
            </a>
            .
          </p>
        </div>

        {/* ── Author ───────────────────────────────────────────── */}
        <AuthorByline date={new Date()} />

        {/* ── Abschluss-Links ──────────────────────────────────── */}
        <div className="mt-6 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
          <a href="/" className="text-accent hover:underline">
            ← Aktuelle KW
          </a>
          <a href="/kalenderwoche" className="text-accent hover:underline">
            Kalenderwoche erklärt
          </a>
        </div>
      </section>
    </>
  );
}
