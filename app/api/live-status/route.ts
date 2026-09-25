import { NextResponse } from "next/server";
import { getSettings } from "@/lib/cms";
import { getYouTubeLive } from "@/lib/youtube";

export const revalidate = 120;

export async function GET() {
  const settings = await getSettings();
  const youtube = await getYouTubeLive(settings.youtubeChannelId);
  const tiktok = settings.tiktokLiveNow ? settings.tiktokLiveUrl || settings.socials.tiktok : null;
  return NextResponse.json(
    { youtube, tiktok },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" } },
  );
}
