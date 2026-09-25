# SEO, AEO & AI Visibility

## One entity, described the same way everywhere
`lib/site.ts → BRAND_DESCRIPTION` is the single sentence-pair that describes Indi Radio. The same text is reused in:
- the footer (plain HTML on every page)
- the `RadioStation` / `WebSite` JSON-LD description
- `/llms.txt`
- the home page's "at a glance" definition list

Always write the name as **Indi Radio** (never "India Radio"); `/llms.txt` states this explicitly for AI engines.

## Pages, titles, descriptions
Defined once in `lib/i18n.ts → PAGES`, in English and Punjabi. Every page has a unique `<title>`, a unique meta description, **exactly one `<h1>`**, a canonical URL, and `hreflang` alternates (`en-CA`, `pa-IN`, `x-default` → English). Verified at handover by crawling all 34 URLs.

| URL | Title (EN) |
|---|---|
| `/en` | Indi Radio – Live Punjabi Radio from Surrey, Canada \| Indi Jaswal |
| `/en/listen-live` | Listen Live – Indi Radio Punjabi Radio Online |
| `/en/schedule` | Show Schedule in Your Time Zone \| Indi Radio |
| `/en/shows` | Shows on Indi Radio \| Punjabi Talk & Music |
| `/en/shows/bhedan-da-kaal` | Bhedan Da Kaal – Live on Indi Radio \| Indi Jaswal |
| `/en/indi-jaswal` | Indi Jaswal – Host & Founder of Indi Radio, Surrey |
| `/en/episodes` | Episodes & Clips \| Indi Radio |
| `/en/call-in` | Call In to Indi Radio – Live Punjabi Call-In Radio |
| `/en/dedications` | Book a Radio Dedication or Shout-Out \| Indi Radio |
| `/en/advertise` | Advertise on Punjabi Radio in Surrey \| Indi Radio |
| `/en/events` | Punjabi Community Events & Live Broadcasts \| Indi Radio |
| `/en/about` | About Indi Radio – Punjabi Radio from Surrey, BC |
| `/en/faq` | Indi Radio FAQ – Listening, Call-Ins & Dedications |
| `/en/contact` | Contact Indi Radio \| Surrey, BC |
| `/en/song-request` | Request a Song or Enter a Contest \| Indi Radio |
| `/en/privacy`, `/en/terms` | Privacy Policy / Terms of Use \| Indi Radio |

Target keywords appear naturally in titles, H1s and body copy: Punjabi radio Surrey, Punjabi radio Canada, Punjabi radio live/online, Punjabi call-in radio, Indi Jaswal, Indi Radio app, and ਪੰਜਾਬੀ ਰੇਡੀਓ on every `/pa` page.

## Structured data (JSON-LD)

| Schema | Where | Builder |
|---|---|---|
| `RadioStation` + `Organization` (one node, `@id …/#station`): name, alternateName (ਇੰਡੀ ਰੇਡੀਓ), telephone, email, Surrey address, areaServed, founder → Indi Jaswal, sameAs (socials + apps), ListenAction | every page (layout) | `stationNode` |
| `WebSite` | every page | `websiteNode` |
| `Person` (Indi Jaswal, `@id …/#indi-jaswal`) inside `ProfilePage` | /indi-jaswal | `personNode` |
| `BreadcrumbList` | every inner page | `breadcrumbNode` (via `PageHeader`) |
| `FAQPage` | /faq | `faqNode` |
| `RadioSeries` | /schedule, /shows/[slug] | `seriesNode` |
| `BroadcastEvent` (next 7 days, **confirmed slots only**) | /schedule, /shows/[slug] | `broadcastNodes` |
| `VideoObject` | /episodes, /shows/[slug] | `videoNode` |
| `Event` (upcoming, with Place + VirtualLocation for live broadcasts) | /events | `eventNode` |
| `ItemList` | /shows | `itemListNode` |
| `Service` + `Offer` | /dedications, /advertise | inline |
| `AboutPage`, `ContactPage` | /about, /contact | inline |

All nodes share stable `@id`s so Google and AI engines merge them into one entity graph. Broadcast events are emitted only for confirmed times, so no unverified schedule is published as structured data.

Validate after launch with the Rich Results Test and the Schema.org validator.

## Crawling & indexing
- **`/robots.txt`** (`app/robots.ts`): allows everything except `/api/` and the private thank-you page. It explicitly welcomes Googlebot, Bingbot, **Google-Extended, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, anthropic-ai, PerplexityBot**, Applebot(-Extended), Amazonbot, DuckAssistBot and Meta-ExternalAgent.
- **`/sitemap.xml`** (`app/sitemap.ts`): both languages, every page and show, with `xhtml:link` hreflang alternates. Refreshed hourly.
- **`/llms.txt`**: plain-text brief for AI assistants: key facts, how to listen, the schedule in station time (flagged when unconfirmed), services, every page with its description, and all FAQ answers. Generated from the CMS, so it never goes stale.
- Language routing: `/` redirects (307) to `/en` or `/pa` based on the visitor's saved choice, then `Accept-Language`. Crawlers without a Punjabi preference land on English.
- 308 redirects from old WordPress URLs are in `next.config.ts` (see launch checklist).

## Key facts in plain HTML (not only in JS)
Who, what, where, when and how to listen appear as server-rendered text:
- home hero sentence and "at a glance" facts
- footer brand description + NAP (name, address, phone)
- the About facts box
- the schedule, which is server-rendered in Vancouver time and then converted in the browser
- FAQ answers (inside `<details>`, present in the HTML)

Nothing essential lives only inside the player or images.

## Social sharing
Every page has Open Graph and Twitter `summary_large_image` tags. Share images come from `/api/og?title=…`, a branded 1200×630 card with the page's English heading.

## Performance (Core Web Vitals)
- Static generation + ISR (5 min, plus instant refresh from the Sanity webhook).
- The only client JavaScript: the player, live widgets, forms, the schedule time-zone switcher and the mobile menu.
- YouTube uses thumbnail facades (no iframe until tapped). The live-status check waits for browser idle.
- Fonts are self-hosted and preloaded. The body font uses `display: optional`, so there is no re-render.
- Lighthouse mobile at handover (local production build): Performance 91–93, Accessibility 100, Best Practices 100, SEO 100, CLS 0, TBT ≤ 100 ms; observed LCP about 0.3 s.

## Analytics events (GA4)
Sent automatically. Links are classified by URL, so no per-link code is needed.

| Event | Fires when |
|---|---|
| `listen_live` | Play is pressed (any player) |
| `call_in_click` | Any `tel:` link |
| `whatsapp_join` | Any WhatsApp link / channel button |
| `app_download` | App Store / Google Play badge |
| `watch_live_click` | Watch Live badge (label: tiktok/youtube) |
| `dedication_checkout` | Dedication form submitted (redirects to Stripe or sends the request) |
| `dedication_booked` | Paid booking confirmed on `/dedications/thank-you` (sends value, CAD, transaction id) |
| `sponsor_inquiry` | Advertise form success |
| `song_request`, `contest_entry` | Song/contest form success |
| `event_booking`, `contact_submit`, `newsletter_signup` | Those forms' success |
| `media_kit_download` | Media kit PDF |

Mark `dedication_booked`, `sponsor_inquiry` and `call_in_click` as **key events (conversions)** in GA4.
