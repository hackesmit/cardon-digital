import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/metadata";

/** Every page, in every locale. Paths here are locale-free. */
const routes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/industries/winery", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/work/monte-xanic", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/work/enkanto", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/industries/construction", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/industries/hiring", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/industries/restaurants", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/industries/clinics", priority: 0.6, changeFrequency: "monthly" as const },
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
