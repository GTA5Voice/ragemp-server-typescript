import { defineConfig } from "tsup";

const baseConfig = defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "es2017",
  outDir: "dist\\gta5voice",
  clean: true,
  minify: true,
  bundle: true,
});

export default defineConfig(async (options) => {
  let localOverride = {};

  try {
    const localConfig = await import("./tsup.config.local");
    localOverride = localConfig.default ?? {};
  } catch {
    localOverride = {};
  }

  return {
    ...baseConfig,
    ...localOverride,
  };
});
