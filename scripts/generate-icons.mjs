// Generates PNG icons from public/favicon.svg. Run: node scripts/generate-icons.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile(new URL("../public/favicon.svg", import.meta.url));
const maskable = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#12090F"/><g transform="translate(9.6 9.6) scale(0.6)"><path d="M24 4 44 24 24 44 4 24Z" fill="#FF9F1C"/><path d="M24 11 37 24 24 37 11 24Z" fill="#E0348F"/><path d="M24 17.5 30.5 24 24 30.5 17.5 24Z" fill="#F5C542"/><circle cx="24" cy="24" r="3" fill="#E0263A"/></g></svg>`,
);
const out = (p) => new URL(`../public/${p}`, import.meta.url).pathname;
await sharp(svg, { density: 800 }).resize(192, 192).png().toFile(out("icon-192.png"));
await sharp(svg, { density: 800 }).resize(512, 512).png().toFile(out("icon-512.png"));
await sharp(svg, { density: 800 }).resize(512, 512).png().toFile(out("logo.png"));
await sharp(svg, { density: 800 }).resize(180, 180).png().toFile(out("apple-touch-icon.png"));
await sharp(maskable, { density: 800 }).resize(512, 512).png().toFile(out("icon-maskable-512.png"));
console.log("icons generated");
