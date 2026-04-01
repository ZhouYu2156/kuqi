<script setup lang="ts">
definePageMeta({
  layout: 'jk',
})

useHead({
  title: '视频教程',
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <h1 class="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">视频教程</h1>
    <p class="mt-2 text-zinc-600 dark:text-gray-400">
      课程列表、试看与「会员解锁」将对接订单与 <code class="text-(--jk-primary)">membershipUntil</code> 字段；页面占位，便于你接入 CDN / 第三方视频。
    </p>
    <div
      class="mt-10 flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-[color-mix(in_oklab,var(--jk-primary)_35%,transparent)] bg-zinc-100/80 text-zinc-500 dark:bg-[color-mix(in_oklab,var(--jk-bg-dark-elevated)_70%,transparent)] dark:text-gray-500">
      课程卡片网格 · 待接入
    </div>
  </div>
</template>
