import type { Dict } from "./rich";

/** Consent notice. Shown only when a measurement id is configured. It reads
 *  like the cookie notice a visitor already knows: what loads and why, with
 *  the yes or no on the buttons and the detail behind the privacy link. The body is picked by which ids are
 *  configured, so the notice never names a product that is off. */

const en = {
  label: "Cookie consent",
  title: "Measurement cookies",
  body: "We use Google Analytics cookies to see which pages people visit.",
  bodyAds: "We use Google Analytics and Google Ads cookies to see which pages and ads bring people here.",
  bodyAdsOnly: "We use Google Ads cookies to see which ads bring people here.",
  accept: "Accept",
  decline: "Decline",
  privacy: "Privacy policy",
};

const es: typeof en = {
  label: "Consentimiento de cookies",
  title: "Cookies de medición",
  body: "Usamos cookies de Google Analytics para saber qué páginas se visitan.",
  bodyAds: "Usamos cookies de Google Analytics y Google Ads para saber qué páginas y anuncios atraen visitas.",
  bodyAdsOnly: "Usamos cookies de Google Ads para saber qué anuncios atraen visitas.",
  accept: "Aceptar",
  decline: "Rechazar",
  privacy: "Aviso de privacidad",
};

export type ConsentDict = typeof en;
export const consent: Dict<ConsentDict> = { en, es };
