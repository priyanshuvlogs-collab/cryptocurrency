"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Mobile-only bar with "Get pricing" and "WhatsApp", sitting just above the
 * live mini-player (safe-area aware). Hidden while the inquiry form is on
 * screen. Adds page padding so it never covers the footer.
 */
export function StickyCtaBar({ pricingLabel, whatsappLabel, whatsappHref }: { pricingLabel: string; whatsappLabel: string; whatsappHref: string }) {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("has-ad-bar");
    const target = document.getElementById("inquiry");
    let io: IntersectionObserver | null = null;
    if (target && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.05 });
      io.observe(target);
    }
    return () => {
      document.body.classList.remove("has-ad-bar");
      io?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-[calc(74px+env(safe-area-inset-bottom))] z-40 border-t border-line bg-bg/95 px-3 py-2 backdrop-blur-md transition-transform md:hidden ${
        formVisible ? "pointer-events-none translate-y-[calc(100%+80px+env(safe-area-inset-bottom))]" : ""
      }`}
      aria-hidden={formVisible || undefined}
    >
      <div className="grid grid-cols-2 gap-2">
        <a href="#inquiry" tabIndex={formVisible ? -1 : undefined} className="btn btn-primary min-h-12!">
          {pricingLabel}
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={formVisible ? -1 : undefined}
          data-track="whatsapp_join"
          data-track-label="advertise_sticky"
          className="btn btn-whatsapp min-h-12!"
        >
          <WhatsAppIcon size={20} /> {whatsappLabel}
        </a>
      </div>
    </div>
  );
}
