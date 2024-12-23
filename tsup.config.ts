import { defineConfig, Format, Options } from "tsup";

const commonConfig: Options = {
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
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".mjs",
    };
  },
};

export default defineConfig([
  {
    // Hooks configuration
    ...commonConfig,
    entry: ["src/hooks/**/*.ts"],
    outDir: "dist",
  },
  {
    // Main index configuration
    ...commonConfig,
    entry: ["src/index.ts"],
    outDir: "dist",
  },
]);
