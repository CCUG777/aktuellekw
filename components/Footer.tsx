import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
        <p>&copy; {year} aktuellekw.de</p>
        <div className="flex gap-6">
          <Link
            href="/"
            className="hover:text-text-primary transition-colors"
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
          <Link
            href="/impressum"
            className="hover:text-text-primary transition-colors"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="hover:text-text-primary transition-colors"
          >
            Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  );
}
