"use client";

import { Link } from "next-view-transitions";
import { useState } from "react";
import Mark from "./Mark";

type NavCopy = {
  work: string;
  services: string;
  lab: string;
  about: string;
  contact: string;
  cta: string;
  home: string;
};

const EN: NavCopy = {
  home: "/",
  work: "Work",
  services: "Services",
  lab: "Lab",
  about: "About",
  contact: "Contact",
  cta: "Get the diagnostic",
};

const ES: NavCopy = {
  home: "/es",
  work: "Trabajo",
  services: "Servicios",
  lab: "Lab",
  about: "Nosotros",
  contact: "Contacto",
  cta: "Solicitar diagnostico",
};

export default function Nav({ lang = "en" }: { lang?: "en" | "es" }) {
  const c = lang === "es" ? ES : EN;
  const p = lang === "es" ? "/es" : "";
  const [open, setOpen] = useState(false);

  const links = [
    { href: `${p}/work`, label: c.work },
    { href: `${p}/services`, label: c.services },
    { href: `${p}/lab`, label: c.lab },
    { href: `${p}/about`, label: c.about },
    { href: `${p}/contact`, label: c.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-sand/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-site items-center justify-between px-5 py-4 sm:px-8">
        <Link href={c.home} className="flex items-center gap-3" aria-label="Cardon Digital home">
          <Mark className="h-5 w-auto text-cardon" />
          <span className="font-display text-[15px] font-bold tracking-tight">
            Cardon Digital
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink/70 transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <span className="font-mono text-xs text-haze" aria-hidden="true">
            |
          </span>
          <Link
            href={lang === "es" ? "/" : "/es"}
            className="font-mono text-xs uppercase tracking-wide text-ink/70 hover:text-ink"
          >
            {lang === "es" ? "EN" : "ES"}
          </Link>
          <Link
            href={`${p}/contact`}
            className="bg-clay px-4 py-2 text-sm font-medium text-sand transition-opacity hover:opacity-90"
          >
            {c.cta}
          </Link>
        </nav>

        <button
          className="md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <span className="font-mono text-sm">{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-sand px-5 py-4 md:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base text-ink/80"
              >
                {l.label}
              </Link>
            ))}
            <Link href={lang === "es" ? "/" : "/es"} className="font-mono text-sm text-ink/70">
              {lang === "es" ? "English" : "Espanol"}
            </Link>
            <Link
              href={`${p}/contact`}
              onClick={() => setOpen(false)}
              className="bg-clay px-4 py-3 text-center text-sm font-medium text-sand"
            >
              {c.cta}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
