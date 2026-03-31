<script setup lang="ts">
useHead({
  title: '主页',
})
</script>

<template>
  <UPage
    :ui="{
      root: 'px-8 sm:px-12 md:px-24 lg:px-32 pb-24',
    }">
    <!-- 页面主题 -->
    <JKPageHero />
    <!-- 特性卡片 -->
    <JKFeatures />
  </UPage>
</template>
