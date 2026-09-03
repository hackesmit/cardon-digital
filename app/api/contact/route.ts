import { NextResponse } from "next/server";
import { readBoundedText } from "@/lib/contact/body";
import { clientKey, hit } from "@/lib/contact/rateLimit";
import { buildEmail, deliver } from "@/lib/contact/mail";
import { MAX_BODY_BYTES, validateSubmission } from "@/lib/contact/validate";

/**
 * The contact form's only endpoint.
 *
 * Order matters and is deliberate: cheapest rejection first, so an abusive
 * caller is turned away before anything is parsed or sent.
 *
 *   1. body size, from the declared length and again as the stream is read
 *   2. per address rate limit
 *   3. JSON parse
 *   4. field validation, which is also the header injection gate
 *   5. honeypot, answered with success so a bot learns nothing
 *   6. delivery, or dry mode when the practice is not wired for mail yet
 *
 * The route is a Node handler rather than an edge one because the rate limit
 * keeps its window in module memory.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JSON_HEADERS = { "Cache-Control": "no-store" };

function fail(status: number, error: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, error, ...extra }, { status, headers: JSON_HEADERS });
}

export async function POST(req: Request) {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return fail(413, "too_large");
  }

  const key = clientKey(req.headers);
  const verdict = hit(key);
  if (!verdict.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: { ...JSON_HEADERS, "Retry-After": String(verdict.retryAfter) },
      },
    );
  }

  // A body can arrive without a declared length, or with a lying one, so it is
  // metered as it is read rather than measured once it is already in memory.
  const body = await readBoundedText(req, MAX_BODY_BYTES);
  if (!body.ok) {
    return body.reason === "too_large"
      ? fail(413, "too_large")
      : fail(400, "unreadable");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body.text);
  } catch {
    return fail(400, "malformed");
  }

  const result = validateSubmission(parsed);
  if (!result.ok) {
    return fail(400, "invalid", { fields: result.errors });
  }

  // A filled honeypot is a bot. It gets the same answer a person gets, and
  // nothing is sent.
  if (result.honeypot) {
    console.log("[contact] honeypot caught a submission from", key);
    return NextResponse.json({ ok: true, mode: "dropped" }, { headers: JSON_HEADERS });
  }

  const submission = result.value;
  const delivery = await deliver(buildEmail(submission));

  if (!delivery.ok) {
    return fail(502, "delivery");
  }

  // One line per accepted lead, so the source of a conversation can be looked
  // up later without a database.
  console.log(
    "[contact] lead " +
      JSON.stringify({
        at: new Date().toISOString(),
        channel: "form",
        mode: delivery.mode,
        locale: submission.locale,
        winery: submission.winery || null,
        leadId: submission.attribution.leadId || null,
        gclid: submission.attribution.gclid || null,
        lane: submission.attribution.lane || null,
      }),
  );

  return NextResponse.json({ ok: true, mode: delivery.mode }, { headers: JSON_HEADERS });
}
