# Design System: "Midnight Broadcast"

Vintage Punjabi radio posters meet a modern newsroom. The system avoids the generic template look (soft gradients, rounded cards everywhere). Instead it uses:

- **Poster type:** condensed display headlines at huge sizes, with an italic serif for small editorial accents.
- **Paper and ink bands:** always-dark "broadcast" bands (hero, page headers, footer, player) alternate with warm paper content. The paper sections follow light/dark mode.
- **Phulkari as craft, not wallpaper:** an embroidered triangle-and-diamond border band separates sections, and a dense lattice fills the record label and placeholders.
- **Radio objects as UI:** a spinning record is the player, a red ticker announces what's on air, the schedule is a departure board, dedications are ticket stubs, and an FM-style dial lists the cities tuning in.

Source of truth: `app/globals.css`.

## Colour

| Token | Light (paper) | Dark | Used for |
|---|---|---|---|
| `--bg` | `#F4ECDD` | `#140B0E` | Page |
| `--surface` / `--surface-2` | `#FBF6EC` / `#EADFCB` | `#1D1116` / `#2A1820` | Cards, raised rows |
| `--text` / `--text-muted` | `#1A0F12` / `#5E4A45` | `#F4ECDD` / `#BCA89D` | Text |
| `--accent` (text) | `#9A4A00` | `#FFA41B` | Eyebrows, links, numerals |
| `--marigold` (fill) | `#FFA41B` | `#FFA41B` | Primary buttons, highlights (ink text on top) |
| `--red` | `#C8102E` | `#E0263A` | LIVE, Call In, ticker |
| `--magenta` (rani pink) | `#B0005F` | `#FF6FB5` | Selected states, bullets, sticker |
| `--green` | `#0F7B4E` | `#34C98A` | WhatsApp |
| `--ink` / `--on-ink` | `#140B0E` / `#F4ECDD` | same | Broadcast bands |

Contrast (all ≥ 4.5:1): text on paper 16.0 · muted on paper 7.0 · accent on paper 5.3 · ink on marigold 9.8 · white on red 5.9 (light) / 4.7 (dark) · white on rani 5.9 · muted on ink 8.5 · marigold on ink 9.8.

**Nested themes:** `.band-ink` and `.band-marigold` redefine the tokens for everything inside them, so any component (buttons, forms, countdown) automatically renders correctly on a dark or marigold band. Dark bands get a subtle film-grain overlay.

## Typography

| Role | Font | Treatment |
|---|---|---|
| Display (Latin) | **Big Shoulders** 800/900 | Uppercase, line-height 0.84–0.92. `.display-xl` hero (up to 9.5rem), `.display-lg` page H1, `.display-md` section H2 |
| Display (Gurmukhi) | **Baloo Paaji 2** 600/800 | Designed for Punjabi; no uppercase, line-height 1.12 |
| Body | **Schibsted Grotesk** | Editorial grotesk, `display: optional` (no re-render) |
| Body (Gurmukhi) | **Noto Sans Gurmukhi** | |
| Accent | **Instrument Serif** italic | `.serif`, e.g. "from Surrey, Canada", "with Indi Jaswal" |
| Labels | body font, `.meta` / `.eyebrow` | Uppercase, 0.14–0.18em tracking. The eyebrow carries a short leading rule |

## Components & motifs

| Piece | Where | Notes |
|---|---|---|
| **Record player** (`Disc`) | Home hero, Listen Live | Vinyl grooves + phulkari label + curved "INDI RADIO ◆ SURREY BC ◆ LIVE 24/7". Spins only while playing; static under reduced motion. The centre is the play button. |
| **Ticker** | Top of the home hero | Red band, looping on-air items; decorative (`aria-hidden`) |
| **FM dial** | Under the hero | Tick marks + red needle over the listener cities (Vancouver → Sydney) |
| **Phulkari band** | Under every dark header, top of the footer | 18px embroidered border |
| **Departure-board schedule** | /schedule, show pages | Dark board, one row per day, marigold times, red on-air marker |
| **Clock countdown** | Home, Schedule, Listen Live, Call In | Big condensed digits with red colons |
| **World clocks** | Home | Live time in Vancouver, India, UK, Australia |
| **Ticket stubs** | Dedications | Perforation + side notches (CSS mask). The most-loved tier is marigold |
| **Numbered facts** | Home "at a glance" | 01–05 numerals over heavy rules |
| **Sponsor marquee** | Home, Advertise | Logos, or an outlined "Your business here" pitch when empty |
| **Oversized wordmark** | Footer | "INDIRADIO" across the full width |
| Buttons | `.btn-primary / -live / -whatsapp / -ghost` | 4px radius, uppercase; on hover they lift with a hard offset shadow |
| Sections | `Section` | A heavy top rule, heading left, intro right |

## Motion
- The record spins (7s/turn) only while audio plays. The on-air dot pulses. The ticker and sponsor marquees loop (and pause on hover).
- Sections rise and fade in on scroll. Buttons lift on hover.
- **`prefers-reduced-motion`**: every animation stops, including the record, the ticker, the marquee and the waveform.

## Accessibility
- Lighthouse (mobile) after the redesign: **Accessibility 100** on Home (EN/PA), Schedule, Dedications and Shows.
- Every decorative element (ticker, dial, sticker, marquee, oversized wordmark) is `aria-hidden`. The same facts are in the page text.
- Focus ring: 3px `--accent`. Tap targets ≥ 44px. Visible labels match accessible names.
- Mobile menu is a native `<dialog>` (focus trap, Esc).

## Performance
Lighthouse mobile after the redesign: Performance 93–95, CLS 0, TBT ≤ 60 ms. Only the Latin display and body fonts are preloaded; Gurmukhi and serif fonts load on demand.
