<script setup lang="ts">
const year = new Date().getFullYear()

const nav = [
  { label: '服务与定价', to: '/services' },
  { label: '博客', to: '/blog' },
  { label: '关于', to: '/about' },
  { label: '联系合作', to: '/contact' },
]
</script>

<template>
  <UFooter
    class="mt-auto bg-stone-100/90 pt-2 dark:bg-[#050505]">
    <template #default>
      <div class="site-container py-12 lg:py-14">
        <div class="grid gap-12 lg:grid-cols-12 lg:gap-8 lg:items-start">
          <!-- 品牌区加宽：lg:7 -->
          <div class="lg:col-span-7">
            <p class="font-display text-2xl font-bold tracking-[0.04em] text-primary sm:text-3xl">
              秘术云阁
            </p>
            <p class="mt-5 max-w-xl text-[15px] leading-[1.75] text-muted">
              一人公司产品化与创业陪跑：全栈能交付，咨询能对齐节奏。适合想独立变现、需要外部反馈的个人。
            </p>
          </div>

          <div class="lg:col-span-5">
            <p class="font-mono-site mb-4 text-[10px] tracking-[0.22em] text-muted uppercase">
              导航
            </p>
            <ul class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:max-w-md">
              <li v-for="link in nav" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  class="text-default transition-colors hover:text-primary">
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="site-gold-line mx-auto max-w-6xl opacity-70" />

      <div class="site-container flex flex-col items-center gap-3 py-8 text-center sm:items-start sm:text-left">
        <p class="font-mono-site text-[11px] text-muted">
          © {{ year }} 秘术云阁 · 个人品牌站点
        </p>
        <p class="font-mono-site max-w-2xl text-[10px] leading-relaxed text-muted">
          本站不展示经营主体信息；合作细节以沟通确认为准。
        </p>
      </div>
    </template>
  </UFooter>
</template>
