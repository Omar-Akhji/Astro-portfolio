// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  experimental: {
    incrementalBuild: true,
  },
  integrations: [vue(), mdx()],

  vite: { plugins: [tailwindcss()] },
});
