import { createWxOrder } from '~~/server/utils/weixinApi'
import { CreateWxOrderParams } from '~~/shared/types'
import { UnionResponseResult } from '~~/shared/utils'

export default defineEventHandler(async (event) => {
  // 1. 获取请求体
  const body = await readBody<CreateWxOrderParams>(event)
  // 2. 创建订单
  const response = await createWxOrder({
    description: body.description, // 商品描述
    notify_url: body.notify_url, // 通知前端回调地址
    amount: {
      total: body.amount.total, // 商品金额
    },
  })
  // 3. 响应
  return UnionResponseResult(response, '会员开通成功！')
})
