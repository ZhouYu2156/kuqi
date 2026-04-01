<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ResponseCode,
  type MusicDetailItem,
  type MusicItem,
  type MusicSearchResponse,
  type UnionResponse,
} from '~~/shared/types'
import type { MusicQuotaData } from '~~/shared/types/auth'

/* ---------------------- 音乐搜索状态 ---------------------- */
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

/** 上一次实际发起请求时的关键词（用于区分「换关键词」与「仅翻页/改每页条数」） */
const lastFetchedKeyword = ref('')

// 每页数量选项
const pageSizeOptions = [10, 15, 20, 30]

/**
 * 音乐搜索：关键词只存于 `searchState.kw`（与输入框 v-model 同源）。
 * @param overrideKeyword 若传入（如点击示例），会先写入状态再搜索。
 */
async function handleMusicSearch(overrideKeyword?: string) {
  if (overrideKeyword !== undefined) {
    searchState.value.kw = overrideKeyword
  }

  const q = searchState.value.kw.trim()
  if (!q) {
    ElMessage.info('请输入关键词搜索🔍')
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
    ElMessage.success(response.message)
  }
  searchState.value.isSearching = false
}

// 翻页、改每页条数时沿用当前关键词（无关键词时不请求，避免无意义提示）
watch([() => searchState.value.page, () => searchState.value.pagesize], () => {
  if (!searchState.value.kw.trim()) return
  handleMusicSearch()
})

/* ---------------------- 今日试听额度（登录用户） ---------------------- */
const quota = ref<MusicQuotaData | null>(null)

async function refreshQuota() {
  try {
    const res = await $fetch<UnionResponse<MusicQuotaData>>('/api/user/music-quota', {
      credentials: 'include',
    })
    if (res.code === ResponseCode.Success && res.data) {
      quota.value = res.data
    } else {
      quota.value = null
    }
  } catch {
    quota.value = null
  }
}

onMounted(() => {
  refreshQuota()
})

/* ---------------------- 播放器控制器（试听需登录 + 每日额度） ---------------------- */
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
        ElMessage.warning(response.message || '请先登录后再试听')
        await navigateTo('/login')
        return
      }

      if (response.code === ResponseCode.Forbidden) {
        try {
          await ElMessageBox.confirm(
            response.message || '今日免费试听额度已用完，可开通会员后继续畅听与下载。',
            '试听额度',
            {
              confirmButtonText: '了解会员',
              cancelButtonText: '取消',
              type: 'warning',
            },
          )
          await navigateTo('/membership')
        } catch {
          /* 用户点取消 */
        }
        return
      }

      if (response.code !== ResponseCode.Success || !response.data?.play_url) {
        ElMessage.error(response.message || '无法获取播放地址')
        return
      }

      this.currentMusic = response.data
      this.isPlaying = true
      const player = new Audio(response.data.play_url)
      await player.play()
      await refreshQuota()
    } catch (e) {
      console.error(e)
      ElMessage.error('播放请求失败')
    }
  }
  pauseMusic = () => {}
  downloadMusic = (_music: MusicItem) => {}
}

const playController = new MusicPlayController()
</script>

<template>
  <!-- 酷狗音乐搜索区域 -->
  <div class="mb-12">
    <h2 class="jk-heading mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">即 刻 听</h2>
    <p class="mb-4 text-center text-gray-500 dark:text-gray-400">
      海量音乐，一键搜索（试听需登录；非会员每日 {{ quota?.dailyFreeLimit ?? 10 }} 首免费）
    </p>
    <p
      v-if="quota"
      class="mb-6 text-center text-sm text-(--jk-primary)">
      <template v-if="quota.unlimited">当前账号：<span class="font-medium">会员畅听</span>（不限次）</template>
      <template v-else
        >今日剩余免费试听：<span class="font-semibold tabular-nums">{{ quota.remainingFree ?? 0 }}</span> 首</template
      >
    </p>

    <div class="mx-auto w-full max-w-5xl px-3 sm:px-5">
      <div class="relative mb-12 flex w-full">
        <!-- 搜索输入框容器 -->
        <div class="flex-1">
          <div
            class="flex h-11 items-center rounded-l-lg border-2 border-r-0 border-zinc-300 bg-white transition-colors duration-300 focus-within:border-(--jk-primary) focus-within:ring-2 focus-within:ring-(--jk-ring) dark:border-white/20 dark:bg-(--jk-bg-dark-elevated) dark:focus-within:border-(--jk-primary)">
            <!-- 搜索图标 -->
            <div class="pl-4 text-(--jk-primary) opacity-70">
              <el-icon>
                <Search />
              </el-icon>
            </div>
            <!-- 输入框 -->
            <input
              v-model="searchState.kw"
              type="text"
              placeholder="搜索歌名、歌手、歌词..."
              class="flex-1 px-3 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              @keyup.enter="() => handleMusicSearch()" />
          </div>
        </div>
        <!-- 搜索按钮 -->
        <button
          type="button"
          class="flex h-11 min-w-25 items-center justify-center rounded-r-lg px-8 font-medium text-white transition-[filter,opacity] duration-300 hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-75"
          :style="{ background: 'var(--jk-primary)' }"
          :disabled="searchState.isSearching"
          @click="() => handleMusicSearch()">
          <template v-if="searchState.isSearching">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </template>
          <span v-else>搜索</span>
        </button>
      </div>
      <template v-if="searchState.searchResults.length > 0">
        <div class="jk-music-el w-full">
          <JKMusicTable
            :lists="searchState.searchResults"
            :loading="searchState.isSearching"
            :current-music="playController.currentMusic"
            :is-playing="playController.isPlaying"
            @play="playController.playMusic"
            @pause="playController.pauseMusic"
            @download="playController.downloadMusic" />

          <div class="mt-8 flex items-center justify-end gap-2">
            <el-select
              v-model="searchState.pagesize"
              class="w-22.5!"
              :size="'default'">
              <el-option
                v-for="size in pageSizeOptions"
                :key="size"
                :label="`${size}条/页`"
                :value="size" />
            </el-select>
            <el-pagination
              v-model:current-page="searchState.page"
              :page-size="searchState.pagesize"
              :total="searchState.total"
              :pager-count="5"
              :background="true"
              layout="prev, pager, next" />
          </div>
        </div>
      </template>
      <!-- 搜索占位内容 -->
      <div
        v-else
        class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
        <div class="text-center space-y-6">
          <!-- 搜索建议图标 -->
          <div class="flex justify-center">
            <el-icon class="text-6xl text-(--jk-primary)">
              <Search />
            </el-icon>
          </div>
          <!-- 搜索建议标题 -->
          <h3 class="text-xl font-medium text-gray-800 dark:text-gray-200 font-FZHanZhenGuangBiao">
            纵 享 音 乐， 就 现 在 ~
          </h3>
          <!-- 搜索特点介绍 -->
          <div class="max-w-2xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h4 class="mb-3 text-lg font-medium text-(--jk-primary)">智能搜索</h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300 flex flex-col items-center">
                  <li class="flex items-center gap-2">
                    <el-icon>
                      <Check />
                    </el-icon>
                    <span>支持歌名、歌手精确搜索</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <el-icon>
                      <Check />
                    </el-icon>
                    <span>支持歌词内容或关键字模糊匹配</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <el-icon>
                      <Check />
                    </el-icon>
                    <span>支持拼音、首字母搜索</span>
                  </li>
                </ul>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h4 class="mb-3 text-lg font-medium text-(--jk-primary)">海量资源</h4>
                <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300 flex flex-col items-center">
                  <li class="flex items-center gap-2">
                    <el-icon>
                      <Check />
                    </el-icon>
                    <span>覆盖全网热门音乐</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <el-icon>
                      <Check />
                    </el-icon>
                    <span>收录最新发行歌曲</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <el-icon>
                      <Check />
                    </el-icon>
                    <span>包含经典老歌曲目</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 搜索建议列表 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div
              v-for="keyword in ['周杰伦 - 晴天', '林俊杰 - 江南', '邓紫棋 - 泡沫', '张碧晨']"
              :key="keyword"
              class="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              @click="handleMusicSearch(keyword)">
              <p class="text-gray-600 dark:text-gray-300">{{ keyword }}</p>
            </div>
          </div>
          <!-- 使用提示 -->
          <div class="text-gray-600 dark:text-gray-200 space-y-2 mt-8">
            <p>搜索示例：</p>
            <ul class="space-y-2 text-sm">
              <li><span class="text-(--jk-primary)"> • </span> 歌手名：周杰伦、林俊杰</li>
              <li><span class="text-(--jk-primary)"> • </span> 歌曲名：晴天、江南</li>
              <li><span class="text-(--jk-primary)"> • </span> 歌词片段：我落泪情绪零碎、小酒窝长睫毛</li>
              <li><span class="text-(--jk-primary)"> • </span> 拼音搜索：zhoujielun、qingtian</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 音乐列表：分页、每页条数、表格内主按钮与站点主题色一致 */
.jk-music-el {
  --el-color-primary: var(--jk-primary);
}

.jk-music-el :deep(.el-button--primary) {
  --el-button-bg-color: var(--jk-primary);
  --el-button-border-color: var(--jk-primary);
  --el-button-hover-bg-color: color-mix(in srgb, var(--jk-primary) 88%, #000);
  --el-button-hover-border-color: color-mix(in srgb, var(--jk-primary) 88%, #000);
  --el-button-active-bg-color: color-mix(in srgb, var(--jk-primary) 78%, #000);
  --el-button-active-border-color: color-mix(in srgb, var(--jk-primary) 78%, #000);
}

.jk-music-el :deep(.el-pagination.is-background .btn-prev),
.jk-music-el :deep(.el-pagination.is-background .btn-next),
.jk-music-el :deep(.el-pagination.is-background .el-pager li) {
  background-color: color-mix(in srgb, var(--jk-primary) 16%, transparent);
}

.jk-music-el :deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: var(--jk-primary) !important;
  color: #fff !important;
}

.jk-music-el :deep(.el-pagination.is-background .btn-prev:hover:not([disabled])),
.jk-music-el :deep(.el-pagination.is-background .btn-next:hover:not([disabled])),
.jk-music-el :deep(.el-pagination.is-background .el-pager li:hover:not(.is-active)) {
  background-color: color-mix(in srgb, var(--jk-primary) 28%, transparent);
}

.jk-music-el :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--jk-primary) inset;
}
</style>
