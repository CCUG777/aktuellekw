import { ImageResponse } from "next/og";
import { getCurrentKW, getWeeksInYear } from "@/lib/kw";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default function Image() {
  const kw = getCurrentKW();
  const weeksInYear = getWeeksInYear(kw.year);

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
          <span
            style={{
              color: "#0a84ff",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
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
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#a1a1a6",
              fontSize: "20px",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "4px",
            }}
          >
            Kalender mit Kalenderwochen
          </div>
          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "88px",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            KW Übersicht {kw.year}
          </div>
          <div
            style={{
              display: "flex",
              color: "#a1a1a6",
              fontSize: "26px",
              fontWeight: 400,
              textAlign: "center",
              marginTop: "4px",
            }}
          >
            KW 1 bis KW {weeksInYear} · {weeksInYear} Wochen · ISO 8601
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "#1c1c1e",
              border: "1px solid #38383a",
              color: "#0a84ff",
              fontSize: "18px",
              fontWeight: 700,
              padding: "8px 22px",
              borderRadius: "100px",
              marginTop: "4px",
            }}
          >
            Aktuelle KW {kw.weekNumber} hervorgehoben
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #38383a",
            paddingTop: "22px",
          }}
        >
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>
            Kalender mit KW · ISO 8601
          </span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>
            aktuellekw.de
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
