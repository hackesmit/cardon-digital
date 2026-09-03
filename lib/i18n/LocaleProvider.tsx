"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "./config";

const LocaleContext = createContext<Locale>(defaultLocale);

/**
 * Client components deep inside a page (the nav, the canvas and SVG visuals)
 * need the active locale without every page threading a prop through. The
 * locale layout puts it here once.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Picks this locale's half of a dictionary inside a client component. */
export function useDict<T>(dict: Record<Locale, T>): T {
  return dict[useContext(LocaleContext)];
}
