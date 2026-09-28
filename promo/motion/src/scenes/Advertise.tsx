import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { Callout } from "../components/Callout";
import { TapCursor } from "../components/Cursor";
import { FadeUp, RiseWords } from "../components/Kinetic";
import { Phone } from "../components/Phone";
import type { PromoProps } from "../schema";
import { C, FONT } from "../theme";

const SWAP = 128; // frame where the phone moves from packages to the pricing form

export const Advertise: React.FC<{ p: PromoProps["advertise"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 90 } });
  const swap = interpolate(frame, [SWAP, SWAP + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Background tint="marigold" />
      <div style={{ position: "absolute", top: 140, left: 90, right: 90 }}>
        <RiseWords
          words={p.title}
          stagger={6}
          lineGap={-26}
          colors={[C.ink, C.ink]}
          style={{ fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 124, lineHeight: 1.12 }}
        />
        <FadeUp delay={12} style={{ fontFamily: FONT.text, fontWeight: 700, fontSize: 44, color: "rgba(20,11,14,0.75)", marginTop: 10 }}>
          {p.sub}
        </FadeUp>
      </div>
      <div style={{ position: "absolute", left: 250, top: 640, transform: `translateY(${(1 - enter) * 1000}px) rotate(${interpolate(frame, [0, 225], [-3, 2])}deg)` }}>
        <div style={{ position: "relative" }}>
          <Phone src="shots/packages-en.jpg" width={580} shotHeight={3400} scroll={[20, 120, 0, 1500]} />
          <div style={{ position: "absolute", inset: 0, opacity: swap }}>
            <Phone src="shots/pricing-pa.jpg" width={580} shotHeight={2700} scroll={[SWAP + 20, 215, 0, 900]} />
          </div>
        </div>
      </div>
      <Callout delay={30} x={40} y={760} tone="cream" fontSize={36}>
        {p.packages[0]}
      </Callout>
      <Callout delay={48} x={560} y={1020} tone="magenta" fontSize={36}>
        {p.packages[1]}
      </Callout>
      <Callout delay={66} x={30} y={1290} tone="cream" fontSize={36}>
        {p.packages[2]}
      </Callout>
      <TapCursor from={[950, 1850]} to={[760, 1606]} start={SWAP - 40} tapAt={SWAP - 6} />
      <Callout delay={SWAP - 30} x={500} y={1570} tone="red" fontSize={40}>
        {p.cta}
      </Callout>
      <Callout delay={SWAP + 30} x={40} y={1700} tone="green" fontSize={38}>
        {p.whatsapp}
      </Callout>
    </AbsoluteFill>
  );
};
