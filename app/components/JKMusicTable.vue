<script setup lang="ts">
import type { MusicDetailItem, MusicItem } from '~~/shared/types'

defineProps<{
  lists: MusicItem[]
  loading: boolean
  currentMusic: MusicDetailItem | null
  isPlaying: boolean
}>()

const emit = defineEmits<{
  play: [music: MusicItem]
  pause: []
  download: [music: MusicItem]
}>()
</script>

<template>
  <div class="overflow-x-auto shadow-md">
    <!-- 骨架屏 -->
    <JKSkeleton
      v-if="loading"
      :rows="8" />

    <!-- 实际表格 -->
    <el-table
      v-else
      :data="lists as MusicItem[]"
      style="width: 100%">
      <!-- 歌名列 -->
      <el-table-column
        label="歌名"
        min-width="280">
        <template #default="{ row }: { row: MusicItem }">
          <div class="flex items-center">
            <span
              class="truncate"
              :title="row.SongName"
              >{{ row.SongName }}</span
            >
          </div>
        </template>
      </el-table-column>

      <!-- 歌手列 -->
      <el-table-column
        prop="singer"
        label="歌手"
        min-width="120">
        <template #default="{ row }: { row: MusicItem }">
          <span
            class="truncate"
            :title="row.SingerName"
            >{{ row.SingerName }}</span
          >
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        width="120"
        fixed="right">
        <template #default="{ row }: { row: MusicItem }">
          <div class="flex items-center gap-2">
            <el-button
              circle
              type="primary"
              :icon="currentMusic?.encode_album_audio_id === row.EMixSongID && isPlaying ? 'VideoPause' : 'VideoPlay'"
              @click="
                currentMusic?.encode_album_audio_id === row.EMixSongID && isPlaying ? emit('pause') : emit('play', row)
              " />
            <el-button
              type="info"
              :class="['download-btn', 'dark:bg-primary-400 dark:hover:bg-primary-500 dark:border-primary-400']"
              :icon="'Download'"
              circle
              @click="emit('download', row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
