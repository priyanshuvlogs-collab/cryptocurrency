import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { Callout } from "../components/Callout";
import { TapCursor } from "../components/Cursor";
import { FadeUp, RiseWords } from "../components/Kinetic";
import { Phone } from "../components/Phone";
import { Equalizer } from "../components/Record";
import type { PromoProps } from "../schema";
import { C, FONT } from "../theme";

const PHONE_W = 600;
const PHONE_X = 240;
const PHONE_Y = 470;

export const ListenLive: React.FC<{ p: PromoProps["listen"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tapAt = 48;
  const playing = spring({ frame: frame - tapAt - 4, fps, config: { damping: 15 } });
  // Play button on the listen page sits at about 50% across, 72% down the screen.
  const screenW = PHONE_W - 28;
  const btn: [number, number] = [PHONE_X + 14 + screenW * 0.5, PHONE_Y + 14 + (PHONE_W * 2.1 - 28) * 0.72];
  return (
    <AbsoluteFill>
      <Background />
      <div style={{ position: "absolute", top: 150, left: 90, right: 90 }}>
        <RiseWords
          words={p.title}
          stagger={6}
          lineGap={-30}
          colors={[C.cream, C.marigold]}
          style={{ fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 130, lineHeight: 1.1 }}
        />
      </div>
      <FadeUp delay={8} style={{ position: "absolute", top: 225, right: 90, fontFamily: FONT.text, fontWeight: 700, fontSize: 44, color: C.muted, textAlign: "right", whiteSpace: "pre-line" }}>
        {p.sub}
      </FadeUp>
      <div style={{ position: "absolute", left: PHONE_X, top: PHONE_Y, transform: `scale(${interpolate(frame, [0, 135], [0.96, 1.02])})` }}>
        <Phone src="shots/listen-pa.jpg" width={PHONE_W} shotHeight={1688} zoom={[60, 120, 1.18, 50, 72]} />
      </div>
      <TapCursor from={[900, 1800]} to={btn} start={14} tapAt={tapAt} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 250, display: "flex", justifyContent: "center", opacity: playing, transform: `translateY(${(1 - playing) * 60}px)` }}>
        <Equalizer height={130} bars={30} width={18} />
      </div>
      <Callout delay={tapAt + 8} x={90} y={1440} tone="red" dot fontSize={38}>
        {p.nowPlaying}
      </Callout>
    </AbsoluteFill>
  );
};
