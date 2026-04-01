<script setup lang="ts">
definePageMeta({
  layout: 'jk',
})

useHead({
  title: '首页',
})
</script>

<template>
  <div>
    <JKPageHero>
      <template #actions>
        <NuxtLink
          to="/music"
          class="inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-semibold text-gray-950 shadow-lg hover:opacity-90 dark:text-gray-950"
          :style="{
            background: 'var(--jk-primary)',
            boxShadow: '0 12px 40px color-mix(in oklab, var(--jk-primary) 35%, transparent)',
          }">
          即刻听音乐
        </NuxtLink>
        <NuxtLink
          to="/learn"
          class="inline-flex items-center justify-center rounded-lg border px-8 py-3 text-sm font-medium transition-colors hover:bg-(--jk-primary-soft)"
          :style="{ borderColor: 'color-mix(in oklab, var(--jk-primary) 45%, transparent)', color: 'var(--jk-primary)' }">
          视频教程
        </NuxtLink>
        <NuxtLink
          to="/login"
          class="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5">
          登录 / 开通权益
        </NuxtLink>
      </template>
    </JKPageHero>

    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div class="grid gap-6 md:grid-cols-3">
        <div
          class="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-[color-mix(in_oklab,var(--jk-bg-dark-elevated)_85%,transparent)]">
          <div class="text-2xl text-(--jk-primary)">♪</div>
          <h3 class="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">音乐模块</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-gray-400">
            沿用现有搜索与播放能力，可扩展会员曲库、下载与歌单（接口层已统一响应格式）。
          </p>
          <NuxtLink
            to="/music"
            class="mt-4 inline-block text-sm font-medium text-(--jk-primary) hover:underline">
            进入音乐 →
          </NuxtLink>
        </div>
        <div
          class="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-[color-mix(in_oklab,var(--jk-bg-dark-elevated)_85%,transparent)]">
          <div class="text-2xl text-(--jk-primary)">▶</div>
          <h3 class="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">视频教程</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-gray-400">
            个人课程页占位已就绪；后续接入视频源、订单与「仅会员可看」需配合鉴权中间件。
          </p>
          <NuxtLink
            to="/learn"
            class="mt-4 inline-block text-sm font-medium text-(--jk-primary) hover:underline">
            查看课程 →
          </NuxtLink>
        </div>
        <div
          class="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-[color-mix(in_oklab,var(--jk-bg-dark-elevated)_85%,transparent)]">
          <div class="text-2xl text-(--jk-primary)">◇</div>
          <h3 class="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">会员与后台</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-gray-400">
            角色含 guest / user / vip / admin；管理员可使用后台扩展用户与订单管理。
          </p>
          <NuxtLink
            to="/login"
            class="mt-4 inline-block text-sm font-medium text-(--jk-primary) hover:underline">
            去登录 →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
