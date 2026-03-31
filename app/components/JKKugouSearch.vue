<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import {
  ResponseCode,
  type MusicDetailItem,
  type MusicItem,
  type MusicSearchResponse,
  type UnionResponse,
} from '~~/shared/types'

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

// 根据输入和存储的搜索关键字，判断是否要重置页码从 1 开始搜索
const searchKeyword = ref('')

// 每页数量选项
const pageSizeOptions = [10, 15, 20, 30]

// 处理音乐搜索
const handleMusicSearch = async (kw?: string) => {
  if (!kw && !searchKeyword.value.trim()) {
    ElMessage.info('请输入关键词搜索🔍')
    return
  }

  // 当搜索关键字变化时，重置页码
  if (searchState.value.kw !== searchKeyword.value || searchState.value.kw !== searchKeyword.value) {
    searchState.value.page = 1
    searchState.value.kw !== searchKeyword.value
  }

  searchState.value.isSearching = true
  searchState.value.kw = kw ? kw : searchKeyword.value

  const response = await $fetch<MusicSearchResponse>('/api/music/', {
    method: 'GET',
    params: {
      keyword: searchState.value.kw,
      page: searchState.value.page,
      pagesize: searchState.value.pagesize,
    },
  })

  if (response.code === ResponseCode.Success) {
    searchState.value = {
      ...searchState.value,
      page: response.data.page,
      pagesize: response.data.pagesize,
      total: response.data.total,
      searchResults: response.data.lists,
    }
    ElMessage.success(response.message)
  }
  searchState.value.isSearching = false
}

// page、pagesize参数变化时触发
watch([() => searchState.value.page, () => searchState.value.pagesize], ([newPage, newPagSize]) => {
  // 当 pagsesize 或 page 变化时，重新搜索
  handleMusicSearch()
})

/* ---------------------- 播放器控制器 ---------------------- */
console.log(capitalizeLetter('Hello world'))
// 单例模式
function getSingleInstance() {
  const instance = new Audio()

  return instance
}

class MusicPlayController {
  isPlaying: boolean = false
  currentMusic: MusicDetailItem | null = null

  constructor() {
    this.isPlaying = false
    this.currentMusic = null
  }

  playMusic = async (music: MusicItem) => {
    // 1. 获取音乐详情 -> 有播放链接等数据
    const response = await $fetch<UnionResponse<MusicDetailItem>>('/api/music/', {
      method: 'POST',
      params: {
        audioId: music.EMixSongID,
      },
    })
    // 2. 设置当前播放音乐
    if (response.code === 200) {
      this.currentMusic = response.data
      this.isPlaying = true
    }

    // 3. 创建播放器并开始播放音乐
    console.log(this.currentMusic?.play_url)
    const player = new Audio(this.currentMusic?.play_url)
    player.play()
  }
  pauseMusic = () => {}
  downloadMusic = (music: MusicItem) => {}
}

const playController = new MusicPlayController()
</script>

<template>
  <!-- 酷狗音乐搜索区域 -->
  <div class="mb-12">
    <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6 font-ZKKuaiLeTi">即 刻 听</h2>
    <p class="text-center text-gray-500 dark:text-gray-400 mb-6 font-ZKKuaiLeTi">海量音乐，一键搜索</p>

    <div class="flex justify-center mb-12">
      <div class="w-150 relative flex">
        <!-- 搜索输入框容器 -->
        <div class="flex-1">
          <div
            class="flex items-center bg-white dark:bg-gray-800 rounded-l-lg border-2 border-r-0 border-gray-300 dark:border-gray-600 focus-within:border-primary-500 dark:focus-within:border-primary-500 transition-colors duration-300 h-11">
            <!-- 搜索图标 -->
            <div class="pl-4 text-gray-400">
              <el-icon>
                <Search />
              </el-icon>
            </div>
            <!-- 输入框 -->
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索歌名、歌手、歌词..."
              class="flex-1 px-3 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              @keyup.enter="() => handleMusicSearch()" />
          </div>
        </div>
        <!-- 搜索按钮 -->
        <button
          class="h-11 px-8 bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed rounded-r-lg flex items-center justify-center min-w-25"
          :disabled="searchState.isSearching"
          @click="() => handleMusicSearch()">
          <template v-if="searchState.isSearching">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </template>
          <span v-else>搜索</span>
        </button>
      </div>
    </div>

    <!-- 搜索结果表格或占位内容 -->
    <div class="px-2 sm:px-6 md:px-12">
      <template v-if="searchState.searchResults.length > 0">
        <JKMusicTable
          :lists="searchState.searchResults"
          :loading="searchState.isSearching"
          :current-music="playController.currentMusic"
          :is-playing="playController.isPlaying"
          @play="playController.playMusic"
          @pause="playController.pauseMusic"
          @download="playController.downloadMusic" />

        <div class="flex justify-end mt-8 items-center gap-2">
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
      </template>
      <!-- 搜索占位内容 -->
      <div
        v-else
        class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
        <div class="text-center space-y-6">
          <!-- 搜索建议图标 -->
          <div class="flex justify-center">
            <el-icon class="text-primary-500 text-6xl">
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
                <h4 class="text-lg font-medium text-emerald-500 mb-3">智能搜索</h4>
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
                <h4 class="text-lg font-medium text-emerald-500 mb-3">海量资源</h4>
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
              <li><span class="text-primary"> • </span> 歌手名：周杰伦、林俊杰</li>
              <li><span class="text-primary"> • </span> 歌曲名：晴天、江南</li>
              <li><span class="text-primary"> • </span> 歌词片段：我落泪情绪零碎、小酒窝长睫毛</li>
              <li><span class="text-primary"> • </span> 拼音搜索：zhoujielun、qingtian</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
