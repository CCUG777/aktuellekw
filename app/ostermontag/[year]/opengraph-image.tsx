import { ImageResponse } from "next/og";
import { CONTENT_YEARS } from "@/lib/constants";
import { getEasterDate, addDays, formatDateDE, getDayNameDE } from "@/lib/feiertage";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export function generateStaticParams() {
  return CONTENT_YEARS.map((y) => ({ year: String(y) }));
}

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10) || new Date().getFullYear();
  const easter = getEasterDate(year);
  const ostermontag = addDays(easter, 1);
  const dateStr = formatDateDE(ostermontag);

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
          <div style={{ display: "flex", color: "#a1a1a6", fontSize: "20px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "4px" }}>
            Gesetzlicher Feiertag
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ color: "#f5f5f7", fontSize: "72px", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.05, textAlign: "center" }}>
              Ostermontag {year}
            </span>
          </div>

          <div style={{ display: "flex", color: "#0a84ff", fontSize: "30px", fontWeight: 500, marginTop: "4px" }}>
            Montag, {dateStr}
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <div style={{ display: "flex", backgroundColor: "#1c1c1e", border: "1px solid #38383a", color: "#a1a1a6", fontSize: "18px", fontWeight: 500, padding: "8px 22px", borderRadius: "100px" }}>
              Bundesweit frei
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #38383a", paddingTop: "22px" }}>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>Wann ist Ostermontag {year}?</span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
