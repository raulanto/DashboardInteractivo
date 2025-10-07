// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui',"nuxt-charts"],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
    typeCheck: false,
    shim: false
  },
  colorMode: {
    preference: 'light',
  },

  imports: {
    dirs: [
      'composables',
      'composables/**',
      'utils',
      'types'
    ]
  },


  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: { enabled: true }
})
