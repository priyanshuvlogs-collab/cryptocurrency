import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Sanity webhook → instant refresh after the team publishes in the CMS.
 * Sanity: API → Webhooks → URL https://indiradio.ca/api/revalidate?secret=…
 * (trigger on create/update/delete, all document types).
 */
export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret") || req.headers.get("x-revalidate-secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: new Date().toISOString() });
}
