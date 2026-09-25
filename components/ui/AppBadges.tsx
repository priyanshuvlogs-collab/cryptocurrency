import type { Messages } from "@/messages/en";
import { AppleIcon, GooglePlayIcon } from "./Icons";

/**
 * Store buttons. [CONFIRM] Before launch, swap in the official badge artwork
 * from Apple (developer.apple.com/app-store/marketing/guidelines) and Google
 * (play.google.com/intl/en_us/badges) if the brand team prefers them.
 */
export function AppBadges({
  appStoreUrl,
  playStoreUrl,
  m,
  className = "",
}: {
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  m: Messages;
  className?: string;
}) {
  const badge =
    "inline-flex min-h-14 items-center gap-3 rounded-xl border border-line bg-black px-4 py-2 text-left text-white hover:border-fg";
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {appStoreUrl ? (
        <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" data-track="app_download" data-track-label="ios" className={badge}>
          <AppleIcon size={28} />
          <span className="leading-tight">
            <span className="block text-[0.7rem]">{m.apps.appStoreLine}</span>
            <span className="block text-lg font-semibold">App Store</span>
          </span>
        </a>
      ) : null}
      {playStoreUrl ? (
        <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" data-track="app_download" data-track-label="android" className={badge}>
          <GooglePlayIcon size={26} />
          <span className="leading-tight">
            <span className="block text-[0.7rem]">{m.apps.googlePlayLine}</span>
            <span className="block text-lg font-semibold">Google Play</span>
          </span>
        </a>
      ) : null}
    </div>
  );
}
