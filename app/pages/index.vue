<script setup lang="ts">
useHead({
  title: '首页',
})
</script>

<template>
  <el-scrollbar height="800px">
    <div class="panel">
      <HotPost />

      <RareResources />
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.panel {
  // @apply h-125 overflow-scroll text-center scroll-auto overflow-y-scroll;
  @apply min-h-80;
}
</style>
