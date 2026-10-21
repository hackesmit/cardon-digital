"use client";

import { Analytics } from "@vercel/analytics/next";
import { visitEvent } from "@/lib/analytics/visits";

/**
 * Vercel Web Analytics, mounted once in the shell. It sets no cookie and no
 * storage entry, so unlike the Google tag in MeasurementScripts it needs no
 * consent and loads for every visitor. The hook lives here rather than in the
 * shell because a function cannot cross from a server component to a client
 * one.
 */
export default function VisitCount() {
  return <Analytics beforeSend={visitEvent} />;
}
