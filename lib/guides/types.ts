import type { Locale } from "@/lib/i18n/config";
import type { FaqItem } from "@/lib/seo/jsonld";

/**
 * A guide is data (bead hq-i4b5.11, AEO spec in
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md): the template in
 * app/[locale]/guias/[slug]/page.tsx renders any entry of lib/guides/index.ts
 * the same way, so the page checklist (answer first, question headings,
 * byline, dates, sources, FAQ) is held once, by the template and its test.
 */

/** One block inside a section. Lists and tables carry their own label so they
    still make sense when an answer engine lifts them out alone. */
export type GuideBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered: boolean; title: string; items: string[] }
  | { kind: "table"; caption: string; cols: string[]; rows: { k: string; cells: string[] }[] }
  /** The one natural link from the topic to a Cardon service: a sentence, then
      the link text. The path is a site path, written without the locale. */
  | { kind: "service"; text: string; label: string; path: string };

export type GuideSection = {
  /** Fragment id, stable across locales. */
  id: string;
  /** A question the owner would ask an AI, ending in a question mark. */
  h: string;
  /** The first block is a paragraph that answers the heading by itself. */
  blocks: GuideBlock[];
};

/** An outside page the guide relies on. Every one is fetched and must answer
    200 before the guide ships (the bead's Definition of Done). */
export type GuideSource = {
  /** The page's own title. */
  title: string;
  publisher: string;
  url: string;
  /** What the guide takes from it, in one line. */
  note: string;
};

export type GuideCopy = {
  meta: { title: string; description: string };
  /** The H1: the question the guide answers. */
  title: string;
  /** Who it is written for, shown above the H1. */
  eyebrow: string;
  /** The answer, 40 to 60 words, self-contained, the first copy after the H1. */
  lede: string;
  sections: GuideSection[];
  sources: GuideSource[];
  faq: { title: string; items: FaqItem[] };
};

export type Guide = {
  slug: string;
  /** ISO calendar days, printed on the page and in the Article markup. */
  datePublished: string;
  dateModified: string;
  /** When the guide is next read again against its sources, at most a
      quarter after dateModified (content-checklist.txt, freshness). */
  reviewBy: string;
  copy: Record<Locale, GuideCopy>;
};
