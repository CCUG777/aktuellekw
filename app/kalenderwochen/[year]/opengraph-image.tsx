import { ImageResponse } from "next/og";
import { getWeeksInYear } from "@/lib/kw";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default async function Image({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  // Fallback for invalid year
  if (isNaN(year) || year < 2000 || year > 2099) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
          }}
        >
          <span style={{ color: "#f5f5f7", fontSize: "40px", margin: "auto" }}>
            Kalenderwochen
          </span>
        </div>
      ),
      { ...size }
    );
  }

  const weeksInYear = getWeeksInYear(year);

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
            Jahresübersicht
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "88px",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            Kalenderwochen {year}
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              color: "#a1a1a6",
              fontSize: "26px",
              fontWeight: 400,
              textAlign: "center",
              marginTop: "4px",
            }}
          >
            KW 1 bis KW {weeksInYear} · {weeksInYear} Wochen · ISO 8601
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
            ISO 8601 · Wochenkalender {year}
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
