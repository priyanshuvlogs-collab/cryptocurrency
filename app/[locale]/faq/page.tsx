import type { Metadata } from "next";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader, Section } from "@/components/ui/Page";
import { getFaqs } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { faqNode, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/site";
import type { Faq, Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("faq", (await params).locale);
}

const CATEGORIES: { id: Faq["category"]; en: string; pa: string }[] = [
  { id: "listening", en: "Listening", pa: "ਸੁਣਨਾ" },
  { id: "shows", en: "Shows & songs", pa: "ਸ਼ੋਅ ਅਤੇ ਗੀਤ" },
  { id: "call-in", en: "Calling in", pa: "ਕਾਲ ਕਰਨਾ" },
  { id: "dedications", en: "Dedications", pa: "ਸੁਨੇਹੇ" },
  { id: "advertising", en: "Advertising", pa: "ਮਸ਼ਹੂਰੀ" },
  { id: "general", en: "About Indi Radio", pa: "ਇੰਡੀ ਰੇਡੀਓ ਬਾਰੇ" },
];

const COPY = {
  en: { h1: "Indi Radio FAQ", lead: "Quick answers about listening live, calling in, the Indi Radio app, dedications and advertising.", jump: "Jump to" },
  pa: { h1: "ਇੰਡੀ ਰੇਡੀਓ ਸਵਾਲ-ਜਵਾਬ", lead: "ਲਾਈਵ ਸੁਣਨ, ਕਾਲ ਕਰਨ, ਇੰਡੀ ਰੇਡੀਓ ਐਪ, ਸੁਨੇਹਿਆਂ ਅਤੇ ਮਸ਼ਹੂਰੀ ਬਾਰੇ ਛੇਤੀ ਜਵਾਬ।", jump: "ਸਿੱਧਾ ਜਾਓ" },
};

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const faqs = await getFaqs();
  const groups = CATEGORIES.map((cat) => ({ ...cat, items: faqs.filter((f) => f.category === cat.id) })).filter((g) => g.items.length);

  return (
    <>
      <JsonLd data={graph(faqNode(faqs, locale))} />
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.faq, path: PAGES.faq.path }]} title={c.h1} lead={c.lead} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <nav aria-label={c.jump} className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow">{c.jump}</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col">
              {groups.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="chip lg:w-full">
                    {g[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-12">
            {groups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`}>
                <h2 id={`${g.id}-h`} className="display-md">
                  {g[locale]}
                </h2>
                <div className="mt-5 space-y-3">
                  {g.items.map((f) => (
                    // Answers are always in the HTML (not fetched on open), so crawlers and AI engines can read them.
                    <details key={f.id} id={f.id} className="card group p-5 open:border-fg">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-bold">
                        <h3>{t(f.q, locale)}</h3>
                        <span aria-hidden="true" className="mt-1 text-accent transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-muted">{t(f.a, locale)}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
