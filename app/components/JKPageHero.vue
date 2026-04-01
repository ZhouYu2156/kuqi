<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <section
    class="relative overflow-hidden border-b border-(--jk-ring) bg-gradient-to-b from-zinc-100 via-white to-zinc-100 px-4 py-14 sm:py-20 dark:from-(--jk-bg-dark-elevated) dark:via-(--jk-bg-dark) dark:to-(--jk-bg-dark)">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklab,var(--jk-primary)_20%,transparent),transparent_55%)]" />
    <div class="relative mx-auto max-w-7xl text-center">
      <p class="mb-4 font-mono text-xs tracking-[0.3em] uppercase text-(--jk-primary) opacity-90">
        // 全栈开发者 · 独立创作者 · 知识付费
      </p>
      <h1
        class="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl dark:text-gray-50">
        {{ title || '音乐 · 教程 · 会员一站通' }}
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-gray-400">
        {{ subtitle || '集成音乐试听与个人视频教程，面向知识付费博主：统一账号、会员权益与内容保护。' }}
      </p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
