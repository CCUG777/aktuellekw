/**
 * WeekdayTable – Shows all 7 days (Mon–Sun) of a given week.
 * Highlights today if it falls within the displayed week.
 */

const TAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;
const MONATE = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
] as const;

interface WeekdayTableProps {
  /** Monday (UTC) of the week to display */
  startDate: Date;
  /** Today's date (UTC) – used to highlight the current day */
  today: Date;
}

export default function WeekdayTable({ startDate, today }: WeekdayTableProps) {
  const todayKey = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}`;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-7 gap-1 md:gap-2">
      {days.map((day, i) => {
        const dayKey = `${day.getUTCFullYear()}-${day.getUTCMonth()}-${day.getUTCDate()}`;
        const isToday = dayKey === todayKey;
        const isWeekend = i >= 5; // Sa (5) + So (6)

        return (
          <div
            key={i}
            className={`flex flex-col items-center rounded-xl py-3 px-1 text-center transition-colors ${
              isToday
                ? "bg-accent/15 border border-accent shadow-[0_0_16px_rgba(10,132,255,0.12)]"
                : isWeekend
                ? "bg-surface-secondary border border-border/40"
                : "bg-surface-secondary border border-border"
            }`}
          >
            {/* Wochentag-Kürzel */}
            <span
              className={`text-[10px] md:text-xs font-semibold uppercase tracking-wide mb-1 ${
                isToday ? "text-accent" : "text-text-secondary"
              }`}
            >
              {TAGE[i]}
            </span>

            {/* Tageszahl */}
            <span
              className={`text-base md:text-lg font-bold leading-tight ${
                isToday
                  ? "text-accent"
                  : isWeekend
                  ? "text-text-secondary"
                  : "text-text-primary"
              }`}
            >
              {String(day.getUTCDate()).padStart(2, "0")}
            </span>

            {/* Monatsname */}
            <span className="text-text-secondary text-[10px] md:text-xs mt-0.5">
              {MONATE[day.getUTCMonth()]}
            </span>

            {/* Heute-Badge */}
            {isToday && (
              <span className="text-accent text-[9px] font-bold mt-1 uppercase tracking-wide">
                Heute
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
