<script setup lang="ts">
useHead({
  title: '即刻听',
})
</script>

<template>
  <UContainer class="max-w-7xl">
    <UPage>
      <UPageHeader
        title="即 刻 听"
        description="海量音乐，一键搜索"
        :ui="{
          root: 'border-b-0',
          title: 'font-Quicksand-Bold text-3xl md:text-4xl lg:text-5xl',
          container: 'mt-6 md:mt-8 lg:mt-12 flex flex-col items-center',
          description: 'font-ZKKuaiLeTi',
        }">
      </UPageHeader>
      <UPageBody class="space-y-0">
        <JKDonateDialog />
        <JKKugouSearch />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
