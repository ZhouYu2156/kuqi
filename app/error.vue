<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UApp>
    <JKHeader />

    <UError
      :clear="{
        label: '返回首页',
        to: '/',
        size: 'lg',
        color: 'primary',
        variant: 'outline',
      }"
      :error="{
        statusCode: 404,
        statusMessage: 'Page not found',
        message: 'The page you are looking for does not exist.',
      }" />

    <JKFooter />
  </UApp>
</template>
