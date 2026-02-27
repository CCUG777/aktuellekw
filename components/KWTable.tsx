import Link from "next/link";
import { type KWInfo, formatDateDE } from "@/lib/kw";

interface KWTableProps {
  weeks: KWInfo[];
  currentWeek: number;
}

export default function KWTable({ weeks, currentWeek }: KWTableProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {weeks.map((week) => {
        const isCurrent = week.weekNumber === currentWeek;
        const isPast = week.weekNumber < currentWeek;

        return (
          <Link
            key={week.weekNumber}
            href={`/kw/${week.weekNumber}-${week.year}`}
            className={`relative rounded-xl p-3 border transition-all duration-200 block ${
              isCurrent
                ? "border-accent bg-accent/10 shadow-[0_0_24px_rgba(10,132,255,0.12)]"
                : isPast
                ? "border-border/40 bg-surface-secondary/20 opacity-45 hover:opacity-70"
                : "border-border bg-surface-secondary hover:bg-surface-tertiary hover:border-border/70"
            }`}
          >
            {isCurrent && (
              <span className="absolute top-2 right-2 text-[9px] bg-accent text-white px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide leading-none">
                Jetzt
              </span>
            )}
            <div
              className={`font-semibold text-sm mb-1.5 ${
                isCurrent ? "text-accent" : "text-text-primary"
              }`}
            >
              KW {week.weekNumber}
            </div>
            <div className="text-text-secondary text-xs leading-relaxed">
              {formatDateDE(week.startDate)}
              <br />
              {formatDateDE(week.endDate)}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
