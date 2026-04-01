<script setup lang="ts">
useHead({
  title: '服务与定价',
})
</script>

<template>
  <div class="site-container py-12 sm:py-16 lg:py-20">
    <UPageHeader
      title="服务与定价"
      description="公开价与交付范围如下；定制请询价。" />

    <div class="mt-12 space-y-14">
      <section>
        <h2 class="font-display text-xl font-semibold text-highlighted sm:text-2xl">创业陪跑</h2>
        <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
          轻量咨询与节奏跟进；不替代法务财税。具体以沟通为准。
        </p>
        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <UCard
            :ui="{
              root: 'border-0 shadow-xl shadow-black/4 ring-0 dark:shadow-black/35',
              body: 'p-6 sm:p-8',
            }">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-medium text-muted">按次咨询</p>
                <p class="mt-1 font-display text-4xl font-semibold text-primary">¥199</p>
                <p class="mt-2 text-sm text-muted">单次会话，摊开问题、拿到行动清单。</p>
              </div>
              <UBadge color="primary">入门</UBadge>
            </div>
            <ul class="mt-6 space-y-2 text-sm text-muted">
              <li class="flex gap-2"><span class="text-primary">✓</span> 方向与优先级</li>
              <li class="flex gap-2"><span class="text-primary">✓</span> 变现与风险点</li>
              <li class="flex gap-2"><span class="text-primary">✓</span> 会后纪要（依约定）</li>
            </ul>
            <div class="mt-6">
              <NuxtLink
                to="/contact"
                class="btn-gold-solid w-full justify-center">
                预约咨询
              </NuxtLink>
            </div>
          </UCard>

          <UCard
            :ui="{
              root: 'border-0 shadow-xl shadow-black/4 ring-0 dark:shadow-black/35',
              body: 'p-6 sm:p-8',
            }">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-medium text-muted">按月陪跑</p>
                <p class="mt-1 font-display text-4xl font-semibold text-primary">¥599</p>
                <p class="mt-2 text-sm text-muted">已在跑的项目，要节奏与外部反馈。</p>
              </div>
              <UBadge color="neutral">进阶</UBadge>
            </div>
            <ul class="mt-6 space-y-2 text-sm text-muted">
              <li class="flex gap-2"><span class="text-primary">✓</span> 约定频次的答疑与复盘</li>
              <li class="flex gap-2"><span class="text-primary">✓</span> 目标拆解与对齐</li>
              <li class="flex gap-2"><span class="text-primary">✓</span> 交付边界以沟通为准</li>
            </ul>
            <div class="mt-6">
              <UButton
                to="/contact"
                block
                color="neutral"
                variant="soft">
                了解陪跑
              </UButton>
            </div>
          </UCard>
        </div>
        <UAlert
          class="mt-8 border-0 bg-stone-200/50 dark:bg-zinc-900/80"
          color="neutral"
          variant="subtle"
          title="可能不适合"
          description="要「保证收入」、代运营全权托管、或即时随时响应的，请先对齐预期。" />
      </section>

      <div class="site-gold-line opacity-50" />

      <section>
        <h2 class="font-display text-xl font-semibold text-highlighted sm:text-2xl">一人公司产品化（全栈交付）</h2>
        <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
          网站、小程序、自动化与部署，按需求估价与排期。
        </p>
        <UPageGrid class="mt-8 gap-6 lg:grid-cols-3">
          <UPageCard
            title="品牌站 / 落地页"
            description="Nuxt 全栈、SEO、明暗主题。"
            icon="i-lucide-layout-template"
            :ui="{
              root: 'border-0 bg-stone-100/80 shadow-lg shadow-black/4 ring-0 dark:bg-zinc-900/50 dark:shadow-black/30',
            }" />
          <UPageCard
            title="小程序"
            description="闭环清晰的小应用；上架与主体另议。"
            icon="i-lucide-smartphone"
            :ui="{
              root: 'border-0 bg-stone-100/80 shadow-lg shadow-black/4 ring-0 dark:bg-zinc-900/50 dark:shadow-black/30',
            }" />
          <UPageCard
            title="自动化 / 集成"
            description="脚本、Webhook、API 对接与可运维交付。"
            icon="i-lucide-workflow"
            :ui="{
              root: 'border-0 bg-stone-100/80 shadow-lg shadow-black/4 ring-0 dark:bg-zinc-900/50 dark:shadow-black/30',
            }" />
        </UPageGrid>
        <p class="mt-8 text-sm text-muted">
          询价请
          <NuxtLink
            to="/contact"
            class="font-medium text-primary underline-offset-2 hover:underline">联系页</NuxtLink>
          说明预算与周期。
        </p>
      </section>
    </div>
  </div>
</template>
