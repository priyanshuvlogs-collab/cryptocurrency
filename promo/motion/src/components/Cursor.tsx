import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C } from "../theme";

/** A finger-tap cursor that glides to a point and taps at `tapAt`. */
export const TapCursor: React.FC<{ from: [number, number]; to: [number, number]; start: number; tapAt: number }> = ({ from, to, start, tapAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [start, tapAt - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p;
  const press = spring({ frame: frame - tapAt, fps, config: { damping: 10, stiffness: 300 } });
  const ring = interpolate(frame, [tapAt, tapAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visible = interpolate(frame, [start, start + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: visible, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: -60,
          top: -60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `6px solid ${C.marigold}`,
          transform: `scale(${ring * 1.4})`,
          opacity: frame >= tapAt ? 1 - ring : 0,
        }}
      />
      <div
        style={{
          width: 64,
          height: 64,
          marginLeft: -32,
          marginTop: -32,
          borderRadius: "50%",
          background: "rgba(244,236,221,0.92)",
          border: `4px solid ${C.ink}`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          transform: `scale(${1 - 0.25 * Math.sin(Math.min(press, 1) * Math.PI)})`,
        }}
      />
    </div>
  );
};
