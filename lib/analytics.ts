/**
 * GA4 event helper. Safe to call anywhere on the client: it is a no-op until
 * gtag has loaded (or when GA is not configured).
 *
 * Tracked events: listen_live, call_in_click, app_download, dedication_booked,
 * dedication_checkout, sponsor_inquiry, whatsapp_join, watch_live_click,
 * song_request, newsletter_signup, contact_submit.
 *
 * Server-rendered links can be tracked without client JS by adding
 * data-track="event_name" (plus optional data-track-label) – see
 * components/Analytics.tsx.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  // gtag is stubbed inline by <Analytics/> before gtag.js loads, so events
  // fired early are queued rather than lost.
  if (typeof window.gtag === "function") window.gtag("event", name, params);
}
