import type { MemberVipType } from '~~/shared/types/db/order'

/** 会员套餐标价（分），须与服务端下单校验一致 */
export const MEMBERSHIP_PRICE_CENTS: Record<MemberVipType, number> = {
  monthly: 200,
  yearly: 1600,
}

export function formatPriceYuan(cents: number) {
  return (cents / 100).toFixed(2)
}
