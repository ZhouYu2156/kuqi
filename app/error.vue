<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UApp>
    <SiteHeader />

    <UMain>
      <UError
        :clear="{
          label: '返回首页',
          to: '/',
          size: 'lg',
          color: 'primary',
          variant: 'outline',
        }"
        :error="error" />
    </UMain>

    <SiteFooter />
  </UApp>
</template>
