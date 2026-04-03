<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * 出错时 Nuxt 会用本组件整棵替换 app.vue（不经过 NuxtPage）。
 * 不要在这里再包一层 NuxtLayout：404 等场景下布局解析、route.meta 可能异常，导致白屏或崩溃。
 * 外壳与 layouts/default.vue 手动保持一致即可。
 */
const props = defineProps<{
  error: NuxtError
}>()

const code = computed(() => Number(props.error.statusCode) || 500)

const headline = computed(() => {
  switch (code.value) {
    case 404:
      return '页面未找到'
    case 403:
      return '无权访问'
    case 401:
      return '需要登录'
    case 503:
      return '服务暂时不可用'
    default:
      return '出了点问题'
  }
})

const description = computed(() => {
  const msg = props.error.message?.trim()
  if (msg && msg !== String(code.value)) {
    return msg
  }
  switch (code.value) {
    case 404:
      return '链接可能已失效，或页面已被移动。请检查地址是否正确。'
    case 403:
      return '你没有权限查看此内容。'
    case 401:
      return '请先登录后再访问该页面。'
    case 503:
      return '服务正在维护或过载，请稍后再试。'
    default:
      return '服务器处理请求时发生意外。请稍后再试，或返回首页继续浏览。'
  }
})

const icon = computed(() => {
  if (code.value === 404) return 'i-lucide-file-question'
  if (code.value === 403 || code.value === 401) return 'i-lucide-shield-off'
  return 'i-lucide-cloud-alert'
})

useHead({
  title: `${code.value} · ${headline.value}`,
})

async function goHome() {
  await clearError({ redirect: '/' })
}

async function goBack() {
  await clearError()
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
  } else {
    await navigateTo('/')
  }
}

function retry() {
  if (import.meta.client) {
    reloadNuxtApp({ ttl: 0 })
  }
}

const showStack = computed(() => import.meta.dev && props.error.stack)
</script>

<template>
  <UApp>
    <div class="flex min-h-dvh flex-col bg-default text-default">
      <JKAppHeader />
      <UMain class="flex-1">
        <div class="flex w-full flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
          <div class="mx-auto flex w-full max-w-md flex-col items-center gap-8 sm:max-w-lg">
            <div
              class="flex size-20 items-center justify-center rounded-2xl bg-elevated/80 ring-1 ring-default sm:size-24">
              <UIcon
                :name="icon"
                class="size-10 text-dimmed sm:size-12" />
            </div>

            <div class="space-y-2">
              <p class="font-mono text-5xl font-bold tabular-nums text-highlighted sm:text-6xl">
                {{ code }}
              </p>
              <h1 class="text-xl font-semibold tracking-tight text-highlighted sm:text-2xl">
                {{ headline }}
              </h1>
              <p class="text-pretty text-sm leading-relaxed text-muted sm:text-base">
                {{ description }}
              </p>
            </div>

            <div class="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <UButton
                color="primary"
                size="lg"
                block
                class="sm:min-w-36 sm:flex-initial"
                icon="i-lucide-home"
                @click="goHome">
                返回首页
              </UButton>
              <UButton
                color="neutral"
                variant="soft"
                size="lg"
                block
                class="sm:min-w-36 sm:flex-initial"
                icon="i-lucide-arrow-left"
                @click="goBack">
                返回上一页
              </UButton>
            </div>

            <UButton
              v-if="code >= 500"
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-refresh-cw"
              @click="retry">
              重新加载应用
            </UButton>
          </div>
        </div>
      </UMain>
      <JKAppFooter />
    </div>
  </UApp>
</template>
