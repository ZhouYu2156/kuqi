import tailwindcss from '@tailwindcss/vite'
import { SEO_DEFAULT_DESCRIPTION, SEO_KEYWORDS, SITE_NAME } from './shared/constants/seo'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  /** 客户端 $fetch 基地址，空字符串表示与站点同源 */
  runtimeConfig: {
    /** 服务端私有：JWT 签名密钥，务必配置环境变量 JWT_SECRET */
    jwtSecret: process.env.JWT_SECRET || '',
    /** 邮箱验证码哈希盐，可选；不填则回退为 jwtSecret */
    emailOtpSecret: process.env.EMAIL_OTP_SECRET || '',
    /** QQ 邮箱等 SMTP：与 Django 一样用环境变量配置即可发信 */
    smtpHost: process.env.EMAIL_HOST || '',
    smtpPort: process.env.EMAIL_PORT || '',
    smtpUser: process.env.EMAIL_HOST_USER || '',
    smtpPass: process.env.EMAIL_HOST_PASSWORD || '',
    /** 发件人地址，默认与 SMTP_USER 相同 */
    mailFrom: process.env.EMAIL_FROM || '',
    /** 587 端口是否强制 requireTLS；默认 false，由 nodemailer 协商 STARTTLS（QQ 等更稳） */
    emailUseTls: process.env.EMAIL_USE_TLS === 'true',
    public: {
      /** 站点品牌（SEO title、Open Graph） */
      siteName: SITE_NAME,
      /** 线上站点根 URL，无尾斜杠；用于 canonical、og:url、JSON-LD、sitemap */
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      seoDescription: SEO_DEFAULT_DESCRIPTION,
      seoKeywords: SEO_KEYWORDS,
      /** 可选：Open Graph 分享图绝对 URL */
      ogImage: process.env.NUXT_PUBLIC_OG_IMAGE || '',
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? '',
      /**
       * 留空 = 请求发往「当前页面」同源（推荐本地与线上 Nginx 反代）。
       * 切勿写死 http://127.0.0.1:3000：若用 http://localhost:3000 打开站点，会与 API 不同源。
       * 需指向其它机器时再设 NUXT_PUBLIC_API_BASE。
       */
    },
  },
  devtools: { enabled: false },
  /** 打包输出目录名（默认 .output），启动：node company/server/index.mjs */
  nitro: {
    output: {
      dir: 'build',
    },
  },
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  },
  /*devServer: {
    host: '0.0.0.0',
    port: 3000,
  },*/
  app: {
    head: {
      title: SITE_NAME,
      htmlAttrs: {
        lang: 'zh-CN',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: SEO_DEFAULT_DESCRIPTION },
        { name: 'keywords', content: SEO_KEYWORDS },
        { name: 'author', content: SITE_NAME },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'zh_CN' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'format-detection', content: 'telephone=no' },
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
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['dayjs/plugin/*.js', 'canvas-confetti'],
    },
  },
})
