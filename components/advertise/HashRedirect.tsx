"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";

/**
 * Sends old in-page links (e.g. /advertise#inquiry or ?package=…#inquiry)
 * to the page that now holds that section, keeping the query string.
 * The hash never reaches the server, so this has to run in the browser.
 */
export function HashRedirect({ map }: { map: Record<string, string> }) {
  const router = useRouter();
  const { locale } = useLocale();
  useEffect(() => {
    const target = map[window.location.hash.slice(1)];
    if (target) router.replace(`/${locale}${target}${window.location.search}`);
  }, [map, router, locale]);
  return null;
}
