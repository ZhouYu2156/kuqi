<script setup lang="ts">
const { value: theme } = useColorMode()
const isDark = computed(() => theme === 'dark')

const isShowDialog = ref(false)
</script>

<template>
  <el-dialog
    align-center
    v-model="isShowDialog"
    title="支持与鼓励"
    :width="400"
    class="text-white">
    <div class="text-center space-y-4">
      <div class="space-y-3 mb-4">
        <p class="leading-relaxed text-sm sm:text-base text-primary-500 font-bold">亲爱的音乐爱好者：</p>
        <p class="leading-relaxed text-xs sm:text-[0.875rem]">
          感谢您使用我们的音乐服务！<br />为了给大家提供更好的体验，我们投入了大量时间和资源：
        </p>
        <ul class="donation">
          <li>每日更新token，确保服务稳定</li>
          <li>维护服务器，保障访问速度</li>
          <li>持续优化功能，提升使用体验</li>
        </ul>
        <p class="leading-relaxed mt-3 text-xs md:text-sm">
          如果您觉得这些努力为您带来了价值，请考虑赞赏支持。<br />您的每一份鼓励，都是我们坚持的动力！
        </p>
      </div>
      <div class="donation-qr-wrapper mx-auto">
        <img
          :src="isDark ? 'AppreciationCode-dark.jpg' : 'AppreciationCode-light.jpg'"
          alt="赞赏码"
          class="w-48 h-48 sm:w-64 sm:h-64 object-cover mx-auto rounded-lg shadow-md" />
      </div>
      <p class="text-sm font-bold mt-3">扫描上方二维码，支持一下开发者</p>
    </div>
  </el-dialog>
</template>

<style scoped>
@reference '~/assets/css/main.css';

.donation {
  @apply text-left text-xs sm:text-sm mx-20 sm:mx-16;

  li {
    &::before {
      content: '·';
      @apply text-green-500 text-2xl align-middle pe-2;
    }
  }
}
</style>
