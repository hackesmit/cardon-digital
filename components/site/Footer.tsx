import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/i18n/site";

export default function Footer({ locale }: { locale: Locale }) {
  const s = site[locale];
  const t = s.footer;
  const href = (path: string) => localePath(locale, path);
  const links = [
    { href: href("/work/monte-xanic"), label: t.work },
    { href: href("/#services"), label: t.services },
    { href: href("/#sectors"), label: t.industries },
    { href: href("/about"), label: t.about },
    { href: href("/contacto"), label: t.contact },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="foot-brand">
            <Link className="brand" href={href("/")} aria-label={s.brandHome}>
              <svg
                className="brand-mark"
                viewBox="0 0 26 26"
                aria-hidden="true"
                focusable="false"
              >
                <line
                  className="bm-line"
                  x1="13"
                  y1="20"
                  x2="6"
                  y2="8"
                  strokeWidth="1.2"
                  opacity="0.7"
                />
                <line
                  className="bm-line"
                  x1="13"
                  y1="20"
                  x2="20"
                  y2="8"
                  strokeWidth="1.2"
                  opacity="0.7"
                />
                <line
                  className="bm-line"
                  x1="6"
                  y1="8"
                  x2="20"
                  y2="8"
                  strokeWidth="1.2"
                  opacity="0.55"
                />
                <circle className="bm-ring" cx="6" cy="8" r="3" strokeWidth="1.4" />
                <circle
                  className="bm-ring"
                  cx="20"
                  cy="8"
                  r="3"
                  strokeWidth="1.4"
                />
                <circle className="bm-dot" cx="13" cy="20" r="3.4" />
              </svg>
              <span className="brand-name">
                Cardon <span>Digital</span>
              </span>
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
          <span>{t.bottom}</span>
          <nav className="foot-legal" aria-label={t.legalLabel}>
            <Link href={href("/privacy")}>{t.privacy}</Link>
            <Link href={href("/terms")}>{t.terms}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
