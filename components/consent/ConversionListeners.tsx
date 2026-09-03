"use client";

import { useEffect } from "react";
import type { ConversionKind } from "@/lib/analytics/config";
import { trackContactSubmit, trackConversion } from "@/lib/analytics/events";

/**
 * Turns the three lead actions into conversions without any page owning the
 * wiring.
 *
 * Delegation rather than props on purpose: the contact system, the pricing
 * tables and the case pages are separate work, and a document-level listener
 * lets measurement land without a single edit inside them. Two ways to be
 * counted, in this order:
 *
 *   1. data-conversion="contact|whatsapp|booking" on a link, button or form.
 *      This is the contract for anything built later; it is explicit and it
 *      survives a change of provider.
 *   2. A recognised destination. WhatsApp, the booking providers and mailto
 *      links are counted as they are, so the CTAs already on the site report
 *      from the day the ids are set.
 */

const DESTINATIONS: Array<{ kind: ConversionKind; match: RegExp }> = [
  { kind: "whatsapp", match: /^(whatsapp:|https?:\/\/(api\.|web\.)?wa(\.me|tsapp\.com))/i },
  {
    kind: "booking",
    match: /^https?:\/\/([a-z0-9-]+\.)*(calendar\.app\.google|calendar\.google\.com|calendly\.com|cal\.com)/i,
  },
];

function kindFromAttribute(el: Element): ConversionKind | null {
  const value = el.getAttribute("data-conversion");
  if (value === "contact" || value === "whatsapp" || value === "booking") return value;
  return null;
}

function kindFromHref(href: string): ConversionKind | null {
  for (const d of DESTINATIONS) if (d.match.test(href)) return d.kind;
  return null;
}

export default function ConversionListeners() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      // A marked form counts on submit, never on the click that submits it,
      // otherwise the same lead is reported twice.
      const marked = target.closest("[data-conversion]");
      if (marked && marked.tagName !== "FORM") {
        const kind = kindFromAttribute(marked);
        if (kind) {
          trackConversion(kind, { source: "attribute" });
          return;
        }
      }

      const link = target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";

      if (href.toLowerCase().startsWith("mailto:")) {
        trackContactSubmit("email");
        return;
      }
      const kind = kindFromHref(href);
      if (kind) trackConversion(kind, { source: "href" });
    }

    function onSubmit(event: Event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (kindFromAttribute(form) !== "contact" && form.id !== "contact-form") return;
      trackContactSubmit("form");
    }

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
