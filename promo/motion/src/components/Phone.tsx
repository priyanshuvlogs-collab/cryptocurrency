import { Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { C } from "../theme";

/**
 * A phone showing a real screenshot of indiradio.ca. `scrollTo` scrolls the
 * page (in screenshot pixels) between `scrollFrom` and `scrollTo` frames.
 */
export const Phone: React.FC<{
  src: string;
  width: number;
  shotHeight: number; // full screenshot height in px (780 px wide)
  scroll?: [number, number, number, number]; // [startFrame, endFrame, fromY, toY]
  zoom?: [number, number, number, number, number]; // [startFrame, endFrame, scale, originX%, originY%]
}> = ({ src, width, shotHeight, scroll, zoom }) => {
  const frame = useCurrentFrame();
  const height = width * 2.1;
  const screenW = width - 28;
  const screenH = height - 28;
  const k = screenW / 780; // screenshot → screen scale
  const y = scroll
    ? interpolate(frame, [scroll[0], scroll[1]], [scroll[2], scroll[3]], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      })
    : 0;
  const maxY = Math.max(0, shotHeight * k - screenH);
  const scale = zoom
    ? interpolate(frame, [zoom[0], zoom[1]], [1, zoom[2]], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
    : 1;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.13,
        background: "#0a0507",
        padding: 14,
        boxShadow: `0 0 0 3px #3a2a30, 0 60px 120px rgba(0,0,0,0.55), 18px 18px 0 ${C.marigold}`,
        position: "relative",
      }}
    >
      <div style={{ width: screenW, height: screenH, borderRadius: width * 0.1, overflow: "hidden", position: "relative", background: C.cream }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: zoom ? `${zoom[3]}% ${zoom[4]}%` : "50% 50%", width: "100%", height: "100%" }}>
          <Img src={staticFile(src)} style={{ width: screenW, display: "block", transform: `translateY(${-Math.min(y * k, maxY)}px)` }} />
        </div>
        {/* dynamic island */}
        <div style={{ position: "absolute", top: 14, left: "50%", width: width * 0.28, height: 30, marginLeft: -width * 0.14, borderRadius: 20, background: "#0a0507" }} />
      </div>
    </div>
  );
};
