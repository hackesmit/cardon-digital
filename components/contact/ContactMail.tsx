"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { contact } from "@/lib/i18n/contact";
import { rich } from "@/lib/i18n/rich";
import {
  EMPTY_ATTRIBUTION,
  readAttribution,
  type Attribution,
} from "@/lib/contact/attribution";
import { MAIL_ADDRESS, mailtoHref } from "@/lib/contact/links";

/**
 * The written door when this environment cannot deliver mail: a plain mailto
 * instead of the form.
 *
 * The form is only rendered when RESEND_API_KEY and both addresses are set,
 * because a form that accepts a message nobody can read would promise an
 * answer the site cannot give. This door promises nothing it cannot keep: the
 * message leaves from the visitor's own mail program and the copy stays with
 * them.
 *
 * Attribution is client-only, so the link renders plain first and picks up
 * the campaign marks in an effect, exactly as the WhatsApp door does.
 */
export default function ContactMail() {
  const locale = useLocale();
  const d = contact[locale].mail;
  const [attribution, setAttribution] = useState<Attribution>(EMPTY_ATTRIBUTION);

  useEffect(() => {
    setAttribution(readAttribution());
  }, []);

  return (
    <div className="mail-door">
      <p className="mail-body">{rich(d.body)}</p>
      <a className="cta" href={mailtoHref(d.subject, attribution)}>
        {MAIL_ADDRESS}
      </a>
      <p className="mail-note">{d.note}</p>
    </div>
  );
}
