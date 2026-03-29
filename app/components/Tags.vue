<script setup lang="ts"></script>

<template>
  <div class="title-tags">
    <ClientOnly>
      <el-badge
        :value="'禁术'"
        type="danger">
        <h1 class="text-2xl font-bold text-old-primary tracking-[2px]">
          <el-tooltip
            effect="dark"
            placement="right"
            content="身处规则体系中，别人绝对不会告诉你的内幕">
            秘术云阁
          </el-tooltip>
        </h1>
      </el-badge>
    </ClientOnly>

    <p class="text-old-muted mt-1 text-sm">底层逻辑｜规则内幕｜认知破局｜绝版资源</p>
  </div>
</template>

<style scoped>
@reference '~/assets/css/main.css';

.title-tags {
  @apply text-center py-4 bg-[#f0f7f0] border-b border-old-border;
}
</style>
