<script setup lang="ts">
import {
  ResponseCode,
  type MusicDetailItem,
  type MusicItem,
  type MusicSearchResponse,
  type UnionResponse,
} from '~~/shared/types'

const toast = useToast()

type ISearchState = {
  kw: string
  isSearching: boolean
  searchResults: MusicItem[]
  page: number
  pagesize: number
  total: number
}

const searchState = ref<ISearchState>({
  kw: '',
  isSearching: false,
  searchResults: [],
  page: 1,
  pagesize: 10,
  total: 0,
})

const lastFetchedKeyword = ref('')

const pageSizeOptions = [10, 15, 20, 30]
const pageSizeItems = pageSizeOptions.map((size) => ({
  label: `${size}条/页`,
  value: size,
}))

const quotaModalOpen = ref(false)
const quotaModalMessage = ref('')
let quotaModalResolve: ((value: boolean) => void) | null = null

watch(quotaModalOpen, (open) => {
  if (!open && quotaModalResolve) {
    const res = quotaModalResolve
    quotaModalResolve = null
    res(false)
  }
})

function openQuotaModal(message: string): Promise<boolean> {
  quotaModalMessage.value = message
  quotaModalOpen.value = true
  return new Promise<boolean>((resolve) => {
    quotaModalResolve = resolve
  })
}

function onQuotaConfirm() {
  const res = quotaModalResolve
  quotaModalResolve = null
  quotaModalOpen.value = false
  res?.(true)
}

async function handleMusicSearch(overrideKeyword?: string) {
  if (overrideKeyword !== undefined) {
    searchState.value.kw = overrideKeyword
  }

  const q = searchState.value.kw.trim()
  if (!q) {
    toast.add({ title: '请输入关键词搜索', icon: 'i-lucide-search', color: 'neutral' })
    return
  }

  const keywordChanged = q !== lastFetchedKeyword.value
  if (keywordChanged) {
    lastFetchedKeyword.value = q
    if (searchState.value.page !== 1) {
      searchState.value.page = 1
      return
    }
  }

  searchState.value.isSearching = true

  const response = await $fetch<MusicSearchResponse>('/api/music/', {
    method: 'GET',
    params: {
      keyword: q,
      page: searchState.value.page,
      pagesize: searchState.value.pagesize,
    },
  })

  if (response.code === ResponseCode.Success) {
    searchState.value = {
      ...searchState.value,
      kw: q,
      page: response.data.page,
      pagesize: response.data.pagesize,
      total: response.data.total,
      searchResults: response.data.lists,
    }
    toast.add({ title: response.message, color: 'success' })
  }
  searchState.value.isSearching = false
}

watch([() => searchState.value.page, () => searchState.value.pagesize], () => {
  if (!searchState.value.kw.trim()) return
  handleMusicSearch()
})

onMounted(() => {})

class MusicPlayController {
  isPlaying: boolean = false
  currentMusic: MusicDetailItem | null = null

  constructor() {
    this.isPlaying = false
    this.currentMusic = null
  }

  playMusic = async (music: MusicItem) => {
    try {
      const response = await $fetch<UnionResponse<MusicDetailItem & { play_url?: string }>>('/api/music/', {
        method: 'POST',
        params: {
          audioId: music.EMixSongID,
        },
        credentials: 'include',
      })

      if (response.code === ResponseCode.Unauthorized) {
        toast.add({ title: response.message || '请先登录后再试听', color: 'warning' })
        await navigateTo('/login')
        return
      }

      if (response.code === ResponseCode.Forbidden) {
        const go = await openQuotaModal(response.message || '今日免费试听额度已用完，可开通会员后继续畅听与下载。')
        if (go) {
          await navigateTo('/membership')
        }
        return
      }

      if (response.code !== ResponseCode.Success || !response.data?.play_url) {
        toast.add({ title: response.message || '无法获取播放地址', color: 'error' })
        return
      }

      this.currentMusic = response.data
      this.isPlaying = true
      const player = new Audio(response.data.play_url)
      await player.play()
    } catch (e) {
      console.error(e)
      toast.add({ title: '播放请求失败', color: 'error' })
    }
  }
  pauseMusic = () => {}
  downloadMusic = (_music: MusicItem) => {}
}

const playController = new MusicPlayController()
</script>

<template>
  <div class="mb-12">
    <div class="mx-auto w-full max-w-5xl px-3 sm:px-5">
      <div class="mb-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <UInput
          v-model="searchState.kw"
          size="lg"
          class="min-w-0 flex-1"
          placeholder="搜索歌名、歌手、歌词..."
          icon="i-lucide-search"
          @keyup.enter="handleMusicSearch()" />
        <UButton
          color="primary"
          size="lg"
          class="w-full shrink-0 justify-center sm:w-auto sm:min-w-28"
          :loading="searchState.isSearching"
          @click="handleMusicSearch()">
          搜索
        </UButton>
      </div>

      <UModal
        v-model:open="quotaModalOpen"
        title="试听额度"
        :dismissible="true"
        class="sm:max-w-md">
        <template #body>
          <p class="text-muted text-sm leading-relaxed">
            {{ quotaModalMessage }}
          </p>
        </template>
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <UButton
              color="neutral"
              variant="outline"
              @click="quotaModalOpen = false">
              取消
            </UButton>
            <UButton
              color="primary"
              @click="onQuotaConfirm">
              了解会员
            </UButton>
          </div>
        </template>
      </UModal>

      <template v-if="searchState.searchResults.length > 0">
        <div class="w-full space-y-6">
          <JKMusicTable
            :lists="searchState.searchResults"
            :loading="searchState.isSearching"
            :current-music="playController.currentMusic"
            :is-playing="playController.isPlaying"
            @play="playController.playMusic"
            @pause="playController.pauseMusic"
            @download="playController.downloadMusic" />

          <div class="flex flex-wrap items-center justify-end gap-3">
            <USelect
              v-model="searchState.pagesize"
              :items="pageSizeItems"
              value-key="value"
              label-key="label"
              class="w-36" />
            <UPagination
              v-model:page="searchState.page"
              :items-per-page="searchState.pagesize"
              :total="searchState.total"
              :sibling-count="2"
              :disabled="searchState.isSearching" />
          </div>
        </div>
      </template>

      <UCard
        v-else
        variant="subtle"
        class="rounded-xl">
        <div class="space-y-6 p-2 text-center sm:p-4">
          <div class="flex justify-center">
            <UIcon
              name="i-lucide-music-2"
              class="text-primary size-16 sm:size-20" />
          </div>
          <h3 class="font-FZHanZhenGuangBiao text-xl font-medium text-highlighted">纵 享 音 乐， 就 现 在 ~</h3>
          <div class="mx-auto max-w-2xl">
            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <UCard variant="outline">
                <h4 class="text-primary mb-3 text-lg font-medium">智能搜索</h4>
                <ul class="flex flex-col items-center space-y-2 text-sm text-muted">
                  <li class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-check"
                      class="text-primary size-4 shrink-0" />
                    <span>支持歌名、歌手精确搜索</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-check"
                      class="text-primary size-4 shrink-0" />
                    <span>支持歌词内容或关键字模糊匹配</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-check"
                      class="text-primary size-4 shrink-0" />
                    <span>支持拼音、首字母搜索</span>
                  </li>
                </ul>
              </UCard>
              <UCard variant="outline">
                <h4 class="text-primary mb-3 text-lg font-medium">海量资源</h4>
                <ul class="flex flex-col items-center space-y-2 text-sm text-muted">
                  <li class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-check"
                      class="text-primary size-4 shrink-0" />
                    <span>覆盖全网热门音乐</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-check"
                      class="text-primary size-4 shrink-0" />
                    <span>收录最新发行歌曲</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon
                      name="i-lucide-check"
                      class="text-primary size-4 shrink-0" />
                    <span>包含经典老歌曲目</span>
                  </li>
                </ul>
              </UCard>
            </div>
          </div>
          <div class="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            <UButton
              v-for="keyword in ['周杰伦 - 晴天', '林俊杰 - 江南', '邓紫棋 - 泡沫', '张碧晨']"
              :key="keyword"
              color="neutral"
              variant="soft"
              block
              class="justify-center text-muted"
              @click="handleMusicSearch(keyword)">
              {{ keyword }}
            </UButton>
          </div>
          <div class="mt-8 space-y-2 text-center text-muted">
            <p>搜索示例：</p>
            <ul class="space-y-2 text-sm">
              <li><span class="text-primary"> • </span> 歌手名：周杰伦、林俊杰</li>
              <li><span class="text-primary"> • </span> 歌曲名：晴天、江南</li>
              <li><span class="text-primary"> • </span> 歌词片段：我落泪情绪零碎、小酒窝长睫毛</li>
              <li><span class="text-primary"> • </span> 拼音搜索：zhoujielun、qingtian</li>
            </ul>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
