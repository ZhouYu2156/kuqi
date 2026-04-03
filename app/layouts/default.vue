<script setup lang="ts">
const music = useMusicPlayback()
const { open: membershipModalOpen } = useMembershipPaywall()

/** 模板里把 useState 的 Ref 展成值，满足子组件 props 类型 */
const playerMusic = computed(() => music.currentMusic.value)
const playerPlaying = computed(() => music.isPlaying.value)
const playerPlaylist = computed(() => music.playlist.value)
const playerPlayMode = computed(() => music.playMode.value)
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <JKAppHeader />
    <UMain class="flex-1">
      <slot />
    </UMain>
    <JKAppFooter />

    <!-- 挂在布局上，路由切换不卸载；Teleport 只决定 DOM 挂载到 body -->
    <JKMembershipPayModal v-model:open="membershipModalOpen" />

    <Teleport to="body">
      <JKMusicPlayer
        :current-music="playerMusic"
        :is-playing="playerPlaying"
        :playlist="playerPlaylist"
        :play-mode="playerPlayMode"
        @pause="music.pauseMusic"
        @resume="music.resumeMusic"
        @ended="music.onTrackEnded"
        @prev="music.playPrevTrack"
        @next="music.playNextTrack"
        @set-play-mode="music.setPlayMode"
        @play-from-detail="(d) => music.playFromDetail(d)"
        @remove-from-playlist="music.removeFromPlaylist" />
    </Teleport>
  </div>
</template>
