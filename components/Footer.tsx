"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Mobile (< md):  Accordions mit smooth height-Animation  */}
        <div className="md:grid md:grid-cols-3 md:gap-8 mb-8">
          {categories.map((category, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={category.title}
                className="border-b border-border last:border-b-0 md:border-none"
              >
                {/* Mobile: klickbarer Accordion-Header (auf Desktop ausgeblendet)
                    Fix P1: text-sm font-medium statt text-xs uppercase tracking-wider */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`footer-section-${index}`}
                  className="w-full flex items-center justify-between py-3 md:hidden"
                >
                  <span className="text-sm font-medium text-text-primary">
                    {category.title}
                  </span>
                  {/* Chevron dreht sich 180° beim Öffnen – Fix P3: text-text-primary/60 */}
                  <svg
                    className={`w-4 h-4 text-text-primary/60 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
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
                </button>

                {/* Desktop: statische Überschrift (auf Mobile ausgeblendet)
                    Fix P1: text-sm font-medium statt text-xs uppercase tracking-wider */}
                <h3 className="hidden md:block text-sm font-medium text-text-primary mb-3">
                  {category.title}
                </h3>

                {/* Link-Liste:
                    Fix P2: max-h-0/max-h-[800px] statt grid-rows – robuster für alle Browser
                    Mobile  → max-h-0 (geschlossen) / max-h-[800px] (offen), overflow-hidden
                    Desktop → md:max-h-none md:overflow-visible, immer sichtbar              */}
                <div
                  id={`footer-section-${index}`}
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-none md:overflow-visible ${
                    isOpen ? "max-h-[800px]" : "max-h-0"
                  }`}
                >
                  <nav
                    aria-label={category.ariaLabel}
                    className="flex flex-col gap-3 sm:gap-2 pb-4 md:pb-0"
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
              </div>
            );
          })}
        </div>

        {/* Trennlinie + Copyright – Fix P4: pb-16 md:pb-0 für BackToTop-Clearance */}
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
