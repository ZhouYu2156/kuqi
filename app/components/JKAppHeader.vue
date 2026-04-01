<script setup lang="ts">
import type { HeaderProps, NavigationMenuProps } from '@nuxt/ui'

const links = [
  { label: '首页', to: '/' },
  { label: '音乐', to: '/music' },
  { label: '教程', to: '/tutorial' },
] as const

/** 与主导航菜单共用，供桌面横排与侧栏竖排使用 */
const navItems = computed(() => [...links])

const headerUi: HeaderProps<'slideover'>['ui'] = {
  /** 中屏起显示中间导航；与 toggle/抽屉断点一致用 md */
  center: 'hidden md:flex flex-1 justify-center min-w-0',
  left: 'flex min-w-0 shrink-0 items-center gap-2 md:flex-1',
  right: 'flex shrink-0 items-center justify-end gap-0.5 sm:gap-1 md:flex-1',
  toggle: 'md:hidden',
  content: 'md:hidden',
  overlay: 'md:hidden',
}

const navMenuUi: NavigationMenuProps['ui'] = {
  root: 'justify-center',
}
</script>

<template>
  <UHeader
    mode="slideover"
    :menu="{ side: 'left', title: '导航' }"
    :ui="headerUi">
    <template #left>
      <ULink
        to="/"
        class="flex min-w-0 items-center gap-2 rounded-lg outline-none ring-primary/40 focus-visible:ring-2">
        <img
          src="/favicon.svg"
          alt=""
          width="36"
          height="36"
          class="size-9 shrink-0 rounded-lg object-contain"
          decoding="async" />
        <span class="truncate text-lg font-semibold tracking-tight text-highlighted">极客兔</span>
      </ULink>
    </template>

    <UNavigationMenu
      :items="navItems"
      color="primary"
      highlight
      highlight-color="primary"
      variant="link"
      class="min-w-0"
      :ui="navMenuUi" />

    <template #right>
      <JKColorModeButton
        color="neutral"
        variant="ghost" />
      <UButton
        to="https://github.com/ZhouYu2156"
        target="_blank"
        rel="noopener noreferrer"
        color="neutral"
        variant="ghost"
        square
        icon="i-simple-icons-github"
        aria-label="GitHub"
        class="hidden sm:inline-flex" />

      <UButton
        to="https://space.bilibili.com/431828034"
        target="_blank"
        rel="noopener noreferrer"
        color="neutral"
        variant="ghost"
        square
        icon="i-simple-icons-bilibili"
        aria-label="哔哩哔哩"
        class="hidden sm:inline-flex" />
    </template>

    <template #body>
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        variant="pill"
        color="primary"
        highlight
        highlight-color="primary"
        class="w-full" />

      <USeparator class="my-4" />

      <div class="grid grid-cols-2 gap-2">
        <UButton
          to="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          color="neutral"
          variant="soft"
          icon="i-simple-icons-github"
          block>
          GitHub
        </UButton>
        <UButton
          to="https://www.bilibili.com"
          target="_blank"
          rel="noopener noreferrer"
          color="neutral"
          variant="soft"
          icon="i-simple-icons-bilibili"
          block>
          哔哩哔哩
        </UButton>
      </div>
    </template>
  </UHeader>
</template>
