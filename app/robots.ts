import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Search engines AND AI answer engines are explicitly welcome, so Indi Radio
 * can be cited by Google, ChatGPT, Claude, Perplexity and Gemini.
 */
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "DuckAssistBot",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/en/dedications/thank-you", "/pa/dedications/thank-you"];
  return {
    rules: [
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
