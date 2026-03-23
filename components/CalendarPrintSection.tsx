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

const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

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

      {/* ── Download Configuration ── */}
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

/* ── PDF Color Palette (aktuellekw.de Branding) ───────────────────── */
const C = {
  primary:       [37, 99, 235] as const,     // #2563EB
  primaryLight:  [239, 246, 255] as const,    // #EFF6FF
  textPrimary:   [17, 24, 39] as const,       // #111827
  textSecondary: [107, 114, 128] as const,    // #6B7280
  textTertiary:  [156, 163, 175] as const,    // #9CA3AF
  textMuted:     [55, 65, 81] as const,       // #374151
  holiday:       [220, 38, 38] as const,      // #DC2626
  white:         [255, 255, 255] as const,
  bgLight:       [249, 250, 251] as const,    // #F9FAFB
  bgHeader:      [243, 244, 246] as const,    // #F3F4F6
  border:        [229, 231, 235] as const,    // #E5E7EB
};

/* ── Holiday list builder for legend ───────────────────────────────── */
function getHolidayList(year: number): { date: string; name: string }[] {
  const holidays = getNationwideHolidays(year);
  const list: { date: string; name: string }[] = [];
  for (const [key, name] of holidays) {
    const [, mm, dd] = key.split("-");
    list.push({ date: `${dd}.${mm}.`, name });
  }
  return list;
}

/* ── PDF Generation (lazy-loaded) — aktuellekw.de Branded ─────────── */
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

  const isLandscape = orientation === "landscape";
  const isA3 = paperSize === "a3";
  const s = isA3 ? 1.35 : 1; // scale factor for A3

  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: paperSize,
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ── Layout constants ──
  const marginX = isA3 ? 15 : 15;
  const marginTop = isA3 ? 12 : 12;
  const headerH = isA3 ? 22 : 18;
  const cardGap = isA3 ? 5 : (isLandscape ? 3.5 : 4);
  const cardPad = isA3 ? 4 : 3;
  const cols = isLandscape ? 4 : 3;
  const rows = isLandscape ? 3 : 4;

  // ── 1. HEADER BANNER ──
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, pageW, marginTop + headerH, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18 * s);
  doc.setTextColor(...C.white);
  doc.text(`Kalender ${year}`, marginX, marginTop + 7 * s);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9 * s);
  doc.setTextColor(255, 255, 255);
  doc.text("mit Kalenderwochen & Feiertagen", marginX, marginTop + 12.5 * s);

  // Branding right-aligned
  doc.setFontSize(8 * s);
  doc.text("aktuellekw.de", pageW - marginX, marginTop + 7 * s, { align: "right" });

  // ── 2. MONTH CARDS GRID ──
  const gridStartY = marginTop + headerH + (isA3 ? 8 : 6);
  const legendH = opts.showHolidays ? (isA3 ? 18 : 14) : 0;
  const footerH = isA3 ? 10 : 8;
  const usableW = pageW - marginX * 2;
  const usableH = pageH - gridStartY - legendH - footerH - 2;
  const cardW = (usableW - (cols - 1) * cardGap) / cols;
  const cardH = (usableH - (rows - 1) * cardGap) / rows;

  // Font sizes
  const monthNameSize = 9 * s;
  const thSize = 6.5 * s;
  const tdSize = 7 * s;
  const kwSize = 6 * s;

  const dayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  for (let m = 0; m < 12; m++) {
    const col = m % cols;
    const row = Math.floor(m / cols);
    const cx = marginX + col * (cardW + cardGap);
    const cy = gridStartY + row * (cardH + cardGap);

    // Card border (rounded rect)
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.4);
    doc.roundedRect(cx, cy, cardW, cardH, 2, 2, "S");

    // Month name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(monthNameSize);
    doc.setTextColor(...C.textPrimary);
    doc.text(MONTH_NAMES[m], cx + cardPad, cy + cardPad + 3.5 * s);

    // Table area
    const tableTop = cy + cardPad + 6 * s;
    const innerW = cardW - cardPad * 2;
    const kwColW = opts.showKW ? innerW * 0.12 : 0;
    const dayColW = (innerW - kwColW) / 7;
    const rowH = (cardH - cardPad * 2 - 6 * s - 4 * s) / 7; // max ~7 week rows incl header

    // Table header background
    doc.setFillColor(...C.bgHeader);
    doc.rect(cx + cardPad, tableTop, innerW, rowH, "F");

    // Table header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(thSize);
    doc.setTextColor(...C.textSecondary);
    let hx = cx + cardPad;
    if (opts.showKW) {
      doc.text("KW", hx + kwColW / 2, tableTop + rowH * 0.65, { align: "center" });
      hx += kwColW;
    }
    for (let i = 0; i < 7; i++) {
      doc.text(dayLabels[i], hx + dayColW / 2, tableTop + rowH * 0.65, { align: "center" });
      hx += dayColW;
    }

    // Build week rows for this month
    const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    const weekRows: { kw: number; days: (number | null)[]; }[] = [];
    let curDays: (number | null)[] = new Array(7).fill(null);
    let curKW = 0;
    let started = false;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(year, m, d));
      const dow = date.getUTCDay();
      const mi = dow === 0 ? 6 : dow - 1;

      if (mi === 0 || d === 1) {
        if (started) {
          weekRows.push({ kw: curKW, days: curDays });
          curDays = new Array(7).fill(null);
        }
        curKW = getISOWeek(date);
        started = true;
      }
      curDays[mi] = d;
    }
    if (started) weekRows.push({ kw: curKW, days: curDays });

    // Holiday lookup
    const holidayDays = new Set<number>();
    if (opts.showHolidays && opts.colorHolidays) {
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        if (holidays.has(key)) holidayDays.add(d);
      }
    }

    // Render week rows
    for (let ri = 0; ri < weekRows.length; ri++) {
      const wr = weekRows[ri];
      const ry = tableTop + rowH * (ri + 1);

      // Alternating row background
      if (ri % 2 === 1) {
        doc.setFillColor(...C.bgLight);
        doc.rect(cx + cardPad, ry, innerW, rowH, "F");
      }

      let rx = cx + cardPad;

      // KW number
      if (opts.showKW) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(kwSize);
        doc.setTextColor(...C.textTertiary);
        doc.text(String(wr.kw), rx + kwColW / 2, ry + rowH * 0.65, { align: "center" });
        rx += kwColW;
      }

      // Day numbers
      for (let di = 0; di < 7; di++) {
        const dayNum = wr.days[di];
        if (dayNum !== null) {
          const isHoliday = holidayDays.has(dayNum);
          const isWeekend = di === 5 || di === 6;

          if (isHoliday) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(tdSize);
            doc.setTextColor(...C.holiday);
          } else if (isWeekend) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(tdSize);
            doc.setTextColor(...C.textSecondary);
          } else {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(tdSize);
            doc.setTextColor(...C.textPrimary);
          }
          doc.text(String(dayNum), rx + dayColW / 2, ry + rowH * 0.65, { align: "center" });
        }
        rx += dayColW;
      }
    }
  }

  // ── 3. HOLIDAY LEGEND ──
  if (opts.showHolidays) {
    const legendY = pageH - legendH - footerH;

    // Divider line
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.3);
    doc.line(marginX, legendY, pageW - marginX, legendY);

    // Legend title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5 * s);
    doc.setTextColor(...C.textPrimary);
    doc.text(`Feiertage ${year} (bundesweit)`, marginX, legendY + 4.5 * s);

    // Holiday entries in columns
    const holidayList = getHolidayList(year);
    const legendCols = isLandscape ? 4 : 3;
    const entryW = usableW / legendCols;
    const entryStartY = legendY + 8 * s;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5 * s);

    for (let i = 0; i < holidayList.length; i++) {
      const hCol = i % legendCols;
      const hRow = Math.floor(i / legendCols);
      const ex = marginX + hCol * entryW;
      const ey = entryStartY + hRow * 3.5 * s;

      // Red dot
      doc.setFillColor(...C.holiday);
      doc.circle(ex + 1.2, ey - 0.8, 0.8, "F");

      // Date + name
      doc.setTextColor(...C.textMuted);
      doc.text(`${holidayList[i].date} ${holidayList[i].name}`, ex + 3.5, ey);
    }
  }

  // ── 4. FOOTER ──
  const footerY = pageH - footerH + 2;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(marginX, footerY - 3, pageW - marginX, footerY - 3);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5 * s);
  doc.setTextColor(...C.textTertiary);
  doc.text(
    "aktuellekw.de \u00B7 Kalenderwochen nach ISO 8601",
    pageW / 2,
    footerY,
    { align: "center" },
  );

  doc.save(`${fileName}.pdf`);
}

/* ── Excel Generation (lazy-loaded) — aktuellekw.de Branded ────────── */
async function generateExcel(
  year: number,
  opts: CalendarOptions,
  holidays: Map<string, string>,
  fileName: string,
) {
  const XLSX = await import("xlsx");

  const wb = XLSX.utils.book_new();
  const colCount = opts.showKW ? 8 : 7;

  // ── Styles (xlsx-js-style compatible cell styles) ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sHeader: any = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
    fill: { fgColor: { rgb: "2563EB" } },
    alignment: { horizontal: "center", vertical: "center" },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sMonthName: any = {
    font: { bold: true, color: { rgb: "111827" }, sz: 11 },
    fill: { fgColor: { rgb: "F3F4F6" } },
    alignment: { horizontal: "left", vertical: "center" },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sTableHead: any = {
    font: { bold: true, color: { rgb: "6B7280" }, sz: 9 },
    fill: { fgColor: { rgb: "F3F4F6" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: { bottom: { style: "thin", color: { rgb: "E5E7EB" } } },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sDay: any = {
    font: { color: { rgb: "111827" }, sz: 10 },
    alignment: { horizontal: "center", vertical: "center" },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sWeekend: any = {
    font: { color: { rgb: "6B7280" }, sz: 10 },
    alignment: { horizontal: "center", vertical: "center" },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sHoliday: any = {
    font: { bold: true, color: { rgb: "DC2626" }, sz: 10 },
    alignment: { horizontal: "center", vertical: "center" },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sKW: any = {
    font: { color: { rgb: "9CA3AF" }, sz: 9 },
    alignment: { horizontal: "center", vertical: "center" },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sAltRow: any = {
    fill: { fgColor: { rgb: "F9FAFB" } },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sFooter: any = {
    font: { color: { rgb: "9CA3AF" }, sz: 8 },
    alignment: { horizontal: "center", vertical: "center" },
  };

  const wsData: (string | number | null)[][] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cellStyles: Record<string, any> = {};

  function cellRef(r: number, c: number): string {
    return XLSX.utils.encode_cell({ r, c });
  }

  // ── Title row ──
  wsData.push([`Kalender ${year} — mit Kalenderwochen & Feiertagen`]);
  for (let c = 0; c < colCount; c++) {
    cellStyles[cellRef(0, c)] = sHeader;
  }

  // ── Empty row after header ──
  wsData.push([]);

  for (let m = 0; m < 12; m++) {
    const rowStart = wsData.length;

    // Month name row
    wsData.push([MONTH_NAMES[m] + " " + year]);
    for (let c = 0; c < colCount; c++) {
      cellStyles[cellRef(rowStart, c)] = sMonthName;
    }

    // Table header row
    const headerRow: string[] = opts.showKW ? ["KW"] : [];
    headerRow.push("Mo", "Di", "Mi", "Do", "Fr", "Sa", "So");
    wsData.push(headerRow);
    for (let c = 0; c < colCount; c++) {
      cellStyles[cellRef(rowStart + 1, c)] = sTableHead;
    }

    // Build week data
    const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    let weekRow: (string | number | null)[] = opts.showKW ? [null] : [];
    for (let i = 0; i < 7; i++) weekRow.push(null);
    let needsNewRow = true;
    let weekIdx = 0;

    const flushWeek = () => {
      const r = wsData.length;
      wsData.push([...weekRow]);

      // Apply cell styles
      for (let c = 0; c < colCount; c++) {
        const isKWCol = opts.showKW && c === 0;
        const dayIdx = opts.showKW ? c - 1 : c;
        const val = weekRow[c];

        let style = isKWCol ? { ...sKW } : (dayIdx === 5 || dayIdx === 6) ? { ...sWeekend } : { ...sDay };

        // Check if this day is a holiday
        if (!isKWCol && val !== null && typeof val === "number") {
          const dateKey = `${year}-${String(m + 1).padStart(2, "0")}-${String(val).padStart(2, "0")}`;
          if (opts.showHolidays && opts.colorHolidays && holidays.has(dateKey)) {
            style = { ...sHoliday };
          }
        }

        // Alternating row background
        if (weekIdx % 2 === 1) {
          style = { ...style, ...sAltRow, fill: sAltRow.fill };
        }

        cellStyles[cellRef(r, c)] = style;
      }
      weekIdx++;
    };

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(year, m, d));
      const dow = date.getUTCDay();
      const mondayIdx = dow === 0 ? 6 : dow - 1;

      if (mondayIdx === 0 || d === 1) {
        if (!needsNewRow) {
          flushWeek();
        }
        weekRow = opts.showKW ? [null] : [];
        for (let i = 0; i < 7; i++) weekRow.push(null);
        if (opts.showKW) {
          weekRow[0] = getISOWeek(date);
        }
        needsNewRow = false;
      }

      const colIdx = opts.showKW ? mondayIdx + 1 : mondayIdx;
      weekRow[colIdx] = d;
    }
    if (!needsNewRow) flushWeek();

    // Empty row between months
    wsData.push([]);
  }

  // ── Holiday legend ──
  if (opts.showHolidays) {
    const legendStart = wsData.length;
    wsData.push([`Feiertage ${year} (bundesweit)`]);
    cellStyles[cellRef(legendStart, 0)] = {
      font: { bold: true, color: { rgb: "111827" }, sz: 9 },
    };

    const holidayList = getHolidayList(year);
    for (const h of holidayList) {
      const r = wsData.length;
      wsData.push([`${h.date} ${h.name}`]);
      cellStyles[cellRef(r, 0)] = {
        font: { color: { rgb: "DC2626" }, sz: 9 },
      };
    }
    wsData.push([]);
  }

  // ── Footer ──
  const footerRow = wsData.length;
  wsData.push(["aktuellekw.de \u00B7 Kalenderwochen nach ISO 8601"]);
  cellStyles[cellRef(footerRow, 0)] = sFooter;

  // ── Build worksheet ──
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws["!cols"] = Array.from({ length: colCount }, (_, i) =>
    i === 0 && opts.showKW ? { wch: 5 } : { wch: 12 }
  );

  // Merge title row
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
  ];

  // Apply styles (only works with xlsx-js-style; plain xlsx ignores .s property)
  for (const [ref, style] of Object.entries(cellStyles)) {
    if (ws[ref]) {
      ws[ref].s = style;
    }
  }

  // Row heights (header taller)
  ws["!rows"] = [{ hpt: 30 }];

  XLSX.utils.book_append_sheet(wb, ws, `Kalender ${year}`);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
