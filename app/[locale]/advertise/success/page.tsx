import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdvertiseFooterCta, AdvertiseSubnav, loadAdvertise, SuccessSections } from "@/components/advertise/sections";
import { PageHeader } from "@/components/ui/Page";
import { getMessages, PAGES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("advertiseSuccess", locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const d = await loadAdvertise(locale);
  // Only real sponsors or testimonials; with none, this page does not exist.
  if (!d.hasSuccess) notFound();
  return (
    <>
      <PageHeader
        locale={locale}
        m={m}
        crumbs={[
          { name: m.nav.advertise, path: PAGES.advertise.path },
          { name: d.c.sub.success, path: PAGES.advertiseSuccess.path },
        ]}
        title={d.c.h1Success}
        lead={d.c.successLead}
      />
      <AdvertiseSubnav d={d} current="success" />
      <SuccessSections d={d} m={m} />
      <AdvertiseFooterCta d={d} current="success" />
    </>
  );
}
