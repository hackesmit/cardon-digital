import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import ContactDoors from "@/components/contact/ContactDoors";
import ContactForm from "@/components/contact/ContactForm";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { contact } from "@/lib/i18n/contact";
import { rich } from "@/lib/i18n/rich";
import "./contacto.css";

/* One address in both locales. The path is a word a Spanish reader types and
   an English reader recognises, and keeping it identical means a language
   switch on this page never has to translate the URL. */

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/contacto", contact[locale].meta);
}

export default function ContactPage({ params }: Params) {
  const d = contact[localeOf(params)];

  return (
    <main id="main" className="pg-contacto">
      <section className="hero" aria-labelledby="contact-title">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.eyebrow}</p>
            <h1 id="contact-title">{rich(d.title, { hl: "accent" })}</h1>
            <p className="hero-sub">{rich(d.sub)}</p>
            <p className="brandline">{d.reply}</p>
          </div>
        </div>
      </section>

      <ContactDoors />

      <section className="section form-section" aria-labelledby="form-title">
        <div className="container">
          <Reveal>
            <div className="form-inner">
              <div className="form-lead">
                <span className="kicker clay">{d.form.kicker}</span>
                <h2 id="form-title">{d.form.title}</h2>
                <p className="section-sub">{rich(d.form.sub)}</p>
              </div>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
