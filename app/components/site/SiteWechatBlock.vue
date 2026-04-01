<script setup lang="ts">
withDefaults(
  defineProps<{
    showHint?: boolean
  }>(),
  { showHint: true },
)
</script>

<template>
  <div class="surface-soft rounded-2xl p-6 sm:p-8">
    <h3 class="font-display text-xl font-semibold text-highlighted sm:text-2xl">
      微信与公众号
    </h3>
    <p
      v-if="showHint"
      class="mt-3 max-w-lg text-sm leading-relaxed text-muted">
      合作与咨询加个人微信；长文与更新关注公众号「程序员皮蛋鸽鸽」。
    </p>

    <div class="mt-8">
      <SiteQrPair variant="default" />
    </div>
  </div>
</template>
