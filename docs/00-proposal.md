# Indi Radio: Redesign Proposal (Phase 0, for approval)

Status: **Approved and built.** Where the build differs from this proposal:
- **Next.js 16** (current stable) instead of 15. Middleware is now `proxy.ts`.
- **Sanity Studio is a standalone app** (`/studio`, deployed to indiradio.sanity.studio) instead of being embedded at `/studio`. This keeps the public site's JavaScript small.
- **Waveform** is a CSS animation, not Web Audio. Web Audio silences cross-origin streams without CORS and can break iPhone lock-screen playback (see `docs/02-design-system.md`).
- Two colours were darkened to pass WCAG AA (see the design system doc).
- Decisions taken from recommended defaults: **Stripe** for payments, **Sydney** for Australia, **GoHighLevel** for the newsletter list.
Items marked **[CONFIRM]** are facts Indi Radio needs to supply or verify. They will not be invented.

---

## 1. Sitemap

Every page exists twice: once at `/en/...` and once at `/pa/...` (Gurmukhi). Each pair is linked with `hreflang`, and `x-default` points to `/en/`. A request to bare `/` redirects by `Accept-Language`, and a cookie remembers the visitor's manual choice.

| # | Route | H1 (EN) | Primary job | Key schema |
|---|---|---|---|---|
| 1 | `/` | Live Punjabi Radio from Surrey, Canada | Start listening in one tap | RadioStation, Organization, WebSite |
| 2 | `/listen-live` | Listen to Indi Radio Live | Full player + every way to listen | RadioStation, BreadcrumbList |
| 3 | `/schedule` | Indi Radio Weekly Schedule | Timetable in the listener's own time zone | BroadcastEvent (per slot) |
| 4 | `/shows` | Shows on Indi Radio | Show directory | ItemList |
| 5 | `/shows/[slug]` | e.g. Bhedan Da Kaal | Show description, times, clips | RadioSeries, BroadcastEvent, VideoObject |
| 6 | `/indi-jaswal` | Indi Jaswal: Host & Founder | Biography, press, event/MC booking | Person, ProfilePage |
| 7 | `/episodes` | Episodes & Clips | Searchable archive, filter by show | ItemList, VideoObject |
| 8 | `/call-in` | Call In to Indi Radio | Number, WhatsApp, on-air rules | RadioStation (ContactPoint) |
| 9 | `/dedications` | Book a Dedication or Shout-Out | Tiered booking + payment | Service, Offer |
| 10 | `/advertise` | Advertise on Punjabi Radio in Surrey | Audience stats, packages, media kit, lead form | Service, Offer |
| 11 | `/events` | Community Events & Live Broadcasts | Melas, live remotes | Event |
| 12 | `/about` | About Indi Radio | Station story (400–600 words) | AboutPage, Organization |
| 13 | `/faq` | Indi Radio FAQ | 12+ AEO answers, 40–60 words each | FAQPage |
| 14 | `/contact` | Contact Indi Radio | Contact form + all channels | ContactPage |
| 15 | `/privacy` | Privacy Policy | PIPEDA-compliant | WebPage |
| 16 | `/terms` | Terms of Use | Includes dedication/contest terms | WebPage |
| — | `/song-request` (plus contests) | Request a Song | Song request + contest entry | — |
| — | `/studio` | (Sanity Studio, noindex) | Admin CMS | — |
| — | `/llms.txt`, `/robots.txt`, `/sitemap.xml` | | Crawlers and AI engines | — |

### Wireframes (mobile-first, top to bottom)

**Home**
1. Header: logo, language toggle (EN | ਪੰ), theme toggle, menu. A red "LIVE" pill in the header whenever the stream is on air.
2. **Hero / live player.** A cut-out host photo sits over a phulkari-pattern backdrop. Around it: a pulsing ON AIR badge, the current show name and host (from the schedule), an animated waveform, and two large buttons, `▶ Listen Live` and `📞 Call In`. Below them, one plain-text line: *"Indi Radio is a live Punjabi radio station from Surrey, BC, hosted by Indi Jaswal."*
3. Up Next strip: next show name + live countdown ("starts in 02:14:09") + the time in the visitor's zone.
4. Watch Live banner. It appears only when TikTok or YouTube reports a live stream and deep-links to it.
5. Latest clips: 4–6 YouTube cards. Each card is a lightweight facade, and the iframe loads only on tap.
6. Dedications CTA: three tier cards (Birthday / Anniversary / Business) + "Book now".
7. Sponsors strip: logo marquee from the CMS. It pauses on hover and stops under reduced motion.
8. App download: App Store + Google Play badges, one official app each.
9. Join the family: WhatsApp channel button + email newsletter form.
10. Social strip: latest TikTok / Instagram / YouTube posts.
11. Footer: NAP (name, address, phone), socials, apps, legal links, SOCAN/Re:Sound notice.
12. **Sticky mini-player** at the bottom on mobile (play/pause, show name, live dot). It persists across routes.

**Listen Live**: full-size player, stream quality info, and a "Ways to listen" grid (Web, iOS app, Android app, Alexa/TuneIn **[CONFIRM TuneIn listing]**, TikTok LIVE, YouTube, Facebook). Troubleshooting FAQ excerpt.

**Schedule**: timezone chips (My time · Vancouver · India IST · UK · Australia **[CONFIRM: Sydney or Melbourne/Perth?]**). Day tabs Mon–Sun with today selected. Each slot is a card showing time, show and host, and the slot on air right now is highlighted. Days that shift across midnight are handled correctly. An .ics "Add to calendar" link is included.

**Show detail**: hero (show art, Punjabi + English name), times in local zone, host, description, latest clips filtered to the show, call-in CTA, related shows.

**Indi Jaswal**: portrait, bio, a story timeline, photo gallery, press mentions, an event/MC booking form, and social links.

**Episodes**: search input, show filter chips, grid of video facades, "Load more". Fed by the YouTube Data API (with a playlist-per-show mapping) or channel RSS as a no-key fallback. Cached with ISR, revalidated every 30 minutes.

**Call-In**: very large tap-to-call number, WhatsApp button, on-air hours, the family-friendly language standard, and what to expect when calling.

**Dedications**: occasion picker (birthday, anniversary, wedding, festival, business opening), then tier (**[CONFIRM prices]**), then details (names, message in EN/PA, preferred date/show), then payment via Stripe Checkout. The confirmation screen includes a WhatsApp deep link with the order number pre-filled. An email goes to the station and the customer, and the lead goes to the GoHighLevel webhook.

**Advertise**: audience stats (**[CONFIRM all numbers]**), package cards, a media kit PDF download (CMS file), and an inquiry form that sends to email + GoHighLevel.

**Events**: upcoming event cards (date in local zone, venue, map link, "we're broadcasting live" tag) and a past events archive.

**About / FAQ / Contact / Privacy / Terms**: text-first reading layout with a max width of about 68ch and an in-page table of contents on FAQ.

---

## 2. Design direction: "Phulkari Night"

It should read like a Punjabi wedding lit up at night: deep ink backgrounds with saturated embroidery colours that glow. The look avoids generic radio-template gradients, and the colours are used boldly.

### Colour tokens

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--bg` | `#12090F` (aubergine-black) | `#FFF8EF` (warm cream) | Page background |
| `--surface` | `#1E1119` | `#FFFFFF` | Cards |
| `--surface-2` | `#2A1822` | `#F8EBDD` | Raised / hover |
| `--text` | `#FBEFE3` | `#221018` | Body text |
| `--text-muted` | `#C9B3A8` | `#6B4F52` | Secondary |
| `--saffron` | `#FF9F1C` | `#C25E00` | Primary CTA (Listen Live) |
| `--red` | `#E0263A` | `#B3122A` | LIVE / on-air, Call In |
| `--gold` | `#F5C542` | `#8A6400` | Highlights, dividers, stars |
| `--magenta` | `#E0348F` | `#A3125F` | Accents, links, active chips |
| `--green` | `#2BB673` | `#11794A` | WhatsApp, success |
| `--border` | `#3A2530` | `#E7D3C3` | Hairlines |

Every text/background pair will be verified at ≥ 4.5:1 (≥ 3:1 for large text/UI). The light-mode accent values were darkened specifically to pass on cream. The default follows `prefers-color-scheme`, a manual toggle overrides it, and the choice is persisted.

A **phulkari motif** (a geometric bagh diamond lattice) runs as a CSS/SVG pattern at 6–10% opacity behind the hero and section dividers. It is inline SVG with no image requests.

### Typography

- **Display (Latin):** *Anybody* (variable width, 700–900, condensed): loud, poster-like, radio-sign energy.
- **Gurmukhi:** *Mukta Mahee* for headings (built for Gurmukhi, strong at heavy weights), *Noto Sans Gurmukhi* for body.
- **Body (Latin):** *Inter Tight* (or *Hanken Grotesk*).
- All fonts are loaded through `next/font` (self-hosted, subset, `display: swap`, size-adjusted fallbacks to avoid CLS).
- The `lang="pa"` pages switch the font stack and add about 10% line-height for Gurmukhi matras.

**Type scale** (fluid `clamp()`): 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64–88 (hero).

### Motion
- ON AIR dot: a slow 1.6s pulse ring.
- Waveform: 24 bars driven by a Web Audio `AnalyserNode` when playing, with an idle "breathing" loop when paused.
- Section reveal: 12px rise + fade via `IntersectionObserver`.
- Under `prefers-reduced-motion` every animation becomes static, including the waveform bars, which sit at fixed heights.

### Shape and layout
Radii run 14px on cards and are full pills on buttons. Tap targets are at least 48px. Content max width is 1200px, with an 8pt spacing grid. The bottom mini-player is 64px tall, and the page reserves padding for it so nothing is covered.

---

## 3. Component list

**Global shell**
- `AudioProvider`: a single `<audio>` element mounted in the root layout. It never unmounts on navigation, so playback continues. It uses the MediaSession API for lock-screen controls on iOS/Android and handles stall/reconnect with backoff.
- `SiteHeader`, `MobileNav` (sheet), `LanguageToggle` (keeps the equivalent page), `ThemeToggle`
- `MiniPlayer` (sticky, mobile), `SiteFooter`, `AnnouncementBar` (CMS-driven, dismissible)

**Live and schedule**
- `LivePlayerHero`, `PlayButton`, `Waveform`, `OnAirBadge`
- `NowPlaying` (current slot from schedule + CMS override "special broadcast")
- `NextShowCountdown`
- `WatchLiveBadge`: polls `/api/live-status`, which checks YouTube `eventType=live` and a CMS "TikTok live now" switch. The TikTok switch is manual because TikTok has no public live API.
- `ScheduleGrid`, `TimezoneSwitcher`, `ShowCard`, `AddToCalendar`

**Content**
- `VideoFacade` (thumbnail + play button, iframe on click, `youtube-nocookie`)
- `EpisodeGrid`, `EpisodeSearch`, `ShowFilter`
- `SponsorMarquee`, `EventCard`, `FaqAccordion` (native `<details>`)
- `AppBadges`, `SocialStrip`, `HostBio`, `PressList`, `Breadcrumbs`

**Forms** (all use a Zod-validated server action, honeypot field, per-IP rate limit via Upstash, and a Turnstile fallback)
- `DedicationForm` → Stripe Checkout → webhook → email (Resend) + GoHighLevel + WhatsApp link
- `SponsorInquiryForm` → email + GoHighLevel
- `SongRequestForm`, `ContestEntryForm`, `EventBookingForm`, `ContactForm`
- `NewsletterSignup` (GoHighLevel list, or Mailchimp **[CONFIRM provider]**), `WhatsAppJoin`

**SEO / AEO utilities**
- `JsonLd` component + typed builders (RadioStation, Person, FAQPage, Event, BroadcastEvent, VideoObject, Organization, BreadcrumbList)
- `generateMetadata` per route (title, description, canonical, hreflang, OG/Twitter)
- Dynamic OG images via `next/og` (branded card per page/show/episode)
- `sitemap.ts` (both locales, with alternates), `robots.ts`, `/llms.txt` route
- `trackEvent()` wrapper for GA4 events: `listen_live`, `call_in_click`, `app_download`, `dedication_booked`, `sponsor_inquiry`, `whatsapp_join`, `watch_live_click`, `song_request`

**Sanity CMS schemas**
`siteSettings` (stream URL, phone, WhatsApp, app links, socials, TikTok-live switch), `show`, `scheduleSlot` (day, start, end in America/Vancouver, show ref), `specialBroadcast` (date-specific override), `episode` (manual extras beyond YouTube), `sponsor`, `event`, `faq`, `announcement`, `dedicationTier`, `adPackage`, `pressItem`, `page` (About/Privacy/Terms rich text). Every text field has `en` + `pa` values.

---

## 4. Stack and architecture

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**, deployed on **Vercel**
- **Sanity v3**, with Studio embedded at `/studio` and the free tier sufficient. The schedule is stored in Vancouver time and converted client-side with `Intl.DateTimeFormat`, so DST is handled correctly in both BC and the listener's zone.
- Pages are statically generated with ISR, and Sanity webhooks revalidate them on publish. Player, countdown and live badge are small client islands, and everything else is server-rendered HTML. This keeps LCP and INP well inside budget and means all key facts are plain HTML text.
- `middleware.ts`: locale routing and security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- If Indi Radio stays on WordPress, the same component list maps 1:1 to a block theme. The fallback will be documented but not built unless requested.

---

## 5. [CONFIRM] list needed from Indi Radio before launch

1. Call-in number: 778-834-0325?
2. Stream URL (Icecast/Shoutcast/HLS, and whether HTTPS). Required for the iOS Safari player.
3. Official App Store and Google Play links (one app each).
4. Official social URLs: TikTok, YouTube, Facebook, Instagram, WhatsApp channel.
5. YouTube channel ID + whether each show has its own playlist.
6. Full weekly schedule: show names, days, start/end times (Vancouver time).
7. Bhedan Da Kaal: air days/times and a one-paragraph description in Indi's words.
8. Mailing address for schema/NAP (or service-area-only if Indi prefers not to publish one).
9. Dedication tiers and prices (CAD), plus any turnaround rules.
10. Advertising packages, prices, and audience figures (listeners, app installs, social followers).
11. Payment provider preference: Stripe (recommended) or PayPal.
12. GoHighLevel inbound webhook URL; recipient email address(es).
13. Host photos (hi-res, with rights), logo files (SVG preferred), sponsor logos.
14. Indi Jaswal biography facts: background, year station started, press/awards.
15. Old site URL list, so 301 redirects can be mapped.
16. SOCAN and Re:Sound licence status (compliance note for the handover docs).

---

## 6. Build order after approval

1. Scaffold: Next.js, Tailwind tokens, fonts, i18n routing, layout shell, persistent `AudioProvider` + mini-player
2. Sanity schemas + seed data (with [CONFIRM] placeholders)
3. Home, Listen Live
4. Schedule + Shows + Bhedan Da Kaal page
5. Episodes (YouTube integration) + live-status API
6. Dedications (Stripe) + Advertise + all other forms, GoHighLevel/email delivery
7. Indi Jaswal, Call-In, Events, About, FAQ, Contact, Privacy, Terms (EN + PA copy)
8. SEO/AEO layer: JSON-LD, sitemap, robots, llms.txt, OG images
9. Accessibility + Lighthouse pass, then admin guide + launch checklist
