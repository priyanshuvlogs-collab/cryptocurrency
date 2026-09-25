import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { terms } from "@/content/legal";
import { getMessages, PAGES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("terms", (await params).locale);
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  return <LegalPage doc={terms[locale]} locale={locale} m={m} crumb={{ name: m.nav.terms, path: PAGES.terms.path }} />;
}
