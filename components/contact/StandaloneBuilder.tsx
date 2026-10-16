"use client";

import { useState } from "react";
import PackageBuilder from "@/components/contact/PackageBuilder";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { builder } from "@/lib/i18n/builder";
import { EMPTY_SELECTION, type BuilderSelection } from "@/lib/builder";

/**
 * The package builder on /precios, folded into one expandable box under its
 * own heading. It keeps its own selection and hands it to /contacto through
 * the "send this package" link.
 */
export default function StandaloneBuilder() {
  const locale = useLocale();
  const d = builder[locale];
  const [pkg, setPkg] = useState<BuilderSelection>(EMPTY_SELECTION);
  return (
    <details className="pb-wrap pb-wrap-page">
      <summary className="pb-toggle">
        <span>{d.open}</span>
      </summary>
      <p className="pb-intro">{d.sub}</p>
      <PackageBuilder value={pkg} onChange={setPkg} mode="standalone" />
    </details>
  );
}
