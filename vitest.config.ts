import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * This config adds the "@/" path alias and inlines one package.
 *
 * tsconfig.json maps "@/*" to the project root and Next resolves it, but vitest
 * does not read tsconfig paths, so a test that imports a component which
 * imports "@/lib/..." failed to collect with "Failed to load url @/lib/...".
 * Two beads reached that gap independently on the same day and each added this
 * file: hq-4pu0q.2 (Media importing @/lib) and hq-3pfhe.1 (the demo palette
 * importing @/components). The regex form is kept because it anchors on the
 * "@/" prefix, so a real package named "@" could never be caught by it.
 *
 * next-view-transitions (components/site/Link.tsx, bead hq-ik6v0.9) ships as
 * ESM that imports "next/link" with no extension. Next has no exports map, so
 * Node's own ESM loader cannot resolve it and every test that reached a Link
 * failed to collect; inlined, vite resolves it the way Next's bundler does.
 *
 * Everything else is vitest's default.
 */
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) },
    ],
  },
  test: {
    server: { deps: { inline: ["next-view-transitions"] } },
  },
});
