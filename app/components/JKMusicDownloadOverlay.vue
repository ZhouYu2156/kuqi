<script setup lang="ts">
const props = defineProps<{
  /** 0–1；-1 为未知总长（旋转指示） */
  progress: number
  /** 歌曲展示名 */
  title: string
}>()

const r = 44
const circumference = 2 * Math.PI * r

const dashOffset = computed(() => {
  if (props.progress < 0) return 0
  return circumference * (1 - Math.min(1, Math.max(0, props.progress)))
})

const percentText = computed(() => {
  if (props.progress < 0) return '…'
  return `${Math.round(props.progress * 100)}%`
})
</script>

<template>
  <div
    class="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-[3px]"
    role="dialog"
    aria-modal="true"
    aria-labelledby="jk-dl-title"
    aria-describedby="jk-dl-desc">
    <div
      class="flex max-w-[min(92vw,22rem)] flex-col items-center gap-5 rounded-2xl border border-white/15 bg-elevated/95 px-8 py-8 shadow-2xl ring-1 ring-white/10 dark:bg-elevated/90">
      <p
        id="jk-dl-title"
        class="line-clamp-2 w-full text-center text-sm font-medium leading-snug text-highlighted">
        {{ title }}
      </p>

      <div class="relative size-36 shrink-0">
        <!-- 已知 Content-Length：环形进度 -->
        <svg
          v-if="progress >= 0"
          class="absolute inset-0 size-36 -rotate-90 text-primary"
          viewBox="0 0 100 100"
          aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            :r="r"
            fill="none"
            stroke="currentColor"
            stroke-width="5"
            class="text-default/25" />
          <circle
            cx="50"
            cy="50"
            :r="r"
            fill="none"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            class="transition-[stroke-dashoffset] duration-150 ease-out"
            :stroke-dasharray="String(circumference)"
            :stroke-dashoffset="dashOffset" />
        </svg>

        <!-- 未知总长：整圈旋转 -->
        <svg
          v-else
          class="absolute inset-0 size-36 animate-spin text-primary"
          viewBox="0 0 100 100"
          aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            :r="r"
            fill="none"
            stroke="currentColor"
            stroke-width="5"
            class="text-default/25" />
          <circle
            cx="50"
            cy="50"
            :r="r"
            fill="none"
            stroke="currentColor"
            stroke-width="5"
            stroke-dasharray="70 210"
            stroke-linecap="round" />
        </svg>

        <span
          class="pointer-events-none absolute inset-0 z-1 flex items-center justify-center text-xl font-bold tabular-nums text-highlighted">
          {{ percentText }}
        </span>
      </div>

      <p
        id="jk-dl-desc"
        class="text-xs text-muted">
        正在下载音乐
      </p>
    </div>
  </div>
</template>
