import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/**/*.ts", "!src/browser-entry.ts"],
    format: ["esm", "cjs"],
    unbundle: true,
    clean: true,
  },
  {
    entry: { index: "src/browser-entry.ts" },
    format: "iife",
    platform: "browser",
    deps: { alwaysBundle: [/.*/] },
  },
]);
