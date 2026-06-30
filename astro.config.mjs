// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// 301 redirects carried over from the retired Next.js app (site/next.config.ts)
// plus the legacy root .html pages, so old links and search rankings survive.
const redirects = {
  "/projects/FindingKuku.html": "/projects/finding-kuku",
  "/projects/MappingHumanEarthSystems.html": "/projects/mapping-human-earth-systems",
  "/projects/WesternSahara.html": "/projects/western-sahara",
  "/projects/GoogleWarming.html": "/projects/google-warming",
  "/projects/SavingScreenTime.html": "/projects/saving-screen-time",
  "/projects/Tokotoko.html": "/projects/tokotoko",
  "/projects/Iterate.html": "/projects/iterate",
  "/projects/CollatedFrames.html": "/projects/collated-frames",
  "/projects/kihikihi.html": "/projects/kihikihi",
  "/projects/EmptyVesselsVideo.html": "/projects/empty-vessels-video",
  "/projects/EmptyVesselsInstall.html": "/projects/empty-vessels-install",
  "/projects/Pixaura.html": "/projects/pixaura",
  "/projects/herito.html": "/projects/he-rito",
  "/projects/dream-atlas.html": "/projects/dream-atlas",
  "/about.html": "/about",
  "/cv.html": "/cv",
  "/contact.html": "/contact",
  "/experiments.html": "/experiments",
};

// https://astro.build/config
export default defineConfig({
  site: "https://ethansheaf.com",
  output: "static",
  redirects,
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
