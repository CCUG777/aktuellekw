import { ImageResponse } from "next/og";
import { CONTENT_YEARS } from "@/lib/constants";
import { getEasterDate, formatDateDE, getDayNameDE } from "@/lib/feiertage";

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
  const dateStr = formatDateDE(easter);
  const dayName = getDayNameDE(easter);

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
            Wann ist Ostern?
          </div>

          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "90px",
              fontWeight: 700,
              letterSpacing: "-4px",
              lineHeight: 1,
            }}
          >
            Ostern {year}
          </div>

          <div style={{ display: "flex", color: "#0a84ff", fontSize: "30px", fontWeight: 500, marginTop: "4px" }}>
            {dayName}, {dateStr}
          </div>

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
              Ostersonntag
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
              Karfreitag · Ostermontag
            </div>
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
            Ostern {year} · Datum &amp; Feiertage
          </span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
