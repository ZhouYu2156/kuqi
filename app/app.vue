<script lang="ts" setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const nuxtApp = useNuxtApp()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  nuxtApp.vueApp.component(key, component)
}

useHead({
  titleTemplate: '%s · JK 知识站',
  meta: [
    {
      name: 'keywords',
      content: '知识付费,音乐,视频教程,博主',
    },
    {
      name: 'description',
      content: '集成音乐与个人视频教程的知识付费方向站点：统一鉴权、会员与内容扩展。',
    },
  ],
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
