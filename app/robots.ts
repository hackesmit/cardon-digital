import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { SITE_URL } from "@/lib/i18n/metadata";

/**
 * The answer engines, by the user agents their owners publish: the search
 * index, the training crawler and the fetch made when a person asks, for
 * OpenAI, Perplexity and Anthropic, plus Google's and Apple's AI opt-in tokens
 * and Bing, which feeds Copilot and ChatGPT search. Everyone is already
 * allowed by *; naming them says the welcome is deliberate.
 */
export const AI_CRAWLERS = [
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
] as const;

/* A crawler with a group of its own ignores the * group, so each named group
   carries the same rules as *: change one, change them all (app/robots.test.ts
   holds that). The pre-launch gate needs nothing here: it hides pages with a
   noindex header from middleware.ts, and a robots disallow would stop crawlers
   from ever reading that header. */
const ALL = { allow: "/" };

/* A brand that may not be indexed yet (the wine brand before its domain,
   lib/brand-env.mjs) keeps the door open for the same reason: every page and
   this file itself carry noindex (next.config.mjs, the locale layout), and a
   crawler has to read a page to see that. It names no crawler as welcome and
   points at no sitemap, since there is nothing to advertise. */
export default function robots(): MetadataRoute.Robots {
  if (!BRAND.indexable) return { rules: [{ userAgent: "*", ...ALL }] };
  return {
    rules: [{ userAgent: "*", ...ALL }, ...AI_CRAWLERS.map((userAgent) => ({ userAgent, ...ALL }))],
    sitemap: SITE_URL + "/sitemap.xml",
  };
}
