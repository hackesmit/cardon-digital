import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import NotFoundBody from "@/components/site/NotFoundBody";
import { defaultLocale } from "@/lib/i18n/config";
import { site } from "@/lib/i18n/site";

/**
 * The site 404. Every address that resolves to no route lands here, whether it
 * sits inside the locale tree (/es/nonexistent), carries a mistyped first
 * segment (/nothing.txt) or skips the middleware matcher entirely. It mounts
 * the whole document itself because the app root has no chrome of its own, and
 * it is prerendered, so the visitor gets real HTML with the nav, the footer and
 * a lang attribute rather than an empty shell. It answers in the default
 * locale: a request that matched no route carries no locale to honour.
 */
export const metadata: Metadata = {
  title: site[defaultLocale].notFound.metaTitle,
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <SiteShell locale={defaultLocale}>
      <NotFoundBody locale={defaultLocale} />
    </SiteShell>
  );
}
