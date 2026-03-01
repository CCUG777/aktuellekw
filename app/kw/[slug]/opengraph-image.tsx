import { ImageResponse } from "next/og";
import { getAllKWsForYear, getCurrentKW, formatDateDE } from "@/lib/kw";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Parse slug: "9-2026" → weekNumber=9, year=2026
  const parts = slug.split("-");
  const weekNumber = parts.length >= 2 ? parseInt(parts[0], 10) : NaN;
  const year =
    parts.length >= 2
      ? parseInt(parts[1], 10)
      : parseInt(parts[0], 10);

  // Fallback for invalid slugs
  if (isNaN(weekNumber) || isNaN(year)) {
    const kw = getCurrentKW();
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
            KW {kw.weekNumber} {kw.year}
          </span>
        </div>
      ),
      { ...size }
    );
  }

  const weeks = getAllKWsForYear(year);
  const kwInfo = weeks.find((w) => w.weekNumber === weekNumber);

  // Fallback if week not found
  if (!kwInfo) {
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
            KW {weekNumber} {year}
          </span>
        </div>
      ),
      { ...size }
    );
  }

  const startDE = formatDateDE(kwInfo.startDate);
  const endDE = formatDateDE(kwInfo.endDate);

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
              marginBottom: "4px",
            }}
          >
            Kalenderwoche
          </div>

          {/* KW number with year */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "20px",
            }}
          >
            <span
              style={{
                color: "#a1a1a6",
                fontSize: "52px",
                fontWeight: 400,
              }}
            >
              KW
            </span>
            <span
              style={{
                color: "#f5f5f7",
                fontSize: "170px",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-6px",
              }}
            >
              {weekNumber}
            </span>
            <span
              style={{
                color: "#a1a1a6",
                fontSize: "52px",
                fontWeight: 400,
              }}
            >
              {year}
            </span>
          </div>

          {/* Date range */}
          <div
            style={{
              display: "flex",
              color: "#a1a1a6",
              fontSize: "28px",
              fontWeight: 400,
            }}
          >
            {startDE} – {endDE}
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
            ISO 8601 · Montag bis Sonntag
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
