# Content & Translations

All copy was written fresh for Indi Radio in natural English, with Punjabi (Gurmukhi) translations. The old site's generic "indie rock" text is gone. Facts that only the station can supply are marked **[CONFIRM]** in the text itself and are never guessed.

## Where each piece of copy lives

| Content | English + Punjabi source | Editable in CMS? |
|---|---|---|
| Brand description (reused in meta, JSON-LD, llms.txt, footer) | `lib/site.ts` → `BRAND_DESCRIPTION` | No (keep it consistent) |
| Page titles & meta descriptions | `lib/i18n.ts` → `PAGES` | No |
| Buttons, menus, player, forms, errors | `messages/en.ts`, `messages/pa.ts` | No |
| Home, Listen Live, Schedule, Call-In, Dedications, Advertise, Events, About, Contact, Song Requests, Indi Jaswal | the `COPY` object at the top of each `app/[locale]/…/page.tsx` | No |
| Shows (name, tagline, description) | `content/seed.ts` → `shows` | **Yes**: Shows |
| Weekly schedule | `content/seed.ts` → `schedule` | **Yes**: Weekly schedule |
| FAQ (14 questions, 40–60 words each) | `content/seed.ts` → `faqs` | **Yes**: FAQ |
| Dedication & advertising packages | `content/seed.ts` | **Yes** |
| Sponsors, events, announcements, press, contests, social posts | CMS only | **Yes** |
| Privacy Policy (PIPEDA/PIPA) & Terms of Use | `content/legal.ts` | No (lawyer review first) |

After the CMS is connected, run `cd studio && npm run seed` once to copy the built-in content into Sanity. From then on, the team edits it there.

## Word counts against the brief
- **About page:** 520 words (EN) across six sections covering the station story, Indi Jaswal, Surrey roots, Punjabi culture, live call-ins and worldwide listeners.
- **FAQ:** 14 questions. Each English answer is 40–60 words, written to be quoted directly by Google and AI assistants. The set includes every question the brief named.
- **Indi Jaswal bio:** four paragraphs, plus one **[CONFIRM]** paragraph for personal history that only Indi can provide.

## Translation notes
- Proper names keep their conventional spellings: ਇੰਡੀ ਰੇਡੀਓ (Indi Radio), ਇੰਡੀ ਜਸਵਾਲ (Indi Jaswal), ਸਰੀ (Surrey), ‘ਭੇਡਾਂ ਦਾ ਕਾਲ’ (Bhedan Da Kaal).
- Platform names (WhatsApp, TikTok, YouTube, iPhone, Android) stay in Latin script, as Punjabi speakers read them.
- The register is warm, conversational Punjabi (ਤੁਸੀਂ form), not formal or literary.
- **Recommended:** have a native Punjabi speaker from Indi's team read every `/pa` page once before launch, especially the legal pages. The English legal text governs if the two differ, and both pages say so.
- About Indi: the copy avoids gendered pronouns and uses "Indi" by name. Once Indi confirms their preferred pronouns, the bio can be adjusted if desired.

## [CONFIRM] items
Run `npm run confirm-report` for the live list with file and line numbers. By owner:

**Station facts**
1. Call-in number 778-834-0325, the WhatsApp number (assumed to be the same), and the public email.
2. Live stream URL (HTTPS).
3. One official App Store link and one official Google Play link. The iOS app "Indi Radio and TV" (id6739446010) was found by public search; the Play link currently points to the developer page.
4. Social profile URLs, YouTube channel ID, WhatsApp channel link, TuneIn/Alexa listing.
5. Weekly schedule, including Bhedan Da Kaal days and times. Every seeded slot is flagged "time to be confirmed".
6. The meaning of "Bhedan Da Kaal" and the show's topics, in Indi's words.
7. Year Indi Radio launched; Indi's background, milestones and press.
8. Street address (or confirm the station stays service-area only).

**Commercial**
9. Dedication package prices and inclusions. Until prices are set, bookings are sent as requests with no payment.
10. Advertising package prices, audience figures and media kit PDF.

**Legal / compliance**
11. Privacy Officer name and email, retention periods, effective dates.
12. Refund policy, GST/PST treatment, contest eligibility.
13. SOCAN and Re:Sound licence status (see the launch checklist).

**Media**
14. Licensed photos of Indi Jaswal (hero, bio, gallery), sponsor logos, show artwork.
