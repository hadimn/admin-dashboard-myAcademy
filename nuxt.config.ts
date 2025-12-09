import type { NuxtPage } from "nuxt/schema";
import { applyAuthMiddleware } from "./.nuxt/hooks/pages-extend-auth";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: "slide-right",
      mode: "out-in",
    },
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/google-fonts", "@nuxt/ui", "@nuxt/icon"],
  ui: {},
  css: ["~/assets/css/main.css"],
  googleFonts: {
    families: {},
  },

  runtimeConfig: {
    coingeckoApiKey: "CG-FHNYSHhxaAGHFaAvoc2QNrFW",
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      domainUrl: process.env.DOMAIN_URL,
    },
  },

  imports: {
    dirs: ["~/composables", "~/composables/**"],
  },

  hooks: {
    "pages:extend"(pages: NuxtPage[]) {
      applyAuthMiddleware(pages);
    },
  },
});
