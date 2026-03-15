import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default function Image() {
  const year = new Date().getFullYear();

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
            gap: "16px",
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
            Kostenloser Rechner
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            Arbeitstage
          </div>
          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            berechnen
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              color: "#0a84ff",
              fontSize: "28px",
              fontWeight: 500,
              marginTop: "4px",
            }}
          >
            Zeitraum · Bundesland · Feiertage · {year}
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "8px",
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
              Urlaub & Krankheit
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
              Arbeitstage vs. Werktage
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
            Arbeitstage berechnen {year}: Kostenloser Rechner
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
