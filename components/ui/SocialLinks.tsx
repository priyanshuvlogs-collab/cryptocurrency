import type { SiteSettings } from "@/lib/types";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon, YouTubeIcon } from "./Icons";

export function SocialLinks({ settings, className = "" }: { settings: SiteSettings; className?: string }) {
  const links = [
    { url: settings.socials.tiktok, label: "Indi Radio on TikTok", Icon: TikTokIcon },
    { url: settings.socials.youtube, label: "Indi Radio on YouTube", Icon: YouTubeIcon },
    { url: settings.socials.facebook, label: "Indi Radio on Facebook", Icon: FacebookIcon },
    { url: settings.socials.instagram, label: "Indi Radio on Instagram", Icon: InstagramIcon },
    { url: settings.whatsappChannelUrl, label: "Indi Radio WhatsApp channel", Icon: WhatsAppIcon },
  ].filter((l): l is { url: string; label: string; Icon: typeof TikTokIcon } => Boolean(l.url));

  if (!links.length) {
    // [CONFIRM] social profile URLs in the CMS (Site settings → Social profiles)
    return <p className={`text-sm text-muted ${className}`}>TikTok · YouTube · Facebook · Instagram [CONFIRM links]</p>;
  }
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {links.map(({ url, label, Icon }) => (
        <li key={url}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={label}
            className="grid size-11 place-items-center rounded-full border border-line hover:border-fg hover:text-accent"
          >
            <Icon size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
