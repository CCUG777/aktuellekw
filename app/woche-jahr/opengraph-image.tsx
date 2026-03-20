import { ImageResponse } from "next/og";
import { getCurrentKW, getWeeksInYear } from "@/lib/kw";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default function Image() {
  const kw = getCurrentKW();
  const totalWeeks = getWeeksInYear(kw.year);

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
            Welche Woche im Jahr?
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "18px" }}>
            <span style={{ color: "#a1a1a6", fontSize: "52px", fontWeight: 400 }}>Woche</span>
            <span style={{ color: "#f5f5f7", fontSize: "170px", fontWeight: 700, lineHeight: 1, letterSpacing: "-6px" }}>
              {kw.weekNumber}
            </span>
            <span style={{ color: "#a1a1a6", fontSize: "52px", fontWeight: 400 }}>von {totalWeeks}</span>
          </div>

          <div style={{ display: "flex", color: "#0a84ff", fontSize: "28px", fontWeight: 500, marginTop: "4px" }}>
            Kalenderjahr {kw.year} · ISO 8601
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #38383a", paddingTop: "22px" }}>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>Woche im Jahr {kw.year}</span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
