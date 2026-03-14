import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default function Image() {
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
            style={{ color: "#0a84ff", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.3px" }}
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
            Zeitumstellung
          </div>

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
            2026
          </div>

          <div
            style={{
              display: "flex",
              color: "#0a84ff",
              fontSize: "28px",
              fontWeight: 500,
              marginTop: "4px",
            }}
          >
            Termine, Datum & alle Infos
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
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
              29.03. Uhr vor
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
              25.10. Uhr zur&uuml;ck
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
            Wann ist die Zeitumstellung 2026?
          </span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
