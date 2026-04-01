import type { CreateWxOrderParams, UnionResponse } from '~~/shared/types'

// 创建微信支付订单请求体
export type CreateWxOrderBody = Pick<CreateWxOrderParams, 'description' | 'out_trade_no' | 'notify_url' | 'amount'>

// 创建微信支付订单响应体 -> 支付二维码URL
export type OrderCreateResponse = UnionResponse<{ code_url: string }>
