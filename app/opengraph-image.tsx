import { ImageResponse } from "next/og";
import { getCurrentKW, formatDateDE } from "@/lib/kw";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default function Image() {
  const kw = getCurrentKW();
  const startDE = formatDateDE(kw.startDate);
  const endDE = formatDateDE(kw.endDate);

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
        {/* Logo */}
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

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {/* KW label */}
          <div
            style={{
              display: "flex",
              color: "#a1a1a6",
              fontSize: "22px",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "4px",
              marginBottom: "4px",
            }}
          >
            Aktuelle Kalenderwoche
          </div>

          {/* Big KW number */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "18px",
            }}
          >
            <span
              style={{
                color: "#a1a1a6",
                fontSize: "52px",
                fontWeight: 400,
              }}
            >
              KW
            </span>
            <span
              style={{
                color: "#f5f5f7",
                fontSize: "170px",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-6px",
              }}
            >
              {kw.weekNumber}
            </span>
            <span
              style={{
                color: "#a1a1a6",
                fontSize: "52px",
                fontWeight: 400,
              }}
            >
              {kw.year}
            </span>
          </div>

          {/* Date range */}
          <div
            style={{
              display: "flex",
              color: "#a1a1a6",
              fontSize: "28px",
              fontWeight: 400,
              marginTop: "4px",
            }}
          >
            {startDE} – {endDE}
          </div>
        </div>

        {/* Footer */}
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
            ISO 8601 · Wochenkalender Deutschland
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
