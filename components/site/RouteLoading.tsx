"use client";

import MarkLoader from "@/components/site/MarkLoader";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { site } from "@/lib/i18n/site";

/**
 * The route fallback's body. A client component only so it can read the active
 * locale for the status line; the drawing itself is CSS and needs no script.
 */
export default function RouteLoading() {
  const s = useDict(site);
  return (
    <div className="ml-route">
      <p className="sr-only" role="status">
        {s.loading}
      </p>
      <MarkLoader className="ml-route-mark" />
    </div>
  );
}
