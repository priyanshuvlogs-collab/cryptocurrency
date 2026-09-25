import type { Metadata } from "next";
import { SongRequestForm } from "@/components/forms/Forms";
import { PageHeader, Section } from "@/components/ui/Page";
import { getContest } from "@/lib/cms";
import { getMessages, PAGES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/site";
import type { Locale } from "@/lib/types";

export const revalidate = 300;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata("songRequest", (await params).locale);
}

const COPY = {
  en: {
    h1: "Request a song",
    lead: "Want to hear a favourite Punjabi song on Indi Radio, or dedicate one to someone special? Send your request and it goes straight to the on-air team.",
    note: "We can’t promise every request makes it to air, but we read them all. For a guaranteed on-air birthday or anniversary message, book a dedication.",
    contestLive: "Contest running now",
  },
  pa: {
    h1: "ਗੀਤ ਦੀ ਫ਼ਰਮਾਇਸ਼ ਕਰੋ",
    lead: "ਇੰਡੀ ਰੇਡੀਓ ’ਤੇ ਆਪਣਾ ਮਨਪਸੰਦ ਪੰਜਾਬੀ ਗੀਤ ਸੁਣਨਾ ਚਾਹੁੰਦੇ ਹੋ, ਜਾਂ ਕਿਸੇ ਖ਼ਾਸ ਨੂੰ ਸਮਰਪਿਤ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਫ਼ਰਮਾਇਸ਼ ਭੇਜੋ, ਇਹ ਸਿੱਧੀ ਆਨ-ਏਅਰ ਟੀਮ ਕੋਲ ਜਾਂਦੀ ਹੈ।",
    note: "ਹਰ ਫ਼ਰਮਾਇਸ਼ ਆਨ-ਏਅਰ ਚੱਲਣ ਦਾ ਵਾਅਦਾ ਨਹੀਂ ਕਰ ਸਕਦੇ, ਪਰ ਅਸੀਂ ਸਾਰੀਆਂ ਪੜ੍ਹਦੇ ਹਾਂ। ਜਨਮਦਿਨ ਜਾਂ ਵਰ੍ਹੇਗੰਢ ਦੇ ਪੱਕੇ ਆਨ-ਏਅਰ ਸੁਨੇਹੇ ਲਈ ਸੁਨੇਹਾ ਬੁੱਕ ਕਰੋ।",
    contestLive: "ਮੁਕਾਬਲਾ ਚੱਲ ਰਿਹਾ ਹੈ",
  },
};

export default async function SongRequestPage({ params }: Props) {
  const { locale } = await params;
  const m = getMessages(locale);
  const c = COPY[locale];
  const contest = await getContest();

  return (
    <>
      <PageHeader locale={locale} m={m} crumbs={[{ name: m.nav.songRequest, path: PAGES.songRequest.path }]} title={c.h1} lead={c.lead}>
        {contest ? (
          <p className="mt-6 inline-flex rounded-full bg-magenta px-4 py-2 font-bold text-bg">
            {c.contestLive}: {t(contest.title, locale)}
          </p>
        ) : null}
      </PageHeader>
      <Section>
        <div className="card max-w-3xl p-6 md:p-8">
          <SongRequestForm contest={contest ? { title: t(contest.title, "en"), question: t(contest.question, locale) } : null} />
        </div>
        <p className="mt-6 max-w-3xl text-sm text-muted">{c.note}</p>
      </Section>
    </>
  );
}
