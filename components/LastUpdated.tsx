interface LastUpdatedProps {
  /** A fixed ISO date string ("YYYY-MM-DD") or a Date object (e.g. new Date() for ISR pages) */
  date: Date | string;
}

/**
 * Renders a small "Zuletzt aktualisiert" timestamp below page content.
 * Uses <time dateTime="…"> for machine-readability (SEO / AI crawlers).
 * Pure Server Component – no hydration, no client JS.
 */
export default function LastUpdated({ date }: LastUpdatedProps) {
  const d = typeof date === "string" ? new Date(date) : date;
  return (
    <p className="mt-8 text-xs text-text-secondary">
      Zuletzt aktualisiert:{" "}
      <time dateTime={d.toISOString().slice(0, 10)}>
        {d.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </time>
    </p>
  );
}
