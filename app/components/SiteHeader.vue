<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: '首页',
    to: '/',
    active: route.path === '/',
    icon: 'i-lucide-home',
  },
  {
    label: '服务',
    to: '/services',
    active: route.path === '/services',
    icon: 'i-lucide-box',
  },
  {
    label: '博客',
    to: '/blog',
    active: route.path.startsWith('/blog'),
    icon: 'i-lucide-book',
  },
  {
    label: '关于',
    to: '/about',
    active: route.path === '/about',
    icon: 'i-lucide-info',
  },
  {
    label: '联系',
    to: '/contact',
    active: route.path === '/contact',
    icon: 'i-lucide-message-circle',
  },
])
</script>

<template>
  <!-- title 插槽由 UHeader 内置 ULink 包裹，勿再嵌套 NuxtLink，否则会嵌套 <a> 导致水合不一致 -->
  <UHeader
    to="/"
    mode="slideover"
    :ui="{
      root: 'border-b border-black/6 bg-stone-50/90 shadow-sm shadow-black/3 backdrop-blur-md dark:border-white/6 dark:bg-[rgba(8,8,8,0.92)] dark:shadow-black/20',
    }">
    <template #title>
      <span class="flex items-center gap-3 tracking-tight">
        <img
          src="/logo-mishu.svg"
          alt=""
          class="h-9 w-9 shrink-0"
          width="36"
          height="36" />
        <span class="font-display text-base font-bold text-primary sm:text-[1.05rem]">秘术云阁</span>
      </span>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton
        color="primary"
        variant="ghost" />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5" />
    </template>
  </UHeader>
</template>
