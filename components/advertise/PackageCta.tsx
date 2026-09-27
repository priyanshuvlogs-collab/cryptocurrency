"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * "Get a quote for {package}" – opens the Get pricing page with the package
 * pre-selected (?package={slug}). Client-side navigation keeps the live radio
 * playing; without JS it is a normal link the form reads on load.
 */
export function PackageCta({ href, slug, label, className }: { href: string; slug: string; label: string; className: string }) {
  return (
    <Link href={`${href}?package=${encodeURIComponent(slug)}`} className={className} onClick={() => trackEvent("ad_package_cta", { package: slug })}>
      {label}
    </Link>
  );
}
