<script setup lang="ts">
import { MemberVipType } from '~~/shared/types/db/order'

const props = withDefaults(
  defineProps<{
    /** 已开通：金黄高亮对应套餐并置于左侧；null 时与音乐页一致的引导样式（主推年度在右） */
    activeVipType?: MemberVipType | null
    /** 个人中心非会员时展示「立即开通会员」 */
    showSubscribeCta?: boolean
  }>(),
  {
    activeVipType: null,
    showSubscribeCta: false,
  },
)

const { open: openMembershipModal } = useMembershipPaywall()

const monthlyBenefits = ['即刻听全站畅听与下载权益', '个人中心专属身份标识', '新功能优先体验资格']

const yearlyBenefits = [
  '包含「月度会员」全部权益',
  '折合月均更省，性价比更高',
  '年度专属客服优先响应',
  '会员期内重大更新零加价',
]

const isSubscriber = computed(() => props.activeVipType != null)

const cardOrder = computed(() => {
  if (props.activeVipType === MemberVipType.Monthly) return ['monthly', 'yearly'] as const
  if (props.activeVipType === MemberVipType.Yearly) return ['yearly', 'monthly'] as const
  return ['monthly', 'yearly'] as const
})

function isFeatured(plan: 'monthly' | 'yearly'): boolean {
  if (!isSubscriber.value) return plan === 'yearly'
  return props.activeVipType === (plan === 'monthly' ? MemberVipType.Monthly : MemberVipType.Yearly)
}

function badgeFor(plan: 'monthly' | 'yearly'): string | null {
  if (!isFeatured(plan)) return null
  return isSubscriber.value ? '当前套餐' : '更推荐'
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-highlighted flex items-center gap-2 text-lg font-semibold tracking-tight">
        <UIcon
          name="i-lucide-crown"
          class="size-6 shrink-0 text-amber-500" />
        会员权益
      </h2>
    </div>

    <div class="grid gap-5 md:grid-cols-2 md:items-stretch">
      <template
        v-for="plan in cardOrder"
        :key="plan">
        <!-- 高亮卡片（金黄）：引导态主推年度，或已开通用户当前套餐 -->
        <div
          v-if="isFeatured(plan)"
          class="membership-featured-card membership-featured-card--glow relative flex h-full min-h-[280px] flex-col overflow-visible rounded-xl border-2 border-amber-400/90 bg-transparent p-1 dark:border-amber-400/80 md:min-h-[280px]">
          <UBadge
            v-if="badgeFor(plan)"
            color="warning"
            variant="solid"
            size="md"
            class="absolute right-4 top-4 z-10 font-semibold shadow-md">
            {{ badgeFor(plan) }}
          </UBadge>
          <div
            class="flex flex-1 flex-col rounded-[10px] border border-amber-200/25 bg-linear-to-br from-amber-500/16 via-amber-500/8 to-transparent p-5 backdrop-blur-sm dark:border-amber-500/20 dark:from-amber-400/14 dark:via-amber-500/6 dark:to-transparent dark:bg-(--ui-bg-elevated)/85">
            <template v-if="plan === 'monthly'">
              <div class="mb-4 flex items-center gap-2 pr-24">
                <UIcon
                  name="i-lucide-calendar-days"
                  class="text-muted size-7" />
                <div>
                  <p class="text-highlighted text-lg font-bold tracking-tight">月度会员</p>
                  <p class="text-xs font-medium text-amber-600/90 dark:text-amber-300/90">轻量体验 · 按月灵活</p>
                </div>
              </div>
              <ul class="text-default space-y-2.5 text-sm leading-relaxed">
                <li
                  v-for="(line, i) in monthlyBenefits"
                  :key="i"
                  class="flex gap-2">
                  <UIcon
                    name="i-lucide-check"
                    class="mt-0.5 size-4 shrink-0 text-amber-500 dark:text-amber-400" />
                  <span>{{ line }}</span>
                </li>
              </ul>
              <div class="mt-5 border-t border-amber-200/40 pt-4 dark:border-amber-500/25">
                <code class="text-xs text-amber-700/80 dark:text-amber-200/80">
                  至尊会员 · {{ greetingMessage() }}
                </code>
              </div>
            </template>
            <template v-else>
              <div class="mb-4 flex items-center gap-2 pr-24">
                <UIcon
                  name="i-lucide-award"
                  class="size-7 text-amber-500 dark:text-amber-400" />
                <div>
                  <p class="text-highlighted text-lg font-bold tracking-tight">年度会员</p>
                  <p class="text-xs font-medium text-amber-600/90 dark:text-amber-300/90">长周期更省心 · 权益拉满</p>
                </div>
              </div>
              <ul class="text-default space-y-2.5 text-sm leading-relaxed">
                <li
                  v-for="(line, i) in yearlyBenefits"
                  :key="i"
                  class="flex gap-2">
                  <UIcon
                    name="i-lucide-sparkles"
                    class="mt-0.5 size-4 shrink-0 text-amber-500 dark:text-amber-400" />
                  <span>{{ line }}</span>
                </li>
              </ul>
              <div class="mt-5 border-t border-amber-200/40 pt-4 dark:border-amber-500/25">
                <code class="text-xs text-amber-700/80 dark:text-amber-200/80">
                  各位吴彦祖、刘亦菲们，请我吃个猪脚饭吧
                </code>
              </div>
            </template>
          </div>
        </div>

        <!-- 次要卡片：描边浅色 -->
        <UCard
          v-else
          :ui="{
            root: 'border-default bg-elevated/30 flex h-full flex-col',
          }">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                :name="plan === 'monthly' ? 'i-lucide-calendar-days' : 'i-lucide-award'"
                class="text-muted size-5" />
              <span class="font-medium">{{ plan === 'monthly' ? '月度会员' : '年度会员' }}</span>
            </div>
          </template>
          <ul class="text-muted space-y-2.5 text-sm leading-relaxed">
            <li
              v-for="(line, i) in plan === 'monthly' ? monthlyBenefits : yearlyBenefits"
              :key="i"
              class="flex gap-2">
              <UIcon
                :name="plan === 'monthly' ? 'i-lucide-check' : 'i-lucide-sparkles'"
                class="text-primary mt-0.5 size-4 shrink-0" />
              <span>{{ line }}</span>
            </li>
          </ul>
          <div class="border-default mt-5 border-t pt-4">
            <code class="text-muted text-xs"> 各位吴彦祖、刘亦菲们，请我喝瓶水吧 </code>
          </div>
        </UCard>
      </template>
    </div>

    <div
      v-if="showSubscribeCta"
      class="flex flex-col items-center gap-2 pt-1 sm:flex-row sm:justify-center">
      <UButton
        color="primary"
        size="lg"
        icon="i-lucide-crown"
        class="font-semibold"
        @click="openMembershipModal = true">
        来开个会员吧~
      </UButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* 推荐 / 至尊会员高亮卡：外层光晕 + 强对比呼吸阴影 */
.membership-featured-card--glow {
  isolation: isolate;
}

/** 贴边约 2–4px：外扩 2px + 较大模糊；transform-origin 避免 scale 呼吸时视觉跳变 */
.membership-featured-card--glow::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -2px;
  border-radius: inherit;
  pointer-events: none;
  transform-origin: center center;
  background: radial-gradient(
    ellipse 98% 98% at 50% 50%,
    transparent 56%,
    rgba(253, 224, 71, 0.42) 69%,
    rgba(251, 191, 36, 0.14) 76%,
    transparent 82%
  );
  filter: blur(8px);
  opacity: 0.76;
  animation: membership-aura-breathe 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
}

.membership-featured-card {
  will-change: box-shadow, border-color;
  animation: membership-card-breathe 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  box-shadow:
    0 0 3px 0 rgba(245, 158, 11, 0.35),
    0 0 6px 1px rgba(251, 191, 36, 0.22),
    0 0 0 1px rgba(253, 224, 71, 0.28),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.12);
}

:global(.dark) .membership-featured-card {
  box-shadow:
    0 0 3px 0 rgba(251, 191, 36, 0.28),
    0 0 7px 1px rgba(245, 158, 11, 0.2),
    0 0 0 1px rgba(252, 211, 77, 0.22),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
  animation-name: membership-card-breathe-dark;
}

:global(.dark) .membership-featured-card--glow::before {
  background: radial-gradient(
    ellipse 96% 96% at 50% 50%,
    transparent 58%,
    rgba(251, 191, 36, 0.34) 71%,
    rgba(245, 158, 11, 0.1) 78%,
    transparent 84%
  );
  animation-name: membership-aura-breathe-dark;
}

@keyframes membership-aura-breathe {
  0%,
  100% {
    opacity: 0.52;
    transform: scale(0.992);
  }
  50% {
    opacity: 0.92;
    transform: scale(1.008);
  }
}

@keyframes membership-aura-breathe-dark {
  0%,
  100% {
    opacity: 0.42;
    transform: scale(0.992);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.006);
  }
}

@keyframes membership-card-breathe {
  0%,
  100% {
    box-shadow:
      0 0 2px 0 rgba(245, 158, 11, 0.28),
      0 0 5px 1px rgba(251, 191, 36, 0.18),
      0 0 10px 2px rgba(253, 224, 71, 0),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
    border-color: rgba(251, 191, 36, 0.65);
  }
  50% {
    box-shadow:
      0 0 4px 0 rgba(245, 158, 11, 0.48),
      0 0 8px 2px rgba(251, 191, 36, 0.34),
      0 0 10px 3px rgba(253, 224, 71, 0.14),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.16);
    border-color: rgba(252, 211, 77, 1);
  }
}

@keyframes membership-card-breathe-dark {
  0%,
  100% {
    box-shadow:
      0 0 2px 0 rgba(251, 191, 36, 0.22),
      0 0 5px 1px rgba(245, 158, 11, 0.16),
      0 0 10px 2px rgba(251, 191, 36, 0),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.06);
    border-color: rgba(245, 158, 11, 0.62);
  }
  50% {
    box-shadow:
      0 0 4px 0 rgba(251, 191, 36, 0.4),
      0 0 8px 2px rgba(245, 158, 11, 0.3),
      0 0 10px 3px rgba(251, 191, 36, 0.12),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.12);
    border-color: rgba(253, 224, 71, 0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .membership-featured-card--glow::before {
    animation: none;
    opacity: 0.75;
    transform: none;
  }

  .membership-featured-card {
    animation: none;
    box-shadow:
      0 0 3px 0 rgba(245, 158, 11, 0.38),
      0 0 7px 1px rgba(251, 191, 36, 0.26),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
  }

  :global(.dark) .membership-featured-card {
    box-shadow:
      0 0 3px 0 rgba(251, 191, 36, 0.32),
      0 0 7px 1px rgba(245, 158, 11, 0.24),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
  }
}
</style>
