"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const links = [
  { href: "/work/monte-xanic", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#sectors", label: "Industries" },
  { href: "/#about", label: "About" },
  { href: "/#diagnostic", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const toggleBtn = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const cur =
      document.documentElement.getAttribute("data-mode") === "light"
        ? "light"
        : "dark";
    setMode(cur);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleBtn.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  function toggleMode() {
    const cur =
      document.documentElement.getAttribute("data-mode") === "light"
        ? "light"
        : "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-mode", next);
    try {
      localStorage.setItem("cardon-mode", next);
    } catch (e) {
      /* storage may be unavailable; mode still applies for this session */
    }
    setMode(next);
    window.dispatchEvent(new CustomEvent("cardon-mode", { detail: next }));
  }

  return (
    <header className="site-header">
      <div className="container bar">
        <Link className="brand" href="/" aria-label="Cardon Digital home">
          <svg
            className="brand-mark"
            viewBox="0 0 26 26"
            aria-hidden="true"
            focusable="false"
          >
            <line
              className="bm-line"
              x1="13"
              y1="20"
              x2="6"
              y2="8"
              strokeWidth="1.2"
              opacity="0.7"
            />
            <line
              className="bm-line"
              x1="13"
              y1="20"
              x2="20"
              y2="8"
              strokeWidth="1.2"
              opacity="0.7"
            />
            <line
              className="bm-line"
              x1="6"
              y1="8"
              x2="20"
              y2="8"
              strokeWidth="1.2"
              opacity="0.55"
            />
            <circle className="bm-ring" cx="6" cy="8" r="3" strokeWidth="1.4" />
            <circle className="bm-ring" cx="20" cy="8" r="3" strokeWidth="1.4" />
            <circle className="bm-dot" cx="13" cy="20" r="3.4" />
          </svg>
          <span className="brand-name">
            Cardon <span>Digital</span>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Primary">
          <button
            className="menu-toggle"
            id="menuToggle"
            ref={toggleBtn}
            type="button"
            aria-controls="nav-menu"
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
          {open &&
            createPortal(
              <button
                className="nav-scrim"
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              />,
              document.body,
            )}
          <div className={"nav-menu" + (open ? " open" : "")} id="nav-menu">
            <ul className="nav-list">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="nav-tools">
              <button
                className="mode-toggle"
                id="modeToggle"
                type="button"
                aria-label="Switch between light and dark mode"
                aria-pressed={mode === "dark" ? "true" : "false"}
                onClick={toggleMode}
              >
                <span className="sr-only">
                  {mode === "dark" ? "Dark mode" : "Light mode"}
                </span>
                <svg
                  className="icon icon-moon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" />
                </svg>
                <svg
                  className="icon icon-sun"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
                </svg>
              </button>
              <Link
                className="cta cta-sm"
                href="/#diagnostic"
                onClick={() => setOpen(false)}
              >
                Get the diagnostic
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
