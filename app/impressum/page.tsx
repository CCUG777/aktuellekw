import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum der Webseite aktuellekw.de – Angaben gemäß § 5 TMG. Betreiber: Common Consulting UG, Neumünster.",
  alternates: { canonical: "https://aktuellekw.de/impressum" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Impressum | aktuellekw.de",
    description: "Impressum und rechtliche Angaben zu aktuellekw.de.",
    url: "https://aktuellekw.de/impressum",
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: "https://aktuellekw.de",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Impressum",
        item: "https://aktuellekw.de/impressum",
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

function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Common Consulting UG",
    url: "https://aktuellekw.de",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Biberweg 6",
      postalCode: "24539",
      addressLocality: "Neumünster",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49-171-3117971",
      email: "info@aktuellew.de",
      contactType: "customer service",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function ImpressumPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <OrganizationJsonLd />

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
            <li className="text-text-primary font-medium">Impressum</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Impressum
          </h1>
          <p className="text-text-secondary text-base">
            Angaben gemäß § 5 TMG
          </p>
        </div>

        {/* Content cards */}
        <div className="space-y-4">

          {/* Anbieter */}
          <section className="bg-surface-secondary border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Anbieter
            </h2>
            <address className="not-italic space-y-1 text-text-primary">
              <p className="font-semibold text-lg">Common Consulting UG</p>
              <p>Biberweg 6</p>
              <p>24539 Neumünster</p>
              <p>Deutschland</p>
            </address>
          </section>

          {/* Vertreten durch */}
          <section className="bg-surface-secondary border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Vertreten durch
            </h2>
            <p className="text-text-primary">Cornelia Witt</p>
          </section>

          {/* Kontakt */}
          <section className="bg-surface-secondary border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Kontakt
            </h2>
            <dl className="space-y-2 text-text-primary">
              <div className="flex items-center gap-3">
                <dt className="text-text-secondary text-sm w-24 shrink-0">Telefon</dt>
                <dd>
                  <a
                    href="tel:+491713117971"
                    className="text-accent hover:underline underline-offset-2"
                  >
                    0171 / 3117971
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="text-text-secondary text-sm w-24 shrink-0">E-Mail</dt>
                <dd>
                  <a
                    href="mailto:info@aktuellew.de"
                    className="text-accent hover:underline underline-offset-2"
                  >
                    info@aktuellew.de
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          {/* Registerangaben */}
          <section className="bg-surface-secondary border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Registerangaben
            </h2>
            <dl className="space-y-2 text-text-primary">
              <div className="flex items-start gap-3">
                <dt className="text-text-secondary text-sm w-44 shrink-0">Handelsregister-Nr.</dt>
                <dd>HRB 23719 KI</dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="text-text-secondary text-sm w-44 shrink-0">Registergericht</dt>
                <dd>Kiel</dd>
              </div>
            </dl>
          </section>

          {/* Steuer */}
          <section className="bg-surface-secondary border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Steuerliche Angaben
            </h2>
            <dl className="space-y-2 text-text-primary">
              <div className="flex items-start gap-3">
                <dt className="text-text-secondary text-sm w-44 shrink-0">Steuernummer</dt>
                <dd>20/291/53144</dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="text-text-secondary text-sm w-44 shrink-0">USt-IdNr.</dt>
                <dd>DE454984741</dd>
              </div>
            </dl>
          </section>

          {/* EU-Streitschlichtung */}
          <section className="bg-surface-secondary border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold mb-3">EU-Streitschlichtung</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-2"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          {/* Verbraucherstreitbeilegung */}
          <section className="bg-surface-secondary border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold mb-3">
              Verbraucher&shy;streit&shy;beilegung /
              Universal&shy;schlichtungs&shy;stelle
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          {/* Quelle */}
          <p className="text-text-secondary text-xs px-1">
            Quelle:{" "}
            <a
              href="https://www.e-recht24.de/impressum-generator.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors hover:underline underline-offset-2"
            >
              e-recht24.de
            </a>
          </p>
        </div>

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </>
  );
}
