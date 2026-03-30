import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterCategory {
  title: string;
  ariaLabel: string;
  links: FooterLink[];
}

export default function Footer() {
  const year = new Date().getFullYear();

  const categories: FooterCategory[] = [
    {
      title: "Kalenderwochen",
      ariaLabel: "Kalenderwochen-Links",
      links: [
        { label: "Aktuelle KW",               href: "/" },
        { label: `KW-Übersicht ${year}`,       href: "/kalenderwoche" },
        { label: "Wochen im Jahr",             href: "/wie-viele-wochen-hat-ein-jahr" },
        { label: `Kalenderwochen ${year}`,     href: `/kalenderwochen/${year}` },
      ],
    },
    {
      title: "Datum, Feiertage & Rechner",
      ariaLabel: "Datum-Feiertage-Rechner-Links",
      links: [
        { label: "Datum heute",                href: "/datum-heute" },
        { label: "Tagerechner",                href: "/tagerechner" },
        { label: "Arbeitstage berechnen",      href: "/arbeitstage-berechnen" },
        { label: `Zeitumstellung ${year}`,     href: `/zeitumstellung/${year}` },
        { label: `Feiertage ${year}`,          href: `/feiertage/${year}` },
        { label: `Schulferien ${year}`,        href: `/schulferien/${year}` },
        { label: `Ostern ${year}`,             href: `/ostern/${year}` },
        { label: "Schaltjahr",                 href: "/schaltjahr" },
      ],
    },
    {
      title: "Über uns & Rechtliches",
      ariaLabel: "Über-uns-Rechtliches-Links",
      links: [
        { label: "FAQ",        href: "/faq" },
        { label: "Über uns",   href: "/ueber-uns" },
        { label: "Impressum",  href: "/impressum" },
        { label: "Datenschutz", href: "/datenschutz" },
      ],
    },
  ];

  return (
    <footer role="contentinfo" className="border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* ── Link-Gruppen ─────────────────────────────────────────
            Desktop (≥ md): 3-Spalten-Grid, alle Links sichtbar
            Mobile (< md):  Native <details> Accordions (kein JS)  */}
        <div className="md:grid md:grid-cols-3 md:gap-8 mb-8">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="border-b border-border last:border-b-0 md:border-none"
            >
              {/* Desktop: statische Überschrift (auf Mobile ausgeblendet) */}
              <h3 className="hidden md:block text-sm font-medium text-text-primary mb-3">
                {category.title}
              </h3>

              {/* Mobile: native <details> Accordion (auf Desktop ausgeblendet)
                  Kein JS nötig – Browser-native open/close Animation */}
              <details className="md:hidden group">
                <summary className="flex items-center justify-between py-3 cursor-pointer list-none">
                  <span className="text-sm font-medium text-text-primary">
                    {category.title}
                  </span>
                  <svg
                    className="w-4 h-4 text-text-primary/60 transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <nav
                  aria-label={category.ariaLabel}
                  className="flex flex-col gap-3 pb-4"
                >
                  {category.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-text-primary/80 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </details>

              {/* Desktop: Links immer sichtbar (auf Mobile ausgeblendet) */}
              <nav
                aria-label={category.ariaLabel}
                className="hidden md:flex flex-col gap-2"
              >
                {category.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-text-primary/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Trennlinie + Copyright */}
        <div className="border-t border-border pt-6 pb-16 md:pb-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-secondary">
            &copy; {year} aktuellekw.de &middot; Alle Angaben nach ISO 8601
          </p>
          <p className="text-xs text-text-secondary">
            Kalenderwochen-Berechnung nach internationalem Standard
          </p>
        </div>

      </div>
    </footer>
  );
}
