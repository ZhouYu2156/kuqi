import type { CreateWxOrderParams, UnionResponse } from '~~/shared/types'
import type { MemberVipType, OrderStatus } from '~~/shared/types/db/order'

/** POST /api/order 创建会员支付单 */
export type CreateMemberOrderBody = {
  vip_type: MemberVipType
}

export type CreateMemberOrderData = {
  code_url: string
  out_trade_no: string
  /** 金额（分） */
  amount: number
  description: string
  vip_type: MemberVipType
}

/** GET /api/order 轮询支付状态 */
export type OrderPollData = {
  orderStatus: OrderStatus
  trade_state: string
  trade_state_desc: string
  out_trade_no: string
}

// 创建微信支付订单请求体
export type CreateWxOrderBody = Pick<CreateWxOrderParams, 'description' | 'out_trade_no' | 'notify_url' | 'amount'>

// 创建微信支付订单响应体 -> 支付二维码URL
export type OrderCreateResponse = UnionResponse<{ code_url: string }>

/** 当前用户订单列表项（GET /api/user/orders） */
export type UserOrderItem = {
  id: number
  out_trade_no: string
  /** 金额，单位：分 */
  amount: number
  description: string
  /** 会员套餐类型 */
  vip_type: MemberVipType
  trade_state: number
  transaction_id: string | null
  created_at: string
}

export type UserOrdersData = {
  list: UserOrderItem[]
  /** 符合条件的总条数 */
  total: number
  /** 当前页码（从 1 开始） */
  page: number
  /** 每页条数 */
  pageSize: number
}

export type queryWxOrderStatusResponse = {
  appid: string // 【公众账号ID】商户下单时传入的公众账号ID。
  mchid: string //【商户号】商户下单时传入的商户号。
  out_trade_no: string // 【商户订单号】 商户下单时传入的商户系统内部订单号。
  transaction_id: string // 【微信支付订单号】 微信支付侧订单的唯一标识，订单支付成功后返回。
  trade_state: string /** 【交易状态】 交易状态，详细业务流转状态处理请参考开发指引-订单状态流转图。枚举值：

  SUCCESS：支付成功
  
  REFUND：转入退款
  
  NOTPAY：未支付
  
  CLOSED：已关闭
  
  REVOKED：已撤销（仅付款码支付会返回）
  
  USERPAYING：用户支付中（仅付款码支付会返回）
  
  PAYERROR：支付失败（仅付款码支付会返回） */
  trade_state_desc: string // 【交易状态描述】 对交易状态的详细说明。
}
