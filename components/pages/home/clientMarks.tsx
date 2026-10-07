/**
 * The marks in the client orbit (beads hq-1cct, hq-3w0v).
 *
 * Four are the clients' own marks, reduced to a one-colour silhouette: the
 * emblem cut from the file each client supplied (BrighterHire's sun, Monte
 * Xanic's emblem, En'kanto's E, RLogistics' R and chevrons), stored as an
 * alpha mask under public/media/clients and painted with currentColor, the
 * way a logo wall does, so they wear the token colour in both modes and never
 * fight the palette. Their credit is in public/media/CREDITS.md and their
 * clearance in docs/media-clearances.md.
 *
 * Dharma Ochoa's is still a placeholder monogram, a stroke mark in a 28 by 28
 * viewBox, until her mark arrives; swap the entry for a mask like the others
 * and nothing else in ClientOrbit changes.
 */
export type ClientId = "xanic" | "enkanto" | "dharma" | "brighter" | "rlog";

export const CLIENT_ORDER: ClientId[] = ["xanic", "enkanto", "dharma", "brighter", "rlog"];

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinejoin: "round" as const };

/** A client's mark as a mask the medallion paints in its own colour. A wide
    mark (RLogistics is 2.2 to 1) gets a wider slot so it is not a sliver. */
function Mask({ file, wide }: { file: string; wide?: boolean }) {
  const url = "url(/media/clients/" + file + ")";
  return (
    <span
      className={"orbit-mark" + (wide ? " orbit-mark-wide" : "")}
      aria-hidden="true"
      style={{ WebkitMaskImage: url, maskImage: url }}
    />
  );
}

export const CLIENT_MARKS: Record<ClientId, JSX.Element> = {
  xanic: <Mask file="monte-xanic-mark.png" />,
  enkanto: <Mask file="enkanto-mark.png" />,
  dharma: (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...S}>
      <path d="M6 21 C 9 7, 20 5, 25 12" strokeLinecap="round" />
      <path d="M7 25 c 4 -2, 8 -2, 12 0" strokeLinecap="round" opacity="0.7" />
      <circle cx="23" cy="20" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  brighter: <Mask file="brighterhire-mark.png" />,
  rlog: <Mask file="rlogistics-mark.png" wide />,
};
