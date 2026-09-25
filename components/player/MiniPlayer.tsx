"use client";

import { usePathname } from "next/navigation";
import { usePlayer } from "./AudioProvider";
import { useLiveState } from "./ScheduleProvider";
import { PlayButton, VolumeControl } from "./PlayerControls";
import { useLocale } from "@/components/LocaleProvider";
import { t } from "@/lib/site";

/**
 * Sticky bottom player. Always visible on phones (thumb reach); on larger
 * screens it appears once the visitor has started listening. Hidden on the
 * Listen Live page, which already has the full player.
 */
export function MiniPlayer() {
  const { status } = usePlayer();
  const live = useLiveState();
  const { locale, m } = useLocale();
  const pathname = usePathname();
  const onListenPage = pathname?.endsWith("/listen-live");
  const started = status !== "idle";

  if (onListenPage) return null;

  const title = live?.current ? t(live.current.title, locale) : m.player.betweenShows;
  const isLive = status === "playing";

  return (
    <aside
      aria-label={m.player.miniPlayer}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:inset-x-auto md:right-4 md:bottom-4 md:w-[380px] md:rounded-2xl md:border md:shadow-2xl ${
        started ? "" : "md:hidden"
      }`}
    >
      <div className="flex h-[72px] items-center gap-3 px-3">
        <PlayButton variant="mini" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-live uppercase">
            <span className={isLive ? "onair-dot" : "size-2.5 rounded-full bg-live"} aria-hidden="true" />
            {m.player.live} · Indi Radio
          </p>
          <p className="truncate font-semibold">{title}</p>
        </div>
        <VolumeControl />
      </div>
    </aside>
  );
}
