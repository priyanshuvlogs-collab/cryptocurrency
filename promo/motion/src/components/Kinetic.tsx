import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Words that rise out of a mask one by one. */
export const RiseWords: React.FC<{
  words: string[];
  delay?: number;
  stagger?: number;
  style: React.CSSProperties;
  colors?: (string | undefined)[];
  lineGap?: number;
}> = ({ words, delay = 0, stagger = 5, style, colors = [], lineGap = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: lineGap }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 16, stiffness: 140 } });
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
            <div style={{ ...style, color: colors[i] ?? style.color, transform: `translateY(${(1 - s) * 110}%)`, opacity: interpolate(s, [0, 0.3], [0, 1]) }}>{w}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Fade + slide for supporting text. */
export const FadeUp: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties; distance?: number }> = ({
  delay = 0,
  children,
  style,
  distance = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  return <div style={{ ...style, opacity: s, transform: `translateY(${(1 - s) * distance}px)` }}>{children}</div>;
};
