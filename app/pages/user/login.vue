<template>
  <div>
    <div class="panel-title mb-4">🔐 用户登录</div>
    <div class="panel-box">
      <div class="mb-6">
        <label class="block mb-3 text-base">用户名</label>
        <el-input
          class="w-72"
          placeholder="请输入用户名" />
      </div>

      <div class="mb-7">
        <label class="block mb-3 text-base">密码</label>
        <el-input
          type="password"
          class="w-72"
          placeholder="请输入密码" />
      </div>

      <div class="flex items-center gap-4">
        <el-button type="primary">登录</el-button>
        <NuxtLink to="/user/register">
          <el-button link>注册账号</el-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
