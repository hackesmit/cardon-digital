"use client";

import { useEffect } from "react";
import { rememberLanding } from "@/lib/contact/attribution";

/**
 * Notes, once per document, whether the visit arrived from an AI answer, so
 * the contact form can still tell after the visitor has navigated inside the
 * site. It lives in the shell because the shell is the only thing mounted on
 * every landing page. Renders nothing and stores nothing.
 */
export default function LandingSource() {
  useEffect(() => {
    rememberLanding(window.location.search, document.referrer);
  }, []);
  return null;
}
