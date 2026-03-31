<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const links = ref<ButtonProps[]>([
  {
    label: 'Home',
    to: '/',
    icon: 'i-lucide-house',
    color: 'neutral',
    variant: 'subtle',
  },
  {
    label: 'Listen Music',
    to: '/music',
    color: 'primary',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right',
  },
])
</script>

<template>
  <UPageHero
    :ui="{
      container: 'py-12 sm:py-8 md:py-16 lg:py-32',
    }"
    title="极客兔工作室"
    description="一生只做一件事，用心创作优质内容."
    headline="营业中"
    orientation="horizontal"
    :links="links">
    <img
      src="https://picsum.photos/480/320"
      alt="Landing Image"
      class="rounded-lg shadow-2xl ring ring-default" />
  </UPageHero>
</template>
