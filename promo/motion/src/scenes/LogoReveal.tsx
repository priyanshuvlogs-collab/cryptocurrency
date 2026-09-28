import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, PhulkariBand } from "../components/Background";
import { FadeUp } from "../components/Kinetic";
import { Record } from "../components/Record";
import { C, FONT } from "../theme";

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
  const letters = "INDI RADIO".split("");
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ transform: `scale(${pop}) rotate(${(1 - pop) * -120}deg)`, filter: `drop-shadow(0 40px 80px rgba(0,0,0,0.6))` }}>
          <Record size={640} />
        </div>
        <div style={{ display: "flex", marginTop: 90 }}>
          {letters.map((l, i) => {
            const s = spring({ frame: frame - 14 - i * 2, fps, config: { damping: 14, stiffness: 180 } });
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 900,
                  fontSize: 210,
                  lineHeight: 0.9,
                  letterSpacing: "-0.01em",
                  color: i >= 5 ? C.marigold : C.cream,
                  display: "inline-block",
                  width: l === " " ? 50 : undefined,
                  transform: `translateY(${(1 - s) * 120}px)`,
                  opacity: s,
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
        <FadeUp delay={36} style={{ marginTop: 30, fontFamily: FONT.text, fontWeight: 800, fontSize: 36, letterSpacing: "0.28em", color: C.muted }}>
          LIVE PUNJABI RADIO
        </FadeUp>
      </AbsoluteFill>
      <div style={{ opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }) }}>
        <PhulkariBand bottom={120} />
      </div>
    </AbsoluteFill>
  );
};
