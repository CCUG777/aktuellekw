"use client";

import { useState, useCallback, useMemo } from "react";

/* ── Types ─────────────────────────────────────────────────────────── */
type Format = "pdf" | "xlsx";
type Orientation = "landscape" | "portrait";
type PaperSize = "a4" | "a3";

interface CalendarOptions {
  showKW: boolean;
  showHolidays: boolean;
  colorHolidays: boolean;
}

/* ── Holiday helpers (client-side, no server imports) ───────────────── */
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

function getNationwideHolidays(year: number): Map<string, string> {
  const easter = getEasterDate(year);
  const holidays: [Date, string][] = [
    [new Date(Date.UTC(year, 0, 1)), "Neujahr"],
    [addDays(easter, -2), "Karfreitag"],
    [addDays(easter, 1), "Ostermontag"],
    [new Date(Date.UTC(year, 4, 1)), "Tag der Arbeit"],
    [addDays(easter, 39), "Christi Himmelfahrt"],
    [addDays(easter, 50), "Pfingstmontag"],
    [new Date(Date.UTC(year, 9, 3)), "Tag der Deutschen Einheit"],
    [new Date(Date.UTC(year, 11, 25)), "1. Weihnachtsfeiertag"],
    [new Date(Date.UTC(year, 11, 26)), "2. Weihnachtsfeiertag"],
  ];
  const map = new Map<string, string>();
  for (const [d, name] of holidays) {
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    map.set(key, name);
  }
  return map;
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/* ── Calendar data builders ────────────────────────────────────────── */
interface MonthData {
  year: number;
  month: number; // 0-based
  name: string;
  weeks: WeekRow[];
}

interface WeekRow {
  kw: number;
  days: (DayCell | null)[];
}

interface DayCell {
  day: number;
  date: Date;
  dateKey: string;
  isToday: boolean;
  isHoliday: boolean;
  holidayName: string;
}

const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function buildCalendarData(year: number): MonthData[] {
  const holidays = getNationwideHolidays(year);
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const months: MonthData[] = [];

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    const weekRows: WeekRow[] = [];
    let currentWeek: (DayCell | null)[] = new Array(7).fill(null);
    let currentKW = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(year, m, d));
      const dow = date.getUTCDay(); // 0=Sun
      const mondayIdx = dow === 0 ? 6 : dow - 1; // 0=Mon
      const dateKey = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const holidayName = holidays.get(dateKey) || "";

      if (mondayIdx === 0 || d === 1) {
        if (d > 1 && currentKW > 0) {
          weekRows.push({ kw: currentKW, days: currentWeek });
          currentWeek = new Array(7).fill(null);
        }
        currentKW = getISOWeek(date);
      }

      currentWeek[mondayIdx] = {
        day: d,
        date,
        dateKey,
        isToday: dateKey === todayKey,
        isHoliday: !!holidayName,
        holidayName,
      };
    }

    if (currentKW > 0) {
      weekRows.push({ kw: currentKW, days: currentWeek });
    }

    months.push({ year, month: m, name: MONTH_NAMES[m], weeks: weekRows });
  }

  return months;
}

/* ── SEO Content Placeholders ──────────────────────────────────────── */
const SEO_CONTENT_BLOCKS = [
  {
    id: "seo-kalender-feiertage",
    heading: "", // Wird später befüllt
    text: "",    // Wird später befüllt
  },
  {
    id: "seo-kalender-querformat",
    heading: "",
    text: "",
  },
  {
    id: "seo-kalender-bundeslaender",
    heading: "",
    text: "",
  },
];

/* ── Component ─────────────────────────────────────────────────────── */
export default function CalendarPrintSection({ year = 2026 }: { year?: number }) {
  const [format, setFormat] = useState<Format>("pdf");
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [paperSize, setPaperSize] = useState<PaperSize>("a4");
  const [options, setOptions] = useState<CalendarOptions>({
    showKW: true,
    showHolidays: true,
    colorHolidays: true,
  });
  const [downloading, setDownloading] = useState(false);

  const calendarData = useMemo(() => buildCalendarData(year), [year]);
  const holidays = useMemo(() => getNationwideHolidays(year), [year]);

  const dynamicLabel = `Kostenlos als ${format === "pdf" ? "PDF" : "Excel"} · ${paperSize === "a4" ? "DIN A4" : "DIN A3"} · ${orientation === "landscape" ? "Querformat" : "Hochformat"}`;
  const fileName = `kalender-${year}-${paperSize}-${orientation === "landscape" ? "querformat" : "hochformat"}`;

  /* ── Toggle helper ─────────────────────────────────────────── */
  const ToggleGroup = ({ label, value, setValue, items }: {
    label: string;
    value: string;
    setValue: (v: string) => void;
    items: { value: string; label: string }[];
  }) => (
    <div>
      <span className="text-text-secondary text-xs font-medium block mb-1.5">{label}</span>
      <div className="flex rounded-xl overflow-hidden border border-border">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => setValue(item.value)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
              value === item.value
                ? "bg-accent text-white"
                : "bg-surface-tertiary text-text-secondary hover:text-text-primary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Download handler ─────────────────────────────────────── */
  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      if (format === "pdf") {
        await generatePDF(year, orientation, paperSize, options, holidays, fileName);
      } else {
        await generateExcel(year, options, holidays, fileName);
      }
    } catch (e) {
      console.error("Download error:", e);
    } finally {
      setDownloading(false);
    }
  }, [format, orientation, paperSize, options, holidays, year, fileName]);

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <section className="mt-14" id="kalender-zum-ausdrucken">
      <h2 className="text-2xl font-semibold mb-4">
        Kalender {year} zum Ausdrucken
      </h2>
      <p className="text-text-secondary text-sm leading-relaxed mb-6">
        Unser <strong className="text-text-primary">Kalender {year} zum Ausdrucken</strong> steht
        Dir als kostenlose Vorlage im PDF- und Excel-Format zur Verfügung. Wähle zwischen
        Querformat und Hochformat sowie den Papiergrößen DIN&nbsp;A4 und DIN&nbsp;A3 –
        ideal zum Drucken für Büro, Küche oder Schule.
      </p>

      {/* ── A) Calendar Preview ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8"
        aria-label={`Kalender ${year} Vorschau mit Kalenderwochen und Feiertagen`}
      >
        {calendarData.map((month) => (
          <MonthCard
            key={month.month}
            month={month}
            showKW={options.showKW}
            showHolidays={options.showHolidays}
            colorHolidays={options.colorHolidays}
          />
        ))}
      </div>

      {/* ── B) Download Configuration ── */}
      <div className="bg-surface-secondary border border-border rounded-2xl p-5 md:p-6 mb-8">
        <h3 className="font-semibold text-lg mb-1">
          Kalender {year} als PDF oder Excel herunterladen
        </h3>
        <p className="text-text-secondary text-sm mb-5">
          Konfiguriere Deinen Kalender und lade ihn kostenlos herunter.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <ToggleGroup
            label="Format"
            value={format}
            setValue={(v) => setFormat(v as Format)}
            items={[
              { value: "pdf", label: "PDF" },
              { value: "xlsx", label: "Excel" },
            ]}
          />
          <ToggleGroup
            label="Ausrichtung"
            value={orientation}
            setValue={(v) => setOrientation(v as Orientation)}
            items={[
              { value: "landscape", label: "Querformat" },
              { value: "portrait", label: "Hochformat" },
            ]}
          />
          <ToggleGroup
            label="Papierformat"
            value={paperSize}
            setValue={(v) => setPaperSize(v as PaperSize)}
            items={[
              { value: "a4", label: "DIN A4" },
              { value: "a3", label: "DIN A3" },
            ]}
          />
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
          <Checkbox
            label="Kalenderwochen anzeigen"
            checked={options.showKW}
            onChange={(v) => setOptions((o) => ({ ...o, showKW: v }))}
          />
          <Checkbox
            label="Feiertage anzeigen"
            checked={options.showHolidays}
            onChange={(v) => setOptions((o) => ({ ...o, showHolidays: v }))}
          />
          <Checkbox
            label="Feiertage farblich markieren"
            checked={options.colorHolidays}
            onChange={(v) => setOptions((o) => ({ ...o, colorHolidays: v }))}
          />
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
        >
          {downloading ? "Wird erstellt…" : `📥 Kalender ${year} kostenlos herunterladen`}
        </button>
        <p className="text-text-secondary text-xs mt-2">{dynamicLabel}</p>
      </div>

      {/* ── C) SEO Text ── */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold">
          Kalender {year} Vorlage – DIN A4 zum Drucken
        </h3>
        <div className="text-text-secondary text-sm leading-relaxed space-y-3">
          <p>
            Der <strong className="text-text-primary">Kalender {year} für Deutschland</strong> enthält
            auf Wunsch alle gesetzlichen Feiertage sowie die Kalenderwochen nach ISO&nbsp;8601.
            So hast Du das gesamte Jahr {year} auf einem Blatt – übersichtlich, kostenlos und
            sofort druckbereit. Lade Dir jetzt Deinen <strong className="text-text-primary">Kalender {year} als
            PDF</strong> oder Excel-Datei herunter.
          </p>
          <p>
            Die kostenlose <strong className="text-text-primary">Kalender-Vorlage</strong> eignet
            sich zum Ausdrucken auf DIN&nbsp;A4 oder DIN&nbsp;A3 – im Quer- oder Hochformat.
            Ob als Wandkalender fürs Büro, Planungshilfe für die Schule oder kompakte
            Jahresübersicht für zu Hause: Unser <strong className="text-text-primary">Kalender {year} zum
            Ausdrucken</strong> ist die ideale Vorlage für Deine Jahresplanung.
          </p>
        </div>
      </div>

      {/* ── SEO-CONTENT-PLATZHALTER ── */}
      {SEO_CONTENT_BLOCKS.filter((block) => block.heading && block.text).map((block) => (
        <section key={block.id} id={block.id} className="mb-8">
          <h3 className="text-xl font-semibold mb-3">{block.heading}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{block.text}</p>
        </section>
      ))}
    </section>
  );
}

/* ── MonthCard sub-component ───────────────────────────────────────── */
function MonthCard({
  month,
  showKW,
  showHolidays,
  colorHolidays,
}: {
  month: MonthData;
  showKW: boolean;
  showHolidays: boolean;
  colorHolidays: boolean;
}) {
  const DAY_HEADERS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  return (
    <div className="bg-surface-secondary border border-border rounded-xl p-3">
      <h4 className="text-sm font-semibold text-text-primary mb-2 text-center">
        {month.name} {month.year}
      </h4>
      <table className="w-full text-xs tabular-nums" aria-label={`${month.name} ${month.year}`}>
        <thead>
          <tr>
            {showKW && (
              <th className="text-text-secondary/50 font-normal pb-1 w-7 text-left">KW</th>
            )}
            {DAY_HEADERS.map((d) => (
              <th key={d} className="text-text-secondary font-medium pb-1 text-center w-[12%]">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {month.weeks.map((week, wi) => (
            <tr key={wi}>
              {showKW && (
                <td className="text-text-secondary/40 text-[10px] pr-1 align-middle">
                  {week.kw}
                </td>
              )}
              {week.days.map((cell, di) => {
                if (!cell) {
                  return <td key={di} />;
                }
                const isHolidayColored =
                  showHolidays && colorHolidays && cell.isHoliday;
                const isWeekend = di === 5 || di === 6;
                return (
                  <td
                    key={di}
                    className={`text-center py-0.5 align-middle ${
                      cell.isToday
                        ? "bg-accent/20 text-accent font-bold rounded"
                        : isHolidayColored
                        ? "text-red-500 dark:text-red-400 font-medium"
                        : isWeekend
                        ? "text-text-secondary/70"
                        : "text-text-primary"
                    }`}
                    title={
                      showHolidays && cell.holidayName
                        ? cell.holidayName
                        : undefined
                    }
                  >
                    {cell.day}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Checkbox sub-component ────────────────────────────────────────── */
function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-border accent-accent w-4 h-4"
      />
      <span>{label}</span>
    </label>
  );
}

/* ── PDF Generation (lazy-loaded) ──────────────────────────────────── */
async function generatePDF(
  year: number,
  orientation: Orientation,
  paperSize: PaperSize,
  opts: CalendarOptions,
  holidays: Map<string, string>,
  fileName: string,
) {
  const jsPDFModule = await import("jspdf");
  const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
  await import("jspdf-autotable");

  const isLandscape = orientation === "landscape";
  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: paperSize,
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = paperSize === "a3" ? 12 : 8;

  // Title
  doc.setFontSize(paperSize === "a3" ? 18 : 14);
  doc.setFont("helvetica", "bold");
  doc.text(`Kalender ${year}`, pageW / 2, margin + 4, { align: "center" });

  // Grid layout
  const cols = isLandscape ? 4 : 3;
  const rows = isLandscape ? 3 : 4;
  const startY = margin + 10;
  const usableW = pageW - margin * 2;
  const usableH = pageH - startY - margin - 6; // 6mm for footer
  const cellW = usableW / cols;
  const cellH = usableH / rows;
  const cellPad = paperSize === "a3" ? 3 : 2;

  const dayHeaders = opts.showKW
    ? ["KW", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
    : ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  for (let m = 0; m < 12; m++) {
    const col = m % cols;
    const row = Math.floor(m / cols);
    const x = margin + col * cellW + cellPad;
    const y = startY + row * cellH;

    // Month name
    const fontSize = paperSize === "a3" ? 9 : 7;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(MONTH_NAMES[m], x + (cellW - cellPad * 2) / 2, y + 4, { align: "center" });

    // Build table body
    const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    const tableRows: string[][] = [];
    let weekRow: string[] = opts.showKW ? [""] : [];
    for (let i = 0; i < 7; i++) weekRow.push("");
    let needsNewRow = true;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(year, m, d));
      const dow = date.getUTCDay();
      const mondayIdx = dow === 0 ? 6 : dow - 1;

      if (mondayIdx === 0 || d === 1) {
        if (!needsNewRow) {
          tableRows.push(weekRow);
        }
        weekRow = opts.showKW ? [""] : [];
        for (let i = 0; i < 7; i++) weekRow.push("");
        if (opts.showKW) {
          weekRow[0] = String(getISOWeek(date));
        }
        needsNewRow = false;
      }

      const colIdx = opts.showKW ? mondayIdx + 1 : mondayIdx;
      weekRow[colIdx] = String(d);
    }
    if (!needsNewRow) tableRows.push(weekRow);

    // Holiday date keys for this month
    const holidayDays = new Set<number>();
    if (opts.showHolidays && opts.colorHolidays) {
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        if (holidays.has(key)) holidayDays.add(d);
      }
    }

    const tableFontSize = paperSize === "a3" ? 7 : 5.5;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
      startY: y + 6,
      margin: { left: x, right: pageW - x - (cellW - cellPad * 2) },
      head: [dayHeaders],
      body: tableRows,
      theme: "plain",
      styles: {
        fontSize: tableFontSize,
        cellPadding: paperSize === "a3" ? 1 : 0.5,
        halign: "center",
        valign: "middle",
        lineWidth: 0,
        textColor: [30, 30, 30],
      },
      headStyles: {
        fontStyle: "bold",
        textColor: [100, 100, 100],
        fontSize: tableFontSize,
      },
      columnStyles: opts.showKW
        ? { 0: { textColor: [160, 160, 160], halign: "left", cellWidth: paperSize === "a3" ? 8 : 6 } }
        : {},
      didParseCell: (data: { section: string; column: { index: number }; cell: { text: string[]; styles: { textColor: number[] } } }) => {
        if (data.section !== "body") return;
        const dayNum = parseInt(data.cell.text[0], 10);
        if (!isNaN(dayNum) && holidayDays.has(dayNum)) {
          data.cell.styles.textColor = [220, 38, 38];
        }
      },
    });
  }

  // Footer
  doc.setFontSize(paperSize === "a3" ? 8 : 6);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "aktuellekw.de \u00B7 Kalenderwochen nach ISO 8601",
    pageW / 2,
    pageH - margin + 2,
    { align: "center" },
  );

  doc.save(`${fileName}.pdf`);
}

/* ── Excel Generation (lazy-loaded) ────────────────────────────────── */
async function generateExcel(
  year: number,
  opts: CalendarOptions,
  holidays: Map<string, string>,
  fileName: string,
) {
  const XLSX = await import("xlsx");

  const wb = XLSX.utils.book_new();
  const wsData: (string | number | null)[][] = [];

  for (let m = 0; m < 12; m++) {
    // Month header
    const headerRow: (string | null)[] = opts.showKW ? ["KW"] : [];
    headerRow.push("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag");

    wsData.push([MONTH_NAMES[m] + " " + year]);
    wsData.push(headerRow);

    const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    let weekRow: (string | number | null)[] = opts.showKW ? [null] : [];
    for (let i = 0; i < 7; i++) weekRow.push(null);
    let needsNewRow = true;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(year, m, d));
      const dow = date.getUTCDay();
      const mondayIdx = dow === 0 ? 6 : dow - 1;

      if (mondayIdx === 0 || d === 1) {
        if (!needsNewRow) {
          wsData.push(weekRow);
        }
        weekRow = opts.showKW ? [null] : [];
        for (let i = 0; i < 7; i++) weekRow.push(null);
        if (opts.showKW) {
          weekRow[0] = getISOWeek(date);
        }
        needsNewRow = false;
      }

      const colIdx = opts.showKW ? mondayIdx + 1 : mondayIdx;
      const dateKey = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const holidayName = holidays.get(dateKey);
      if (opts.showHolidays && holidayName) {
        weekRow[colIdx] = `${d} (${holidayName})`;
      } else {
        weekRow[colIdx] = d;
      }
    }
    if (!needsNewRow) wsData.push(weekRow);

    // Empty row between months
    wsData.push([]);
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colCount = opts.showKW ? 8 : 7;
  ws["!cols"] = Array.from({ length: colCount }, (_, i) =>
    i === 0 && opts.showKW ? { wch: 5 } : { wch: 14 }
  );

  XLSX.utils.book_append_sheet(wb, ws, `Kalender ${year}`);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
