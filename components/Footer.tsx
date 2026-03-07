import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Link-Gruppen */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
          {/* Gruppe 1: Kalenderwochen */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Kalenderwochen
            </h3>
            <nav aria-label="Kalenderwochen-Links" className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Aktuelle KW
              </Link>
              <Link href="/kalenderwoche" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                KW-Übersicht {year}
              </Link>
              <Link href="/kalender-mit-kalenderwochen" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Kalender mit KW
              </Link>
              <Link href="/kalenderwochen-uebersicht" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                KW-Übersicht
              </Link>
              <Link href="/kalender-mit-wochen" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Kalender mit Wochen
              </Link>
              <Link href="/kalender-wochenuebersicht" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Wochenübersicht
              </Link>
              <Link href="/woche-jahr" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Woche im Jahr
              </Link>
            </nav>
          </div>

          {/* Gruppe 2: Informationen */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Informationen
            </h3>
            <nav aria-label="Informations-Links" className="flex flex-col gap-2">
              <Link href="/faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                FAQ
              </Link>
              <Link href="/welche-kalenderwoche-haben-wir" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Welche KW haben wir?
              </Link>
              <Link href="/wie-viele-wochen-hat-ein-jahr" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Wochen im Jahr
              </Link>
              <Link href="/schulferien/2025" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Schulferien 2025
              </Link>
              <Link href={`/schulferien/${year}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Schulferien {year}
              </Link>
              <Link href="/schulferien/2027" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Schulferien 2027
              </Link>
              <Link href="/kalenderwochen/2025" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Kalenderwochen 2025
              </Link>
              <Link href="/kalenderwochen/2026" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Kalenderwochen 2026
              </Link>
              <Link href="/kalenderwochen/2027" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Kalenderwochen 2027
              </Link>
            </nav>
          </div>

          {/* Gruppe 3: Rechtliches */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Rechtliches
            </h3>
            <nav aria-label="Rechtliche Links" className="flex flex-col gap-2">
              <Link href="/impressum" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Datenschutz
              </Link>
            </nav>
          </div>
        </div>

        {/* Trennlinie + Copyright */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
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
