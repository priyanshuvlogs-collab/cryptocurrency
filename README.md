# Indi Radio – indiradio.ca

Live Punjabi radio from Surrey, BC, hosted by Indi Jaswal. This repository is the complete rebuild of **indiradio.ca**. It is bilingual (English `/en` and Punjabi `/pa`), mobile-first, and built for Google, AI answer engines and voice search.

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Turbopack) + TypeScript |
| Styling | Tailwind CSS v4, design tokens in `app/globals.css` |
| CMS | Sanity (standalone Studio in `/studio`); the site falls back to built-in content when the CMS is not connected |
| Hosting | Vercel |
| Payments | Stripe Checkout (REST, no SDK) |
| Leads | GoHighLevel inbound webhook + email via Resend |
| Analytics | GA4 with automatic event tracking |

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you have – everything is optional locally
npm run dev                  # http://localhost:3000 → redirects to /en or /pa
```

| Script | What it does |
|---|---|
| `npm run dev` | Local development |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | TypeScript check |
| `npm test` | Time-zone and schedule unit tests (`tests/`) |
| `npm run confirm-report` | Lists every `[CONFIRM]` item still waiting on the station |
| `node scripts/generate-icons.mjs` | Regenerates PNG icons from `public/favicon.svg` |

## What's where

```
app/
  [locale]/            every page, once per language (en, pa)
    layout.tsx         root layout: fonts, persistent audio player, header/footer, JSON-LD
    page.tsx           home
    listen-live/ schedule/ shows/[slug]/ indi-jaswal/ episodes/ call-in/
    dedications/(thank-you) advertise/ events/ about/ faq/ contact/
    song-request/ privacy/ terms/
  api/
    live-status/       YouTube live detection + CMS TikTok switch (Watch Live badge)
    ics/               "Add to calendar" for any schedule slot
    og/                branded share images for every page
    stripe/webhook/    paid dedication → email + CRM + customer confirmation
    revalidate/        Sanity publish webhook → instant refresh
  actions.ts           server actions for every form (validation, spam checks, delivery)
  sitemap.ts robots.ts manifest.ts llms.txt/
components/
  player/              AudioProvider (single <audio>, survives navigation), controls, mini-player, live widgets
  layout/ sections/ forms/ ui/
content/
  seed.ts              shows, schedule, FAQ, packages (used when the CMS is empty/not connected)
  legal.ts             privacy policy + terms (EN/PA)
lib/
  time.ts              time-zone maths (DST-safe), tested in tests/time.test.ts
  cms.ts               all CMS queries (Sanity → seed fallback)
  jsonld.ts seo.ts     structured data + metadata builders
  youtube.ts episodes.ts stripe.ts forms/ analytics.ts i18n.ts site.ts
messages/              UI strings, en.ts + pa.ts
studio/                Sanity Studio + schemas (separate npm project)
docs/                  proposal, design system, SEO/AEO, admin guide, launch checklist
proxy.ts               language routing (/, /schedule → /en/... or /pa/...)
next.config.ts         security headers (CSP, HSTS…), image domains, 301s from the old site
```

## Configuration

All settings are environment variables (see `.env.example`). Each integration is optional. When one isn't configured, the site degrades gracefully instead of breaking.

| Variable | Needed for |
|---|---|
| `NEXT_PUBLIC_STREAM_URL` | Live player. **Must be HTTPS** (iPhone). Can also be set in the CMS. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET` | CMS content + instant publish |
| `YOUTUBE_CHANNEL_ID` (or CMS), `YOUTUBE_API_KEY` | Episode archive (RSS works without a key); live detection needs the key |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Paid dedications |
| `GHL_WEBHOOK_URL` | Every form → GoHighLevel |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` | Every form → staff inbox, customer confirmations |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting shared across all servers |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` | Analytics, Search Console |

In production a form reports success only if **at least one** delivery channel (email or CRM) accepted it. With no channel configured it shows an error rather than silently dropping leads.

## Deploying

1. Import the repo into Vercel (framework preset: Next.js).
2. Add the environment variables above (Production + Preview).
3. Point `indiradio.ca` at Vercel and set `NEXT_PUBLIC_SITE_URL=https://indiradio.ca`.
4. Follow **docs/06-launch-checklist.md**.

## Documentation

- `docs/00-proposal.md`: sitemap, wireframes, design direction, component list (approved)
- `docs/02-design-system.md`: colours, typography, components, light/dark tokens, contrast table
- `docs/03-content.md`: where every piece of copy lives, translation notes, `[CONFIRM]` list
- `docs/04-seo-aeo.md`: titles, schema, robots, sitemap, llms.txt, analytics events
- `docs/05-admin-guide.md`: how Indi's team updates the schedule, sponsors and announcements
- `docs/06-launch-checklist.md`: redirects, Search Console, Business Profile, apps, licensing
