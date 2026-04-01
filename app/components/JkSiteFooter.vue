<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="mt-auto border-t border-zinc-200/80 py-5 text-center text-xs text-zinc-500 dark:border-white/10 dark:text-gray-500">
    © {{ year }} 极客兔 · 版权所有
  </footer>
</template>
