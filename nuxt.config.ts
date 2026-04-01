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
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },
  app: {
    head: {
      title: '秘术云阁',
      titleTemplate: '%s · 秘术云阁',
      htmlAttrs: {
        lang: 'zh-CN',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            '一人公司产品化与创业陪跑：全栈交付、轻量咨询与月度陪跑，面向中国大陆个人创作者与独立开发者。',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/logo-mishu.svg',
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;500;600;700&family=Playfair+Display:wght@400;700;900&display=swap',
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
