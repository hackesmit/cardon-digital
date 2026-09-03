import type { Dict } from "./rich";

/** Consent notice. Shown only when a measurement id is configured, so the
 *  Spanish and English copy can speak plainly about what is being loaded. */

const en = {
  label: "Measurement consent",
  title: "One question before we measure anything",
  body: "We would like to load Google Analytics and Google Ads measurement so we can see which pages bring the work in. Nothing from Google loads until you say yes, we never sell what we collect, and you can change your mind by clearing this site's cookies.",
  accept: "Accept measurement",
  decline: "No thanks",
  privacy: "Read the privacy policy",
};

const es: typeof en = {
  label: "Consentimiento de medición",
  title: "Una pregunta antes de medir",
  body: "Queremos cargar la medición de Google Analytics y Google Ads para saber qué páginas nos traen trabajo. Nada de Google se carga hasta que usted acepte, nunca vendemos lo que recabamos, y usted puede cambiar de opinión borrando las cookies de este sitio.",
  accept: "Aceptar la medición",
  decline: "No, gracias",
  privacy: "Leer el aviso de privacidad",
};

export type ConsentDict = typeof en;
export const consent: Dict<ConsentDict> = { en, es };
