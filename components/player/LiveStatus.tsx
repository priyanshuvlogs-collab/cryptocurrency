"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { TikTokIcon, YouTubeIcon } from "@/components/ui/Icons";

/**
 * Polls /api/live-status (YouTube live detection + the CMS TikTok switch)
 * every 2 minutes while the tab is visible.
 */

interface LiveStatus {
  youtube: string | null;
  tiktok: string | null;
}

const LiveStatusContext = createContext<LiveStatus>({ youtube: null, tiktok: null });
export const useLiveStatus = () => useContext(LiveStatusContext);

export function LiveStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<LiveStatus>({ youtube: null, tiktok: null });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/live-status", { cache: "no-store" });
        if (res.ok && !cancelled) setStatus(await res.json());
      } catch {}
    };
    // Wait until the page is idle so this never competes with LCP.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000));
    idle(() => void load());
    const timer = setInterval(load, 120_000);
    document.addEventListener("visibilitychange", load);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  return <LiveStatusContext.Provider value={status}>{children}</LiveStatusContext.Provider>;
}

/** Floating "Watch Live" pill – fixed position, so it never shifts layout. */
export function WatchLiveBadge() {
  const { youtube, tiktok } = useLiveStatus();
  const { m } = useLocale();
  const url = tiktok || youtube;
  if (!url) return null;
  const platform = tiktok ? "tiktok" : "youtube";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-track="watch_live_click"
      data-track-label={platform}
      className="fixed top-[76px] left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-live px-4 py-2.5 text-sm font-extrabold text-on-live shadow-xl"
    >
      <span className="onair-dot bg-white!" aria-hidden="true" />
      {platform === "tiktok" ? <TikTokIcon size={18} /> : <YouTubeIcon size={18} />}
      <span>
        {platform === "tiktok" ? m.cta.liveOnTikTok : m.cta.liveOnYouTube} · {m.cta.watchLive}
      </span>
    </a>
  );
}

/** Inline version for the Listen Live page. */
export function WatchLiveInline() {
  const { youtube, tiktok } = useLiveStatus();
  const { m } = useLocale();
  if (!youtube && !tiktok) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {tiktok ? (
        <a href={tiktok} target="_blank" rel="noopener noreferrer" data-track="watch_live_click" data-track-label="tiktok" className="btn btn-live">
          <TikTokIcon /> {m.cta.liveOnTikTok}
        </a>
      ) : null}
      {youtube ? (
        <a href={youtube} target="_blank" rel="noopener noreferrer" data-track="watch_live_click" data-track-label="youtube" className="btn btn-live">
          <YouTubeIcon /> {m.cta.liveOnYouTube}
        </a>
      ) : null}
    </div>
  );
}
