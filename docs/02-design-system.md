# Design System: "Phulkari Night"

A Punjabi wedding lit up at night: deep ink backgrounds with saturated embroidery colours that glow. Light mode swaps the ink for warm cream and deepens every accent so text stays readable.

Source of truth: `app/globals.css` (tokens + component classes). Tailwind utilities map to the tokens (`bg-surface`, `text-saffron`, `bg-live`…).

## Colour tokens

| Token | Tailwind | Dark (default at night) | Light | Used for |
|---|---|---|---|---|
| `--bg` | `bg-bg` | `#12090F` | `#FFF8EF` | Page background |
| `--surface` | `bg-surface` | `#1E1119` | `#FFFFFF` | Cards |
| `--surface-2` | `bg-surface-2` | `#2A1822` | `#F8EBDD` | Raised/hover, countdown tiles |
| `--text` | `text-fg` | `#FBEFE3` | `#221018` | Body text |
| `--text-muted` | `text-muted` | `#C9B3A8` | `#6B4F52` | Secondary text |
| `--border` | `border-line` | `#3A2530` | `#E7D3C3` | Hairlines |
| `--saffron` / `--on-saffron` | `bg-saffron text-on-saffron` | `#FF9F1C` / `#12090F` | `#A34E00` / `#FFFFFF` | Primary CTA (Listen Live) |
| `--red` / `--on-red` | `bg-live text-on-live` | `#E0263A` / `#FFFFFF` | `#B3122A` / `#FFFFFF` | LIVE, on-air, Call In |
| `--gold` | `text-gold` | `#F5C542` | `#8A6400` | Eyebrows, highlights |
| `--magenta` | `bg-magenta` | `#F062A8` | `#A3125F` | Selected chips, announcements |
| `--green` / `--on-green` | `bg-whatsapp` | `#2BB673` / `#12090F` | `#11794A` / `#FFFFFF` | WhatsApp, success |

### Contrast (WCAG 2.1 AA: 4.5:1 text, 3:1 large text/UI)

| Pair | Dark | Light |
|---|---|---|
| Text on background | 17.3 | 17.3 |
| Muted text on surface | 9.1 | 6.3 |
| Button text on saffron | 9.5 | 5.8 |
| White on red (LIVE/Call In) | 4.7 | 6.9 |
| Gold on surface | 11.3 | 5.1 |
| Magenta on background | 6.1 | 7.1 |
| Button text on WhatsApp green | 7.5 | 5.4 |

Two proposal colours were adjusted to pass AA: light-mode saffron went from `#C25E00` (4.07:1) to `#A34E00`, and dark-mode magenta text went from `#E0348F` to `#F062A8`. The originals are still used in the decorative phulkari pattern and share images.

### Theme switching
- The default follows the visitor's OS setting (`prefers-color-scheme`).
- The sun/moon toggle stores an explicit choice in `localStorage` (`ir-theme`).
- A tiny inline script in `<head>` applies the theme before first paint, so the page never flashes the wrong theme.

## Typography

| Role | Font | Notes |
|---|---|---|
| Display (Latin) | **Anybody** (variable, `wdth` axis) | Uppercase and condensed (`font-stretch: 80%`) for poster energy |
| Display (Gurmukhi) | **Mukta Mahee** 600/800 | Designed for Gurmukhi; strong at heavy weights |
| Body (Latin) | **Inter Tight** | `display: optional` so body text never re-renders (LCP) |
| Body (Gurmukhi) | **Noto Sans Gurmukhi** (variable) | |

Latin glyphs come from the first font in each stack and Gurmukhi glyphs fall through to the next, so mixed text such as "ਇੰਡੀ ਰੇਡੀਓ on TikTok" renders correctly on both language versions. All fonts are self-hosted by `next/font` with size-adjusted fallbacks. On Punjabi pages (`:lang(pa)`) the line-height increases to make room for Gurmukhi vowel signs (matras), and heading case and letter-spacing are reset.

Fluid scale: `.display-xl` (hero, clamp 2.5–5.5rem), `.display-lg` (page H1), `.display-md` (section H2), body 17px, small 14–15px.

## Layout & shape
- Container max 1200px, 16px side gutter on phones and 24px on larger screens.
- Cards: 14px radius, 1px border. Buttons and chips are full pills.
- **Tap targets ≥ 48px** (buttons), ≥ 44px (chips and icon buttons).
- The sticky mini-player is 72px tall plus the safe-area inset. The body reserves the same padding so it never covers content.

## Components (code → purpose)

| Component | File | Notes |
|---|---|---|
| `AudioProvider` | `components/player/AudioProvider.tsx` | One `<audio>` for the whole site, lock-screen controls, auto-reconnect |
| `PlayButton`, `Waveform`, `OnAirBadge`, `NowPlaying`, `NextShowCountdown`, `VolumeControl` | `components/player/PlayerControls.tsx` | Live widgets driven by the schedule |
| `MiniPlayer` | `components/player/MiniPlayer.tsx` | Always shown on phones; on desktop it appears once playback starts |
| `WatchLiveBadge` | `components/player/LiveStatus.tsx` | Fixed-position pill, so it never shifts layout |
| `ScheduleGrid` | `components/sections/ScheduleGrid.tsx` | Time-zone chips, today highlight, on-air highlight, .ics |
| `VideoFacade` | `components/sections/VideoFacade.tsx` | Thumbnail until tapped; privacy-enhanced YouTube with captions on |
| `SmartForm` + fields | `components/forms/Form.tsx` | Honeypot, time trap, inline errors, announced status |
| `PageHeader`, `Section` | `components/ui/Page.tsx` | Breadcrumbs (+ JSON-LD), the single H1, section headings |
| Buttons | `.btn .btn-primary/.btn-live/.btn-whatsapp/.btn-ghost .btn-lg` | |
| Chips | `.chip[aria-pressed]` | Time zones, filters |
| Pattern | `.phulkari` | Inline-SVG bagh diamond lattice, 7–9% opacity, masked |
| Border | `.border-phulkari` | Striped footer divider |

## Motion
- On-air dot: 1.6s pulse ring. Waveform: CSS bars that animate while playing and "breathe" slowly while idle.
- Sections rise 12px and fade in on scroll (`.reveal`, IntersectionObserver). Without JavaScript they are simply visible.
- Sponsor logos scroll in a marquee that pauses on hover.
- **`prefers-reduced-motion`**: every animation is disabled; waveform bars sit at fixed heights.

> The proposal described a waveform driven by the Web Audio `AnalyserNode`. It is intentionally a CSS animation instead: routing a cross-origin stream through Web Audio outputs **silence** unless the stream server sends CORS headers, and on iPhone it can stop background/lock-screen playback. The visual is the same, with no risk to the audio.

## Accessibility checklist (built in)
- Skip link, landmarks, one H1 per page, logical heading order, breadcrumbs.
- All controls keyboard-operable with a visible 3px saffron focus ring. The mobile menu is a native `<dialog>` (focus trap and Esc to close).
- Player buttons have accessible names that match their visible labels. Player status is announced through `role="status"`.
- Form fields have labels, required markers, `aria-invalid` and linked error text. Status and errors are focused and announced.
- `lang` is set per page (`en-CA`, `pa`). The language switch link carries `hreflang` and `lang`.
- Videos load with captions on (`cc_load_policy=1`). Upload proper captions to YouTube for every episode.
- Lighthouse (mobile) at handover: Accessibility **100** on every page tested.
