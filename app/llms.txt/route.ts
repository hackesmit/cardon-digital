import { readDoors } from "@/lib/contact/doors";
import { deliveryConfigured } from "@/lib/contact/mail";
import { llmsTxt } from "./llms";

/* /llms.txt for answer engines (llmstxt.org). Static: it is rebuilt with the
   pages it summarizes. The middleware matcher skips any path with a dot, so the
   locale redirect and the pre-launch gate never touch it, as with robots.txt. */
export const dynamic = "force-static";

export function GET() {
  // Pre-launch the pages serve the holding page, so like the sitemap there is
  // nothing to describe yet.
  if (process.env.COMING_SOON === "1") return new Response("Not found\n", { status: 404 });
  const body = llmsTxt(readDoors(deliveryConfigured()).variant);
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
