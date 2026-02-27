"use client";

import { useState } from "react";

/* ── ISO 8601 KW calculation (pure client-side) ───────────────── */
function isoWeekFromDateStr(dateStr: string): {
  kw: number;
  year: number;
  startDate: string;
  endDate: string;
} | null {
  if (!dateStr) return null;

  const date = new Date(dateStr + "T00:00:00Z");
  if (isNaN(date.getTime())) return null;

  // ISO week number
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const kw = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
  );
  const year = d.getUTCFullYear();

  // Monday of that week
  const weekDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const wd = weekDay.getUTCDay() || 7;
  weekDay.setUTCDate(weekDay.getUTCDate() - wd + 1);
  const startDate = fmt(weekDay);
  weekDay.setUTCDate(weekDay.getUTCDate() + 6);
  const endDate = fmt(weekDay);

  return { kw, year, startDate, endDate };
}

function fmt(date: Date): string {
  return `${String(date.getUTCDate()).padStart(2, "0")}.${String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")}.${date.getUTCFullYear()}`;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ── Component ─────────────────────────────────────────────────── */
export default function KWRechner() {
  const [dateStr, setDateStr] = useState<string>(todayISO);
  const result = isoWeekFromDateStr(dateStr);

  return (
    <div className="bg-surface-secondary border border-border rounded-2xl p-5 md:p-6">
      <h2 className="font-semibold text-lg mb-1">Kalenderwoche berechnen</h2>
      <p className="text-text-secondary text-sm mb-4">
        Beliebiges Datum eingeben – die Kalenderwoche wird sofort berechnet.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        {/* Date input */}
        <label className="sr-only" htmlFor="kw-rechner-input">
          Datum für KW-Berechnung
        </label>
        <input
          id="kw-rechner-input"
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="flex-1 min-w-0 bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        />

        {/* Result */}
        {result ? (
          <div className="flex items-center gap-3 bg-surface-tertiary border border-accent/40 rounded-xl px-4 py-3 sm:min-w-[200px]">
            <span className="text-3xl font-bold text-accent leading-none">
              {result.kw}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-text-primary text-sm font-semibold">
                KW {result.kw} · {result.year}
              </span>
              <span className="text-text-secondary text-xs truncate">
                {result.startDate} – {result.endDate}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center sm:min-w-[200px] bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-secondary text-sm">
            Bitte gültiges Datum eingeben
          </div>
        )}
      </div>

      {result && (
        <p className="text-text-secondary text-xs mt-3">
          → Alle Infos zu{" "}
          <a
            href={`/kw/${result.kw}-${result.year}`}
            className="text-accent hover:underline"
          >
            KW {result.kw} {result.year}
          </a>
        </p>
      )}
    </div>
  );
}
