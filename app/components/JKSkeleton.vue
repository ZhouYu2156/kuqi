<script setup lang="ts">
const { rows } = defineProps<{ rows: number }>()
</script>

<template>
  <!-- 骨架屏 -->
  <el-skeleton
    animated
    :loading="true">
    <template #template>
      <div class="w-full h-10">
        <el-skeleton-item style="width: 100%; height: 30px" />
      </div>

      <div
        v-for="row in rows"
        :key="row"
        class="w-full grid grid-cols-3 gap-8 py-4">
        <el-skeleton-item
          variant="text"
          class="h-7!" />
        <el-skeleton-item
          variant="text"
          class="h-7!" />
        <div class="flex justify-evenly gap-2">
          <el-skeleton-item
            variant="text"
            class="h-7!" />
          <el-skeleton-item
            variant="text"
            class="h-7!" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>
