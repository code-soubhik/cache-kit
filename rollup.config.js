import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "cdn",
      format: "esm",
      sourcemap: true,
      entryFileNames: "call-cache.js",
      chunkFileNames: "[name]-[hash].js",
    },
    {
      dir: "cdn",
      format: "esm",
      sourcemap: false,
      entryFileNames: "call-cache.min.js",
      plugins: [terser()],
    },
  ],
  plugins: [resolve(), commonjs(), typescript({ tsconfig: "./tsconfig.json" })],
};
