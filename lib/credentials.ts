import type { Locale } from "@/lib/i18n/config";

/**
 * The certificates the site shows, one entry each. Three readers share this
 * list: the founder's JSON-LD (lib/seo/jsonld.ts, as hasCredential), the badge
 * by the home hero title, and the credentials block on /about with its row in
 * the footer. A new certificate is one more entry here and nothing else.
 *
 * Every fact below is copied from the certificate itself (spec
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md, bead hq-i4b5.1). The
 * verification page is HubSpot's own, so a reader can check the code without
 * trusting us.
 */
export type Credential = {
  /** Stable key, also the JSON-LD @id fragment. */
  id: string;
  name: Record<Locale, string>;
  /** What the certificate attests, in one plain sentence, restated from the
      certificate's own wording. Shown on /about beside the dates. */
  attests: Record<Locale, string>;
  /** Alt text for the badge image: what the image shows, in words. */
  alt: Record<Locale, string>;
  issuer: { name: string; url: string };
  holder: string;
  /** The certificate code printed on the certificate. */
  code: string;
  /** ISO dates, as printed on the certificate. */
  validFrom: string;
  validUntil: string;
  /** The issuer's public page that confirms the certificate. */
  verifyUrl: string;
  /** Badge image under public/. */
  badgeSrc: string;
};

export const AEO_FUNDAMENTALS: Credential = {
  id: "aeo-fundamentals",
  name: {
    es: "Certificación AEO Fundamentals de HubSpot Academy",
    en: "HubSpot Academy AEO Fundamentals Certification",
  },
  attests: {
    es: "Acredita que su titular sabe revisar cómo los motores de respuesta encuentran y muestran el contenido, medir cuánto aparece una marca en ellos y ordenar el contenido para que las respuestas de IA lo citen.",
    en: "It certifies that the holder can check how answer engines find and show content, measure how often a brand appears in them, and structure content so AI answers cite it.",
  },
  alt: {
    es: "Insignia de la certificación AEO Fundamentals de HubSpot Academy",
    en: "HubSpot Academy AEO Fundamentals certification badge",
  },
  issuer: { name: "HubSpot Academy", url: "https://academy.hubspot.com" },
  holder: "Daniel Hack",
  code: "bdbd83da48704002855820786ace136e",
  validFrom: "2026-10-20",
  validUntil: "2028-11-18",
  verifyUrl:
    "https://app.hubspot.com/academy/achievements/s5dn1lcn/en/1/daniel-hack/aeo-fundamentals",
  badgeSrc: "/media/badges/aeo-fundamentals.png",
};

/** Every certificate, in display order. */
export const CREDENTIALS: readonly Credential[] = [AEO_FUNDAMENTALS];
