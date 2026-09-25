"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "@/components/LocaleProvider";
import { CloseIcon } from "@/components/ui/Icons";

/**
 * GA4 + automatic event tracking.
 *
 * Any click on an element with data-track="event" is sent to GA4. Links are
 * also classified automatically, so no per-link code is needed:
 *   tel:            → call_in_click
 *   wa.me / whatsapp→ whatsapp_join
 *   App Store/Play  → app_download
 */
export function Analytics({ gaId }: { gaId?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track], a[href]");
      if (!el) return;
      const explicit = el.dataset.track;
      const href = el.getAttribute("href") || "";
      const name =
        explicit ||
        (href.startsWith("tel:")
          ? "call_in_click"
          : /wa\.me|whatsapp\.com/.test(href)
            ? "whatsapp_join"
            : /apps\.apple\.com|play\.google\.com/.test(href)
              ? "app_download"
              : null);
      if (name) trackEvent(name, { label: el.dataset.trackLabel, link_url: href || undefined, page: location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Page views on client-side navigation.
  useEffect(() => {
    if (gaId && typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: pathname, page_location: location.href });
    }
  }, [gaId, pathname]);

  if (!gaId) return null;
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false,anonymize_ip:true});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
    </>
  );
}

/** Adds .is-visible to .reveal elements as they scroll into view. */
export function RevealOnScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

/**
 * Dismiss button for the server-rendered announcement bar. The bar itself is
 * in the HTML from the start (no layout shift); a tiny inline script hides a
 * previously dismissed announcement before first paint.
 */
export function DismissAnnouncement({ id }: { id: string }) {
  const { m } = useLocale();
  return (
    <button
      type="button"
      aria-label={m.announcement.dismiss}
      className="grid size-10 place-items-center rounded-full hover:bg-black/10"
      onClick={(e) => {
        (e.currentTarget.closest("[data-announcement]") as HTMLElement | null)?.setAttribute("hidden", "");
        try {
          const list = JSON.parse(localStorage.getItem("ir-dismissed") || "[]");
          localStorage.setItem("ir-dismissed", JSON.stringify([...list, id]));
        } catch {}
      }}
    >
      <CloseIcon size={18} />
    </button>
  );
}
