import { Fragment, type ReactNode } from "react";
import type { Locale } from "./config";

/**
 * Dictionary strings stay plain text so they read as prose in the dictionary
 * files. Two markers carry the emphasis the layouts need:
 *
 *   **like this**   ->  <b>
 *   __like this__   ->  <span class={hl}>, the accent word inside a line
 *   |               ->  a line break
 */
type RichOptions = { b?: string; hl?: string };

function inline(text: string, opts: RichOptions, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  // Split on both markers at once so they can sit in the same sentence.
  const parts = text.split(/(\*\*[^*]*\*\*|__[^_]*__)/g);
  parts.forEach((part, i) => {
    if (!part) return;
    const key = keyBase + "-" + i;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      out.push(
        <b key={key} className={opts.b}>
          {part.slice(2, -2)}
        </b>,
      );
    } else if (part.startsWith("__") && part.endsWith("__") && part.length > 4) {
      out.push(
        <span key={key} className={opts.hl}>
          {part.slice(2, -2)}
        </span>,
      );
    } else {
      out.push(<Fragment key={key}>{part}</Fragment>);
    }
  });
  return out;
}

export function rich(text: string, opts: RichOptions = {}): ReactNode {
  const lines = text.split("|");
  return lines.map((line, li) => (
    <Fragment key={"l" + li}>
      {li > 0 ? <br /> : null}
      {inline(line, opts, "l" + li)}
    </Fragment>
  ));
}

/** Same markers, flattened to plain text, for alt/aria/title attributes. */
export function plain(text: string): string {
  return text.replace(/\*\*/g, "").replace(/__/g, "").replace(/\|/g, " ");
}

/** A dictionary is one object per locale, both with the same shape. */
export type Dict<T> = Record<Locale, T>;
