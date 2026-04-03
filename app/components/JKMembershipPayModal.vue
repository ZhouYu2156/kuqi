<script setup lang="ts">
import { MEMBERSHIP_PRICE_CENTS, formatPriceYuan } from '~~/shared/constants/membership'
import { ResponseCode } from '~~/shared/types'
import type { AuthUserPayload } from '~~/shared/types/api/auth'
import type { CreateMemberOrderData, OrderPollData } from '~~/shared/types/api/order'
import { MemberVipType, OrderStatus } from '~~/shared/types/db/order'

const isOpen = defineModel<boolean>('open', { default: false })

const { api } = useApi()
const auth = useAuthUser()
const toast = useToast()

type Step = 'pick' | 'pay'
const step = ref<Step>('pick')
const creating = ref(false)
const pollStatus = ref<OrderStatus>(OrderStatus.NOTPAY)
const qrDataUrl = ref('')
const currentOutTradeNo = ref('')
let pollTimer: ReturnType<typeof setInterval> | null = null

const monthlyFeatures = ['即刻听全站畅听与下载', '专属身份标识', '新功能优先体验']
const yearlyFeatures = ['包含月度全部权益', '折合月均更省', '年度专属优先客服', '会员期内重大更新不加价']

/** 支付成功后展示至尊会员庆祝层 */
const celebrateOpen = ref(false)

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

watch(isOpen, (v) => {
  if (!v) {
    stopPolling()
    step.value = 'pick'
    qrDataUrl.value = ''
    currentOutTradeNo.value = ''
    pollStatus.value = OrderStatus.NOTPAY
  }
})

onUnmounted(() => stopPolling())

async function startPay(vipType: MemberVipType) {
  creating.value = true
  try {
    const res = await api<CreateMemberOrderData>('/api/order', {
      method: 'POST',
      body: { vip_type: vipType },
    })
    if (res.code !== ResponseCode.Success) return

    const { code_url, out_trade_no } = res.data
    currentOutTradeNo.value = out_trade_no

    const QRCode = (await import('qrcode')).default
    qrDataUrl.value = await QRCode.toDataURL(code_url, {
      width: 256,
      margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' },
    })

    step.value = 'pay'
    pollStatus.value = OrderStatus.NOTPAY
    await pollOnce()
    startPolling()
  } catch (e) {
    console.error(e)
  } finally {
    creating.value = false
  }
}

async function pollOnce(): Promise<void> {
  if (!currentOutTradeNo.value) return
  const q = encodeURIComponent(currentOutTradeNo.value)
  const res = await api<OrderPollData>(`/api/order?out_trade_no=${q}`, {
    method: 'GET',
    silent: true,
  })
  if (res.code !== ResponseCode.Success || !res.data) return

  pollStatus.value = res.data.orderStatus

  if (res.data.orderStatus === OrderStatus.SUCCESS) {
    stopPolling()
    const me = await api<AuthUserPayload>('/api/user/me', { method: 'GET', silent: true })
    if (me.code === ResponseCode.Success && auth.value?.token) {
      auth.value = { token: auth.value.token, user: me.data }
    }
    isOpen.value = false
    celebrateOpen.value = true
  } else if (
    res.data.orderStatus === OrderStatus.CLOSED ||
    res.data.orderStatus === OrderStatus.PAYERROR ||
    res.data.orderStatus === OrderStatus.REVOKED
  ) {
    stopPolling()
    toast.add({ title: res.data.trade_state_desc || '订单已关闭', color: 'warning' })
  }
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(() => {
    void pollOnce()
  }, 3000)
}

async function chooseMonthly() {
  await startPay(MemberVipType.Monthly)
}

async function chooseYearly() {
  await startPay(MemberVipType.Yearly)
}
</script>

<template>
  <JKCelebrateBeVIP v-model:open="celebrateOpen" />

  <UModal
    v-model:open="isOpen"
    :ui="{ content: 'sm:max-w-3xl' }">
    <template #header>
      <div class="flex w-full min-w-0 items-center justify-between gap-3 pr-1">
        <div class="flex min-w-0 items-center gap-2">
          <UIcon
            name="i-lucide-sparkles"
            class="text-primary size-6 shrink-0" />
          <span class="text-lg font-semibold">开通会员 · 畅享音乐</span>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          square
          class="shrink-0"
          icon="i-lucide-x"
          aria-label="关闭"
          @click="isOpen = false" />
      </div>
    </template>

    <template #body>
      <div
        v-if="step === 'pick'"
        class="space-y-6">
        <p class="text-muted text-center text-sm">
          即刻听高品质曲库需会员身份。
          <br />
          登录用户可下单，微信扫码支付后自动开通。
        </p>

        <!-- 参考双栏定价：左侧年度为主推（更醒目），右侧月度为辅 -->
        <div class="relative grid gap-6 overflow-visible md:grid-cols-2 md:items-stretch md:gap-4 lg:gap-6">
          <!-- 年度：推荐卡片（贴边柔光 + 呼吸过渡） -->
          <div
            class="jk-pay-plan jk-pay-plan--featured-glow border-primary/25 from-primary/12 via-primary/5 relative z-10 flex flex-col overflow-visible rounded-2xl border-2 bg-linear-to-br to-transparent p-6 ring-1 ring-primary/15 md:min-h-[420px] md:scale-[1.02]">
            <UBadge
              color="primary"
              variant="solid"
              class="absolute right-4 top-4 font-semibold">
              更推荐
            </UBadge>
            <p class="text-primary mb-1 text-xs font-semibold uppercase tracking-wide">年度会员</p>
            <div class="mb-2 flex items-baseline gap-1">
              <span class="text-highlighted text-4xl font-bold tabular-nums">
                ¥{{ formatPriceYuan(MEMBERSHIP_PRICE_CENTS.yearly) }}
              </span>
              <span class="text-muted text-sm">/ 年</span>
            </div>
            <p class="text-muted mb-6 text-sm leading-relaxed">适合长期听歌的你，一次开通全年省心，权益拉满。</p>
            <ul class="text-default mb-8 flex-1 space-y-2.5 text-sm">
              <li
                v-for="(t, i) in yearlyFeatures"
                :key="i"
                class="flex gap-2">
                <UIcon
                  name="i-lucide-check"
                  class="text-primary mt-0.5 size-4 shrink-0" />
                <span>{{ t }}</span>
              </li>
            </ul>
            <UButton
              block
              size="xl"
              color="primary"
              class="font-semibold"
              :loading="creating"
              @click="chooseYearly">
              立即开通
            </UButton>
          </div>

          <!-- 月度：普通卡片（无外层发光） -->
          <div
            class="border-default relative z-0 flex flex-col rounded-2xl border bg-elevated/40 p-6 shadow-sm md:min-h-[400px] md:translate-y-1">
            <p class="text-muted mb-1 text-xs font-semibold uppercase tracking-wide">月度会员</p>
            <div class="mb-2 flex items-baseline gap-1">
              <span class="text-highlighted text-3xl font-bold tabular-nums">
                ¥{{ formatPriceYuan(MEMBERSHIP_PRICE_CENTS.monthly) }}
              </span>
              <span class="text-muted text-sm">/ 月</span>
            </div>
            <p class="text-muted mb-6 text-sm leading-relaxed">轻量体验会员权益，随时可续。</p>
            <ul class="text-muted mb-8 flex-1 space-y-2.5 text-sm">
              <li
                v-for="(t, i) in monthlyFeatures"
                :key="i"
                class="flex gap-2">
                <UIcon
                  name="i-lucide-check"
                  class="text-dimmed mt-0.5 size-4 shrink-0" />
                <span>{{ t }}</span>
              </li>
            </ul>
            <UButton
              block
              size="xl"
              color="neutral"
              variant="outline"
              class="font-medium"
              :loading="creating"
              @click="chooseMonthly">
              立即开通
            </UButton>
          </div>
        </div>
      </div>

      <div
        v-else-if="step === 'pay'"
        class="flex flex-col items-center gap-4 py-2">
        <div class="flex flex-col items-center gap-1 text-center">
          <p class="text-highlighted text-lg font-semibold tracking-tight">【义父在上】</p>
        </div>
        <JKQrCode
          v-if="qrDataUrl"
          :qr-code="qrDataUrl"
          :status="pollStatus" />
        <p class="text-muted text-base">【请微信扫码支付】</p>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          @click="step = 'pick'">
          返回选择套餐
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<style scoped lang="scss">
/**
 * 仅「年度 · 更推荐」卡片发光。
 * box-shadow 关键帧必须保持相同层数，否则浏览器无法插值，会表现为「无过渡、硬跳」。
 */
.jk-pay-plan--featured-glow {
  isolation: isolate;
  will-change: box-shadow;
  animation: jk-pay-shadow-year 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  box-shadow:
    0 0 4px 0 rgb(34 197 94 / 0.32),
    0 0 12px 2px rgb(34 197 94 / 0.2),
    0 0 0 0 rgb(34 197 94 / 0),
    inset 0 1px 0 0 rgb(255 255 255 / 0.1);
}

.jk-pay-plan--featured-glow::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -5px;
  border-radius: inherit;
  pointer-events: none;
  transform-origin: center center;
  filter: blur(10px);
  background: radial-gradient(
    ellipse 98% 98% at 50% 50%,
    transparent 50%,
    color-mix(in oklab, var(--ui-primary) 48%, transparent) 66%,
    color-mix(in oklab, var(--ui-primary) 16%, transparent) 76%,
    transparent 84%
  );
  animation: jk-pay-aura-year 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
}

:global(.dark) .jk-pay-plan--featured-glow::before {
  background: radial-gradient(
    ellipse 98% 98% at 50% 50%,
    transparent 50%,
    color-mix(in oklab, var(--ui-primary) 42%, transparent) 66%,
    color-mix(in oklab, var(--ui-primary) 12%, transparent) 78%,
    transparent 86%
  );
}

@keyframes jk-pay-aura-year {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.996);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.01);
  }
}

@keyframes jk-pay-shadow-year {
  0%,
  100% {
    box-shadow:
      0 0 3px 0 rgb(34 197 94 / 0.26),
      0 0 9px 1px rgb(34 197 94 / 0.14),
      0 0 18px 3px rgb(34 197 94 / 0),
      inset 0 1px 0 0 rgb(255 255 255 / 0.08);
  }
  50% {
    box-shadow:
      0 0 6px 0 rgb(34 197 94 / 0.42),
      0 0 16px 4px rgb(34 197 94 / 0.26),
      0 0 24px 6px rgb(34 197 94 / 0.1),
      inset 0 1px 0 0 rgb(255 255 255 / 0.12);
  }
}

@media (prefers-reduced-motion: reduce) {
  .jk-pay-plan--featured-glow::before {
    animation: none;
    opacity: 0.75;
    transform: none;
  }

  .jk-pay-plan--featured-glow {
    animation: none;
    box-shadow:
      0 0 5px 0 rgb(34 197 94 / 0.34),
      0 0 12px 2px rgb(34 197 94 / 0.2),
      0 0 0 0 rgb(34 197 94 / 0),
      inset 0 1px 0 0 rgb(255 255 255 / 0.1);
  }
}
</style>
