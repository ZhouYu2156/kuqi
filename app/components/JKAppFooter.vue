<script setup lang="ts">
import type { FooterProps } from '@nuxt/ui'

const year = new Date().getFullYear()

const footerUi: FooterProps['ui'] = {
  root: 'border-t border-default bg-elevated/50',
  container: 'flex flex-col items-center justify-center py-5 text-center text-sm',
  center: 'mt-0 flex flex-col gap-1',
  left: 'hidden',
  right: 'hidden',
}
</script>

<template>
  <UFooter :ui="footerUi">
    <p class="text-muted">© {{ year }} 极客兔 · 保留所有权利</p>
  </UFooter>
</template>
