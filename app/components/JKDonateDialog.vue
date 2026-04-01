<script setup lang="ts">
const { value: theme } = useColorMode()
const isDark = computed(() => theme === 'dark')

const isShowDialog = ref(false)
</script>

<template>
  <UModal
    v-model:open="isShowDialog"
    title="支持与鼓励"
    class="sm:max-w-md">
    <template #body>
      <div class="space-y-4 text-center">
        <div class="space-y-3">
          <p class="text-sm font-bold text-primary sm:text-base">亲爱的音乐爱好者：</p>
          <p class="text-xs leading-relaxed sm:text-[0.875rem]">
            感谢您使用我们的音乐服务！<br />为了给大家提供更好的体验，我们投入了大量时间和资源：
          </p>
          <ul class="donation text-left text-xs sm:text-sm sm:px-8 md:px-6 lg:px-4">
            <li>每日更新token，确保服务稳定</li>
            <li>维护服务器，保障访问速度</li>
            <li>持续优化功能，提升使用体验</li>
          </ul>
          <p class="mt-3 text-xs leading-relaxed md:text-sm">
            如果您觉得这些努力为您带来了价值，请考虑赞赏支持。<br />您的每一份鼓励，都是我们坚持的动力！
          </p>
        </div>
        <div class="mx-auto">
          <img
            :src="isDark ? 'AppreciationCode-dark.jpg' : 'AppreciationCode-light.jpg'"
            alt="赞赏码"
            class="mx-auto h-48 w-48 rounded-lg object-cover shadow-md sm:h-64 sm:w-64" />
        </div>
        <p class="text-sm font-bold">扫描上方二维码，支持一下开发者</p>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
@reference '~/assets/css/main.css';

.donation {
  @apply mx-12 text-left sm:mx-16;

  li {
    &::before {
      content: '·';
      @apply pe-2 align-middle text-2xl text-green-500;
    }
  }
}
</style>
