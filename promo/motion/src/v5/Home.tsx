/**
 * "ਘਰ ਦੀ ਆਵਾਜ਼ — The Sound of Home": a quiet, respectful brand film.
 * Real moments of Punjabi life in Surrey (ElevenLabs, Kling clips), a warm
 * narrator (eleven_v3) with room to breathe, slow dissolves, a cinematic
 * letterbox, film grain, and gold Gurmukhi lettering with a phulkari motif.
 * No jokes, no caricature: the people on screen are shown with dignity.
 *
 * Pictures only: music, voice and the master are built with ffmpeg in
 * ../../home/build.sh and muxed on top.
 */
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { Record } from "../components/Record";
import { C, FONT } from "../theme";

export const homeSchema = z.object({
  opening: z.object({ pa: z.string(), en: z.string(), len: z.number().int() }),
  shots: z.array(
    z.object({
      file: z.string(),
      len: z.number().int(),
      pa: z.string(),
      en: z.string(),
      /** Where the caption appears inside the shot (frames). */
      captionAt: z.number().int(),
    }),
  ),
  end: z.object({ len: z.number().int(), tagline: z.string(), taglineEn: z.string(), sub: z.string(), url: z.string() }),
  /** Frames the pictures cross-dissolve over. */
  dissolve: z.number().int(),
});
export type HomeProps = z.infer<typeof homeSchema>;

export const defaultHomeProps: HomeProps = {
  // Scene lengths are fitted to the narrator lines (public/home/vo1-6.mp3); the
  // matching voice start times live in ../home/build.sh (VO_AT).
  opening: { pa: "ਸੱਤ ਸਮੁੰਦਰ ਪਾਰ ਵੀ… ਕੁਝ ਆਵਾਜ਼ਾਂ ਘਰ ਵਰਗੀਆਂ ਲੱਗਦੀਆਂ ਨੇ", en: "Even seven seas away, some voices feel like home", len: 195 },
  shots: [
    { file: "home/shot1.jpg", len: 150, pa: "ਸਵੇਰ ਦੀ ਚਾਹ ਨਾਲ ਆਪਣੀ ਬੋਲੀ", en: "Our language, with the morning chai", captionAt: 12 },
    { file: "home/shot2.mp4", len: 135, pa: "ਕੰਮ ਦੇ ਰਾਹ ’ਤੇ ਆਪਣੀਆਂ ਗੱਲਾਂ", en: "Our stories, on the way to work", captionAt: 12 },
    { file: "home/shot3.mp4", len: 135, pa: "ਹਰ ਦੁਕਾਨ, ਹਰ ਰਸੋਈ", en: "In every shop, every kitchen", captionAt: 62 },
    { file: "home/shot4.mp4", len: 150, pa: "ਹਰ ਸ਼ਾਮ — ਆਪਣਾ ਭਾਈਚਾਰਾ", en: "Every evening, our community", captionAt: 8 },
    { file: "home/shot5.mp4", len: 165, pa: "ਦਿਲ ਤਾਂ ਪੰਜਾਬ ’ਚ ਹੀ ਧੜਕਦਾ ਹੈ", en: "The heart still beats in Punjab", captionAt: 15 },
  ],
  end: { len: 180, tagline: "ਘਰ ਦੀ ਆਵਾਜ਼", taglineEn: "THE SOUND OF HOME", sub: "ਸਰੀ ਤੋਂ ਲਾਈਵ · LIVE FROM SURREY", url: "indiradio.ca" },
  dissolve: 18,
};

/** Start frame of each block: opening, shots…, end. Blocks overlap by `dissolve`. */
export const homeStarts = (p: HomeProps) => {
  const lens = [p.opening.len, ...p.shots.map((s) => s.len), p.end.len];
  const starts: number[] = [];
  let t = 0;
  for (const len of lens) {
    starts.push(t);
    t += len - p.dissolve;
  }
  return { starts, lens, total: t + p.dissolve };
};
export const homeDuration = (p: HomeProps) => homeStarts(p).total;

const GOLD = "#e8c27a";
const GOLD_DEEP = "#b8893a";
const BAR = 150; // letterbox bar height

/** Fades a block in and out over the dissolve. */
const Dissolve: React.FC<{ len: number; d: number; first?: boolean; last?: boolean; children: React.ReactNode }> = ({ len, d, first, last, children }) => {
  const f = useCurrentFrame();
  const inO = first ? 1 : interpolate(f, [0, d], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const outO = last ? 1 : interpolate(f, [len - d, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  return <AbsoluteFill style={{ opacity: Math.min(inO, outO) }}>{children}</AbsoluteFill>;
};

/** Phulkari-style ornament: a row of small diamonds that draws outward from the centre. */
const Ornament: React.FC<{ delay: number; width?: number; color?: string }> = ({ delay, width = 420, color = GOLD }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const n = 7;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, height: 28 }}>
      <div style={{ height: 2, width: (width / 2 - 90) * p, background: `linear-gradient(90deg, transparent, ${color})` }} />
      {Array.from({ length: n }).map((_, i) => {
        const dist = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2);
        const s = interpolate(p, [dist * 0.6, dist * 0.6 + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const big = i === (n - 1) / 2;
        return (
          <div
            key={i}
            style={{ width: big ? 16 : 9, height: big ? 16 : 9, background: i % 2 ? C.magenta : color, transform: `rotate(45deg) scale(${s})`, opacity: 0.95 }}
          />
        );
      })}
      <div style={{ height: 2, width: (width / 2 - 90) * p, background: `linear-gradient(270deg, transparent, ${color})` }} />
    </div>
  );
};

/** Gurmukhi line that rises word by word out of a soft blur, with an English whisper under it. */
const Lettering: React.FC<{ pa: string; en: string; delay: number; size?: number; hideAt?: number }> = ({ pa, en, delay, size = 76, hideAt }) => {
  const f = useCurrentFrame();
  const words = pa.split(" ");
  const out = hideAt === undefined ? 1 : interpolate(f, [hideAt, hideAt + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const enO = interpolate(f - delay, [words.length * 5 + 10, words.length * 5 + 28], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: out, textAlign: "center", padding: "0 70px" }}>
      <div style={{ fontFamily: FONT.gurmukhi, fontWeight: 700, fontSize: size, lineHeight: 1.35, color: GOLD, textShadow: "0 4px 30px rgba(0,0,0,0.65)" }}>
        {words.map((w, i) => {
          const t = interpolate(f - delay - i * 5, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return (
            <span key={i} style={{ display: "inline-block", opacity: t, filter: `blur(${(1 - t) * 10}px)`, transform: `translateY(${(1 - t) * 18}px)`, marginRight: "0.28em" }}>
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 10 }}>
        <Ornament delay={delay + 6} />
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT.text,
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: C.cream,
          opacity: enO,
          textShadow: "0 2px 16px rgba(0,0,0,0.7)",
        }}
      >
        {en}
      </div>
    </div>
  );
};

/** Moving film grain + a warm vignette over everything. */
const FilmLook: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  const x = Math.floor(random(`gx${seed}`) * 200);
  const y = Math.floor(random(`gy${seed}`) * 200);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(20,8,4,0.55) 100%)" }} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.35 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed % 97} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect x={-x} y={-y} width="1300" height="2200" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Cinematic bars: open at the start, hold through the story, slide away into the end card. */
const Letterbox: React.FC<{ total: number; d: number }> = ({ total, d }) => {
  const f = useCurrentFrame();
  const h = interpolate(f, [0, 30, total - d, total], [960, BAR, BAR, 0], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000" }} />
    </>
  );
};

/** Small, quiet station mark in the lower bar (not a sticker on people's faces). */
const Mark: React.FC = () => (
  <div style={{ position: "absolute", bottom: 46, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: 0.8 }}>
    <Record size={40} />
    <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 30, letterSpacing: "0.18em", color: C.cream }}>
      INDI <span style={{ color: GOLD }}>RADIO</span>
    </span>
  </div>
);

/** Opening: black, a single gold sound-line breathes like a radio signal, then the first words. */
const Opening: React.FC<{ pa: string; en: string; len: number }> = ({ pa, en, len }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [8, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const pts = Array.from({ length: 121 }, (_, i) => {
    const x = (i / 120) * 1080;
    const env = Math.sin((i / 120) * Math.PI);
    const y = 1060 + Math.sin(i * 0.35 + f * 0.12) * 26 * env * (0.6 + 0.4 * Math.sin(f * 0.05 + i * 0.07));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a1810 0%, #0c0605 70%)" }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0" stopColor={GOLD_DEEP} stopOpacity="0" />
            <stop offset="0.5" stopColor={GOLD} />
            <stop offset="1" stopColor={GOLD_DEEP} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={pts.join(" ")} fill="none" stroke="url(#line)" strokeWidth={4} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)} />
      </svg>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0 }}>
        <Lettering pa={pa} en={en} delay={20} size={84} hideAt={len - 24} />
      </div>
    </AbsoluteFill>
  );
};

/** One moment: the clip (or a still, with a Ken Burns drift) with a slow push-in, warm grade, and its line lettered in the lower third. */
const Moment: React.FC<{ file: string; len: number; pa: string; en: string; captionAt: number }> = ({ file, len, pa, en, captionAt }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, len], [1.02, 1.1]);
  // Kling clips are 5 s; slow them a touch so the longer moments still breathe
  const rate = Math.min(1, 150 / len);
  const grade: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.92) contrast(1.05) sepia(0.12)" };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {/\.(jpe?g|png|webp)$/i.test(file) ? (
          <Img src={staticFile(file)} style={{ ...grade, transform: `translateY(${interpolate(f, [0, len], [10, -20])}px)` }} />
        ) : (
          <OffthreadVideo src={staticFile(file)} muted playbackRate={rate} style={grade} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 52%, rgba(10,5,3,0.75) 88%)" }} />
      <div style={{ position: "absolute", bottom: BAR + 90, left: 0, right: 0 }}>
        <Lettering pa={pa} en={en} delay={captionAt} hideAt={len - 26} />
      </div>
    </AbsoluteFill>
  );
};

/** End card: warm dark, the record glows, name and tagline settle in. */
const EndCard: React.FC<HomeProps["end"]> = ({ tagline, taglineEn, sub, url }) => {
  const f = useCurrentFrame();
  const ease = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glow = 0.5 + 0.5 * Math.sin(f * 0.08);
  const rec = ease(6, 40);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, #3a2212 0%, #140b0e 62%, #0a0506 100%)" }}>
      {/* soft rings, like a signal going out */}
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 30) % 90) / 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 180 - t * 260,
              top: 700 - 180 - t * 260,
              width: 360 + t * 520,
              height: 360 + t * 520,
              borderRadius: "50%",
              border: `2px solid ${GOLD}`,
              opacity: (1 - t) * 0.35 * rec,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 540 - 170,
          top: 700 - 170,
          transform: `scale(${0.85 + 0.15 * rec})`,
          opacity: rec,
          filter: `drop-shadow(0 0 ${30 + glow * 30}px rgba(255,164,27,0.45))`,
        }}
      >
        <Record size={340} />
      </div>
      <div style={{ position: "absolute", top: 960, left: 0, right: 0, textAlign: "center", opacity: ease(22, 50), transform: `translateY(${(1 - ease(22, 50)) * 24}px)` }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 150, letterSpacing: "0.08em", color: C.cream, lineHeight: 1 }}>
          INDI <span style={{ color: GOLD }}>RADIO</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0 }}>
        <Ornament delay={40} width={560} />
      </div>
      <div style={{ position: "absolute", top: 1200, left: 0, right: 0, textAlign: "center", opacity: ease(46, 70) }}>
        <div style={{ fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 104, color: GOLD, lineHeight: 1.3 }}>{tagline}</div>
        <div style={{ fontFamily: FONT.text, fontWeight: 500, fontSize: 32, letterSpacing: "0.3em", color: C.cream, opacity: 0.85 }}>{taglineEn}</div>
      </div>
      <div style={{ position: "absolute", top: 1480, left: 0, right: 0, textAlign: "center", opacity: ease(70, 92) }}>
        <div style={{ fontFamily: FONT.gurmukhi, fontWeight: 700, fontSize: 40, color: C.cream, opacity: 0.8 }}>{sub}</div>
        <div style={{ marginTop: 26, display: "inline-block", border: `2px solid ${GOLD}`, color: GOLD, fontFamily: FONT.display, fontWeight: 800, fontSize: 60, letterSpacing: "0.08em", padding: "10px 44px", borderRadius: 999 }}>
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Home: React.FC<HomeProps> = (p) => {
  const { starts, lens, total } = homeStarts(p);
  const d = p.dissolve;
  const last = lens.length - 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={starts[0]} durationInFrames={lens[0]}>
        <Dissolve len={lens[0]} d={d} first>
          <Opening {...p.opening} />
        </Dissolve>
      </Sequence>
      {p.shots.map((s, i) => (
        <Sequence key={i} from={starts[i + 1]} durationInFrames={lens[i + 1]}>
          <Dissolve len={lens[i + 1]} d={d}>
            <Moment {...s} />
          </Dissolve>
        </Sequence>
      ))}
      <Sequence from={starts[last]} durationInFrames={lens[last]}>
        <Dissolve len={lens[last]} d={d} last>
          <EndCard {...p.end} />
        </Dissolve>
      </Sequence>
      <FilmLook />
      <Sequence from={0} durationInFrames={starts[last] + d}>
        <Letterbox total={starts[last] + d} d={d} />
        <Sequence from={starts[1]}>
          <Mark />
        </Sequence>
      </Sequence>
    </AbsoluteFill>
  );
};
