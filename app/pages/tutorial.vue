<script setup lang="ts">
import { SEO_PAGE_DESCRIPTION } from '~~/shared/constants/seo'

usePageSeo({
  title: '优质教程',
  description: SEO_PAGE_DESCRIPTION.tutorial,
})

const tutorials = []
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">教程</h1>
    <p class="mt-2 text-neutral-600 dark:text-neutral-400">内容建设中，敬请期待。</p>
  </div>
</template>
