<script setup lang="ts">
import type { MusicPlayMode } from '~/composables/useMusicPlayback'
import type { MusicDetailItem } from '~~/shared/types'

const LYRICS_FONT_KEY = 'jk-lyrics-font'

const fontOptions: { label: string; value: string }[] = [
  { label: '默认', value: 'font-sans' },
  { label: '方正汉真广标', value: 'font-FZHanZhenGuangBiao' },
  { label: '思源黑体', value: 'font-Quicksand-Bold' },
  { label: '站酷快乐体', value: 'font-ZKKuaiLeTi' },
]

const props = withDefaults(
  defineProps<{
    currentMusic: MusicDetailItem | null
    isPlaying: boolean
    playMode: MusicPlayMode
    playlist: MusicDetailItem[]
  }>(),
  { playlist: () => [] },
)

const emit = defineEmits<{
  pause: []
  resume: []
  ended: []
  prev: []
  next: []
  setPlayMode: [mode: MusicPlayMode]
  playFromDetail: [detail: MusicDetailItem]
  removeFromPlaylist: [id: string]
}>()

const panelOpen = ref(true)
/** 歌词滚动区域是否显示（与控件面板独立） */
const lyricsPanelOpen = ref(true)
/** 底部玻璃控件面板是否显示；关闭后仅保留精简底栏 */
const controlsPanelOpen = ref(true)
const playlistOpen = ref(false)
const volumePercent = ref(100)

/** iOS / iPadOS 上系统不允许通过 JS 调节 media volume，滑条无效 */
const isIOSVolumeLocked = computed(() => {
  if (!import.meta.client) return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/i.test(ua)) return true
  // iPadOS 13+ 桌面 UA
  if (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1)
    return true
  return false
})
const currentTimeSec = ref(0)
const durationSec = ref(0)
/** 拖动进度条时不被 timeupdate 覆盖 */
const isSeeking = ref(false)
const seekPercent = ref(0)
const lyricsFontClass = ref<string>('font-sans')

function formatTrackTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

watch(
  () => props.currentMusic?.encode_album_audio_id,
  () => {
    if (props.currentMusic) {
      panelOpen.value = true
      currentTimeSec.value = 0
      durationSec.value = 0
      seekPercent.value = 0
    } else {
      playlistOpen.value = false
    }
  },
)

watch(
  () => props.isPlaying,
  (playing, was) => {
    if (playing && was === false) panelOpen.value = true
  },
)

watch(lyricsFontClass, (c) => {
  if (!import.meta.client) return
  try {
    localStorage.setItem(LYRICS_FONT_KEY, c)
  } catch {
    /* ignore */
  }
})

function playlistIndex(): number {
  const id = props.currentMusic?.encode_album_audio_id
  if (!id) return -1
  return props.playlist.findIndex((x) => x.encode_album_audio_id === id)
}

const hasPrev = computed(() => {
  const list = props.playlist
  const n = list.length
  if (n <= 1) return false
  const i = playlistIndex()
  if (i < 0) return false
  if (props.playMode === 'sequential') return i > 0
  return true
})

const hasNext = computed(() => {
  const list = props.playlist
  const n = list.length
  if (n <= 1) return false
  const i = playlistIndex()
  if (i < 0) return false
  if (props.playMode === 'sequential') return i < n - 1
  return true
})

const PLAY_MODE_ORDER: MusicPlayMode[] = ['single', 'sequential', 'shuffle', 'list-loop']

const playModeIcon = computed(() => {
  switch (props.playMode) {
    case 'single':
      return 'i-lucide-repeat-1'
    case 'sequential':
      return 'i-lucide-list-music'
    case 'shuffle':
      return 'i-lucide-shuffle'
    default:
      return 'i-lucide-repeat'
  }
})

const playModeLabel = computed(() => {
  switch (props.playMode) {
    case 'single':
      return '单曲循环'
    case 'sequential':
      return '顺序播放'
    case 'shuffle':
      return '随机播放'
    default:
      return '列表循环'
  }
})

function cyclePlayMode() {
  const cur = props.playMode
  const idx = PLAY_MODE_ORDER.indexOf(cur)
  const next = PLAY_MODE_ORDER[(idx + 1) % PLAY_MODE_ORDER.length]!
  emit('setPlayMode', next)
}

let audio: HTMLAudioElement | null = null

function onAudioEnded() {
  if (props.playMode === 'single' && audio) {
    audio.currentTime = 0
    void audio.play().catch(() => {})
    return
  }
  emit('ended')
}

function onTimeUpdate() {
  if (!audio) return
  currentTimeSec.value = audio.currentTime
  if (!isSeeking.value && durationSec.value > 0) {
    seekPercent.value = (audio.currentTime / durationSec.value) * 100
  }
}

function onLoadedMetadata() {
  if (!audio) return
  const d = audio.duration
  durationSec.value = Number.isFinite(d) && d > 0 && d !== Number.POSITIVE_INFINITY ? d : 0
}

function applySeekFromPercent(pct: number) {
  if (!audio || durationSec.value <= 0) return
  const t = (pct / 100) * durationSec.value
  audio.currentTime = Math.min(durationSec.value, Math.max(0, t))
  currentTimeSec.value = audio.currentTime
}

function onSeekSliderUpdate(val: number | number[] | undefined) {
  if (val === undefined) return
  const v = Array.isArray(val) ? val[0]! : val
  seekPercent.value = v
  applySeekFromPercent(v)
}

function onSeekPointerDown() {
  isSeeking.value = true
}

function onSeekPointerUp() {
  isSeeking.value = false
  if (audio && durationSec.value > 0) {
    seekPercent.value = (audio.currentTime / durationSec.value) * 100
  }
}

function applyVolume() {
  if (audio) audio.volume = Math.min(1, Math.max(0, volumePercent.value / 100))
}

watch(volumePercent, () => applyVolume())

/** 必须在客户端 Audio 实例创建后调用（首屏即有 currentMusic 时依赖 onMounted 里 bind） */
function bindAudioFromCurrentMusic() {
  if (!import.meta.client || !audio) return
  const m = props.currentMusic
  if (!m?.play_url) {
    audio.pause()
    audio.removeAttribute('src')
    durationSec.value = 0
    currentTimeSec.value = 0
    seekPercent.value = 0
    return
  }
  audio.src = m.play_url
  applyVolume()
  currentTimeSec.value = 0
  durationSec.value = 0
  seekPercent.value = 0
  if (props.isPlaying) void audio.play().catch(() => {})
  else audio.pause()
}

onMounted(() => {
  if (!import.meta.client) return
  try {
    const v = localStorage.getItem(LYRICS_FONT_KEY)
    if (v && fontOptions.some((o) => o.value === v)) lyricsFontClass.value = v
  } catch {
    /* ignore */
  }

  audio = new Audio()
  audio.setAttribute('playsInline', 'true')
  audio.preload = 'auto'
  audio.addEventListener('ended', onAudioEnded)
  audio.addEventListener('timeupdate', onTimeUpdate)
  audio.addEventListener('loadedmetadata', onLoadedMetadata)
  audio.addEventListener('durationchange', onLoadedMetadata)
  audio.addEventListener('canplay', onLoadedMetadata)
  applyVolume()
  bindAudioFromCurrentMusic()
})

onUnmounted(() => {
  if (audio) {
    audio.removeEventListener('ended', onAudioEnded)
    audio.removeEventListener('timeupdate', onTimeUpdate)
    audio.removeEventListener('loadedmetadata', onLoadedMetadata)
    audio.removeEventListener('durationchange', onLoadedMetadata)
    audio.removeEventListener('canplay', onLoadedMetadata)
    audio.pause()
    audio.src = ''
    audio = null
  }
})

watch(
  () => props.currentMusic?.encode_album_audio_id,
  () => bindAudioFromCurrentMusic(),
)

watch(
  () => props.isPlaying,
  (playing) => {
    if (!audio || !props.currentMusic?.play_url) return
    if (playing) void audio.play().catch(() => {})
    else audio.pause()
  },
)

function togglePlay() {
  if (props.isPlaying) emit('pause')
  else emit('resume')
}

function hidePanel() {
  panelOpen.value = false
}

function openPanel() {
  panelOpen.value = true
}

function toggleLyricsPanel() {
  lyricsPanelOpen.value = !lyricsPanelOpen.value
}

function hideControlsPanel() {
  controlsPanelOpen.value = false
}

function showControlsPanel() {
  controlsPanelOpen.value = true
}

const coverSrc = computed(() => {
  const img = props.currentMusic?.img
  if (!img) return ''
  return img.replace(/\{size\}/g, '400')
})
</script>

<template>
  <!-- 收起后独立于全屏层，避免随 translate 移出视口；半露出底部供再次打开 -->
  <button
    v-if="currentMusic && !panelOpen"
    type="button"
    class="jk-player-peek text-default fixed z-50 flex max-w-[min(92vw,22rem)] cursor-pointer items-center justify-center gap-2 rounded-t-2xl border border-white/25 bg-white/25 px-4 py-2.5 text-sm shadow-2xl backdrop-blur-md transition hover:bg-white/35 dark:border-white/15 dark:bg-slate-900/55 dark:hover:bg-slate-900/70"
    :style="{
      left: '50%',
      transform: 'translateX(-50%) translateY(50%)',
      bottom: 'max(0.25rem, env(safe-area-inset-bottom, 0px))',
    }"
    aria-label="展开播放器"
    title="展开播放器"
    @click="openPanel">
    <UIcon
      name="i-lucide-chevron-up"
      class="text-primary size-5 shrink-0" />
    <span class="truncate font-medium text-highlighted">{{ currentMusic.song_name }}</span>
  </button>

  <Transition
    appear
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0">
    <div
      v-if="currentMusic"
      class="fixed inset-0 z-40 flex max-h-dvh flex-col transition-transform duration-500 ease-in-out"
      :class="panelOpen ? 'translate-y-0' : 'pointer-events-none translate-y-full'">
      <!-- 底层：全屏模糊封面，始终在歌词下方 -->
      <div
        class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true">
        <img
          v-if="coverSrc"
          :src="coverSrc"
          alt=""
          class="h-full min-h-full w-full min-w-full scale-110 object-cover saturate-125 transition-[filter] duration-700 ease-in-out motion-reduce:transition-none"
          :class="lyricsPanelOpen ? 'blur-3xl' : 'blur-none'"
          loading="eager"
          decoding="async" />
        <div
          v-else
          class="from-muted to-default h-full min-h-full w-full bg-linear-to-br" />
        <div
          class="absolute inset-0 bg-black/50 transition-[backdrop-filter] duration-700 ease-in-out motion-reduce:transition-none"
          :class="lyricsPanelOpen ? 'backdrop-blur-sm' : 'backdrop-blur-none'" />
      </div>

      <!-- 歌词层（全屏剩余高度，叠在模糊封面之上） -->
      <div class="relative z-1 flex min-h-0 flex-1 flex-col px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div
          v-show="lyricsPanelOpen"
          class="flex min-h-0 flex-1 flex-col overflow-hidden">
          <JKPlayerLyricsScroller
            :key="currentMusic.encode_album_audio_id"
            class="min-h-0 flex-1"
            :lyrics-raw="currentMusic.lyrics || ''"
            :current-time-sec="currentTimeSec"
            :font-class="lyricsFontClass" />
        </div>
        <div
          v-show="!lyricsPanelOpen"
          class="text-dimmed flex min-h-[40vh] flex-1 items-center justify-center text-sm">
          歌词面板已关闭
        </div>
      </div>

      <!-- 控件面板关闭时：精简底栏（仍可播放与打开列表） -->
      <div
        v-if="!controlsPanelOpen"
        class="relative z-3 mx-3 mb-[max(0.75rem,env(safe-area-inset-bottom))] mt-auto flex max-w-xl flex-col gap-2 rounded-2xl border border-white/20 bg-white/20 px-3 py-2.5 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/55 sm:mx-auto sm:w-full">
        <p
          v-if="isIOSVolumeLocked"
          class="text-dimmed text-center text-[11px] leading-snug">
          控件面板已隐藏。iPhone/iPad 上请用侧键或控制中心调节音量。
        </p>
        <p
          v-else
          class="text-dimmed text-center text-[11px]">
          控件面板已隐藏
        </p>
        <div class="flex items-center justify-between gap-2">
          <UButton
            color="primary"
            variant="soft"
            size="sm"
            icon="i-lucide-chevrons-up"
            label="展开控件"
            class="shrink-0"
            @click="showControlsPanel" />
          <div class="flex min-w-0 flex-1 items-center justify-center gap-1">
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              square
              icon="i-lucide-skip-back"
              class="rounded-full"
              aria-label="上一首"
              :disabled="!hasPrev"
              @click="emit('prev')" />
            <UButton
              color="primary"
              variant="solid"
              size="md"
              square
              :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
              class="rounded-full"
              :aria-label="isPlaying ? '暂停' : '播放'"
              @click="togglePlay" />
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              square
              icon="i-lucide-skip-forward"
              class="rounded-full"
              aria-label="下一首"
              :disabled="!hasNext"
              @click="emit('next')" />
          </div>
          <div class="flex shrink-0 items-center gap-1">
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              square
              :icon="lyricsPanelOpen ? 'i-lucide-panel-top-open' : 'i-lucide-panel-top-close'"
              class="rounded-full"
              :title="lyricsPanelOpen ? '隐藏歌词面板' : '显示歌词面板'"
              @click="toggleLyricsPanel" />
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              icon="i-lucide-list-music"
              class="rounded-full"
              aria-label="播放列表"
              title="播放列表"
              @click="playlistOpen = true" />
          </div>
        </div>
      </div>

      <!-- 前层：播放控件面板 -->
      <div
        v-show="controlsPanelOpen"
        class="jk-player-glass relative z-2 mx-3 mb-[max(0.75rem,env(safe-area-inset-bottom))] mt-auto max-h-[min(52vh,560px)] overflow-y-auto rounded-2xl shadow-2xl ring-1 ring-white/20 dark:ring-white/10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div class="flex items-center justify-end gap-1 border-b border-white/10 px-3 py-2 dark:border-white/5">
          <UButton
            color="neutral"
            variant="soft"
            size="sm"
            square
            icon="i-lucide-chevrons-down"
            aria-label="收起控件面板（精简为底栏）"
            title="收起控件面板"
            @click="hideControlsPanel" />
          <UButton
            color="error"
            variant="soft"
            size="sm"
            square
            icon="ep:close"
            aria-label="收起播放器"
            title="收起"
            @click="hidePanel" />
        </div>

        <div class="flex flex-col gap-3 px-3 pb-4 pt-3 sm:gap-4 sm:px-4">
          <!-- 顶部：可拖动进度条 + 当前/总时长 -->
          <div class="space-y-1.5">
            <USlider
              :model-value="seekPercent"
              color="primary"
              size="sm"
              :min="0"
              :max="100"
              :step="0.25"
              :disabled="durationSec <= 0"
              class="w-full"
              aria-label="播放进度"
              :ui="{
                track: 'bg-white/20 dark:bg-white/10',
              }"
              @update:model-value="onSeekSliderUpdate"
              @pointerdown="onSeekPointerDown"
              @pointerup="onSeekPointerUp"
              @pointercancel="onSeekPointerUp" />
            <div class="text-muted flex justify-between text-xs tabular-nums">
              <span>{{ formatTrackTime(currentTimeSec) }}</span>
              <span>{{ durationSec > 0 ? formatTrackTime(durationSec) : '--:--' }}</span>
            </div>
          </div>

          <div class="text-center">
            <p class="truncate text-base font-semibold text-highlighted">
              {{ currentMusic.song_name }}
            </p>
            <p class="text-muted truncate text-sm">{{ currentMusic.author_name }} · {{ currentMusic.album_name }}</p>
          </div>

          <!-- 旋转封面（播放时旋转） -->
          <div class="flex justify-center py-1">
            <div
              class="jk-cover-disc size-30 shrink-0 overflow-hidden rounded-full shadow-xl ring-2 ring-white/30 sm:size-36 dark:ring-white/15"
              :class="{ 'jk-cover-disc--playing': isPlaying }">
              <img
                v-if="coverSrc"
                :src="coverSrc"
                alt=""
                class="jk-cover-img h-full w-full object-cover"
                loading="lazy" />
              <div
                v-else
                class="bg-muted flex h-full w-full items-center justify-center">
                <UIcon
                  name="i-lucide-disc-3"
                  class="text-dimmed size-14" />
              </div>
            </div>
          </div>

          <!-- 底栏：左（模式/列表） | 中（上一曲/播放/下一曲） | 右（歌词/字体/音效/音量） -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div class="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:justify-start sm:pl-1">
              <div
                v-if="isIOSVolumeLocked"
                class="text-dimmed flex min-w-0 max-w-44 flex-1 flex-col gap-0.5 text-[10px] leading-tight sm:min-w-36">
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-lucide-volume-x"
                    class="text-muted size-4 shrink-0" />
                  音量由系统控制
                </span>
              </div>
              <div
                v-else
                class="flex min-w-32 max-w-44 flex-1 items-center gap-2 sm:min-w-36">
                <UIcon
                  name="i-lucide-volume-2"
                  class="text-muted size-4 shrink-0" />
                <input
                  v-model.number="volumePercent"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="jk-volume-h accent-primary h-2 min-w-0 flex-1 cursor-pointer"
                  aria-label="音量" />
                <span class="text-dimmed w-7 shrink-0 text-right text-[10px] tabular-nums">{{ volumePercent }}</span>
              </div>
            </div>

            <div class="flex shrink-0 items-center justify-center gap-2 px-1">
              <UButton
                color="neutral"
                variant="soft"
                size="lg"
                square
                icon="i-lucide-skip-back"
                class="rounded-full"
                aria-label="上一首"
                :disabled="!hasPrev"
                @click="emit('prev')" />
              <UButton
                color="primary"
                variant="solid"
                size="xl"
                square
                :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                class="rounded-full px-5"
                :aria-label="isPlaying ? '暂停' : '播放'"
                @click="togglePlay" />
              <UButton
                color="neutral"
                variant="soft"
                size="lg"
                square
                icon="i-lucide-skip-forward"
                class="rounded-full"
                aria-label="下一首"
                :disabled="!hasNext"
                @click="emit('next')" />
            </div>

            <div class="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:justify-end sm:pr-1">
              <UButton
                color="neutral"
                variant="soft"
                size="sm"
                :icon="lyricsPanelOpen ? 'i-lucide-panel-top-open' : 'i-lucide-panel-top-close'"
                class="rounded-full"
                :title="lyricsPanelOpen ? '隐藏歌词面板' : '显示歌词面板'"
                :aria-label="lyricsPanelOpen ? '隐藏歌词面板' : '显示歌词面板'"
                @click="toggleLyricsPanel" />

              <UButton
                color="neutral"
                variant="soft"
                size="sm"
                :icon="playModeIcon"
                class="rounded-full"
                :title="`${playModeLabel}`"
                :aria-label="`${playModeLabel}`"
                @click="cyclePlayMode" />

              <UButton
                color="neutral"
                variant="soft"
                size="sm"
                :icon="playlistOpen ? 'i-ep:fold' : 'i-ep:expand'"
                class="rounded-full"
                aria-label="播放列表"
                title="播放列表"
                @click="playlistOpen = true" />

              <UPopover
                :content="{ side: 'top', sideOffset: 8 }"
                :ui="{ content: 'z-300' }">
                <UButton
                  color="neutral"
                  variant="soft"
                  size="sm"
                  icon="i-lucide-audio-waveform"
                  class="rounded-full"
                  title="音效"
                  aria-label="音效" />
                <template #content>
                  <div class="w-56 space-y-2 p-3 text-sm">
                    <p class="text-muted text-xs">音效（预留，未接入处理）</p>
                    <ul class="divide-default divide-y rounded-lg border border-default">
                      <li
                        v-for="label in ['延迟', '混响', '失声']"
                        :key="label"
                        class="text-dimmed flex items-center justify-between gap-2 px-3 py-2 text-xs">
                        <span>{{ label }}</span>
                        <span class="text-muted shrink-0">敬请期待</span>
                      </li>
                    </ul>
                  </div>
                </template>
              </UPopover>

              <USelect
                v-model="lyricsFontClass"
                :items="fontOptions"
                value-key="value"
                label-key="label"
                size="sm"
                class="w-28 min-w-34"
                aria-label="歌词字体"
                :ui="{ content: 'z-300 w-full' }" />
            </div>
          </div>
        </div>
      </div>

      <!-- 播放列表：自右向左滑出，锚定右下角固定高度 -->
      <USlideover
        v-model:open="playlistOpen"
        side="right"
        inset
        title="播放列表"
        description="本地队列"
        :ui="{
          overlay: 'z-300',
          content:
            'z-301 fixed! inset-y-auto! right-[max(0.75rem,env(safe-area-inset-right))]! bottom-[max(0.75rem,env(safe-area-inset-bottom))]! top-auto! left-auto! h-[min(70vh,28rem)]! max-h-[min(70vh,28rem)]! w-[min(92vw,20rem)]! sm:w-80! max-w-md! rounded-2xl flex flex-col overflow-hidden shadow-2xl',
          body: 'flex-1 min-h-0 overflow-y-auto p-2 sm:p-3',
          header: 'shrink-0 border-b border-default py-3 sm:px-4 sm:py-3',
        }">
        <template #body="{ close }">
          <ul class="space-y-1">
            <li
              v-for="item in playlist"
              :key="item.encode_album_audio_id"
              class="hover:bg-elevated/80 flex items-center gap-2 rounded-lg px-2 py-1.5"
              :class="{ 'bg-elevated/80': item.encode_album_audio_id === currentMusic?.encode_album_audio_id }">
              <button
                type="button"
                class="min-w-0 flex-1 truncate text-left text-sm"
                @click="
                  () => {
                    emit('playFromDetail', item)
                    close()
                  }
                ">
                <span class="text-highlighted font-medium">{{ item.song_name }}</span>
                <span class="text-dimmed block truncate text-xs">{{ item.author_name }}</span>
              </button>
              <UButton
                color="error"
                variant="soft"
                size="xs"
                icon="i-lucide-x"
                square
                class="shrink-0"
                aria-label="从列表移除"
                @click="emit('removeFromPlaylist', item.encode_album_audio_id)" />
            </li>
          </ul>
          <p
            v-if="playlist.length === 0"
            class="text-dimmed py-6 text-center text-sm">
            暂无曲目，播放歌曲后会自动加入
          </p>
        </template>
      </USlideover>
    </div>
  </Transition>
</template>

<style scoped>
.jk-player-glass {
  background: linear-gradient(
    135deg,
    rgb(255 255 255 / 0.22) 0%,
    rgb(255 255 255 / 0.08) 50%,
    rgb(255 255 255 / 0.12) 100%
  );
  backdrop-filter: blur(20px) saturate(1.35);
  -webkit-backdrop-filter: blur(20px) saturate(1.35);
}

.dark .jk-player-glass {
  background: linear-gradient(135deg, rgb(15 23 42 / 0.72) 0%, rgb(15 23 42 / 0.4) 50%, rgb(30 41 59 / 0.55) 100%);
}

/* 封面黑胶旋转 */
.jk-cover-img {
  animation: jk-cover-spin 22s linear infinite;
  animation-play-state: paused;
}

.jk-cover-disc--playing .jk-cover-img {
  animation-play-state: running;
}

@keyframes jk-cover-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .jk-cover-img {
    animation: none;
  }
}
</style>
