<template>
  <!-- 外层全屏容器，强制居中 -->
  <div class="w-full min-h-screen bg-old-bg flex justify-center">
    <!-- 内容容器：固定宽度 + 自动居中 -->
    <div class="w-225 min-h-screen bg-white border border-old-border">
      <Slogan />
      <Nav />
      <main class="p-3">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '秘术云阁 - 认知破局 | 底层翻身 | 绝版资源',
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
})
</script>
