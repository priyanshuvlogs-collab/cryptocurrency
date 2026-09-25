# Admin Guide: Updating indiradio.ca

**For Indi's team. No code needed.** Everything below happens in the Indi Radio Studio (Sanity):
**https://indiradio.sanity.studio** (log in with the email you were invited with).

When you press **Publish**, the website updates within a few seconds. Every text field has an **English** box and a **ਪੰਜਾਬੀ** box. If the Punjabi box is left empty, Punjabi pages show the English text.

---

## 🔴 Going live on TikTok
1. Open **⚙️ Site settings**.
2. Switch on **"Indi is LIVE on TikTok right now"** → **Publish**.
3. A red **Watch Live** badge appears on every page, linking to TikTok.
4. **When the live ends, switch it off again → Publish.**

YouTube lives are detected automatically. There is nothing to switch.

## 🗓️ Updating the weekly schedule
Each weekly time slot is one entry in **Weekly schedule**.

- **Add a slot:** Weekly schedule → **+** → choose the **Show**, the **Day**, **Start** and **End** in **Vancouver time, 24-hour format** (7 PM = `19:00`, 9:30 PM = `21:30`) → Publish.
- **Change a time:** open the slot, edit Start/End → Publish.
- **Remove a slot:** open it → ⋯ menu → **Delete**.
- A show that runs past midnight: just enter the end time (e.g. 23:00 → `01:00`); the site understands it.
- Untick **Time confirmed** if a time is provisional. The site then shows "time to be confirmed".

The website converts every time automatically for listeners in India, the UK, Australia or anywhere else, including daylight-saving changes. **Always enter Vancouver time.**

**One-off show** (e.g. live from a mela): use **⭐ Special broadcasts** with a date and time. While it runs it replaces "Now playing" everywhere.

## 🎙️ Adding or editing a show
**Shows** → **+** → fill in:
- **Show name** (English + Punjabi) and **Name in Gurmukhi**
- **Web address:** press *Generate* (for example `bhedan-da-kaal`). Don't change it after launch, because links and Google rankings depend on it.
- **One-line summary** and **Description** (leave an empty line between paragraphs)
- **YouTube playlist ID** (optional): videos in that playlist appear on the show page
- **Title keywords:** YouTube videos with these words in the title are tagged to the show

## 📣 Posting an announcement
**Announcements** → **+** → write the text (keep it short) → optional link (e.g. `/en/events`) → optional **Start/Stop showing** dates → Publish.
It appears as a pink bar at the top of every page. Only the newest active one shows. Visitors can close it.

## 🤝 Adding a sponsor
**Sponsors** → **+** → **Name**, **Logo** (PNG/SVG with a transparent background, at least 320px wide), **Website**, **Tier** → optional **Show on the site until** date → Publish.
Logos scroll in the sponsor strip on the Home and Advertise pages. After the end date, the sponsor disappears automatically.

## 🎪 Events
**Events** → **+** → title, date and time, venue, city, optional Google Maps and ticket links, and a photo. Tick **Indi Radio broadcasts live from this event** if you'll be on air. Upcoming events show on /events and are sent to Google as events. Past events move to "Past events" automatically.

## 🎂 Dedication prices
**Dedication packages** → open a package → **Price (CAD)** → Publish.
- **Price set + Stripe connected:** customers pay online before booking.
- **Price empty:** the booking is sent to you as a **request**, and you confirm the price on WhatsApp.

Paid bookings arrive by **email** and in **GoHighLevel** (tagged `form:dedication_paid`), with the name, message, date and song. The customer gets an email receipt and a WhatsApp button to confirm the air time with you.

## 💼 Advertising
- **Advertising packages:** names, price notes, what's included.
- **⚙️ Site settings → Media & stats:** upload the **Media kit (PDF)** and update the **Audience stats**.
- Inquiries from the Advertise page arrive by email and in GoHighLevel (`form:sponsor`).

## ❓ FAQ
**FAQ** → **+** → question + answer in both languages. Aim for **40–60 words**: that length is what Google and AI assistants quote. Choose a category and a sort order.

## 🏆 Contests
**Contests** → **+** → title + entry question → **Active** → optional closing date. The Song Requests page then shows an "Enter the contest" tab. Entries arrive by email and in GoHighLevel (`form:contest`). Canadian law requires winners to answer a skill-testing question before receiving a prize.

## ▶️ Episodes
New YouTube uploads appear on the site **automatically** within 30 minutes. Use **Featured episodes** only to feature a video or tag it to a show (paste the video ID, the part after `watch?v=`).

## 📱 Social strip
The "Latest from Indi Radio" strip shows recent YouTube videos automatically. To add a TikTok, Instagram or Facebook post, go to **Social posts** → **+** → platform, link, caption, thumbnail.

## ⚙️ Site settings (rarely changed)
Call-in number, WhatsApp number and channel link, email, stream URL, app store links, social profiles, YouTube channel ID, and Indi's photo. Changes here update the whole site, the Google structured data and `/llms.txt`.

---

### Where do form submissions go?
| Form | Email | GoHighLevel tag |
|---|---|---|
| Dedication (paid) | ✅ + customer confirmation | `form:dedication_paid` |
| Dedication (request) | ✅ | `form:dedication_request` |
| Advertise | ✅ | `form:sponsor` |
| Song request / contest | ✅ | `form:song_request` / `form:contest` |
| Book Indi for an event | ✅ | `form:event_booking` |
| Contact | ✅ | `form:contact` |
| Newsletter | ✅ | `form:newsletter` |

All leads also carry `website` and `lang:en` / `lang:pa` tags, so you know which language to reply in.

### Something looks wrong?
- **Change not showing?** Refresh after about 30 seconds. If it's still missing, check that you pressed **Publish** (not just saved a draft).
- **Player silent?** Check the stream URL in Site settings starts with `https://`.
- Anything else: contact your web developer.
