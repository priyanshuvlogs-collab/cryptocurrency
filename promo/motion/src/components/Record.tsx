import { useCurrentFrame } from "remotion";
import { C } from "../theme";

/** The spinning record from the site's hero, with a phulkari label. */
export const Record: React.FC<{ size: number; spin?: boolean }> = ({ size, spin = true }) => {
  const frame = useCurrentFrame();
  const rotation = spin ? frame * 3.2 : 0;
  const grooves = Array.from({ length: 14 }, (_, i) => 0.9 - i * 0.035);
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ transform: `rotate(${rotation}deg)` }}>
      <circle r="99" fill="#0b0608" />
      {grooves.map((g) => (
        <circle key={g} r={99 * g} fill="none" stroke="rgba(244,236,221,0.07)" strokeWidth="0.8" />
      ))}
      <path d="M-60 -70 A92 92 0 0 1 40 -84" stroke="rgba(244,236,221,0.25)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle r="36" fill={C.marigold} />
      <path d="M0 -30 30 0 0 30 -30 0Z" fill={C.magenta} />
      <path d="M0 -18 18 0 0 18 -18 0Z" fill={C.marigold} />
      <path d="M0 -8 8 0 0 8 -8 0Z" fill={C.cream} />
      <circle r="3" fill={C.ink} />
    </svg>
  );
};

/** Live audio bars. */
export const Equalizer: React.FC<{ bars?: number; height: number; color?: string; width?: number }> = ({
  bars = 24,
  height,
  color = C.marigold,
  width = 12,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: width * 0.6, height }}>
      {Array.from({ length: bars }, (_, i) => {
        const v = 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.18 + i * 0.9) * Math.cos(frame * 0.07 + i * 0.4));
        return <div key={i} style={{ width, height: height * v, borderRadius: width, background: i % 5 === 0 ? C.magenta : color }} />;
      })}
    </div>
  );
};
