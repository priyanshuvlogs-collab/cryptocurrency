import type { LegalDoc } from "@/content/legal";
import { PageHeader, Section } from "@/components/ui/Page";
import type { Messages } from "@/messages/en";
import type { Locale } from "@/lib/types";

export function LegalPage({ doc, locale, m, crumb }: { doc: LegalDoc; locale: Locale; m: Messages; crumb: { name: string; path: string } }) {
  return (
    <>
      <PageHeader locale={locale} m={m} crumbs={[crumb]} title={doc.h1} lead={<p className="text-base">{doc.updated}</p>} />
      <Section>
        <article className="prose-ir">
          <p className="text-lg">{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.list ? (
                <ul>
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}
