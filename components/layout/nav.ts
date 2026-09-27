import type { Messages } from "@/messages/en";

export type NavKey = keyof Messages["nav"];
export type NavItem = { key: NavKey; path: string };
export type NavGroup = { key: NavKey; items: NavItem[] };

/** Header menu: four groups, each opening a short list of pages. */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "groupListen",
    items: [
      { key: "listenLive", path: "/listen-live" },
      { key: "schedule", path: "/schedule" },
      { key: "shows", path: "/shows" },
      { key: "episodes", path: "/episodes" },
    ],
  },
  {
    key: "groupTakePart",
    items: [
      { key: "callIn", path: "/call-in" },
      { key: "songRequest", path: "/song-request" },
      { key: "dedications", path: "/dedications" },
      { key: "events", path: "/events" },
    ],
  },
  {
    key: "advertise",
    items: [
      { key: "advertiseOverview", path: "/advertise" },
      { key: "advertiseAudience", path: "/advertise/audience" },
      { key: "advertisePackages", path: "/advertise/packages" },
      { key: "advertisePricing", path: "/advertise/get-pricing" },
    ],
  },
  {
    key: "groupAbout",
    items: [
      { key: "aboutStory", path: "/about" },
      { key: "indi", path: "/indi-jaswal" },
      { key: "faq", path: "/faq" },
      { key: "contact", path: "/contact" },
    ],
  },
];
