import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <nav className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/aktuellekw-logo.png"
            alt="aktuellekw.de Logo"
            width={48}
            height={48}
            priority
            className="w-12 h-12"
          />
        </Link>
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
