import { ImageResponse } from "next/og";
import { isLeapYear } from "@/lib/kw";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

function nextLeapYear(fromYear: number): number {
  let y = fromYear + 1;
  while (!((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)) y++;
  return y;
}

export default function Image() {
  const currentYear = new Date().getFullYear();
  const nextLY = isLeapYear(currentYear)
    ? currentYear
    : nextLeapYear(currentYear);

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
            gap: "12px",
          }}
        >
          {/* Overline */}
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
            Nächstes Schaltjahr
          </div>

          {/* Big Year */}
          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "140px",
              fontWeight: 700,
              letterSpacing: "-6px",
              lineHeight: 1,
            }}
          >
            {nextLY}
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              color: "#0a84ff",
              fontSize: "30px",
              fontWeight: 500,
              marginTop: "4px",
            }}
          >
            366 Tage · 29. Februar
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#1c1c1e",
                border: "1px solid #38383a",
                color: "#a1a1a6",
                fontSize: "18px",
                fontWeight: 500,
                padding: "8px 22px",
                borderRadius: "100px",
              }}
            >
              Schaltjahr-Rechner
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "#1c1c1e",
                border: "1px solid #38383a",
                color: "#0a84ff",
                fontSize: "18px",
                fontWeight: 500,
                padding: "8px 22px",
                borderRadius: "100px",
              }}
            >
              Alle Schaltjahre 2000–2100
            </div>
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
            Wann ist das nächste Schaltjahr?
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
