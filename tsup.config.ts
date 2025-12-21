import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "es2017",
  outDir: "dist\\gta5voice",
  clean: true,
  minify: true,
  bundle: true,
});
