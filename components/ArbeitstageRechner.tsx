"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ── Bundesland data (must match lib/feiertage.ts) ────────────── */
const BUNDESLAENDER = [
  { code: "BW", name: "Baden-W\u00fcrttemberg" },
  { code: "BY", name: "Bayern" },
  { code: "BE", name: "Berlin" },
  { code: "BB", name: "Brandenburg" },
  { code: "HB", name: "Bremen" },
  { code: "HH", name: "Hamburg" },
  { code: "HE", name: "Hessen" },
  { code: "MV", name: "Mecklenburg-Vorpommern" },
  { code: "NI", name: "Niedersachsen" },
  { code: "NW", name: "Nordrhein-Westfalen" },
  { code: "RP", name: "Rheinland-Pfalz" },
  { code: "SL", name: "Saarland" },
  { code: "SN", name: "Sachsen" },
  { code: "ST", name: "Sachsen-Anhalt" },
  { code: "SH", name: "Schleswig-Holstein" },
  { code: "TH", name: "Th\u00fcringen" },
];

/* ── Holiday calculation (client-side mirror of lib/feiertage.ts) */
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number): Date {
  const r = new Date(date);
  r.setUTCDate(r.getUTCDate() + days);
  return r;
}

function getBussUndBettag(year: number): Date {
  const nov23 = new Date(Date.UTC(year, 10, 23));
  const dow = nov23.getUTCDay();
  const back = dow >= 3 ? dow - 3 : dow + 4;
  return addDays(nov23, -back);
}

interface Holiday { date: Date; states: string[] }

function getHolidays(year: number): Holiday[] {
  const e = getEasterDate(year);
  const ALL = BUNDESLAENDER.map((b) => b.code);
  return [
    { date: new Date(Date.UTC(year, 0, 1)), states: ALL },
    { date: addDays(e, -2), states: ALL },
    { date: addDays(e, 1), states: ALL },
    { date: new Date(Date.UTC(year, 4, 1)), states: ALL },
    { date: addDays(e, 39), states: ALL },
    { date: addDays(e, 50), states: ALL },
    { date: new Date(Date.UTC(year, 9, 3)), states: ALL },
    { date: new Date(Date.UTC(year, 11, 25)), states: ALL },
    { date: new Date(Date.UTC(year, 11, 26)), states: ALL },
    { date: new Date(Date.UTC(year, 0, 6)), states: ["BW", "BY", "ST"] },
    { date: new Date(Date.UTC(year, 2, 8)), states: ["BE", "MV"] },
    { date: addDays(e, 60), states: ["BW", "BY", "HE", "NW", "RP", "SL"] },
    { date: new Date(Date.UTC(year, 7, 15)), states: ["BY", "SL"] },
    { date: new Date(Date.UTC(year, 8, 20)), states: ["TH"] },
    { date: new Date(Date.UTC(year, 9, 31)), states: ["BB", "HB", "HH", "MV", "NI", "SN", "SH", "TH"] },
    { date: new Date(Date.UTC(year, 10, 1)), states: ["BW", "BY", "NW", "RP", "SL"] },
    { date: getBussUndBettag(year), states: ["SN"] },
  ];
}

/* ── Main component ────────────────────────────────────────────── */
export default function ArbeitstageRechner() {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [startDate, setStartDate] = useState(
    `${today.getFullYear()}-01-01`
  );
  const [endDate, setEndDate] = useState(
    `${today.getFullYear()}-12-31`
  );
  const [bundesland, setBundesland] = useState("NW");
  const [urlaub, setUrlaub] = useState(0);
  const [krankheit, setKrankheit] = useState(0);
  const [mode, setMode] = useState<"arbeitstage" | "werktage">("arbeitstage");

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate + "T00:00:00Z");
    const end = new Date(endDate + "T00:00:00Z");
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return null;

    // Get holidays for all relevant years
    const startYear = start.getUTCFullYear();
    const endYear = end.getUTCFullYear();
    const allHolidays: Holiday[] = [];
    for (let y = startYear; y <= endYear; y++) {
      allHolidays.push(...getHolidays(y));
    }

    const holidayDates = new Set(
      allHolidays
        .filter((h) => h.states.includes(bundesland))
        .map((h) => h.date.getTime())
    );

    let kalendertage = 0;
    let werktage = 0; // Mo-Fr
    let werktage6 = 0; // Mo-Sa
    let feiertageWerktag = 0;
    let wochenendtage = 0;

    const cur = new Date(start);
    while (cur <= end) {
      kalendertage++;
      const dow = cur.getUTCDay();
      const isWeekday = dow >= 1 && dow <= 5;
      const isSaturday = dow === 6;

      if (isWeekday) {
        if (holidayDates.has(cur.getTime())) {
          feiertageWerktag++;
        } else {
          werktage++;
        }
        werktage6++;
      } else if (isSaturday) {
        werktage6++;
        wochenendtage++;
      } else {
        wochenendtage++;
      }
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    const arbeitstage = werktage;
    const netto = Math.max(0, arbeitstage - urlaub - krankheit);
    const wochen = Math.floor(arbeitstage / 5);
    const restTage = arbeitstage % 5;

    return {
      kalendertage,
      werktage,
      werktage6,
      feiertageWerktag,
      wochenendtage,
      arbeitstage,
      netto,
      wochen,
      restTage,
    };
  }, [startDate, endDate, bundesland, urlaub, krankheit]);

  const blName = BUNDESLAENDER.find((b) => b.code === bundesland)?.name ?? "";

  return (
    <div className="bg-surface-secondary border border-border rounded-2xl p-5 md:p-8">
      <h2 className="text-lg font-semibold text-text-primary mb-5">
        Arbeitstage-Rechner
      </h2>

      {/* Toggle: Arbeitstage / Werktage */}
      <div className="flex gap-1 bg-surface border border-border rounded-lg p-1 mb-5 w-fit">
        <button
          onClick={() => setMode("arbeitstage")}
          className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
            mode === "arbeitstage"
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Arbeitstage (Mo&ndash;Fr)
        </button>
        <button
          onClick={() => setMode("werktage")}
          className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
            mode === "werktage"
              ? "bg-accent text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Werktage (Mo&ndash;Sa)
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1.5">
            Von
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1.5">
            Bis
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1.5">
            Bundesland
          </label>
          <select
            value={bundesland}
            onChange={(e) => setBundesland(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          >
            {BUNDESLAENDER.map((bl) => (
              <option key={bl.code} value={bl.code}>
                {bl.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">
              Urlaubstage
            </label>
            <input
              type="number"
              min={0}
              max={365}
              value={urlaub}
              onChange={(e) => setUrlaub(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">
              Krankheitstage
            </label>
            <input
              type="number"
              min={0}
              max={365}
              value={krankheit}
              onChange={(e) => setKrankheit(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="border-t border-border pt-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold text-accent">
                {mode === "arbeitstage" ? result.arbeitstage : result.werktage6}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {mode === "arbeitstage" ? "Arbeitstage" : "Werktage"}
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {result.netto}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                Netto-Arbeitstage
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {result.feiertageWerktag}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                Feiertage (Mo&ndash;Fr)
              </div>
            </div>
          </div>

          {/* Detail table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Kalendertage", value: result.kalendertage },
                  { label: "Wochenendtage (Sa+So)", value: result.wochenendtage },
                  { label: "Feiertage an Werktagen", value: result.feiertageWerktag },
                  { label: mode === "arbeitstage" ? "Arbeitstage (Mo\u2013Fr)" : "Werktage (Mo\u2013Sa)", value: mode === "arbeitstage" ? result.arbeitstage : result.werktage6 },
                  { label: "\u2212 Urlaubstage", value: urlaub },
                  { label: "\u2212 Krankheitstage", value: krankheit },
                  { label: "= Netto-Arbeitstage", value: result.netto, highlight: true },
                  { label: "Wochen + Tage", value: `${result.wochen} Wo. + ${result.restTage} Tage` },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-border last:border-b-0 ${row.highlight ? "bg-accent/5 font-semibold" : ""}`}>
                    <td className="px-5 py-2.5 text-text-secondary">{row.label}</td>
                    <td className={`px-5 py-2.5 text-right ${row.highlight ? "text-accent" : "text-text-primary"} font-medium`}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-text-secondary text-xs mt-3">
            Berechnung f&uuml;r <strong className="text-text-primary">{blName}</strong>.
            Gesetzliche Feiertage werden automatisch ber&uuml;cksichtigt.{" "}
            <Link href="/arbeitstage-2026" className="text-accent hover:underline">
              Alle Bundesl&auml;nder im &Uuml;berblick &rarr;
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
