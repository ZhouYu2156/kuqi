import { ResponseCode, type MusicDetailItem, type MusicItem, type UnionResponse } from '~~/shared/types'
import { UserRole } from '~~/shared/types/db/user'

const PLAYLIST_STORAGE_KEY = 'jk-music-playlist-v1'
const PLAY_MODE_STORAGE_KEY = 'jk-music-play-mode'

/** 单曲循环 | 顺序播放 | 随机播放 | 列表循环 */
export type MusicPlayMode = 'single' | 'sequential' | 'shuffle' | 'list-loop'

function loadPlaylistFromStorage(): MusicDetailItem[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(PLAYLIST_STORAGE_KEY)
    if (!raw) return []
    const p = JSON.parse(raw) as unknown
    return Array.isArray(p) ? (p as MusicDetailItem[]) : []
  } catch {
    return []
  }
}

function savePlaylistToStorage(list: MusicDetailItem[]) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* ignore quota */
  }
}

function loadPlayModeFromStorage(): MusicPlayMode {
  if (!import.meta.client) return 'list-loop'
  try {
    const v = localStorage.getItem(PLAY_MODE_STORAGE_KEY)
    if (v === 'single' || v === 'sequential' || v === 'shuffle' || v === 'list-loop') return v
  } catch {
    /* ignore */
  }
  return 'list-loop'
}

function savePlayModeToStorage(mode: MusicPlayMode) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(PLAY_MODE_STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}

function randomIndexExcluding(length: number, exclude: number): number {
  if (length <= 1) return 0
  let j = Math.floor(Math.random() * length)
  let guard = 0
  while (j === exclude && guard++ < length * 4) {
    j = Math.floor(Math.random() * length)
  }
  return j
}

/**
 * 全局播放状态：当前曲、播放列表（localStorage）、播放模式
 */
export function useMusicPlayback() {
  const currentMusic = useState<MusicDetailItem | null>('music.current', () => null)
  const isPlaying = useState<boolean>('music.playing', () => false)
  const playlist = useState<MusicDetailItem[]>('music.playlist', () => [])
  const playMode = useState<MusicPlayMode>('music.playMode', () => 'list-loop')

  const toast = useToast()
  const route = useRoute()
  const auth = useAuthUser()
  const { open: membershipPaywallOpen } = useMembershipPaywall()

  /** 播放需登录且为会员（vip） */
  function ensurePlayEligibility(): boolean {
    if (!auth.value?.token) {
      toast.add({ title: '请先登录后再播放', color: 'warning', icon: 'i-lucide-log-in' })
      void navigateTo({ path: '/auth/login', query: { redirect: route.fullPath } })
      return false
    }
    const role = String(auth.value.user?.role ?? '').toLowerCase()
    if (role !== UserRole.Vip) {
      membershipPaywallOpen.value = true
      toast.add({ title: '开通会员后即可播放', color: 'neutral', icon: 'i-lucide-crown' })
      return false
    }
    return true
  }
  let playlistHydrated = false

  function initPlaylistFromStorage() {
    if (!import.meta.client || playlistHydrated) return
    playlistHydrated = true
    playlist.value = loadPlaylistFromStorage()
    playMode.value = loadPlayModeFromStorage()
  }

  /** 正在播放的曲目插入或置顶播放列表 */
  function upsertPlaylist(detail: MusicDetailItem) {
    initPlaylistFromStorage()
    const id = detail.encode_album_audio_id
    const rest = playlist.value.filter((x) => x.encode_album_audio_id !== id)
    playlist.value = [detail, ...rest]
    savePlaylistToStorage(playlist.value)
  }

  function setPlayMode(mode: MusicPlayMode) {
    playMode.value = mode
    savePlayModeToStorage(mode)
  }

  /** 使用已有详情直接播放（播放列表点击） */
  async function playFromDetail(detail: MusicDetailItem, opts?: { silent?: boolean }) {
    if (!ensurePlayEligibility()) return
    initPlaylistFromStorage()
    upsertPlaylist(detail)
    currentMusic.value = detail
    isPlaying.value = true
    if (!opts?.silent) {
      toast.add({ title: '即将播放', color: 'success', icon: 'i-lucide-music' })
    }
  }

  async function playMusic(music: MusicItem, opts?: { silent?: boolean }) {
    if (!ensurePlayEligibility()) return
    const response = await $fetch<UnionResponse<MusicDetailItem>>('/api/music/detail', {
      method: 'GET',
      params: {
        audioId: music.EMixSongID,
      },
    })
    if (response.code === ResponseCode.Success) {
      if (!opts?.silent) {
        toast.add({ title: response.message, color: 'success', icon: 'i-lucide-info' })
      }
      currentMusic.value = response.data
      isPlaying.value = true
      upsertPlaylist(response.data)
    } else {
      toast.add({ title: response.message, color: 'error' })
    }
  }

  function pauseMusic() {
    isPlaying.value = false
  }

  function resumeMusic() {
    isPlaying.value = true
  }

  function currentPlaylistIndex(): number {
    const id = currentMusic.value?.encode_album_audio_id
    if (!id) return -1
    return playlist.value.findIndex((x) => x.encode_album_audio_id === id)
  }

  async function playPrevTrack() {
    initPlaylistFromStorage()
    const list = playlist.value
    const i = currentPlaylistIndex()
    if (i < 0 || !list.length) return

    const mode = playMode.value
    let target: number

    if (mode === 'shuffle') {
      target = randomIndexExcluding(list.length, i)
    } else if (mode === 'sequential') {
      if (i <= 0) return
      target = i - 1
    } else {
      target = (i - 1 + list.length) % list.length
    }

    await playFromDetail(list[target]!, { silent: true })
  }

  async function playNextTrack() {
    initPlaylistFromStorage()
    const list = playlist.value
    const i = currentPlaylistIndex()
    if (i < 0 || !list.length) return

    const mode = playMode.value
    let target: number

    if (mode === 'shuffle') {
      target = randomIndexExcluding(list.length, i)
    } else if (mode === 'sequential') {
      if (i >= list.length - 1) return
      target = i + 1
    } else {
      target = (i + 1) % list.length
    }

    await playFromDetail(list[target]!, { silent: true })
  }

  async function onTrackEnded() {
    initPlaylistFromStorage()
    const list = playlist.value
    const i = currentPlaylistIndex()
    if (i < 0 || !list.length) {
      pauseMusic()
      return
    }

    const mode = playMode.value

    if (mode === 'single') {
      return
    }

    if (mode === 'sequential') {
      if (i >= list.length - 1) {
        pauseMusic()
        return
      }
      await playFromDetail(list[i + 1]!, { silent: true })
      return
    }

    if (mode === 'shuffle') {
      if (list.length <= 1) {
        pauseMusic()
        return
      }
      const j = randomIndexExcluding(list.length, i)
      await playFromDetail(list[j]!, { silent: true })
      return
    }

    await playFromDetail(list[(i + 1) % list.length]!, { silent: true })
  }

  /** 从播放列表移除 */
  function removeFromPlaylist(id: string) {
    initPlaylistFromStorage()
    playlist.value = playlist.value.filter((x) => x.encode_album_audio_id !== id)
    savePlaylistToStorage(playlist.value)
  }

  /** 客户端首帧即恢复列表与模式，避免子组件（播放器）早于 layout onMounted 挂载时列表仍为空 */
  if (import.meta.client) {
    initPlaylistFromStorage()
  }

  return {
    currentMusic,
    isPlaying,
    playlist,
    playMode,
    initPlaylistFromStorage,
    setPlayMode,
    playMusic,
    playFromDetail,
    pauseMusic,
    resumeMusic,
    playPrevTrack,
    playNextTrack,
    onTrackEnded,
    removeFromPlaylist,
  }
}
