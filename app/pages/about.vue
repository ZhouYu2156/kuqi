<script setup lang="ts">
useHead({
  title: '关于',
})
</script>

<template>
  <div class="site-container py-12 sm:py-16 lg:py-20">
    <UPageHeader
      title="关于秘术云阁"
      description="个人品牌站点：用工程化与长期主义，探索一人公司如何起步与发展。" />

    <div class="mt-10 max-w-3xl space-y-8 text-muted leading-relaxed">
      <section>
        <h3 class="font-display text-lg font-semibold text-highlighted">为何是现在</h3>
        <p class="mt-3">
          技术迭代与协作方式在变化，个人以「一人公司」或最小单元对外交付价值，会越来越常见。我希望把自己在全栈开发、产品落地与创业实践中的经验，变成可复用的服务与内容，与同行者一起把路走实。
        </p>
      </section>
      <section>
        <h3 class="font-display text-lg font-semibold text-highlighted">我提供什么</h3>
        <p class="mt-3">
          主线是<strong class="text-default">一人公司产品化</strong>（从需求到上线与运维的交付能力）与<strong class="text-default">创业陪跑</strong>（按次或按月的咨询与节奏对齐）。具体边界以页面说明与双方沟通为准；主站仅展示合规、可公开的服务描述。
        </p>
      </section>
      <section>
        <h3 class="font-display text-lg font-semibold text-highlighted">合作原则</h3>
        <ul class="mt-3 list-disc space-y-2 pl-6">
          <li>诚实对齐预期：不承诺超出能力或合规范围的「结果」。</li>
          <li>尊重时间与专注：咨询与陪跑以约定形式交付。</li>
          <li>持续输出：通过博客与公众号分享方法论与实践记录。</li>
        </ul>
      </section>
      <p class="pt-2 text-default">
        <NuxtLink
          to="/contact"
          class="text-primary font-medium underline-offset-2 hover:underline">联系合作</NuxtLink>
        <span class="mx-2 text-muted">·</span>
        <NuxtLink
          to="/blog"
          class="text-primary font-medium underline-offset-2 hover:underline">阅读博客</NuxtLink>
      </p>
    </div>
  </div>
</template>
