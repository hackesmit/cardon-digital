import type { Metadata } from "next";
import { locales, localePath, ogLocale, type Locale } from "./config";
import { site } from "./site";
import { BRAND } from "../brand";
import { brandArt } from "../brand-art";

/** This build's origin: cardondigital.com, or the wine brand's (lib/brand.ts). */
export const SITE_URL = BRAND.siteUrl;

/** The robots metadata every page inherits from the locale layout: noindex
    across the board while the brand may not be indexed (lib/brand-env.mjs). */
export const ROBOTS: Metadata["robots"] = BRAND.indexable
  ? { index: true, follow: true }
  : { index: false, follow: false };

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

/** The share image. Next replaces a parent's openGraph and twitter blocks
 *  whole when a page sets its own, so every page has to carry it again or
 *  link previews show no picture. */
const OG_IMAGE = brandArt(BRAND.id).og;

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
      type: "website",
      siteName: BRAND.name,
      title: meta.title,
      description: meta.description,
      url: SITE_URL + localePath(locale, path),
      images: [{ ...OG_IMAGE, alt: site[locale].meta.ogAlt }],
      locale: ogLocale[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE.url],
    },
  };
}
