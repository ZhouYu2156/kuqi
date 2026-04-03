import { OrderStatus } from '~~/shared/types/db/order'

/** 微信支付查询返回的 trade_state 字符串 → 本地 OrderStatus */
export function wxTradeStateToOrderStatus(s: string): OrderStatus {
  switch (s) {
    case 'SUCCESS':
      return OrderStatus.SUCCESS
    case 'REFUND':
      return OrderStatus.REFUND
    case 'NOTPAY':
      return OrderStatus.NOTPAY
    case 'CLOSED':
      return OrderStatus.CLOSED
    case 'REVOKED':
      return OrderStatus.REVOKED
    case 'USERPAYING':
      return OrderStatus.USERPAYING
    case 'PAYERROR':
      return OrderStatus.PAYERROR
    default:
      return OrderStatus.NOTPAY
  }
}
