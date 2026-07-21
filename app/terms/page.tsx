import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern use of cardondigital.com and how engagements with Cardon Digital are agreed.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main id="main" className="pg-legal">
      <div className="legal-wrap">
        <p className="eyebrow">Legal</p>
        <h1>Terms of Service</h1>
        <p className="legal-meta">Effective 2026-07-21. Applies to cardondigital.com.</p>

        <p>
          These terms govern your use of this website. By using the site you accept them. They are
          short because the site is simple: it describes what we do and how to reach us.
        </p>

        <h2>What this site is</h2>
        <p>
          Informational. The pages describe our services, our approach, and work we have done.
          Nothing here is a binding offer, a guarantee of results, or professional advice for your
          specific situation. Illustrative visuals are labeled as such and do not depict client data.
        </p>

        <h2>The Growth Diagnostic and engagements</h2>
        <p>
          The free Growth Diagnostic is offered as described on the site: a fixed window of review
          work resulting in a written memo, with no obligation on either side. Any engagement beyond
          it, including scope, pricing, confidentiality, and data handling, is agreed in a separate
          written proposal or contract before work begins. Where the site describes pricing in
          proportion to performance, the exact basis and percentages are set in that written
          agreement. If these terms and a signed agreement conflict, the signed agreement wins.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The design, text, graphics, and code of this site belong to Cardon Digital. Client names
          and marks mentioned on the site belong to their owners and appear in reference to real work
          performed for them. You may link to the site freely; do not republish its content as your
          own.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Do not attempt to disrupt the site, probe it for vulnerabilities beyond good-faith
          reporting, scrape it into misleading contexts, or use it to misrepresent an affiliation
          with us. Good-faith security reports are welcome by email.
        </p>

        <h2>No warranty and limitation of liability</h2>
        <p>
          The site is provided as is. We work to keep it accurate and available but do not warrant
          that it is error-free or uninterrupted. To the fullest extent permitted by law, Cardon
          Digital is not liable for indirect or consequential damages arising from use of the site.
          Nothing in these terms limits liability that cannot be limited by law.
        </p>

        <h2>Governing law</h2>
        <p>
          These website terms are governed by the laws of Mexico, State of Baja California. Client
          engagements may agree different governing law in their written contract.
        </p>

        <h2>Changes and contact</h2>
        <p>
          We may update these terms; the effective date above changes when we do. Questions:
          {" "}
          <a href="mailto:hello@cardondigital.com">hello@cardondigital.com</a>.
        </p>
      </div>
    </main>
  );
}
