import { ImageResponse } from "next/og";
import { CONTENT_YEARS } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export function generateStaticParams() {
  return CONTENT_YEARS.map((y) => ({ year: String(y) }));
}

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10) || new Date().getFullYear();

  // Last Sunday in March
  const marchLast = new Date(Date.UTC(year, 2, 31));
  while (marchLast.getUTCDay() !== 0) marchLast.setUTCDate(marchLast.getUTCDate() - 1);
  const sommerDay = String(marchLast.getUTCDate()).padStart(2, "0");

  // Last Sunday in October
  const octLast = new Date(Date.UTC(year, 9, 31));
  while (octLast.getUTCDay() !== 0) octLast.setUTCDate(octLast.getUTCDate() - 1);
  const winterDay = String(octLast.getUTCDate()).padStart(2, "0");

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
            Uhr umstellen
          </div>

          <div style={{ display: "flex", color: "#f5f5f7", fontSize: "80px", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1 }}>
            Zeitumstellung {year}
          </div>

          <div style={{ display: "flex", gap: "24px", marginTop: "12px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#1c1c1e",
                border: "1px solid #38383a",
                padding: "14px 28px",
                borderRadius: "16px",
                gap: "4px",
              }}
            >
              <span style={{ color: "#0a84ff", fontSize: "20px", fontWeight: 600 }}>Sommerzeit</span>
              <span style={{ color: "#a1a1a6", fontSize: "18px" }}>{sommerDay}.03. · 02→03 Uhr</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#1c1c1e",
                border: "1px solid #38383a",
                padding: "14px 28px",
                borderRadius: "16px",
                gap: "4px",
              }}
            >
              <span style={{ color: "#0a84ff", fontSize: "20px", fontWeight: 600 }}>Winterzeit</span>
              <span style={{ color: "#a1a1a6", fontSize: "18px" }}>{winterDay}.10. · 03→02 Uhr</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #38383a", paddingTop: "22px" }}>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>Zeitumstellung {year} Deutschland</span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
