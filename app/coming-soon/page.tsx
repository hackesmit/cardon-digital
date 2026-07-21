import type { Metadata } from "next";
import "./soon.css";

export const metadata: Metadata = {
  title: "Cardon Digital",
  description: "Growth systems for owner-run businesses in the US and Mexico. The full site is on its way.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <main id="main" className="pg-soon">
      <div className="soon-wrap">
        <svg className="soon-mark" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
          <line x1="13" y1="20" x2="6" y2="8" strokeWidth="1.2" opacity="0.75" />
          <line x1="13" y1="20" x2="20" y2="8" strokeWidth="1.2" opacity="0.75" />
          <line x1="6" y1="8" x2="20" y2="8" strokeWidth="1.2" opacity="0.55" />
          <circle className="ring" cx="6" cy="8" r="3" strokeWidth="1.4" />
          <circle className="ring" cx="20" cy="8" r="3" strokeWidth="1.4" />
          <circle className="dot" cx="13" cy="20" r="3.4" />
        </svg>
        <h1>Cardon <span>Digital</span></h1>
        <p className="soon-line">Your ads, your site, your operations. One living system.</p>
        <p className="soon-sub">The full site is being assembled. If you would rather not wait:</p>
        <a className="soon-cta" href="mailto:daniel@cardondigital.com?subject=Growth%20Diagnostic">daniel@cardondigital.com</a>
        <p className="soon-brandline">Built to hold water</p>
      </div>
    </main>
  );
}
