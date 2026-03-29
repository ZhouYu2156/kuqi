<script setup lang="ts">
const goHome = () => {
  navigateTo('/')
}
</script>

<template>
  <!-- 外层容器：全屏+水平垂直双居中 -->
  <div class="w-full min-h-screen h-screen flex justify-center items-center bg-old-bg font-song p-4">
    <!-- 内容卡片：优化宽度、阴影、圆角 -->
    <div class="w-170 bg-white border border-old-border rounded-md shadow-sm p-12 text-center relative">
      <!-- 复古装饰线 -->
      <div class="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-old-primary/80 to-old-primary/20"></div>

      <!-- 404 主视觉 -->
      <div class="flex justify-center items-center mb-8">
        <span class="text-[120px] font-bold text-old-primary/90 leading-none">4</span>
        <span class="text-[80px] text-amber-500 mx-2">⚠️</span>
        <span class="text-[120px] font-bold text-old-primary/90 leading-none">4</span>
      </div>

      <!-- 标题 -->
      <h1 class="text-[24px] text-old-primary font-bold mb-4">页面走丢了</h1>

      <!-- 说明文字 -->
      <p class="text-old-muted mb-10 leading-relaxed text-sm">
        你访问的页面不存在或已被删除<br />
        可能是地址输入错误，也可能是内容已下架
      </p>

      <!-- 返回首页按钮：优化样式 -->
      <div class="my-10 py-10">
        <el-button
          type="primary"
          size="large"
          @click="goHome"
          class="px-8 py-2 bg-old-primary border-old-primary hover:bg-old-primary/90">
          回到首页
        </el-button>
      </div>

      <!-- 底部说明：优化排版 -->
      <div class="text-old-muted text-sm border-t border-old-border/30 pt-4">
        秘术云阁 · 专注世界底层运行研究 | 绝版资源
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 强制按钮使用宋体，贴合复古风格 */
:deep(.el-button) {
  font-family: SimSun, '宋体', serif;
  border-radius: 2px; /* 复古小圆角 */
}

/* 优化输入框默认样式（如果后续扩展需要） */
:deep(.el-input__wrapper) {
  border: 1px solid var(--color-old-border);
  background: white;
}
</style>
