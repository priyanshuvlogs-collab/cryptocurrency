import type { Metadata } from "next";

import { AdvertiseFooterCta, AdvertiseSubnav, loadAdvertise, HowSection, PackagesSection } from "@/components/advertise/sections";
import { PageHeader } from "@/components/ui/Page";
import { getMessages, PAGES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("advertisePackages", locale);
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
          { name: d.c.sub.packages, path: PAGES.advertisePackages.path },
        ]}
        title={d.c.h1Packages}
        lead={d.c.packagesLead}
      />
      <AdvertiseSubnav d={d} current="packages" />
      <PackagesSection d={d} />
      <HowSection d={d} />
      <AdvertiseFooterCta d={d} current="packages" />
    </>
  );
}
