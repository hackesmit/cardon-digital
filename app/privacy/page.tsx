import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Cardon Digital handles personal information: what we collect, what we never collect, and the rights you have.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="pg-legal">
      <div className="legal-wrap">
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-meta">Effective 2026-07-21. Applies to cardondigital.com.</p>

        <p>
          Cardon Digital is a growth-systems practice based in Baja California, Mexico, working with
          clients in Mexico and the United States. This policy explains what information this website
          handles, what we deliberately do not collect, and the rights you have. It is written to be
          read, not skimmed past.
        </p>

        <h2>What this site does not do</h2>
        <ul>
          <li>No advertising pixels, no third-party analytics, no tracking cookies.</li>
          <li>No accounts, no forms that feed marketing databases, no data resale of any kind.</li>
          <li>No content from third-party servers: pages are self-contained.</li>
        </ul>

        <h2>What is stored on your device</h2>
        <p>
          One value in your browser's local storage: your light-or-dark display preference. It never
          leaves your device, identifies nobody, and you can clear it at any time through your
          browser settings. Because we set no tracking cookies, this site shows no cookie banner;
          under the EU ePrivacy rules this kind of purely functional storage is exempt from consent
          requirements.
        </p>

        <h2>What we receive if you contact us</h2>
        <p>
          The contact links on this site open your own email client. If you write to us we receive
          your email address and whatever you choose to tell us. We use it to reply and, if we end up
          working together, to deliver the work. We keep correspondence as ordinary business records,
          we do not add you to mailing lists you did not ask for, and we never sell or share your
          details for marketing.
        </p>

        <h2>Hosting and server logs</h2>
        <p>
          This site is served by a hosting provider that, like all hosts, processes standard technical
          logs (IP address, browser type, pages requested) for security and reliability. We do not use
          these logs to profile visitors.
        </p>

        <h2>Client data</h2>
        <p>
          In client engagements we routinely work inside business systems that contain personal data
          (for example customer or applicant records). That data is processed under the client's
          instructions and our written agreement with them: access is limited to the people doing the
          work, it is used only to deliver the engagement, and it is never extracted for any other
          purpose. Questions about a specific company's data should go to that company; we support
          our clients in answering them.
        </p>

        <h2>Your rights</h2>
        <p>
          Under Mexico's Federal Law on Protection of Personal Data (LFPDPPP) you have the rights of
          access, rectification, cancellation, and objection (ARCO). If you are in the European
          Economic Area or the United Kingdom, the GDPR gives you similar rights of access,
          correction, deletion, restriction, portability, and objection; where we process
          correspondence, we do so on the basis of legitimate interest in responding to you.
          California residents: we do not sell or share personal information as those terms are
          defined in the CCPA. To exercise any right, email us and we will respond within the legal
          timeframe.
        </p>

        <h2>Contact</h2>
        <p>
          <a href="mailto:hello@cardondigital.com">hello@cardondigital.com</a>
        </p>

        <div className="legal-note">
          <p>
            If we ever add analytics or any other data collection to this site, this policy will be
            updated first and the change will be visible here, with a new effective date.
          </p>
        </div>
      </div>
    </main>
  );
}
