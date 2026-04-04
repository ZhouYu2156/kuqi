<script setup lang="ts">
import type { TreasuredListItem, UnionResponse } from '~~/shared/types'
import { ResponseCode } from '~~/shared/types'

const music = useMusicPlayback()
const toast = useToast()

const list = ref<TreasuredListItem[]>([])
const pending = ref(true)

const currentIdPlaying = computed(() => {
  const enc = music.currentMusic.value?.encode_album_audio_id
  if (!enc?.startsWith('treasured:')) return null
  return enc.slice('treasured:'.length)
})

const isPlayingThis = (id: string) => music.isPlaying.value && currentIdPlaying.value === id

async function loadList() {
  pending.value = true
  try {
    const res = await $fetch<UnionResponse<{ list: TreasuredListItem[] }>>('/api/music/treasured')
    if (res.code === ResponseCode.Success) {
      list.value = res.data.list
    } else {
      toast.add({ title: res.message, color: 'error', icon: 'i-lucide-circle-alert' })
    }
  } catch {
    toast.add({ title: '珍藏音乐列表加载失败', color: 'error', icon: 'i-lucide-wifi-off' })
  } finally {
    pending.value = false
  }
}

function onPlayClick(id: string) {
  if (isPlayingThis(id)) {
    music.pauseMusic()
    return
  }
  void music.playTreasured(id)
}

onMounted(() => {
  void loadList()
})
</script>

<template>
  <section
    class="border-default mt-10 border-t pt-10"
    aria-labelledby="treasured-music-heading">
    <div class="mb-6 text-center">
      <h2
        id="treasured-music-heading"
        class="text-highlighted text-xl font-bold tracking-tight sm:text-2xl">
        珍藏音乐
      </h2>
      <p class="text-muted mt-2 text-sm sm:text-base">不知道该听些什么？试试珍藏推荐吧~</p>
    </div>

    <div
      v-if="pending"
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
      <div
        v-for="n in 10"
        :key="n"
        class="bg-elevated aspect-square animate-pulse rounded-xl" />
    </div>

    <div
      v-else
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
      <article
        v-for="item in list"
        :key="item.id"
        class="group border-default bg-default overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md">
        <div class="bg-muted relative aspect-square overflow-hidden">
          <img
            v-if="item.cover"
            :src="item.cover"
            :alt="`${item.song_name} 封面`"
            class="size-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async" />
          <div
            v-else
            class="text-dimmed flex size-full items-center justify-center bg-linear-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800">
            <UIcon
              name="i-lucide-disc-3"
              class="size-12 opacity-80" />
          </div>

          <div
            class="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/35"
            aria-hidden="true" />
          <button
            type="button"
            class="absolute inset-0 flex items-center justify-center focus:outline-none"
            :aria-label="isPlayingThis(item.id) ? '暂停' : `播放 ${item.song_name}`"
            @click="onPlayClick(item.id)">
            <span
              class="flex size-12 items-center justify-center rounded-full bg-white/95 text-neutral-900 opacity-0 shadow-lg transition group-hover:opacity-100 dark:bg-neutral-900/95 dark:text-white"
              :class="{ 'opacity-100!': isPlayingThis(item.id) }">
              <UIcon
                :name="isPlayingThis(item.id) ? 'i-lucide-pause' : 'i-lucide-play'"
                class="size-6" />
            </span>
          </button>
        </div>
        <div class="px-2.5 py-2.5 sm:px-3">
          <p
            class="text-highlighted truncate text-sm font-medium"
            :title="item.song_name">
            {{ item.song_name }}
          </p>
          <p
            class="text-muted mt-0.5 truncate text-xs"
            :title="item.author_name">
            {{ item.author_name }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
