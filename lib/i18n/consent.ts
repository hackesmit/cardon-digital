import type { Dict } from "./rich";

/** Consent notice. Shown only when a measurement id is configured. It reads
 *  like the cookie notice a visitor already knows: what loads, that it waits
 *  for a yes, and where the detail is. The body is picked by which ids are
 *  configured, so the notice never names a product that is off. */

const en = {
  label: "Cookie consent",
  title: "Measurement cookies",
  body: "We use Google Analytics cookies to see which pages people visit. They load only if you accept, and we never sell what they collect.",
  bodyAds: "We use Google Analytics and Google Ads cookies to see which pages and ads bring people here. They load only if you accept, and we never sell what they collect.",
  bodyAdsOnly: "We use Google Ads cookies to see which ads bring people here. They load only if you accept, and we never sell what they collect.",
  accept: "Accept",
  decline: "Decline",
  privacy: "Privacy policy",
};

const es: typeof en = {
  label: "Consentimiento de cookies",
  title: "Cookies de medición",
  body: "Usamos cookies de Google Analytics para saber qué páginas se visitan. Solo se activan si usted acepta, y nunca vendemos lo que recaban.",
  bodyAds: "Usamos cookies de Google Analytics y Google Ads para saber qué páginas y anuncios atraen visitas. Solo se activan si usted acepta, y nunca vendemos lo que recaban.",
  bodyAdsOnly: "Usamos cookies de Google Ads para saber qué anuncios atraen visitas. Solo se activan si usted acepta, y nunca vendemos lo que recaban.",
  accept: "Aceptar",
  decline: "Rechazar",
  privacy: "Aviso de privacidad",
};

export type ConsentDict = typeof en;
export const consent: Dict<ConsentDict> = { en, es };
