import { defineConfig } from "tsup";

const entries = ["src/**/*.ts"];

export default defineConfig([
  {
    bundle: false,
    clean: true,
    dts: false,
    entry: entries,
    format: ["esm"],
    outDir: "dist/esm",
    sourcemap: false,
    target: "es2022",
    tsconfig: "tsconfig.esm.json",
  },
  {
    bundle: false,
    clean: false,
    dts: false,
    entry: entries,
    format: ["cjs"],
    outDir: "dist/cjs",
    outExtension() {
      return { js: ".cjs" };
    },
    sourcemap: false,
    target: "es2022",
    tsconfig: "tsconfig.esm.json",
  },
  {
    bundle: true,
    clean: false,
    dts: false,
    entry: {
      index: "browser-entry.ts",
    },
    format: ["iife"],
    noExternal: [/.*/],
    outDir: "dist/iife",
    outExtension() {
      return { js: ".js" };
    },
    platform: "browser",
    sourcemap: false,
    target: "es2022",
    tsconfig: "tsconfig.esm.json",
  },
]);
