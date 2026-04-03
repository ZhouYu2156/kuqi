<script setup lang="ts">
import type { MusicDetailItem, MusicItem } from '~~/shared/types'

defineProps<{
  lists: MusicItem[]
  loading: boolean
  currentMusic: MusicDetailItem | null
  isPlaying: boolean
  /** 正在下载时非 null，用于禁用下载按钮 */
  downloadingId: string | null
}>()

const emit = defineEmits<{
  play: [music: MusicItem]
  pause: []
  download: [music: MusicItem]
}>()

const columns = [
  { accessorKey: 'SongName', header: '歌名' },
  { accessorKey: 'SingerName', header: '歌手' },
  { id: 'actions', header: '操作' },
] as const

function isCurrentPlaying(row: MusicItem, current: MusicDetailItem | null, playing: boolean) {
  return playing && current?.encode_album_audio_id === row.EMixSongID
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-default shadow-sm">
    <div
      v-if="loading"
      class="divide-y divide-default p-4">
      <JKMusicListSkeleton />
    </div>

    <UTable
      v-else
      :data="lists"
      :columns="[...columns]"
      class="min-w-full"
    >
      <template #SongName-cell="{ row }">
        <span
          class="block max-w-[min(100%,280px)] truncate font-medium text-highlighted"
          :title="row.original.SongName">
          {{ row.original.SongName }}
        </span>
      </template>

      <template #SingerName-cell="{ row }">
        <span
          class="block max-w-[min(100%,200px)] truncate text-muted"
          :title="row.original.SingerName">
          {{ row.original.SingerName }}
        </span>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            square
            :icon="isCurrentPlaying(row.original, currentMusic, isPlaying) ? 'i-lucide-pause' : 'i-lucide-play'"
            :aria-label="isCurrentPlaying(row.original, currentMusic, isPlaying) ? '暂停' : '播放'"
            @click="
              isCurrentPlaying(row.original, currentMusic, isPlaying) ? emit('pause') : emit('play', row.original)
            " />
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            square
            icon="i-lucide-download"
            aria-label="下载"
            :disabled="!!downloadingId"
            @click="emit('download', row.original)" />
        </div>
      </template>
    </UTable>
  </div>
</template>
