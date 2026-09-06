"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { contact } from "@/lib/i18n/contact";
import {
  EMPTY_ATTRIBUTION,
  readAttribution,
  type Attribution,
} from "@/lib/contact/attribution";
import { CLICK_DOORS } from "@/lib/contact/doors";
import {
  HONEYPOT_FIELD,
  LIMITS,
  validateSubmission,
  type ContactField,
} from "@/lib/contact/validate";

type Status = "idle" | "sending" | "sent";
type Values = Record<ContactField, string>;

const EMPTY: Values = {
  name: "",
  winery: "",
  email: "",
  whatsapp: "",
  message: "",
};

/**
 * The written door.
 *
 * The same validator the route uses runs here first, so an obvious mistake is
 * caught without a round trip and the server stays the authority.
 *
 * Every answer the form gives comes in two versions: one that sends a stuck
 * visitor to WhatsApp, and one that does not, because the WhatsApp door is
 * only on the page when its environment value is set. The form never points
 * at a door that is not there.
 */
export default function ContactForm() {
  const locale = useLocale();
  const d = contact[locale].form;
  /* Which half of the two-version answers this build uses. */
  const tone = CLICK_DOORS.whatsapp ? "withWhatsapp" : "alone";

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<ContactField[]>([]);
  const [general, setGeneral] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [attribution, setAttribution] = useState<Attribution>(EMPTY_ATTRIBUTION);
  const honeypot = useRef<HTMLInputElement | null>(null);
  const sentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAttribution(readAttribution());
  }, []);

  // Moving focus to the confirmation is the only way a screen reader learns
  // the form is gone.
  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  const set = (field: ContactField) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => prev.filter((f) => f !== field));
    setGeneral("");
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const fresh = readAttribution();
    setAttribution(fresh);

    const payload = {
      ...values,
      locale,
      ...fresh,
      [HONEYPOT_FIELD]: honeypot.current?.value ?? "",
    };

    const checked = validateSubmission(payload);
    if (!checked.ok) {
      setErrors(checked.errors);
      setGeneral("");
      document
        .getElementById("contact-" + checked.errors[0])
        ?.focus({ preventScroll: false });
      return;
    }

    setStatus("sending");
    setErrors([]);
    setGeneral("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("sent");
        setValues(EMPTY);
        return;
      }

      setStatus("idle");
      if (res.status === 400) {
        const body = (await res.json().catch(() => ({}))) as {
          fields?: ContactField[];
        };
        if (body.fields && body.fields.length > 0) {
          setErrors(body.fields);
          return;
        }
        setGeneral(d.errors.general[tone]);
        return;
      }
      if (res.status === 413) return setGeneral(d.errors.large);
      if (res.status === 429) return setGeneral(d.errors.rate[tone]);
      setGeneral(d.errors.general[tone]);
    } catch {
      setStatus("idle");
      setGeneral(d.errors.general[tone]);
    }
  }

  if (status === "sent") {
    return (
      <div className="form-sent" tabIndex={-1} ref={sentRef} role="status">
        <h3>{d.sentTitle}</h3>
        <p>{d.sentBody[tone]}</p>
      </div>
    );
  }

  const invalid = (field: ContactField) => errors.includes(field);
  const describedBy = (field: ContactField) =>
    invalid(field) ? "contact-" + field + "-error" : undefined;

  const field = (
    name: ContactField,
    label: string,
    placeholder: string,
    required: boolean,
    type = "text",
    autoComplete?: string,
  ) => (
    <p className={"field" + (invalid(name) ? " is-invalid" : "")}>
      <label htmlFor={"contact-" + name}>
        {label}
        <span className="field-tag">
          {required ? d.required : d.optional}
        </span>
      </label>
      <input
        id={"contact-" + name}
        name={name}
        type={type}
        value={values[name]}
        onChange={(e) => set(name)(e.target.value)}
        placeholder={placeholder}
        maxLength={LIMITS[name].max}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={invalid(name) || undefined}
        aria-describedby={describedBy(name)}
      />
      {invalid(name) ? (
        <span className="field-error" id={"contact-" + name + "-error"}>
          {d.errors[name]}
        </span>
      ) : null}
    </p>
  );

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      {field("name", d.nameLabel, d.namePlaceholder, true, "text", "name")}
      {field(
        "winery",
        d.wineryLabel,
        d.wineryPlaceholder,
        false,
        "text",
        "organization",
      )}
      {field("email", d.emailLabel, d.emailPlaceholder, true, "email", "email")}
      {field(
        "whatsapp",
        d.whatsappLabel,
        d.whatsappPlaceholder,
        false,
        "tel",
        "tel",
      )}

      <p className={"field" + (invalid("message") ? " is-invalid" : "")}>
        <label htmlFor="contact-message">
          {d.messageLabel}
          <span className="field-tag">{d.required}</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder={d.messagePlaceholder}
          maxLength={LIMITS.message.max}
          required
          aria-invalid={invalid("message") || undefined}
          aria-describedby={describedBy("message")}
        />
        {invalid("message") ? (
          <span className="field-error" id="contact-message-error">
            {d.errors.message}
          </span>
        ) : null}
      </p>

      {/* The honeypot. Off screen rather than display:none, so the bots that
          skip hidden fields still fill it in. */}
      <p className="field-trap" aria-hidden="true">
        <label htmlFor="contact-website">{d.honeypot}</label>
        <input
          id="contact-website"
          name={HONEYPOT_FIELD}
          type="text"
          ref={honeypot}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </p>

      {/* Attribution travels with the submission as well as in the JSON body,
          so the form still carries its source if it is ever posted plainly. */}
      <input type="hidden" name="cd_lead_id" value={attribution.cd_lead_id} readOnly />
      <input type="hidden" name="cd_gclid" value={attribution.cd_gclid} readOnly />
      <input type="hidden" name="cd_lane" value={attribution.cd_lane} readOnly />
      <input
        type="hidden"
        name="cd_campaign"
        value={attribution.cd_campaign}
        readOnly
      />
      <input
        type="hidden"
        name="cd_landing"
        value={attribution.cd_landing}
        readOnly
      />
      <input
        type="hidden"
        name="cd_first_seen"
        value={attribution.cd_first_seen}
        readOnly
      />

      <div className="form-foot">
        <button className="cta" type="submit" disabled={status === "sending"}>
          {status === "sending" ? d.sending : d.submit}
        </button>
        <p className="form-privacy">{d.privacy}</p>
      </div>

      <p className="form-general" role="alert">
        {general}
      </p>
    </form>
  );
}
