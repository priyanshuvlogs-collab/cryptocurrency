import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HashRedirect } from "@/components/advertise/HashRedirect";
import {
  ADVERTISE_PATHS,
  AdvertiseFooterCta,
  AdvertiseSubnav,
  ExploreSection,
  HowSection,
  IdealForSection,
  WhySection,
  advertiseDescription,
  loadAdvertise,
} from "@/components/advertise/sections";
import { JsonLd } from "@/components/ui/JsonLd";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { getSettings } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { STATION_ID, breadcrumbNode, graph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  const page = PAGES.advertise[locale];
  return buildMetadata({
    locale,
    path: PAGES.advertise.path,
    title: page.title,
    description: advertiseDescription(page.description, settings.mediaKitUrl),
    ogHeading: "Advertise on Punjabi radio in Surrey",
  });
}

export default async function AdvertisePage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const d = await loadAdvertise(locale);
  const { c } = d;
  const crumbs = [
    { name: m.breadcrumbs.home, path: "/" },
    { name: m.nav.advertise, path: PAGES.advertise.path },
  ];

  return (
    <>
      {/* Old links like /advertise#inquiry now live on their own page. */}
      <HashRedirect map={{ inquiry: ADVERTISE_PATHS.getPricing, packages: ADVERTISE_PATHS.packages, audience: ADVERTISE_PATHS.audience }} />
      <JsonLd
        data={graph(breadcrumbNode(locale, crumbs), {
          "@type": "Service",
          name: locale === "pa" ? "ਪੰਜਾਬੀ ਰੇਡੀਓ ਮਸ਼ਹੂਰੀ" : "Punjabi radio advertising",
          serviceType: "Radio advertising",
          provider: { "@id": STATION_ID },
          areaServed: ["Surrey, BC", "Lower Mainland, BC", "Canada"],
          audience: { "@type": "Audience", audienceType: "Punjabi-speaking families" },
          url: absoluteUrl(`/${locale}/advertise`),
        })}
      />

      <header className="band-ink overflow-hidden">
        <div className="container-ir grid items-center gap-10 pt-8 pb-12 md:pt-10 md:pb-16 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <nav aria-label={m.breadcrumbs.label}>
              <ol className="meta flex flex-wrap items-center gap-2 text-muted">
                <li>
                  <Link href={`/${locale}`} className="inline-block py-1 hover:text-fg">
                    {m.breadcrumbs.home}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="7" height="7" viewBox="0 0 10 10" aria-hidden="true" className="text-marigold">
                    <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
                  </svg>
                  <span aria-current="page" className="text-fg">
                    {m.nav.advertise}
                  </span>
                </li>
              </ol>
            </nav>
            <h1 className="display-lg mt-10 max-w-4xl">{c.h1}</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted md:text-xl">{c.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`/${locale}${ADVERTISE_PATHS.getPricing}`} className="btn btn-primary btn-lg">
                {c.getPricing}
              </Link>
              <a
                href={d.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_join"
                data-track-label="advertise_hero"
                className="btn btn-whatsapp btn-lg"
              >
                <WhatsAppIcon size={20} /> {c.whatsappUs}
              </a>
              {d.samples.length ? (
                <Link href={`/${locale}${ADVERTISE_PATHS.audience}#sample-ads`} className="link ml-1 inline-flex min-h-11 items-center">
                  {c.hearSample}
                </Link>
              ) : null}
            </div>
          </div>
          {d.heroImage ? (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-md border-2 border-marigold shadow-[10px_10px_0_var(--marigold)]">
              <Image src={d.heroImage} alt={d.heroAlt} fill priority sizes="(min-width: 1024px) 380px, 90vw" className="object-cover" />
            </div>
          ) : null}
        </div>
        <div className="phulkari-band" aria-hidden="true" />
      </header>

      <AdvertiseSubnav d={d} current="overview" />
      <WhySection d={d} />
      <IdealForSection d={d} />
      <HowSection d={d} />
      <ExploreSection d={d} />
      <AdvertiseFooterCta d={d} current="overview" />
    </>
  );
}
