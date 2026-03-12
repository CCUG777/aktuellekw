import { ImageResponse } from "next/og";
import { getCurrentKW, formatDateDE, getDayNameDE } from "@/lib/kw";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default function Image() {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const kw = getCurrentKW();
  const dayName = getDayNameDE(todayUTC);
  const dateStr = formatDateDE(todayUTC);
  const day = String(todayUTC.getUTCDate()).padStart(2, "0");
  const monthNames = [
    "Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  const monthName = monthNames[todayUTC.getUTCMonth()];

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
            Datum heute
          </div>

          {/* Day name */}
          <div
            style={{
              display: "flex",
              color: "#0a84ff",
              fontSize: "36px",
              fontWeight: 600,
            }}
          >
            {dayName}
          </div>

          {/* Big date */}
          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "120px",
              fontWeight: 700,
              letterSpacing: "-4px",
              lineHeight: 1,
            }}
          >
            {day}. {monthName}
          </div>

          {/* Year + KW */}
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
              {todayUTC.getUTCFullYear()}
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
              KW {kw.weekNumber}
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
            Welcher Tag ist heute?
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
