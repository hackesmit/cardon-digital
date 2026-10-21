import type { Locale } from "@/lib/i18n/config";
import type { Credential } from "@/lib/credentials";
import "./credential-float.css";

/**
 * The certificate badge that hangs by the home hero title (bead hq-i4b5.5).
 *
 * WHERE IT SITS. The hero has an empty band above the title on the right: the
 * eyebrow is short and left aligned, and the title starts 90 to 116px under
 * the header at every width from 360 to 1920 (measured). The component renders
 * a zero-height anchor between the eyebrow and the h1, so its top edge IS the
 * title's top edge, and the badge hangs from it upward into that band. It
 * therefore cannot cover the title, the action or any line of copy at any
 * width, and it moves nothing: the anchor has no height and no margin, so the
 * title starts on the same pixel with or without it (the test holds both).
 *
 * WHAT IT SHOWS. The issuer's emblem only, cut from HubSpot's badge image (the
 * full image is black type on white, which dies in dark mode and reads as a
 * stock trust seal), inside a pen-drawn ring in the site's own ink. The words
 * live in the accessible name and in a short caption that hover or keyboard
 * focus reveals beside it.
 *
 * Every fact comes from lib/credentials.ts. The strings here are the verb of
 * the link, which is the same for any certificate, so a new certificate is
 * still one entry in that file. No client JS: the drift and the hover are CSS.
 */

/** The link's verb, said after the certificate's name. The caption names
    the issuer from the credential, so another issuer needs no edit here. */
export const VERIFY: Record<Locale, { caption: (issuer: string) => string; label: string }> = {
  es: {
    caption: (issuer) => `Verificar en ${issuer}`,
    label: "verificar en una pestaña nueva",
  },
  en: {
    caption: (issuer) => `Verify on ${issuer}`,
    label: "verify in a new tab",
  },
};

/** The accessible name: the certificate, then what the link does. */
export function credentialLabel(credential: Credential, locale: Locale): string {
  return `${credential.name[locale]}, ${VERIFY[locale].label}`;
}

/** The emblem file's own size, so the box is reserved before it loads. */
export const BADGE_PX = 144;

/* One loop of a pen around the emblem, overshooting where it closes, the way a
   hand circles something on paper. 100 unit box, drawn once, scaled by CSS. */
const RING_D =
  "M51 5.5C76 4.5 95.5 23 94.5 50.5C93.5 77 74 95.5 48.5 94.5C23.5 93.5 5 75 6 49.5C7 25.5 25 8 53 7.5C63 7.5 71 10.5 77.5 15";

export default function CredentialFloat({
  credential,
  locale,
}: {
  credential: Credential;
  locale: Locale;
}) {
  return (
    <div className="cred-float">
      <a
        className="cred-float-link"
        href={credential.verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={credentialLabel(credential, locale)}
      >
        <span className="cred-float-art">
          <svg className="cred-float-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <path d={RING_D} />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cred-float-img"
            src={credential.badgeSrc}
            alt={credential.alt[locale]}
            width={BADGE_PX}
            height={BADGE_PX}
            loading="lazy"
            decoding="async"
          />
        </span>
        <span className="cred-float-caption mono" aria-hidden="true">
          {VERIFY[locale].caption(credential.issuer.name)}
        </span>
      </a>
    </div>
  );
}
