"use client";

import { useState } from "react";
import { useDict, useLocale } from "@/lib/i18n/LocaleProvider";
import { consent as copy } from "@/lib/i18n/consent";
import { localePath } from "@/lib/i18n/config";
import { writeConsent } from "@/lib/analytics/consent";
import { loadMeasurement } from "@/lib/analytics/gtag";
import "./consent.css";

/**
 * The consent notice. The server only renders it when a measurement id exists
 * and the visitor has not decided yet, so this component never has to ask
 * whether it belongs on the page.
 *
 * Accepting loads the tag in place rather than reloading, so the answer costs
 * the visitor nothing; declining writes the same cookie so the question is not
 * asked again on the next page.
 */
export default function ConsentBanner() {
  const [gone, setGone] = useState(false);
  const t = useDict(copy);
  const locale = useLocale();

  if (gone) return null;

  function accept() {
    writeConsent("granted");
    loadMeasurement();
    setGone(true);
  }

  function decline() {
    writeConsent("denied");
    setGone(true);
  }

  return (
    <aside className="consent" role="region" aria-label={t.label}>
      <div className="consent-card">
        <div className="consent-text">
          <p className="consent-title">{t.title}</p>
          <p className="consent-body">{t.body}</p>
          <a className="consent-link" href={localePath(locale, "/privacy")}>
            {t.privacy}
          </a>
        </div>
        <div className="consent-actions">
          <button type="button" className="cta cta-sm" onClick={accept}>
            {t.accept}
          </button>
          <button type="button" className="consent-decline" onClick={decline}>
            {t.decline}
          </button>
        </div>
      </div>
    </aside>
  );
}
