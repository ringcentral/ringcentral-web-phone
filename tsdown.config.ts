import { defineConfig } from "tsdown";

const entries = ["src/**/*.ts", "!src/browser-entry.ts"];

export default defineConfig([
  {
    clean: true,
    dts: false,
    entry: entries,
    fixedExtension: false,
    format: ["esm"],
    outDir: "dist/esm",
    sourcemap: false,
    target: "es2022",
    tsconfig: "tsconfig.json",
    unbundle: true,
  },
  {
    cjsDefault: false,
    clean: false,
    dts: false,
    entry: entries,
    format: ["cjs"],
    outDir: "dist/cjs",
    outExtensions: () => ({ js: ".cjs" }),
    sourcemap: false,
    target: "es2022",
    tsconfig: "tsconfig.json",
    unbundle: true,
  },
  {
    clean: false,
    noExternal: [/.*/],
    dts: false,
    entry: {
      index: "src/browser-entry.ts",
    },
    format: ["iife"],
    outDir: "dist/iife",
    outputOptions: {
      entryFileNames: "[name].js",
    },
    platform: "browser",
    sourcemap: false,
    target: "es2022",
    tsconfig: "tsconfig.json",
  },
]);
