import type { NuxtPage } from "nuxt/schema";

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
  css: ["~/assets/css/main.css"],
  googleFonts: {
    families: {},
  },

  runtimeConfig: {
    coingeckoApiKey: "CG-FHNYSHhxaAGHFaAvoc2QNrFW",
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },

  imports: {
    dirs: ["~/composables", "~/composables/**"],
  },

  hooks: {
    "pages:extend"(pages) {
      const EXCLUDED_PREFIX = "/auth/";

      function setMiddleware(pages: NuxtPage[]) {
        for (const page of pages) {
          const pagePath = page.path;

          // Check if the route path starts with the excluded prefix '/auth/'
          const isAuthRoute = pagePath.startsWith(EXCLUDED_PREFIX);

          // Apply 'auth' middleware ONLY if it is NOT an authentication route
          if (!isAuthRoute) {
            console.log(`Applying 'auth' middleware to page: ${pagePath}`);

            page.meta ||= {};
            // Append middleware
            page.meta.middleware = [...(page.meta.middleware || []), "auth"];
          } else {
            console.log(`Skipping middleware for auth route: ${pagePath}`);
          }

          // Recursively check children
          if (page.children) {
            setMiddleware(page.children);
          }
        }
      }
      setMiddleware(pages);
    },
  },
});
