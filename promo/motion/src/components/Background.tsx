import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

/** Night-studio backdrop: drifting marigold and magenta glows, film grain and a slow diamond pattern. */
export const Background: React.FC<{ tint?: "ink" | "marigold" }> = ({ tint = "ink" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  const bg = tint === "marigold" ? C.marigold : C.ink;
  const glow1 = tint === "marigold" ? "rgba(255,111,181,0.55)" : "rgba(255,164,27,0.30)";
  const glow2 = tint === "marigold" ? "rgba(224,38,58,0.35)" : "rgba(255,111,181,0.22)";
  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: width * 1.1,
          height: width * 1.1,
          borderRadius: "50%",
          left: -width * 0.35 + Math.sin(t * 0.6) * 80,
          top: height * 0.05 + Math.cos(t * 0.5) * 120,
          background: `radial-gradient(circle, ${glow1} 0%, transparent 65%)`,
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: width * 1.2,
          height: width * 1.2,
          borderRadius: "50%",
          right: -width * 0.45 + Math.cos(t * 0.45) * 90,
          bottom: -height * 0.05 + Math.sin(t * 0.7) * 110,
          background: `radial-gradient(circle, ${glow2} 0%, transparent 65%)`,
          filter: "blur(24px)",
        }}
      />
      {/* diamond lattice, echoing the site's phulkari band */}
      <AbsoluteFill
        style={{
          opacity: tint === "marigold" ? 0.12 : 0.06,
          backgroundImage: `linear-gradient(45deg, ${tint === "marigold" ? C.ink : C.cream} 1.5px, transparent 1.5px), linear-gradient(-45deg, ${
            tint === "marigold" ? C.ink : C.cream
          } 1.5px, transparent 1.5px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${interpolate(frame, [0, 900], [0, 64])}px 0`,
        }}
      />
    </AbsoluteFill>
  );
};

/** The zig-zag phulkari border from the website, scrolling sideways. */
export const PhulkariBand: React.FC<{ top?: number; bottom?: number; height?: number }> = ({ top, bottom, height = 34 }) => {
  const frame = useCurrentFrame();
  const shift = (frame * 2) % 68;
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='68' height='34'><path d='M0 34 17 10 34 34Z' fill='${C.marigold}'/><path d='M34 34 51 10 68 34Z' fill='${C.magenta}'/><path d='M17 12 21 6 25 12 21 18Z' fill='${C.cream}'/><path d='M51 12 55 6 59 12 55 18Z' fill='${C.marigold}'/></svg>`,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        bottom,
        height,
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: `${-shift}px 0`,
      }}
    />
  );
};
