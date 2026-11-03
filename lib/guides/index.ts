import { aparecerEnChatgpt } from "./aparecer-en-chatgpt";
import { cuantoCuestaPaginaWeb } from "./cuanto-cuesta-pagina-web";
import { currentBrand, type Brand } from "@/lib/brand";
import type { Guide } from "./types";

/**
 * Every published guide, newest first (bead hq-i4b5.11). The index page, the
 * article template's generateStaticParams, the sitemap test and llms.txt all
 * read this list, so a new guide is one file in lib/guides, one entry here and
 * its line in app/sitemap.ts.
 */
export const ALL_GUIDES: readonly Guide[] = [cuantoCuestaPaginaWeb, aparecerEnChatgpt];

/** The guides one brand publishes (Guide.brand, unset meaning cardon). */
export function guidesFor(brand: Brand): readonly Guide[] {
  return ALL_GUIDES.filter((g) => (g.brand ?? "cardon") === brand);
}

/** This build's guides: every reader of the registry sees only its brand's. */
export const GUIDES: readonly Guide[] = guidesFor(currentBrand());

/** The site path of a guide, without the locale. */
export const guidePath = (slug: string) => "/guias/" + slug;

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
