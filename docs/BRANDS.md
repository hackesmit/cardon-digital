# Brands: one codebase, two sites

Since 2026-11-03 (Daniel, epic hq-3f6ut) this repo builds two sites:

- **cardon**: cardondigital.com. Websites, Google Ads, AI visibility and
  custom software for any business.
- **vino**: the wine-software brand, endorsed by Cardon ("<Marca> por
  Cardon"), on its own domain. The software modules, the demos, the winery
  page, the Monte Xanic and Enkanto cases and the module pricing.

The brand is chosen at build time. Nothing switches at request time.

## The switch

| Variable | Values | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE` | `cardon`, `vino`, unset | Unset or empty means cardon. Any other value fails the build: `lib/brand-env.mjs` throws from `next.config.mjs` and from `lib/brand.ts`. |
| `NEXT_PUBLIC_SITE_URL` | `https://<domain>` | The wine brand's origin. Unset, malformed, or a `*.vercel.app` address keeps the wine brand noindex everywhere (see below). Ignored on cardon, whose origin is fixed. |
| `NEXT_PUBLIC_VINO_URL` | `https://<domain>` | Cardon only. Unset: cardon keeps serving the wine routes. Set: cardon 301s the wine routes to the same path on that domain and its nav and footer stop linking them. |

`lib/brand.ts` holds everything that differs per brand: name, short name,
endorsement line, origin, contact email, theme, route allowlist, nav and
footer entries, and the cross link to the other brand. Read brand strings
from there (`BRAND.name`, `BRAND.siteUrl`), never type them in copy. The wine
brand's name is not chosen yet; the working name in `lib/brand.ts` is a
placeholder that only ships behind noindex.

## Routes

Each brand lists the locale-free routes it serves (`CARDON_ROUTES`,
`VINO_ROUTES` in `lib/brand.ts`). The middleware answers any other route with
the site 404 by rewriting to a private path no page can match, even when the
page exists in the tree for the other brand. `"[slug]"` in a route matches
one path segment.

The wine routes leaving cardon (`MOVED_ROUTES`: on the vino list, not on
cardon's) keep serving on cardon until `NEXT_PUBLIC_VINO_URL` is set, then
redirect there with a 301 (`movedRoute` in `lib/routes.ts`). The retired
routes in `lib/routes.ts` redirect the same way on both brands.

Guides carry an optional `brand` field (`lib/guides/types.ts`); unset means
cardon. `GUIDES` is the build brand's guides only, so every reader of the
registry (the index, the template, the sitemap, llms.txt) sees only its own.
A brand with no guides answers 404 on `/guias` rather than an empty index.

### To give a brand a route

1. Add the page under `app/[locale]/` if it does not exist.
2. Add the route to that brand's list in `lib/brand.ts`. If it is a wine page
   leaving cardon, put it on the vino list only; it joins `MOVED_ROUTES` by
   itself.
3. Add its line to `app/sitemap.ts` (dated per the sitemap test) and, if it
   should be in llms.txt, to `app/llms.txt/llms.ts`. Both filter by brand.
4. Link it from the nav or footer through the brand's `nav`/`footer` lists.
5. `npm test`: `app/routes.test.ts` fails if a page belongs to no brand, a
   brand lists a route with no page, or a nav link points off the brand. It
   also runs the middleware for each brand over every route in the tree.

A route both brands serve (about, contact, pricing, legal, `/software`)
renders the same page file for both; the page reads `BRAND` or a per-brand
dictionary where its content differs. The home page dispatches:
`app/[locale]/page.tsx` renders `components/pages/home-cardon.tsx` or
`components/pages/home-vino.tsx` (copy in `lib/i18n/home-vino.ts`).

### Wine copy on a shared dictionary

The wine pages keep one dictionary each. Where the wine brand's page says
something else (its name, no website or ads offer, a diagnostic line about the
operation), the file declares only those strings as `enVino` and `esVino`
beside `en` and `es`, and exports `withVariant(en, enVino)` on vino and the
plain `en` on cardon (`lib/i18n/variant.ts`). A list in a variant replaces the
base list whole. A block only the wine brand carries (the FAQs of the winery
page, the two cases and the demos) is its own `enFaq`/`esFaq` declaration,
exported through `vinoOnly`, which is null on cardon.

Copy names the wine brand as `{brand}`; `branded` fills it from `BRAND.name`
when the module loads, so the name is typed nowhere and the copy checker
reads whole sentences. `scripts/copy-check.mjs` reads `enVino`, `esVino`,
`enFaq` and `esFaq` as their locale, so variants meet the same rules.

`app/vino-pages.test.tsx` renders every wine page on the vino build, with
the brand's name mocked to a sentinel, and fails on a link to a route vino
does not serve, a link to cardondigital.com in a page body, a page that types
the brand's name, a Cardon service offered on a wine page, or a moved page
missing the AEO checklist (title in 60 characters with the template, a 40 to
60 word answer first, an FAQ with FAQPage markup, descriptive alt text). A
shared page another bead still has to split sits in its `PENDING` list, which
fails once that page is clean so the entry cannot outlive the work.

## Indexing

cardondigital.com is always indexable (the preview and `COMING_SOON` gates are
separate and unchanged). The wine brand is indexable only once
`NEXT_PUBLIC_SITE_URL` names its own https domain. Until then:

- every response carries `X-Robots-Tag: noindex, nofollow` (`next.config.mjs`),
  and every page's robots meta says noindex (the locale layout);
- robots.txt allows everyone (a crawler must read a page to see its noindex)
  and points at no sitemap;
- the sitemap is empty and `/llms.txt` answers 404.

## Per-brand site files

The origin in canonical, hreflang, Open Graph, the sitemap, robots.txt,
llms.txt, security.txt and JSON-LD comes from `SITE_URL` (`lib/i18n/metadata.ts`),
which is `BRAND.siteUrl`. On vino the JSON-LD organization is the brand,
typed `Organization` and `Brand`, with `parentOrganization` Cardon Digital by
the `@id` cardondigital.com gives it, and no address. The manifest takes the
brand's name. Not yet per brand: the icons and the Open Graph image, which the
wine brand shares with Cardon until it has its own artwork.

## Security headers and CSP

Both brands run the same `middleware.ts` (nonce CSP) and `next.config.mjs`
headers. Prove a change with `lib/security/proof/csp-proof.mjs` against a
build of each brand. The script's default page list is cardon's; for vino
pass the wine pages in `PAGES`:

    PAGES=/es,/en,/es/software,/es/precios,/es/contacto,/es/demos,/es/industries/winery,/es/work/monte-xanic,/en/about,/es/privacy,/es/no-existe \
      node csp-proof.mjs http://localhost:3918

## The two Vercel projects

Both build from github.com/hackesmit/cardon-digital, branch `main`.

| Project | `NEXT_PUBLIC_SITE` | Domain |
| --- | --- | --- |
| cardon-digital | unset (cardon) | cardondigital.com |
| cardon-vino | `vino` | cardon-vino.vercel.app until the domain is bought (hq-3f6ut.6) |

When the wine domain is attached: set `NEXT_PUBLIC_SITE_URL` on cardon-vino
(the brand becomes indexable) and `NEXT_PUBLIC_VINO_URL` on cardon-digital
(the wine routes start redirecting), then redeploy both.

To build both locally into separate output directories, use two copies of the
tree (Next reads `distDir` from the config, not the environment), or build one
after the other:

    NEXT_PUBLIC_SITE=cardon npm run build
    NEXT_PUBLIC_SITE=vino npm run build
