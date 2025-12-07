// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-charts", "@vueuse/nuxt", "@nuxtjs/leaflet"],
  css: ["~/assets/css/main.css"],
  routeRules: {
    "/api/**": {
      cors: true,
    },
  },
  colorMode: {
    preference: "light",
  },
});
