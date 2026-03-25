import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Über uns | aktuellekw.de – Redaktion, Expertise & Standards",
  },
  description:
    "Wer steckt hinter aktuellekw.de? Erfahre mehr über unser Redaktionsteam, unsere fachliche Expertise zu ISO 8601, Kalenderwochen und Zeitplanung sowie unsere Redaktionsstandards.",
  alternates: {
    canonical: "https://aktuellekw.de/ueber-uns",
  },
  openGraph: {
    title: "Über uns | aktuellekw.de – Redaktion & Redaktionsstandards",
    description:
      "Erfahre mehr über aktuellekw.de: Redaktionsteam, Autoren-Credentials, Redaktionsstandards und Quellen für Kalenderwochen, Feiertage und ISO 8601.",
    url: "https://aktuellekw.de/ueber-uns",
    type: "website",
    locale: "de_DE",
    siteName: "aktuellekw.de",
  },
  twitter: {
    card: "summary_large_image",
    title: "Über uns | aktuellekw.de – Redaktion & Redaktionsstandards",
    description:
      "Redaktionsteam, Autoren-Credentials und Redaktionsstandards von aktuellekw.de – Deine Anlaufstelle für Kalenderwochen & ISO 8601.",
  },
};

function PageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://aktuellekw.de/ueber-uns#aboutpage",
        name: "Über aktuellekw.de – Redaktion, Expertise & Standards",
        description:
          "Informationen über das Redaktionsteam, die fachliche Expertise und die Redaktionsstandards von aktuellekw.de.",
        url: "https://aktuellekw.de/ueber-uns",
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://aktuellekw.de/#website" },
        about: { "@id": "https://aktuellekw.de/#organization" },
        datePublished: "2026-03-16",
        dateModified: "2026-03-25",
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
      {
        "@type": "Person",
        "@id": "https://aktuellekw.de/#author",
        name: "aktuellekw.de Redaktion",
        url: "https://aktuellekw.de/ueber-uns",
        worksFor: { "@id": "https://aktuellekw.de/#organization" },
        knowsAbout: [
          "ISO 8601",
          "Kalenderwoche",
          "Zeitplanung",
          "Feiertage Deutschland",
          "Schulferien Deutschland",
          "DIN EN 28601",
        ],
        description:
          "Die Redaktion von aktuellekw.de erstellt und pflegt alle Inhalte zu Kalenderwochen, Feiertagen, Schulferien und Zeitplanungs-Tools nach ISO 8601.",
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
          Über aktuellekw.de – Redaktion, Expertise & Standards
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
                <Link href="/feiertage/2026" className="text-accent hover:underline">
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
                <Link href="/schulferien/2026" className="text-accent hover:underline">
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
                <Link href="/datum-heute" className="text-accent hover:underline">
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
                <Link href="/arbeitstage/2026" className="text-accent hover:underline">
                  Arbeitstagen
                </Link>{" "}
                bis hin zu Infos über die{" "}
                <Link href="/zeitumstellung/2026" className="text-accent hover:underline">
                  Zeitumstellung
                </Link>{" "}
                – wir liefern dir die Fakten, die du brauchst.
              </p>
            </div>
          </div>
        </div>

        {/* ── Warum aktuellekw.de ─────────────────────────────── */}
        <h2 id="warum-aktuellekwde" className="text-2xl font-semibold mb-4">
          Warum aktuellekw.de?
        </h2>

        <p className="text-text-secondary mb-6 leading-relaxed">
          Wir legen großen Wert auf Aktualität und Übersichtlichkeit. Anstatt
          dich durch komplizierte Kalender-Apps zu wühlen, erhältst du bei uns
          mit nur einem Klick die Antwort auf deine Frage. Unsere Daten werden
          regelmäßig gepflegt und für das Jahr 2026 sowie darüber hinaus auf dem
          neuesten Stand gehalten.
        </p>

        {/* ── Redaktionsteam & Expertise ──────────────────────── */}
        <h2 id="redaktionsteam-expertise" className="text-2xl font-semibold mb-4">
          Redaktionsteam &amp; Expertise
        </h2>

        <p className="text-text-secondary mb-5 leading-relaxed">
          Hinter aktuellekw.de steht ein kleines, spezialisiertes Team aus
          Entwicklern und Redakteuren mit Schwerpunkt auf Zeitplanung,
          Kalenderrechnung und deutschem Normenwesen. Alle Inhalte werden von
          Menschen erstellt, geprüft und regelmäßig aktualisiert – kein
          automatisch generierter Text ohne Redaktionskontrolle.
        </p>

        <div className="bg-surface-secondary border border-border rounded-2xl p-6 mb-8 space-y-5">

          {/* Fachgebiet 1 */}
          <div>
            <p className="font-medium text-text-primary mb-1 flex items-center gap-2">
              <span className="text-accent">📐</span>
              ISO 8601 &amp; Kalenderwochenrechnung
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Alle KW-Berechnungen auf aktuellekw.de basieren ausschließlich auf{" "}
              <strong className="text-text-primary">ISO 8601:2004</strong> (bzw. ISO
              8601-1:2019) und der deutschen Norm{" "}
              <strong className="text-text-primary">DIN EN 28601</strong>. Die
              Algorithmen wurden manuell gegen die offiziellen Normtabellen
              (Annex B) sowie mehrere unabhängige Referenzimplementierungen
              validiert. Grenzfälle – insbesondere 53-Wochen-Jahre und
              Jahreswechsel – sind explizit getestet.
            </p>
          </div>

          {/* Fachgebiet 2 */}
          <div className="border-t border-border pt-4">
            <p className="font-medium text-text-primary mb-1 flex items-center gap-2">
              <span className="text-accent">🗓️</span>
              Feiertage &amp; Schulferien
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Feiertagsdaten werden jährlich gegen die offiziellen Bekanntmachungen
              der Kultusministerien und Landesgesetze der 16 Bundesländer
              abgeglichen. Schulferien werden aus den Veröffentlichungen der{" "}
              <strong className="text-text-primary">Kultusministerkonferenz (KMK)</strong>{" "}
              übernommen und vor jeder Veröffentlichung redaktionell geprüft.
            </p>
          </div>

          {/* Fachgebiet 3 */}
          <div className="border-t border-border pt-4">
            <p className="font-medium text-text-primary mb-1 flex items-center gap-2">
              <span className="text-accent">⚙️</span>
              Technische Umsetzung
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Die Website ist mit{" "}
              <strong className="text-text-primary">Next.js (App Router)</strong> und{" "}
              <strong className="text-text-primary">TypeScript</strong> entwickelt.
              Alle Berechnungen laufen serverseitig ohne externe Kalender-APIs –
              die Quelle der Wahrheit ist ausschließlich der normkonforme
              Algorithmus in{" "}
              <code className="bg-surface-tertiary px-1.5 py-0.5 rounded text-xs font-mono">
                lib/kw.ts
              </code>
              . Dadurch gibt es keine Abhängigkeit von Drittdiensten oder
              möglichen Datenfehlern externer Quellen.
            </p>
          </div>
        </div>

        {/* ── Redaktionsstandards ─────────────────────────────── */}
        <h2 id="redaktionsstandards" className="text-2xl font-semibold mb-4">
          Unsere Redaktionsstandards
        </h2>

        <p className="text-text-secondary mb-5 leading-relaxed">
          Wir folgen klar definierten Qualitätsstandards, damit du dich auf die
          Informationen auf aktuellekw.de verlassen kannst:
        </p>

        <div className="space-y-3 mb-8">
          {[
            {
              icon: "✅",
              title: "Quellenbasiert",
              text: "Jede faktische Aussage zu Kalenderwochen, Feiertagsregeln oder Zeitumstellungen wird mit einer Primärquelle belegt – ISO 8601, offizielle Gesetzestexte oder KMK-Veröffentlichungen. Inline-Quellenangaben (z. B. ISO 8601 § 2.2.10) sind direkt im Text verankert.",
            },
            {
              icon: "🔄",
              title: "Regelmäßige Aktualisierung",
              text: "Zeitkritische Inhalte (aktuelle KW, Feiertage, Schulferien) werden automatisch per ISR (Incremental Static Regeneration) aktualisiert. Redaktionelle Texte werden mindestens einmal jährlich auf Aktualität geprüft und bei Bedarf überarbeitet.",
            },
            {
              icon: "🔍",
              title: "Vier-Augen-Prinzip bei Norminhalten",
              text: "Neue Inhalte zu ISO 8601, Feiertagsrecht oder Schulferienterminen werden vor der Veröffentlichung von einer zweiten Person aus dem Team gegengelesen und gegen die Primärquelle geprüft.",
            },
            {
              icon: "🤖",
              title: "KI-Einsatz transparent",
              text: "Für Strukturierung und sprachliche Überarbeitung setzen wir auch KI-gestützte Werkzeuge ein. Alle veröffentlichten Inhalte werden jedoch abschließend von einem Redaktionsmitglied auf Korrektheit, Ton und Normkonformität geprüft – keine Inhalte werden ohne menschliche Freigabe publiziert.",
            },
            {
              icon: "🚫",
              title: "Keine Werbung, keine Interessenkonflikte",
              text: "aktuellekw.de ist werbefrei und unabhängig. Wir erhalten keine Vergütung für die Verlinkung externer Seiten. Unsere einzige Motivation ist, dir nützliche, verlässliche Zeitplanungsinformationen bereitzustellen.",
            },
            {
              icon: "📬",
              title: "Korrekturen willkommen",
              text: (
                <>
                  Wenn du einen Fehler entdeckst, freuen wir uns über einen
                  Hinweis an{" "}
                  <a
                    href="mailto:info@aktuellekw.de"
                    className="text-accent hover:underline"
                  >
                    info@aktuellekw.de
                  </a>
                  . Sachlich begründete Korrekturen werden zeitnah geprüft und
                  – wenn berechtigt – innerhalb von 48 Stunden umgesetzt.
                </>
              ),
            },
          ].map(({ icon, title, text }, i) => (
            <div
              key={i}
              className="flex gap-3 bg-surface-secondary border border-border rounded-xl p-4"
            >
              <span className="text-lg shrink-0 mt-0.5">{icon}</span>
              <div>
                <p className="font-medium text-text-primary mb-1 text-sm">
                  {title}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quellen & Referenzen ─────────────────────────────── */}
        <h2 id="quellen-referenzen" className="text-2xl font-semibold mb-4">
          Quellen &amp; Referenzen
        </h2>

        <div className="bg-surface-secondary border border-border rounded-2xl p-6 mb-8">
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2.5">
              <span className="text-accent shrink-0 mt-0.5">•</span>
              <span>
                <strong className="text-text-primary">ISO 8601-1:2019</strong> –
                Date and time — Representations for information interchange.
                Internationaler Standard für Datumsformat und Kalenderwochendefinition
                (§ 2.2.8, § 2.2.10, Annex B).
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent shrink-0 mt-0.5">•</span>
              <span>
                <strong className="text-text-primary">DIN EN 28601</strong> –
                Deutsche Fassung der ISO 8601, normgebend für den deutschsprachigen
                Raum (Kalenderwochen in Behörden, Wirtschaft und Schule).
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent shrink-0 mt-0.5">•</span>
              <span>
                <strong className="text-text-primary">Kultusministerkonferenz (KMK)</strong> –
                Offizielle Schulferienübersichten für alle 16 Bundesländer.{" "}
                <a
                  href="https://www.kmk.org/service/ferien.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  kmk.org/service/ferien.html
                </a>
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent shrink-0 mt-0.5">•</span>
              <span>
                <strong className="text-text-primary">Gesetzliche Feiertage</strong> –
                Feiertagsgesetze der 16 Bundesländer (z. B. BayFTG Bayern,
                FeiertagsG NRW) sowie bundeseinheitliche Regelungen im
                Arbeitsrecht.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent shrink-0 mt-0.5">•</span>
              <span>
                <strong className="text-text-primary">Zeitumstellung</strong> –
                Regelung der EU-Sommerzeit-Richtlinie 2000/84/EG sowie der
                deutschen Umsetzung in der Sommerzeit-Verordnung.
              </span>
            </li>
          </ul>
        </div>

        {/* ── Feedback ────────────────────────────────────────── */}
        <div className="bg-surface-secondary border border-border rounded-2xl p-6 mb-8">
          <p className="font-medium text-text-primary mb-1">
            Dein Feedback zählt
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Hast du Anregungen, vermisst du eine bestimmte Information oder
            hast du einen Fehler entdeckt? Schreib uns an{" "}
            <a
              href="mailto:info@aktuellekw.de"
              className="text-accent hover:underline"
            >
              info@aktuellekw.de
            </a>
            . Wir arbeiten ständig daran, aktuellekw.de noch hilfreicher und
            präziser zu gestalten.
          </p>
        </div>

        <p className="text-xs text-text-secondary mb-8">
          Zuletzt aktualisiert:{" "}
          <time dateTime="2026-03-25">März 2026</time>
        </p>

        {/* ── Querlinks ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-8 border-t border-border text-sm">
          <Link href="/" className="text-accent hover:underline">
            ← Startseite
          </Link>
          <Link href="/faq" className="text-accent hover:underline">
            FAQ zur Kalenderwoche
          </Link>
          <Link href="/kalenderwoche" className="text-accent hover:underline">
            Alle Kalenderwochen
          </Link>
          <Link href="/impressum" className="text-accent hover:underline">
            Impressum
          </Link>
        </div>
      </section>
    </>
  );
}
