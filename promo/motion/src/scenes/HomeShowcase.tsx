import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { Callout } from "../components/Callout";
import { RiseWords, FadeUp } from "../components/Kinetic";
import { Phone } from "../components/Phone";
import { C, FONT } from "../theme";

export const HomeShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 90 } });
  const tilt = interpolate(frame, [0, 195], [8, -4]);
  return (
    <AbsoluteFill>
      <Background />
      <div style={{ position: "absolute", top: 150, left: 90, right: 90 }}>
        <RiseWords words={["ਲਾਈਵ ਪੰਜਾਬੀ ਰੇਡੀਓ"]} style={{ fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 110, color: C.cream, lineHeight: 1.15 }} />
        <FadeUp delay={10} style={{ fontFamily: FONT.text, fontWeight: 700, fontSize: 44, color: C.muted, marginTop: 6 }}>
          Talk shows, music and community, all day.
        </FadeUp>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: 520,
          transform: `translateY(${(1 - rise) * 900}px) perspective(2000px) rotateY(${tilt}deg) rotateX(4deg)`,
        }}
      >
        <Phone src="shots/home-pa.jpg" width={600} shotHeight={6200} scroll={[40, 185, 0, 4400]} />
      </div>
      <Callout delay={40} x={60} y={700} tone="red" dot>
        LIVE NOW
      </Callout>
      <Callout delay={62} x={640} y={960} tone="marigold">
        Call-in shows
      </Callout>
      <Callout delay={84} x={40} y={1280} tone="cream">
        ਪੰਜਾਬੀ + English
      </Callout>
      <Callout delay={106} x={600} y={1560} tone="magenta">
        Bhedan Da Kaal
      </Callout>
    </AbsoluteFill>
  );
};
