<script setup lang="ts">
import type { PageCardProps } from '@nuxt/ui'

const cards = ref<PageCardProps[]>([
  {
    title: 'Vue 3',
    description: '使用 Vue 3 开发应用程序，享受 Vue 3 的最新特性.',
    icon: 'i-vscode-icons-file-type-vue',
    to: 'https://vuejs.org/',
  },
  {
    title: 'TS',
    description: '基于 TypeScript 开发应用程序，享受 TypeScript 的强类型检查.',
    icon: 'i-vscode-icons-file-type-typescript',
    to: 'https://www.typescriptlang.org/',
  },
  {
    title: 'Sass',
    description: '使用 Sass 编写 CSS，享受 Sass 的强大功能.',
    icon: 'i-vscode-icons-file-type-sass',
    to: 'https://sass-lang.com/',
  },
  {
    title: 'Nuxt 4',
    description: '享受 Nuxt 4 的最新特性，快速开发应用程序.',
    icon: 'i-vscode-icons-file-type-nuxt',
    to: 'https://nuxt.com/',
  },
  {
    title: 'Nuxt UI',
    description: '全面的 Vue UI 组件库，具有 125 多个可访问的 Tailwind CSS 组件，用于构建现代 Web 应用程序.',
    icon: 'i-vscode-icons-file-type-tsbuildinfo',
    to: 'https://ui.nuxt.com/',
  },

  {
    title: 'Tailwind CSS 4',
    description: '使用 Tailwind CSS 4 构建漂亮的用户界面，快速开发应用程序.',
    icon: 'i-vscode-icons-file-type-tailwind',
    to: 'https://tailwindcss.com/',
  },

  {
    title: 'Element Plus',
    description: '基于 Element UI 的 Vue 3 版本，具有更好的性能和更丰富的功能.',
    icon: 'ep-element-plus',
    to: 'https://element-plus.org/',
  },
  {
    title: 'Django',
    description: '使用 Django 开发 Web 应用程序.',
    icon: 'i-vscode-icons-file-type-django',
    to: 'https://www.djangoproject.com/',
  },
  {
    title: 'DRF',
    description: 'DRF 框架，用于构建 RESTful API.',
    icon: 'i-vscode-icons-file-type-rest',
    to: 'https://www.django-rest-framework.org/',
  },
])
</script>

<template>
  <UPageGrid>
    <UPageCard
      v-for="(card, index) in cards"
      :key="index"
      v-bind="card"
      spotlight
      target="_blank" />
  </UPageGrid>
</template>
