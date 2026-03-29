<script setup lang="ts">
import type { RareResource } from '~/types'

const resources: RareResource[] = [
  {
    id: 1,
    title: '底层逆袭思维合集（绝版电子书）',
    content:
      '《秘术云阁》是一本关于云计算、区块链、人工智能、机器学习、深度学习、数据分析、编程语言等领域的综合性书籍。',
    credit: 10,
  },
]
</script>

<template>
  <section class="panel-container">
    <div class="panel-title mb-2">📚 绝版资源</div>
    <ul class="panel-list panel-box">
      <li
        v-for="item in resources"
        :key="item.id"
        class="panel-item">
        <NuxtLink :to="`/resource/${item.id}`">{{ item.title }}</NuxtLink>
        <br /><span class="text-xs text-old-muted">积分：{{ item.credit }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss"></style>
