import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";
import landTopo from "world-atlas/land-110m.json";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

const topo = landTopo as unknown as Topology<{ land: GeometryObject }>;
const LAND = feature(topo, topo.objects.land);
const GRATICULE = geoGraticule10();

/** Where Indi Radio's listeners are (from the station's own description). */
const ORIGIN = { name: "Surrey, BC", lon: -122.85, lat: 49.19 };
const PLACES = [
  { name: "USA", lon: -74.0, lat: 40.7 },
  { name: "UK", lon: -0.13, lat: 51.5 },
  { name: "Dubai", lon: 55.27, lat: 25.2 },
  { name: "India", lon: 76.78, lat: 30.73 },
  { name: "Australia", lon: 151.2, lat: -33.87 },
];

/**
 * A rotating globe: starts over Surrey, turns east while arcs fly from Surrey
 * to each place in turn, with a pin and label popping up at each landing.
 */
export const Globe: React.FC<{ radius: number; cx: number; cy: number; start?: number }> = ({ radius, cx, cy, start = 0 }) => {
  const frame = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  const spin = interpolate(frame, [0, 150], [-110, 85], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const tilt = interpolate(frame, [0, 150], [-38, -18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const projection = geoOrthographic()
    .scale(radius)
    .translate([cx, cy])
    .rotate([-spin, tilt])
    .clipAngle(90);
  const path = geoPath(projection);
  const center: [number, number] = [spin, -tilt];
  const visible = (lon: number, lat: number) => geoDistance([lon, lat], center) < Math.PI / 2 - 0.05;
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });

  return (
    <svg width={cx * 2} height={cy + radius + 200} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: `scale(${0.6 + 0.4 * enter})`, transformOrigin: `${cx}px ${cy}px` }}>
      <defs>
        <radialGradient id="ocean" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#2a1520" />
          <stop offset="100%" stopColor="#0b0608" />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="rgba(255,164,27,0)" />
          <stop offset="100%" stopColor="rgba(255,164,27,0.35)" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radius * 1.12} fill="url(#glow)" />
      <circle cx={cx} cy={cy} r={radius} fill="url(#ocean)" stroke={C.marigold} strokeWidth={3} />
      <path d={path(GRATICULE) || ""} fill="none" stroke="rgba(244,236,221,0.12)" strokeWidth={1.2} />
      <path d={path(LAND) || ""} fill="rgba(255,164,27,0.85)" stroke={C.ink} strokeWidth={1} />

      {PLACES.map((p, i) => {
        const t0 = 18 + i * 22;
        const prog = interpolate(frame, [t0, t0 + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
        if (prog <= 0) return null;
        const interp = geoInterpolate([ORIGIN.lon, ORIGIN.lat], [p.lon, p.lat]);
        const steps = 48;
        const n = Math.max(2, Math.round(steps * prog));
        const coords: [number, number][] = Array.from({ length: n }, (_, k) => interp((k / (n - 1)) * prog));
        const d = path({ type: "LineString", coordinates: coords }) || "";
        const landed = prog >= 1;
        const pin = projection([p.lon, p.lat]);
        const pop = spring({ frame: frame - t0 - 34, fps, config: { damping: 10, stiffness: 200 } });
        return (
          <g key={p.name}>
            <path d={d} fill="none" stroke={C.magenta} strokeWidth={6} strokeLinecap="round" />
            <path d={d} fill="none" stroke={C.cream} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
            {landed && pin && visible(p.lon, p.lat) ? (
              <g transform={`translate(${pin[0]} ${pin[1]}) scale(${pop})`}>
                <circle r={16} fill={C.magenta} stroke={C.cream} strokeWidth={4} />
                <circle r={16 + ((frame * 1.5) % 30)} fill="none" stroke={C.magenta} strokeWidth={3} opacity={1 - ((frame * 1.5) % 30) / 30} />
                <g transform="translate(22 -26)">
                  <rect x={0} y={-30} rx={12} width={p.name.length * 24 + 34} height={50} fill={C.cream} stroke={C.ink} strokeWidth={3} />
                  <text x={17} y={6} fontFamily={FONT.text} fontWeight={800} fontSize={32} fill={C.ink}>
                    {p.name}
                  </text>
                </g>
              </g>
            ) : null}
          </g>
        );
      })}

      {/* Home base: Surrey */}
      {(() => {
        const o = projection([ORIGIN.lon, ORIGIN.lat]);
        if (!o || !visible(ORIGIN.lon, ORIGIN.lat)) return null;
        return (
          <g transform={`translate(${o[0]} ${o[1]})`}>
            <circle r={22} fill={C.red} stroke={C.cream} strokeWidth={5} />
            <circle r={22 + ((frame * 2) % 40)} fill="none" stroke={C.red} strokeWidth={4} opacity={1 - ((frame * 2) % 40) / 40} />
          </g>
        );
      })()}
    </svg>
  );
};
