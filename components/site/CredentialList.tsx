import type { Locale } from "@/lib/i18n/config";
import type { Credential } from "@/lib/credentials";
import { BADGE_PX, VERIFY, credentialLabel } from "./CredentialFloat";
import "./credential-list.css";

/**
 * The certificates in full on /about, and as a small linked row in the footer
 * (bead hq-i4b5.8). The third reader of lib/credentials.ts after the founder's
 * JSON-LD and the home hero badge (CredentialFloat.tsx).
 *
 * Every fact comes from lib/credentials.ts: name, holder, issuer, dates, code,
 * what it attests, the badge and the verification page. The /about labels come
 * from that page's dictionary; the link's verb is the one the hero badge says,
 * so a new certificate is still one entry in lib/credentials.ts. No client JS.
 */

/** The footer row's name, for a screen reader moving through the footer. */
export const ROW_LABEL: Record<Locale, string> = {
  es: "Certificaciones",
  en: "Certificates",
};

/** The /about labels, from lib/i18n/about.ts. */
export type CredentialCopy = {
  issuer: string;
  holder: string;
  valid: string;
  /** Holds {from} and {until}, filled with the formatted dates. */
  validRange: string;
  code: string;
  /** Read after the link text, for a screen reader only. */
  newTab: string;
};

/** A certificate date, written out as each locale writes a date. The dates are
    plain calendar days, so they are read and written in UTC and never shift. */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso + "T00:00:00Z"));
}

export default function CredentialList({
  credentials,
  locale,
  copy,
}: {
  credentials: readonly Credential[];
  locale: Locale;
  copy: CredentialCopy;
}) {
  const [before, between, after] = copy.validRange.split(/\{from\}|\{until\}/);
  return (
    <ul className="cred-list">
      {credentials.map((c) => (
        <li className="cred-card" key={c.id}>
          {/* The name beside it says what the badge is, so the image is
              decoration here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cred-card-badge"
            src={c.badgeSrc}
            alt=""
            width={BADGE_PX}
            height={BADGE_PX}
            loading="lazy"
            decoding="async"
          />
          <div className="cred-card-body">
            <h3 className="cred-card-name">{c.name[locale]}</h3>
            <p className="cred-card-attests">{c.attests[locale]}</p>
            <dl className="cred-card-facts">
              <div>
                <dt className="mono">{copy.holder}</dt>
                <dd>{c.holder}</dd>
              </div>
              <div>
                <dt className="mono">{copy.issuer}</dt>
                <dd>{c.issuer.name}</dd>
              </div>
              <div>
                <dt className="mono">{copy.valid}</dt>
                <dd>
                  {before}
                  <time dateTime={c.validFrom}>{formatDate(c.validFrom, locale)}</time>
                  {between}
                  <time dateTime={c.validUntil}>{formatDate(c.validUntil, locale)}</time>
                  {after}
                </dd>
              </div>
              <div>
                <dt className="mono">{copy.code}</dt>
                <dd className="cred-card-code mono">{c.code}</dd>
              </div>
            </dl>
            <a
              className="cred-card-verify"
              href={c.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {VERIFY[locale].caption(c.issuer.name)}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The small row of linked badges at the foot of every page. */
export function CredentialRow({
  credentials,
  locale,
}: {
  credentials: readonly Credential[];
  locale: Locale;
}) {
  return (
    <ul className="cred-row" aria-label={ROW_LABEL[locale]}>
      {credentials.map((c) => (
        <li key={c.id}>
          <a
            className="cred-row-link"
            href={c.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={credentialLabel(c, locale)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cred-row-badge"
              src={c.badgeSrc}
              alt={c.alt[locale]}
              width={BADGE_PX}
              height={BADGE_PX}
              loading="lazy"
              decoding="async"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
