/**
 * Ten short films (5 Hindi, 5 Punjabi) from one component. Each film is a few
 * narrator lines ("beats"), each over a visual, then an end card. Five looks
 * keep them from feeling like copies:
 *
 *   cinema  – full-bleed footage, letterbox, grain, gold lettering
 *   frame   – footage in a tilted card on marigold, bold ink type
 *   dial    – footage through a round window, a radio dial tunes in below
 *   split   – two pictures stacked with a marigold band of words between
 *   kinetic – footage up top, big words slamming in on red
 *
 * Voice and music play inside Remotion; ../../shorts/build.sh renders all ten
 * and masters the loudness. Beat lengths are fitted to the voice lines by
 * calculateMetadata (see Root.tsx), so a re-recorded line just works.
 */
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { PhulkariBand } from "../components/Background";
import { Phone } from "../components/Phone";
import { Record as Disc, Equalizer } from "../components/Record";
import { C, FONT } from "../theme";

export const STYLES = ["cinema", "frame", "dial", "split", "kinetic"] as const;
export type Style = (typeof STYLES)[number];

export const shortSchema = z.object({
  lang: z.enum(["hi", "pa"]),
  style: z.enum(STYLES),
  /** Small title shown on top through the story beats. */
  hook: z.string(),
  beats: z.array(
    z.object({
      /** public/ path: .mp4 clip, .jpg still, or shots/*.jpg (website screenshot, shown in a phone). */
      visual: z.string(),
      /** Second picture for the split look. */
      visual2: z.string().nullable(),
      /** Seconds into the clip to start (to reuse a clip without repeating the same moment). */
      trim: z.number().min(0),
      text: z.string(),
      sub: z.string(),
      voice: z.string(),
    }),
  ),
  end: z.object({ tagline: z.string(), sub: z.string(), voice: z.string(), url: z.string() }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  /** Filled in by calculateMetadata from the voice files. */
  voiceSeconds: z.array(z.number()),
});
export type ShortProps = z.infer<typeof shortSchema>;

const FPS = 30;
const LEAD = 0.35; // silence before each line
const GAP = 0.75; // breathing room after each line
const TAIL = 2.2; // end card holds after the last line

/** Frame start and length of every beat; the end card is the last entry. */
export const shortLayout = (p: ShortProps) => {
  const n = p.beats.length + 1;
  const lens = Array.from({ length: n }, (_, i) => Math.round((LEAD + (p.voiceSeconds[i] ?? 3) + GAP + (i === n - 1 ? TAIL : 0)) * FPS));
  const starts: number[] = [];
  let t = 0;
  for (const l of lens) {
    starts.push(t);
    t += l;
  }
  return { starts, lens, total: t };
};

const GOLD = "#e8c27a";
const scriptFont = (lang: ShortProps["lang"]) => (lang === "hi" ? FONT.devanagari : FONT.gurmukhi);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

/* ── Media ─────────────────────────────────────────────────────────────── */

const SHOT_HEIGHT: Record<string, number> = { "shots/home-pa.jpg": 6200, "shots/listen-pa.jpg": 1688, "shots/packages-en.jpg": 3400, "shots/pricing-pa.jpg": 2700 };

/** A clip, a still (slow Ken Burns) or a website screenshot in a phone, filling its box. */
const Media: React.FC<{ file: string; len: number; trim?: number; grade?: boolean; phoneWidth?: number }> = ({ file, len, trim = 0, grade = true, phoneWidth = 520 }) => {
  const f = useCurrentFrame();
  if (file.startsWith("shots/")) {
    const h = SHOT_HEIGHT[file] ?? 2000;
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 40%, #3a2212, #140b0e 70%)" }}>
        <div style={{ transform: `translateY(${(1 - ease(f, 0, 20)) * 80}px)` }}>
          <Phone src={file} width={phoneWidth} shotHeight={h} scroll={[15, len - 10, 0, Math.min(1400, h * 0.5)]} />
        </div>
      </AbsoluteFill>
    );
  }
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: grade ? "saturate(0.95) contrast(1.05) sepia(0.08)" : undefined,
    transform: `scale(${interpolate(f, [0, len], [1.03, 1.12])})`,
  };
  return /\.(jpe?g|png|webp)$/i.test(file) ? (
    <Img src={staticFile(file)} style={style} />
  ) : (
    <OffthreadVideo src={staticFile(file)} muted trimBefore={Math.round(trim * FPS)} playbackRate={Math.min(1, (150 - trim * FPS) / len)} style={style} />
  );
};

/** Words rise out of a blur one after another. */
const Words: React.FC<{ text: string; delay: number; font: string; size: number; color: string; weight?: number; stagger?: number; shadow?: string; align?: "center" | "left" }> = ({
  text,
  delay,
  font,
  size,
  color,
  weight = 800,
  stagger = 4,
  shadow,
  align = "center",
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.32, color, textAlign: align, textShadow: shadow }}>
      {text.split(" ").map((w, i) => {
        const t = ease(f - delay - i * stagger, 0, 16);
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: t, filter: `blur(${(1 - t) * 8}px)`, transform: `translateY(${(1 - t) * 20}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Sub: React.FC<{ text: string; delay: number; color: string }> = ({ text, delay, color }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: FONT.text, fontWeight: 700, fontSize: 28, letterSpacing: "0.18em", textTransform: "uppercase", color, opacity: 0.85 * ease(f, delay, delay + 16), marginTop: 14 }}>
      {text}
    </div>
  );
};

/** Row of phulkari diamonds drawing out from the centre. */
const Diamonds: React.FC<{ delay: number; color?: string; accent?: string }> = ({ delay, color = GOLD, accent = C.magenta }) => {
  const f = useCurrentFrame();
  const p = ease(f, delay, delay + 22);
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, height: 24, margin: "10px 0" }}>
      <div style={{ height: 2, width: 140 * p, background: `linear-gradient(90deg, transparent, ${color})` }} />
      {[0, 1, 2, 3, 4].map((i) => {
        const s = interpolate(p, [Math.abs(i - 2) * 0.2, Math.abs(i - 2) * 0.2 + 0.4], [0, 1], clamp);
        return <div key={i} style={{ width: i === 2 ? 14 : 8, height: i === 2 ? 14 : 8, background: i % 2 ? accent : color, transform: `rotate(45deg) scale(${s})` }} />;
      })}
      <div style={{ height: 2, width: 140 * p, background: `linear-gradient(270deg, transparent, ${color})` }} />
    </div>
  );
};

const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.3 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity, pointerEvents: "none" }}>
      <filter id={`g${seed % 97}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed % 97} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect x={-Math.floor(random(`x${seed}`) * 150)} y={-Math.floor(random(`y${seed}`) * 150)} width="1300" height="2200" filter={`url(#g${seed % 97})`} />
    </svg>
  );
};

/* ── Beats, one per look ───────────────────────────────────────────────── */

type BeatProps = { beat: ShortProps["beats"][number]; len: number; lang: ShortProps["lang"]; hook: string; index: number };

const CinemaBeat: React.FC<BeatProps> = ({ beat, len, lang }) => {
  const f = useCurrentFrame();
  const fade = Math.min(ease(f, 0, 14), interpolate(f, [len - 10, len], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Media file={beat.visual} len={len} trim={beat.trim} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 45%, rgba(10,5,3,0.85) 90%)" }} />
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 260, textAlign: "center" }}>
          <Words text={beat.text} delay={8} font={scriptFont(lang)} size={72} color={GOLD} weight={700} shadow="0 4px 24px rgba(0,0,0,0.7)" />
          <Diamonds delay={14} />
          <Sub text={beat.sub} delay={24} color={C.cream} />
        </div>
      </AbsoluteFill>
      <Grain />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 150, background: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 150, background: "#000" }} />
    </AbsoluteFill>
  );
};

const FrameBeat: React.FC<BeatProps> = ({ beat, len, lang, hook, index }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 16, stiffness: 120 } });
  const tilt = (index % 2 ? 1 : -1) * 2.5;
  return (
    <AbsoluteFill style={{ backgroundColor: C.marigold }}>
      <PhulkariBand top={0} />
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.ink, color: C.marigold, fontFamily: scriptFont(lang), fontWeight: 800, fontSize: 44, padding: "8px 34px 2px", borderRadius: 999 }}>{hook}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 240,
          width: 900,
          height: 1060,
          borderRadius: 36,
          overflow: "hidden",
          boxShadow: `18px 18px 0 ${C.ink}, 0 40px 80px rgba(20,11,14,0.35)`,
          transform: `translateY(${(1 - s) * 900}px) rotate(${tilt * s}deg)`,
          background: C.ink,
        }}
      >
        <Media file={beat.visual} len={len} trim={beat.trim} phoneWidth={420} />
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1390, textAlign: "center" }}>
        <Words text={beat.text} delay={10} font={scriptFont(lang)} size={70} color={C.ink} />
        <Sub text={beat.sub} delay={26} color={C.ink} />
      </div>
      <PhulkariBand bottom={0} />
    </AbsoluteFill>
  );
};

/** Radio dial scale that sweeps and settles, with the needle glowing. */
const Dial: React.FC<{ index: number }> = ({ index }) => {
  const f = useCurrentFrame();
  const settle = ease(f, 0, 26);
  const from = 88 + ((index * 7) % 20);
  const to = 88 + ((index * 7 + 11) % 20);
  const mhz = from + (to - from) * settle;
  const x = (m: number) => 540 + (m - mhz) * 60;
  const ticks = [];
  for (let m = 80; m <= 116; m += 0.5) ticks.push(m);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1600, height: 170, overflow: "hidden" }}>
      <svg width="1080" height="170">
        {ticks.map((m) => {
          const big = Math.abs(m - Math.round(m)) < 0.01 && Math.round(m) % 2 === 0;
          return <line key={m} x1={x(m)} x2={x(m)} y1={big ? 30 : 50} y2={90} stroke={C.cream} strokeOpacity={big ? 0.8 : 0.35} strokeWidth={big ? 3 : 2} />;
        })}
        {ticks
          .filter((m) => Math.abs(m - Math.round(m)) < 0.01 && Math.round(m) % 4 === 0)
          .map((m) => (
            <text key={`t${m}`} x={x(m)} y={130} fill={C.cream} fillOpacity={0.7} fontSize={30} fontFamily={FONT.display} fontWeight={800} textAnchor="middle">
              {m}
            </text>
          ))}
        <line x1={540} x2={540} y1={10} y2={110} stroke={C.red} strokeWidth={6} />
        <circle cx={540} cy={10} r={9} fill={C.red} />
      </svg>
    </div>
  );
};

const DialBeat: React.FC<BeatProps> = ({ beat, len, lang, hook, index }) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, 22], [0, 430], { ...clamp, easing: Easing.out(Easing.exp) });
  const spin = f * 0.4;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, #3a1d14 0%, #140b0e 65%)" }}>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily: scriptFont(lang), fontWeight: 800, fontSize: 46, color: C.marigold, letterSpacing: "0.02em" }}>
        <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: C.red, marginRight: 14, verticalAlign: "middle", opacity: 0.5 + 0.5 * Math.sin(f * 0.25) }} />
        {hook}
      </div>
      {/* tick ring */}
      <svg width="1080" height="1080" style={{ position: "absolute", top: 230, left: 0, transform: `rotate(${spin}deg)` }}>
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i / 72) * Math.PI * 2;
          const r1 = 470;
          const r2 = i % 6 === 0 ? 510 : 490;
          return <line key={i} x1={540 + Math.cos(a) * r1} y1={540 + Math.sin(a) * r1} x2={540 + Math.cos(a) * r2} y2={540 + Math.sin(a) * r2} stroke={i % 6 === 0 ? C.marigold : C.cream} strokeOpacity={i % 6 === 0 ? 0.9 : 0.3} strokeWidth={3} />;
        })}
      </svg>
      <div style={{ position: "absolute", top: 230, left: 0, width: 1080, height: 1080, clipPath: `circle(${r}px at 540px 540px)` }}>
        <Media file={beat.visual} len={len} trim={beat.trim} phoneWidth={440} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1335, textAlign: "center" }}>
        <Words text={beat.text} delay={12} font={scriptFont(lang)} size={64} color={C.cream} />
        <Sub text={beat.sub} delay={26} color={C.marigold} />
      </div>
      <Dial index={index} />
    </AbsoluteFill>
  );
};

const SplitBeat: React.FC<BeatProps> = ({ beat, len, lang }) => {
  const f = useCurrentFrame();
  const top = ease(f, 0, 18);
  const bottom = ease(f, 6, 24);
  const band = ease(f, 10, 26);
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 760, overflow: "hidden", clipPath: `inset(0 ${(1 - top) * 100}% 0 0)` }}>
        <Media file={beat.visual} len={len} trim={beat.trim} phoneWidth={330} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 760, overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - bottom) * 100}%)` }}>
        <Media file={beat.visual2 ?? beat.visual} len={len} phoneWidth={330} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 0,
          right: 0,
          height: 400,
          background: C.marigold,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
          transform: `scaleY(${band})`,
          boxShadow: "0 0 60px rgba(20,11,14,0.35)",
        }}
      >
        <Words text={beat.text} delay={16} font={scriptFont(lang)} size={62} color={C.ink} />
        <Sub text={beat.sub} delay={30} color={C.ink} />
      </div>
    </AbsoluteFill>
  );
};

const KineticBeat: React.FC<BeatProps> = ({ beat, len, lang, hook }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = interpolate(f, [0, 5], [0.8, 0], clamp);
  const words = beat.text.split(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: C.red }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1080, overflow: "hidden", clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)" }}>
        <Media file={beat.visual} len={len} trim={beat.trim} phoneWidth={420} />
      </div>
      <div style={{ position: "absolute", top: 70, left: 50, background: C.ink, color: C.cream, fontFamily: scriptFont(lang), fontWeight: 800, fontSize: 40, padding: "8px 26px 2px", borderRadius: 14 }}>{hook}</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1150, fontFamily: scriptFont(lang), fontWeight: 800, fontSize: 84, lineHeight: 1.25, color: C.cream }}>
        {words.map((w, i) => {
          const s = spring({ frame: f - 6 - i * 4, fps, config: { damping: 12, stiffness: 200 } });
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.24em", transform: `scale(${0.4 + 0.6 * s}) translateY(${(1 - s) * 40}px)`, opacity: s, color: i === words.length - 1 ? C.marigold : C.cream }}>
              {w}
            </span>
          );
        })}
        <Sub text={beat.sub} delay={24} color={C.cream} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 110, display: "flex", alignItems: "flex-end", gap: 22, opacity: 0.9 }}>
        <Disc size={96} />
        <Equalizer bars={22} height={80} color={C.marigold} width={14} />
        <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 44, color: C.cream, letterSpacing: "0.06em", marginLeft: "auto" }}>● LIVE</span>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const BEATS: Record<Style, React.FC<BeatProps>> = { cinema: CinemaBeat, frame: FrameBeat, dial: DialBeat, split: SplitBeat, kinetic: KineticBeat };

/* ── End card ──────────────────────────────────────────────────────────── */

const END_THEME: Record<Style, { bg: string; fg: string; accent: string; ring: string }> = {
  cinema: { bg: "radial-gradient(ellipse at 50% 42%, #3a2212 0%, #140b0e 62%, #0a0506 100%)", fg: C.cream, accent: GOLD, ring: GOLD },
  frame: { bg: C.marigold, fg: C.ink, accent: C.red, ring: C.ink },
  dial: { bg: "radial-gradient(circle at 50% 38%, #3a1d14 0%, #140b0e 65%)", fg: C.cream, accent: C.marigold, ring: C.marigold },
  split: { bg: C.cream, fg: C.ink, accent: C.red, ring: C.marigold },
  kinetic: { bg: C.red, fg: C.cream, accent: C.marigold, ring: C.cream },
};

const EndCard: React.FC<{ style: Style; lang: ShortProps["lang"]; end: ShortProps["end"] }> = ({ style, lang, end }) => {
  const f = useCurrentFrame();
  const t = END_THEME[style];
  const rec = ease(f, 0, 30);
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      {[0, 1, 2].map((i) => {
        const k = ((f + i * 30) % 90) / 90;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: 540 - 170 - k * 260, top: 640 - 170 - k * 260, width: 340 + k * 520, height: 340 + k * 520, borderRadius: "50%", border: `3px solid ${t.ring}`, opacity: (1 - k) * 0.4 * rec }}
          />
        );
      })}
      <div style={{ position: "absolute", left: 540 - 160, top: 640 - 160, transform: `scale(${0.8 + 0.2 * rec})`, opacity: rec }}>
        <Disc size={320} />
      </div>
      <div style={{ position: "absolute", top: 880, left: 0, right: 0, textAlign: "center", opacity: ease(f, 10, 30), transform: `translateY(${(1 - ease(f, 10, 30)) * 30}px)` }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 150, letterSpacing: "0.06em", color: t.fg, lineHeight: 1 }}>
          INDI <span style={{ color: t.accent }}>RADIO</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1060, left: 0, right: 0 }}>
        <Diamonds delay={24} color={t.accent} accent={style === "cinema" || style === "dial" ? C.magenta : C.ink} />
      </div>
      <div style={{ position: "absolute", top: 1110, left: 60, right: 60, textAlign: "center" }}>
        <Words text={end.tagline} delay={30} font={scriptFont(lang)} size={88} color={t.accent} stagger={5} />
        <div style={{ fontFamily: scriptFont(lang), fontWeight: 700, fontSize: 40, color: t.fg, opacity: 0.85 * ease(f, 50, 70), marginTop: 10 }}>{end.sub}</div>
      </div>
      <div style={{ position: "absolute", top: 1500, left: 0, right: 0, textAlign: "center", opacity: ease(f, 60, 80) }}>
        <div style={{ display: "inline-block", border: `3px solid ${t.accent}`, color: t.accent, fontFamily: FONT.display, fontWeight: 800, fontSize: 64, letterSpacing: "0.06em", padding: "10px 46px", borderRadius: 999 }}>
          {end.url}
        </div>
      </div>
      {style === "frame" || style === "split" ? <PhulkariBand bottom={0} /> : null}
    </AbsoluteFill>
  );
};

/* ── Film ──────────────────────────────────────────────────────────────── */

export const Short: React.FC<ShortProps> = (p) => {
  const { starts, lens, total } = shortLayout(p);
  const Beat = BEATS[p.style];
  const lead = Math.round(LEAD * FPS);
  const voiceFrames = p.beats.map((_, i) => [starts[i] + lead, starts[i] + lead + Math.round((p.voiceSeconds[i] ?? 3) * FPS)]);
  voiceFrames.push([starts[p.beats.length] + lead, starts[p.beats.length] + lead + Math.round((p.voiceSeconds[p.beats.length] ?? 3) * FPS)]);
  // Music sits under the voice: lowered while a line plays, full in between, fades at both ends.
  const musicVolume = (f: number) => {
    const talking = voiceFrames.some(([a, b]) => f >= a - 6 && f <= b + 6);
    const fadeIn = interpolate(f, [0, 20], [0, 1], clamp);
    const fadeOut = interpolate(f, [total - 45, total], [1, 0], clamp);
    return p.musicVolume * (talking ? 0.4 : 1) * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {p.beats.map((b, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={lens[i]}>
          <Beat beat={b} len={lens[i]} lang={p.lang} hook={p.hook} index={i} />
          <Sequence from={lead}>
            <Audio src={staticFile(b.voice)} />
          </Sequence>
        </Sequence>
      ))}
      <Sequence from={starts[p.beats.length]} durationInFrames={lens[p.beats.length]}>
        <EndCard style={p.style} lang={p.lang} end={p.end} />
        <Sequence from={lead}>
          <Audio src={staticFile(p.end.voice)} />
        </Sequence>
      </Sequence>
      <Audio src={staticFile(p.music)} volume={musicVolume} loop />
    </AbsoluteFill>
  );
};
