<script setup lang="ts">
import { ResponseCode } from '~~/shared/types'
import type { UserOrdersData } from '~~/shared/types/api/order'
import { MemberVipType, OrderStatus } from '~~/shared/types/db/order'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: '历史订单 — 个人中心',
})

const { api } = useApi()

const PAGE_SIZE = 5

const pending = ref(true)
const orders = ref<UserOrdersData['list']>([])
const page = ref(1)
const total = ref(0)

const stateLabel: Record<number, string> = {
  [OrderStatus.SUCCESS]: '支付成功',
  [OrderStatus.REFUND]: '已退款',
  [OrderStatus.NOTPAY]: '未支付',
  [OrderStatus.CLOSED]: '已关闭',
  [OrderStatus.REVOKED]: '已撤销',
  [OrderStatus.USERPAYING]: '支付中',
  [OrderStatus.PAYERROR]: '支付失败',
}

function formatAmount(cents: number) {
  return `¥${(cents / 100).toFixed(2)}`
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('zh-CN', { hour12: false })
  } catch {
    return iso
  }
}

function vipTypeLabel(t: (typeof MemberVipType)[keyof typeof MemberVipType] | string) {
  if (t === MemberVipType.Yearly || t === 'yearly') return '年度'
  if (t === MemberVipType.Monthly || t === 'monthly') return '月度'
  return String(t)
}

async function loadOrders() {
  pending.value = true
  try {
    const qs = new URLSearchParams({
      page: String(page.value),
      pageSize: String(PAGE_SIZE),
    })
    const res = await api<UserOrdersData>(`/api/user/orders?${qs.toString()}`, { method: 'GET' })
    if (res.code === ResponseCode.Success) {
      orders.value = res.data.list
      total.value = res.data.total
    }
  } finally {
    pending.value = false
  }
}

watch(page, () => {
  void loadOrders()
})

onMounted(() => {
  void loadOrders()
})
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-receipt"
          class="text-primary size-5" />
        <span class="font-medium">历史订单</span>
      </div>
    </template>

    <div
      v-if="pending"
      class="text-muted flex items-center justify-center gap-2 py-16 text-sm">
      <UIcon
        name="i-lucide-loader-2"
        class="size-5 animate-spin" />
      加载中…
    </div>

    <div
      v-else-if="!orders.length"
      class="text-muted py-12 text-center text-sm">
      暂无订单记录
    </div>

    <div
      v-else
      class="overflow-x-auto">
      <table class="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr class="border-default text-muted border-b">
            <th class="pb-3 pr-4 font-medium">订单号</th>
            <th class="pb-3 pr-4 font-medium">说明</th>
            <th class="pb-3 pr-4 font-medium">套餐</th>
            <th class="pb-3 pr-4 font-medium">金额</th>
            <th class="pb-3 pr-4 font-medium">状态</th>
            <th class="pb-3 font-medium">创建时间</th>
          </tr>
        </thead>
        <tbody class="divide-default divide-y">
          <tr
            v-for="row in orders"
            :key="row.id">
            <td class="text-highlighted py-3 pr-4 font-mono text-xs">{{ row.out_trade_no }}</td>
            <td
              class="text-default max-w-[200px] truncate py-3 pr-4"
              :title="row.description">
              {{ row.description || '—' }}
            </td>
            <td class="py-3 pr-4">
              <UBadge
                :color="row.vip_type === 'yearly' ? 'warning' : 'neutral'"
                variant="subtle"
                size="sm">
                {{ vipTypeLabel(row.vip_type) }}
              </UBadge>
            </td>
            <td class="py-3 pr-4 font-medium">{{ formatAmount(row.amount) }}</td>
            <td class="py-3 pr-4">
              <UBadge
                :color="row.trade_state === OrderStatus.SUCCESS ? 'success' : 'neutral'"
                variant="subtle"
                size="sm">
                {{ stateLabel[row.trade_state] ?? `状态${row.trade_state}` }}
              </UBadge>
            </td>
            <td class="text-muted py-3 font-mono text-xs">{{ formatTime(row.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="total > PAGE_SIZE"
      class="flex justify-end border-default border-t pt-4">
      <UPagination
        v-model:page="page"
        :items-per-page="PAGE_SIZE"
        :total="total"
        :sibling-count="1"
        :disabled="pending" />
    </div>
  </UCard>
</template>
