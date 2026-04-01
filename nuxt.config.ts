import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxt/content', '@element-plus/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    /** 生产环境务必设置 JWT_SECRET（≥16 字符）；未设置时使用下列仅本地开发占位 */
    jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me-in-production-min-16chars',
    authDevMode: process.env.AUTH_DEV_MODE === 'true',
    devAuthEmail: process.env.DEV_AUTH_EMAIL || '',
    devAuthPassword: process.env.DEV_AUTH_PASSWORD || '',
    public: {
      siteName: '极客兔',
      /** 非生产环境在发码接口中返回验证码，便于联调（勿用于生产） */
      exposeRegisterCode: process.env.NODE_ENV !== 'production',
    },
  },
  ui: {
    fonts: false,
  },
  app: {
    head: {
      title: '极客兔',
      titleTemplate: '%s ❤️ 极客兔',
      htmlAttrs: {
        lang: 'zh-CN',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            '极客兔：一人公司产品化与创业陪跑：全栈交付、轻量咨询与月度陪跑，面向中国大陆个人创作者与独立开发者。',
        },
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
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;500;600;700&family=Playfair+Display:wght@400;700;900&display=swap',
        },
      ],
    },
  },

  routeRules: {
    /** 管理页依赖客户端鉴权状态，关闭 SSR 避免未登录误判 */
    '/admin/**': { ssr: false },
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
