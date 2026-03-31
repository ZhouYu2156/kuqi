import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxt/content', '@element-plus/nuxt'],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  },
  app: {
    head: {
      title: '极客兔',
      titleTemplate: '%s - 极客兔',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '沉稳求知，野心逐梦。全栈开发、独立产品、创业咨询。' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:wght@400;700&display=swap',
        },
      ],
    },
  },

  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/element/index.scss" as *;',
        },
      },
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['dayjs/plugin/*.js', '@element-plus/icons-vue'],
    },
  },
  elementPlus: {
    importStyle: 'scss',
  },
})
