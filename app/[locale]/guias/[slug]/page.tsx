import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/site/CredentialList";
import Faq from "@/components/site/Faq";
import JsonLd from "@/components/site/JsonLd";
import { Bio, Byline } from "@/components/pages/guias/Byline";
import GuideBlocks from "@/components/pages/guias/GuideBlocks";
import { CREDENTIALS } from "@/lib/credentials";
import { GUIDES, guideBySlug, guidePath } from "@/lib/guides";
import { isLocale, localePath, locales, type Locale } from "@/lib/i18n/config";
import { guias } from "@/lib/i18n/guias";
import { pageMetadata } from "@/lib/i18n/metadata";
import { BASELINE } from "@/lib/i18n/visibilidad-ia";
import { articleLd, breadcrumbLd, ldGraph } from "@/lib/seo/jsonld";
import "@/components/pages/guias/guias.css";

type Params = { params: Promise<{ locale: string; slug: string }> };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateStaticParams() {
  return locales.flatMap((locale) => GUIDES.map((g) => ({ locale, slug: g.slug })));
}

export const dynamicParams = false;

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const guide = guideBySlug(params.slug);
  if (!guide) return {};
  const locale = localeOf(params);
  const meta = pageMetadata(locale, guidePath(guide.slug), guide.copy[locale].meta);
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      authors: ["Daniel Hack"],
    },
  };
}

/** Fills {key} placeholders from our measured baseline, the date written as
    the locale writes one (the same filler /visibilidad-ia uses). */
function fillBaseline(template: string, locale: Locale): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => {
    if (key === "date") return formatDate(BASELINE.date, locale);
    const v = (BASELINE as Record<string, string | number>)[key];
    return v === undefined ? m : String(v);
  });
}

/**
 * One guide (bead hq-i4b5.11, AEO spec in
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md). Answer first: the lede
 * right after the H1 is the 40 to 60 word answer, and the Article markup
 * describes the guide in those same words. Then the byline with both dates,
 * the question sections, the author's bio, the sources, the FAQ with its
 * FAQPage markup. The trail on screen is the BreadcrumbList.
 */
export default async function GuidePage(props: Params) {
  const params = await props.params;
  const guide = guideBySlug(params.slug);
  if (!guide) notFound();
  const locale = localeOf(params);
  const g = guide.copy[locale];
  const t = guias[locale];
  const href = (path: string) => localePath(locale, path);
  const here = href(guidePath(guide.slug));
  const fill = (s: string) => fillBaseline(s, locale);

  return (
    <main id="main" className="pg-guide">
      <JsonLd
        data={ldGraph([
          articleLd({
            locale,
            headline: g.title,
            description: g.lede,
            url: here,
            datePublished: guide.datePublished,
            dateModified: guide.dateModified,
          }),
          breadcrumbLd([
            { name: t.crumbs.home, url: href("/") },
            { name: t.crumbs.index, url: href("/guias") },
            { name: g.meta.title, url: here },
          ]),
        ])}
      />

      <article className="guide container">
        <header className="guide-head">
          <nav className="crumbs" aria-label={t.crumbs.aria}>
            <ol>
              <li>
                <Link href={href("/")}>{t.crumbs.home}</Link>
              </li>
              <li>
                <Link href={href("/guias")}>{t.crumbs.index}</Link>
              </li>
              <li aria-current="page">{g.meta.title}</li>
            </ol>
          </nav>
          <p className="eyebrow">{g.eyebrow}</p>
          <h1>{g.title}</h1>
          <p className="guide-lede">{g.lede}</p>
          <Byline
            locale={locale}
            copy={t.article}
            datePublished={guide.datePublished}
            dateModified={guide.dateModified}
          />
        </header>

        <nav className="guide-toc" aria-labelledby="toc-title">
          <h2 id="toc-title" className="guide-toc-title">
            {t.article.tocTitle}
          </h2>
          <ol>
            {g.sections.map((s) => (
              <li key={s.id}>
                <a href={"#" + s.id}>{s.h}</a>
              </li>
            ))}
          </ol>
        </nav>

        <GuideBlocks sections={g.sections} locale={locale} fill={fill} />

        <Bio locale={locale} copy={t.article} credentials={CREDENTIALS} />

        <section className="guide-sources" id="fuentes" aria-labelledby="fuentes-h">
          <h2 id="fuentes-h">{t.article.sourcesTitle}</h2>
          <p>{t.article.sourcesLead}</p>
          <ol>
            {g.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                  <span className="sr-only"> {t.article.newTab}</span>
                </a>
                <span className="guide-source-pub">{s.publisher}</span>
                <span className="guide-source-note">{s.note}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="guide-faq">
          <Faq title={g.faq.title} items={g.faq.items} />
        </div>
      </article>
    </main>
  );
}
