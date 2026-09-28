import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { linearTiming, springTiming, TransitionSeries, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type { PromoProps } from "./schema";
import { Advertise } from "./scenes/Advertise";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { HomeShowcase } from "./scenes/HomeShowcase";
import { ListenLive } from "./scenes/ListenLive";
import { LogoReveal } from "./scenes/LogoReveal";
import { WorldClocks } from "./scenes/WorldClocks";
import { C, FONT, FPS } from "./theme";

const T = 16; // transition length in frames
const DURATIONS = [105, 105, 195, 135, 135, 225, 165]; // hook, logo, home, listen, clocks, advertise, end

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: TransitionPresentation<any>[] = [
  fade(),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-bottom" }),
  fade(),
];

/** Length without any voiceover padding. */
export const BASE_DURATION = DURATIONS.reduce((a, b) => a + b, 0) - T * (DURATIONS.length - 1);

/** Frame where each scene starts (transitions overlap neighbouring scenes). */
const STARTS = DURATIONS.map((_, i) => DURATIONS.slice(0, i).reduce((a, b) => a + b, 0) - T * i);

/** Burned-in subtitle for muted autoplay: one line per scene, faded in and out. */
const Subtitles: React.FC<{ lines: string[]; durations: number[] }> = ({ lines, durations }) => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i + 1 < STARTS.length && frame >= STARTS[i + 1]) i++;
  const line = lines[i];
  if (!line) return null;
  const local = frame - STARTS[i];
  const opacity = interpolate(local, [T, T + 8, durations[i] - 10, durations[i]], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 60, pointerEvents: "none" }}>
      <div
        style={{
          opacity,
          maxWidth: 940,
          textAlign: "center",
          fontFamily: FONT.gurmukhi,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.35,
          color: C.cream,
          background: "rgba(20,11,14,0.82)",
          padding: "18px 30px",
          borderRadius: 18,
        }}
      >
        {line}
      </div>
    </AbsoluteFill>
  );
};

export const Promo: React.FC<PromoProps> = (props) => {
  const { audio, subtitles, extraEndFrames } = props;
  const durations = DURATIONS.map((d, i) => (i === DURATIONS.length - 1 ? d + extraEndFrames : d));
  const total = BASE_DURATION + extraEndFrames;
  const scenes = [
    <Hook key="hook" p={props.hook} />,
    <LogoReveal key="logo" p={props.logo} />,
    <HomeShowcase key="home" p={props.home} />,
    <ListenLive key="listen" p={props.listen} />,
    <WorldClocks key="clocks" p={props.clocks} />,
    <Advertise key="advertise" p={props.advertise} />,
    <EndCard key="end" p={props.end} />,
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <TransitionSeries>
        {scenes.flatMap((scene, i) => {
          const items = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={durations[i]}>
              {scene}
            </TransitionSeries.Sequence>,
          ];
          if (i < scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                presentation={TRANSITIONS[i]}
                timing={i % 2 ? springTiming({ config: { damping: 200 }, durationInFrames: T }) : linearTiming({ durationInFrames: T })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      {subtitles.show ? <Subtitles lines={subtitles.lines} durations={durations} /> : null}
      {audio.music ? (
        <Audio
          src={staticFile(audio.music)}
          volume={(f) => audio.musicVolume * interpolate(f, [0, 20, total - 40, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      ) : null}
      {audio.voiceover ? (
        <Sequence from={Math.round(audio.voiceoverStartSeconds * FPS)}>
          <Audio src={staticFile(audio.voiceover)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
