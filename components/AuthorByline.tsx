interface AuthorBylineProps {
  /**
   * Optional date for "Zuletzt aktualisiert".
   * Pass a Date object (e.g. new Date() for ISR pages) or an ISO string ("YYYY-MM-DD").
   * If omitted, only the author credit is shown.
   */
  date?: Date | string;
}

/**
 * Renders a small author byline with a link to /ueber-uns.
 * Optionally includes a "Zuletzt aktualisiert" timestamp.
 * Pure Server Component – no hydration, no client JS.
 */
export default function AuthorByline({ date }: AuthorBylineProps) {
  let formattedDate: string | null = null;
  let isoDate: string | null = null;

  if (date) {
    const d = typeof date === "string" ? new Date(date) : date;
    isoDate = d.toISOString().slice(0, 10);
    formattedDate = d.toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });
  }

  return (
    <p className="text-xs text-text-secondary flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      <span>Von</span>
      <a
        href="/ueber-uns"
        className="text-accent hover:underline underline-offset-2"
      >
        aktuellekw.de Redaktion
      </a>
      {formattedDate && isoDate && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Zuletzt aktualisiert:{" "}
            <time dateTime={isoDate}>{formattedDate}</time>
          </span>
        </>
      )}
    </p>
  );
}
