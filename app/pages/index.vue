<script setup lang="ts">
import type { PageHeroProps, PageSectionProps } from '@nuxt/ui'
import { SEO_PAGE_DESCRIPTION } from '~~/shared/constants/seo'

usePageSeo({
  title: '首页',
  isHome: true,
  description: SEO_PAGE_DESCRIPTION.home,
})

const stack = [
  {
    name: 'Vue 3',
    icon: 'i-vscode-icons-file-type-vue',
    desc: '组合式 API、响应式模型与庞大生态，交付快、可维护性强。',
  },
  {
    name: 'TypeScript',
    icon: 'i-vscode-icons-file-type-typescript-official',
    desc: '静态类型约束，减少线上低级错误，重构与协作更安心。',
  },
  {
    name: 'Nuxt',
    icon: 'i-vscode-icons-file-type-nuxt',
    desc: '文件路由、SSR/SSG、服务端能力开箱即用，全栈一体。',
  },
  {
    name: 'Sass',
    icon: 'i-vscode-icons-file-type-sass',
    desc: '变量、嵌套与 mixin，复杂样式模块化，易与设计对齐。',
  },
  {
    name: 'TailwindCSS',
    icon: 'i-vscode-icons-file-type-tailwind',
    desc: '原子化工具类，界面迭代快、包体可控，与设计系统契合。',
  },
  {
    name: 'Nuxt UI',
    icon: 'i-simple-icons:nuxtdotjs',
    desc: '与 Nuxt 深度集成，主题与无障碍友好，界面一致性好。',
  },
] as const

const heroImage = 'https://picsum.photos/seed/geektux/960/720'

const heroLinks = [
  {
    label: '即刻听',
    to: '/music',
    size: 'xl' as const,
    class:
      'min-h-14 min-w-40 px-8 text-base font-semibold bg-emerald-600 text-white hover:bg-emerald-700 sm:min-h-16 sm:text-lg dark:bg-emerald-500 dark:hover:bg-emerald-400',
  },
]

const heroUi: PageHeroProps['ui'] = {
  headline: 'mb-3 text-sm font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400',
  title: 'text-5xl font-bold tracking-tight text-highlighted sm:text-6xl md:text-7xl lg:text-8xl',
  description: 'mt-4 text-xl text-muted sm:text-2xl',
  links: 'mt-8 gap-4 sm:mt-10',
  /** 收紧默认过大的上下留白（主题默认 py-24+） */
  container:
    'flex flex-col gap-8 py-8 sm:gap-y-10 sm:py-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-10 lg:gap-y-0 lg:py-24',
}

const sectionUi: PageSectionProps['ui'] = {
  body: 'mt-10 sm:mt-12',
}
</script>

<template>
  <UPageHero
    orientation="horizontal"
    headline="SOFTWARE DEVELOPMENT STUDIO"
    title="极客兔"
    description="一家只做优质服务的软件开发工作室"
    :links="heroLinks"
    :ui="heroUi">
    <template #default>
      <img
        :src="heroImage"
        alt=""
        class="mx-auto w-full max-w-lg rounded-2xl border border-neutral-200/80 shadow-xl ring-1 ring-black/5 lg:mx-0 lg:ml-auto dark:border-white/10 dark:ring-white/10"
        loading="eager"
        fetchpriority="high" />
    </template>
  </UPageHero>

  <UPageSection
    title="技术栈"
    description="当前项目采用最新的主流框架和技术栈开发。"
    orientation="vertical"
    class="border-t border-neutral-200 bg-neutral-50/50 dark:border-white/10 dark:bg-neutral-900/30"
    :ui="sectionUi">
    <template #body>
      <UPageGrid class="gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <UPageCard
          v-for="item in stack"
          :key="item.name"
          variant="outline"
          class="h-full"
          spotlight
          spotlight-color="primary">
          <div class="flex gap-3">
            <UIcon
              :name="item.icon"
              class="text-primary size-9 shrink-0" />
            <div class="min-w-0">
              <p class="font-semibold text-highlighted">
                {{ item.name }}
              </p>
              <p class="text-muted mt-1 text-sm leading-relaxed">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </UPageCard>
      </UPageGrid>
    </template>
  </UPageSection>
</template>
