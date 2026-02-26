import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-border">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/aktuellekw-logo.png"
            alt="aktuellekw.de Logo"
            width={180}
            height={180}
            priority
          />
        </Link>
        <div className="flex gap-6 text-sm text-text-secondary">
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
        </div>
      </nav>
    </header>
  );
}
