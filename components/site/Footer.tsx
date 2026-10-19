import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/i18n/site";
import { estilos } from "@/lib/i18n/estilos";
import { Logo } from "@/components/site/Mark";
import FooterScene from "@/components/site/FooterScene";

export default function Footer({ locale }: { locale: Locale }) {
  const s = site[locale];
  const t = s.footer;
  const href = (path: string) => localePath(locale, path);
  // The arc of 2026-09-28: the footer carries the same flat list as the nav,
  // the three services and the winery page first, then pricing, the cases,
  // about and contact.
  const links = [
    { href: href("/sitios-web"), label: s.nav.sitios },
    // The gallery of style samples, named by its own dictionary (see Nav.tsx).
    { href: href("/estilos"), label: estilos[locale].navLabel },
    { href: href("/anuncios"), label: s.nav.anuncios },
    { href: href("/software"), label: s.nav.software },
    { href: href("/industries/winery"), label: s.nav.wineries },
    { href: href("/precios"), label: s.nav.pricing },
    { href: href("/work/monte-xanic"), label: t.work },
    { href: href("/about"), label: t.about },
    { href: href("/contacto"), label: t.contact },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="foot-brand">
            <Link className="brand" href={href("/")} aria-label={s.brandHome}>
              <Logo variant="wordmark" className="brand-logo" />
            </Link>
            <p className="foot-line">{t.line}</p>
            <p className="foot-tag">{s.brandline}</p>
          </div>
          <div>
            <nav className="foot-nav" aria-label={t.label}>
              {links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="foot-bottom">
          <nav className="foot-legal" aria-label={t.legalLabel}>
            <Link href={href("/privacy")}>{t.privacy}</Link>
            <Link href={href("/terms")}>{t.terms}</Link>
          </nav>
        </div>
      </div>
      <FooterScene />
    </footer>
  );
}
