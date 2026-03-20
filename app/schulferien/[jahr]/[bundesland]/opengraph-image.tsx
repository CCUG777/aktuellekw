import { ImageResponse } from "next/og";
import { CONTENT_YEARS, BUNDESLAENDER, getBundeslandBySlug } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export function generateStaticParams() {
  const params: { jahr: string; bundesland: string }[] = [];
  for (const y of CONTENT_YEARS) {
    for (const bl of BUNDESLAENDER) {
      params.push({ jahr: String(y), bundesland: bl.slug });
    }
  }
  return params;
}

export default async function Image({
  params,
}: {
  params: Promise<{ jahr: string; bundesland: string }>;
}) {
  const { jahr: jahrStr, bundesland: slug } = await params;
  const year = parseInt(jahrStr, 10) || new Date().getFullYear();
  const bl = getBundeslandBySlug(slug);
  const name = bl?.name ?? slug;

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
            Schulferien {year}
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
            Alle Ferientermine im Überblick
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
              6 Ferienarten
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
              Start- &amp; Enddatum
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
            Schulferien {name} {year}
          </span>
          <span style={{ color: "#6e6e73", fontSize: "17px" }}>aktuellekw.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
