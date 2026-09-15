import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * The only thing this config adds is the "@/" path alias.
 *
 * tsconfig.json maps "@/*" to the project root and Next resolves it, but vitest
 * does not read tsconfig paths, so a test that imports a component which
 * imports "@/lib/..." failed to collect with "Failed to load url @/lib/...".
 * Until now no test had reached a component with a runtime (not type-only)
 * "@/" import, so the gap was invisible. Everything else is vitest's default.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url).href).replace(/\/$/, ""),
    },
  },
});
