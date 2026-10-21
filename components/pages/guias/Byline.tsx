import Link from "next/link";
import { formatDate } from "@/components/site/CredentialList";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Credential } from "@/lib/credentials";
import type { GuiasDict } from "@/lib/i18n/guias";

/**
 * Who wrote the guide and when (bead hq-i4b5.11): the named author, his role,
 * the publish and update dates as <time> elements carrying the same ISO days
 * the Article markup states, and, in `Bio`, the short bio that points to
 * /about and to the issuer's own page for each certificate he holds.
 */
export function Byline({
  locale,
  copy,
  datePublished,
  dateModified,
}: {
  locale: Locale;
  copy: GuiasDict["article"];
  datePublished: string;
  dateModified: string;
}) {
  return (
    <div className="guide-byline">
      <p className="guide-author">
        {copy.by}{" "}
        <Link rel="author" href={localePath(locale, "/about")}>
          Daniel Hack
        </Link>
        <span className="guide-role">{copy.role}</span>
      </p>
      <p className="guide-dates">
        <span>
          {copy.published}{" "}
          <time dateTime={datePublished}>
            {formatDate(datePublished, locale)}
          </time>
        </span>
        <span>
          {copy.updated}{" "}
          <time dateTime={dateModified}>
            {formatDate(dateModified, locale)}
          </time>
        </span>
      </p>
    </div>
  );
}

export function Bio({
  locale,
  copy,
  credentials,
}: {
  locale: Locale;
  copy: GuiasDict["article"];
  credentials: readonly Credential[];
}) {
  return (
    <aside className="guide-bio" aria-label="Daniel Hack">
      {credentials.map((c) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="guide-bio-badge"
          key={c.id}
          src={c.badgeSrc}
          alt={c.alt[locale]}
          width={72}
          height={72}
          loading="lazy"
          decoding="async"
        />
      ))}
      <div>
        <p>{copy.bio}</p>
        <p className="guide-bio-links">
          <Link href={localePath(locale, "/about")}>{copy.about}</Link>
          {credentials.map((c) => (
            <a key={c.id} href={c.verifyUrl} target="_blank" rel="noopener noreferrer">
              {copy.certificate}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          ))}
        </p>
      </div>
    </aside>
  );
}
