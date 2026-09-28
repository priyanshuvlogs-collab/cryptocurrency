import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { PhulkariBand } from "../components/Background";
import { Callout } from "../components/Callout";
import { TapCursor } from "../components/Cursor";
import { FadeUp } from "../components/Kinetic";
import { Phone } from "../components/Phone";
import { Equalizer, Record } from "../components/Record";
import type { PromoProps } from "../schema";
import { C, FONT } from "../theme";
import { Globe } from "./Globe";
import { Burst, DrawPath, FlipLetters, Glass, LightRays, MeshBackground, RadioRings, SlamWord, TickerBand, Typewriter, useBeat } from "./fx";

/* 1 ── Hook: words slam in on the voice, radio waves pulse on the beat ─── */

export const HookV2: React.FC<{ p: PromoProps["hook"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { pulse } = useBeat();
  // The line is "ਤੁਹਾਡਾ… ਆਪਣਾ… ਰੇਡੀਓ": one word roughly every 0.85 s.
  const delays = p.words.map((_, i) => 6 + i * 26);
  return (
    <AbsoluteFill>
      <MeshBackground />
      <RadioRings x={540} y={960} max={1500} />
      <LightRays size={1800} opacity={0.18} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px", transform: `scale(${1 + pulse * 0.012 + frame * 0.0005})` }}>
        <Callout delay={0} x={90} y={470} tone="red" dot fontSize={38}>
          {p.pill}
        </Callout>
        <div style={{ display: "flex", flexDirection: "column", gap: -20 }}>
          {p.words.map((w, i) => (
            <SlamWord key={i} text={w} delay={delays[i]} size={250} color={i === p.words.length - 1 ? C.marigold : C.cream} />
          ))}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 90, bottom: 230, transform: `scaleY(${0.7 + pulse * 0.5})`, transformOrigin: "bottom" }}>
        <Equalizer height={130} bars={28} width={18} />
      </div>
    </AbsoluteFill>
  );
};

/* 2 ── Logo: record flips in, rays + burst, letters flip up ─────────────── */

export const LogoV2: React.FC<{ p: PromoProps["logo"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeat();
  const flip = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  return (
    <AbsoluteFill>
      <MeshBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ position: "relative", width: 640, height: 640 }}>
          <LightRays size={1500} opacity={0.4} />
          <RadioRings x={320} y={320} max={1300} color={C.magenta} count={4} />
          <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
            <div style={{ transform: `rotateY(${(1 - flip) * 180}deg) scale(${(0.4 + 0.6 * flip) * (1 + pulse * 0.03)})`, filter: "drop-shadow(0 50px 90px rgba(0,0,0,0.6))" }}>
              <Record size={640} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 80 }}>
          <FlipLetters text="INDI RADIO" delay={4} size={220} colors={(i) => (i >= 5 ? C.marigold : C.cream)} />
        </div>
        <FadeUp delay={20} style={{ marginTop: 26, fontFamily: FONT.text, fontWeight: 800, fontSize: 36, letterSpacing: "0.3em", color: C.muted }}>
          {p.tagline}
        </FadeUp>
      </AbsoluteFill>
      <Burst x={540} y={640} at={10} seed="logo" count={44} spread={800} />
      <div style={{ opacity: interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" }) }}>
        <PhulkariBand bottom={150} />
      </div>
    </AbsoluteFill>
  );
};

/* 3 ── Website: three phones on a 3D carousel, ticker bands ──────────────── */

const SHOTS: { src: string; h: number; scroll?: [number, number, number, number] }[] = [
  { src: "shots/home-pa.jpg", h: 6200, scroll: [20, 170, 0, 3200] },
  { src: "shots/listen-pa.jpg", h: 1688 },
  { src: "shots/packages-en.jpg", h: 3400, scroll: [20, 170, 0, 1400] },
];

export const CarouselV2: React.FC<{ p: PromoProps["home"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 80 } });
  // 0 → 2: which phone is centred; eases between them with a hold on each.
  const flow = interpolate(frame, [0, 40, 80, 120, 160], [0, 0, 1, 1, 2], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <MeshBackground />
      <div style={{ position: "absolute", top: 140, left: 90, right: 90 }}>
        <SlamWord text={p.title} delay={4} size={112} />
        <FadeUp delay={12} style={{ fontFamily: FONT.text, fontWeight: 700, fontSize: 44, color: C.muted, marginTop: 6 }}>
          {p.sub}
        </FadeUp>
      </div>
      {/* Coverflow: three phones slide across, the centred one faces the camera. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 1100, perspective: 2200, transform: `translateY(${(1 - enter) * 900}px)` }}>
        {SHOTS.map((s, i) => {
          const o = i - flow;
          return (
            <div
              key={s.src}
              style={{
                position: "absolute",
                left: 540 - 230 + o * 360,
                top: Math.abs(o) * 60,
                transform: `rotateY(${-o * 38}deg) scale(${1 - Math.min(1, Math.abs(o)) * 0.18})`,
                zIndex: 10 - Math.round(Math.abs(o) * 3),
                opacity: interpolate(Math.abs(o), [0, 1.2, 2], [1, 0.7, 0]),
                filter: `brightness(${1 - Math.min(1, Math.abs(o)) * 0.35})`,
              }}
            >
              <Phone src={s.src} width={460} shotHeight={s.h} scroll={s.scroll} />
            </div>
          );
        })}
      </div>
      <TickerBand text="LIVE CALL-INS   ◆   PUNJABI MUSIC 24/7   ◆   BHEDAN DA KAAL" y={1420} angle={-7} delay={10} />
      <TickerBand text="ਪੰਜਾਬੀ + ENGLISH   ◆   SURREY, BC   ◆   INDI RADIO" y={1545} angle={4} bg={C.magenta} fg={C.ink} speed={-5} delay={18} />
    </AbsoluteFill>
  );
};

/* 4 ── One tap: play morphs to live, voice-reactive radial visualizer ────── */

const RadialBars: React.FC<{ src: string; startFrame: number; radius: number; active: number }> = ({ src, startFrame, radius, active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audio = useAudioData(src);
  const { pulse } = useBeat(6);
  const n = 72;
  let values: number[] = new Array(n / 2).fill(0);
  if (audio && frame >= startFrame) {
    values = visualizeAudio({ audioData: audio, frame: frame - startFrame, fps, numberOfSamples: 64, smoothing: true }).slice(0, n / 2);
  }
  const bars = [...values, ...values.slice().reverse()];
  return (
    <svg width={radius * 3} height={radius * 3} viewBox={`${-radius * 1.5} ${-radius * 1.5} ${radius * 3} ${radius * 3}`} style={{ position: "absolute", left: 540 - radius * 1.5, top: 1010 - radius * 1.5 }}>
      {bars.map((v, i) => {
        const a = (i / bars.length) * Math.PI * 2 - Math.PI / 2;
        const len = (18 + Math.min(1, v * 6) * 220 + pulse * 26) * active;
        const x1 = Math.cos(a) * (radius + 16);
        const y1 = Math.sin(a) * (radius + 16);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x1 + Math.cos(a) * len}
            y2={y1 + Math.sin(a) * len}
            stroke={i % 6 === 0 ? C.magenta : C.marigold}
            strokeWidth={12}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export const VisualizerV2: React.FC<{ p: PromoProps["listen"]; tapAt: number; voice: string | null; voiceFrom: number }> = ({ p, tapAt, voice, voiceFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = spring({ frame: frame - tapAt, fps, config: { damping: 14 } });
  const spinBoost = interpolate(on, [0, 1], [0.2, 1]);
  return (
    <AbsoluteFill>
      <MeshBackground />
      <div style={{ position: "absolute", top: 150, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <SlamWord text={p.title[0]} delay={2} size={130} />
          <SlamWord text={p.title[1]} delay={tapAt} size={130} color={C.marigold} />
        </div>
        <FadeUp delay={8} style={{ marginTop: 40, fontFamily: FONT.text, fontWeight: 700, fontSize: 42, color: C.muted, textAlign: "right", whiteSpace: "pre-line" }}>
          {p.sub}
        </FadeUp>
      </div>
      {voice ? <RadialBars src={staticFile(voice)} startFrame={voiceFrom} radius={290} active={on} /> : null}
      <div style={{ position: "absolute", left: 540 - 290, top: 1010 - 290, width: 580, height: 580, transform: `rotate(${frame * 4 * spinBoost}deg)` }}>
        <Record size={580} spin={false} />
      </div>
      <Burst x={540} y={1010} at={tapAt} seed="tap" count={30} spread={600} />
      {/* play → live */}
      <div
        style={{
          position: "absolute",
          left: 540 - 110,
          top: 1010 - 110,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: interpolate(on, [0, 1], [0, 1]) > 0.5 ? C.red : C.marigold,
          border: `8px solid ${C.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${1 - 0.15 * Math.sin(Math.min(1, Math.max(0, (frame - tapAt) / 8)) * Math.PI)})`,
          boxShadow: `0 0 ${60 * on}px ${C.red}`,
        }}
      >
        {on < 0.5 ? (
          <svg width="90" height="90" viewBox="0 0 10 10">
            <path d="M3 1.8 8.4 5 3 8.2Z" fill={C.ink} />
          </svg>
        ) : (
          <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 62, color: "#fff", letterSpacing: "0.04em" }}>LIVE</div>
        )}
      </div>
      <TapCursor from={[930, 1780]} to={[540, 1010]} start={Math.max(0, tapAt - 28)} tapAt={tapAt} hideAfter={8} />
      <Callout delay={tapAt + 10} x={90} y={1500} tone="red" dot fontSize={40}>
        {p.nowPlaying}
      </Callout>
    </AbsoluteFill>
  );
};

/* 5 ── Globe: arcs from Surrey to the world ─────────────────────────────── */

export const GlobeV2: React.FC<{ p: PromoProps["clocks"] }> = ({ p }) => {
  return (
    <AbsoluteFill>
      <MeshBackground />
      <div style={{ position: "absolute", top: 140, left: 90, right: 90, zIndex: 2 }}>
        <SlamWord text={p.title[0]} delay={2} size={118} />
        <SlamWord text={p.title[1]} delay={10} size={118} color={C.marigold} />
        <FadeUp delay={18} style={{ fontFamily: FONT.text, fontWeight: 700, fontSize: 42, color: C.muted, marginTop: 10 }}>
          {p.sub}
        </FadeUp>
      </div>
      <Globe radius={400} cx={540} cy={1180} start={6} />
    </AbsoluteFill>
  );
};

/* 6 ── Advertise: package cards flip in, tap, burst ─────────────────────── */

export const AdvertiseV2: React.FC<{ p: PromoProps["advertise"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const TAP = 110;
  const chosen = spring({ frame: frame - TAP, fps, config: { damping: 14, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <MeshBackground tint="marigold" />
      <div style={{ position: "absolute", top: 130, left: 90, right: 90 }}>
        <SlamWord text={p.title[0]} delay={2} size={124} color={C.ink} />
        <SlamWord text={p.title[1]} delay={12} size={124} color={C.ink} />
        <FadeUp delay={20} style={{ fontFamily: FONT.text, fontWeight: 700, fontSize: 42, color: "rgba(20,11,14,0.78)", marginTop: 10 }}>
          {p.sub}
        </FadeUp>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 900, perspective: 2000 }}>
        {p.packages.map((name, i) => {
          const s = spring({ frame: frame - 18 - i * 10, fps, config: { damping: 13, stiffness: 110 } });
          const isMid = i === 1;
          const fan = (i - 1) * 300;
          const lift = isMid ? chosen : 0;
          const dim = isMid ? 1 : 1 - chosen * 0.5;
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: 540 - 180 + fan * (1 - lift * 0.0),
                top: 60 - lift * 40 + Math.abs(i - 1) * 40,
                width: 360,
                height: 500,
                transform: `rotateY(${(1 - s) * 90}deg) rotateZ(${(i - 1) * 6 * (1 - lift)}deg) scale(${1 + lift * 0.18})`,
                zIndex: isMid ? 3 : 1,
                opacity: s * dim,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 28,
                  border: `4px solid ${C.ink}`,
                  background: isMid ? C.ink : C.cream,
                  color: isMid ? C.cream : C.ink,
                  boxShadow: `12px 12px 0 ${isMid ? C.magenta : C.ink}`,
                  padding: 34,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {isMid ? (
                  <div style={{ alignSelf: "flex-start", background: C.marigold, color: C.ink, fontFamily: FONT.text, fontWeight: 800, fontSize: 24, padding: "8px 14px", borderRadius: 8, marginBottom: 18 }}>
                    MOST POPULAR
                  </div>
                ) : null}
                <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 50, lineHeight: 0.95, textTransform: "uppercase", overflowWrap: "anywhere" }}>{name.replace("★ ", "")}</div>
                <div style={{ fontFamily: FONT.text, fontWeight: 700, fontSize: 30, marginTop: 16, opacity: 0.8 }}>Pricing on request</div>
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    background: isMid ? C.marigold : C.ink,
                    color: isMid ? C.ink : C.cream,
                    fontFamily: FONT.text,
                    fontWeight: 800,
                    fontSize: 28,
                    textAlign: "center",
                    padding: "18px 0",
                    borderRadius: 12,
                  }}
                >
                  GET A QUOTE
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <TapCursor from={[960, 1850]} to={[540, 1195]} start={TAP - 30} tapAt={TAP} hideAfter={10} />
      <Burst x={540} y={1195} at={TAP} seed="quote" count={50} spread={850} />
      <Callout delay={TAP + 12} x={180} y={1420} tone="red" fontSize={44}>
        {p.cta}
      </Callout>
      <Callout delay={TAP + 24} x={140} y={1540} tone="green" fontSize={40}>
        {p.whatsapp}
      </Callout>
    </AbsoluteFill>
  );
};

/* 7 ── End card: drawn diamond frame, typed URL, CTA ─────────────────────── */

export const EndV2: React.FC<{ p: PromoProps["end"] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeat();
  const btns = spring({ frame: frame - 40, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <MeshBackground />
      <RadioRings x={540} y={640} max={1400} color={C.marigold} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <DrawPath d="M540 250 L960 700 L540 1150 L120 700 Z" from={0} to={36} stroke={C.marigold} width={8} />
        <DrawPath d="M540 300 L910 700 L540 1100 L170 700 Z" from={8} to={44} stroke={C.magenta} width={4} />
      </svg>
      <AbsoluteFill style={{ alignItems: "center", flexDirection: "column", paddingTop: 460 }}>
        <div style={{ transform: `scale(${spring({ frame, fps, config: { damping: 12 } }) * (1 + pulse * 0.04)})` }}>
          <Record size={260} />
        </div>
        <div style={{ marginTop: 40 }}>
          <FlipLetters text="INDI RADIO" delay={6} size={150} colors={(i) => (i >= 5 ? C.marigold : C.cream)} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 1200, left: 0, right: 0, textAlign: "center" }}>
        <FadeUp delay={10} style={{ fontFamily: FONT.gurmukhi, fontWeight: 800, fontSize: 76, color: C.cream }}>
          {p.visit}
        </FadeUp>
        <Typewriter
          text={p.url}
          start={18}
          cps={16}
          style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 160, color: C.marigold, textShadow: `8px 8px 0 ${C.magenta}`, lineHeight: 1.05 }}
        />
      </div>
      <div style={{ position: "absolute", top: 1560, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22, opacity: btns, transform: `translateY(${(1 - btns) * 60}px)` }}>
        <Glass style={{ background: C.red, border: `3px solid ${C.ink}`, padding: "24px 36px", borderRadius: 16 }}>
          <span style={{ fontFamily: FONT.text, fontWeight: 800, fontSize: 38, color: "#fff" }}>{p.listen}</span>
        </Glass>
        <Glass style={{ background: C.green, border: `3px solid ${C.ink}`, padding: "24px 36px", borderRadius: 16 }}>
          <span style={{ fontFamily: FONT.text, fontWeight: 800, fontSize: 38, color: C.ink }}>{p.whatsapp}</span>
        </Glass>
      </div>
      <Burst x={540} y={640} at={2} seed="end" count={40} spread={900} />
      <PhulkariBand bottom={0} />
    </AbsoluteFill>
  );
};
