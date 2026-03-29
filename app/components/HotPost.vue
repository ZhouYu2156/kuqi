<script setup lang="ts">
import type { Post } from '~/types'

const posts = [
  {
    id: 1,
    title: '普通人翻身，必须知道的社会底层运行逻辑',
    author: '觉醒者',
    created_at: '2022-01-01 12:00:00',
    published_at: '2022-01-02 12:00:00',
    updated_at: '2022-01-03 12:00:00',
    tags: ['社会', '底层', '逻辑'],
    is_deleted: false,
  },
  {
    id: 2,
    title: '规则体系里，永远不会告诉你的真实内幕',
    author: '布衣书生',
    created_at: '2022-01-04 12:00:00',
    published_at: '2022-01-05 12:00:00',
    updated_at: '2022-01-06 12:00:00',
    tags: ['规则', '体系', '内幕'],
    is_deleted: false,
  },
] as Post[]
</script>

<template>
  <section class="panel-container">
    <div class="panel-title">🔥 认知与内幕热帖</div>
    <ul class="panel-list panel-box mb-4">
      <li
        v-for="post in posts"
        :key="post.id">
        <NuxtLink :href="`/forum/${post.id}`">
          {{ post.title }}
        </NuxtLink>
        <br /><span class="text-xs text-old-muted">作者：{{ post.author }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss"></style>
