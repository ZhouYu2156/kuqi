<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div
    class="relative flex min-h-[min(100dvh,56rem)] flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true">
      <div
        class="bg-primary/15 absolute -left-1/4 top-0 h-72 w-72 rounded-full blur-3xl sm:h-96 sm:w-96" />
      <div
        class="bg-secondary/10 absolute -right-1/4 bottom-0 h-64 w-64 rounded-full blur-3xl sm:h-80 sm:w-80" />
    </div>

    <div class="relative mx-auto w-full max-w-md">
      <UCard
        variant="subtle"
        class="ring-default shadow-xl ring-1">
        <template #header>
          <div class="space-y-1 text-center">
            <h1 class="text-highlighted text-xl font-semibold tracking-tight">
              {{ title }}
            </h1>
            <p
              v-if="description"
              class="text-muted text-sm">
              {{ description }}
            </p>
          </div>
        </template>

        <div class="space-y-5">
          <slot />
        </div>
      </UCard>

      <div
        v-if="$slots.footer"
        class="text-muted mt-6 text-center text-sm">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
