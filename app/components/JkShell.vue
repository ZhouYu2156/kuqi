<script setup lang="ts">
const { rootStyle, hydrateFromStorage } = useJkTheme()

onMounted(() => {
  hydrateFromStorage()
})
</script>

<template>
  <div
    class="jk-theme flex min-h-screen flex-col bg-zinc-50 text-zinc-900 transition-colors dark:bg-(--jk-bg-dark) dark:text-gray-100"
    :style="rootStyle">
    <JKNav />
    <main class="flex min-h-0 flex-1 flex-col">
      <slot />
    </main>
    <JkSiteFooter />
  </div>
</template>
