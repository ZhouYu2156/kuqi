<script setup lang="ts">
import { nextTick } from 'vue'
import { findActiveLrcIndex, parseLrc, type LrcLine } from '~/utils/LyricsScroll'

const props = withDefaults(
  defineProps<{
    lyricsRaw: string
    /** 当前播放时间（秒） */
    currentTimeSec: number
    /** Tailwind 字体类名，如 font-sans */
    fontClass?: string
  }>(),
  { fontClass: 'font-sans' },
)

const LINE_PX = 48

const lines = computed<LrcLine[]>(() => parseLrc(props.lyricsRaw || ''))

const activeIndex = computed(() => findActiveLrcIndex(lines.value, props.currentTimeSec))

/** 滚动对齐用下标：首句未开始时仍把第一行摆在中间区域 */
const scrollIndex = computed(() => {
  const list = lines.value
  if (list.length === 0) return 0
  const ai = activeIndex.value
  if (ai < 0) return 0
  return ai
})

const viewportRef = ref<HTMLElement | null>(null)
/** 歌词可视区域高度，用于把第 i 行中心对齐到视口垂直中心 */
const viewportH = ref(0)

function measure() {
  const el = viewportRef.value
  if (!el) return
  const h = el.getBoundingClientRect().height
  if (h > 0) viewportH.value = h
}

onMounted(() => {
  const el = viewportRef.value
  if (!el || typeof ResizeObserver === 'undefined') return
  const ro = new ResizeObserver(() => {
    measure()
  })
  ro.observe(el)
  nextTick(() => {
    requestAnimationFrame(() => {
      measure()
      requestAnimationFrame(measure)
    })
  })
  onUnmounted(() => ro.disconnect())
})

watch(
  () => lines.value.length,
  () => {
    nextTick(() => {
      requestAnimationFrame(measure)
    })
  },
)

const translateY = computed(() => {
  const H = viewportH.value > 0 ? viewportH.value : 320
  const i = scrollIndex.value
  const y = H / 2 - (i + 0.5) * LINE_PX
  // 整数像素，避免亚像素 translate + 文字光晕每帧重绘产生「抖动」
  return Math.round(y)
})

const highlightIndex = computed(() => activeIndex.value)
</script>

<template>
  <div
    ref="viewportRef"
    class="jk-lrc-viewport relative h-full min-h-[min(52vh,28rem)] w-full overflow-hidden"
    :class="fontClass">
    <div
      v-if="lines.length === 0"
      class="text-dimmed flex h-full min-h-48 items-center justify-center text-sm">
      暂无歌词
    </div>
    <div
      v-else
      class="jk-lrc-inner will-change-transform"
      :style="{ transform: `translate3d(0, ${translateY}px, 0)` }">
      <div
        v-for="(line, i) in lines"
        :key="`${line.time}-${i}`"
        class="jk-lrc-line flex items-center justify-center px-4 text-center text-base leading-snug">
        <span
          class="jk-lrc-line__text block max-w-full"
          :class="[
            highlightIndex === i
              ? 'jk-lrc-line__text--active font-semibold text-primary'
              : 'text-white/45',
          ]">
          {{ line.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jk-lrc-viewport {
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 12%,
    black 88%,
    transparent 100%
  );
}

.jk-lrc-line {
  min-height: 48px;
}

/** 光晕只在文字层动画，避免整行 scale/字号变化与 transition-all 触发布局抖动 */
.jk-lrc-line__text {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.jk-lrc-line__text--active {
  animation: jk-lrc-breathe 2.6s ease-in-out infinite;
}

@keyframes jk-lrc-breathe {
  0%,
  100% {
    text-shadow:
      0 0 4px color-mix(in oklab, var(--ui-primary) 45%, transparent),
      0 0 12px color-mix(in oklab, var(--ui-primary) 28%, transparent),
      0 0 22px color-mix(in oklab, var(--ui-primary) 12%, transparent);
  }
  50% {
    text-shadow:
      0 0 8px color-mix(in oklab, var(--ui-primary) 70%, transparent),
      0 0 18px color-mix(in oklab, var(--ui-primary) 38%, transparent),
      0 0 30px color-mix(in oklab, var(--ui-primary) 18%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .jk-lrc-line__text--active {
    animation: none;
    text-shadow:
      0 0 8px color-mix(in oklab, var(--ui-primary) 40%, transparent),
      0 0 16px color-mix(in oklab, var(--ui-primary) 20%, transparent);
  }
}

.jk-lrc-inner {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
