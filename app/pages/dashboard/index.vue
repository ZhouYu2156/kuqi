<script setup lang="ts">
import { MemberVipType } from '~~/shared/types/db/order'
import { UserStatus } from '~~/shared/types/db/user'
import { formatDateTimeZh } from '~~/shared/utils'

definePageMeta({
  middleware: ['auth'],
})

import { SEO_PAGE_DESCRIPTION } from '~~/shared/constants/seo'

usePageSeo({
  title: '个人中心',
  description: SEO_PAGE_DESCRIPTION.dashboard,
  noindex: true,
})

const auth = useAuthUser()
const user = computed(() => auth.value?.user)

/** 与库表 role 大小写无关（如 VIP / vip） */
const normRole = computed(() =>
  String(user.value?.role ?? '')
    .trim()
    .toLowerCase(),
)

const isVip = computed(() => normRole.value === 'vip')

/** 个人中心：已开通则高亮对应套餐；无成功订单记录时默认按年度展示 */
const membershipHighlight = computed<MemberVipType | null>(() => {
  if (!isVip.value) return null
  return user.value?.membership_vip_type ?? MemberVipType.Yearly
})

const statusLabel: Record<string, string> = {
  [UserStatus.Active]: '正常',
  [UserStatus.Inactive]: '未激活',
  [UserStatus.Locked]: '已锁定',
  [UserStatus.Disabled]: '已禁用',
}
</script>

<template>
  <div
    v-if="user"
    class="space-y-6">
    <JKMembershipBenefits
      :active-vip-type="membershipHighlight"
      :show-subscribe-cta="!isVip" />

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-id-card"
            class="text-primary size-5" />
          <span class="font-medium">基础信息</span>
        </div>
      </template>

      <dl class="grid gap-6 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-muted">用户名</dt>
          <dd class="text-highlighted mt-1 font-medium">{{ user.username }}</dd>
        </div>
        <div>
          <dt class="text-muted">邮箱</dt>
          <dd class="text-highlighted mt-1 font-medium">{{ user.email }}</dd>
        </div>
        <div>
          <dt class="text-muted">账号状态</dt>
          <dd class="text-highlighted mt-1 font-medium">
            {{ statusLabel[user.status] ?? user.status }}
          </dd>
        </div>
        <div>
          <dt class="text-muted">角色</dt>
          <!-- 类名写死在模板中，避免 Tailwind 扫描不到 shared 里动态字符串 -->
          <dd
            v-if="normRole === 'user'"
            class="text-highlighted mt-1">
            普通用户
          </dd>
          <dd
            v-else-if="normRole === 'vip'"
            class="mt-1 font-medium text-amber-500 dark:text-amber-400">
            超级贵族
          </dd>
          <dd
            v-else-if="normRole === 'admin'"
            class="mt-1 font-medium text-blue-600 dark:text-blue-400">
            管理员
          </dd>
          <dd
            v-else
            class="text-highlighted mt-1">
            {{ user.role }}
          </dd>
        </div>
        <div v-if="user.phone">
          <dt class="text-muted">手机号</dt>
          <dd class="text-highlighted mt-1 font-medium">{{ user.phone }}</dd>
        </div>
        <div v-if="user.last_login_at">
          <dt class="text-muted">上次登录</dt>
          <dd class="text-highlighted mt-1 text-sm tabular-nums">
            {{ formatDateTimeZh(user.last_login_at) }}
          </dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
