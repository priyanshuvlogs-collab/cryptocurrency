# Launch Checklist

Work top to bottom. Items marked ⚠️ block launch.

## 1. Facts & content from the station
- [ ] ⚠️ Resolve every `[CONFIRM]` item: run `npm run confirm-report` (see `docs/03-content.md` for the grouped list).
- [ ] ⚠️ HTTPS stream URL entered in Site settings (or `NEXT_PUBLIC_STREAM_URL`).
- [ ] ⚠️ Real weekly schedule entered in Vancouver time, with **Time confirmed** ticked.
- [ ] Licensed photos of Indi Jaswal uploaded (Site settings → Photo); sponsor logos; show artwork.
- [ ] A native Punjabi speaker has read every `/pa` page.
- [ ] A lawyer has reviewed `/privacy` and `/terms` (PIPEDA/PIPA, contests, refunds).

## 2. ⚠️ Music licensing (Canada)
Streaming commercial music online in Canada needs licences **before** launch:
- **SOCAN**: covers the public performance of the musical works (composers, lyricists, publishers). Online music services use SOCAN's internet/webcasting tariffs.
- **Re:Sound**: covers the sound recordings (performers and record labels) for webcasting and non-interactive streaming.
- Licensing is also needed for the same audio on the apps, TikTok, YouTube and Facebook. Platform licences do not cover a station's own simulcast stream. Clips posted to social platforms can also be muted or claimed by rights holders.
- Keep playlist/usage logs; both societies require reporting.
- Once licensed, replace `[CONFIRM SOCAN / Re:Sound licence numbers]` in the footer text (`messages/en.ts`, `messages/pa.ts`).

## 3. Accounts & integrations
- [ ] **Vercel**: import the repo, add all env vars (`.env.example`) for Production and Preview, and set `NEXT_PUBLIC_SITE_URL=https://indiradio.ca`.
- [ ] **Sanity**: create the project → set `NEXT_PUBLIC_SANITY_PROJECT_ID`; in `/studio` run `npm i`, `npm run deploy`, then `npm run seed` once. Invite the team as *Editors*.
- [ ] **Sanity webhook**: API → Webhooks → `https://indiradio.ca/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`, on create/update/delete.
- [ ] **Stripe**: live secret key; Webhook → `https://indiradio.ca/api/stripe/webhook`, event `checkout.session.completed` → copy the signing secret to `STRIPE_WEBHOOK_SECRET`. Enable email receipts. Test with a real $1 package, then refund it.
- [ ] **GoHighLevel**: Automation → Workflow → *Inbound Webhook* trigger → paste its URL into `GHL_WEBHOOK_URL`. Map `first_name`, `last_name`, `email`, `phone`, `tags`. Add actions: create/update contact, add tags, internal notification, and for `form:dedication_paid` a **WhatsApp/SMS confirmation** to the customer.
- [ ] **Resend**: verify the `indiradio.ca` domain (DNS records); set `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`.
- [ ] **YouTube**: channel ID in Site settings; Google Cloud API key restricted to *YouTube Data API v3* → `YOUTUBE_API_KEY` (enables live detection).
- [ ] **Upstash Redis** (free tier) → `UPSTASH_REDIS_REST_URL`/`TOKEN` for rate limiting across all servers.
- [ ] **GA4**: create a property → `NEXT_PUBLIC_GA_ID`. Mark `dedication_booked`, `sponsor_inquiry` and `call_in_click` as key events.

## 4. Domain & redirects
- [ ] Point `indiradio.ca` and `www.indiradio.ca` to Vercel. Make the apex primary and redirect `www` to it (Vercel → Domains).
- [ ] Export the **old WordPress sitemap / URL list** (e.g. from Search Console → Pages, or `indiradio.ca/wp-sitemap.xml`) **before switching DNS**.
- [ ] Add any old URL not already covered to `redirects()` in `next.config.ts`. Already mapped (301/308):

| Old | New |
|---|---|
| `/radio`, `/listen`, `/live` | `/en/listen-live` |
| `/contact-us`, `/Contact`, `/contact-classic` | `/en/contact` |
| `/about-us` | `/en/about` |
| `/services-standard`, `/services` | `/en/advertise` |
| `/help` | `/en/faq` |
| `/category/*`, `/blog/*`, `/feed` | `/en/episodes` |
| `/shop/*` | `/en/dedications` |
| any other path, e.g. `/schedule` | `/en/schedule` or `/pa/schedule` (language routing) |

- [ ] After switching, spot-check the old URLs with `curl -I`.

## 5. Google
- [ ] **Search Console**: add a *Domain* property (DNS TXT), or the URL-prefix method with `NEXT_PUBLIC_GSC_VERIFICATION`.
- [ ] Submit `https://indiradio.ca/sitemap.xml`.
- [ ] URL Inspection → *Request indexing* for `/en`, `/pa`, `/en/listen-live`, `/en/schedule`, `/en/shows/bhedan-da-kaal`.
- [ ] Check *Enhancements* for FAQ, Breadcrumbs, Events and Videos after a few days. Run the Rich Results Test on `/en/faq`, `/en/events`, `/en/schedule`.
- [ ] **Google Business Profile**: category *Radio station*; website `https://indiradio.ca/en`; phone = call-in number; service area Surrey/BC (hide the address unless the studio accepts visitors); add the "Listen live" link, hours of live shows, photos of Indi, and a link to the app. Keep the name exactly **Indi Radio**.
- [ ] Bing Webmaster Tools: import from Search Console.

## 6. Apps & social
- [ ] ⚠️ One official App Store link and one official Google Play link in Site settings. **Update the website link inside both store listings** to `https://indiradio.ca/en`.
- [ ] Confirm the Apple app id in `app/[locale]/layout.tsx` (`itunes.appId`, which shows the Smart App Banner on iPhone).
- [ ] Update the website link on TikTok, YouTube, Facebook, Instagram and the WhatsApp channel bios (use `/en` or `/pa` as appropriate).
- [ ] Add every official profile URL in Site settings; they feed the structured data `sameAs`.

## 7. Acceptance tests (on real devices)
- [ ] **iPhone Safari**: tap Listen Live → audio plays → navigate 3+ pages → still playing → lock the screen → the lock-screen controls pause and resume.
- [ ] **Android Chrome**: same test, plus the notification controls.
- [ ] Schedule shows the correct local times with the Vancouver, India, UK and Australia chips. Also test from a phone set to IST.
- [ ] A paid dedication reaches the staff email, GoHighLevel and the customer email; the WhatsApp confirm button opens with the order number pre-filled.
- [ ] A sponsor inquiry reaches email + GoHighLevel.
- [ ] Every form: submit with an empty required field → inline error; a real submission succeeds.
- [ ] The TikTok live switch shows and hides the Watch Live badge.
- [ ] Lighthouse (mobile) on the production URL: Performance 90+, SEO 95+, Accessibility 95+.
- [ ] `https://indiradio.ca/robots.txt`, `/sitemap.xml` and `/llms.txt` load and show the real facts.
- [ ] Security headers score A on securityheaders.com.

## 8. After launch
- [ ] Watch Search Console coverage and 404s weekly for the first month; add redirects for any old URLs that are still getting hits.
- [ ] Upload captions to YouTube episodes (accessibility + search).
- [ ] Review GA4 key events monthly: listen_live, call-ins, dedications, sponsor leads.
