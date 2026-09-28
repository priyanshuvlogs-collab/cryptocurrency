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
import { BeatContext } from "./v2/fx";

export const T = 16; // transition length in frames

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: TransitionPresentation<any>[] = [
  fade(),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-bottom" }),
  fade(),
];

/** Total length of a list of scene durations, minus the transition overlaps. */
export const totalFrames = (durations: number[]) => durations.reduce((a, b) => a + b, 0) - T * (durations.length - 1);

/** Frame where each scene starts (transitions overlap neighbouring scenes). */
export const startsOf = (durations: number[]) => durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0) - T * i);

/** Burned-in subtitle for muted autoplay: one line per scene, faded in and out. */
const Subtitles: React.FC<{ lines: string[]; durations: number[] }> = ({ lines, durations }) => {
  const frame = useCurrentFrame();
  const STARTS = startsOf(durations);
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

/** Where each voice line plays: after its scene's incoming transition. */
export const voiceLinePlacements = (props: PromoProps) => {
  const starts = startsOf(props.resolvedSceneFrames);
  return props.audio.voiceLines.map((file, i) => ({
    file,
    from: starts[i] + (i === 0 ? 0 : T) + props.audio.voiceLeadFrames,
    frames: Math.ceil(props.voiceLineSeconds[i] * FPS),
  }));
};

/**
 * Shared timeline for both promo versions: scenes with transitions, the beat
 * grid, burned-in subtitles, voice lines and ducked music.
 */
export const Timeline: React.FC<{
  props: PromoProps;
  scenes: React.ReactNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transitions: TransitionPresentation<any>[];
}> = ({ props, scenes, transitions }) => {
  const { audio, subtitles } = props;
  const durations = props.resolvedSceneFrames;
  const total = totalFrames(durations);
  const starts = startsOf(durations);
  const lines = voiceLinePlacements(props);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <TransitionSeries>
        {scenes.flatMap((scene, i) => {
          const items = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={durations[i]}>
              <BeatContext.Provider value={{ period: props.beatPeriodFrames, offset: props.beatOffsetFrames, sceneStart: starts[i] }}>{scene}</BeatContext.Provider>
            </TransitionSeries.Sequence>,
          ];
          if (i < scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                presentation={transitions[i]}
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
          volume={(f) => {
            // Duck the music while any line is spoken, lift it in the gaps, fade at the end.
            const duck = Math.max(
              0,
              ...lines.map((l) =>
                l.file ? interpolate(f, [l.from - 8, l.from, l.from + l.frames, l.from + l.frames + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0,
              ),
            );
            const level = audio.musicVolumeNoVoice + (audio.musicVolume - audio.musicVolumeNoVoice) * duck;
            return level * interpolate(f, [0, 10, total - 30, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          }}
        />
      ) : null}
      {lines.map((l, i) =>
        l.file ? (
          <Sequence key={`v${i}`} from={l.from}>
            <Audio src={staticFile(l.file)} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
};

export const Promo: React.FC<PromoProps> = (props) => (
  <Timeline
    props={props}
    transitions={TRANSITIONS}
    scenes={[
      <Hook key="hook" p={props.hook} />,
      <LogoReveal key="logo" p={props.logo} />,
      <HomeShowcase key="home" p={props.home} />,
      <ListenLive key="listen" p={props.listen} tapAt={props.listenTapFrame} />,
      <WorldClocks key="clocks" p={props.clocks} />,
      <Advertise key="advertise" p={props.advertise} />,
      <EndCard key="end" p={props.end} />,
    ]}
  />
);
