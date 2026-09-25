"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Fires one GA4 event when a page is shown (e.g. a confirmed booking). */
export function TrackOnMount({ event, params }: { event: string; params?: Record<string, string | number> }) {
  useEffect(() => {
    trackEvent(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
