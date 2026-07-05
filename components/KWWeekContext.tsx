import {
  getFeiertageFuerJahr,
  getBrueckentage,
  BUNDESLAND_NAMES,
  ALL_STATES,
  type Feiertag,
} from "@/lib/feiertage";
import { getAllSchulferienForYear } from "@/lib/schulferien";
import { formatDateDE, getDayNameDE } from "@/lib/kw";

/**
 * KWWeekContext – reichert eine KW-Detailseite mit echtem Mehrwert an,
 * den generische KW-Tabellen der Wettbewerber nicht bieten:
 *  - Feiertage, die in dieser Woche liegen (bundesweit / regional)
 *  - Anzahl Arbeitstage dieser Woche
 *  - Brückentag-Hinweis, falls zutreffend
 *  - Schulferien-Überschneidungen je Bundesland
 *  - ICS-Download ("KW in Kalender eintragen")
 *
 * Reine (async) Server-Komponente – keine Client-JS.
 */

interface Props {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
}

function inWeek(d: Date, start: Date, end: Date): boolean {
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}

export default async function KWWeekContext({
  weekNumber,
  year,
  startDate,
  endDate,
}: Props) {
  /* ── Feiertage in dieser Woche ──────────────────────────────── */
  const feiertageInWeek: Feiertag[] = getFeiertageFuerJahr(year)
    .filter((h) => inWeek(h.date, startDate, endDate))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Nationwide holidays that fall on a weekday (Mo–Fr) reduce Arbeitstage überall
  const nationwideWorkdayHolidays = feiertageInWeek.filter(
    (h) => h.isNationwide && h.date.getUTCDay() >= 1 && h.date.getUTCDay() <= 5
  );
  // Regional holidays on a weekday reduce Arbeitstage nur in einzelnen Ländern
  const regionalWorkdayHolidays = feiertageInWeek.filter(
    (h) => !h.isNationwide && h.date.getUTCDay() >= 1 && h.date.getUTCDay() <= 5
  );

  const arbeitstageBundesweit = 5 - nationwideWorkdayHolidays.length;

  /* ── Brückentag-Hinweis für diese Woche ─────────────────────── */
  const brueckentageInWeek = getBrueckentage(year).filter((b) =>
    inWeek(b.feiertagDate, startDate, endDate)
  );

  /* ── Schulferien-Überschneidungen je Bundesland ─────────────── */
  const startISO = startDate.toISOString().slice(0, 10);
  const endISO = endDate.toISOString().slice(0, 10);
  const alleFerien = await getAllSchulferienForYear(year);
  const ferienInWeek = alleFerien
    .map((bl) => {
      const namen = Array.from(
        new Set(
          bl.ferien
            .filter((f) => f.starts_on <= endISO && f.ends_on >= startISO)
            .map((f) => f.name)
        )
      );
      return { bundesland: bl.bundesland, namen };
    })
    .filter((x) => x.namen.length > 0);

  const icsHref = `/kw/${weekNumber}-${year}/ics`;

  const hasContext =
    feiertageInWeek.length > 0 ||
    brueckentageInWeek.length > 0 ||
    ferienInWeek.length > 0;

  return (
    <section className="mb-10 fade-in-delay" aria-labelledby="woche-im-detail">
      <h2 id="woche-im-detail" className="text-lg font-semibold mb-4">
        Was in KW {weekNumber} {year} liegt
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Arbeitstage */}
        <div className="bg-surface-secondary border border-border rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
            Arbeitstage
          </p>
          <p className="text-2xl font-semibold text-text-primary">
            {arbeitstageBundesweit}
            <span className="text-sm font-normal text-text-secondary">
              {" "}
              von 5
            </span>
          </p>
          <p className="text-text-secondary text-sm mt-1 leading-relaxed">
            {nationwideWorkdayHolidays.length === 0
              ? "Volle Arbeitswoche (Mo–Fr), kein bundesweiter Feiertag."
              : `${nationwideWorkdayHolidays
                  .map((h) => h.name)
                  .join(", ")} fällt auf einen Werktag.`}
            {regionalWorkdayHolidays.length > 0 &&
              ` In einzelnen Bundesländern zusätzlich frei: ${regionalWorkdayHolidays
                .map((h) => h.name)
                .join(", ")}.`}
          </p>
        </div>

        {/* Feiertage */}
        <div className="bg-surface-secondary border border-border rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
            Feiertage
          </p>
          {feiertageInWeek.length === 0 ? (
            <p className="text-text-secondary text-sm mt-2">
              In dieser Woche liegt kein gesetzlicher Feiertag.
            </p>
          ) : (
            <ul className="space-y-2 mt-1">
              {feiertageInWeek.map((h) => (
                <li key={h.name} className="text-sm">
                  <span className="text-text-primary font-medium">
                    {h.name}
                  </span>
                  <span className="text-text-secondary">
                    {" "}
                    · {getDayNameDE(h.date)}, {formatDateDE(h.date)} ·{" "}
                    {h.isNationwide
                      ? "bundesweit"
                      : h.states.length === ALL_STATES.length
                        ? "bundesweit"
                        : h.states
                            .map((s) => BUNDESLAND_NAMES[s] ?? s)
                            .join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Brückentag */}
      {brueckentageInWeek.length > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mt-4">
          <p className="text-xs uppercase tracking-wider text-accent mb-1">
            Brückentag-Tipp
          </p>
          <ul className="space-y-1">
            {brueckentageInWeek.map((b) => (
              <li key={b.feiertag} className="text-sm text-text-primary">
                <span className="font-medium">{b.feiertag}</span> (
                {b.wochentag}): {b.tipp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Schulferien */}
      {ferienInWeek.length > 0 && (
        <div className="bg-surface-secondary border border-border rounded-2xl p-5 mt-4">
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
            Schulferien in dieser Woche
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2 text-sm">
            {ferienInWeek.map((x) => (
              <li key={x.bundesland} className="text-text-secondary">
                <span className="text-text-primary font-medium">
                  {x.bundesland}
                </span>
                : {x.namen.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ICS-Download */}
      <div className="mt-4">
        <a
          href={icsHref}
          className="inline-flex items-center gap-2 bg-surface-secondary border border-border rounded-xl px-4 py-2.5 text-sm hover:border-accent/50 hover:bg-surface-tertiary transition-all"
        >
          <span aria-hidden="true">📅</span>
          <span className="text-text-primary font-medium">
            KW {weekNumber} in Kalender eintragen (.ics)
          </span>
        </a>
      </div>

      {!hasContext && (
        <p className="sr-only">
          KW {weekNumber} {year}: keine Feiertage, Brückentage oder Schulferien.
        </p>
      )}
    </section>
  );
}
