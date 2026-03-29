<template>
  <div>
    <div class="box-old mb-3">
      <div class="panel-title mb-2">🔑 用户登录</div>
      <div class="flex items-center gap-2 text-sm flex-wrap">
        用户名：<input class="border border-old-border p-1 w-28" /> 密码：<input
          type="password"
          class="border border-old-border p-1 w-28" />
        <button class="btn-old">登录</button>
        <NuxtLink href="/user/register">注册账号</NuxtLink>
      </div>
    </div>

    <div class="panel-title mb-2">🔥 认知与翻身秘术</div>
    <ul class="list-old box-old mb-4">
      <li>
        <NuxtLink href="/forum/1">普通人想要翻身，必须先撕掉身上的“弱者标签”</NuxtLink>
        <br />
        <span class="text-old-muted text-xs">作者：觉醒者 · 2025-03-20</span>
      </li>
    </ul>

    <div class="panel-title mb-2">📚 绝版数字资源</div>
    <ul class="list-old box-old">
      <li>
        <NuxtLink href="/resource/1">绝版：底层逆袭思维合集（电子书）</NuxtLink>
        <br />
        <span class="text-old-muted text-xs">积分：10</span>
      </li>
    </ul>
  </div>
</template>
