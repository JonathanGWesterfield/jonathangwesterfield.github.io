import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // This is a GitHub *user* site. Do not set `base` to the repository name.
  site: "https://jonathangwesterfield.github.io",
  output: "static",
  integrations: [sitemap()],
});
