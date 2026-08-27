"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const linksBefore = [
  { href: "/industries/winery", label: "Wineries" },
  { href: "/work/monte-xanic", label: "Work" },
];
// Identity v3: the nav is Wineries, Work, Industries. Services and About
// fold into the pages themselves; the diagnostic CTA is the contact path and
// the footer still carries both links.
const linksAfter: { href: string; label: string }[] = [
];
const industryLinks = [
  { href: "/#sectors", label: "All industries" },
  { href: "/industries/winery", label: "Wineries" },
  { href: "/industries/construction", label: "Construction" },
  { href: "/industries/hiring", label: "Hiring" },
  { href: "/industries/restaurants", label: "Restaurants" },
  { href: "/industries/clinics", label: "Clinics" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [indOpen, setIndOpen] = useState(false);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  // Identity v3: clay marks the one action we want taken, so no viewport ever
  // holds two clay elements. The nav action stays quiet while a page action is
  // on screen and takes the clay only once none is. Without JS it stays quiet,
  // which is the correct state at the top of every page.
  const [navIsOnlyAction, setNavIsOnlyAction] = useState(false);
  const pathname = usePathname();
  const toggleBtn = useRef<HTMLButtonElement | null>(null);
  const dropRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const cur =
      document.documentElement.getAttribute("data-mode") === "light"
        ? "light"
        : "dark";
    setMode(cur);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (indOpen) {
        setIndOpen(false);
        return;
      }
      if (open) {
        setOpen(false);
        toggleBtn.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, indOpen]);

  useEffect(() => {
    if (!indOpen) return;
    function onDown(e: PointerEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setIndOpen(false);
      }
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [indOpen]);

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

  useEffect(() => {
    const actions = Array.from(document.querySelectorAll("main .cta"));
    if (!actions.length) {
      // Nothing else competes, so the nav action is the page's one clay mark.
      setNavIsOnlyAction(true);
      return;
    }
    if (!("IntersectionObserver" in window)) return;
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      });
      setNavIsOnlyAction(onScreen.size === 0);
    });
    actions.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, [pathname]);

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
              {linksBefore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li
                className={"has-drop" + (indOpen ? " drop-open" : "")}
                ref={dropRef}
                onMouseEnter={() => setIndOpen(true)}
                onMouseLeave={() => setIndOpen(false)}
              >
                <button
                  className="drop-trigger"
                  type="button"
                  aria-expanded={indOpen ? "true" : "false"}
                  aria-controls="industries-menu"
                  onClick={() => setIndOpen((v) => !v)}
                >
                  Industries
                  <svg
                    className="drop-caret"
                    viewBox="0 0 10 6"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M1 1 L5 5 L9 1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <Link
                  className="drop-mobile-label"
                  href="/#sectors"
                  onClick={() => setOpen(false)}
                >
                  Industries
                </Link>
                <div className="nav-drop" id="industries-menu">
                  <ul className="nav-drop-panel">
                    {industryLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => {
                            setIndOpen(false);
                            setOpen(false);
                          }}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              {linksAfter.map((l) => (
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
                className={
                  "cta cta-sm nav-cta" +
                  (navIsOnlyAction || open ? " is-primary" : "")
                }
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
