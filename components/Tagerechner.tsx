"use client";

import { useState, useMemo } from "react";

/* ── Helpers ───────────────────────────────────────────────────── */
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDE(date: Date): string {
  return `${String(date.getUTCDate()).padStart(2, "0")}.${String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")}.${date.getUTCFullYear()}`;
}

const DAY_NAMES = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

function calcResult(startStr: string, endStr: string) {
  if (!startStr || !endStr) return null;
  const start = new Date(startStr + "T00:00:00Z");
  const end = new Date(endStr + "T00:00:00Z");
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.round(diffMs / 86_400_000);
  const absDays = Math.abs(totalDays);
  const isNegative = totalDays < 0;

  // Weeks and remaining days
  const weeks = Math.floor(absDays / 7);
  const remainingDays = absDays % 7;

  // Working days and weekend days (iterate each day)
  let workDays = 0;
  let weekendDays = 0;
  const step = isNegative ? -1 : 1;
  const loopStart = new Date(start);
  for (let i = 0; i < absDays; i++) {
    loopStart.setUTCDate(loopStart.getUTCDate() + step);
    const day = loopStart.getUTCDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      workDays++;
    }
  }

  // Months (approximate)
  const months = Math.abs(
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
      (end.getUTCMonth() - start.getUTCMonth())
  );

  // Hours
  const hours = absDays * 24;

  return {
    totalDays,
    absDays,
    isNegative,
    weeks,
    remainingDays,
    workDays,
    weekendDays,
    months,
    hours,
    startDate: start,
    endDate: end,
    startDE: fmtDE(start),
    endDE: fmtDE(end),
    startDay: DAY_NAMES[start.getUTCDay()],
    endDay: DAY_NAMES[end.getUTCDay()],
  };
}

/* ── Presets ────────────────────────────────────────────────────── */
function getPresets(): { label: string; startStr: string; endStr: string }[] {
  const today = todayISO();
  const year = new Date().getFullYear();

  return [
    {
      label: "Tage bis Weihnachten",
      startStr: today,
      endStr: `${year}-12-25`,
    },
    {
      label: "Tage bis Silvester",
      startStr: today,
      endStr: `${year}-12-31`,
    },
    {
      label: "Tage bis Jahresende",
      startStr: `${year}-01-01`,
      endStr: `${year}-12-31`,
    },
  ];
}

/* ── Component ─────────────────────────────────────────────────── */
export default function Tagerechner() {
  const [startStr, setStartStr] = useState<string>(todayISO);
  const [endStr, setEndStr] = useState<string>("");

  const result = useMemo(() => calcResult(startStr, endStr), [startStr, endStr]);
  const presets = useMemo(() => getPresets(), []);

  return (
    <div className="bg-surface-secondary border border-border rounded-2xl p-5 md:p-6">
      <h2 className="font-semibold text-lg mb-1">
        Tagerechner &ndash; Tage zwischen zwei Daten
      </h2>
      <p className="text-text-secondary text-sm mb-4">
        Startdatum und Enddatum eingeben &ndash; die Anzahl der Tage wird sofort berechnet.
      </p>

      {/* ── Date Inputs ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label
            htmlFor="tagerechner-start"
            className="block text-xs font-medium text-text-secondary mb-1.5"
          >
            Startdatum (Von)
          </label>
          <input
            id="tagerechner-start"
            type="date"
            value={startStr}
            onChange={(e) => setStartStr(e.target.value)}
            className="w-full bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="tagerechner-end"
            className="block text-xs font-medium text-text-secondary mb-1.5"
          >
            Enddatum (Bis)
          </label>
          <input
            id="tagerechner-end"
            type="date"
            value={endStr}
            onChange={(e) => setEndStr(e.target.value)}
            className="w-full bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* ── Quick Presets ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setStartStr(p.startStr);
              setEndStr(p.endStr);
            }}
            className="text-xs bg-surface-tertiary border border-border rounded-full px-3 py-1.5 text-text-secondary hover:text-accent hover:border-accent/40 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Result ───────────────────────────────────────────── */}
      {result ? (
        <div className="space-y-4">
          {/* Big number */}
          <div className="bg-surface-tertiary border border-accent/40 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary mb-2">
              {result.isNegative ? "Tage (r\u00fcckw\u00e4rts)" : "Tage zwischen den Daten"}
            </p>
            <p className="text-5xl md:text-6xl font-bold text-accent leading-none mb-2">
              {result.absDays}
            </p>
            <p className="text-text-secondary text-sm">
              {result.isNegative ? "Tage in der Vergangenheit" : "Tage"}
              {" \u2013 "}
              vom {result.startDE} ({result.startDay}) bis {result.endDE} ({result.endDay})
            </p>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Wochen", value: result.weeks > 0 ? `${result.weeks} W + ${result.remainingDays} T` : `${result.remainingDays} T` },
              { label: "Monate (\u2248)", value: String(result.months) },
              { label: "Arbeitstage", value: String(result.workDays) },
              { label: "Wochenenden", value: String(result.weekendDays) },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-surface-tertiary border border-border rounded-xl px-3 py-2.5 text-center"
              >
                <div className="text-lg font-bold text-accent">{s.value}</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Extended info */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Kalendertage", value: `${result.absDays} Tage` },
                  { label: "Wochen", value: `${result.weeks} Wochen und ${result.remainingDays} Tage` },
                  { label: "Arbeitstage (Mo\u2013Fr)", value: `${result.workDays} Tage` },
                  { label: "Wochenendtage (Sa+So)", value: `${result.weekendDays} Tage` },
                  { label: "Stunden", value: `${result.hours.toLocaleString("de-DE")} Stunden` },
                  { label: "Monate (ca.)", value: `${result.months} Monate` },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-2.5 text-text-secondary font-medium w-1/2">
                      {row.label}
                    </td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-surface-tertiary border border-border rounded-xl p-5 text-center text-text-secondary text-sm">
          Bitte w&auml;hlen Sie ein Enddatum, um die Tage zu berechnen.
        </div>
      )}
    </div>
  );
}
