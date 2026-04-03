<script setup lang="ts">
const columns = [
  { accessorKey: 'SongName', header: '歌名' },
  { accessorKey: 'SingerName', header: '歌手' },
  { accessorKey: 'actions', header: '操作' },
] as const
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-3 gap-4">
      <p
        v-for="column in columns"
        :key="column.accessorKey"
        class="h-10 w-full border border-default text-center leading-10">
        {{ column.header }}
      </p>
    </div>
    <div
      v-for="i in 9"
      :key="i"
      class="flex justify-center gap-4">
      <div class="flex justify-center w-2/3 gap-4">
        <USkeleton class="h-11 w-full" />
        <USkeleton class="h-11 w-full" />
      </div>
      <div class="flex justify-around w-1/3 gap-4">
        <USkeleton class="h-11 w-full" />
        <USkeleton class="h-11 w-full" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
