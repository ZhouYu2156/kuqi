<script setup lang="ts">
withDefaults(
  defineProps<{
    /** default：联系页 / 首页区块；compact：页脚窄栏 */
    variant?: 'default' | 'compact'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <div
    :class="[
      'flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-center',
      variant === 'compact' ? 'sm:justify-start lg:justify-end lg:gap-8' : 'lg:gap-12',
    ]">
    <!-- 个人微信：方形码 -->
    <figure class="flex flex-col items-center sm:items-start">
      <div
        :class="[
          'qr-frame qr-frame--square',
          variant === 'compact' ? 'w-28 sm:w-32' : 'w-44 sm:w-48 max-w-[220px]',
        ]">
        <img
          src="/wechat-qrcode.png"
          width="400"
          height="400"
          alt="个人微信二维码，扫码添加"
          class="h-full w-full object-contain"
          loading="lazy" />
      </div>
      <figcaption class="qr-caption max-w-56">
        微信个人号
      </figcaption>
    </figure>

    <!-- 公众号：横版物料，金边容器弱化亮绿与整站冲突 -->
    <figure class="flex w-full max-w-md flex-col items-center sm:items-start lg:max-w-lg">
      <div
        :class="[
          'qr-frame qr-frame--banner w-full',
          variant === 'compact' ? 'max-w-[240px] sm:max-w-[260px]' : 'max-w-md lg:max-w-lg',
        ]">
        <img
          src="/wechat-official-account-qrcode.png"
          width="800"
          height="400"
          alt="微信公众号：程序员皮蛋鸽鸽，微信搜一搜"
          class="w-full object-contain"
          loading="lazy" />
      </div>
      <figcaption class="qr-caption mt-3 max-w-full text-center sm:text-left">
        公众号 · 程序员皮蛋鸽鸽
      </figcaption>
      <p
        v-if="variant === 'default'"
        class="mt-1 max-w-md text-center text-xs text-muted sm:text-left">
        微信内搜一搜「程序员皮蛋鸽鸽」亦可关注
      </p>
    </figure>
  </div>
</template>
