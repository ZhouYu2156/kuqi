<script setup lang="ts">
import type { AuthTokenData, SendEmailCodeData } from '~~/shared/types/api/auth'
import { ResponseCode } from '~~/shared/types'
import { SEO_PAGE_DESCRIPTION } from '~~/shared/constants/seo'

definePageMeta({
  middleware: ['guest'],
})

usePageSeo({
  title: '注册',
  description: SEO_PAGE_DESCRIPTION.register,
  noindex: true,
})

const toast = useToast()
const { api } = useApi()
const auth = useAuthUser()

/** 与后端 register.post 校验一致 */
const USERNAME_RE = /^[\w\u4e00-\u9fa5]{2,32}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_CODE_RE = /^\d{6}$/
const PHONE_CN_RE = /^1\d{10}$/

const state = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  emailCode: '',
})

const agreedToTerms = ref(false)
const loading = ref(false)

const cooldownSec = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null
const sendingCode = ref(false)

onUnmounted(() => {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = null
  }
})

function startCooldown(sec: number) {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = null
  }
  cooldownSec.value = sec
  cooldownTimer = setInterval(() => {
    cooldownSec.value -= 1
    if (cooldownSec.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

async function sendEmailCode() {
  if (cooldownSec.value > 0 || sendingCode.value) return
  const email = state.email.trim().toLowerCase()
  if (!email) {
    toast.add({
      title: '请先填写邮箱',
      color: 'warning',
      icon: 'i-lucide-mail-warning',
    })
    return
  }
  if (!EMAIL_RE.test(email)) {
    toast.add({
      title: '请先填写有效邮箱',
      color: 'warning',
      icon: 'i-lucide-mail-warning',
    })
    return
  }
  sendingCode.value = true
  try {
    const res = await api<SendEmailCodeData>('/api/auth/send-email-code', {
      method: 'POST',
      body: { email },
    })
    if (res.code === ResponseCode.Success) {
      startCooldown(60)
      toast.add({
        title: res.message,
        description: '请查收邮件中的 6 位验证码',
        color: 'success',
        icon: 'i-lucide-mail-check',
      })
    }
  } finally {
    sendingCode.value = false
  }
}

function validateForm(): string | null {
  if (!agreedToTerms.value) {
    return '请阅读并同意服务条款与隐私政策'
  }
  const username = state.username.trim()
  if (!USERNAME_RE.test(username)) {
    return '用户名为 2～32 位，可为字母、数字、下划线或中文'
  }
  const email = state.email.trim().toLowerCase()
  if (!EMAIL_RE.test(email)) {
    return '邮箱格式不正确'
  }
  if (!EMAIL_CODE_RE.test(state.emailCode.trim())) {
    return '请输入 6 位数字邮箱验证码'
  }
  if (state.password.length < 8) {
    return '密码至少 8 位'
  }
  if (state.password !== state.confirmPassword) {
    return '两次输入的密码不一致'
  }
  const phone = state.phone.trim()
  if (phone && !PHONE_CN_RE.test(phone)) {
    return '手机号需为 11 位中国大陆号码'
  }
  return null
}

async function onSubmit() {
  const err = validateForm()
  if (err) {
    toast.add({ title: err, color: 'warning', icon: 'i-lucide-circle-alert' })
    return
  }

  loading.value = true
  try {
    const res = await api<AuthTokenData>('/api/auth/register', {
      method: 'POST',
      body: {
        username: state.username.trim(),
        email: state.email.trim().toLowerCase(),
        password: state.password,
        emailCode: state.emailCode.trim(),
        ...(state.phone.trim() ? { phone: state.phone.trim() } : {}),
      },
    })
    if (res.code === ResponseCode.Success) {
      auth.value = {
        token: res.data.token,
        user: res.data.user,
      }
      toast.add({ title: res.message, color: 'success', icon: 'i-lucide-party-popper' })
      await navigateTo('/dashboard')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <JKAuthShell
    title="创建账号"
    description="填写基本信息并完成邮箱验证">
    <UForm
      :state="state"
      class="space-y-4"
      @submit.prevent="onSubmit">
      <UFormField
        label="用户名"
        name="username"
        required>
        <UInput
          v-model="state.username"
          type="text"
          autocomplete="username"
          placeholder="2～32 位，字母数字下划线或中文"
          icon="i-lucide-at-sign"
          size="lg"
          class="w-full" />
      </UFormField>

      <UFormField
        label="邮箱"
        name="email"
        required>
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="name@example.com"
          icon="i-lucide-mail"
          size="lg"
          class="w-full" />
      </UFormField>

      <UFormField
        label="手机号（选填）"
        name="phone">
        <UInput
          v-model="state.phone"
          type="tel"
          autocomplete="tel"
          maxlength="11"
          placeholder="11 位中国大陆手机号"
          icon="i-lucide-smartphone"
          size="lg"
          class="w-full" />
      </UFormField>

      <UFormField
        label="邮箱验证码"
        name="emailCode"
        required>
        <div class="flex w-full gap-2">
          <UInput
            v-model="state.emailCode"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="6 位数字"
            icon="i-lucide-shield-check"
            size="lg"
            class="min-w-0 flex-1" />
          <UButton
            type="button"
            color="neutral"
            variant="soft"
            size="lg"
            class="shrink-0 px-3 sm:px-4"
            :disabled="cooldownSec > 0 || sendingCode"
            :loading="sendingCode"
            @click="sendEmailCode">
            {{ cooldownSec > 0 ? `${cooldownSec}s` : '获取验证码' }}
          </UButton>
        </div>
      </UFormField>

      <UFormField
        label="密码"
        name="password"
        required>
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="new-password"
          placeholder="至少 8 位，含字母与数字"
          icon="i-lucide-lock"
          size="lg"
          class="w-full" />
      </UFormField>

      <UFormField
        label="确认密码"
        name="confirmPassword"
        required>
        <UInput
          v-model="state.confirmPassword"
          type="password"
          autocomplete="new-password"
          placeholder="再次输入密码"
          icon="i-lucide-lock-keyhole"
          size="lg"
          class="w-full" />
      </UFormField>

      <UCheckbox
        v-model="agreedToTerms"
        label="我已阅读并同意《服务条款》与《隐私政策》"
        class="text-muted" />

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        class="font-medium"
        :loading="loading"
        :disabled="loading">
        注册
      </UButton>
    </UForm>

    <template #footer>
      <span class="text-muted">已有账号？</span>
      <NuxtLink
        to="/auth/login"
        class="text-primary ms-1 font-medium hover:underline">
        去登录
      </NuxtLink>
    </template>
  </JKAuthShell>
</template>
