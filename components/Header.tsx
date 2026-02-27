import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <nav className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

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

        {/* Navigation */}
        <div className="flex items-center gap-5 text-sm text-text-secondary">
          <Link
            href="/"
            className="hover:text-text-primary transition-colors hidden sm:inline"
          >
            Startseite
          </Link>
          <Link
            href="/kalenderwoche"
            className="hover:text-text-primary transition-colors"
          >
            Kalenderwochen
          </Link>
          <Link
            href="/faq"
            className="hover:text-text-primary transition-colors"
          >
            FAQ
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
