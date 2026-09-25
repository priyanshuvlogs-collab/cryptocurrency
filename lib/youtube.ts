import "server-only";
import type { Episode, Show } from "./types";

/**
 * YouTube integration for the episode archive and the "Watch Live" badge.
 *
 * - With YOUTUBE_API_KEY: YouTube Data API v3 (uploads playlist + per-show
 *   playlists + live detection). Costs about 2–4 quota units per refresh,
 *   well inside the free 10,000/day.
 * - Without a key: the channel's public RSS feed (latest 15 uploads, no live
 *   detection). Nothing breaks either way.
 */

const API = "https://www.googleapis.com/youtube/v3";
const key = process.env.YOUTUBE_API_KEY;

function decodeXml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function tagShow(title: string, description: string, shows: Show[], playlistMap: Map<string, string>, id: string) {
  const fromPlaylist = playlistMap.get(id);
  if (fromPlaylist) return fromPlaylist;
  const hay = `${title} ${description}`.toLowerCase();
  for (const show of shows) {
    if (show.keywords.some((k) => k && hay.includes(k.toLowerCase()))) return show.slug;
  }
  return null;
}

async function fetchRss(channelId: string): Promise<Omit<Episode, "showSlug">[]> {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`YouTube RSS ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => {
    const get = (re: RegExp) => decodeXml(entry.match(re)?.[1] ?? "");
    const id = get(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    return {
      id,
      title: get(/<title>([^<]*)<\/title>/),
      description: get(/<media:description>([\s\S]*?)<\/media:description>/),
      publishedAt: get(/<published>([^<]+)<\/published>/),
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  });
}

interface PlaylistItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    resourceId: { videoId: string };
    thumbnails?: Record<string, { url: string }>;
  };
  contentDetails?: { videoPublishedAt?: string };
}

async function fetchPlaylist(playlistId: string, max = 50, revalidate = 1800): Promise<PlaylistItem[]> {
  const url = `${API}/playlistItems?part=snippet,contentDetails&maxResults=${max}&playlistId=${playlistId}&key=${key}`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`YouTube playlistItems ${res.status}`);
  const data = (await res.json()) as { items?: PlaylistItem[] };
  return data.items ?? [];
}

export async function getEpisodes(channelId: string | null, shows: Show[]): Promise<Episode[]> {
  if (!channelId) return [];
  try {
    if (!key) {
      const items = await fetchRss(channelId);
      return items.map((e) => ({ ...e, showSlug: tagShow(e.title, e.description, shows, new Map(), e.id) }));
    }

    const playlistMap = new Map<string, string>();
    await Promise.all(
      shows
        .filter((s) => s.youtubePlaylistId)
        .map(async (s) => {
          const items = await fetchPlaylist(s.youtubePlaylistId!).catch(() => []);
          for (const it of items) playlistMap.set(it.snippet.resourceId.videoId, s.slug);
        }),
    );

    const uploads = await fetchPlaylist(`UU${channelId.slice(2)}`);
    return uploads
      .filter((it) => it.snippet.title !== "Private video" && it.snippet.title !== "Deleted video")
      .map((it) => {
        const id = it.snippet.resourceId.videoId;
        const thumbs = it.snippet.thumbnails ?? {};
        return {
          id,
          title: it.snippet.title,
          description: it.snippet.description,
          publishedAt: it.contentDetails?.videoPublishedAt || it.snippet.publishedAt,
          thumbnail: thumbs.high?.url || thumbs.medium?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${id}`,
          showSlug: tagShow(it.snippet.title, it.snippet.description, shows, playlistMap, id),
        };
      });
  } catch (err) {
    console.error("[youtube] episodes unavailable", err);
    return [];
  }
}

/** Returns the watch URL of a live broadcast on the channel, if any. */
export async function getYouTubeLive(channelId: string | null): Promise<string | null> {
  if (!channelId || !key) return null;
  try {
    const recent = await fetchPlaylist(`UU${channelId.slice(2)}`, 5, 120);
    const ids = recent.map((r) => r.snippet.resourceId.videoId).join(",");
    if (!ids) return null;
    const res = await fetch(`${API}/videos?part=snippet&id=${ids}&key=${key}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: { id: string; snippet: { liveBroadcastContent: string } }[] };
    const live = data.items?.find((v) => v.snippet.liveBroadcastContent === "live");
    return live ? `https://www.youtube.com/watch?v=${live.id}` : null;
  } catch {
    return null;
  }
}
