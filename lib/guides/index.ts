import { aparecerEnChatgpt } from "./aparecer-en-chatgpt";
import { cuantoCuestaPaginaWeb } from "./cuanto-cuesta-pagina-web";
import type { Guide } from "./types";

/**
 * Every published guide, newest first (bead hq-i4b5.11). The index page, the
 * article template's generateStaticParams, the sitemap test and llms.txt all
 * read this list, so a new guide is one file in lib/guides, one entry here and
 * its line in app/sitemap.ts.
 */
export const GUIDES: readonly Guide[] = [cuantoCuestaPaginaWeb, aparecerEnChatgpt];

/** The site path of a guide, without the locale. */
export const guidePath = (slug: string) => "/guias/" + slug;

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
