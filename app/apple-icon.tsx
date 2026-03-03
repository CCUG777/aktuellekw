import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
          }}
        >
          <span
            style={{
              color: "#f5f5f7",
              fontSize: "52px",
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-1px",
            }}
          >
            KW
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
