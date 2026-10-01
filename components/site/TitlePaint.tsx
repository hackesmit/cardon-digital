"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The title entrance (Daniel, 2026-10-01, option 7 of the prototype page): a
 * hero title arrives as an outline and fills with ink from the left, line
 * after line.
 *
 * A hero title is a bare text node, a break and an accent span, on a dozen
 * pages with slightly different markup, so this wraps each direct child of
 * the h1 in a span of its own at mount, hands each one its own colour as a
 * custom property (the fill has to be painted as a background clipped to the
 * text, and the text itself goes transparent while it runs), and removes the
 * effect class when the fill ends, so the title is ordinary text again and
 * follows the mode toggle.
 *
 * Without JS, under prefers-reduced-motion, or where background-clip: text is
 * not supported, nothing runs and the title is simply there. The CSS that
 * hides the title until this has prepared it carries its own timed fallback,
 * so a script that never arrives cannot leave a page without its headline.
 */
export default function TitlePaint() {
  const pathname = usePathname();

  useEffect(() => {
    const h1 = document.querySelector<HTMLElement>("main .hero h1");
    if (!h1) return;
    const done = () => h1.classList.add("tp-ready");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supported =
      typeof CSS !== "undefined" &&
      (CSS.supports("background-clip", "text") || CSS.supports("-webkit-background-clip", "text"));
    // A script that arrives after the CSS fallback has already shown the title
    // must not take it away again to repaint it.
    const alreadyShown = getComputedStyle(h1).visibility === "visible";
    if (reduce || !supported || alreadyShown || h1.dataset.tp === "1") {
      done();
      return;
    }
    h1.dataset.tp = "1";

    // Wrap bare text in spans; existing spans (the accent) take part as they are.
    const parts: HTMLElement[] = [];
    Array.from(h1.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent || !node.textContent.trim()) return;
        const span = document.createElement("span");
        span.textContent = node.textContent;
        h1.replaceChild(span, node);
        parts.push(span);
      } else if (node instanceof HTMLElement && node.tagName !== "BR") {
        parts.push(node);
      }
    });

    parts.forEach((el, i) => {
      el.style.setProperty("--tp-c", getComputedStyle(el).color);
      el.style.setProperty("--tp-n", String(i));
      el.classList.add("tp");
      const end = (e: AnimationEvent) => {
        if (e.target !== el) return;
        el.removeEventListener("animationend", end);
        el.classList.remove("tp");
        el.style.removeProperty("--tp-c");
        el.style.removeProperty("--tp-n");
      };
      el.addEventListener("animationend", end);
    });
    done();
  }, [pathname]);

  return null;
}
