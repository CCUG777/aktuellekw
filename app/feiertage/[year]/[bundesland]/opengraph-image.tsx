import { ImageResponse } from "next/og";
import { CONTENT_YEARS, BUNDESLAENDER, getBundeslandBySlug } from "@/lib/constants";
import { getFeiertageFuerBundesland } from "@/lib/feiertage";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export function generateStaticParams() {
  const params: { year: string; bundesland: string }[] = [];
  for (const y of CONTENT_YEARS) {
    for (const bl of BUNDESLAENDER) {
      params.push({ year: String(y), bundesland: bl.slug });
    }
  }
  return params;
}

export default async function Image({
  params,
}: {
  params: Promise<{ year: string; bundesland: string }>;
}) {
  const { year: yearStr, bundesland: slug } = await params;
  const year = parseInt(yearStr, 10) || new Date().getFullYear();
  const bl = getBundeslandBySlug(slug);
  const name = bl?.name ?? slug;
  const holidays = bl ? getFeiertageFuerBundesland(year, bl.code) : [];

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
            Feiertage {year}
          </div>

          <div
            style={{
              display: "flex",
              color: "#f5f5f7",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {name}
          </div>

          <div style={{ display: "flex", color: "#0a84ff", fontSize: "28px", fontWeight: 500, marginTop: "4px" }}>
            {holidays.length} gesetzliche Feiertage
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
              Datum · Wochentag · KW
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
              Brückentage
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
            Gesetzliche Feiertage {name} {year}
          </span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
