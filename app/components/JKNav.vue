<script setup lang="ts">
const route = useRoute()
const { user, pending, logout } = useAuth()

const links = [
  { label: '首页', to: '/' },
  { label: '音乐', to: '/music' },
  { label: '视频课', to: '/learn' },
  { label: '博客', to: '/blog' },
]

const mobileNavOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    mobileNavOpen.value = false
  },
)

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-(--jk-ring) bg-white/90 backdrop-blur-md dark:bg-(--jk-bg-dark)/95">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
      <div class="flex min-w-0 flex-1 items-center gap-2 md:gap-6">
        <NuxtLink
          to="/"
          class="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-(--jk-primary)">
          <JKLogo />
          <span class="text-lg font-bold tracking-tight">极客兔</span>
        </NuxtLink>

        <nav class="hidden items-center gap-1 md:flex">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="rounded-lg px-3 py-2 text-sm transition-colors"
            :class="
              isActive(l.to)
                ? 'bg-(--jk-primary-soft) text-(--jk-primary)'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200'
            ">
            {{ l.label }}
          </NuxtLink>
        </nav>
      </div>

      <div class="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          class="inline-flex rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 md:hidden dark:text-gray-200 dark:hover:bg-white/10"
          aria-label="打开菜单"
          @click="mobileNavOpen = true">
          <!-- 内联 SVG：避免 UIcon 在 SSR 与客户端子节点不一致导致 hydration mismatch -->
          <svg
            class="size-6 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true">
            <line
              x1="4"
              x2="20"
              y1="12"
              y2="12" />
            <line
              x1="4"
              x2="20"
              y1="6"
              y2="6" />
            <line
              x1="4"
              x2="20"
              y1="18"
              y2="18" />
          </svg>
        </button>
        <JkThemeControls />
        <UColorModeButton
          color="neutral"
          variant="ghost"
          class="border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5" />
        <template v-if="pending">
          <span class="text-xs text-gray-500">…</span>
        </template>
        <template v-else-if="user">
          <NuxtLink
            v-if="user.role === 'admin'"
            to="/admin"
            class="hidden rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-(--jk-primary) hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5 sm:inline">
            后台
          </NuxtLink>
          <span class="hidden max-w-40 truncate text-xs text-zinc-500 dark:text-gray-400 lg:inline">{{ user.email }}</span>
          <button
            type="button"
            class="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            @click="logout()">
            退出
          </button>
        </template>
        <NuxtLink
          v-else
          to="/login"
          class="rounded-lg px-4 py-2 text-sm font-medium text-gray-950 shadow-sm transition-[filter,box-shadow,transform] hover:brightness-110 hover:shadow-md active:brightness-95 active:scale-[0.98]"
          :style="{ background: 'var(--jk-primary)' }">
          登录
        </NuxtLink>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-show="mobileNavOpen"
        class="fixed inset-0 z-100 md:hidden"
        aria-hidden="true">
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          @click="mobileNavOpen = false" />
        <aside
          class="absolute right-0 top-0 flex h-full w-[min(88vw,18rem)] flex-col border-l border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-(--jk-bg-dark-elevated)"
          @click.stop>
          <div class="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-4 dark:border-white/10">
            <span class="text-sm font-semibold text-zinc-900 dark:text-white">导航</span>
            <button
              type="button"
              class="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-gray-300 dark:hover:bg-white/10"
              aria-label="关闭菜单"
              @click="mobileNavOpen = false">
              <svg
                class="size-5 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <nav class="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            <NuxtLink
              v-for="l in links"
              :key="l.to"
              :to="l.to"
              class="rounded-lg px-4 py-3 text-base transition-colors"
              :class="
                isActive(l.to)
                  ? 'bg-(--jk-primary-soft) font-medium text-(--jk-primary)'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-gray-200 dark:hover:bg-white/5'
              "
              @click="mobileNavOpen = false">
              {{ l.label }}
            </NuxtLink>
            <NuxtLink
              v-if="user?.role === 'admin'"
              to="/admin"
              class="rounded-lg px-4 py-3 text-base text-(--jk-primary) hover:bg-zinc-100 dark:hover:bg-white/5"
              @click="mobileNavOpen = false">
              后台
            </NuxtLink>
          </nav>
        </aside>
      </div>
    </Teleport>
  </header>
</template>
