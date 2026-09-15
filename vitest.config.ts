import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest needs the "@/" alias tsconfig.json already declares, because
 * component modules import through it: components/pages/demos/palette.ts
 * imports @/components/pages/home/canvasKit, and without this a test that
 * imports a component fails to resolve instead of failing on the behaviour it
 * is checking. Added with the module-demo tests (bead hq-3pfhe.1).
 *
 * Nothing else about the run changes. The tests that predate this import
 * relatively and are unaffected.
 */
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) },
    ],
  },
});
