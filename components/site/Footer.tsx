import Link from "next/link";

const links = [
  { href: "/work/monte-xanic", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#sectors", label: "Industries" },
  { href: "/#about", label: "About" },
  { href: "/#diagnostic", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="container">
        <div className="footer-grid">
          <div className="foot-brand">
            <Link className="brand" href="/" aria-label="Cardon Digital home">
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
            <p className="foot-line">
              Built in Baja California. Working both sides of the border, in both
              languages.
            </p>
            <p className="foot-tag">Built to hold water</p>
          </div>
          <div>
            <nav className="foot-nav" aria-label="Footer">
              {links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="foot-bottom">
          <span>Cardon Digital, 2026. Five slots, senior hands.</span>
          <nav className="foot-legal" aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
