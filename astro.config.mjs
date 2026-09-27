// @ts-check
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const siteUrl = process.env["SITE_URL"] || "https://omarakhji.dev";

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  trailingSlash: "ignore",
  adapter: vercel(),
  experimental: { incrementalBuild: true },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/api/") && !page.includes("/404"),
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.8,
      serialize(item) {
        if (item.url === `${siteUrl}/` || item.url === String(siteUrl)) {
          item.priority = 1;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (item.url.includes("/blog")) {
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.DAILY;
        } else if (item.url.includes("/portfolio")) {
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (item.url.includes("/resume")) {
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (item.url.includes("/contact")) {
          item.priority = 0.7;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        }
        return item;
      },
    }),
  ],

  vite: { plugins: [tailwindcss()] },
});
