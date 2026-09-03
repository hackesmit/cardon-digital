import { cookies } from "next/headers";
import { CONSENT_COOKIE, decisionFrom } from "@/lib/analytics/consent";
import { bootstrapScript, loaderSrc } from "@/lib/analytics/gtag";

/**
 * The Google tag, rendered into the document head and only ever for a visitor
 * who has already accepted.
 *
 * Reading the cookie here is what makes the promise checkable in the HTML
 * itself: without the consent cookie the response contains no googletagmanager
 * reference at all, so there is no script that could decide for itself to run.
 * The cost is that the locale tree renders per request rather than at build
 * time, which is the right trade for a small content site behind middleware
 * that already runs on every request.
 */
export default function MeasurementScripts() {
  const src = loaderSrc();
  if (!src) return null;

  const decision = decisionFrom(cookies().get(CONSENT_COOKIE)?.value);
  if (decision !== "granted") return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        data-cardon-gtag="inline"
        dangerouslySetInnerHTML={{ __html: bootstrapScript() }}
      />
      <script data-cardon-gtag="loader" async src={src} />
    </>
  );
}
