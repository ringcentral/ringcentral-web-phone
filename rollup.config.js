import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "dist/esm/index.js",
  output: {
    file: "dist/esm/index.umd.js",
    format: "umd",
    name: "WebPhone",
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
};
