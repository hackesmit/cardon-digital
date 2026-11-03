"use client";

import NextLink from "next/link";
import { Link as TransitionLink, ViewTransitions } from "next-view-transitions";
import { createContext, useContext, type ComponentProps } from "react";

/**
 * In-site navigation cross-fades through the View Transitions API (bead
 * hq-ik6v0.9). next-view-transitions does the work: its Link starts
 * document.startViewTransition on a click and holds the old page until the new
 * route has rendered, and its ViewTransitions provider does the same on back
 * and forward. A browser without the API navigates as before. The animation is
 * the browser's root cross-fade, timed in app/globals.css, where reduced
 * motion also switches it off.
 *
 * Next 15.5 has a built-in route (experimental.viewTransition with React's
 * ViewTransition), but the flag swaps the whole app to React's experimental
 * build, which Next does not recommend for production.
 *
 * The package's Link throws outside its provider, so every page imports this
 * one: inside SiteTransitions it is the transition link, anywhere else (a unit
 * test that renders a page on its own) it is plain next/link. An address on
 * another host, or an href given as an object, always gets the plain link,
 * because the package pushes the href through the client router as a string.
 */
const InsideTransitions = createContext(false);

export function SiteTransitions({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <InsideTransitions.Provider value={true}>{children}</InsideTransitions.Provider>
    </ViewTransitions>
  );
}

export default function Link(props: ComponentProps<typeof NextLink>) {
  const inside = useContext(InsideTransitions);
  const plain = typeof props.href !== "string" || /^(https?:)?\/\//.test(props.href);
  if (!inside || plain) return <NextLink {...props} />;
  return <TransitionLink {...props} />;
}
