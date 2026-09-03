/**
 * Reading a request body without trusting what it says about itself.
 *
 * Content-Length is a claim, not a fact: it can be absent on a chunked upload
 * and it can lie. Buffering the body first and measuring it afterwards means a
 * large upload is already in memory by the time it is rejected, so this reads
 * the stream and stops the moment it passes the limit.
 *
 * Node only, which is why it is not in the module the browser imports.
 */

export type BoundedBody =
  | { ok: true; text: string }
  | { ok: false; reason: "too_large" | "unreadable" };

export async function readBoundedText(
  req: Request,
  max: number,
): Promise<BoundedBody> {
  const stream = req.body;

  if (!stream) {
    // No stream to meter (an empty body, or a runtime that does not expose
    // one). The whole thing is read and measured after the fact.
    try {
      const text = await req.text();
      if (Buffer.byteLength(text, "utf8") > max) {
        return { ok: false, reason: "too_large" };
      }
      return { ok: true, text };
    } catch {
      return { ok: false, reason: "unreadable" };
    }
  }

  const reader = stream.getReader();
  const chunks: Buffer[] = [];
  let size = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: "too_large" };
      }
      chunks.push(Buffer.from(value));
    }
  } catch {
    return { ok: false, reason: "unreadable" };
  }

  return { ok: true, text: Buffer.concat(chunks).toString("utf8") };
}
