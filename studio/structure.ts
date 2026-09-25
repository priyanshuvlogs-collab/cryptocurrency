import type { StructureResolver } from "sanity/structure";

/** Sidebar grouped by what the team does most often. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Indi Radio")
    .items([
      S.listItem().title("⚙️ Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("announcement").title("📣 Announcements"),
      S.documentTypeListItem("scheduleSlot").title("🗓️ Weekly schedule"),
      S.documentTypeListItem("specialBroadcast").title("⭐ Special broadcasts"),
      S.documentTypeListItem("show").title("🎙️ Shows"),
      S.documentTypeListItem("episode").title("▶️ Featured episodes"),
      S.divider(),
      S.documentTypeListItem("sponsor").title("🤝 Sponsors"),
      S.documentTypeListItem("adPackage").title("💼 Advertising packages"),
      S.documentTypeListItem("dedicationTier").title("🎂 Dedication packages"),
      S.divider(),
      S.documentTypeListItem("event").title("🎪 Events"),
      S.documentTypeListItem("contest").title("🏆 Contests"),
      S.documentTypeListItem("faq").title("❓ FAQ"),
      S.documentTypeListItem("pressItem").title("📰 Press"),
      S.documentTypeListItem("socialPost").title("📱 Social posts"),
    ]);
