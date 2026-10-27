import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/metadata";

/**
 * Every page the site advertises, once per locale. A retired path (lib/routes.ts)
 * is never here: the sitemap lists pages, redirects are not pages, and
 * app/routes.test.ts checks both ways.
 *
 * lastModified is the day the page's own content last changed: its page.tsx,
 * its dictionary and the components only it uses, never the shared chrome.
 * It is a table rather than a build-time git lookup because Vercel builds from
 * a shallow clone, where git dates every quiet file to the clone boundary and
 * nothing notices. app/sitemap.test.ts recomputes each date from full history
 * and fails with the line to write, so editing a page means updating its date
 * here in the same commit.
 */
const routes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const, lastModified: "2026-10-23" },
  { path: "/sitios-web", priority: 0.9, changeFrequency: "monthly" as const, lastModified: "2026-10-22" },
  { path: "/anuncios", priority: 0.9, changeFrequency: "monthly" as const, lastModified: "2026-10-21" },
  { path: "/software", priority: 0.9, changeFrequency: "monthly" as const, lastModified: "2026-10-21" },
  { path: "/visibilidad-ia", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-10-21" },
  { path: "/demos", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-10-20" },
  { path: "/estilos", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-10-19" },
  { path: "/precios", priority: 0.9, changeFrequency: "monthly" as const, lastModified: "2026-10-22" },
  { path: "/work/monte-xanic", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-10-16" },
  { path: "/work/enkanto", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-10-27" },
  { path: "/industries/winery", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-10-19" },
  { path: "/guias", priority: 0.6, changeFrequency: "monthly" as const, lastModified: "2026-10-22" },
  { path: "/guias/cuanto-cuesta-pagina-web", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-10-22" },
  { path: "/guias/aparecer-en-chatgpt", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-10-21" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const, lastModified: "2026-10-21" },
  { path: "/contacto", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-10-22" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const, lastModified: "2026-10-21" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const, lastModified: "2026-10-19" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Pre-launch the whole site serves the holding page under a noindex header,
  // so there is nothing to list. Removing COMING_SOON restores the full map.
  if (process.env.COMING_SOON === "1") return [];
  return locales.flatMap((locale) =>
    routes.map((r) => ({
      url: SITE_URL + localePath(locale, r.path),
      lastModified: r.lastModified,
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
