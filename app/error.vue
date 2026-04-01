<script setup lang="ts">
import type { NuxtError } from '#app'

const { rootStyle, hydrateFromStorage } = useJkTheme()

onMounted(() => {
  hydrateFromStorage()
})

defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UApp>
    <div
      class="jk-theme min-h-screen bg-zinc-50 text-zinc-900 dark:bg-(--jk-bg-dark) dark:text-gray-100"
      :style="rootStyle">
      <JKNav />
      <div class="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16">
        <UError
          :clear="{
            label: '返回首页',
            to: '/',
            size: 'lg',
            color: 'primary',
            variant: 'outline',
          }"
          :error="error" />
      </div>
    </div>
  </UApp>
</template>
