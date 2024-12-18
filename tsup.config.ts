import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: {
    preset: "smallest",
  },
  external: ["react"],
  minify: true,
  esbuildOptions(options) {
    options.pure = ["console.log", "console.debug", "console.info"];
  },
});
