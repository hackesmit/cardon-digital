import { MAIL_ADDRESS } from "@/lib/contact/links";
import { SITE_URL } from "@/lib/i18n/metadata";

/**
 * When this file stops being true. RFC 9116 asks for less than a year ahead so
 * a stale contact is noticed; security.test.ts fails from 30 days before this
 * date, which is the reminder to check the address and move the date forward.
 */
export const EXPIRES = "2027-10-01T00:00:00.000Z";

/** /.well-known/security.txt (RFC 9116): where to report a vulnerability. */
export function securityTxt(): string {
  return [
    "Contact: mailto:" + MAIL_ADDRESS,
    "Expires: " + EXPIRES,
    "Preferred-Languages: es, en",
    "Canonical: " + SITE_URL + "/.well-known/security.txt",
    "",
  ].join("\n");
}
