<script setup lang="ts">
import type { HeaderProps, NavigationMenuProps } from '@nuxt/ui'
import { UserStatus } from '~~/shared/types/db/user'

const links = [
  { label: '首页', to: '/' },
  { label: '音乐', to: '/music' },
  { label: '教程', to: '/tutorial' },
] as const

const navItems = computed(() => [...links])

const headerUi: HeaderProps<'slideover'>['ui'] = {
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

const auth = useAuthUser()
const isLoggedIn = computed(() => !!auth.value?.token)
const currentUser = computed(() => auth.value?.user ?? null)

const avatarChip = computed(() => {
  const u = currentUser.value
  if (!u) return false
  const pos = 'top-right' as const
  switch (u.status) {
    case UserStatus.Active:
      return { color: 'success' as const, position: pos }
    case UserStatus.Locked:
      return { color: 'warning' as const, position: pos }
    case UserStatus.Disabled:
      return { color: 'error' as const, position: pos }
    default:
      return { color: 'neutral' as const, position: pos }
  }
})

const userMenuItems = computed(() => [
  {
    label: '个人中心',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
  },
  { type: 'separator' as const },
  {
    label: '退出',
    icon: 'i-lucide-log-out',
    onSelect: async () => {
      clearAuthSession()
      await navigateTo('/')
    },
  },
])

async function onLogout() {
  clearAuthSession()
  await navigateTo('/')
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

      <!-- 登录态仅客户端可知（localStorage），避免 SSR 与客户端 DOM 不一致导致 hydration 报错 -->
      <ClientOnly>
        <template #fallback>
          <div
            class="hidden h-9 w-22 shrink-0 sm:block"
            aria-hidden="true" />
        </template>
        <UButton
          v-if="!isLoggedIn"
          to="/auth/login"
          color="neutral"
          variant="ghost"
          class="hidden sm:inline-flex">
          登录
        </UButton>

        <UDropdownMenu
          v-else
          :items="userMenuItems"
          :content="{ align: 'end', sideOffset: 8 }"
          class="hidden sm:block">
          <UButton
            color="neutral"
            variant="ghost"
            square
            class="rounded-full p-0.5"
            :aria-label="`用户菜单：${currentUser?.username ?? ''}`">
            <UAvatar
              size="sm"
              :src="currentUser?.avatar"
              :alt="currentUser?.username"
              :text="currentUser?.username?.slice(0, 2) ?? '?'"
              :chip="avatarChip" />
          </UButton>
        </UDropdownMenu>
      </ClientOnly>
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

      <template v-if="isLoggedIn && currentUser">
        <USeparator class="my-4" />
        <div class="flex flex-col gap-2">
          <div class="text-muted flex items-center gap-3 px-1 text-sm">
            <span class="relative inline-flex shrink-0">
              <UAvatar
                size="md"
                :src="currentUser.avatar"
                :alt="currentUser.username"
                :text="currentUser.username?.slice(0, 2) ?? '?'"
                :chip="avatarChip" />
            </span>
            <span class="min-w-0 truncate font-medium text-default">{{ currentUser.username }}</span>
          </div>
          <UButton
            to="/dashboard"
            color="primary"
            variant="soft"
            block
            icon="i-lucide-layout-dashboard">
            个人中心
          </UButton>
          <UButton
            color="neutral"
            variant="soft"
            block
            icon="i-lucide-log-out"
            @click="onLogout">
            退出
          </UButton>
        </div>
      </template>

      <USeparator class="my-4" />

      <div class="grid grid-cols-2 gap-2">
        <UButton
          to="https://github.com/ZhouYu2156"
          target="_blank"
          rel="noopener noreferrer"
          color="neutral"
          variant="soft"
          icon="i-simple-icons-github"
          block>
          GitHub
        </UButton>
        <UButton
          to="https://space.bilibili.com/431828034"
          target="_blank"
          rel="noopener noreferrer"
          color="neutral"
          variant="soft"
          icon="i-simple-icons-bilibili"
          block>
          哔哩哔哩
        </UButton>
        <template v-if="!isLoggedIn">
          <NuxtLink
            to="/auth/login"
            class="text-primary ms-1 font-medium hover:underline">
            <UButton
              color="neutral"
              variant="soft"
              block>
              登录
            </UButton>
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="text-primary ms-1 font-medium hover:underline">
            <UButton
              color="neutral"
              variant="soft"
              block>
              注册
            </UButton>
          </NuxtLink>
        </template>
      </div>
    </template>
  </UHeader>
</template>
