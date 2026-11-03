import { BRAND } from "../brand";

/**
 * A page dictionary's wine-brand variant (bead hq-3f6ut.2). The wine pages
 * that move to the wine brand's own site keep their copy, so each dictionary
 * declares only the strings that differ there, as `enVino` and `esVino` beside
 * its `en` and `es`. scripts/copy-check.mjs reads those declarations as the
 * same locale, so the variant is held to the same rules.
 *
 * Objects merge key by key; a string or an array in the variant replaces the
 * base whole, so a list (cards, FAQ items) is always written out in full.
 */
export type Variant<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: Variant<T[K]> }
    : T;

const isPlain = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function withVariant<T>(base: T, over: NoInfer<Variant<T>>): T {
  if (!isPlain(base) || !isPlain(over)) return over as T;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined) continue;
    out[k] = k in base ? withVariant((base as Record<string, unknown>)[k], v as never) : v;
  }
  return out as T;
}

/**
 * Every "{brand}" in a dictionary becomes the build brand's name, read from
 * lib/brand.ts, so no copy types the wine brand's name (it is a placeholder
 * until the brand is named). Strings at any depth; keys and other values are
 * left alone.
 */
export function branded<T>(value: T, name: string = BRAND.name): T {
  if (typeof value === "string") return value.split("{brand}").join(name) as T;
  if (Array.isArray(value)) return value.map((v) => branded(v, name)) as T;
  if (isPlain(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = branded(v, name);
    return out as T;
  }
  return value;
}

/** A page's FAQ block, rendered by components/site/Faq.tsx with its FAQPage
    markup. The moved wine pages carry one on the wine brand only. */
export type FaqBlock = { title: string; items: { question: string; answer: string }[] };

/** A wine-brand-only dictionary: the locales on vino, null on cardon, so
    cardondigital.com renders exactly what it did. */
export function vinoOnly<T>(dict: { en: T; es: T }): { en: T; es: T } | null {
  return BRAND.id === "vino" ? branded(dict) : null;
}
