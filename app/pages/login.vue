<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ResponseCode, type UnionResponse } from '~~/shared/types/common'

definePageMeta({
  layout: 'jk',
})

useHead({
  title: '登录',
})

const tab = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const password2 = ref('')
const otp = ref('')
const loading = ref(false)
const sending = ref(false)
const cooldown = ref(0)

const { login, register } = useAuth()
const router = useRouter()
const config = useRuntimeConfig()

let timer: ReturnType<typeof setInterval> | null = null

function startCooldown(sec: number) {
  cooldown.value = sec
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

async function sendCode() {
  const em = email.value.trim().toLowerCase()
  if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    ElMessage.warning('请先填写有效邮箱')
    return
  }
  sending.value = true
  try {
    const res = await $fetch<UnionResponse<{ devCode?: string; sent?: boolean; waitSec?: number } | null>>(
      '/api/auth/send-register-code',
      {
        method: 'POST',
        body: { email: em },
        credentials: 'include',
      },
    )
    if (res.code === ResponseCode.Success) {
      ElMessage.success(res.message || '验证码已发送')
      if (config.public.exposeRegisterCode && res.data?.devCode) {
        ElMessage.info(`开发环境验证码：${res.data.devCode}`)
      }
      startCooldown(60)
    }
    else {
      ElMessage.error(res.message || '发送失败')
      if (res.code === ResponseCode.TooManyRequests && res.data?.waitSec) {
        startCooldown(res.data.waitSec)
      }
    }
  }
  catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'data' in e
      ? (e as { data?: { message?: string } }).data?.message
      : undefined
    ElMessage.error(msg || '发送失败')
  }
  finally {
    sending.value = false
  }
}

async function onLogin() {
  if (!email.value.trim() || !password.value) {
    ElMessage.warning('请输入邮箱与密码')
    return
  }
  loading.value = true
  try {
    const res = await login(email.value.trim(), password.value)
    if (res.code === ResponseCode.Success) {
      ElMessage.success(res.message || '登录成功')
      await router.push('/')
    }
    else {
      ElMessage.error(res.message || '登录失败')
    }
  }
  catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'data' in e
      ? (e as { data?: { message?: string } }).data?.message
      : undefined
    ElMessage.error(msg || '请求失败')
  }
  finally {
    loading.value = false
  }
}

async function onRegister() {
  const em = email.value.trim().toLowerCase()
  if (!em || !password.value) {
    ElMessage.warning('请填写邮箱与密码')
    return
  }
  if (password.value.length < 6) {
    ElMessage.warning('密码至少 6 位')
    return
  }
  if (password.value !== password2.value) {
    ElMessage.warning('两次密码不一致')
    return
  }
  if (!/^\d{4}$/.test(otp.value)) {
    ElMessage.warning('请填写 4 位邮箱验证码')
    return
  }
  loading.value = true
  try {
    const res = await register(em, password.value, otp.value)
    if (res.code === ResponseCode.Success) {
      ElMessage.success(res.message || '注册成功')
      await router.push('/')
    }
    else {
      ElMessage.error(res.message || '注册失败')
    }
  }
  catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'data' in e
      ? (e as { data?: { message?: string } }).data?.message
      : undefined
    ElMessage.error(msg || '请求失败')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
    <div
      class="auth-page w-full max-w-[420px] rounded-2xl border border-zinc-200/90 bg-white/90 p-8 shadow-xl shadow-zinc-900/5 backdrop-blur-sm dark:border-white/10 dark:bg-(--jk-bg-dark-elevated) dark:shadow-black/40">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {{ tab === 'login' ? '登录账号' : '注册账号' }}
        </h1>
        <p class="mt-2 text-sm text-zinc-500 dark:text-gray-400">
          JK 知识站 · 音乐与教程 · 会员权益
        </p>
      </div>

      <div
        class="mb-8 flex rounded-xl border border-zinc-200 p-1 dark:border-white/10">
        <button
          type="button"
          class="flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors"
          :class="tab === 'login'
            ? 'bg-(--jk-primary-soft) text-(--jk-primary)'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-gray-400 dark:hover:text-gray-200'"
          @click="tab = 'login'">
          登录
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors"
          :class="tab === 'register'
            ? 'bg-(--jk-primary-soft) text-(--jk-primary)'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-gray-400 dark:hover:text-gray-200'"
          @click="tab = 'register'">
          注册
        </button>
      </div>

      <el-form
        v-if="tab === 'login'"
        label-position="top"
        class="auth-form"
        @submit.prevent="onLogin">
        <el-form-item label="邮箱">
          <el-input
            v-model="email"
            type="email"
            autocomplete="username"
            size="large"
            placeholder="you@example.com" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="password"
            type="password"
            autocomplete="current-password"
            show-password
            size="large"
            placeholder="至少 6 位" />
        </el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          size="large"
          class="mt-2! w-full"
          :loading="loading"
          :style="{ background: 'var(--jk-primary)', borderColor: 'var(--jk-primary)' }">
          登录
        </el-button>
      </el-form>

      <div v-else class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm text-zinc-600 dark:text-gray-400">邮箱</label>
          <el-input
            v-model="email"
            type="email"
            autocomplete="email"
            size="large"
            placeholder="you@example.com" />
        </div>
        <div class="register-otp">
          <div class="mb-2 flex min-h-8 items-center justify-between gap-3">
            <label class="m-0 shrink-0 text-sm leading-none text-zinc-600 dark:text-gray-400">邮箱验证码</label>
            <button
              type="button"
              class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-[filter,box-shadow] hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              :disabled="sending || cooldown > 0"
              :style="{ background: 'var(--jk-primary)' }"
              @click="sendCode">
              <template v-if="sending">
                <span class="size-3.5 shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>发送中</span>
              </template>
              <span v-else>{{ cooldown > 0 ? `${cooldown}s 后可重发` : '发送验证码' }}</span>
            </button>
          </div>
          <AuthOtpDigits v-model="otp" />
          <p class="mt-2 text-xs text-zinc-400 dark:text-gray-500">
            生产环境将发到邮箱；开发环境可在响应或控制台查看验证码。
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm text-zinc-600 dark:text-gray-400">密码</label>
          <el-input
            v-model="password"
            type="password"
            autocomplete="new-password"
            show-password
            size="large"
            placeholder="至少 6 位" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm text-zinc-600 dark:text-gray-400">确认密码</label>
          <el-input
            v-model="password2"
            type="password"
            autocomplete="new-password"
            show-password
            size="large"
            placeholder="再次输入密码" />
        </div>
        <el-button
          type="primary"
          size="large"
          class="w-full"
          :loading="loading"
          :style="{ background: 'var(--jk-primary)', borderColor: 'var(--jk-primary)' }"
          @click="onRegister">
          注册并登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-form :deep(.el-form-item__label) {
  color: inherit;
}

/* 跟随主题色：输入框聚焦 / 悬停边框；主按钮悬停（覆盖 Element 默认主色） */
.auth-page {
  --el-input-focus-border-color: var(--jk-primary);
  --el-input-hover-border-color: color-mix(in oklab, var(--jk-primary) 42%, var(--el-border-color));
}

.auth-page :deep(.el-input__wrapper) {
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

.dark .auth-page {
  --el-input-bg-color: var(--jk-input-surface-dark);
}

.auth-page :deep(.el-button--primary) {
  --el-button-bg-color: var(--jk-primary);
  --el-button-border-color: var(--jk-primary);
  --el-button-outline-color: var(--jk-ring);
  background-color: var(--jk-primary) !important;
  border-color: var(--jk-primary) !important;
  transition:
    filter 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.auth-page :deep(.el-button--primary:hover:not(.is-disabled)) {
  filter: brightness(1.1);
  box-shadow: 0 4px 14px color-mix(in oklab, var(--jk-primary) 35%, transparent);
}

.auth-page :deep(.el-button--primary:active:not(.is-disabled)) {
  filter: brightness(0.94);
}
</style>
