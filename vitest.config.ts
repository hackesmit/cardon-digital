import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * The only thing this config adds is the "@/" path alias.
 *
 * tsconfig.json maps "@/*" to the project root and Next resolves it, but vitest
 * does not read tsconfig paths, so a test that imports a component which
 * imports "@/lib/..." failed to collect with "Failed to load url @/lib/...".
 * Two beads reached that gap independently on the same day and each added this
 * file: hq-4pu0q.2 (Media importing @/lib) and hq-3pfhe.1 (the demo palette
 * importing @/components). The regex form is kept because it anchors on the
 * "@/" prefix, so a real package named "@" could never be caught by it.
 *
 * Everything else is vitest's default.
 */
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) },
    ],
  },
});
