/**
 * Structured data (schema.org JSON-LD) for answer engines and search.
 *
 * Every builder is pure: it takes the facts and returns one node, and
 * ldGraph() wraps nodes into the single @graph a page renders through
 * components/site/JsonLd.tsx. Nodes point at each other by @id, so the
 * organization, the site, the founder and his certificates read as one graph
 * no matter which page carries which piece.
 *
 * The rule from the AEO spec (bunkers/cardon-digital/research/2026-10/aeo):
 * markup states only what the site states. A field the repo has no fact for
 * (street address, phone, legal name) is left out, never filled in. sameAs is
 * empty until the profiles exist; an empty list is dropped rather than shipped.
 */
import { CREDENTIALS, type Credential } from "@/lib/credentials";
import { htmlLang, localePath, type Locale } from "@/lib/i18n/config";
import { plain } from "@/lib/i18n/rich";
import { SITE_URL } from "@/lib/i18n/metadata";

export type LdNode = { "@type": string | string[]; "@id"?: string; [key: string]: unknown };
export type LdGraph = { "@context": "https://schema.org"; "@graph": LdNode[] };
export type LdRef = { "@id": string };

export const ORGANIZATION_ID = SITE_URL + "/#organization";
export const FOUNDER_ID = SITE_URL + "/#founder";
export const websiteId = (locale: Locale) => SITE_URL + localePath(locale, "/") + "#website";
export const credentialId = (c: Credential) => SITE_URL + "/#credential-" + c.id;

const ref = (id: string): LdRef => ({ "@id": id });

/** A site path to an absolute URL; an absolute URL passes through. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return SITE_URL + (pathOrUrl.startsWith("/") ? pathOrUrl : "/" + pathOrUrl);
}

/** Public profiles of the business (LinkedIn, directories, Google Business
 *  Profile). None is live yet; the off-site beads add them here. */
export const SAME_AS: readonly string[] = [];

/** Where the practice works, as the site says it: Ensenada, Baja California. */
const AREA_SERVED: LdNode[] = [
  { "@type": "AdministrativeArea", name: "Baja California" },
  { "@type": "City", name: "Ensenada" },
];

const FOUNDER_TITLE: Record<Locale, string> = { es: "Fundador", en: "Founder" };

export function organizationLd(
  locale: Locale,
  opts: { sameAs?: readonly string[] } = {},
): LdNode {
  const sameAs = (opts.sameAs ?? SAME_AS).filter((u) => u.trim() !== "");
  return {
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: "Cardon Digital",
    url: SITE_URL + localePath(locale, "/"),
    logo: absoluteUrl("/apple-icon.png"),
    image: absoluteUrl("/og.png"),
    areaServed: AREA_SERVED,
    founder: ref(FOUNDER_ID),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteLd(locale: Locale): LdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId(locale),
    name: "Cardon Digital",
    url: SITE_URL + localePath(locale, "/"),
    inLanguage: htmlLang[locale],
    publisher: ref(ORGANIZATION_ID),
  };
}

/** One certificate as schema.org states it. EducationalOccupationalCredential
 *  has no validFrom or validUntil of its own, so the dates ride on the
 *  CreativeWork fields it inherits: dateCreated and expires. */
export function credentialLd(c: Credential, locale: Locale): LdNode {
  return {
    "@type": "EducationalOccupationalCredential",
    "@id": credentialId(c),
    name: c.name[locale],
    credentialCategory: "certificate",
    identifier: c.code,
    url: c.verifyUrl,
    dateCreated: c.validFrom,
    expires: c.validUntil,
    recognizedBy: { "@type": "Organization", name: c.issuer.name, url: c.issuer.url },
  };
}

export function founderLd(
  locale: Locale,
  credentials: readonly Credential[] = CREDENTIALS,
): LdNode {
  const held = credentials.filter((c) => c.holder === "Daniel Hack");
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: "Daniel Hack",
    jobTitle: FOUNDER_TITLE[locale],
    url: SITE_URL + localePath(locale, "/about"),
    worksFor: ref(ORGANIZATION_ID),
    ...(held.length > 0 ? { hasCredential: held.map((c) => credentialLd(c, locale)) } : {}),
  };
}

export function serviceLd(name: string, description: string, url: string): LdNode {
  return {
    "@type": "Service",
    "@id": absoluteUrl(url) + "#service",
    name: plain(name),
    description: plain(description),
    url: absoluteUrl(url),
    provider: ref(ORGANIZATION_ID),
    areaServed: AREA_SERVED,
  };
}

export type FaqItem = { question: string; answer: string };

/** The FAQ as markup. Dictionary strings carry the rich() markers, so both
 *  sides are flattened with plain(): the text here is the text on the page. */
export function faqPageLd(items: readonly FaqItem[]): LdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: plain(it.question),
      acceptedAnswer: { "@type": "Answer", text: plain(it.answer) },
    })),
  };
}

export type Crumb = { name: string; url: string };

export function breadcrumbLd(items: readonly Crumb[]): LdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plain(it.name),
      item: absoluteUrl(it.url),
    })),
  };
}

export function articleLd(a: {
  locale: Locale;
  headline: string;
  description: string;
  url: string;
  /** ISO dates, the same ones the page prints. */
  datePublished: string;
  dateModified?: string;
  image?: string;
}): LdNode {
  const url = absoluteUrl(a.url);
  return {
    "@type": "Article",
    "@id": url + "#article",
    headline: plain(a.headline),
    description: plain(a.description),
    url,
    mainEntityOfPage: url,
    inLanguage: htmlLang[a.locale],
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    // The founder's node, named here too: the byline prints the name, and a
    // reader of this node alone should not need the site graph to find it.
    author: {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: "Daniel Hack",
      url: SITE_URL + localePath(a.locale, "/about"),
    },
    publisher: ref(ORGANIZATION_ID),
    isPartOf: ref(websiteId(a.locale)),
    ...(a.image ? { image: absoluteUrl(a.image) } : {}),
  };
}

export function ldGraph(nodes: readonly LdNode[]): LdGraph {
  return { "@context": "https://schema.org", "@graph": [...nodes] };
}

/** The graph every page carries, injected once by the locale layout. */
export function siteGraph(locale: Locale): LdGraph {
  return ldGraph([organizationLd(locale), websiteLd(locale), founderLd(locale)]);
}

/**
 * JSON for the inside of a script tag. JSON.stringify leaves < and > alone, so
 * a string holding a closing script tag or an HTML comment opener would end
 * the tag and run whatever follows. Escaping <, > and & as \u sequences keeps
 * the JSON identical once parsed. U+2028 and U+2029 are escaped too: valid in
 * JSON, line terminators in older script parsers.
 */
export function serializeLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
