<script setup lang="ts">
useHead({
  title: '首页',
})

interface BlogHomePreview {
  path: string
  title: string
  description?: string
  date?: string
  category?: string
}

const { data: blogPosts } = await useAsyncData('home-blog-preview', async () => {
  const list = await queryCollection('blog').all()
  const mapped: BlogHomePreview[] = list.map((p) => {
    const raw = p as unknown as Record<string, unknown>
    return {
      path: p.path,
      title: String(p.title ?? ''),
      description: p.description ? String(p.description) : undefined,
      date: raw.date != null ? String(raw.date) : undefined,
      category: raw.category != null ? String(raw.category) : undefined,
    }
  })
  return mapped.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3)
})

const coreServices = [
  {
    icon: 'i-lucide-layers',
    name: '产品开发',
    desc: '网站、小程序、自动化工具的全栈独立开发，从需求对齐到上线运维，一站式可验收交付。',
    tag: '前端 · 后端 · 运维',
  },
  {
    icon: 'i-lucide-workflow',
    name: '自动化与集成',
    desc: '脚本、Webhook、第三方对接与部署运维，把重复劳动交给系统，把时间留给业务。',
    tag: '提效 · 可运维',
  },
  {
    icon: 'i-lucide-message-circle',
    name: '创业咨询',
    desc: '一人公司路径、变现与节奏、个人品牌呈现；按次或按月陪跑，对齐目标与执行。',
    tag: '1V1 · 陪跑',
  },
]

function postCategoryLabel(post: BlogHomePreview, i: number) {
  return post.category || (i === 0 ? '创业认知' : '技术实战')
}
</script>

<template>
  <div>
    <UPageHero
      :ui="{
        container: 'site-container py-16 sm:py-20 lg:py-28',
      }"
      orientation="horizontal">
      <template #headline>
        <span class="font-mono-site text-[11px] tracking-[0.18em] text-primary">
          // 全栈开发者 · 独立创业者 · 数字游民
        </span>
      </template>

      <template #title>
        <span class="font-display text-[2rem] leading-[1.12] tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
          一人公司产品化<br class="hidden sm:inline" />
          <span class="text-primary">与创业陪跑</span>
        </span>
      </template>

      <template #description>
        <p class="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          前端、后端、运维一人闭环：用代码与产品化交付，为他人提供可定价的服务，构建属于自己的数字业务。
        </p>
      </template>

      <template #links>
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <NuxtLink
            to="/services"
            class="btn-gold-solid">
            <span>查看服务与定价</span>
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 shrink-0 opacity-90" />
          </NuxtLink>
          <UButton
            to="/about"
            size="lg"
            color="neutral"
            variant="ghost"
            class="text-highlighted hover:bg-black/5 dark:hover:bg-white/5">
            关于我
          </UButton>
        </div>
      </template>

      <template #default>
        <div class="flex w-full flex-col gap-3">
          <div
            class="surface-soft flex items-center justify-between gap-4 rounded-xl px-4 py-3 sm:px-5">
            <span class="font-display text-2xl font-bold tabular-nums text-primary sm:text-3xl">100W</span>
            <span class="text-right font-mono-site text-[10px] leading-snug text-muted uppercase tracking-wider">
              首阶段<br />财务目标
            </span>
          </div>
          <div
            class="surface-soft flex items-center justify-between gap-4 rounded-xl px-4 py-3 sm:px-5">
            <span class="font-display text-2xl font-bold text-primary sm:text-3xl">∞</span>
            <span class="text-right font-mono-site text-[10px] leading-snug text-muted uppercase tracking-wider">
              一人公司<br />无限可能
            </span>
          </div>
          <div
            class="surface-soft flex items-center justify-between gap-4 rounded-xl px-4 py-3 sm:px-5">
            <span class="font-display text-2xl font-bold tabular-nums text-primary sm:text-3xl">3+</span>
            <span class="text-right font-mono-site text-[10px] leading-snug text-muted uppercase tracking-wider">
              全栈技术<br />独立交付
            </span>
          </div>
        </div>
      </template>
    </UPageHero>

    <!-- 核心服务模块 -->
    <section class="site-container py-14 sm:py-20">
      <div class="mb-6 flex items-center gap-3">
        <span
          class="font-mono-site border border-primary/25 px-3 py-1 text-[10px] tracking-[0.2em] text-primary uppercase">
          核心服务模块
        </span>
        <div class="h-px max-w-[80px] flex-1 bg-primary/25" />
      </div>
      <h2 class="font-display text-2xl font-semibold text-highlighted sm:text-3xl md:text-4xl">
        我能为你<span class="text-primary">提供</span>什么
      </h2>
      <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        每一项服务都可对齐交付物与周期；以独立开发者的效率，交付稳定可维护的结果。
      </p>

      <div class="mt-10 grid gap-6 lg:grid-cols-3">
        <div
          v-for="(s, i) in coreServices"
          :key="i"
          class="surface-soft flex flex-col rounded-2xl p-6 sm:p-7">
          <UIcon
            :name="s.icon"
            class="size-8 text-primary" />
          <h3 class="font-display mt-4 text-lg font-semibold text-highlighted sm:text-xl">
            {{ s.name }}
          </h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-muted">
            {{ s.desc }}
          </p>
          <p class="font-mono-site mt-5 text-[10px] tracking-wider text-primary/90 uppercase">
            {{ s.tag }}
          </p>
        </div>
      </div>
    </section>

    <!-- 公开价 -->
    <section class="bg-stone-200/40 py-14 dark:bg-[#0c0c0c] sm:py-16">
      <div class="site-container">
        <h2 class="font-display text-2xl font-semibold text-highlighted sm:text-3xl">
          公开价
        </h2>
        <p class="mt-1 text-sm text-muted">详见服务页；定制开发单独估价。</p>
        <div class="mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div class="surface-soft rounded-2xl p-6 sm:p-7">
            <p class="font-mono-site text-[10px] tracking-[0.2em] text-muted uppercase">按次</p>
            <p class="mt-2 font-display text-4xl font-semibold text-primary">¥199</p>
            <p class="mt-2 text-sm text-muted">单次深度沟通，厘清方向与优先级。</p>
          </div>
          <div class="surface-soft rounded-2xl p-6 sm:p-7">
            <p class="font-mono-site text-[10px] tracking-[0.2em] text-muted uppercase">按月</p>
            <p class="mt-2 font-display text-4xl font-semibold text-primary">¥599</p>
            <p class="mt-2 text-sm text-muted">持续节奏与反馈，适合已在执行的你。</p>
          </div>
        </div>
        <div class="mt-8">
          <NuxtLink
            to="/services"
            class="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
            完整说明与不适合人群
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 博客 · 认知输出 -->
    <section class="site-container py-14 sm:py-20">
      <div class="mb-6 flex items-center gap-3">
        <span
          class="font-mono-site border border-primary/25 px-3 py-1 text-[10px] tracking-[0.2em] text-primary uppercase">
          博客 · 认知输出
        </span>
        <div class="h-px max-w-[80px] flex-1 bg-primary/25" />
      </div>
      <h2 class="font-display text-2xl font-semibold text-highlighted sm:text-3xl md:text-4xl">
        思考即<span class="text-primary">资产</span>
      </h2>
      <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        记录创业认知、技术实战与底层思考；更多长文可通过公众号获取。
      </p>

      <div
        v-if="blogPosts?.length"
        class="mt-10 grid gap-6 lg:grid-cols-3">
        <NuxtLink
          v-for="(post, i) in blogPosts"
          :key="post.path"
          :to="post.path"
          class="group surface-soft flex flex-col rounded-2xl p-6 transition-colors hover:bg-stone-200/50 dark:hover:bg-zinc-800/50">
          <span class="font-display text-3xl font-bold text-primary/40 tabular-nums group-hover:text-primary/60">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <span class="font-mono-site mt-3 text-[10px] tracking-widest text-primary uppercase">
            {{ postCategoryLabel(post, i) }}
          </span>
          <h3 class="font-display mt-2 text-lg font-semibold leading-snug text-highlighted group-hover:text-primary">
            {{ post.title }}
          </h3>
          <p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
            {{ post.description }}
          </p>
          <p class="mt-4 font-mono-site text-[10px] text-muted">
            {{ post.date }}
          </p>
        </NuxtLink>
      </div>
      <div
        v-else
        class="mt-10 rounded-2xl border border-dashed border-primary/20 p-10 text-center text-sm text-muted">
        暂无文章，可在 <code class="text-primary">content/blog</code> 中添加 Markdown。
      </div>

      <div class="mt-10">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
          进入博客列表
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4" />
        </NuxtLink>
      </div>
    </section>

    <!-- 开始合作 -->
    <section class="relative overflow-hidden bg-stone-200/50 py-16 dark:bg-[#111111] sm:py-20">
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(201,168,76,0.08),transparent_55%)]" />
      <div class="site-container relative text-center">
        <p class="font-mono-site text-[11px] tracking-[0.25em] text-primary uppercase">
          // 开始合作
        </p>
        <h2 class="font-display mt-4 text-2xl font-semibold tracking-tight text-highlighted sm:text-4xl">
          你有想法，我来实现
        </h2>
        <p class="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
          产品开发、陪跑咨询或深度 1V1，先通过联系页说明需求；亦可直接加微信沟通。
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink
            to="/contact"
            class="btn-gold-solid px-10">
            <span>立即预约合作</span>
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 shrink-0 opacity-90" />
          </NuxtLink>
          <UButton
            to="/services"
            size="lg"
            color="neutral"
            variant="ghost"
            class="text-highlighted">
            先看服务清单
          </UButton>
        </div>
      </div>
    </section>

    <section class="site-container py-14 sm:py-16">
      <SiteWechatBlock />
    </section>
  </div>
</template>
