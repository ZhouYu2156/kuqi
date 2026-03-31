<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const footers: NavigationMenuItem[] = [
  {
    label: 'Figma Kit',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank',
  },
  {
    label: 'Playground',
    to: 'https://stackblitz.com/edit/nuxt-ui',
    target: '_blank',
  },
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank',
  },
]
</script>

<template>
  <UFooter
    :ui="{
      root: 'border-t border-gray-200 dark:border-gray-700',
    }">
    <template #default>
      <p class="text-muted text-sm">极客兔 © {{ new Date().getFullYear() }} 版权所有</p>
    </template>
  </UFooter>
</template>
