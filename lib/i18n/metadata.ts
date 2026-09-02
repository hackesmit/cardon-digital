import type { Metadata } from "next";
import { locales, localePath, ogLocale, type Locale } from "./config";

export const SITE_URL = "https://cardondigital.com";

/**
 * hreflang alternates for one page. Spanish is x-default: an unresolved
 * visitor is treated as a Spanish reader everywhere else in the stack too.
 */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localePath(l, path);
  languages["x-default"] = localePath("es", path);
  return { canonical: localePath(locale, path), languages };
}

/** Per-page metadata: localized title and description plus the alternates. */
export function pageMetadata(
  locale: Locale,
  path: string,
  meta: { title: string; description: string },
  /** The home page carries the full brand title, so it skips the template. */
  absoluteTitle = false,
): Metadata {
  return {
    title: absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: SITE_URL + localePath(locale, path),
      locale: ogLocale[locale],
    },
    twitter: { title: meta.title, description: meta.description },
  };
}
