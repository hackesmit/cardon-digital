import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/components/site/CredentialList";
import JsonLd from "@/components/site/JsonLd";
import { GUIDES, guidePath } from "@/lib/guides";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { guias } from "@/lib/i18n/guias";
import { pageMetadata } from "@/lib/i18n/metadata";
import { breadcrumbLd, ldGraph } from "@/lib/seo/jsonld";
import "@/components/pages/guias/guias.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/guias", guias[locale].meta);
}

/**
 * The guides index (bead hq-i4b5.11): what the section is in one answer-first
 * paragraph, then every guide in lib/guides, newest first, each with its
 * question, its opening answer, its author and its update date. Not in the
 * nav (out of scope for the bead); the footer links here.
 */
export default function GuiasPage({ params }: Params) {
  const locale = localeOf(params);
  const t = guias[locale];
  const href = (path: string) => localePath(locale, path);

  return (
    <main id="main" className="pg-guide pg-guias">
      <JsonLd
        data={ldGraph([
          breadcrumbLd([
            { name: t.crumbs.home, url: href("/") },
            { name: t.crumbs.index, url: href("/guias") },
          ]),
        ])}
      />
      <section className="guide container" aria-label={t.index.aria}>
        <header className="guide-head">
          <nav className="crumbs" aria-label={t.crumbs.aria}>
            <ol>
              <li>
                <Link href={href("/")}>{t.crumbs.home}</Link>
              </li>
              <li aria-current="page">{t.crumbs.index}</li>
            </ol>
          </nav>
          <p className="eyebrow">{t.index.eyebrow}</p>
          <h1>{t.index.title}</h1>
          <p className="guide-lede">{t.index.sub}</p>
        </header>

        <h2 className="guias-list-title">{t.index.listTitle}</h2>
        <ul className="guias-list">
          {GUIDES.map((guide) => {
            const g = guide.copy[locale];
            const path = href(guidePath(guide.slug));
            return (
              <li className="guias-card" key={guide.slug}>
                <h3>
                  <Link href={path}>{g.title}</Link>
                </h3>
                <p>{g.lede}</p>
                <p className="guias-meta">
                  {t.article.by} Daniel Hack.{" "}
                  {t.article.updated}{" "}
                  <time dateTime={guide.dateModified}>{formatDate(guide.dateModified, locale)}</time>
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
