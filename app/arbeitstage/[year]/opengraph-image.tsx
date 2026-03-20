import { ImageResponse } from "next/og";
import { CONTENT_YEARS } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export function generateStaticParams() {
  return CONTENT_YEARS.map((y) => ({ year: String(y) }));
}

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10) || new Date().getFullYear();

  // Approximate working days (Mon-Fri) without holidays
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;
  const weekdays = Math.round(totalDays * (5 / 7));

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          padding: "56px 64px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#0a84ff", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            aktuellekw.de
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", color: "#a1a1a6", fontSize: "20px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "4px" }}>
            Arbeitstage
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "20px" }}>
            <span style={{ color: "#f5f5f7", fontSize: "140px", fontWeight: 700, lineHeight: 1, letterSpacing: "-6px" }}>
              {year}
            </span>
          </div>

          <div style={{ display: "flex", color: "#0a84ff", fontSize: "28px", fontWeight: 500, marginTop: "4px" }}>
            ca. {weekdays} Arbeitstage (5-Tage-Woche)
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <div style={{ display: "flex", backgroundColor: "#1c1c1e", border: "1px solid #38383a", color: "#a1a1a6", fontSize: "18px", fontWeight: 500, padding: "8px 22px", borderRadius: "100px" }}>
              Nach Monat &amp; Bundesland
            </div>
            <div style={{ display: "flex", backgroundColor: "#1c1c1e", border: "1px solid #38383a", color: "#0a84ff", fontSize: "18px", fontWeight: 500, padding: "8px 22px", borderRadius: "100px" }}>
              Abzüglich Feiertage
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #38383a", paddingTop: "22px" }}>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>Arbeitstage {year} Deutschland</span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
