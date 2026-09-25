import { DismissAnnouncement } from "./ClientEffects";

export function AnnouncementBar({ item }: { item: { id: string; text: string; href?: string | null } | undefined }) {
  if (!item) return null;
  const hideIfDismissed = `(function(){try{if(JSON.parse(localStorage.getItem('ir-dismissed')||'[]').indexOf(${JSON.stringify(item.id)})>-1){document.currentScript.parentElement.hidden=true}}catch(e){}})()`;
  return (
    <div data-announcement className="bg-magenta text-bg" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: hideIfDismissed }} />
      <div className="container-ir flex min-h-11 items-center gap-3 py-1.5 text-sm font-semibold">
        <p className="flex-1">
          {item.href ? (
            <a href={item.href} className="underline underline-offset-2">
              {item.text}
            </a>
          ) : (
            item.text
          )}
        </p>
        <DismissAnnouncement id={item.id} />
      </div>
    </div>
  );
}
