import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von aktuellekw.de – Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.",
  alternates: { canonical: "https://aktuellekw.de/datenschutz" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Datenschutzerklärung | aktuellekw.de",
    description: "Datenschutzerklärung und Informationen zur Datenverarbeitung auf aktuellekw.de.",
    url: "https://aktuellekw.de/datenschutz",
    type: "website",
    locale: "de_DE",
    siteName: "aktuellekw.de",
  },
};

function BreadcrumbJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://aktuellekw.de" },
      { "@type": "ListItem", position: 2, name: "Datenschutzerklärung", item: "https://aktuellekw.de/datenschutz" },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ── Reusable section card ────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface-secondary border border-border rounded-2xl p-6">
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      <div className="text-text-secondary text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

export default function DatenschutzPage() {
  return (
    <>
      <BreadcrumbJsonLd />

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li>
              <Link href="/" className="hover:text-text-primary transition-colors">
                Startseite
              </Link>
            </li>
            <li aria-hidden className="text-border">›</li>
            <li className="text-text-primary font-medium">Datenschutzerklärung</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Datenschutzerklärung
          </h1>
          <p className="text-text-secondary text-base">
            Zuletzt aktualisiert: Februar 2026
          </p>
        </div>

        <div className="space-y-4">

          {/* 1. Verantwortliche Stelle */}
          <Section title="1. Datenschutz auf einen Blick">
            <p className="font-medium text-text-primary">Allgemeine Hinweise</p>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem
              Text aufgeführten Datenschutzerklärung.
            </p>

            <p className="font-medium text-text-primary mt-2">Datenerfassung auf dieser Website</p>
            <p>
              <strong className="text-text-primary">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
              Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle" in dieser
              Datenschutzerklärung entnehmen.
            </p>
            <p>
              <strong className="text-text-primary">Wie erfassen wir Ihre Daten?</strong><br />
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen, z. B. durch
              die Eingabe in ein Kontaktformular. Andere Daten werden automatisch oder nach Ihrer
              Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
              allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des
              Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese
              Website betreten.
            </p>
            <p>
              <strong className="text-text-primary">Wofür nutzen wir Ihre Daten?</strong><br />
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
              gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>
            <p>
              <strong className="text-text-primary">Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br />
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und
              Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem das
              Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine
              Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung
              jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten
              Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
              verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen
              Aufsichtsbehörde zu.
            </p>
            <p>
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns
              wenden.
            </p>
          </Section>

          {/* 2. Verantwortliche Stelle */}
          <Section title="2. Hinweis zur verantwortlichen Stelle">
            <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
            <address className="not-italic text-text-primary bg-surface-tertiary rounded-xl p-4 mt-2">
              <p className="font-semibold">Common Consulting UG</p>
              <p>Biberweg 6</p>
              <p>24539 Neumünster</p>
              <p className="mt-2">
                Telefon:{" "}
                <a href="tel:+491713117971" className="text-accent hover:underline underline-offset-2">
                  0171 / 3117971
                </a>
              </p>
              <p>
                E-Mail:{" "}
                <a href="mailto:commonconsulting@gmx.de" className="text-accent hover:underline underline-offset-2">
                  commonconsulting@gmx.de
                </a>
              </p>
            </address>
            <p className="mt-3">
              Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
              gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen
              Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
            </p>
          </Section>

          {/* 3. Speicherdauer */}
          <Section title="3. Speicherdauer">
            <p>
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
              wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die
              Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder
              eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern
              wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer
              personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche
              Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser
              Gründe.
            </p>
          </Section>

          {/* 4. Allgemeine Hinweise zu Rechtsgrundlagen */}
          <Section title="4. Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung">
            <p>
              Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre
              personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs.
              2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet
              werden. Im Falle einer ausdrücklichen Einwilligung in die Übertragung
              personenbezogener Daten in Drittstaaten erfolgt die Datenverarbeitung außerdem auf
              Grundlage von Art. 49 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies
              oder in den Zugriff auf Informationen in Ihr Endgerät (z. B. via
              Device-Fingerprinting) eingewilligt haben, erfolgt die Datenverarbeitung zusätzlich
              auf Grundlage von § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar.
              Sind Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen
              erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b
              DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer
              rechtlichen Verpflichtung erforderlich sind auf Grundlage von Art. 6 Abs. 1 lit. c
              DSGVO. Die Datenverarbeitung kann ferner auf Grundlage unseres berechtigten Interesses
              nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. Über die jeweils im Einzelfall einschlägigen
              Rechtsgrundlagen wird in den folgenden Absätzen dieser Datenschutzerklärung informiert.
            </p>
          </Section>

          {/* 5. Empfänger */}
          <Section title="5. Empfänger von personenbezogenen Daten">
            <p>
              Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit verschiedenen externen Stellen
              zusammen. Dabei ist teilweise auch eine Übermittlung von personenbezogenen Daten an
              diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur dann an
              externe Stellen weiter, wenn dies im Rahmen einer Vertragserfüllung erforderlich ist,
              wenn wir gesetzlich hierzu verpflichtet sind (z. B. Weitergabe von Daten an
              Steuerbehörden), wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO
              an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die Datenweitergabe
              erlaubt.
            </p>
          </Section>

          {/* 6. Hosting – Vercel */}
          <Section title="6. Hosting">
            <p className="font-medium text-text-primary">Vercel</p>
            <p>
              Wir hosten unsere Website bei Vercel Inc., 340 Pine Street, Suite 701, San Francisco,
              CA 94104, USA. Wenn Sie unsere Website besuchen, erfasst Vercel verschiedene
              Logfiles inklusive Ihrer IP-Adressen.
            </p>
            <p>
              Details entnehmen Sie der Datenschutzerklärung von Vercel:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-2"
              >
                https://vercel.com/legal/privacy-policy
              </a>
              .
            </p>
            <p>
              Die Verwendung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir
              haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer
              Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die
              Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs.
              1 TDDDG, soweit die Einwilligung die Speicherung von Cookies oder den Zugriff auf
              Informationen im Endgerät des Nutzers (z. B. Device-Fingerprinting) umfasst. Die
              Einwilligung ist jederzeit widerrufbar.
            </p>
            <p>
              Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der EU-Kommission
              gestützt. Details finden Sie hier:{" "}
              <a
                href="https://vercel.com/legal/data-processing-addendum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-2"
              >
                https://vercel.com/legal/data-processing-addendum
              </a>
              .
            </p>
          </Section>

          {/* 7. Allgemeine Hinweise */}
          <Section title="7. SSL- bzw. TLS-Verschlüsselung">
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
              Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als
              Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte
              Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf
              „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
            <p>
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns
              übermitteln, nicht von Dritten mitgelesen werden.
            </p>
          </Section>

          {/* 8. Server-Logfiles */}
          <Section title="8. Server-Log-Dateien">
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
              Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p>
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
              Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der
              Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien
              Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files
              erfasst werden.
            </p>
          </Section>

          {/* 9. Anfrage per E-Mail */}
          <Section title="9. Anfrage per E-Mail oder Telefon">
            <p>
              Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller
              daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der
              Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir
              nicht ohne Ihre Einwilligung weiter.
            </p>
            <p>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO,
              sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur
              Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen
              beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven
              Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf
              Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die
              Einwilligung ist jederzeit widerrufbar.
            </p>
            <p>
              Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis Sie
              uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der
              Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihres
              Anliegens). Zwingende gesetzliche Bestimmungen – insbesondere gesetzliche
              Aufbewahrungsfristen – bleiben unberührt.
            </p>
          </Section>

          {/* 10. Rechte */}
          <Section title="10. Ihre Rechte als betroffene Person">
            <p className="font-medium text-text-primary">Recht auf Auskunft (Art. 15 DSGVO)</p>
            <p>
              Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten
              verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen
              und Kopie der Daten entsprechend den gesetzlichen Vorgaben.
            </p>

            <p className="font-medium text-text-primary mt-3">Recht auf Berichtigung (Art. 16 DSGVO)</p>
            <p>
              Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollständigung der
              Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu
              verlangen.
            </p>

            <p className="font-medium text-text-primary mt-3">Recht auf Löschung (Art. 17 DSGVO)</p>
            <p>
              Sie haben nach Maßgabe der gesetzlichen Vorgaben das Recht zu verlangen, dass Sie
              betreffende Daten unverzüglich gelöscht werden, bzw. alternativ nach Maßgabe der
              gesetzlichen Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.
            </p>

            <p className="font-medium text-text-primary mt-3">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</p>
            <p>
              Sie haben das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, nach
              Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und
              maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen
              Verantwortlichen zu fordern.
            </p>

            <p className="font-medium text-text-primary mt-3">Beschwerderecht (Art. 77 DSGVO)</p>
            <p>
              Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen
              Rechtsbehelfs haben Sie das Recht auf Beschwerde bei einer Aufsichtsbehörde,
              insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthaltsorts, ihres
              Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, wenn Sie der Ansicht sind,
              dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO
              verstößt. Die Aufsichtsbehörde für Schleswig-Holstein ist das{" "}
              <a
                href="https://www.datenschutzzentrum.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-2"
              >
                Unabhängige Landeszentrum für Datenschutz Schleswig-Holstein (ULD)
              </a>
              .
            </p>
          </Section>

          {/* 11. Widerspruchsrecht */}
          <Section title="11. Widerspruchsrecht">
            <p>
              Sofern Ihre personenbezogenen Daten auf Grundlage von berechtigten Interessen gemäß
              Art. 6 Abs. 1 S. 1 lit. f DSGVO verarbeitet werden, haben Sie das Recht, gemäß Art.
              21 DSGVO Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen,
              soweit dafür Gründe vorliegen, die sich aus Ihrer besonderen Situation ergeben.
            </p>
            <p>
              Möchten Sie von Ihrem Widerrufs- oder Widerspruchsrecht Gebrauch machen, genügt eine
              E-Mail an:{" "}
              <a
                href="mailto:commonconsulting@gmx.de"
                className="text-accent hover:underline underline-offset-2"
              >
                commonconsulting@gmx.de
              </a>
            </p>
          </Section>

          {/* 12. Cookies */}
          <Section title="12. Cookies">
            <p>
              Unsere Website verwendet ausschließlich technisch notwendige Cookies. Diese Cookies
              sind erforderlich, damit die Website ordnungsgemäß funktioniert (z. B. zur Speicherung
              Ihrer Theme-Präferenz Hell-/Dunkelmodus). Sie werden nicht für Werbezwecke oder zur
              Nachverfolgung Ihres Verhaltens verwendet.
            </p>
            <p>
              Rechtsgrundlage für die Speicherung technisch notwendiger Cookies ist Art. 6 Abs. 1
              lit. f DSGVO (berechtigtes Interesse an der technischen Bereitstellung der Website)
              sowie § 25 Abs. 2 Nr. 2 TDDDG.
            </p>
          </Section>

          {/* Quelle */}
          <p className="text-text-secondary text-xs px-1">
            Diese Datenschutzerklärung wurde mit Unterstützung von{" "}
            <a
              href="https://www.e-recht24.de"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors hover:underline underline-offset-2"
            >
              e-recht24.de
            </a>{" "}
            erstellt und an die Gegebenheiten dieser Website angepasst.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-border flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Startseite
          </Link>
          <Link
            href="/impressum"
            className="text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            Impressum
          </Link>
        </div>
      </div>
    </>
  );
}
