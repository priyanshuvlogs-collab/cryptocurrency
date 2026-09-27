#!/usr/bin/env node
/**
 * Postbuild guard: fails the build when "[CONFIRM" appears in a rendered page.
 *
 * Scans every prerendered page in .next/server/app (HTML plus the inline RSC
 * payload) in both languages.
 *
 * - STRICT pages (the Advertise pages) must exist in the build and must never
 *   contain "[CONFIRM".
 * - Any other page may only contain it while it is listed in
 *   scripts/confirm-baseline.json – the list of pages still waiting on facts
 *   from the station. A page NOT on that list that renders "[CONFIRM" fails
 *   the build, and a listed page that has become clean is reported so it can
 *   be removed. Empty the list to make every page strict.
 *
 * Run manually with `node scripts/check-confirm.mjs`.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const APP_DIR = join(ROOT, ".next", "server", "app");
const MARKER = "[CONFIRM";
const STRICT = ["/en/advertise", "/pa/advertise"];
const baselinePath = join(ROOT, "scripts", "confirm-baseline.json");
const baseline = new Set(existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")).pages : []);

if (!existsSync(APP_DIR)) {
  console.error("check-confirm: .next/server/app not found – run `next build` first.");
  process.exit(1);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (name.endsWith(".html")) yield full;
  }
}

const offenders = new Map(); // route -> sample snippets
const seen = new Set();
for (const file of walk(APP_DIR)) {
  const route = "/" + relative(APP_DIR, file).split(sep).join("/").replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  seen.add(route);
  const html = readFileSync(file, "utf8");
  let at = html.indexOf(MARKER);
  if (at === -1) continue;
  const samples = [];
  while (at !== -1 && samples.length < 3) {
    samples.push(html.slice(Math.max(0, at - 40), at + 60).replace(/\s+/g, " "));
    at = html.indexOf(MARKER, at + MARKER.length);
  }
  offenders.set(route, samples);
}

const errors = [];
for (const route of STRICT) {
  if (!seen.has(route)) errors.push(`${route}: not prerendered, so it could not be checked`);
}
for (const [route, samples] of offenders) {
  if (STRICT.includes(route) || !baseline.has(route)) {
    errors.push(`${route}: contains "${MARKER}"\n      …${samples.join("…\n      …")}…`);
  }
}
const nowClean = [...baseline].filter((r) => seen.has(r) && !offenders.has(r));

console.log(`check-confirm: scanned ${seen.size} prerendered pages; ${offenders.size} still show "${MARKER}" (${baseline.size} allowed by baseline).`);
if (nowClean.length) console.log(`check-confirm: these baseline pages are clean now – remove them from scripts/confirm-baseline.json:\n  ${nowClean.join("\n  ")}`);
if (errors.length) {
  console.error(`\ncheck-confirm: FAILED\n  ${errors.join("\n  ")}\n`);
  process.exit(1);
}
console.log("check-confirm: OK");
