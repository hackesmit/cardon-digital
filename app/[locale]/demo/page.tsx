import { redirect } from "next/navigation";
import { demoHref, allModules } from "../../../lib/demo";
import { isLocale, type Locale } from "../../../lib/i18n/config";

// An absolute external target, so this must run per request rather than be
// baked as a static redirect at build time (Next drops the Location header
// on a statically prerendered redirect to an off-site URL).
export const dynamic = "force-dynamic";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export default function DemoPage({ params }: Params) {
  redirect(demoHref(localeOf(params), allModules));
}
