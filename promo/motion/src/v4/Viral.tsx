/**
 * Viral short: "POV: ਮੰਮੀ ਨੇ ਰੇਡੀਓ ’ਤੇ ਆਪਣਾ ਗੀਤ ਸੁਣ ਲਿਆ".
 * Four AI clips (ElevenLabs, Kling) cut on the dhol beat, meme-style captions,
 * beat punches and a brand end card that loops straight back into the hook.
 * Pictures only: the audio mix (music, SFX, voice) is built with ffmpeg in
 * ../../viral/build.sh and muxed on top.
 */
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { PhulkariBand } from "../components/Background";
import { Record } from "../components/Record";
import { C, FONT } from "../theme";
import { BeatContext, Burst, FlipLetters, LightRays, RadioRings, useBeat } from "../v2/fx";

export const viralSchema = z.object({
  hook: z.string(),
  shots: z.array(z.object({ file: z.string(), caption: z.string(), trimStart: z.number().min(0) })).length(4),
  endLine: z.string(),
  tagline: z.string(),
  url: z.string(),
  beatPeriodFrames: z.number(),
  beatOffsetFrames: z.number(),
});
export type ViralProps = z.infer<typeof viralSchema>;

export const defaultViralProps: ViralProps = {
  hook: "POV: ਮੰਮੀ ਨੇ ਰੇਡੀਓ ’ਤੇ ਆਪਣਾ ਗੀਤ ਸੁਣ ਲਿਆ",
  shots: [
    { file: "viral/shot1.mp4", caption: "", trimStart: 0 },
    { file: "viral/shot2.mp4", caption: "ਪਾਪਾ, ਟ੍ਰੈਫ਼ਿਕ ਵਿੱਚ ਵੀ:", trimStart: 0 },
    { file: "viral/shot3.mp4", caption: "ਬਾਪੂ ਜੀ ਵੀ ਨਹੀਂ ਰੁਕੇ:", trimStart: 0 },
    { file: "viral/shot4.mp4", caption: "ਤੇ ਫਿਰ ਪੂਰਾ ਟੱਬਰ:", trimStart: 0 },
  ],
  endLine: "ਜਦੋਂ ਇੰਡੀ ਰੇਡੀਓ ਚੱਲਦਾ ਹੈ…",
  tagline: "ਘਰ ਦੀ ਆਵਾਜ਼",
  url: "indiradio.ca",
  beatPeriodFrames: 17.14, // 105 BPM; replaced with the measured value
  beatOffsetFrames: 45,
};

/* Timeline in frames (30 fps). The music drop lands at 45 (1.5 s). */
export const VIRAL = {
  hookEnd: 45,
  cuts: [0, 150, 270, 390] as const, // shot starts
  shotLen: [150, 120, 120, 120] as const,
  endFrom: 510,
  total: 600,
};

/** Instagram/TikTok caption: white rounded box, heavy Gurmukhi, pops in. */
const Caption: React.FC<{ text: string; y?: number; delay?: number; big?: boolean }> = ({ text, y = 250, delay = 0, big }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 220 } });
  if (!text) return null;
  return (
    <div style={{ position: "absolute", top: y, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "#fff",
          color: "#111",
          fontFamily: FONT.gurmukhi,
          fontWeight: 800,
          fontSize: big ? 66 : 58,
          lineHeight: 1.3,
          textAlign: "center",
          padding: "18px 30px 12px",
          borderRadius: 22,
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -4}deg)`,
          opacity: s,
          maxWidth: 960,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Small brand bug in the corner for recall on every frame. */
const Bug: React.FC = () => (
  <div style={{ position: "absolute", top: 70, right: 50, display: "flex", alignItems: "center", gap: 12, background: "rgba(20,11,14,0.72)", padding: "10px 18px 10px 10px", borderRadius: 999 }}>
    <Record size={54} />
    <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 34, color: C.cream, letterSpacing: "0.02em" }}>
      INDI <span style={{ color: C.marigold }}>RADIO</span>
    </span>
    <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.red, marginLeft: 4 }} />
  </div>
);

/** A clip with beat "punch-in" zooms and a white flash on the cut. */
const Shot: React.FC<{ file: string; trimStart: number; punch?: boolean }> = ({ file, trimStart, punch = true }) => {
  const frame = useCurrentFrame();
  const { pulse } = useBeat(4);
  const flash = interpolate(frame, [0, 3], [0.85, 0], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, 150], [1.04, 1.12]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(file)} trimBefore={Math.round(trimStart * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${drift + (punch ? pulse * 0.045 : 0)})` }} />
      {/* subtle vignette for caption contrast */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

/** Hook overlay: freeze-frame feel with a record-scratch label, then the drop. */
const HookOverlay: React.FC<{ hook: string }> = ({ hook }) => {
  const frame = useCurrentFrame();
  const shake = frame >= 45 && frame < 53 ? Math.sin(frame * 3) * (53 - frame) * 2.2 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.5}px)` }}>
      <Caption text={hook} y={230} big />
      {frame < 45 ? (
        <div style={{ position: "absolute", bottom: 380, left: 0, right: 0, textAlign: "center", fontFamily: FONT.display, fontWeight: 900, fontSize: 64, color: C.cream, textShadow: "0 4px 20px rgba(0,0,0,0.6)", opacity: 0.9 }}>
          🔊 INDI RADIO · LIVE
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** End card: bold brand hit, then a hard cut back to the hook (loop). */
const EndCard: React.FC<{ line: string; tagline: string; url: string }> = ({ line, tagline, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeat();
  const rec = spring({ frame: frame - 10, fps, config: { damping: 11, stiffness: 140 } });
  const out = interpolate(frame, [80, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: C.red, opacity: out }}>
      <LightRays size={2400} color={C.marigold} opacity={0.3} />
      <RadioRings x={540} y={820} max={1600} color={C.cream} count={4} />
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, textAlign: "center", fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 72, color: C.cream }}>{line}</div>
      <div style={{ position: "absolute", left: 540 - 250, top: 820 - 250, transform: `scale(${rec * (1 + pulse * 0.05)}) rotate(${frame * 4}deg)` }}>
        <Record size={500} spin={false} />
      </div>
      <div style={{ position: "absolute", top: 1160, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <FlipLetters text="INDI RADIO" delay={14} size={170} colors={(i) => (i >= 5 ? C.marigold : C.cream)} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1360,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT.gurmukhi,
          fontWeight: 800,
          fontSize: 88,
          color: C.marigold,
          textShadow: `5px 5px 0 ${C.ink}`,
          opacity: interpolate(frame, [28, 36], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {tagline}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1540,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [36, 44], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ background: C.ink, color: C.cream, fontFamily: FONT.display, fontWeight: 900, fontSize: 70, padding: "14px 40px", borderRadius: 18 }}>
          ▶ {url}
        </div>
      </div>
      <Burst x={540} y={820} at={10} seed="viral-end" count={56} spread={950} />
      <PhulkariBand bottom={0} />
    </AbsoluteFill>
  );
};

export const Viral: React.FC<ViralProps> = (p) => {
  const beat = (sceneStart: number) => ({ period: p.beatPeriodFrames, offset: p.beatOffsetFrames, sceneStart });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {p.shots.map((s, i) => (
        <Sequence key={i} from={VIRAL.cuts[i]} durationInFrames={VIRAL.shotLen[i]}>
          <BeatContext.Provider value={beat(VIRAL.cuts[i])}>
            <Shot file={s.file} trimStart={s.trimStart} />
            {i === 0 ? <HookOverlay hook={p.hook} /> : <Caption text={s.caption} delay={2} />}
          </BeatContext.Provider>
        </Sequence>
      ))}
      <Sequence from={VIRAL.endFrom} durationInFrames={VIRAL.total - VIRAL.endFrom}>
        <BeatContext.Provider value={beat(VIRAL.endFrom)}>
          <EndCard line={p.endLine} tagline={p.tagline} url={p.url} />
        </BeatContext.Provider>
      </Sequence>
      <Sequence from={0} durationInFrames={VIRAL.endFrom}>
        <Bug />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Poster frame / thumbnail (first frame people see in the feed). */
export const ViralThumb: React.FC<ViralProps> = (p) => (
  <AbsoluteFill>
    <Img src={staticFile("viral/thumb.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <Caption text={p.hook} y={230} big />
    <Bug />
  </AbsoluteFill>
);
