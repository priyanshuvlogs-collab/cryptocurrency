"use client";

import { useLocale } from "@/components/LocaleProvider";
import { TIMEZONE_PRESETS, formatTime } from "@/lib/time";
import { t } from "@/lib/site";
import { useNow } from "./ScheduleProvider";

/** Live clocks for the cities where Indi Radio's listeners are. */
export function WorldClocks() {
  const { locale } = useLocale();
  const now = useNow();
  const zones = TIMEZONE_PRESETS.filter((z) => z.tz);
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
      {zones.map((z) => (
        <li key={z.id} className="border-t border-line pt-2">
          <p className="meta text-muted">{t(z.label, locale).replace(/ \(.*\)/, "")}</p>
          <p className="font-display text-3xl leading-none font-extrabold tabular-nums" suppressHydrationWarning>
            {now ? formatTime(new Date(now), z.tz!, locale) : "--:--"}
          </p>
        </li>
      ))}
    </ul>
  );
}
