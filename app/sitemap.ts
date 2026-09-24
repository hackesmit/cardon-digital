import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/metadata";

/** Every page, in every locale. Paths here are locale-free.
 *
 * A path retired in lib/routes.ts may not appear here: it no longer has a page
 * and the sitemap would be advertising a redirect. /modulos left on bead
 * hq-4pu0q.8, and app/routes.test.ts holds the pair to each other. */
const routes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/industries/winery", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/work/monte-xanic", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/work/enkanto", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/precios", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Pre-launch the whole site serves the holding page under a noindex header,
  // so there is nothing to list. Removing COMING_SOON restores the full map.
  if (process.env.COMING_SOON === "1") return [];
  const lastModified = new Date();
  return routes.flatMap((r) =>
    locales.map((locale) => ({
      url: SITE_URL + localePath(locale, r.path),
      lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: {
        languages: Object.fromEntries(
          locales
            .map((l) => [l, SITE_URL + localePath(l, r.path)])
            .concat([["x-default", SITE_URL + localePath("es", r.path)]]),
        ),
      },
    })),
  );
}
