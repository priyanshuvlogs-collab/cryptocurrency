import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Same type as indiradio.ca, bundled in public/fonts so renders work offline:
// Big Shoulders (display), Baloo Paaji 2 (Gurmukhi), Baloo 2 (Devanagari), Schibsted Grotesk (text).
const FACES: [family: string, file: string, weight: string][] = [
  ["Big Shoulders", "big-shoulders-latin-800-normal.woff2", "800"],
  ["Big Shoulders", "big-shoulders-latin-900-normal.woff2", "900"],
  ["Baloo Paaji 2", "baloo-paaji-2-gurmukhi-700-normal.woff2", "700"],
  ["Baloo Paaji 2", "baloo-paaji-2-gurmukhi-800-normal.woff2", "800"],
  ["Baloo Paaji 2", "baloo-paaji-2-latin-700-normal.woff2", "700"],
  ["Baloo Paaji 2", "baloo-paaji-2-latin-800-normal.woff2", "800"],
  ["Baloo 2", "baloo-2-devanagari-700-normal.woff2", "700"],
  ["Baloo 2", "baloo-2-devanagari-800-normal.woff2", "800"],
  ["Schibsted Grotesk", "schibsted-grotesk-latin-500-normal.woff2", "500"],
  ["Schibsted Grotesk", "schibsted-grotesk-latin-700-normal.woff2", "700"],
  ["Schibsted Grotesk", "schibsted-grotesk-latin-800-normal.woff2", "800"],
];
for (const [family, file, weight] of FACES) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, format: "woff2" });
}

export const FONT = {
  display: "'Big Shoulders', sans-serif",
  gurmukhi: "'Baloo Paaji 2', sans-serif",
  devanagari: "'Baloo 2', 'Baloo Paaji 2', sans-serif",
  text: "'Schibsted Grotesk', sans-serif",
};

// Brand colours from the website's design tokens.
export const C = {
  ink: "#140b0e",
  ink2: "#1f1216",
  cream: "#f4ecdd",
  marigold: "#ffa41b",
  magenta: "#ff6fb5",
  red: "#e0263a",
  green: "#25d366",
  muted: "rgba(244,236,221,0.66)",
};

export const FPS = 30;
