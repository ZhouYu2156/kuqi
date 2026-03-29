import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/content', '@element-plus/nuxt'],
  css: ['~/assets/css/main.css', '~/assets/scss/global.scss'],
  app: {
    head: {
      title: '秘术云阁',
      titleTemplate: '%s - 秘术云阁',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.png',
        },
      ],
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['dayjs/plugin/*.js', 'dayjs', 'lodash-unified', '@element-plus/icons-vue'],
    },
  },
  elementPlus: {},
})
