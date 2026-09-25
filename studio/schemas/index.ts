import { localeString, localeText } from "./locale";
import { siteSettings } from "./siteSettings";
import { show } from "./show";
import { scheduleSlot, specialBroadcast } from "./schedule";
import { adPackage, announcement, contest, dedicationTier, episode, event, faq, pressItem, socialPost, sponsor } from "./content";

export const schemaTypes = [
  localeString,
  localeText,
  siteSettings,
  show,
  scheduleSlot,
  specialBroadcast,
  episode,
  sponsor,
  event,
  faq,
  announcement,
  dedicationTier,
  adPackage,
  pressItem,
  socialPost,
  contest,
];
