/**
 * Consent-gated measurement.
 *
 * The whole module no-ops unless two things are true: an id is configured in the
 * environment, and the visitor has accepted. Import the three track helpers from
 * here; a component never needs to check either condition itself.
 */
export {
  ADS_ID,
  ADS_LABELS,
  GA4_ID,
  loaderId,
  measurementConfigured,
  sendTo,
  type ConversionKind,
} from "./config";
export {
  CONSENT_COOKIE,
  CONSENT_COOKIE_MAX_AGE,
  decisionFrom,
  isDecision,
  readConsent,
  writeConsent,
  type ConsentDecision,
} from "./consent";
export { bootstrapScript, gtag, loadMeasurement, loaderSrc } from "./gtag";
export {
  trackBookingClick,
  trackContactSubmit,
  trackConversion,
  trackWhatsAppClick,
} from "./events";
