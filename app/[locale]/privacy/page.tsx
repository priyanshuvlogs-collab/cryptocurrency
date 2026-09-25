import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { privacy } from "@/content/legal";
import { getMessages, PAGES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("privacy", (await params).locale);
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  return <LegalPage doc={privacy[locale]} locale={locale} m={m} crumb={{ name: m.nav.privacy, path: PAGES.privacy.path }} />;
}
