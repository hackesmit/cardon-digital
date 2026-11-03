import type { Metadata } from "next";
import Link from "@/components/site/Link";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { site } from "@/lib/i18n/site";
import { BRAND } from "@/lib/brand";
import "@/app/[locale]/home.css";

type Params = { params: Promise<{ locale: string }> };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

/**
 * The wine brand's home page, a placeholder (bead hq-3f6ut.1). It says what
 * the brand is in the lines the chrome already carries and points at the
 * modules, the demos and the contact page; its own copy and layout are bead
 * hq-3f6ut.2. It ships only behind noindex until the brand has its domain.
 */
export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const locale = localeOf(params);
  return pageMetadata(locale, "/", site[locale].meta, true);
}

export default async function HomeVino(props: Params) {
  const params = await props.params;
  const locale = localeOf(params);
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);

  return (
    <main id="main" className="pg-home">
      <section className="hero">
        <div className="hero-stage">
          <div className="container">
            <div className="hero-copy">
              <p className="eyebrow">{BRAND.endorsement?.[locale]}</p>
              <h1>{BRAND.name}</h1>
              <p className="hero-sub">{s.meta.description}</p>
              <div className="hero-actions">
                <Link className="cta" href={href("/contacto")}>
                  {s.nav.contact}
                </Link>
              </div>
              <p className="hero-proof">
                <Link href={href("/software")}>{s.nav.modules}</Link>
                {" "}
                <Link href={href("/demos")}>{s.nav.demos}</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
