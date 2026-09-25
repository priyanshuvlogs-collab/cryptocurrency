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
      className={`band-ink fixed inset-x-0 bottom-0 z-40 border-t-2 border-marigold pb-[env(safe-area-inset-bottom)] md:inset-x-auto md:right-5 md:bottom-5 md:w-[400px] md:rounded-md md:border-2 md:shadow-[6px_6px_0_var(--marigold)] ${
        started ? "" : "md:hidden"
      } ${isLive ? "is-playing" : ""}`}
    >
      <div className="flex h-[72px] items-center gap-3 px-3">
        <span
          aria-hidden="true"
          className="disc-spin phulkari-fill relative size-11 shrink-0 rounded-full ring-[5px] ring-black"
        >
          <span className="absolute inset-[38%] rounded-full bg-ink" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="meta flex items-center gap-2 font-extrabold text-marigold">
            <span className={isLive ? "onair-dot" : "size-2 rounded-full bg-live"} aria-hidden="true" />
            {m.player.live} · Indi Radio
          </p>
          <p className="truncate font-display text-xl leading-tight font-extrabold uppercase">{title}</p>
        </div>
        <PlayButton variant="mini" />
        <VolumeControl />
      </div>
    </aside>
  );
}
