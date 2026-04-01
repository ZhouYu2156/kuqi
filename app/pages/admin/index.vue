<script setup lang="ts">
definePageMeta({
  layout: 'jk',
  middleware: ['admin'],
})

const { user } = useAuth()
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <h1 class="jk-heading mb-2 text-2xl font-bold">管理后台</h1>
    <p class="mb-8 text-sm text-gray-400">
      当前登录：<span class="text-(--jk-primary)">{{ user?.email }}</span>（管理员）
    </p>

    <section class="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h2 class="mb-4 text-lg font-semibold text-gray-200">用户管理</h2>
      <p class="text-sm text-gray-500">
        后续可在此接入用户列表、角色调整、会员到期与订单查询；当前为占位页面。
      </p>
    </section>
  </div>
</template>
