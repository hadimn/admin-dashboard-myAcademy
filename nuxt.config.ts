import type { NuxtPage } from "nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/google-fonts", "@nuxt/ui", "@nuxt/icon"],

  runtimeConfig: {
    coingeckoApiKey: "CG-FHNYSHhxaAGHFaAvoc2QNrFW",
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      domainUrl: process.env.DOMAIN_URL,
    },
  },

  typescript: {
    strict: true,
    // typeCheck: true,
  },

  imports: {
    dirs: [
      "config/resources", // Auto-import resource configs
      "~/composables",
      "~/composables/**",
    ],
  },

  app: {
    pageTransition: {
      name: "slide-right",
      mode: "out-in",
    },
    head: {
      title: "Admin Dashboard",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
      ],
    },
  },
  ui: {},
  css: ["~/assets/css/main.css"],
  googleFonts: {
    families: {},
  },
});
