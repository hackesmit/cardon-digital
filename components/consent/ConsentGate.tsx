import { cookies } from "next/headers";
import ConsentBanner from "./ConsentBanner";
import ConversionListeners from "./ConversionListeners";
import { CONSENT_COOKIE, decisionFrom } from "@/lib/analytics/consent";
import { measurementConfigured } from "@/lib/analytics/config";

/**
 * The visitor-facing half of measurement: the notice, and the listeners that
 * turn the three lead actions into conversions.
 *
 * The notice appears only when there is something to consent to. With no
 * measurement id in the environment the site loads no tag and asks no question,
 * which is exactly what the privacy policy describes today. The listeners mount
 * either way; they no-op on their own until both conditions are met.
 */
export default function ConsentGate() {
  if (!measurementConfigured()) return null;

  const decision = decisionFrom(cookies().get(CONSENT_COOKIE)?.value);

  return (
    <>
      <ConversionListeners />
      {decision === null ? <ConsentBanner /> : null}
    </>
  );
}
