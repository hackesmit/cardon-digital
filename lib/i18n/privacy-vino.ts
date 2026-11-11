import { withVariant, type Variant } from "./variant";
import { privacy, type PrivacyDict } from "./privacy";
import type { Dict } from "./rich";

/**
 * The wine brand's privacy notice (bead hq-3f6ut.4). It starts from Cardon's
 * notice, which already describes what the shared code collects (contact
 * form, consent-gated Google measurement, cookieless visit count, cookies),
 * and changes only what the wine brand's site says differently: the
 * responsable, the authority (SABG, never INAI) and the Do Not Track answer.
 * "{brand}" is filled by branded() from lib/brand.ts.
 *
 * The responsable and the domicilio (LFPDPPP art. 15 I) are Daniel's
 * standing answer, ops/reference/daniel-facts.md r-35d411e1 (2026-11-05):
 * Daniel Hack, persona fisica con actividad empresarial, at the Ensenada
 * address below. No RFC is published.
 */

const ADDRESS =
  "San Antonio de las Minas, Final de Calle Plata S/N, Ensenada, Baja California, 22766, México";

const enVino: Variant<PrivacyDict> = {
  meta: {
    title: "Privacy Policy",
    description:
      "How {brand} by Cardon handles personal information: what we collect, what we never collect, and the rights you have.",
  },
  effective: "Effective 2026-11-11. Applies to this website, {brand}.",
  intro:
    `{brand} is the wine-software brand of Cardon Digital, a practice based in Baja California, Mexico, that builds software for wineries in Mexico and the United States. The party responsible for the personal data this website handles is Daniel Hack, an individual registered for business activity in Mexico (persona física con actividad empresarial) who operates Cardon Digital, whose address is ${ADDRESS}. This policy explains what this website handles, what we deliberately do not collect, and the rights you have. It is written to be read, not skimmed past.`,
  rightsBody:
    "Under Mexico's Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP) you have the rights of access, rectification, cancellation, and objection (ARCO), and you may withdraw consent. To exercise one, email the address below with your name and what you ask for; we answer within the legal timeframe. If you believe your rights were not respected, you may file a complaint with the Secretaría Anticorrupción y Buen Gobierno (SABG), the authority for data protection in Mexico. If you are in the European Economic Area or the United Kingdom, the GDPR gives you similar rights of access, correction, deletion, restriction, portability, and objection; where we process correspondence, we do so on the basis of legitimate interest in responding to you, where we measure with Google, we do so on the basis of the consent you give, and the cookieless visit count rests on our legitimate interest in knowing how many people reach the site and from where. California residents: we do not sell or share personal information as those terms are defined in the CCPA. Do Not Track: this site does not read that signal, but it loads no Google script until you accept, which is stricter. Google can track a visitor who accepts across the sites that visitor reads.",
};

const esVino: Variant<PrivacyDict> = {
  meta: {
    title: "Aviso de Privacidad",
    description:
      "Cómo trata {brand} por Cardon los datos personales: qué recabamos, qué nunca recabamos y los derechos que usted tiene.",
  },
  effective: "Vigente desde el 11 de noviembre de 2026. Aplica a este sitio, {brand}.",
  intro:
    `{brand} es la marca de software para vinícolas de Cardon Digital, una práctica con base en Baja California, México, que construye software para vinícolas en México y en Estados Unidos. El responsable de los datos personales que maneja este sitio es Daniel Hack, persona física con actividad empresarial, quien opera Cardon Digital, con domicilio en ${ADDRESS}. Este aviso explica qué maneja este sitio, qué decidimos no recabar y los derechos que usted tiene. Está escrito para leerse, no para pasarse de largo.`,
  rightsBody:
    "Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), usted tiene los derechos de acceso, rectificación, cancelación y oposición (derechos ARCO), y puede revocar su consentimiento. Para ejercer uno, escriba al correo de abajo con su nombre y lo que solicita; respondemos dentro del plazo legal. Si considera que no se respetaron sus derechos, puede presentar una queja ante la Secretaría Anticorrupción y Buen Gobierno (SABG), la autoridad en materia de protección de datos personales en México. Si usted se encuentra en el Espacio Económico Europeo o en el Reino Unido, el RGPD le da derechos parecidos de acceso, corrección, supresión, limitación, portabilidad y oposición; cuando tratamos correspondencia, lo hacemos con base en el interés legítimo de responderle, cuando medimos con Google, lo hacemos con base en el consentimiento que usted otorga, y el conteo de visitas sin cookies se basa en nuestro interés legítimo en saber cuántas personas llegan al sitio y desde dónde. Residentes de California: no vendemos ni compartimos datos personales en el sentido que la CCPA da a esos términos. No rastrear (Do Not Track): este sitio no lee esa señal, pero no carga ningún script de Google hasta que usted acepte, lo cual es más estricto. Google puede dar seguimiento al visitante que acepta a través de los sitios que ese visitante lee.",
};

export const privacyVino: Dict<PrivacyDict> = {
  en: withVariant(privacy.en, enVino),
  es: withVariant(privacy.es, esVino),
};
