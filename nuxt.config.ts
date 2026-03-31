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
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
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
