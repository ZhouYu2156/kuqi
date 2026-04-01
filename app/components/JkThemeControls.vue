<script setup lang="ts">
const { preset, presets, setAccent, hydrateFromStorage } = useJkTheme()

onMounted(() => {
  hydrateFromStorage()
})
</script>

<template>
  <UPopover mode="hover" :content="{ side: 'bottom', align: 'end' }">
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      class="border border-zinc-200 text-(--jk-primary) hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
      aria-label="主色调">
      <span class="inline-block size-3.5 rounded-full ring-2 ring-(--jk-ring)" :style="{ background: preset.primary }" />
    </UButton>
    <template #content>
      <div class="w-[min(100vw-2rem,17.5rem)] max-h-[min(70vh,22rem)] overflow-y-auto p-3">
        <p class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">主色调</p>
        <div class="grid grid-cols-3 gap-2 pr-0.5">
          <button
            v-for="p in presets"
            :key="p.id"
            type="button"
            class="flex flex-col items-center gap-1 rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5"
            :class="preset.id === p.id ? 'bg-zinc-100 ring-1 ring-(--jk-ring) dark:bg-white/10' : ''"
            :title="p.label"
            @click="setAccent(p.id)">
            <span
              class="size-8 rounded-full ring-2 ring-white/20"
              :style="{ background: p.primary, boxShadow: `0 0 0 2px ${p.ring}` }" />
            <span class="max-w-full truncate text-[10px] text-gray-400">{{ p.label }}</span>
          </button>
        </div>
      </div>
    </template>
  </UPopover>
</template>
