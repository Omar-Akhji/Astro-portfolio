// @ts-check
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: "standalone" }),
  experimental: { incrementalBuild: true },
  integrations: [mdx()],

  vite: { plugins: [tailwindcss()] },
});
