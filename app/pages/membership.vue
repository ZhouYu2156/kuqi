<script setup lang="ts">
definePageMeta({
  layout: 'jk',
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
    <h1 class="jk-heading mb-3 text-center text-3xl font-bold">会员与权益</h1>
    <p class="mb-10 text-center text-sm text-gray-400">
      非会员每日可免费试听 10 首；超出后需开通会员以继续畅听、下载与观看视频课。
    </p>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 class="mb-1 text-lg font-semibold text-(--jk-primary)">月度会员</h2>
        <p class="mb-4 text-3xl font-bold text-white">
          ¥12<span class="text-base font-normal text-gray-500"> / 月</span>
        </p>
        <ul class="space-y-2 text-sm text-gray-300">
          <li>· 音乐畅听与下载</li>
          <li>· 视频教程观看</li>
        </ul>
        <p class="mt-6 text-xs text-gray-500">支付对接上线后在此完成开通（占位）。</p>
      </div>

      <div class="rounded-2xl border border-(--jk-ring) bg-(--jk-primary-soft) p-6">
        <h2 class="mb-1 text-lg font-semibold text-(--jk-primary)">年度会员</h2>
        <p class="mb-4 text-3xl font-bold text-white">
          详询定价<span class="text-base font-normal text-gray-500"> / 年</span>
        </p>
        <ul class="space-y-2 text-sm text-gray-200">
          <li>· 包含月度会员全部权益</li>
          <li>· 思维成长、认知提升等扩展资料</li>
        </ul>
        <p class="mt-6 text-xs text-gray-500">年度档位具体价格与资料包以实际上线为准。</p>
      </div>
    </div>

    <div class="mt-10 text-center">
      <NuxtLink
        to="/music"
        class="text-sm text-(--jk-primary) underline-offset-4 hover:underline">
        返回音乐页
      </NuxtLink>
    </div>
  </div>
</template>
