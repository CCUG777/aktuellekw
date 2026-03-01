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
            gap: "20px",
          }}
        >
          {/* FAQ badge */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#0a84ff",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 700,
              padding: "8px 22px",
              borderRadius: "100px",
              letterSpacing: "1px",
            }}
          >
            FAQ
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                color: "#f5f5f7",
                fontSize: "72px",
                fontWeight: 700,
                letterSpacing: "-2px",
                lineHeight: 1.05,
                textAlign: "center",
              }}
            >
              Häufige Fragen
            </span>
            <span
              style={{
                color: "#f5f5f7",
                fontSize: "72px",
                fontWeight: 700,
                letterSpacing: "-2px",
                lineHeight: 1.05,
                textAlign: "center",
              }}
            >
              zur Kalenderwoche
            </span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              color: "#a1a1a6",
              fontSize: "26px",
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Alles zur KW nach ISO 8601 – einfach erklärt
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
            13 Fragen &amp; Antworten · ISO 8601
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
