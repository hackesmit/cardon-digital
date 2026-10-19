/**
 * THE STYLE SAMPLES' OWN MEDIA, and the only place a scene may name a file.
 *
 * The samples on /estilos used to be drawing and type alone. A real client
 * arrives with photographs and footage of their own business, so every sample
 * now shows the hybrid they would actually get: their material, with our
 * animation drawn over it (Daniel, 2026-10-16).
 *
 * WHY THIS IS NOT components/site/Media.tsx. That component is the site's
 * editorial slot: it requires a caption, because the picture is evidence for a
 * claim the caption states, and it renders a figure with that caption under
 * it. Nothing inside a scene here is evidence of anything. A scene is the top
 * of an INVENTED business's home page, its only job is to look like a style,
 * and a figcaption in the house voice inside a mock hero would both break the
 * illusion and caption a photograph that carries no claim. So the scenes get
 * their own catalogue, and share the one thing that is genuinely common:
 * Media.tsx's playback policy, which SceneMedia imports rather than copies.
 *
 * The catalogue exists for the same reason MEDIA_SLOTS does. A scene names a
 * key, never a path, so a file cannot be referenced before it is described
 * here, sceneMedia.test.ts can check every declared file is on disk, and
 * public/media/CREDITS.md can be checked row for row against this table.
 */

/** The four samples, in the order the gallery shows them. */
export const SCENE_KEYS = ["vinedo", "tech", "spa", "hotel"] as const;
export type SceneKey = (typeof SCENE_KEYS)[number];

/**
 * Where a layer sits in its scene. The role is the contract between this table
 * and estilos.css: the stylesheet places `.sc-shot--<role>` inside each scene
 * and nothing in the markup decides position.
 *
 *  ground  behind the whole scene, washed back so the scene's own type keeps
 *          its contrast
 *  band    a strip along the foot of the scene, which is where the logistics
 *          sample runs its cut-out crates
 *  panel   a column of its own beside the copy, which is how the wellness
 *          sample carries a hero video without covering its words
 */
export type SceneRole = "ground" | "band" | "panel";

export type SceneLayer = {
  /** The file under public/media without its extension, and the layer's id. */
  file: string;
  kind: "photo" | "video";
  role: SceneRole;
  /**
   * What is in the frame, and why this scene has it. Prose, because
   * CREDITS.md quotes it and a future agent reads it before replacing a file.
   */
  frame: string;
};

/**
 * The media each sample carries. A sample with no entry is awaiting its
 * material and says so in AWAITING_MEDIA below; the test refuses a third
 * state, so a scene cannot quietly lose its media and look merely unfinished.
 */
export const SCENE_MEDIA = {
  vinedo: [
    {
      file: "estilos/vinedo-aerial",
      kind: "video",
      role: "ground",
      frame:
        "Drone over vine rows and olive groves at low sun, the house and its track in the middle of the frame. It runs behind the whole winery sample, washed back into the burnt earth ground, with the drawn vineyard still along the foot.",
    },
  ],
  tech: [
    {
      file: "estilos/logistica-almacen",
      kind: "photo",
      role: "ground",
      frame:
        "Racking in a working warehouse, two people walking the aisle with a box. It sits far back behind the logistics sample as depth, dimmed almost to the ground colour.",
    },
    {
      file: "estilos/logistica-contenedores",
      kind: "photo",
      role: "band",
      frame:
        "Stacked shipping containers with the sky cut away, so the stepped skyline of the stack is the shape. It runs as a band along the foot of the logistics sample, drifting, with a lime line sweeping it.",
    },
  ],
  spa: [
    {
      file: "estilos/spa-ritual",
      kind: "video",
      role: "panel",
      frame:
        "A head massage at the table in low warm light, hands and face in frame. It is the hero of the wellness sample, a column beside the copy, with the drawn currents combing across it.",
    },
  ],
} as const satisfies Partial<Record<SceneKey, readonly SceneLayer[]>>;

/**
 * A sample with no material yet, and what is missing. Daniel supplied the
 * first set on 2026-10-16 and more is coming; the coastal hotel was not in it,
 * so that sample is still drawing and type alone. An entry here is a shot
 * request, not an excuse: it names what would complete the sample.
 */
export const AWAITING_MEDIA: Partial<Record<SceneKey, string>> = {
  hotel:
    "Nothing coastal in the 2026-10-16 set. The sample needs one wide frame of sea and sand, or a slow clip of the water, to pair with the drawn dunes.",
};

export type SceneWithMedia = keyof typeof SCENE_MEDIA;

/** The layers of one scene, empty when the scene is still awaiting material. */
export function sceneLayers(key: SceneKey): readonly SceneLayer[] {
  const table = SCENE_MEDIA as Partial<Record<SceneKey, readonly SceneLayer[]>>;
  return table[key] ?? [];
}

/** Every layer on the page, which is what the file and credit checks walk. */
export function allLayers(): SceneLayer[] {
  return SCENE_KEYS.flatMap((key) => sceneLayers(key).map((layer) => ({ ...layer })));
}

/** A still, or a video's poster frame: the one image a layer always has. */
export function stillPath(layer: Pick<SceneLayer, "file" | "kind">): string {
  return layer.kind === "video"
    ? `/media/${layer.file}-poster.webp`
    : `/media/${layer.file}.webp`;
}

/**
 * The sources a video offers, smallest useful one first.
 *
 * WebM is listed before MP4 on purpose: a browser takes the first type it can
 * play, and the VP9 cut of each clip is about a third smaller than its H.264
 * twin. Safari, which plays neither VP9 in every version nor nothing, falls
 * through to the MP4, so the pair covers every engine the site ships to.
 */
export function videoSources(file: string): Array<{ src: string; type: string }> {
  return [
    { src: `/media/${file}.webm`, type: "video/webm" },
    { src: `/media/${file}.mp4`, type: "video/mp4" },
  ];
}

/** Every file a layer needs on disk, as a path under public/. */
export function layerFiles(layer: Pick<SceneLayer, "file" | "kind">): string[] {
  if (layer.kind === "photo") return [`media/${layer.file}.webp`];
  return [
    `media/${layer.file}.webm`,
    `media/${layer.file}.mp4`,
    `media/${layer.file}-poster.webp`,
  ];
}

/**
 * Arming: whether the element may hold its sources yet.
 *
 * A video below the fold must not be fetched before the visitor is anywhere
 * near it, which is the whole of the page weight argument, and `preload` is a
 * hint a browser may ignore. So the <source> elements are not rendered at all
 * until the scene approaches the viewport. Once armed it stays armed: a
 * visitor who scrolls past and back must not watch the clip reload.
 */
export function armState(armed: boolean, near: boolean): boolean {
  return armed || near;
}

/** How far ahead of the viewport a clip is allowed to start loading. */
export const SCENE_ARM_MARGIN = "400px";
