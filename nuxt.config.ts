import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@element-plus/nuxt'],
  css: ['~/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          // theme: 'github-light',
          // OR
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'github-dark',
            // Theme used if `html.sepia`
            sepia: 'monokai',
          },
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'c', 'cpp', 'java'],
        },
      },
    },
    /*database: {
      type: 'sqlite',
      filename: ':memory:',
    },*/
  },
  vite: {
    plugins: [tailwindcss()],
  },
  elementPlus: {},
})