import Link from "next/link";
import { getCurrentKW } from "@/lib/kw";

export default function NotFound() {
  const kw = getCurrentKW();

  return (
    <section className="max-w-2xl mx-auto px-4 py-20 md:py-28 text-center">
      {/* Big 404 */}
      <p className="text-8xl md:text-9xl font-bold text-text-primary/10 select-none leading-none mb-4">
        404
      </p>
      <h1 className="text-2xl md:text-3xl font-bold mb-3">
        Seite nicht gefunden
      </h1>
      <p className="text-text-secondary leading-relaxed mb-10 max-w-md mx-auto">
        Die angeforderte Seite existiert leider nicht. Vielleicht hilft Dir
        einer der folgenden Links weiter:
      </p>

      {/* Quick-Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-12">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-accent text-white font-medium rounded-xl px-5 py-3 text-sm hover:bg-accent/90 transition-colors"
        >
          <span>Aktuelle KW&nbsp;{kw.weekNumber}</span>
        </Link>
        <Link
          href="/kalenderwoche"
          className="flex items-center justify-center gap-2 bg-surface-secondary border border-border rounded-xl px-5 py-3 text-sm font-medium hover:border-accent/50 hover:bg-surface-tertiary transition-all"
        >
          Kalenderwochen {kw.year}
        </Link>
        <Link
          href="/faq"
          className="flex items-center justify-center gap-2 bg-surface-secondary border border-border rounded-xl px-5 py-3 text-sm font-medium hover:border-accent/50 hover:bg-surface-tertiary transition-all"
        >
          FAQ zur Kalenderwoche
        </Link>
        <Link
          href="/kalender-mit-kalenderwochen"
          className="flex items-center justify-center gap-2 bg-surface-secondary border border-border rounded-xl px-5 py-3 text-sm font-medium hover:border-accent/50 hover:bg-surface-tertiary transition-all"
        >
          Kalender mit KW
        </Link>
      </div>

      {/* Subtle hint */}
      <p className="text-xs text-text-secondary">
        <Link href="/" className="text-accent hover:underline">
          aktuellekw.de
        </Link>{" "}
        &middot; Kalenderwochen nach ISO&nbsp;8601
      </p>
    </section>
  );
}
