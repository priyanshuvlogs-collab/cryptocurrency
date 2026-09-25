import "server-only";
import { headers } from "next/headers";

/**
 * Spam protection shared by every form:
 *  1. Honeypot – a visually hidden "website" field humans never fill in.
 *  2. Time trap – the form records when it was rendered in the browser;
 *     submissions faster than 3 seconds are bots.
 *  3. Rate limit – 5 submissions per IP per 10 minutes per form. Uses
 *     Upstash Redis when configured (works across all Vercel instances),
 *     otherwise an in-memory window per server instance.
 */

const WINDOW_SECONDS = 600;
const MAX_PER_WINDOW = 5;
const memory = new Map<string, { count: number; reset: number }>();

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
}

async function upstashIncr(key: string): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, WINDOW_SECONDS, "NX"],
      ]),
      cache: "no-store",
    });
    const data = (await res.json()) as { result: number }[];
    return Number(data[0]?.result ?? 0);
  } catch {
    return null;
  }
}

export async function rateLimited(form: string): Promise<boolean> {
  const ip = await clientIp();
  const key = `rl:${form}:${ip}`;
  const count = await upstashIncr(key);
  if (count !== null) return count > MAX_PER_WINDOW;

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.reset < now) {
    memory.set(key, { count: 1, reset: now + WINDOW_SECONDS * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export function looksLikeBot(formData: FormData): boolean {
  if (String(formData.get("website") || "").trim() !== "") return true;
  const started = Number(formData.get("_t"));
  if (!started || Number.isNaN(started)) return true; // no JS timestamp → likely scripted
  const elapsed = Date.now() - started;
  return elapsed < 3000 || elapsed > 1000 * 60 * 60 * 6;
}
