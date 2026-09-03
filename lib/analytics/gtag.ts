import { ADS_ID, GA4_ID, loaderId } from "./config";

/** The gtag.js loader URL for the configured ids, or null when unconfigured. */
export function loaderSrc(): string | null {
  const id = loaderId();
  return id ? "https://www.googletagmanager.com/gtag/js?id=" + id : null;
}

/**
 * The inline bootstrap that runs beside the loader. Written as a string because
 * the same bytes are needed twice: rendered into the document for a visitor who
 * arrived with consent already given, and injected by the banner for a visitor
 * who accepts during the visit, so neither path needs a reload.
 *
 * Consent Mode is set to granted here rather than defaulted to denied and then
 * updated, because this script only ever exists once consent is in hand.
 *
 * The grant lists only the three keys the privacy policy names: analytics_storage
 * for Google Analytics 4, and ad_storage plus ad_user_data for Google Ads
 * conversion measurement (ad_storage keeps the click cookie, ad_user_data lets
 * the conversion reach Google). ad_personalization, which Google defines as
 * consent for personalized advertising, is left unset because the policy
 * describes no remarketing or ad personalization and conversion measurement does
 * not need it. See developers.google.com/tag-platform/gtagjs/reference#consent.
 */
export function bootstrapScript(): string {
  const lines = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){window.dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    "gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',analytics_storage:'granted'});",
    "gtag('js',new Date());",
  ];
  if (GA4_ID) lines.push("gtag('config','" + GA4_ID + "');");
  if (ADS_ID) lines.push("gtag('config','" + ADS_ID + "');");
  return lines.join("");
}

type GtagFn = (...args: unknown[]) => void;

/** The live gtag function, once the bootstrap has run. */
export function gtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const fn = (window as unknown as { gtag?: GtagFn }).gtag;
  return typeof fn === "function" ? fn : null;
}

const MOUNTED = "data-cardon-gtag";

/**
 * Injects the loader and the bootstrap into the live document. Idempotent, so a
 * visitor who arrived with the tag already in the HTML, or who clicks accept
 * twice, ends up with exactly one tag.
 */
export function loadMeasurement(): void {
  if (typeof document === "undefined") return;
  const src = loaderSrc();
  if (!src) return;
  if (document.querySelector("script[" + MOUNTED + "]")) return;

  const boot = document.createElement("script");
  boot.setAttribute(MOUNTED, "inline");
  boot.text = bootstrapScript();
  document.head.appendChild(boot);

  const loader = document.createElement("script");
  loader.setAttribute(MOUNTED, "loader");
  loader.async = true;
  loader.src = src;
  document.head.appendChild(loader);
}
