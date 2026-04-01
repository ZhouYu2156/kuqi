<script setup lang="ts">
definePageMeta({
  layout: 'jk',
})

useHead({
  title: '博客',
})

const { data: posts, error } = await useAsyncData('blog-list', () =>
  queryCollection('blog').order('date', 'DESC').all(),
)

if (error.value) {
  console.error(error.value)
}
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
    <UPageHeader
      title="博客"
      description="创业认知、一人公司方法与实践记录。更多长文可通过公众号获取。" />

    <ul
      v-if="posts?.length"
      class="mt-12 divide-y divide-primary/15">
      <li
        v-for="post in posts"
        :key="post.path">
        <NuxtLink
          :to="post.path"
          class="flex flex-col gap-2 py-8 transition-colors first:pt-4 hover:text-primary sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2 class="font-display text-xl font-semibold text-highlighted">
              {{ post.title }}
            </h2>
            <p
              v-if="post.description"
              class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
              {{ post.description }}
            </p>
          </div>
          <time
            v-if="post.date"
            class="shrink-0 text-sm text-muted tabular-nums">{{ post.date }}</time>
        </NuxtLink>
      </li>
    </ul>

    <div
      v-else
      class="mt-12 rounded-lg border border-dashed border-primary/25 p-12 text-center text-muted">
      暂无文章。请在 <code class="text-primary">content/blog/</code> 下添加 Markdown。
    </div>

  </div>
</template>
