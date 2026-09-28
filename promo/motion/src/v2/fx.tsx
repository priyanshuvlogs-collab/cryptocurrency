/**
 * Motion-graphics building blocks for the V2 promo. Everything is driven by
 * useCurrentFrame() (and seeded random()), so every render is identical.
 */
import { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { C, FONT } from "../theme";

/* ── Beat grid ─────────────────────────────────────────────────────────── */

export type Beat = { period: number; offset: number; sceneStart: number };
export const BeatContext = createContext<Beat>({ period: 18, offset: 0, sceneStart: 0 });

/**
 * 1 on each music beat, decaying to 0 before the next. Uses the global frame
 * (scene start + local frame) so every scene stays on the same grid.
 */
export const useBeat = (decay = 5) => {
  const frame = useCurrentFrame();
  const { period, offset, sceneStart } = useContext(BeatContext);
  const g = frame + sceneStart - offset;
  if (g < 0) return { pulse: 0, index: -1 };
  const t = g % period;
  return { pulse: Math.exp(-t / decay), index: Math.floor(g / period) };
};

/* ── Backgrounds ───────────────────────────────────────────────────────── */

/** Deep ink backdrop with a moving marigold/magenta gradient mesh that breathes on the beat. */
export const MeshBackground: React.FC<{ tint?: "ink" | "marigold" }> = ({ tint = "ink" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { pulse } = useBeat(7);
  const t = frame / 30;
  const base = tint === "marigold" ? C.marigold : C.ink;
  const blobs =
    tint === "marigold"
      ? ["rgba(255,111,181,0.55)", "rgba(224,38,58,0.45)", "rgba(255,236,200,0.6)"]
      : ["rgba(255,164,27,0.35)", "rgba(255,111,181,0.28)", "rgba(224,38,58,0.22)"];
  const pos = [
    [0.2 + 0.12 * Math.sin(t * 0.7), 0.25 + 0.1 * Math.cos(t * 0.5)],
    [0.8 + 0.1 * Math.cos(t * 0.6), 0.55 + 0.12 * Math.sin(t * 0.4)],
    [0.45 + 0.15 * Math.sin(t * 0.3 + 1), 0.9 + 0.05 * Math.cos(t * 0.8)],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: "hidden" }}>
      {blobs.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pos[i][0] * width - width * 0.6,
            top: pos[i][1] * height - width * 0.6,
            width: width * 1.2,
            height: width * 1.2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c} 0%, transparent 62%)`,
            transform: `scale(${1 + pulse * 0.06})`,
          }}
        />
      ))}
      {/* fine grain */}
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage: `repeating-linear-gradient(0deg, ${tint === "marigold" ? C.ink : C.cream} 0 1px, transparent 1px 4px)`,
          transform: `translateY(${(frame * 2) % 4}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Radio waves: rings that spawn on every beat and ripple outwards. */
export const RadioRings: React.FC<{ x: number; y: number; color?: string; max?: number; count?: number }> = ({
  x,
  y,
  color = C.marigold,
  max = 900,
  count = 5,
}) => {
  const frame = useCurrentFrame();
  const { period, offset, sceneStart } = useContext(BeatContext);
  const g = frame + sceneStart - offset;
  const life = period * count;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const age = (((g - i * period) % life) + life) % life;
        const p = age / life;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - (max * p) / 2,
              top: y - (max * p) / 2,
              width: max * p,
              height: max * p,
              borderRadius: "50%",
              border: `${6 * (1 - p) + 1}px solid ${color}`,
              opacity: (1 - p) * 0.8,
            }}
          />
        );
      })}
    </>
  );
};

/** Rotating light rays behind a hero element. */
export const LightRays: React.FC<{ size: number; color?: string; opacity?: number }> = ({ size, color = C.marigold, opacity = 0.35 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        opacity,
        background: `repeating-conic-gradient(from ${frame * 0.8}deg, ${color} 0deg 7deg, transparent 7deg 22deg)`,
        maskImage: "radial-gradient(circle, black 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 70%)",
      }}
    />
  );
};

/** A diagonal ticker band scrolling brand phrases. */
export const TickerBand: React.FC<{ text: string; y: number; angle?: number; bg?: string; fg?: string; speed?: number; delay?: number }> = ({
  text,
  y,
  angle = -8,
  bg = C.marigold,
  fg = C.ink,
  speed = 6,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const repeated = Array.from({ length: 8 }, () => text).join("   ◆   ");
  return (
    <div
      style={{
        position: "absolute",
        left: -300,
        right: -300,
        top: y,
        transform: `rotate(${angle}deg) scaleX(${enter})`,
        background: bg,
        color: fg,
        padding: "18px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontFamily: FONT.display,
        fontWeight: 900,
        fontSize: 58,
        letterSpacing: "0.04em",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ transform: `translateX(${-((frame * speed) % 1400)}px)` }}>{repeated}</div>
    </div>
  );
};

/* ── Type ──────────────────────────────────────────────────────────────── */

/** Word slams in from big to normal with a shake and an RGB split that settles. */
export const SlamWord: React.FC<{ text: string; delay: number; size: number; color?: string; font?: string }> = ({
  text,
  delay,
  size,
  color = C.cream,
  font = FONT.gurmukhi,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;
  const s = spring({ frame: f, fps, config: { damping: 11, stiffness: 220, mass: 0.7 } });
  const split = f < 0 ? 0 : interpolate(f, [0, 10], [18, 0], { extrapolateRight: "clamp" });
  const shake = f >= 0 && f < 8 ? Math.sin(f * 3.1) * (8 - f) * 1.4 : 0;
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        color,
        opacity: f < 0 ? 0 : 1,
        transform: `translate(${shake}px, ${shake * 0.4}px) scale(${interpolate(s, [0, 1], [2.6, 1])})`,
        transformOrigin: "left center",
        textShadow: `${split}px 0 0 rgba(255,111,181,0.85), ${-split}px 0 0 rgba(0,210,255,0.75)`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Letters flip up in 3D one after another. */
export const FlipLetters: React.FC<{ text: string; delay?: number; size: number; colors?: (i: number) => string; stagger?: number }> = ({
  text,
  delay = 0,
  size,
  colors = () => C.cream,
  stagger = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", perspective: 900 }}>
      {text.split("").map((ch, i) => {
        const s = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 13, stiffness: 170 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: ch === " " ? size * 0.25 : undefined,
              fontFamily: FONT.display,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 0.9,
              color: colors(i),
              transform: `rotateX(${(1 - s) * -100}deg) translateY(${(1 - s) * 40}px)`,
              transformOrigin: "50% 100%",
              opacity: Math.min(1, s * 1.5),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Types text out with a blinking caret. */
export const Typewriter: React.FC<{ text: string; start: number; cps?: number; style: React.CSSProperties }> = ({ text, start, cps = 18, style }) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / 30) * cps)));
  const caret = Math.floor(frame / 8) % 2 === 0 || shown < text.length;
  return (
    <div style={style}>
      {text.slice(0, shown)}
      <span style={{ opacity: caret && frame >= start ? 1 : 0, marginLeft: 4 }}>|</span>
    </div>
  );
};

/* ── Shapes ────────────────────────────────────────────────────────────── */

/** An SVG path that draws itself between two frames. */
export const DrawPath: React.FC<{ d: string; from: number; to: number; stroke: string; width: number; fill?: string }> = ({ d, from, to, stroke, width, fill = "none" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return <path d={d} pathLength={1} fill={fill} stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />;
};

/** A seeded particle burst (confetti diamonds) from a point. */
export const Burst: React.FC<{ x: number; y: number; at: number; count?: number; seed: string; spread?: number }> = ({ x, y, at, count = 36, seed, spread = 700 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 60) return null;
  const colors = [C.marigold, C.magenta, C.cream, C.red, C.green];
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = random(`${seed}-a-${i}`) * Math.PI * 2;
        const v = 0.4 + random(`${seed}-v-${i}`) * 0.6;
        const p = Easing.out(Easing.cubic)(Math.min(1, t / 40));
        const dx = Math.cos(a) * spread * v * p;
        const dy = Math.sin(a) * spread * v * p + t * t * 0.08;
        const size = 10 + random(`${seed}-s-${i}`) * 18;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + dx,
              top: y + dy,
              width: size,
              height: size,
              background: colors[i % colors.length],
              transform: `rotate(${45 + t * (i % 2 ? 9 : -9)}deg)`,
              opacity: interpolate(t, [0, 45, 60], [1, 1, 0]),
            }}
          />
        );
      })}
    </>
  );
};

/** Glassy rounded card. */
export const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(244,236,221,0.08)",
      border: "2px solid rgba(244,236,221,0.22)",
      borderRadius: 32,
      boxShadow: "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Transition: phulkari diamond wipe ─────────────────────────────────── */

const DiamondWipeComponent: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  // A diamond grows from the centre until it covers the frame.
  const r = interpolate(presentationProgress, [0, 1], [0, 160]);
  const clip = `polygon(50% ${50 - r}%, ${50 + r}% 50%, 50% ${50 + r}%, ${50 - r}% 50%)`;
  return (
    <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
      {children}
      {/* marigold edge riding the diamond */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: `inset 0 0 0 ${interpolate(presentationProgress, [0, 0.9, 1], [24, 10, 0])}px ${C.marigold}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const diamondWipe = (): TransitionPresentation<Record<string, never>> => ({ component: DiamondWipeComponent, props: {} });
