// Captures the website for the promo video. Start the site first
// (npm run build && npm start in the repo root), then: npm run shots
import { execFileSync } from "node:child_process";
import { unlinkSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
}

const BASE = process.env.SITE_URL || "http://localhost:3100";
const OUT = new URL("../public/shots/", import.meta.url).pathname;
const SHOTS = [
  ["home-pa", "/pa", true],
  ["listen-pa", "/pa/listen-live", false],
  ["pricing-pa", "/pa/advertise/get-pricing", true],
  ["packages-en", "/en/advertise/packages", true],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
const page = await ctx.newPage();
for (const [name, path, full] of SHOTS) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  // Hide the dev-only and floating bits so the frames look clean.
  await page.addStyleTag({ content: "nextjs-portal,[data-nextjs-toast]{display:none!important} .reveal{opacity:1!important;transform:none!important}" });
  // Fixed bars repeat down a full-page capture, so hide them there.
  if (full) await page.addStyleTag({ content: "aside[aria-label],div.fixed.md\\:hidden{display:none!important}" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: full });
  // The video only shows the top of each page: crop and convert to JPEG to keep the repo small.
  const keep = { "home-pa": 6200, "packages-en": 3400, "pricing-pa": 2700 }[name] ?? 1688;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${OUT}${name}.png`, "-vf", `crop=780:min(ih\\,${keep}):0:0`, "-q:v", "3", `${OUT}${name}.jpg`]);
  unlinkSync(`${OUT}${name}.png`);
  console.log("saved", name);
}
await browser.close();
