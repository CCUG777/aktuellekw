import { ImageResponse } from "next/og";
import { getNextFeiertag, getFeiertageFuerJahr } from "@/lib/feiertage";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default function Image() {
  const year = new Date().getFullYear();
  const holidays = getFeiertageFuerJahr(year);
  const bundesweit = holidays.filter((h) => h.states.length === 16).length;
  const next = getNextFeiertag();

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
            Gesetzliche Feiertage
          </div>

          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "100px",
              fontWeight: 700,
              letterSpacing: "-4px",
              lineHeight: 1,
            }}
          >
            Feiertage {year}
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
            {bundesweit} bundeseinheitliche + regionale Feiertage
          </div>

          {next && (
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
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
                Nächster: {next.feiertag.name}
              </div>
            </div>
          )}
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
            Alle Feiertage je Bundesland
          </span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
