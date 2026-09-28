import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

/** A pill that springs in next to the phone to name a feature. */
export const Callout: React.FC<{
  delay: number;
  children: React.ReactNode;
  x: number;
  y: number;
  tone?: "marigold" | "cream" | "red" | "green" | "magenta";
  dot?: boolean;
  fontSize?: number;
}> = ({ delay, children, x, y, tone = "cream", dot, fontSize = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 160 } });
  const bg = { marigold: C.marigold, cream: C.cream, red: C.red, green: C.green, magenta: C.magenta }[tone];
  const fg = tone === "red" ? "#fff" : C.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg)`,
        opacity: s,
        background: bg,
        color: fg,
        fontFamily: FONT.text,
        fontWeight: 800,
        fontSize,
        padding: `${fontSize * 0.42}px ${fontSize * 0.7}px`,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: fontSize * 0.4,
        boxShadow: `6px 6px 0 ${C.ink}`,
        border: `3px solid ${C.ink}`,
        whiteSpace: "nowrap",
      }}
    >
      {dot ? <span style={{ width: fontSize * 0.4, height: fontSize * 0.4, borderRadius: "50%", background: tone === "red" ? "#fff" : C.red, opacity: Math.round(frame / 12) % 2 ? 1 : 0.35 }} /> : null}
      {children}
    </div>
  );
};
