<script lang="ts" setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const nuxtApp = useNuxtApp()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  nuxtApp.vueApp.component(key, component)
}

useHead({
  titleTemplate: '%s · 秘术云阁',
  meta: [
    {
      name: 'keywords',
      content: '秘术云阁,一人公司,创业陪跑,全栈开发,个人品牌',
    },
    {
      name: 'description',
      content:
        '一人公司产品化与创业陪跑：全栈交付、轻量咨询与月度陪跑，面向中国大陆个人创作者与独立开发者。',
    },
  ],
})
</script>

<template>
  <UApp>
    <SiteHeader />

    <UMain class="min-h-[calc(100vh-8rem)]">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <SiteFooter />
  </UApp>
</template>
