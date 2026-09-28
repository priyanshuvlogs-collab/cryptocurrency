import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { linearTiming, springTiming, TransitionSeries, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { MUSIC, MUSIC_VOLUME, VOICEOVER, VOICEOVER_START_SECONDS } from "./audio";
import { Advertise } from "./scenes/Advertise";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { HomeShowcase } from "./scenes/HomeShowcase";
import { ListenLive } from "./scenes/ListenLive";
import { LogoReveal } from "./scenes/LogoReveal";
import { WorldClocks } from "./scenes/WorldClocks";
import { FPS } from "./theme";

const T = 16; // transition length in frames
const SCENES = [
  { id: "hook", C: Hook, d: 105 },
  { id: "logo", C: LogoReveal, d: 105 },
  { id: "home", C: HomeShowcase, d: 195 },
  { id: "listen", C: ListenLive, d: 135 },
  { id: "clocks", C: WorldClocks, d: 135 },
  { id: "advertise", C: Advertise, d: 225 },
  { id: "end", C: EndCard, d: 165 },
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: TransitionPresentation<any>[] = [
  fade(),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-bottom" }),
  fade(),
];

export const PROMO_DURATION = SCENES.reduce((sum, s) => sum + s.d, 0) - T * (SCENES.length - 1);

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#140b0e" }}>
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const items = [
          <TransitionSeries.Sequence key={s.id} durationInFrames={s.d}>
            <s.C />
          </TransitionSeries.Sequence>,
        ];
        if (i < SCENES.length - 1) {
          items.push(
            <TransitionSeries.Transition
              key={`${s.id}-t`}
              presentation={TRANSITIONS[i]}
              timing={i % 2 ? springTiming({ config: { damping: 200 }, durationInFrames: T }) : linearTiming({ durationInFrames: T })}
            />,
          );
        }
        return items;
      })}
    </TransitionSeries>
    {MUSIC ? (
      <Audio
        src={staticFile(MUSIC)}
        volume={(f) => MUSIC_VOLUME * interpolate(f, [0, 20, PROMO_DURATION - 40, PROMO_DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    ) : null}
    {VOICEOVER ? (
      <Sequence from={Math.round(VOICEOVER_START_SECONDS * FPS)}>
        <Audio src={staticFile(VOICEOVER)} />
      </Sequence>
    ) : null}
  </AbsoluteFill>
);
