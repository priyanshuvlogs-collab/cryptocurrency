import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { FadeUp, RiseWords } from "../components/Kinetic";
import type { PromoProps } from "../schema";
import { C, FONT } from "../theme";

// An example moment (7:00 PM in Vancouver, September) shown in four cities.
const CITIES: { city: string; h: number; m: number; label: string }[] = [
  { city: "Vancouver", h: 19, m: 0, label: "7:00 PM" },
  { city: "India", h: 7, m: 30, label: "7:30 AM" },
  { city: "UK", h: 3, m: 0, label: "3:00 AM" },
  { city: "Sydney", h: 12, m: 0, label: "12:00 PM" },
];

const Clock: React.FC<{ h: number; m: number; progress: number; size: number }> = ({ h, m, progress, size }) => {
  const minuteDeg = (m / 60) * 360 + 360 * 2 * (1 - progress) * -1;
  const hourDeg = ((h % 12) / 12) * 360 + (m / 60) * 30 - 60 * (1 - progress);
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100">
      <circle r="47" fill={C.ink} stroke={C.marigold} strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x="-1.2" y="-43" width="2.4" height={i % 3 === 0 ? 8 : 4} fill={C.cream} transform={`rotate(${i * 30})`} opacity={i % 3 === 0 ? 1 : 0.5} />
      ))}
      <line x1="0" y1="4" x2="0" y2="-24" stroke={C.cream} strokeWidth="5" strokeLinecap="round" transform={`rotate(${hourDeg})`} />
      <line x1="0" y1="6" x2="0" y2="-36" stroke={C.marigold} strokeWidth="3" strokeLinecap="round" transform={`rotate(${minuteDeg})`} />
      <circle r="4" fill={C.magenta} />
    </svg>
  );
};

export const WorldClocks: React.FC<{ p: PromoProps["clocks"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [20, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Background />
      <div style={{ position: "absolute", top: 170, left: 90, right: 90 }}>
        <RiseWords
          words={p.title}
          stagger={6}
          lineGap={-24}
          colors={[C.cream, C.marigold]}
          style={{ fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 120, lineHeight: 1.12 }}
        />
        <FadeUp delay={12} style={{ fontFamily: FONT.text, fontWeight: 700, fontSize: 44, color: C.muted, marginTop: 10 }}>
          {p.sub}
        </FadeUp>
      </div>
      <div style={{ position: "absolute", top: 760, left: 90, right: 90, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {CITIES.map((c, i) => {
          const s = spring({ frame: frame - 10 - i * 6, fps, config: { damping: 14, stiffness: 130 } });
          return (
            <div
              key={c.city}
              style={{
                background: i === 0 ? C.marigold : "rgba(244,236,221,0.06)",
                border: `3px solid ${i === 0 ? C.ink : "rgba(244,236,221,0.2)"}`,
                borderRadius: 36,
                padding: "40px 30px 36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${0.7 + 0.3 * s}) translateY(${(1 - s) * 80}px)`,
                opacity: s,
                boxShadow: i === 0 ? `10px 10px 0 ${C.magenta}` : undefined,
              }}
            >
              <Clock h={c.h} m={c.m} progress={progress} size={250} />
              <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 88, color: i === 0 ? C.ink : C.cream, marginTop: 24, lineHeight: 1 }}>{c.label}</div>
              <div style={{ fontFamily: FONT.text, fontWeight: 800, fontSize: 34, letterSpacing: "0.18em", color: i === 0 ? C.ink : C.muted, marginTop: 10 }}>
                {c.city.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
