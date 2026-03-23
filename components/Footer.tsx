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
        { label: "Kalender mit KW",            href: "/kalender-mit-kalenderwochen" },
        { label: "KW-Übersicht",               href: "/kalenderwochen-uebersicht" },
        { label: "Kalender mit Wochen",        href: "/kalender-mit-wochen" },
        { label: "Wochenübersicht",            href: "/kalender-wochenuebersicht" },
        { label: "Woche im Jahr",              href: "/woche-jahr" },
        { label: "Welche KW haben wir?",       href: "/welche-kalenderwoche-haben-wir" },
        { label: "Wochen im Jahr",             href: "/wie-viele-wochen-hat-ein-jahr" },
        { label: "Kalenderwochen 2025",        href: "/kalenderwochen/2025" },
        { label: `Kalenderwochen ${year}`,     href: `/kalenderwochen/${year}` },
        { label: "Kalenderwochen 2027",        href: "/kalenderwochen/2027" },
      ],
    },
    {
      title: "Datum, Feiertage & Rechner",
      ariaLabel: "Datum-Feiertage-Rechner-Links",
      links: [
        { label: "Datum heute",                href: "/datum-heute" },
        { label: "Tagerechner",                href: "/tagerechner" },
        { label: "Schaltjahr",                 href: "/schaltjahr" },
        { label: `Arbeitstage ${year}`,        href: `/arbeitstage/${year}` },
        { label: "Arbeitstage berechnen",      href: "/arbeitstage-berechnen" },
        { label: `Zeitumstellung ${year}`,     href: `/zeitumstellung/${year}` },
        { label: `Sommerzeit ${year}`,         href: "/sommerzeit" },
        { label: `Winterzeit ${year}`,         href: "/winterzeit" },
        { label: "Feiertage Deutschland",      href: "/feiertage" },
        { label: "Feiertage 2025",             href: "/feiertage/2025" },
        { label: `Feiertage ${year}`,          href: `/feiertage/${year}` },
        { label: "Feiertage 2027",             href: "/feiertage/2027" },
        { label: `Ostern ${year}`,             href: `/ostern/${year}` },
        { label: `Ostermontag ${year}`,        href: `/ostermontag/${year}` },
        { label: `Osterferien ${year}`,        href: `/osterferien/${year}` },
        { label: `Feiertage NRW ${year}`,      href: `/feiertage/${year}/nordrhein-westfalen` },
        { label: `Feiertage Bayern ${year}`,   href: `/feiertage/${year}/bayern` },
        { label: `Feiertage BW ${year}`,       href: `/feiertage/${year}/baden-wuerttemberg` },
        { label: `Feiertage Hessen ${year}`,   href: `/feiertage/${year}/hessen` },
        { label: "Schulferien 2025",           href: "/schulferien/2025" },
        { label: `Schulferien ${year}`,        href: `/schulferien/${year}` },
        { label: "Schulferien 2027",           href: "/schulferien/2027" },
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
