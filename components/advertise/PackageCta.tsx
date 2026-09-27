"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * "Get a quote for {package}" – links to ?package={slug}#inquiry. With JS it
 * updates the URL in place, tells the inquiry form which package to
 * pre-select, and scrolls to the form (no page reload, so the live radio
 * keeps playing). Without JS it is a normal link the form reads on load.
 */
export function PackageCta({ slug, label, className }: { slug: string; label: string; className: string }) {
  const href = `?package=${encodeURIComponent(slug)}#inquiry`;
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        trackEvent("ad_package_cta", { package: slug });
        window.history.pushState(null, "", href);
        window.dispatchEvent(new CustomEvent("ir:package", { detail: slug }));
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("inquiry")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }}
    >
      {label}
    </a>
  );
}
