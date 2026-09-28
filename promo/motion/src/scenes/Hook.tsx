import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Callout } from "../components/Callout";
import { FadeUp, RiseWords } from "../components/Kinetic";
import { Equalizer } from "../components/Record";
import type { PromoProps } from "../schema";
import { C, FONT } from "../theme";

export const Hook: React.FC<{ p: PromoProps["hook"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 105], [1, 1.06]);
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ padding: "0 90px", justifyContent: "center", transform: `scale(${zoom})` }}>
        <Callout delay={2} x={90} y={430} tone="red" dot fontSize={38}>
          {p.pill}
        </Callout>
        <RiseWords
          words={p.words}
          delay={8}
          stagger={7}
          lineGap={-40}
          colors={p.words.map((_, i) => (i === p.words.length - 1 ? C.marigold : C.cream))}
          style={{ fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 250, lineHeight: 1.12 }}
        />
        <FadeUp delay={34} style={{ marginTop: 40, fontFamily: FONT.text, fontWeight: 700, fontSize: 52, color: C.muted }}>
          {p.sub}
        </FadeUp>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 90, bottom: 170 }}>
        <Equalizer height={140} bars={26} width={20} />
      </div>
    </AbsoluteFill>
  );
};
