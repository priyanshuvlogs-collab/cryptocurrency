import "server-only";
import { getFeaturedEpisodes } from "./cms";
import { getEpisodes } from "./youtube";
import type { Episode, Show } from "./types";

/**
 * YouTube uploads + episodes featured in the CMS. A CMS entry wins over the
 * automatic one for the same video (so the team can re-tag a show).
 */
export async function getAllEpisodes(channelId: string | null, shows: Show[]): Promise<Episode[]> {
  const [auto, featured] = await Promise.all([getEpisodes(channelId, shows), getFeaturedEpisodes()]);
  const byId = new Map<string, Episode>();
  for (const ep of auto) byId.set(ep.id, ep);
  for (const ep of featured) byId.set(ep.id, { ...byId.get(ep.id), ...ep });
  return [...byId.values()].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}
