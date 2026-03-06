import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import ActiveNavLink from "./ActiveNavLink";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-lg supports-[backdrop-filter]:bg-surface/60">
      <nav aria-label="Hauptnavigation" className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Wordmark – SEO-optimiert als Text, kein Bild */}
        <Link
          href="/"
          aria-label="aktuellekw.de – Startseite"
          className="flex items-center gap-0 select-none group"
        >
          <span className="text-lg font-semibold tracking-tight text-text-primary group-hover:opacity-80 transition-opacity">
            aktuelle
          </span>
          <span className="text-lg font-bold tracking-tight text-accent group-hover:opacity-80 transition-opacity">
            KW
          </span>
          <span className="text-lg font-semibold tracking-tight text-text-secondary group-hover:opacity-80 transition-opacity">
            .de
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5 text-sm text-text-secondary">
          <ActiveNavLink href="/" label="Startseite" />
          <ActiveNavLink href="/kalenderwoche" label="Kalenderwochen" />
          <ActiveNavLink href="/faq" label="FAQ" />
          <ThemeToggle />
        </div>

        {/* Mobile: Theme Toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
