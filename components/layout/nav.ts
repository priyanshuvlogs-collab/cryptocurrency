import type { Messages } from "@/messages/en";

export type NavKey = keyof Messages["nav"];

export const PRIMARY_NAV: { key: NavKey; path: string }[] = [
  { key: "listenLive", path: "/listen-live" },
  { key: "schedule", path: "/schedule" },
  { key: "shows", path: "/shows" },
  { key: "episodes", path: "/episodes" },
  { key: "indi", path: "/indi-jaswal" },
  { key: "dedications", path: "/dedications" },
  { key: "advertise", path: "/advertise" },
];

export const SECONDARY_NAV: { key: NavKey; path: string }[] = [
  { key: "callIn", path: "/call-in" },
  { key: "events", path: "/events" },
  { key: "songRequest", path: "/song-request" },
  { key: "about", path: "/about" },
  { key: "faq", path: "/faq" },
  { key: "contact", path: "/contact" },
];
