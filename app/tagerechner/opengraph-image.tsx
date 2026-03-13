import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default function Image() {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const year = todayUTC.getUTCFullYear();

  // Days until end of year
  const endOfYear = new Date(Date.UTC(year, 11, 31));
  const daysRemaining = Math.ceil(
    (endOfYear.getTime() - todayUTC.getTime()) / 86_400_000
  );

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
            Kostenloser Online-Rechner
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1.1,
            }}
          >
            Tagerechner
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              color: "#0a84ff",
              fontSize: "30px",
              fontWeight: 500,
            }}
          >
            Tage zwischen zwei Daten berechnen
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
              Arbeitstage & Wochen
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
              Noch {daysRemaining} Tage in {year}
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
            Datumsrechner · Tageszähler · Arbeitstage
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
