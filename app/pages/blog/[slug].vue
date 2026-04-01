<script setup lang="ts">
definePageMeta({
  layout: 'jk',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: post } = await useAsyncData(
  () => `blog-${slug.value}`,
  () => queryCollection('blog').path(`/blog/${slug.value}`).first(),
  { watch: [slug] },
)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '文章未找到',
  })
}

useHead({
  title: post.value.title,
  meta: [{ name: 'description', content: post.value.description || '' }],
})
</script>

<template>
  <article class="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
    <header class="max-w-3xl">
      <UButton
        to="/blog"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        class="-ml-2 mb-8">
        返回列表
      </UButton>
      <time
        v-if="post?.date"
        class="text-sm text-muted tabular-nums">{{ post.date }}</time>
      <h1 class="font-display mt-2 text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
        {{ post?.title }}
      </h1>
      <p
        v-if="post?.description"
        class="mt-4 text-lg text-muted leading-relaxed">
        {{ post.description }}
      </p>
    </header>

    <div class="site-gold-line my-10 max-w-3xl" />

    <div class="max-w-3xl">
      <ContentRenderer
        v-if="post"
        :value="post"
        class="blog-content space-y-4 text-default leading-relaxed [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_li]:list-disc [&_p]:text-muted [&_ul]:space-y-2" />
    </div>

  </article>
</template>

<style scoped>
.blog-content :deep(p) {
  margin-top: 0.75rem;
}
.blog-content :deep(p:first-child) {
  margin-top: 0;
}
</style>
