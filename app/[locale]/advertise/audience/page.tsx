import type { Metadata } from "next";

import { AdvertiseFooterCta, AdvertiseSubnav, loadAdvertise, AudienceSection, SamplesSection } from "@/components/advertise/sections";
import { PageHeader } from "@/components/ui/Page";
import { getMessages, PAGES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("advertiseAudience", locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const d = await loadAdvertise(locale);

  return (
    <>
      <PageHeader
        locale={locale}
        m={m}
        crumbs={[
          { name: m.nav.advertise, path: PAGES.advertise.path },
          { name: d.c.sub.audience, path: PAGES.advertiseAudience.path },
        ]}
        title={d.c.h1Audience}
        lead={d.c.audienceLead}
      />
      <AdvertiseSubnav d={d} current="audience" />
      <AudienceSection d={d} />
      <SamplesSection d={d} />
      <AdvertiseFooterCta d={d} current="audience" />
    </>
  );
}
