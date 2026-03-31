<script lang="ts" setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const nuxtApp = useNuxtApp()

// 注册 ElementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  nuxtApp.vueApp.component(key, component)
}

useHead({
  title: ':title | 秘术云阁',
  meta: [
    {
      name: 'keywords',
      content: '极客兔官网,专为极客而生',
    },
    {
      name: 'keywords',
      content: '秘术云阁,致力于打造全球华人精神自由网络家园',
    },
    {
      name: 'keywords',
      content: '看人,识人,阴阳,纵横捭阖,底层运转,财商之道,财富自由,深谙人性,世界真相,绝版资源',
    },
  ],
})
</script>

<template>
  <UApp>
    <JKHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <JKFooter />
  </UApp>
</template>
