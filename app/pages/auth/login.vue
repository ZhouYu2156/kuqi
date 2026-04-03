<script setup lang="ts">
import type { AuthTokenData } from '~~/shared/types/api/auth'
import { ResponseCode } from '~~/shared/types'
import { greetingMessage } from '~~/shared/utils'

/** 勾选「记住我」后持久化邮箱（仅邮箱，不保存密码） */
const REMEMBER_LOGIN_EMAIL_KEY = 'company:remember-login-email'

definePageMeta({
  middleware: ['guest'],
})

useHead({
  title: '登录',
})

const { api } = useApi()
const auth = useAuthUser()
const route = useRoute()

const state = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const rememberMe = ref(false)

onMounted(() => {
  if (!import.meta.client) return
  try {
    const saved = localStorage.getItem(REMEMBER_LOGIN_EMAIL_KEY)
    if (saved) {
      state.email = saved
      rememberMe.value = true
    }
  } catch {
    /* 隐私模式等 */
  }
})

async function onSubmit() {
  loading.value = true
  try {
    const res = await api<AuthTokenData>('/api/auth/login', {
      method: 'POST',
      body: {
        email: state.email.trim(),
        password: state.password,
      },
    })
    if (res.code === ResponseCode.Success) {
      if (import.meta.client) {
        try {
          if (rememberMe.value) {
            localStorage.setItem(REMEMBER_LOGIN_EMAIL_KEY, state.email.trim())
          } else {
            localStorage.removeItem(REMEMBER_LOGIN_EMAIL_KEY)
          }
        } catch {
          /* ignore */
        }
      }
      auth.value = {
        token: res.data.token,
        user: res.data.user,
      }
      const raw = route.query.redirect
      const redirect = typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard'
      await navigateTo(redirect)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <JKAuthShell
    title="登录"
    :description="`${greetingMessage()}，欢迎回来`">
    <UForm
      :state="state"
      class="space-y-4"
      @submit.prevent="onSubmit">
      <UFormField
        label="邮箱"
        name="email"
        required>
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="请输入注册邮箱"
          icon="i-lucide-mail"
          size="lg"
          class="w-full" />
      </UFormField>

      <UFormField
        label="密码"
        name="password"
        required>
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="current-password"
          placeholder="请输入密码"
          icon="i-lucide-lock"
          size="lg"
          class="w-full" />
      </UFormField>

      <div class="flex flex-wrap items-center justify-between gap-2 text-sm">
        <UCheckbox
          label="记住我"
          v-model="rememberMe" />
        <span class="text-dimmed cursor-not-allowed text-xs">忘记密码？（功能未开放，敬请期待）</span>
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        class="font-medium"
        :loading="loading">
        登录
      </UButton>
    </UForm>

    <template #footer>
      <span class="text-muted">还没有账号？</span>
      <NuxtLink
        to="/auth/register"
        class="text-primary ms-1 font-medium hover:underline">
        去注册
      </NuxtLink>
    </template>
  </JKAuthShell>
</template>
