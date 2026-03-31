<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const headers = computed<NavigationMenuItem[]>(() => [
  {
    icon: 'i-carbon-home',
    label: '主页',
    to: '/',
    active: route.path === '/',
  },
  {
    icon: 'i-carbon-music',
    label: '音乐',
    to: '/music',
    active: route.path.startsWith('/music'),
  },
  {
    icon: 'i-carbon-book',
    label: '学习笔记',
    to: 'https://zhouyu2156.github.io/',
    target: '_blank',
  },
])

onMounted(async () => {
  const users = await $fetch('/user')

  console.log('用户: ', users)
})
</script>

<template>
  <UHeader mode="slideover">
    <template #title>
      <JKLogo />
    </template>

    <UNavigationMenu :items="headers" />

    <template #right>
      <UColorModeButton
        :color="'primary'"
        variant="outline" />

      <UTooltip
        text="Open on GitHub"
        :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="outline"
          to="https://github.com/ZhouYu2156"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub" />
        <UButton
          color="neutral"
          variant="outline"
          to="https://space.bilibili.com/431828034"
          target="_blank"
          icon="i-simple-icons-bilibili"
          aria-label="Bilibili" />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu
        :items="headers"
        orientation="vertical"
        class="-mx-2.5" />
    </template>
  </UHeader>
</template>
