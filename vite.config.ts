import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/** The design system pulls Inter from Google Fonts. The app bundles the same
 *  family from @fontsource instead, so it renders with no network at all —
 *  without editing the design file, which stays the shared source of truth. */
const bundleFontsInstead: Plugin = {
  name: "strip-remote-font-import",
  enforce: "pre",
  transform(code, id) {
    if (!id.endsWith(".css")) return null;
    if (id.includes("/design/_ds/")) {
      return {
        code: code.replace(/@import\s+url\(\s*['"]?https:\/\/fonts\.googleapis\.com[^)]*\)\s*;?/g, ""),
        map: null,
      };
    }
    if (id.includes("@fontsource/")) {
      // Drop the .woff fallback: every browser that runs this app takes woff2.
      return { code: code.replace(/,\s*url\([^)]*\.woff\)\s*format\(['"]woff['"]\)/g, ""), map: null };
    }
    return null;
  },
};

export default defineConfig({
  base: "./",
  plugins: [
    bundleFontsInstead,
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false, // registered by hand in main.tsx so a refusal stays quiet
      manifest: {
        name: "Stock Entry Journal",
        short_name: "Entry Journal",
        description: "Track tickers against your own entry rules.",
        lang: "en",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#161826",
        theme_color: "#161826",
        categories: ["finance", "productivity"],
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "index.html",
        // Take over on the first visit too, so someone who installs the app and
        // immediately loses signal already has the shell cached.
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  build: { outDir: "dist" },
});
