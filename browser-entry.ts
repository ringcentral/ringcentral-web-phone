import WebPhone from "./src/index.js";

// Keep script-tag usage stable: `window.WebPhone` / `globalThis.WebPhone`.
(
  globalThis as typeof globalThis & {
    WebPhone?: typeof WebPhone;
  }
).WebPhone = WebPhone;
