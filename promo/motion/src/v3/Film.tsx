/**
 * "ਘਰ ਦੀ ਆਵਾਜ਼ — The Sound of Home": a brand film in the spirit of the big
 * drinks ads. No UI, no features: moments from Punjabi life, one signature
 * brand device (the marigold Sound Ribbon), bold words cut on the dhol beat,
 * and a tagline. Every cut lands on the 100 BPM beat grid of bhangra1.mp3.
 */
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { PhulkariBand } from "../components/Background";
import { Record } from "../components/Record";
import { C, FONT } from "../theme";
import { BeatContext, Burst, DrawPath, FlipLetters, LightRays, RadioRings, SlamWord, Typewriter, useBeat } from "../v2/fx";

/* ── Props ─────────────────────────────────────────────────────────────── */

export const filmSchema = z.object({
  moments: z
    .array(
      z.object({
        pa: z.string(),
        en: z.string(),
        /** Optional photo in public/ (e.g. "film/chai.jpg"). Empty → illustrated version. */
        photo: z.string().nullable(),
      }),
    )
    .length(6),
  energy: z.array(z.string()).length(4),
  tagline: z.object({ pa: z.string(), en: z.string() }),
  url: z.string(),
  music: z.string().nullable(),
  voiceTagline: z.string().nullable(),
  voiceEnd: z.string().nullable(),
});
export type FilmProps = z.infer<typeof filmSchema>;

export const defaultFilmProps: FilmProps = {
  moments: [
    { pa: "ਸਵੇਰ ਦੀ ਚਾਹ", en: "MORNING CHAI", photo: null },
    { pa: "ਕੰਮ ਦਾ ਰਾਹ", en: "THE DRIVE", photo: null },
    { pa: "ਰਸੋਈ ਦੀਆਂ ਗੱਲਾਂ", en: "KITCHEN TALK", photo: null },
    { pa: "ਵਿਆਹ ਦਾ ਢੋਲ", en: "WEDDING DHOL", photo: null },
    { pa: "ਦੇਰ ਰਾਤ ਦੀ ਕਾਲ", en: "LATE-NIGHT CALL", photo: null },
    { pa: "ਸੱਤ ਸਮੁੰਦਰ ਪਾਰ", en: "SEVEN SEAS AWAY", photo: null },
  ],
  energy: ["LIVE.", "LOUD.", "PUNJABI.", "ਸਾਡਾ."],
  tagline: { pa: "ਘਰ ਦੀ ਆਵਾਜ਼।", en: "THE SOUND OF HOME." },
  url: "indiradio.ca",
  music: "music/bhangra1.mp3",
  voiceTagline: "film/tagline1.mp3", // "ਘਰ ਦੀ ਆਵਾਜ਼… ਇੰਡੀ ਰੇਡੀਓ!" (ElevenLabs eleven_v3)
  voiceEnd: "voice/line7.mp3", // "ਹੁਣੇ ਵਿਜ਼ਿਟ ਕਰੋ… indiradio.ca!"
};

/* ── Timing: everything on the beat (18 frames, first hit at 8) ──────── */

const BEAT = 18;
const B = (n: number) => Math.round(8 + n * BEAT); // frame of beat n
const OPEN = { from: 0, to: B(3) };
const MOMENT_BEATS = 4;
const momentFrom = (i: number) => B(3 + i * MOMENT_BEATS);
const ENERGY = { from: B(27), to: B(35) };
const PAYOFF = { from: B(35), to: B(45) };
const END = { from: B(45), to: B(53) };
export const FILM_DURATION = END.to;

/* ── Signature device: the Sound Ribbon ────────────────────────────────── */

/** A thick marigold ribbon shaped like a sound wave, drawn across the frame. */
const SoundRibbon: React.FC<{ y: number; from: number; to: number; amp?: number; tilt?: number; opacity?: number; color?: string }> = ({
  y,
  from,
  to,
  amp = 70,
  tilt = -6,
  opacity = 1,
  color = C.marigold,
}) => {
  const frame = useCurrentFrame();
  const { pulse } = useBeat(6);
  const phase = frame * 0.12;
  const a = amp * (1 + pulse * 0.35);
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = -100 + (i / 59) * 1280;
    const yy = y + Math.sin(i * 0.32 + phase) * a * (0.55 + 0.45 * Math.sin(i * 0.09));
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${yy.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `rotate(${tilt}deg)`, opacity }}>
      <DrawPath d={pts} from={from} to={to} stroke={color} width={58} />
      <DrawPath d={pts} from={from + 3} to={to + 3} stroke={C.magenta} width={14} />
      <DrawPath d={pts} from={from + 5} to={to + 5} stroke={C.cream} width={4} />
    </svg>
  );
};

/* ── Illustrations used until real photos are added ────────────────────── */

const ICONS: string[] = [
  // chai cup with steam
  "M330 820 H750 V1000 Q750 1150 540 1150 Q330 1150 330 1000 Z M750 870 Q860 870 860 950 Q860 1030 750 1030 M430 760 Q400 700 440 650 Q480 600 450 540 M540 760 Q510 690 550 640 Q590 590 560 520 M650 760 Q620 700 660 650 Q700 600 670 540 M280 1200 H800",
  // steering wheel + road
  "M540 700 m-260 0 a260 260 0 1 0 520 0 a260 260 0 1 0 -520 0 M540 700 m-70 0 a70 70 0 1 0 140 0 a70 70 0 1 0 -140 0 M280 700 H470 M610 700 H800 M540 770 V960 M300 1300 L460 1000 M780 1300 L620 1000 M540 1060 V1110 M540 1170 V1240",
  // kitchen: tawa, rolling pin, rotis
  "M300 900 H780 M540 900 m-240 0 a240 90 0 1 0 480 0 M780 900 H940 M320 1150 L760 1060 M300 1160 L260 1170 M780 1056 L820 1048 M420 700 m-80 0 a80 30 0 1 0 160 0 a80 30 0 1 0 -160 0 M660 680 m-80 0 a80 30 0 1 0 160 0 a80 30 0 1 0 -160 0",
  // dhol
  "M330 720 Q540 640 750 720 V1080 Q540 1160 330 1080 Z M330 720 Q540 800 750 720 M330 1080 Q540 1000 750 1080 M380 740 L700 1060 M700 740 L380 1060 M270 620 L400 700 M810 620 L680 700",
  // phone call, late night
  "M420 620 H660 Q700 620 700 660 V1180 Q700 1220 660 1220 H420 Q380 1220 380 1180 V660 Q380 620 420 620 Z M500 660 H580 M540 1160 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 M760 700 Q820 760 760 820 M800 660 Q900 760 800 860 M320 700 Q260 760 320 820 M280 660 Q180 760 280 860",
  // plane over the ocean
  "M200 760 L880 620 L760 700 L900 760 L760 780 L600 900 L560 880 L620 780 L420 800 L380 860 L340 850 L360 790 Z M160 1150 Q270 1100 380 1150 T600 1150 T820 1150 T1040 1150 M100 1250 Q210 1200 320 1250 T540 1250 T760 1250 T980 1250",
];
const TINTS = [C.marigold, C.red, C.ink, C.magenta, "#1d1030", C.red];
const INKS = [C.ink, C.cream, C.marigold, C.ink, C.marigold, C.cream];

const MomentBackdrop: React.FC<{ i: number; photo: string | null }> = ({ i, photo }) => {
  const frame = useCurrentFrame();
  const kb = interpolate(frame, [0, BEAT * MOMENT_BEATS], [1.08, 1.2]);
  const pan = interpolate(frame, [0, BEAT * MOMENT_BEATS], [i % 2 ? -30 : 30, i % 2 ? 30 : -30]);
  if (photo) {
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.ink }}>
        <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb}) translateX(${pan}px)` }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,11,14,0.1) 30%, rgba(20,11,14,0.85) 100%)" }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: TINTS[i], overflow: "hidden" }}>
      <LightRays size={2200} color={i === 0 ? C.cream : C.marigold} opacity={0.14} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `translateY(-190px) scale(${kb * 0.82}) translateX(${pan * 0.5}px)`, transformOrigin: "50% 45%" }}>
        <DrawPath d={ICONS[i]} from={0} to={34} stroke={INKS[i]} width={22} />
      </svg>
    </AbsoluteFill>
  );
};

/* ── Scenes ────────────────────────────────────────────────────────────── */

/** Beat-cut entry: a quick whip from the side with motion blur and a flash. */
const Whip: React.FC<{ children: React.ReactNode; dir?: 1 | -1 }> = ({ children, dir = 1 }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 6], [dir * 1080, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const blur = interpolate(frame, [0, 6], [24, 0], { extrapolateRight: "clamp" });
  const flash = interpolate(frame, [0, 2, 6], [0.9, 0.5, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: C.cream, opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07030a" }}>
      <SoundRibbon y={960} from={6} to={40} amp={90} tilt={0} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            marginTop: 380,
            fontFamily: FONT.text,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "0.5em",
            color: C.cream,
            opacity: interpolate(frame, [16, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          EVERY DAY. EVERYWHERE.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Moment: React.FC<{ i: number; m: FilmProps["moments"][number] }> = ({ i, m }) => {
  const frame = useCurrentFrame();
  const light = !m.photo && (TINTS[i] === C.marigold || TINTS[i] === C.magenta);
  const txt = light ? C.ink : C.cream;
  return (
    <Whip dir={i % 2 ? -1 : 1}>
      <MomentBackdrop i={i} photo={m.photo} />
      <SoundRibbon y={1660} from={2} to={26} amp={45} tilt={i % 2 ? 3 : -3} opacity={0.95} color={!m.photo && TINTS[i] === C.marigold ? C.red : C.marigold} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 1190 }}>
        <SlamWord text={m.pa} delay={3} size={m.pa.length > 12 ? 118 : 138} color={txt} />
        <div
          style={{
            marginTop: 6,
            fontFamily: FONT.display,
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: "0.08em",
            color: light ? "rgba(20,11,14,0.75)" : C.marigold,
            opacity: interpolate(frame, [10, 16], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {m.en}
        </div>
      </div>
      <div style={{ position: "absolute", top: 90, right: 80, fontFamily: FONT.display, fontWeight: 900, fontSize: 44, color: txt, opacity: 0.8 }}>
        0{i + 1} / 06
      </div>
    </Whip>
  );
};

/** Red Bull-style word stack: one huge word per two beats, colour flips each time. */
const Energy: React.FC<{ words: string[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const per = BEAT * 2;
  const i = Math.min(words.length - 1, Math.floor(frame / per));
  const local = frame - i * per;
  const bgs = [C.red, C.marigold, C.ink, C.magenta];
  const fgs = [C.cream, C.ink, C.marigold, C.ink];
  const s = interpolate(local, [0, 5], [1.6, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  const isPa = /[਀-੿]/.test(words[i]);
  return (
    <AbsoluteFill style={{ backgroundColor: bgs[i % 4], justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <RadioRings x={540} y={960} max={1800} color={fgs[i % 4]} count={4} />
      <div
        style={{
          fontFamily: isPa ? FONT.gurmukhi : FONT.display,
          fontWeight: 900,
          fontSize: isPa ? 300 : 250,
          lineHeight: 1,
          color: fgs[i % 4],
          transform: `scale(${s}) rotate(${(i % 2 ? 1 : -1) * 4}deg)`,
          letterSpacing: "-0.01em",
        }}
      >
        {words[i]}
      </div>
      <PhulkariBand bottom={180} />
    </AbsoluteFill>
  );
};

/** The ribbon winds into the record; tagline lands with the voice. */
const Payoff: React.FC<{ tagline: FilmProps["tagline"] }> = ({ tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rec = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } });
  // Spiral ribbon collapsing into the record
  const spiral = Array.from({ length: 140 }, (_, k) => {
    const t = k / 139;
    const r = 700 * (1 - t) + 40;
    const a = t * Math.PI * 7;
    return `${k === 0 ? "M" : "L"}${(540 + Math.cos(a) * r).toFixed(1)} ${(820 + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <LightRays size={2400} opacity={0.22} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [30, 44], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <DrawPath d={spiral} from={0} to={30} stroke={C.marigold} width={44} />
        <DrawPath d={spiral} from={3} to={33} stroke={C.magenta} width={10} />
      </svg>
      <div style={{ position: "absolute", left: 540 - 300, top: 820 - 300, transform: `scale(${rec})` }}>
        <Record size={600} />
      </div>
      <RadioRings x={540} y={820} max={1500} />
      <div style={{ position: "absolute", top: 1240, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ display: "inline-block" }}>
          <SlamWord text={tagline.pa} delay={36} size={150} color={C.marigold} />
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT.display,
            fontWeight: 900,
            fontSize: 84,
            letterSpacing: "0.06em",
            color: C.cream,
            opacity: interpolate(frame, [52, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {tagline.en}
        </div>
      </div>
      <Burst x={540} y={820} at={22} seed="payoff" count={46} spread={900} />
    </AbsoluteFill>
  );
};

const EndLockup: React.FC<{ url: string }> = ({ url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeat();
  return (
    <AbsoluteFill style={{ backgroundColor: C.red, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <SoundRibbon y={1560} from={0} to={24} amp={45} tilt={-4} color={C.marigold} />
      <div style={{ transform: `scale(${spring({ frame, fps, config: { damping: 12 } }) * (1 + pulse * 0.04)})` }}>
        <Record size={300} />
      </div>
      <div style={{ marginTop: 50 }}>
        <FlipLetters text="INDI RADIO" delay={4} size={180} colors={(i) => (i >= 5 ? C.marigold : C.cream)} />
      </div>
      <Typewriter text={url} start={20} cps={14} style={{ marginTop: 30, fontFamily: FONT.display, fontWeight: 900, fontSize: 110, color: C.ink }} />
      <PhulkariBand top={0} />
    </AbsoluteFill>
  );
};

/* ── Film ──────────────────────────────────────────────────────────────── */

export const Film: React.FC<FilmProps> = (p) => {
  const beat = (sceneStart: number) => ({ period: BEAT, offset: 8, sceneStart });
  const scene = (from: number, to: number, node: React.ReactNode) => (
    <Sequence from={from} durationInFrames={to - from}>
      <BeatContext.Provider value={beat(from)}>{node}</BeatContext.Provider>
    </Sequence>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#07030a" }}>
      {scene(OPEN.from, OPEN.to, <ColdOpen />)}
      {p.moments.map((m, i) => (
        <Sequence key={i} from={momentFrom(i)} durationInFrames={BEAT * MOMENT_BEATS}>
          <BeatContext.Provider value={beat(momentFrom(i))}>
            <Moment i={i} m={m} />
          </BeatContext.Provider>
        </Sequence>
      ))}
      {scene(ENERGY.from, ENERGY.to, <Energy words={p.energy} />)}
      {scene(PAYOFF.from, PAYOFF.to, <Payoff tagline={p.tagline} />)}
      {scene(END.from, END.to, <EndLockup url={p.url} />)}
      {p.music ? (
        <Audio
          src={staticFile(p.music)}
          volume={(f) =>
            interpolate(f, [0, 6, PAYOFF.from + 20, PAYOFF.from + 34, PAYOFF.to, END.from + 6, FILM_DURATION - 24, FILM_DURATION], [0, 0.9, 0.9, 0.35, 0.35, 0.8, 0.8, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      {p.voiceTagline ? (
        <Sequence from={PAYOFF.from + 34}>
          <Audio src={staticFile(p.voiceTagline)} />
        </Sequence>
      ) : null}
      {p.voiceEnd ? (
        <Sequence from={END.from + 14}>
          <Audio src={staticFile(p.voiceEnd)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
