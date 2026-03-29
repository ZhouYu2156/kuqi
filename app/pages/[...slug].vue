<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  console.log(route.path)
  return queryCollection('content').path(route.path).first()
})
</script>

<template>
  <div>
    <header>导航栏</header>

    <ContentRenderer
      v-if="page"
      :value="page" />

    <footer>页脚</footer>
  </div>
</template>
