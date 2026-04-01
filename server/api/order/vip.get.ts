import { UnionResponseResult } from '~~/shared/utils'

/** 查询用户订单状态 */
export default defineEventHandler(async (event) => {
  // 1. 获取请求体
  const query = getQuery<{ out_trade_no: string }>(event)
  // 2. 创建订单
  const response = await queryWxOrderStatus({ out_trade_no: query.out_trade_no })

  // 3. 响应
  return UnionResponseResult(response, '正在查询订单状态！')
})
