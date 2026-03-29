<template>
  <div class="nav">
    <NuxtLink href="/">首页</NuxtLink>
    <NuxtLink href="/forum">天涯论坛</NuxtLink>
    <NuxtLink href="/resource">绝版资源</NuxtLink>
    <NuxtLink href="/user/login">登录</NuxtLink>
    <NuxtLink href="/user/register">注册</NuxtLink>
  </div>
</template>

<style scoped>
@reference '~/assets/css/main.css';

.nav {
  @apply bg-old-light px-8 py-2 border-old-border flex gap-4 font-bold font-song;
}
</style>
