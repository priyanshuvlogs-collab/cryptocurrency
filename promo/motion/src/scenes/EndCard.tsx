import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, PhulkariBand } from "../components/Background";
import { FadeUp, RiseWords } from "../components/Kinetic";
import { Record } from "../components/Record";
import type { PromoProps } from "../schema";
import { C, FONT } from "../theme";

export const EndCard: React.FC<{ p: PromoProps["end"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const url = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 120 } });
  const pulse = 1 + 0.03 * Math.sin(frame / 5);
  return (
    <AbsoluteFill>
      <Background />
      <PhulkariBand top={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
        <div style={{ transform: `scale(${spring({ frame, fps, config: { damping: 14 } })})` }}>
          <Record size={300} />
        </div>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 150, lineHeight: 0.9, marginTop: 50 }}>
          <span style={{ color: C.cream }}>INDI </span>
          <span style={{ color: C.marigold }}>RADIO</span>
        </div>
        <div style={{ marginTop: 60 }}>
          <RiseWords words={[p.visit]} delay={8} style={{ fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 80, color: C.cream }} />
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT.display,
            fontWeight: 900,
            fontSize: 170,
            color: C.marigold,
            transform: `scale(${url * pulse})`,
            opacity: url,
            textShadow: `8px 8px 0 ${C.magenta}`,
          }}
        >
          {p.url}
        </div>
        <FadeUp delay={34} style={{ display: "flex", gap: 24, marginTop: 70 }}>
          <div style={{ background: C.red, color: "#fff", fontFamily: FONT.text, fontWeight: 800, fontSize: 40, padding: "26px 40px", borderRadius: 14, border: `3px solid ${C.ink}` }}>
            {p.listen}
          </div>
          <div style={{ background: C.green, color: C.ink, fontFamily: FONT.text, fontWeight: 800, fontSize: 40, padding: "26px 40px", borderRadius: 14, border: `3px solid ${C.ink}` }}>
            {p.whatsapp}
          </div>
        </FadeUp>
        <FadeUp delay={48} style={{ marginTop: 50, fontFamily: FONT.text, fontWeight: 700, fontSize: 40, color: C.muted }}>
          {p.footer}
        </FadeUp>
      </AbsoluteFill>
      <div style={{ opacity: interpolate(frame, [0, 20], [0, 1]) }}>
        <PhulkariBand bottom={0} />
      </div>
    </AbsoluteFill>
  );
};
