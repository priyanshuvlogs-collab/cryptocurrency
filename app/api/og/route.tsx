import { ImageResponse } from "next/og";

/**
 * Branded Open Graph / Twitter card for every page: /api/og?title=…&sub=…
 * Titles are Latin (English) so the built-in font renders them crisply.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Indi Radio").slice(0, 90);
  const sub = (searchParams.get("sub") || "Live Punjabi radio from Surrey, Canada · Indi Jaswal").slice(0, 110);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #2a0f1d 0%, #12090f 60%, #1e1119 100%)",
          color: "#fbefe3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 48 48">
            <path d="M24 2 46 24 24 46 2 24Z" fill="#FF9F1C" />
            <path d="M24 10 38 24 24 38 10 24Z" fill="#E0348F" />
            <path d="M24 17 31 24 24 31 17 24Z" fill="#F5C542" />
            <circle cx="24" cy="24" r="3.2" fill="#E0263A" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>
            INDI<span style={{ color: "#FF9F1C" }}>RADIO</span>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              alignItems: "center",
              gap: 12,
              background: "#E0263A",
              color: "#fff",
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            ● ON AIR
          </div>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 40 ? 68 : 84, fontWeight: 900, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 30, color: "#c9b3a8" }}>{sub}</div>
          <div style={{ display: "flex", height: 12, width: "100%", background: "linear-gradient(90deg,#FF9F1C,#E0348F,#F5C542,#E0263A)" }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" } },
  );
}
